import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { filesUnder, git, isMain, projectRoot, readJson, relativePath } from '../lib/project.mjs'

export function buildBundle({
  root = projectRoot,
  output = join(root, 'dist/template-bundle.json'),
} = {}) {
  const manifest = readJson(join(root, 'templates/manifest.json'))
  const files = { 'package.json': readFileSync(join(root, 'package.json'), 'utf8') }
  for (const path of [...manifest.shared, 'templates']) {
    const source = join(root, path)
    const paths = statSync(source).isDirectory() ? filesUnder(source) : [source]
    for (const file of paths) files[relativePath(root, file)] = readFileSync(file, 'utf8')
  }
  const bundle = {
    schemaVersion: 1,
    version: readJson(join(root, 'package.json')).version,
    sourceCommit: git(root, ['rev-parse', '--verify', 'HEAD']),
    files,
  }
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(output, `${JSON.stringify(bundle, null, 2)}\n`)
  return {
    output,
    version: bundle.version,
    sourceCommit: bundle.sourceCommit,
    files: Object.keys(files).length,
  }
}

if (isMain(import.meta.url)) console.log(JSON.stringify(buildBundle(), null, 2))
