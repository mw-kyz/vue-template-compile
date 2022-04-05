/*

<div id="app" style="color: red; font-size: 20px;">
  hello,  {{ name }} welcom
  <span class="text" style="color: green">{{age}}</span>
  <p>1111111111111111</p>
</div>

_c() => createElement
_v() => createTextNode
_s() => {{name}} => _s(name)

*/

/*
generate 最终拼接出来的东西
_c('div', { id:"app",style:{"color":"red","font-size":"20px"}},-v("hello,  "+_s(name)+" welcom"),
    _c('span', { class:"text",style:{"color":"green"}},-v(_s(age)))
  ,
    _c('p', undefined,_v("1111111111111111"))
  )
*/
// function vrender() {
//   return `
//     _c(
//       "div",
//       {
//         "id": "app",
//         "style": {
//           "color": "red",
//           "font-size": "20px"
//         }
//       },
//       _v("hello,    " + _s(name)),
//       _c(
//         "span",
//         {
//           "class": "text",
//           "style": {
//             "color": "green"
//           }
//         },
//         _v(_s(age))
//       )
//     )
//   `
// }
// 匹配双大括号里面的内容
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function formatProps (attrs) {
  let attrStr = ''

  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i]

    // 将 { name: 'style', value: 'color: red; font-size: 20px' } 转换为
    // { name: 'style', value: { color: ' red', font-size: ' 20px' } }
    // 也就是把string变成对象
    if (attr.name === 'style') {
      let styleAttrs = {}

      attr.value.split(';').forEach(styleAttr => {
        styleAttr = styleAttr.trim()
        if (styleAttr) {
          let [key, value] = styleAttr.split(':')
          styleAttrs[key] = value.trim()
        }
      })

      attr.value = styleAttrs
    }
    // 将所有属性拼接成一个字符串
    attrStr += `${ attr.name }:${ JSON.stringify(attr.value) },`
  }

  // console.log(`{ ${ attrStr.slice(0, -1) }}`)

  // 此处利用slice把最后的一个 ',' 去掉
  // 转换后的结果示例： '{ id:"app",style:{"color":"red","font-size":"20px"}}'
  return `{ ${ attrStr.slice(0, -1) }}`
}

function generateChild (node) {
  // 如果是元素节点
  if (node.type === 1) {
    return generate(node)
  } else if (node.type === 3) { // 文本节点
    let text = node.text

    // 如果没有匹配到双大括号
    if (!defaultTagRE.test(text)) {
      return `_v(${ JSON.stringify(text) })`
    }

    let match,
        index,
        lastIndex = defaultTagRE.lastIndex = 0,
        textArr = []

    while (match = defaultTagRE.exec(text)) {
      index = match.index
      if (index > lastIndex) {
        textArr.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      textArr.push(`_s(${match[1].trim()})`)
      lastIndex = index + match[0].length
    }

    if (lastIndex < text.length) {
      textArr.push(JSON.stringify(text.slice(lastIndex)))
    }
    // 拼接后示例： _v("hello,  "+_s(name)+" welcom")
    // console.log(`_v(${ textArr.join('+') })`)
    return `_v(${ textArr.join('+') })`
  }
}

function getChildren (el) {
  const children = el.children

  if (children) {
    return children.map(c => {
      return generateChild(c)
    }).join(',')
  }
}

function generate (el) {
  let children = getChildren(el)

  // 此处 `_c之间不能换行，因为后面会 return code，如果换行，会变成rerun \n code，导致return出来的不是code，而是undefined
  let code = `_c('${ el.tag }', ${
      el.attrs.length > 0
      ?
      `${ formatProps(el.attrs) }`
      :
      'undefined'
    }${
      children ? `,${ children }` : ''
    })`
  // console.log(code)

  return code
}

export {
  generate
}