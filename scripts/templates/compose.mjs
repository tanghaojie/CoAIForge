import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import * as prettier from 'prettier'
import {
  argument,
  filesUnder,
  git,
  isMain,
  projectRoot,
  readJson,
  relativePath,
} from '../lib/project.mjs'

function substitute(text, parameters) {
  return text.replace(/\{\{\s*([A-Z_]+)\s*\}\}/g, function replace(match, name) {
    if (!Object.hasOwn(parameters, name)) throw new Error(`Unknown template parameter ${match}`)
    return parameters[name]
  })
}

function merge(base, patch) {
  const result = { ...base }
  for (const [key, value] of Object.entries(patch)) {
    result[key] =
      value && typeof value === 'object' && !Array.isArray(value)
        ? merge(result[key] ?? {}, value)
        : value
  }
  return result
}

export async function compose({
  target,
  preset,
  name,
  withLock = true,
  root = projectRoot,
  cliVersion = null,
  sourceCommit: recordedSourceCommit,
}) {
  const manifest = readJson(join(root, 'templates/manifest.json'))
  const recipe = manifest.presets[preset]
  if (!recipe) throw new Error('Preset must be frontend, backend or fullstack')
  if (!/^[a-z][a-z0-9-]{0,63}$/.test(name ?? ''))
    throw new Error(
      'Project name must be lowercase letters/digits/hyphens, starting with a letter, up to 64 characters',
    )
  const output = resolve(target)
  if (
    output === resolve(root) ||
    output.startsWith(`${resolve(root, 'templates')}/`) ||
    output.startsWith(`${resolve(root, 'templates')}\\`)
  )
    throw new Error('Target cannot replace template sources')
  if (existsSync(output) && (!statSync(output).isDirectory() || readdirSync(output).length))
    throw new Error(
      'Target must not exist or must be empty; existing projects cannot be regenerated',
    )
  const date = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Singapore' })
  const parameters = { PROJECT_NAME: name, PACKAGE_SCOPE: `@${name}`, DATE: date }
  const planned = new Map()
  function addDirectory(directory, shared = false) {
    const paths = statSync(directory).isDirectory() ? filesUnder(directory) : [directory]
    for (const file of paths) {
      const path = shared ? relativePath(root, file) : relativePath(directory, file)
      if (path.endsWith('.merge.json')) continue
      if (planned.has(path) && !recipe.overrides.includes(path))
        throw new Error(`Undeclared template override ${path}`)
      let content = substitute(readFileSync(file, 'utf8'), parameters)
      if (path.endsWith('.md'))
        content = content.replace(/^(created|updated): \d{4}-\d{2}-\d{2}$/gm, `$1: ${date}`)
      planned.set(path, content)
    }
  }
  for (const path of manifest.shared) addDirectory(join(root, path), true)
  const maintenance = readJson(join(root, 'package.json'))
  let packageJson = {
    name,
    version: '0.1.0',
    private: true,
    type: 'module',
    license: 'MIT',
    devEngines: maintenance.devEngines,
    engines: maintenance.engines,
    scripts: Object.fromEntries(
      Object.entries(maintenance.scripts).filter(([key]) =>
        [
          'prepare',
          'format',
          'format:check',
          'lint',
          'docs:check',
          'modules:check',
          'docs:archive:check',
          'docs:archive:check:ci',
          'docs:archive:check:bootstrap',
          'docs:archive:init',
          'docs:archive:complete',
          'commits:check',
        ].includes(key),
      ),
    ),
    devDependencies: {
      ...maintenance.devDependencies,
      prettier: maintenance.dependencies?.prettier ?? maintenance.devDependencies.prettier,
    },
  }
  packageJson.scripts = {
    ...packageJson.scripts,
    typecheck: 'pnpm -r --if-present typecheck',
    build: 'pnpm -r --if-present build',
    test: 'node --test scripts/**/*.test.mjs && pnpm -r --if-present test',
  }
  for (const layer of recipe.layers) {
    const directory = join(root, 'templates', layer)
    addDirectory(directory)
    for (const file of filesUnder(directory).filter((path) => path.endsWith('.merge.json'))) {
      const path = relativePath(directory, file).replace(/\.merge\.json$/, '.json')
      const patch = JSON.parse(substitute(readFileSync(file, 'utf8'), parameters))
      if (path === 'package.json') packageJson = merge(packageJson, patch)
      else
        planned.set(
          path,
          `${JSON.stringify(merge(JSON.parse(planned.get(path) ?? '{}'), patch), null, 2)}\n`,
        )
    }
  }
  planned.set('package.json', `${JSON.stringify(packageJson, null, 2)}\n`)
  const licenses = readJson(join(root, 'templates/licenses.json'))
  const dependencies = new Map()
  for (const pkg of [
    packageJson,
    ...[...planned]
      .filter(([path]) => /^(?:apps|packages)\/[^/]+\/package\.json$/.test(path))
      .map(([, content]) => JSON.parse(content)),
  ]) {
    for (const [dependency, version] of Object.entries({
      ...pkg.dependencies,
      ...pkg.devDependencies,
    })) {
      if (version.startsWith('workspace:')) continue
      if (!licenses[dependency])
        throw new Error(`Missing verified license metadata for ${dependency}`)
      dependencies.set(dependency, { version, license: licenses[dependency] })
    }
  }
  const dependencyRows = [...dependencies]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([dependency, value]) => `| ${dependency} | ${value.version} | ${value.license} |`)
  planned.set(
    'docs/reference/dependencies.md',
    `# 依赖与许可\n\nNode ${maintenance.engines.node}（使用最新 LTS）、pnpm ${maintenance.engines.pnpm}；下表仅列本次所选工程的直接依赖范围，锁文件记录验证过的依赖图。使用 pnpm update -r 更新兼容版本后重新验证并提交锁文件；跨大版本需单独审查。保留依赖包自身许可声明。\n\n| 包 | 版本范围 | 许可证 |\n| --- | --- | --- |\n${dependencyRows.join('\n')}\n\n模板采用 MIT，保留来源 2026 JTLab 声明。workspace 契约属于本项目；无产品资源、实际环境配置或来源开发历史。\n`,
  )
  planned.set(
    'pnpm-workspace.yaml',
    `packages:\n${recipe.workspaces.map((path) => `  - '${path}'`).join('\n')}\n\nengineStrict: true\nsavePrefix: '^'\npmOnFail: download\n\nallowBuilds:\n  '@nestjs/core': false\n  esbuild: true\n\nminimumReleaseAge: 1440\n`,
  )
  let sourceCommit = recordedSourceCommit ?? null
  if (recordedSourceCommit === undefined) {
    try {
      sourceCommit = git(root, ['rev-parse', '--verify', 'HEAD'])
    } catch {
      /* No source commit yet */
    }
  }
  planned.set(
    '.template-manifest.json',
    `${JSON.stringify({ schemaVersion: 1, template: 'CoAIForge', templateVersion: maintenance.version, cliVersion, sourceCommit, preset, parameters: { projectName: name, packageScope: parameters.PACKAGE_SCOPE }, generatedAt: new Date().toISOString() }, null, 2)}\n`,
  )
  if (withLock) {
    const lock = join(root, 'templates/locks', `${preset}.yaml`)
    if (!existsSync(lock)) throw new Error(`Missing verified lockfile for ${preset}`)
    planned.set('pnpm-lock.yaml', substitute(readFileSync(lock, 'utf8'), parameters))
  }
  for (const [path, content] of planned) {
    const file = resolve(output, path)
    if (!file.startsWith(`${output}/`) && !file.startsWith(`${output}\\`))
      throw new Error(`Invalid template output path ${path}`)
    mkdirSync(dirname(file), { recursive: true })
    const info = await prettier.getFileInfo(file)
    const formatted =
      info.inferredParser && path !== 'pnpm-lock.yaml'
        ? await prettier.format(content, {
            ...readJson(join(root, '.prettierrc.json')),
            filepath: file,
          })
        : content
    writeFileSync(file, formatted)
  }
  return { target: output, preset, files: planned.size }
}

if (isMain(import.meta.url)) {
  try {
    const argv = process.argv.slice(2).filter((item) => item !== '--')
    const target = argument('--target', argv)
    if (!target)
      throw new Error(
        'Usage: pnpm template:compose -- --preset frontend|backend|fullstack --target <empty directory> --name <project-name>',
      )
    console.log(
      JSON.stringify(
        await compose({
          target,
          preset: argument('--preset', argv),
          name: argument('--name', argv),
        }),
        null,
        2,
      ),
    )
  } catch (error) {
    console.error(error.message)
    process.exitCode = 1
  }
}
