const exchangeAdapter = require('../config/exchangeAdapter')

class EthBalance {
  constructor() {
    this.free = 0
    this.used = 0
    this.total = 0
  }

  async fetch() {
    const result = await exchangeAdapter.fetchBalance()
    this.free = result.ETH.free
    this.used = result.ETH.used
    this.total = result.ETH.total
  }
}

module.exports = EthBalance
