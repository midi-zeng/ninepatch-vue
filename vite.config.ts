import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      bundleTypes: true
    })
  ],
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'NinePatchVue',
      formats: ['es', 'cjs'],
      fileName: format => (format === 'es' ? 'index.js' : 'index.cjs')
    },
    sourcemap: true,
    target: 'es2020',
    rollupOptions: {
      external: [/^ninepatch-core/, /^vue($|\/)/]
    }
  },
  test: {
    environment: 'jsdom',
    include: ['test/**/*.spec.ts']
  }
})
