function patch (oldNode, vNode) {
  let el = createElement(vNode),
      parentElement = oldNode.parentNode

  // 此处没有做diff，直接新节点替换旧节点
  parentElement.replaceChild(el, oldNode);
}

function createElement (vnode) {
  const { tag, props, children, text } = vnode

  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)

    // 把属性添加到元素上
    updateProps(vnode)

    children.forEach(child => {
      vnode.el.appendChild(createElement(child))
    })
  } else {
    vnode.el = document.createTextNode(text)
  }

  return vnode.el
}

function updateProps (vnode) {
  const el = vnode.el,
        newProps = vnode.props || {}

  for (let key in newProps) {
    if (key === 'style') {
      for (let sKey in newProps.style) {
        el.style[sKey] = newProps.style[sKey]
      }
    } else if (key === 'class') {
      el.className = newProps.class
    } else {
      el.setAttribute(key, newProps[key])
    }
  }
}

export {
  patch
}