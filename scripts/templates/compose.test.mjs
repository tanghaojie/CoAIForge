import assert from 'node:assert/strict'
import { existsSync, mkdtempSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { compose } from './compose.mjs'
import { checkDocs } from '../docs/check.mjs'
import { checkModules } from '../architecture/check-modules.mjs'
import { projectRoot, readJson } from '../lib/project.mjs'
import { removeTemporary } from '../lib/testing.mjs'

test('all combinations contain only selected workspaces and fresh project history', async function (t) {
  const directory = mkdtempSync(join(tmpdir(), 'coaiforge-compose-'))
  t.after(function cleanup() {
    removeTemporary(directory)
  })
  for (const preset of ['frontend', 'backend', 'fullstack']) {
    const target = join(directory, preset)
    await compose({ target, preset, name: `sample-${preset}`, withLock: false })
    assert.equal(existsSync(join(target, 'apps/frontend')), preset !== 'backend')
    assert.equal(existsSync(join(target, 'apps/backend')), preset !== 'frontend')
    assert.equal(existsSync(join(target, 'packages/api-contract')), preset === 'fullstack')
    for (const path of ['.githooks', 'bin', '.module-boundaries.json', 'scripts/cli'])
      assert.equal(existsSync(join(target, path)), false, path)
    assert.ok(existsSync(join(target, 'scripts/git/hooks/pre-commit')))
    assert.ok(existsSync(join(target, 'scripts/architecture/module-boundaries.json')))
    assert.equal(readJson(join(target, 'docs/archive/archive-ledger.json')).baseline, null)
    assert.deepEqual(checkDocs(target), [])
    assert.deepEqual(checkModules(target), [])
    assert.equal(readJson(join(target, '.template-manifest.json')).cliVersion, null)
    const pkg = readJson(join(target, 'package.json'))
    assert.equal(Object.hasOwn(pkg, 'packageManager'), false)
    assert.equal(Object.hasOwn(pkg, 'devEngines'), false)
    assert.deepEqual(pkg.engines, readJson(join(projectRoot, 'package.json')).engines)
    const dependencyDoc = readFileSync(join(target, 'docs/reference/dependencies.md'), 'utf8')
    assert.ok(dependencyDoc.includes(`Node ${pkg.engines.node}`))
    assert.ok(dependencyDoc.includes(`pnpm ${pkg.engines.pnpm}`))
    assert.equal(readFileSync(join(target, '.node-version'), 'utf8').trim(), '22')
    if (preset !== 'backend')
      assert.ok(
        readFileSync(join(target, 'apps/frontend/src/App.vue'), 'utf8').includes(
          `sample-${preset}`,
        ),
      )
    assert.ok(!readFileSync(join(target, 'AGENTS.md'), 'utf8').includes('scope:'))
    if (preset === 'backend')
      assert.equal(
        readJson(join(target, 'apps/backend/package.json')).dependencies[
          '@sample-backend/api-contract'
        ],
        undefined,
      )
    await assert.rejects(compose({ target, preset, name: 'overwrite', withLock: false }), /empty/)
  }
})

test('bad names and absent presets fail before writing', async function () {
  await assert.rejects(
    compose({ target: 'unused', preset: 'frontend', name: '../escape', withLock: false }),
    /Project name/,
  )
  await assert.rejects(
    compose({ target: 'unused', preset: 'other', name: 'sample', withLock: false }),
    /Preset/,
  )
})
