const app = require('./app')
const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log('pancake-trader RESTful API server started on: ' + port)
})

