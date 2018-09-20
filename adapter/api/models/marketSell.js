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

class MarketSell {
  constructor(symbol, amount) {
    this.symbol = symbol
    this.amount = amount
  }

  async execute() {
    const order = await exchangeAdapter.createMarketSellOrder(
      exchangeSymbol(this.symbol),
      this.amount
    )
    return await exchangeAdapter.fetchOrder(order.id)
  }
}

module.exports = MarketSell
