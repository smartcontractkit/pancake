const {
  BALANCE_TIMEOUT,
  POLL_BALANCE_EVERY
} = require('../../config/settings')
const Balance = require('../models/balance')
const Sell = require('../models/sell')

const unixNow = () => (+(new Date()))

const sellBalance = startedAt => {
  return async function f() {
    const balance = new Balance()
    const eth = await balance.eth()

    if (eth.free > 0) {
      const sell = new Sell('eth_usd', eth.free)

      sell.execute()
    } else {
      console.log(`*** No ETH balance to sell. Check balance again in ${POLL_BALANCE_EVERY}ms ***`)

      if (unixNow() - startedAt >= BALANCE_TIMEOUT) {
        console.log('*** Timed out waiting for ETH balance to confirm ***')
      } else {
        setTimeout(f, POLL_BALANCE_EVERY)
      }
    }
  }
}

exports.create = async function (req, res) {
  const startedAt = unixNow()
  await sellBalance(startedAt)()

  res.statusCode = 202
  res.send()
}
