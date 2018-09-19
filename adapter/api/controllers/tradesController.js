const EthBalance = require('../models/ethBalance')

exports.index = async function (req, res) {
  const ethBalance = new EthBalance()
  await ethBalance.fetch()

  res.json({
    free: ethBalance.free,
    used: ethBalance.used,
    total: ethBalance.total
  })
};

exports.create = function (req, res) {
  res.json({action: 'TODO: create...'})
};
