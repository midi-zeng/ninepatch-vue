<template>
  <div class="min-h-screen bg-slate-100 p-8 font-sans text-slate-800">
    <h1 class="mb-1 text-2xl font-bold">ninepatch-vue demo</h1>
    <p class="mb-6 text-sm text-slate-500">
      Android nine-patch images rendered with CSS border-image (Vue 3 + Vite + UnoCSS)
    </p>

    <label class="mb-6 flex items-center gap-3 text-sm">
      <span class="w-28">Width: {{ width }}px</span>
      <input v-model.number="width" type="range" min="180" max="800" class="w-64" />
    </label>

    <div class="flex flex-wrap gap-8">
      <section>
        <h2 class="mb-2 text-sm font-semibold text-slate-600">Raw source (guide border kept, borderInset 1)</h2>
        <div :style="{ width: `${width}px`, height: `${Math.round((width * 122) / 182)}px` }">
          <NinePatch :src="images.raw">
            <div class="flex h-full items-center justify-center text-sm">Raw nine-patch</div>
          </NinePatch>
        </div>
      </section>

      <section>
        <h2 class="mb-2 text-sm font-semibold text-slate-600">AAPT-compiled (npTc chunk)</h2>
        <div :style="{ width: `${width}px`, height: `${Math.round((width * 120) / 180)}px` }">
          <NinePatch :src="images.compiled">
            <div class="flex h-full items-center justify-center text-sm">Compiled nine-patch</div>
          </NinePatch>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import NinePatch from 'ninepatch-vue'

const width = ref(400)

const images = {
  raw: '/btn.9.png',
  compiled: '/btn.compiled.9.png'
}
</script>
