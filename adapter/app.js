require('./config/settings')
const express = require('express')
const bodyParser = require("body-parser")
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

const sellsRoutes = require('./api/routes/sellsRoutes')
sellsRoutes(app)

module.exports = app
