import { parseHtmlToAst } from './astParser'
import { generate } from './generate'

function compileToRenderFunction (html) {
  const ast = parseHtmlToAst(html)
  // console.log('ast', ast)
  const code = generate(ast)
  // console.log('code', code)
  // 此处需要使用with，将作用域改成this(此处的this就是vm)，这样code里面的name，就相当于 this.name
  const render = new Function(`
    with(this){ return ${ code } }
  `)
  // console.log('render', render)
  return render
}

export {
  compileToRenderFunction
}