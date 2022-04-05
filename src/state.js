import { proxy } from './utils'
import { observe } from './observer/index'

function initState (vm) {
  const options = vm.$options

  if (options.data) {
    initData(vm)
  }

  if (options.props) {
    initProps(vm)
  }

  if (options.methods) {
    initMethods(vm)
  }

  if (options.watch) {
    initWatch(vm)
  }

  if (options.computed) {
    initComputed(vm)
  }
}

function initProps () {

}

function initMethods () {

}

function initData(vm) {
  let data = vm.$options.data

   vm._data = data = typeof data === 'function' ? data.call(vm) : (data || {})

  for (let key in data) {
    // 将 vm._data.xxx 代理到 vm 上，这样就可以直接使用 vm.xxx 获取该属性
    proxy(vm, '_data', key)
  }

  observe(vm._data)
}

function initWatch () {

}

function initComputed () {

}

export {
  initState
}