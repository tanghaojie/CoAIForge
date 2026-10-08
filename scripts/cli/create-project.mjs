import { execFileSync } from 'node:child_process'
import { chmodSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { projectRoot, readJson } from '../lib/project.mjs'
import { compose } from '../templates/compose.mjs'

const presets = ['frontend', 'backend', 'fullstack']
const projectNamePattern = /^[a-z][a-z0-9-]{0,63}$/
const help = `CoAIForge — 人与 AI 协作项目模板

用法：npm create coaiforge@latest [项目目录] [-- --preset frontend|backend|fullstack]

  --preset <类型>       frontend / backend / fullstack
  --name <项目名>       小写字母开头，使用小写字母、数字和连字符，最多 64 字符
  --no-git              跳过 Git 初始化
  --no-interactive      使用参数创建，缺少必需参数时失败
  -h, --help            显示帮助
  -v, --version         显示版本

默认交互选择工程。只生成文件并初始化 Git，不安装依赖、不创建首提交。`

export function parseArguments(argv) {
  const options = { initializeGit: true }
  let positionalOnly = false
  for (let index = 0; index < argv.length; index++) {
    const value = argv[index]
    if (value === '--' && !positionalOnly) {
      positionalOnly = true
      continue
    }
    if (!positionalOnly && ['--preset', '--name'].includes(value.split('=')[0])) {
      const [flag, ...inline] = value.split('=')
      const argument = inline.length ? inline.join('=') : argv[++index]
      if (!argument || argument.startsWith('--')) throw new Error(`${flag} 缺少参数`)
      const key = flag.slice(2)
      if (Object.hasOwn(options, key)) throw new Error(`${flag} 不能重复`)
      options[key] = argument
    } else if (!positionalOnly && value === '--no-git') options.initializeGit = false
    else if (!positionalOnly && value === '--no-interactive') options.noInteractive = true
    else if (!positionalOnly && ['--help', '-h'].includes(value)) options.help = true
    else if (!positionalOnly && ['--version', '-v'].includes(value)) options.version = true
    else if (!positionalOnly && value.startsWith('-')) throw new Error(`未知参数：${value}`)
    else {
      if (Object.hasOwn(options, 'directory')) throw new Error('只能指定一个项目目录')
      options.directory = value
    }
  }
  if (options.preset && !presets.includes(options.preset))
    throw new Error('--preset 必须为 frontend、backend 或 fullstack')
  if (options.name && !projectNamePattern.test(options.name)) throw new Error('项目名格式无效')
  return options
}

export async function resolveOptions(options, { interactive, question } = {}) {
  const resolved = { ...options }
  const canAsk = interactive && !options.noInteractive
  if (!resolved.directory) {
    if (!canAsk) throw new Error('请指定项目目录；无交互终端时同时提供 --preset')
    resolved.directory = (await question('项目目录 [my-project]：')).trim() || 'my-project'
  }
  if (!resolved.preset) {
    if (!canAsk) throw new Error('无交互终端时必须指定 --preset frontend|backend|fullstack')
    do {
      const choice = (await question('选择工程：1 前端 / 2 后端 / 3 全栈 [3]：')).trim() || '3'
      resolved.preset = { 1: 'frontend', 2: 'backend', 3: 'fullstack' }[choice] ?? choice
    } while (!presets.includes(resolved.preset))
  }
  if (!resolved.name) {
    const candidate = basename(resolve(resolved.directory))
    if (!canAsk) resolved.name = candidate
    else {
      const suggested = projectNamePattern.test(candidate) ? candidate : 'my-project'
      do {
        resolved.name = (await question(`项目名 [${suggested}]：`)).trim() || suggested
      } while (!projectNamePattern.test(resolved.name))
    }
  }
  if (!projectNamePattern.test(resolved.name))
    throw new Error('目录名不能作为项目名，请使用 --name 指定小写项目名')
  return resolved
}

function materializeBundle(bundle, root) {
  if (bundle.schemaVersion !== 1 || typeof bundle.files !== 'object' || !bundle.files)
    throw new Error('模板资源格式无效，请重新安装 create-coaiforge')
  for (const [path, content] of Object.entries(bundle.files)) {
    const target = resolve(root, path)
    const local = relative(root, target)
    if (
      !local ||
      isAbsolute(local) ||
      local === '..' ||
      local.startsWith(`..${process.platform === 'win32' ? '\\' : '/'}`) ||
      path.includes('\\') ||
      typeof content !== 'string'
    )
      throw new Error(`模板资源路径无效：${path}`)
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, content)
  }
}

