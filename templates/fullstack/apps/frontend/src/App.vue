<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
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
  <main>
    <p class="eyebrow">启动工程</p>
    <h1>{{ PROJECT_NAME }}</h1>
    <section aria-live="polite" :aria-busy="state === 'loading'">
      <p v-if="state === 'loading'">正在连接服务…</p>
      <template v-else-if="state === 'success'">
        <p class="success">服务运行正常</p>
        <p>响应时间：{{ timestamp }}</p>
      </template>
      <p v-else class="failure">{{ error }}</p>
    </section>
    <button type="button" :disabled="state === 'loading'" @click="refresh">重新检查</button>
  </main>
</template>

<style>
:root {
  font-family: system-ui, sans-serif;
  color: #24303e;
  background: #f7f8fa;
}
body {
  margin: 0;
}
main {
  max-width: 640px;
  margin: 12vh auto;
  padding: 32px;
}
.eyebrow {
  color: #667788;
  font-size: 14px;
}
h1 {
  font-size: clamp(32px, 6vw, 56px);
}
.success {
  color: #177346;
}
.failure {
  color: #b13333;
}
button {
  margin-top: 12px;
  padding: 10px 18px;
  border: 1px solid #cbd2da;
  border-radius: 8px;
  color: inherit;
  background: white;
  cursor: pointer;
}
button:disabled {
  cursor: wait;
  opacity: 0.6;
}
button:focus-visible {
  outline: 2px solid #356bb2;
  outline-offset: 3px;
}
</style>
