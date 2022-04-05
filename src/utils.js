function proxy(vm, target, key) {
  Object.defineProperty(vm, key, {
    get () {
      return vm[target][key]
    },
    set (newValue) {
      vm[target][key] = newValue
    }
  })
}

function isObject(data) {
  return data !== null && typeof data === 'object'
}

function isArray(data) {
  return Array.isArray(data)
}

function setConstantProperty(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export {
  proxy,
  isObject,
  isArray,
  setConstantProperty
}