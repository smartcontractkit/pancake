const express = require('express')
const app = express()
const port = process.env.PORT || 3000

const routes = require('./api/routes/tradesRoutes')
routes(app)

app.listen(port)

console.log('pancake-trader RESTful API server started on: ' + port)
