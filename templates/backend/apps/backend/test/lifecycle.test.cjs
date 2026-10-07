const assert = require('node:assert/strict')
const { test } = require('node:test')
const { buildApp } = require('../dist/app.js')

test('empty backend starts, listens and closes without preset routes', async function () {
  const app = await buildApp()
  try {
    await app.listen(0, '127.0.0.1')
    const response = await fetch(`${await app.getUrl()}/`)
    assert.equal(response.status, 404)
    assert.equal((await app.inject({ method: 'GET', url: '/health' })).statusCode, 404)
  } finally {
    await app.close()
  }
})
