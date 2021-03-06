import { initState } from './state'
import { compileToRenderFunction } from './compiler'
import { mountComponent } from './lifecycle'

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    const vm = this

    vm.$options = options

    initState(vm)

    if (vm.$options.el) {
      // 挂载函数 Vue.prototype.$mount
      vm.$mount(vm.$options.el)
    }
  }

  Vue.prototype.$mount = function (el) {
    const vm = this,
          options = vm.$options
    
    el = document.querySelector(el)
    vm.$el = el

    // 如果不存在render函数，就使用 template 或者 el 的outerHTML
    if (!options.render) {
      let template = options.template

      if (!template && el) {
        template = el.outerHTML
      }
      // 将 template 转成 render 函数
      const render = compileToRenderFunction(template)
      options.render = render
    }

    mountComponent(vm)
  }
}

export {
  initMixin
}