import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { argument, projectRoot, readJson } from '../lib/project.mjs'
import { runPnpm } from '../lib/pnpm.mjs'
import { runNpm } from './npm.mjs'
import { buildBundle } from './build.mjs'

const root = mkdtempSync(join(tmpdir(), 'coaiforge-package-'))
const requested = argument('--preset')
if (requested && !['frontend', 'backend', 'fullstack'].includes(requested))
  throw new Error('Unknown preset')
mkdirSync(join(projectRoot, '.generated'), { recursive: true })
buildBundle()
const packOutput = runNpm(projectRoot, [
  'pack',
  '--ignore-scripts',
  '--json',
  '--pack-destination',
  root,
])
// npm 10 can print prepare output before its JSON report, even with --ignore-scripts.
const reportStart = packOutput.lastIndexOf('\n[')
const packed = JSON.parse(reportStart === -1 ? packOutput : packOutput.slice(reportStart + 1))[0]
const expected = [
  'LICENSE',
  'README.md',
  'package.json',
  'bin/create-coaiforge.mjs',
  'scripts/cli/create-project.mjs',
  'scripts/templates/compose.mjs',
  'scripts/lib/project.mjs',
  'dist/template-bundle.json',
]
assert.deepEqual(
  packed.files
    .map(function path(file) {
      return file.path
    })
    .sort(),
  expected.sort(),
)
const tarball = join(root, packed.filename)
const consumer = join(root, 'consumer')
mkdirSync(consumer)
writeFileSync(
  join(consumer, 'package.json'),
  JSON.stringify({ name: 'package-consumer', private: true }),
)
runNpm(consumer, [
  'install',
  '--ignore-scripts',
  '--no-audit',
  '--no-fund',
  '--package-lock=false',
  tarball,
])
const installed = join(consumer, 'node_modules/create-coaiforge')
const entry = join(installed, 'bin/create-coaiforge.mjs')
const metadata = readJson(join(installed, 'package.json'))
assert.equal(metadata.bin['create-coaiforge'], 'bin/create-coaiforge.mjs')
assert.equal(
  execFileSync(process.execPath, [entry, '--version'], { encoding: 'utf8' }).trim(),
  metadata.version,
)
assert.match(
  execFileSync(process.execPath, [entry, '--help'], { encoding: 'utf8' }),
  /npm create coaiforge/,
)
const results = []
for (const preset of requested ? [requested] : ['frontend', 'backend', 'fullstack']) {
  const target = join(root, `packed-${preset}`)
  execFileSync(
    process.execPath,
    [entry, target, '--preset', preset, '--no-git', '--no-interactive'],
    { cwd: consumer, stdio: 'pipe' },
  )
  assert.equal(readJson(join(target, '.template-manifest.json')).cliVersion, metadata.version)
  runPnpm(target, ['install', '--frozen-lockfile', '--strict-peer-dependencies'])
  for (const command of [
    'format:check',
    'lint',
    'typecheck',
    'modules:check',
    'docs:check',
    'build',
    'test',
    'docs:archive:check:bootstrap',
  ])
    runPnpm(target, [command])
  results.push({ preset, target, checks: 'PASS' })
}
const report = {
  version: metadata.version,
  tarball,
  integrity: packed.integrity,
  sourceCommit: readJson(join(installed, 'dist/template-bundle.json')).sourceCommit,
  platform: process.platform,
  checkedAt: new Date().toISOString(),
  results,
}
writeFileSync(
  join(
    projectRoot,
    '.generated',
    `package-verification-${process.platform}-${requested ?? 'all'}.json`,
  ),
  `${JSON.stringify(report, null, 2)}\n`,
)
console.log(JSON.stringify(report, null, 2))
