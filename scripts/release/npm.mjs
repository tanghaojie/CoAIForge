import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'

export function runNpm(root, args, { timeout = 180000 } = {}) {
  const candidates = [join(dirname(process.execPath), 'node_modules/npm/bin/npm-cli.js')]
  if (process.env.npm_execpath?.endsWith('npm-cli.js')) candidates.unshift(process.env.npm_execpath)
  const commands = execFileSync(process.platform === 'win32' ? 'where.exe' : 'which', ['npm'], {
    encoding: 'utf8',
  })
    .trim()
    .split(/\r?\n/)
  for (const command of commands) {
    const path = realpathSync(command)
    if (/\.[cm]?js$/.test(path)) candidates.push(path)
    candidates.push(join(dirname(path), 'node_modules/npm/bin/npm-cli.js'))
  }
  const cli = candidates.find(function found(path) {
    return existsSync(path)
  })
  if (!cli) throw new Error('Cannot locate npm CLI')
  const result = spawnSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: 'utf8',
    windowsHide: true,
    timeout,
    maxBuffer: 12 * 1024 * 1024,
  })
  if (result.status !== 0)
    throw new Error(`npm ${args.join(' ')} failed: ${result.stdout}\n${result.stderr}`)
  return result.stdout
}
