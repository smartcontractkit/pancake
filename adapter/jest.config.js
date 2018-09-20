const replayer = require('replayer')

if (process.env.DEBUG) {
  replayer.configure({
    verbose: true,
    debug: true
  })
}

replayer.filter({
  url: /trades/,
  urlFilter: url => url.replace(/:[0-9]+/, '')
})

const sensitive = ['GDAX_API_PASSPHRASE', 'GDAX_API_KEY', 'GDAX_API_SECRET']
sensitive.forEach(s => {
  replayer.substitute(
    '***',
    () => process.env[s]
  )
})
