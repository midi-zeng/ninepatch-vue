import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import UnoCSS from 'unocss/vite'
import { defineConfig } from 'vite'

// Demo build config, separate from the library build (vite.config.ts).
// Resolve the libraries from their sources so the demo always runs the
// latest local code (no build/link step needed)
export default defineConfig({
  root: resolve(import.meta.dirname, 'demo'),
  plugins: [UnoCSS(), vue()],
  resolve: {
    alias: {
      'ninepatch-vue': resolve(import.meta.dirname, 'src/index.ts'),
      'ninepatch-core': resolve(import.meta.dirname, '../ninepatch-core/src/index.ts')
    },
    // The aliased library sources sit next to their own node_modules; force a
    // single copy of the framework
    dedupe: ['vue', 'ninepatch-core']
  }
})
