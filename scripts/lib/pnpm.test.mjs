import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, symlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'

const moduleUrl = new URL('./pnpm.mjs', import.meta.url).href

function invoke(root, entry, args, extraEnv = {}) {
  const env = { ...process.env, ...extraEnv }
  if (entry) env.npm_execpath = entry
  else delete env.npm_execpath
  return spawnSync(
    process.execPath,
    [
      '--input-type=module',
      '--eval',
      `import { runPnpm } from ${JSON.stringify(moduleUrl)};
       process.stdout.write(runPnpm(process.cwd(), ${JSON.stringify(args)}, { quiet: true }));`,
    ],
    { cwd: root, env, encoding: 'utf8', windowsHide: true },
  )
}

for (const extension of ['mjs', 'cjs']) {
  test(`JavaScript ${extension} launcher preserves arguments and working directory`, function (t) {
    const root = mkdtempSync(join(tmpdir(), 'pnpm-launcher-'))
    t.after(function cleanup() {
      rmSync(root, { recursive: true, force: true })
    })
    const entry = join(root, `fake pnpm.${extension}`)
    writeFileSync(
      entry,
      'console.log(JSON.stringify({ args: process.argv.slice(2), cwd: process.cwd() }))',
    )
    const args = ['install', '--frozen-lockfile', 'argument with spaces', 'literal & value']
    const result = invoke(root, entry, args)
    assert.equal(result.status, 0, result.stderr)
    assert.deepEqual(JSON.parse(result.stdout), { args, cwd: root })
  })
}

test('native npm_execpath runs directly, including extensionless Unix executables', function (t) {
  const root = mkdtempSync(join(tmpdir(), 'pnpm-launcher-'))
  t.after(function cleanup() {
    rmSync(root, { recursive: true, force: true })
  })
  const result = invoke(root, process.execPath, ['--version'])
  assert.equal(result.status, 0, result.stderr)
  assert.equal(result.stdout.trim(), process.version)
})

test(
  'PATH discovery runs an extensionless Unix native executable',
  {
    skip: process.platform === 'win32',
  },
  function (t) {
    const root = mkdtempSync(join(tmpdir(), 'pnpm-launcher-'))
    t.after(function cleanup() {
      rmSync(root, { recursive: true, force: true })
    })
    symlinkSync(process.execPath, join(root, 'pnpm'))
    const result = invoke(root, null, ['--version'], { PATH: `${root}:${process.env.PATH}` })
    assert.equal(result.status, 0, result.stderr)
    assert.equal(result.stdout.trim(), process.version)
  },
)

test('launcher propagates a failing child and its diagnostics', function (t) {
  const root = mkdtempSync(join(tmpdir(), 'pnpm-launcher-'))
  t.after(function cleanup() {
    rmSync(root, { recursive: true, force: true })
  })
  const entry = join(root, 'failure.cjs')
  writeFileSync(entry, 'console.error("child diagnostic"); process.exitCode = 7')
  const result = invoke(root, entry, ['install'])
  assert.notEqual(result.status, 0)
  assert.match(result.stderr, /install failed \(7\)/)
  assert.match(result.stderr, /child diagnostic/)
})
