const express = require('express')
const app = express()

const routes = require('./api/routes/tradesRoutes')
routes(app)

module.exports = app
