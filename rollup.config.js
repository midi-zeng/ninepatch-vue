import vue from 'rollup-plugin-vue'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/app.vue',
  output: {
    format: 'esm',
    file: 'dist/index.esm.js',
  },
  plugins: [
    vue(),
    commonjs()
  ]
}
