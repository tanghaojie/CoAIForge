const assert = require('node:assert/strict')
const { test } = require('node:test')
const { buildApp } = require('../dist/app.js')
const { HealthService } = require('../dist/modules/health/health.service.js')
const { HttpException } = require('@nestjs/common')
const {
  healthResponseSchema,
  failureResponseSchema,
  errorCodes,
} = require('{{PACKAGE_SCOPE}}/api-contract/health')

test('health responds over HTTP and matches the published contract', async function () {
  const app = await buildApp()
  try {
    await app.listen(0, '127.0.0.1')
    const response = await fetch(`${await app.getUrl()}/health`)
    assert.equal(response.status, 200)
    const health = healthResponseSchema.parse(await response.json())
    assert.equal(health.data.status, 'ok')
    assert.ok(Math.abs(Date.now() - Date.parse(health.data.timestamp)) < 5000)
    const missing = await app.inject({ method: 'GET', url: '/missing' })
    assert.equal(missing.statusCode, 404)
    assert.equal(failureResponseSchema.parse(missing.json()).status, errorCodes.notFound)
  } finally {
    await app.close()
  }
})

test('internal health failure returns a sanitized contract error', async function () {
  const app = await buildApp()
  try {
    app.get(HealthService).getHealth = function fail() {
      throw new Error('private failure detail')
    }
    const response = await app.inject({ method: 'GET', url: '/health' })
    assert.equal(response.statusCode, 500)
    assert.deepEqual(failureResponseSchema.parse(response.json()), {
      status: errorCodes.internal,
      err: 'Internal server error',
    })
  } finally {
    await app.close()
  }
})

test('HTTP exception mapping preserves the registered business response convention', async function () {
  const app = await buildApp()
  try {
    for (const [status, expectedHttp, expectedCode] of [
      [400, 200, errorCodes.requestRejected],
      [401, 401, errorCodes.unauthorized],
      [503, 500, errorCodes.internal],
    ]) {
      app.get(HealthService).getHealth = function fail() {
        throw new HttpException('internal detail', status)
      }
      const response = await app.inject({ method: 'GET', url: '/health' })
      assert.equal(response.statusCode, expectedHttp)
      assert.equal(failureResponseSchema.parse(response.json()).status, expectedCode)
    }
  } finally {
    await app.close()
  }
})
