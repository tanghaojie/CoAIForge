import { mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { argument, filesUnder, projectRoot, relativePath } from '../lib/project.mjs'
import { runPnpm } from '../lib/pnpm.mjs'
import { compose } from './compose.mjs'

const requested = argument('--preset')
if (requested && !['frontend', 'backend', 'fullstack'].includes(requested))
  throw new Error('Unknown preset')
const presets = requested ? [requested] : ['frontend', 'backend', 'fullstack']
const directory = mkdtempSync(join(tmpdir(), 'coaiforge-verify-'))
const results = []
for (const preset of presets) {
  const target = join(directory, preset)
  console.log(`Verifying ${preset} independently at ${target}`)
  const generated = await compose({ target, preset, name: `verified-${preset}` })
  runPnpm(target, ['install', '--frozen-lockfile'])
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
  for (const file of filesUnder(target)) {
    const path = relativePath(target, file)
    if (!/\.(?:md|[cm]?[jt]s|vue|json|yaml|html)$/.test(path)) continue
    const content = readFileSync(file, 'utf8')
    if (
      /\{\{\s*[A-Z_]+\s*\}\}|scope: (?:foundation|platform|forge)|\.forge-sync|forge-sync\.mjs|C:[\\/]Users[\\/]/.test(
        content,
      )
    )
      throw new Error(`Unresolved parameter or source residue in ${path}`)
  }
  results.push({
    preset,
    files: generated.files,
    checks: 'PASS',
    target,
    frontendAcceptance: preset === 'backend' ? 'not_applicable' : 'pending',
    platform: process.platform,
    node: process.version,
  })
}
mkdirSync(join(projectRoot, '.generated'), { recursive: true })
writeFileSync(
  join(projectRoot, '.generated', `verification-${process.platform}-${requested ?? 'all'}.json`),
  `${JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2)}\n`,
)
console.log(JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2))
