import { creatElement, createTextNode } from './vnode'

function renderMixin (Vue) {
  Vue.prototype._c = function () {
    return creatElement(...arguments)
  }

  Vue.prototype._s = function (value) {
    if (value === null) return
    return typeof value === 'object' ? JSON.stringify(value): value
  }

  Vue.prototype._v = function (text) {
    return createTextNode(text)
  }

  Vue.prototype._render = function () {
    const vm = this,
          render = vm.$options.render,
          vnode = render.call(vm)
    
    return vnode
  }
}

export {
  renderMixin
}