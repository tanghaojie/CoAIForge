import { buildApp } from './app.js'

async function start(): Promise<void> {
  const port = Number(process.env.PORT ?? 3000)
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer from 1 to 65535')
  }
  const app = await buildApp()
  app.enableShutdownHooks(['SIGINT', 'SIGTERM'])
  await app.listen(port, process.env.HOST ?? '127.0.0.1')
  console.log(`Backend listening on ${await app.getUrl()}`)
}

start().catch(function report(error: unknown) {
  console.error(error)
  process.exitCode = 1
})
