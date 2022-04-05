// 匹配属性  id="app" id='app' id=app 这三种都能匹配
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// 匹配标签名 my-header 这种也能匹配
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
// 匹配特殊标签名， 比如 my:header
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
// 匹配开始标签，比如 <div
const startTagOpen = new RegExp(`^<${qnameCapture}`)
// 匹配结束标识，比如 > 或 />
const startTagClose = /^\s*(\/?)>/
// 匹配完整的结束标签，比如 </div>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)

/*
<div id="app" style="color: red; font-size: 20px;">
  hello,  {{ name }}
  <span class="text" style="color: green">{{age}}</span>
</div>
*/
function parseHtmlToAst (html) {
  let text,
      root,
      currentParent,
      stack = []

  while (html) {
    let textEnd = html.indexOf('<')

    if (textEnd === 0) {
      // 处理开始标签
      const startTagMatch = parseStartTag()

      if (startTagMatch) {
        // 处理匹配出来的标签属性
        start(startTagMatch.tagName, startTagMatch.attrs)
        continue
      }

      // 匹配结束标签
      const endTagMatch = html.match(endTag)

      if (endTagMatch) {
        // 截掉结束标签，比如 '</div>'
        advance(endTagMatch[0].length)
        // 处理匹配出来的结束标签
        end(endTagMatch[1])
        continue
      }
    }

    if (textEnd > 0) {
      // 取文本属性
      text = html.substring(0, textEnd)
    }

    if (text) {
      // 截掉文本
      advance(text.length)
      // 处理文本属性
      chars(text)
    }
  }

  function parseStartTag () {
    // 正则匹配开始标签
    const start = html.match(startTagOpen)

    let end, attr
    
    if (start) {
      const match = {
        tagName: start[1],
        attrs: []
      }

      // 截掉开始标签，比如 '<div'
      advance(start[0].length)

      // 如果未匹配到结束标识且匹配到标签属性，则需要循环把所有属性取出来
      // 此处 end 和 attr每次循环都需要重新取值，所以取值操作放在括号里
      while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
        match.attrs.push({
          name: attr[1],
          value: attr[3] || attr[4] || attr[5] // 因为 id="app",id='app',id=app这三种形式(后两种形式需要通过template属性测试)匹配出来的对象不一样
        })

        // 截掉该属性，比如 ' id="app"'
        advance(attr[0].length)
      }
      // 如果该标签已结束
      if (end) {
        // 截掉结束标识，比如 ' >' 
        advance(end[0].length)
        return match
      }
    }
  }

  // 截取 html 字符串
  function advance (n) {
    html = html.substring(n)
    // console.log('html:----', html)
  }

  function start (tagName, attrs) {
    // console.log('-----开始-------')
    // console.log(tagName, attrs)
    const element = createASTElement(tagName, attrs)
    
    if (!root) {
      root = element
    }

    currentParent = element
    stack.push(element)
  }
  
  function end (tagName) {
    // console.log('-----结束-------')
    // console.log(tagName)
    // ['div', 'span'] => ['div']
    // element = 'span'
    const element = stack.pop()
    // currentParent = 'div'
    currentParent = stack[stack.length - 1]

    if (currentParent) {
      // span.parent = div
      element.parent = currentParent
      // div.children = span
      currentParent.children.push(element)
    }
  }
  
  function chars (text) {
    // console.log('-----文本-------')
    // console.log(text)
    text = text.trim()
    // 需保证 currentParent 存在，如果故意这么写的话， template: `123<div></div>`，此时文本为123，但是currentParent为空
    if (currentParent && text.length > 0) {
      currentParent.children.push({
        type: 3,
        text
      })
    }
  }
  
  function createASTElement (tagName, attrs) {
    return {
      tag: tagName,
      type: 1,
      children: [],
      attrs,
      parent: null
    }
  }

  return root
}

export {
  parseHtmlToAst
}