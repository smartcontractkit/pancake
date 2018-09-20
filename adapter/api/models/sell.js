const exchangeAdapter = require('../../config/exchangeAdapter')

const normalizeSymbol = s => {
  return s.
    replace('/', '').
    replace('-', '').
    replace('_', '').
    toLowerCase()
}

const exchangeSymbol = symbol => {
  const normalized =  normalizeSymbol(symbol)
  return exchangeAdapter.symbols.find(s => normalizeSymbol(s) === normalized)
}

class Sell {
  constructor(symbol, amount) {
    this.symbol = symbol
    this.amount = amount
  }

  async execute() {
    await exchangeAdapter.createMarketSellOrder(
      exchangeSymbol(this.symbol),
      this.amount
    )
  }
}

module.exports = Sell
