const ccxt = require ('ccxt')
const gdax = new ccxt.gdax({
  apiKey: process.env.GDAX_API_KEY,
  secret: process.env.GDAX_API_SECRET,
  password: process.env.GDAX_API_PASSPHRASE
})
gdax.urls.api = gdax.urls.test

module.exports = gdax
