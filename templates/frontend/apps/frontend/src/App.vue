<template>
  <main>
    <p class="eyebrow">启动工程</p>
    <h1>{{ PROJECT_NAME }}</h1>
    <p>从这里开始构建你的应用。</p>
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
</style>
