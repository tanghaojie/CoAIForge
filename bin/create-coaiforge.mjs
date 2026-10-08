#!/usr/bin/env node
import { runCli } from '../scripts/cli/create-project.mjs'

process.exitCode = await runCli()
