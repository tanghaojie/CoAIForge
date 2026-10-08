<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import Introduction from './modules/introduction/introduction.vue'
import { requestHealth } from './modules/health/health.api'

const state = ref<'loading' | 'success' | 'failure'>('loading')
const timestamp = ref('')
const error = ref('')
let controller: AbortController | undefined

async function refresh(): Promise<void> {
  controller?.abort()
  const request = new AbortController()
  controller = request
  state.value = 'loading'
  error.value = ''
  try {
    const response = await requestHealth(request.signal)
    if (request.signal.aborted) return
    timestamp.value = response.data.timestamp
    state.value = 'success'
  } catch (cause) {
    if (request.signal.aborted) return
    error.value = cause instanceof Error ? cause.message : '请求失败'
    state.value = 'failure'
  }
}

onMounted(refresh)
onUnmounted(function cancel() {
  controller?.abort()
})
</script>

<template>
  <Introduction project-name="{{PROJECT_NAME}}" preset="fullstack">
    <template #service>
      <section aria-live="polite" :aria-busy="state === 'loading'">
        <p v-if="state === 'loading'">正在连接服务…</p>
        <template v-else-if="state === 'success'">
          <p class="success">服务运行正常</p>
          <p>响应时间：{{ timestamp }}</p>
        </template>
        <p v-else class="failure">{{ error }}</p>
      </section>
      <button type="button" :disabled="state === 'loading'" @click="refresh">重新检查</button>
    </template>
  </Introduction>
</template>
