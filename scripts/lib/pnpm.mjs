import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, realpathSync } from 'node:fs'
import { dirname, join } from 'node:path'

function launcher() {
  if (process.env.npm_execpath && existsSync(process.env.npm_execpath)) {
    const path = realpathSync(process.env.npm_execpath)
    if (/\.[cm]?js$/i.test(path)) return [process.execPath, [path]]
    if (process.platform !== 'win32' || /\.exe$/i.test(path)) return [path, []]
  }
  const paths = execFileSync(process.platform === 'win32' ? 'where.exe' : 'which', ['pnpm'], {
    encoding: 'utf8',
  })
    .trim()
    .split(/\r?\n/)
  for (const path of paths) {
    const real = realpathSync(path)
    if (/\.[cm]?js$/i.test(real)) return [process.execPath, [real]]
    if (process.platform !== 'win32' || /\.exe$/i.test(real)) return [real, []]
    for (const file of ['pnpm.mjs', 'pnpm.cjs']) {
      const candidate = join(dirname(path), 'node_modules/pnpm/bin', file)
      if (existsSync(candidate)) return [process.execPath, [candidate]]
    }
  }
  throw new Error('Cannot find a pnpm Node entrypoint; run this command with pnpm run')
}

export function runPnpm(root, args, { timeout = 180000, quiet = false } = {}) {
  const [command, prefix] = launcher()
  const result = spawnSync(command, [...prefix, ...args], {
    cwd: root,
    encoding: 'utf8',
    timeout,
    maxBuffer: 12 * 1024 * 1024,
    windowsHide: true,
  })
  if (result.status !== 0)
    throw new Error(
      `${args.join(' ')} failed (${result.status ?? result.error?.message}):\n${result.stdout}\n${result.stderr}`,
    )
  if (!quiet) console.log(`PASS ${args.join(' ')}`)
  return result.stdout
}
