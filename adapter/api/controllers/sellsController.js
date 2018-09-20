const {
  BALANCE_TIMEOUT,
  POLL_BALANCE_EVERY
} = require('../../config/settings')
const Balance = require('../models/balance')
const Sell = require('../models/sell')

const unixNow = () => (+(new Date()))

const logSuccess = message => console.log(`✔✔✔ ${message}`)
const logError = message => console.log(`!!! ${message}`)
const logPending = message => console.log(`... ${message}`)
const logMessage = message => console.log(`--- ${message}`)

const sellBalance = startedAt => {
  return async function f() {
    const balance = new Balance()
    const eth = await balance.eth()

    if (eth.free > 0) {
      const sell = new Sell('eth_usd', eth.free)

      sell.execute()
      logSuccess(`Successfully sold ${eth.free} ETH`)
    } else {
      logPending(`No ETH balance to sell. Check balance again in ${POLL_BALANCE_EVERY}ms`)

      if (unixNow() - startedAt >= BALANCE_TIMEOUT) {
        logError('Timed out waiting for ETH balance to confirm')
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
    await sellBalance(startedAt)()

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