export async function createProject({
  directory,
  name,
  preset,
  initializeGit = true,
  bundlePath = join(projectRoot, 'dist/template-bundle.json'),
}) {
  if (!directory || !projectNamePattern.test(name ?? '') || !presets.includes(preset))
    throw new Error('项目目录、项目名或工程类型无效')
  if (!existsSync(bundlePath)) throw new Error('缺少模板资源；源码开发请先运行 pnpm package:build')
  if (initializeGit) {
    try {
      execFileSync('git', ['--version'], { stdio: 'ignore', windowsHide: true })
    } catch {
      throw new Error('未找到 Git，请安装 Git 或使用 --no-git')
    }
  }
  const target = resolve(directory)
  const bundle = readJson(bundlePath)
  const resources = mkdtempSync(join(tmpdir(), 'coaiforge-resources-'))
  let generated
  try {
    materializeBundle(bundle, resources)
    generated = await compose({
      target,
      name,
      preset,
      root: resources,
      cliVersion: bundle.version,
      sourceCommit: bundle.sourceCommit,
    })
  } finally {
    rmSync(resources, { recursive: true, force: true })
  }
  if (initializeGit) {
    try {
      execFileSync('git', ['init', '--quiet', target], { stdio: 'pipe', windowsHide: true })
      execFileSync('git', ['-C', target, 'config', '--local', 'core.hooksPath', '.githooks'], {
        stdio: 'pipe',
        windowsHide: true,
      })
      for (const hook of ['pre-commit', 'commit-msg'])
        chmodSync(join(target, '.githooks', hook), 0o755)
    } catch {
      throw new Error(
        `工程已生成到 ${target}，Git 初始化失败。请在该目录执行 git init，再安装依赖并运行 pnpm prepare。`,
      )
    }
  }
  return { ...generated, initializeGit }
}

export async function runCli({
  argv = process.argv.slice(2),
  input = process.stdin,
  output = process.stdout,
  errorOutput = process.stderr,
  bundlePath = join(projectRoot, 'dist/template-bundle.json'),
} = {}) {
  let readline
  const cancellation = new AbortController()
  function closePrompts() {
    if (!readline) return
    readline.removeAllListeners('close')
    readline.close()
    readline = undefined
    input.pause()
    input.unref?.()
  }
  try {
    const options = parseArguments(argv)
    if (options.help) {
      output.write(`${help}\n`)
      return 0
    }
    if (options.version) {
      output.write(`${readJson(join(projectRoot, 'package.json')).version}\n`)
      return 0
    }
    const interactive = Boolean(input.isTTY && output.isTTY)
    if (interactive && !options.noInteractive) {
      readline = createInterface({ input, output })
      readline.on('SIGINT', function cancel() {
        cancellation.abort()
      })
      readline.on('close', function close() {
        cancellation.abort()
      })
    }
    const resolved = await resolveOptions(options, {
      interactive,
      question: function question(prompt) {
        return readline.question(prompt, { signal: cancellation.signal })
      },
    })
    closePrompts()
    const result = await createProject({ ...resolved, bundlePath })
    output.write(
      `\n已创建 ${resolved.name}（${resolved.preset}）\n目录：${result.target}\n${result.initializeGit ? 'Git 已初始化，尚无提交。' : '已跳过 Git 初始化。'}\n\n接下来：\n  cd ${JSON.stringify(resolved.directory)}\n  pnpm install --frozen-lockfile\n`,
    )
    if (resolved.preset !== 'backend') output.write('  pnpm dev:frontend\n')
    if (resolved.preset !== 'frontend')
      output.write(
        `  pnpm dev:backend${resolved.preset === 'fullstack' ? '  # 在另一个终端运行' : ''}\n`,
      )
    output.write('\n首提交与归档基线步骤见 docs/guides/getting-started.md。\n')
    return 0
  } catch (error) {
    if (error.name === 'AbortError' || cancellation.signal.aborted) {
      errorOutput.write('已取消创建。\n')
      return 130
    }
    errorOutput.write(`create-coaiforge: ${error.message}\n`)
    return 1
  } finally {
    closePrompts()
  }
}
