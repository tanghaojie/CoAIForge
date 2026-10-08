#!/usr/bin/env node
import { runCli } from './create-project.mjs'

const status = await runCli()
process.exitCode = status

function flush(stream) {
  return new Promise(function drained(resolve, reject) {
    stream.write('', function complete(error) {
      if (error) reject(error)
      else resolve()
    })
  })
}

// Windows console reads may retain a native handle after readline closes.
// Finish only after both output streams have flushed and all project work is done.
if (process.stdin.isTTY) {
  await Promise.all([flush(process.stdout), flush(process.stderr)])
  process.exit(status)
}
