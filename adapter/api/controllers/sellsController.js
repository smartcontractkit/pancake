const fetch = require('node-fetch')
const { camelizeKeys } = require('humps')
const {
  BALANCE_TIMEOUT,
  POLL_BALANCE_EVERY,
  CHAINLINK_NODE_BASE_URL,
  BRIDGE_RESPONSE_TOKEN
} = require('../../config/settings')
const Balance = require('../models/balance')
const MarketSell = require('../models/marketSell')
const exchangeAdapter = require('../../config/exchangeAdapter')

const unixNow = () => (+(new Date()))
const logSuccess = message => console.log(`✔✔✔ ${message}`)
const logError = message => console.log(`!!! ${message}`)
const logPending = message => console.log(`... ${message}`)
const logMessage = message => console.log(`--- ${message}`)

const sendBridgeResponse = (jobRunId, body) => {
  const url = `${CHAINLINK_NODE_BASE_URL}/v2/runs/${jobRunId}`
  const mergedBody = Object.assign({jobRunId: jobRunId}, body)

  fetch(
    url,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BRIDGE_RESPONSE_TOKEN}`
      },
      body: JSON.stringify(mergedBody)
    }
  )
}

const sendOrderConfirmation = (jobRunId, {size, filledSize, fillFees, executedValue}) => {
  sendBridgeResponse(
    jobRunId,
    {
      data: {
        size: size,
        filledSize: filledSize,
        fillFees: fillFees,
        executedValue: executedValue
      },
      pending: false
    }
  )
}

const sendError = (jobRunId, message) => {
  sendBridgeResponse(
    jobRunId,
    {
      error: message,
      pending: false
    }
  )
}

const sendTimeoutError = jobRunId => sendError(
  jobRunId,
  `Timed out after ${BALANCE_TIMEOUT}ms waiting for ETH balance to sell`
)

const sellBalance = (jobRunId, startedAt) => {
  return async function f() {
    const balance = new Balance()
    const eth = await balance.eth()

    if (eth.free > 0) {
      const sell = new MarketSell('eth_usd', eth.free)
      const order = await sell.execute()

      if (order.status === 'closed') {
        const info = camelizeKeys(order.info)
        logSuccess(`Successfully sold ${info.filledSize} ETH`)
        sendOrderConfirmation(jobRunId, info)
      } else {
        const message = `Unhandled order status: ${JSON.stringify(fetchedOrder)}`
        logError(message)
        sendError(jobRunId, message)
      }
    } else {
      logPending(`No ETH balance to sell. Check balance again in ${POLL_BALANCE_EVERY}ms`)

      if (unixNow() - startedAt >= BALANCE_TIMEOUT) {
        logError('Timed out waiting for ETH balance to confirm')
        sendTimeoutError(jobRunId)
      } else {
        setTimeout(f, POLL_BALANCE_EVERY)
      }
    }
  }
}

exports.create = async function (req, res) {
  const jobRunId = req.body.id

  if (jobRunId) {
    logMessage(`Received sell request for job run id: ${jobRunId}`)

    const startedAt = unixNow()
    await sellBalance(jobRunId, startedAt)()

    res.statusCode = 202
    res.json({
      jobRunId: jobRunId,
      pending: true
    })
  } else {
    errorMsg = `Received sell request without a job run id in params: '${JSON.stringify(req.body)}'. No ETH will be sold`
    logError(errorMsg)

    res.statusCode = 422
    res.json({
      jobRunId: jobRunId,
      error: errorMsg
    })
  }
}
