import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: './src/index.js',
  output: {
    format: 'umd', // 打包后的格式
    name: 'Vue',
    file: 'dist/umd/vue.js',
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_modules/**'
    }),
    serve({
      open: true,
      port: 3000,
      contentBase: '',
      openPage: '/index.html'
    }),
    commonjs()
  ]
}