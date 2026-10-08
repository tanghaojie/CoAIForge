import { spawnSync } from 'node:child_process'
import { resolve } from 'node:path'
import { filesUnder } from './project.mjs'

const directories = process.argv.slice(2)
if (!directories.length) throw new Error('Specify at least one test directory')
const tests = directories.flatMap(function collect(directory) {
  return filesUnder(resolve(directory)).filter(function isTest(file) {
    return /\.test\.[cm]?js$/.test(file)
  })
})
if (!tests.length) throw new Error('No test files found in the specified directories')
const result = spawnSync(process.execPath, ['--test', ...tests], {
  stdio: 'inherit',
  windowsHide: true,
})
if (result.error) throw result.error
process.exitCode = result.status ?? 1
