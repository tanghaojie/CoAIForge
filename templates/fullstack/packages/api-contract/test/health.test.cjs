const assert = require('node:assert/strict')
const { test } = require('node:test')
const {
  healthResponseSchema,
  failureResponseSchema,
} = require('{{PACKAGE_SCOPE}}/api-contract/health')

test('ESM and CommonJS exports resolve to actual runnable artifacts', async function () {
  const esm = await import('{{PACKAGE_SCOPE}}/api-contract/health')
  const valid = { status: 0, data: { status: 'ok', timestamp: new Date().toISOString() } }
  assert.deepEqual(esm.healthResponseSchema.parse(valid), healthResponseSchema.parse(valid))
})

test('built contract rejects invalid status, timestamp and unexpected fields', function () {
  const valid = { status: 0, data: { status: 'ok', timestamp: '2026-10-07T00:00:00.000Z' } }
  assert.equal(healthResponseSchema.safeParse(valid).success, true)
  assert.equal(healthResponseSchema.safeParse({ ...valid, status: 1 }).success, false)
  assert.equal(
    healthResponseSchema.safeParse({ ...valid, data: { status: 'ok', timestamp: 'invalid' } })
      .success,
    false,
  )
  assert.equal(healthResponseSchema.safeParse({ ...valid, extra: true }).success, false)
  assert.equal(failureResponseSchema.safeParse({ status: 0, err: 'failed' }).success, false)
  assert.equal(failureResponseSchema.safeParse({ status: 1, err: '' }).success, false)
})
