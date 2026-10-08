import assert from 'node:assert/strict'
import { execFileSync, spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { test } from 'node:test'
import { PassThrough, Writable } from 'node:stream'
import { setImmediate } from 'node:timers'
import { checkDocs } from '../docs/check.mjs'
import { checkModules } from '../architecture/check-modules.mjs'
import { projectRoot, readJson } from '../lib/project.mjs'
import { removeTemporary } from '../lib/testing.mjs'
import { buildBundle } from '../release/build.mjs'
import { createProject, parseArguments, resolveOptions, runCli } from './create-project.mjs'

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'coaiforge-cli-test-'))
  t.after(function cleanup() {
    removeTemporary(root)
  })
  const bundlePath = join(root, 'template-bundle.json')
  buildBundle({ output: bundlePath })
  return { root, bundlePath }
}

test('arguments reject typos, duplicates, missing values and invalid presets/names', function () {
  assert.deepEqual(
    parseArguments([
      'sample',
      '--preset=frontend',
      '--name',
      'sample',
      '--no-git',
      '--no-interactive',
    ]),
    {
      directory: 'sample',
      preset: 'frontend',
      name: 'sample',
      initializeGit: false,
      noInteractive: true,
    },
  )
  for (const argv of [
    ['--unknown'],
    ['--preset'],
    ['--preset', 'other'],
    ['--name', '../escape'],
    ['a', 'b'],
    ['--preset', 'frontend', '--preset', 'backend'],
  ])
    assert.throws(function invalid() {
      parseArguments(argv)
    })
})

test('interactive selections reprompt and noninteractive invocation never waits for input', async function () {
  const answers = ['sample', 'bad', '2', 'Sample', 'sample']
  const options = await resolveOptions(
    { initializeGit: true },
    {
      interactive: true,
      question: async function question() {
        return answers.shift()
      },
    },
  )
  assert.equal(options.preset, 'backend')
  assert.equal(options.name, 'sample')
  await assert.rejects(resolveOptions({}, { interactive: false }), /项目目录/)
  await assert.rejects(resolveOptions({ directory: 'sample' }, { interactive: false }), /--preset/)
  await assert.rejects(
    resolveOptions({ directory: 'Bad Name', preset: 'frontend' }, { interactive: false }),
    /--name/,
  )
  const resolved = await resolveOptions(
    { directory: 'sample', preset: 'fullstack' },
    { interactive: false },
  )
  assert.equal(resolved.name, 'sample')
})

test('bundled CLI creates three standalone presets with hidden files, correct dependencies and provenance', async function (t) {
  const { root, bundlePath } = fixture(t)
  for (const preset of ['frontend', 'backend', 'fullstack']) {
    const target = join(root, preset)
    await createProject({
      directory: target,
      name: `sample-${preset}`,
      preset,
      initializeGit: false,
      bundlePath,
    })
    assert.equal(existsSync(join(target, 'apps/frontend')), preset !== 'backend')
    assert.equal(existsSync(join(target, 'apps/backend')), preset !== 'frontend')
    assert.equal(existsSync(join(target, 'packages/api-contract')), preset === 'fullstack')
    assert.equal(existsSync(join(target, '.git')), false)
    for (const file of [
      '.gitignore',
      '.npmrc',
      'scripts/git/hooks/commit-msg',
      'scripts/architecture/module-boundaries.json',
      'pnpm-lock.yaml',
    ])
      assert.ok(existsSync(join(target, file)), file)
    for (const path of ['.githooks', 'bin', '.module-boundaries.json', 'scripts/cli'])
      assert.equal(existsSync(join(target, path)), false, path)
    const pkg = readJson(join(target, 'package.json'))
    for (const key of ['prepack', 'package:build', 'package:verify', 'cli'])
      assert.equal(pkg.scripts[key], undefined)
    assert.equal(
      pkg.devDependencies.prettier,
      readJson(join(projectRoot, 'package.json')).dependencies.prettier,
    )
    assert.equal(pkg.dependencies, undefined)
    const metadata = readJson(join(target, '.template-manifest.json'))
    assert.equal(metadata.cliVersion, readJson(join(projectRoot, 'package.json')).version)
    assert.match(metadata.sourceCommit, /^[a-f0-9]{40}$/)
    assert.equal(readJson(join(target, 'docs/archive/archive-ledger.json')).baseline, null)
    assert.deepEqual(checkDocs(target), [])
    assert.deepEqual(checkModules(target), [])
  }
})

