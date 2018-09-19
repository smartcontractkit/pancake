const request = require('supertest')
const app = require('../app')

describe('Trade', () => {
  test('returns the current balance of ETH in the account', async () => {
    const response = await request(app).get('/trades')

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response.text)).toEqual({
      free: 1000,
      used: 0,
      total: 1000
    })
  })
})
