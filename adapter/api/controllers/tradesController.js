const ccxt = require ('ccxt')

const gdax = new ccxt.gdax({
  apiKey: process.env.GDAX_API_KEY,
  secret: process.env.GDAX_API_SECRET,
  password: process.env.GDAX_API_PASSPHRASE
})
gdax.urls.api = gdax.urls.test

exports.index = async function (req, res) {
  const result = await gdax.fetchBalance()

  res.json({result: result})
};

exports.create = function (req, res) {
  res.json({action: 'TODO: create...'})
};
