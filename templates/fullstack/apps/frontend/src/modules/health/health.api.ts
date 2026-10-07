import { healthResponseSchema, type HealthResponse } from '@{{PROJECT_NAME}}/api-contract/health'

export async function requestHealth(signal?: AbortSignal): Promise<HealthResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(function abort() {
    controller.abort()
  }, 5000)
  function cancel(): void {
    controller.abort()
  }
  if (signal?.aborted) cancel()
  signal?.addEventListener('abort', cancel, { once: true })
  try {
    const base = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
    const response = await fetch(`${base}/health`, { signal: controller.signal })
    if (!response.ok) throw new Error(`服务请求失败（HTTP ${response.status}）`)
    const result = healthResponseSchema.safeParse(await response.json())
    if (!result.success) throw new Error('服务响应不符合 health 契约')
    return result.data
  } catch (error) {
    if (controller.signal.aborted) throw new Error('请求已取消或超过 5 秒', { cause: error })
    if (error instanceof TypeError)
      throw new Error('无法连接服务，请检查后端和 API 地址', { cause: error })
    throw error
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', cancel)
  }
}
