import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { projectRoot } from '../lib/project.mjs'
import { runPnpm } from '../lib/pnpm.mjs'
import { compose } from './compose.mjs'

const directory = mkdtempSync(join(tmpdir(), 'coaiforge-locks-'))
mkdirSync(join(projectRoot, 'templates/locks'), { recursive: true })
for (const preset of ['frontend', 'backend', 'fullstack']) {
  const target = join(directory, preset)
  await compose({ target, preset, name: 'lock-seed', withLock: false })
  runPnpm(target, ['install', '--lockfile-only'])
  const lock = readFileSync(join(target, 'pnpm-lock.yaml'), 'utf8').replaceAll(
    '@lock-seed/',
    '@{{PROJECT_NAME}}/',
  )
  writeFileSync(join(projectRoot, 'templates/locks', `${preset}.yaml`), lock)
  console.log(`Pinned ${preset} dependency graph`)
}
console.log(`Seed projects: ${directory}`)
