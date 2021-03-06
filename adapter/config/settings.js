const BALANCE_TIMEOUT = parseInt(process.env.BALANCE_TIMEOUT, 10) || 60000
const POLL_BALANCE_EVERY = parseInt(process.env.POLL_BALANCE_EVERY, 10) || 100
const CHAINLINK_NODE_BASE_URL = process.env.CHAINLINK_NODE_BASE_URL || 'http://localhost:6688'
const BRIDGE_RESPONSE_TOKEN = process.env.BRIDGE_RESPONSE_TOKEN

if (!BRIDGE_RESPONSE_TOKEN) {
  throw 'env var BRIDGE_RESPONSE_TOKEN is required'
}

module.exports = {
  BALANCE_TIMEOUT: BALANCE_TIMEOUT,
  POLL_BALANCE_EVERY: POLL_BALANCE_EVERY,
  CHAINLINK_NODE_BASE_URL: CHAINLINK_NODE_BASE_URL,
  BRIDGE_RESPONSE_TOKEN: BRIDGE_RESPONSE_TOKEN
}
