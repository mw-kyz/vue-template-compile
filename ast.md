```js
function fn (a, b) {}
// 一个函数的 AST 如下
{
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "id": {
        "type": "Identifer",
        "name": "fn"
      },
      "params": [
        {
          "type": "Identifer",
          "name": "a"
        },
         {
          "type": "Identifer",
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": []
      },
      "generator": false,
      "expression": false,
      "async": false
    }
  ],
  "sourceType": "script"
}
```

```html
<div id="app" style="color: red; font-size: 20px;
">hello    {{ name }}
  <span>{{age}}</span>
</div>

// 以上 html 的 AST 如下

{
  tag: 'div',
  type: 1,
  attrs: [
    {
      name: 'id',
      value: 'app'
    },
    {
      name: 'style',
      value: {
        color: ' red',
        font-size: ' 20px'
      }
    }
  ],
  children: [
    {
      type: 3,
      text: 'hello    {{ name }}'
    },
    {
      type: 1,
      tag: 'span',
      attrs: null,
      children: [
        {
          type: 3,
          text: '{{ age }}'
        }
      ],
      parent: ...div
    }
  ],
  parent: null
}
```