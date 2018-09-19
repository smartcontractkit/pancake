module.exports = function(app) {
  const tradesController = require('../controllers/tradesController')

  app.route('/trades')
    .get(tradesController.index)
    .post(tradesController.create)
}