test('Git is initialized with local hooks and no initial commit; existing files survive rejection', async function (t) {
  const { root, bundlePath } = fixture(t)
  const target = join(root, 'git-project')
  await createProject({ directory: target, name: 'git-project', preset: 'frontend', bundlePath })
  assert.ok(existsSync(join(target, '.git')))
  assert.equal(
    execFileSync('git', ['-C', target, 'config', '--local', 'core.hooksPath'], {
      encoding: 'utf8',
    }).trim(),
    'scripts/git/hooks',
  )
  execFileSync('git', ['-C', target, 'config', '--local', 'core.hooksPath', '.githooks'])
  execFileSync(process.execPath, [join(target, 'scripts/git/install-hooks.mjs')])
  assert.equal(
    execFileSync('git', ['-C', target, 'config', '--local', 'core.hooksPath'], {
      encoding: 'utf8',
    }).trim(),
    'scripts/git/hooks',
  )
  assert.notEqual(spawnSync('git', ['-C', target, 'rev-parse', '--verify', 'HEAD']).status, 0)
  const occupied = join(root, 'occupied')
  mkdirSync(occupied)
  writeFileSync(join(occupied, 'human.txt'), 'keep me')
  await assert.rejects(
    createProject({
      directory: occupied,
      name: 'occupied',
      preset: 'backend',
      initializeGit: false,
      bundlePath,
    }),
    /empty/,
  )
  assert.equal(readFileSync(join(occupied, 'human.txt'), 'utf8'), 'keep me')
})

test('malformed resource paths fail without escaping or creating a target', async function (t) {
  const { root, bundlePath } = fixture(t)
  const bundle = readJson(bundlePath)
  bundle.files['../escaped.txt'] = 'bad'
  writeFileSync(bundlePath, JSON.stringify(bundle))
  const target = join(root, 'target')
  await assert.rejects(
    createProject({
      directory: target,
      name: 'target',
      preset: 'frontend',
      initializeGit: false,
      bundlePath,
    }),
    /资源路径/,
  )
  assert.equal(existsSync(target), false)
})

test('help/version work without a bundle; cancellation does not create a project', async function () {
  let written = ''
  const output = {
    write: function write(text) {
      written += text
    },
  }
  assert.equal(await runCli({ argv: ['--help'], output, bundlePath: 'missing' }), 0)
  assert.match(written, /npm create coaiforge/)
  assert.equal(await runCli({ argv: ['--version'], output, bundlePath: 'missing' }), 0)
  let questionCount = 0
  await assert.rejects(
    resolveOptions(
      {},
      {
        interactive: true,
        question: async function cancel() {
          questionCount++
          throw Object.assign(new Error('Cancelled'), { name: 'AbortError' })
        },
      },
    ),
    /Cancelled/,
  )
  assert.equal(questionCount, 1)
  assert.equal(
    await runCli({ argv: ['sample'], input: { isTTY: false }, output, errorOutput: output }),
    1,
  )
})

test('actual readline interaction creates a project and Ctrl+C closes the input stream', async function (t) {
  const { root, bundlePath } = fixture(t)
  const input = new PassThrough()
  input.isTTY = true
  const answers = [join(root, 'interactive'), '1', 'interactive']
  let text = ''
  const output = new Writable({
    write: function write(chunk, encoding, callback) {
      const value = chunk.toString()
      text += value
      if (/项目目录|选择工程|项目名/.test(value))
        setImmediate(function respond() {
          input.write(`${answers.shift()}\n`)
        })
      callback()
    },
  })
  output.isTTY = true
  assert.equal(
    await runCli({ argv: ['--no-git'], input, output, errorOutput: output, bundlePath }),
    0,
  )
  assert.ok(existsSync(join(root, 'interactive/package.json')))
  assert.match(text, /已创建 interactive/)
  assert.ok(input.isPaused())
  input.destroy()
  output.destroy()

  const cancelledInput = new PassThrough()
  cancelledInput.isTTY = true
  let cancelledText = ''
  const cancelledOutput = new Writable({
    write: function write(chunk, encoding, callback) {
      const value = chunk.toString()
      cancelledText += value
      if (value.includes('项目目录'))
        setImmediate(function cancel() {
          cancelledInput.write('\u0003')
        })
      callback()
    },
  })
  cancelledOutput.isTTY = true
  assert.equal(
    await runCli({
      argv: [],
      input: cancelledInput,
      output: cancelledOutput,
      errorOutput: cancelledOutput,
      bundlePath,
    }),
    130,
  )
  assert.match(cancelledText, /已取消创建/)
  assert.ok(cancelledInput.isPaused())
  cancelledInput.destroy()
  cancelledOutput.destroy()
})
