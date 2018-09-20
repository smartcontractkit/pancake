module.exports = function(app) {
  const sellsController = require('../controllers/sellsController')

  app.route('/sells')
    .post(sellsController.create)
}
