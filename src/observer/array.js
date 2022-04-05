import { observe } from "./index"

const ARRAY_METHODS = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
]

const originArrMethods = Array.prototype

let newArrMethods = Object.create(originArrMethods)

ARRAY_METHODS.forEach(method => {
  // 重写数组方法
  newArrMethods[method] = function () {
    const args = Array.prototype.slice.call(arguments)

    // 执行原始的数组方法
    const res = originArrMethods[method].apply(this, args)

    // 新增的数组项，可能是一个，也可能是多个
    let addArr

    switch (method) {
      case 'push':
      case 'unshift':
        addArr = args
        break
      case 'splice':
        // splice去除前两个参数之后才是新增的数组参数
        addArr = args.slice(2)
        break
      default:
        break
    }
    console.log('数组新方法', addArr)
    // 给新增的数组项也设置监听
    addArr && observeArr(addArr)
  }
})

function observeArr (arr) {
  for (let i = 0; i < arr.length; i++) {
    observe(arr[i])
  }
}

export {
  newArrMethods
}