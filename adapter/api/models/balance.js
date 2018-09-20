const exchangeAdapter = require('../../config/exchangeAdapter')

class Balance {
  async eth() {
    const result = await exchangeAdapter.fetchBalance()
    return result.ETH
  }
}

module.exports = Balance
