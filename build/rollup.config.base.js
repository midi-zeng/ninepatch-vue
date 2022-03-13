// import babel from 'rollup-plugin-babel'
import babel from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import { eslint } from 'rollup-plugin-eslint'
import vue from 'rollup-plugin-vue'
import postcssUrl from 'postcss-url'
// import px2rem from 'postcss-px2rem'
import commonjs from '@rollup/plugin-commonjs'
// import image from "@rollup/plugin-image"
import convertInit from 'postcss-convert-unit'
import css from 'rollup-plugin-css-only' // 提取css
import CleanCSS from 'clean-css'   // 压缩css
import { writeFileSync, existsSync, mkdirSync } from 'fs' // 写文件
// import postcss from 'rollup-plugin-postcss'

const version = process.env.VERSION || require('../package.json').version
const extensions = ['.js', '.jsx', '.ts', '.tsx', '.vue']
const name = 'vue-ninepatch-vue'
const banner =
  '/*!\n' +
  ` * ${name} v${version}\n` +
  ` * (c) 2014-${new Date().getFullYear()} midi_zeng <zengfukun@foxmail.com>",\n` +
  ' */'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      name,
      format: 'cjs',
      banner
      // When export and export default are not used at the same time, set legacy to true.
      // legacy: true,
    },
    {
      file: 'dist/index.esm.js',
      name,
      format: 'es',
      banner
      // When export and export default are not used at the same time, set legacy to true.
      // legacy: true,
    },
    {
      file: 'dist/index.umd.js',
      name,
      format: 'umd',
      banner,
      globals: {
        vue: 'Vue',
        'vue-property-decorator': 'vuePropertyDecorator'
      }
    }
  ],
  external: ['vue', 'vue-property-decorator'],
  plugins: [
    eslint({
      // fix: true,
      // exclude: ['*.png'] // (开启fix图片会被修改)
    }),
    resolve({
      extensions
    }),
    // image({
    //   extensions: /\.(png|jpg|jpeg|gif|svg)$/,
    //   limit: 10000
    // }),
    vue({
      css: false,
      style: {
        // postcssPlugins: [postcssUrl({
        //   url: "inline", // enable inline assets using base64 encoding
        //   maxSize: 10, // maximum file size to inline (in kilobytes)
        //   fallback: "copy", // fallback method to use if max size is exceeded
        // })]
        // postcssPlugins: [postcssUrl({ url: 'inline' }), px2rem({ remUnit: 100 })]
        postcssPlugins: [postcssUrl({ url: 'inline' }), convertInit({
          convertConfig: [{
            declMatcher: {
              sourceUnit: 'px',
              targetUnit: 'PX'
            },
            declConvertRules: [{
              value: value => value / 2
            }]
          }]
        })]
      }
    }),
    css({
      output (style) {
        // 压缩 css 写入 dist/base-ui.css
        var dirPath = 'dist'
        if (!existsSync(dirPath)) {
          mkdirSync(dirPath);
        }
        writeFileSync(`${dirPath}/base-ui.css`, new CleanCSS().minify(style).styles)
      }
    }),
    commonjs(),
    babel({
      // babelHelpers: 'runtime',
      // skipPreflightCheck: true, // 必写兼容，不知道为啥
      exclude: 'node_modules/**',
      extensions
    })
  ]
}
