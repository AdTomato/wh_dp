## 说明
自定义指令-- 拖拽缩放指令
可以通过配置允许拖拽缩放的方向来控制，亦可通过配置可缩放的最大最小宽度高度来控制缩放距离
规定以下参数类型的使用形式：
| 参数类型 | 描述 | 示例 |
| ---- | ------- | ---|
| args | 传给指令的参数 | v-resize:north |
| modifiers | 包含修饰符的对象 | v-resieze.west.south |
| Object | 对象字面量 |  v-resize="{maxWidth: 222, west: true}" |


## 示例

```html
<div id="hello">
  <div style="background: #663399" v-resize.west></div>
  <div style="background: #1890ff" v-resize="{maxWidth: 222, west: true}"></div>
  <div style="background: #9BD51E" v-resize:north="{maxWidth: 333}"></div>
</div>

import resize from '../directives/resize';
...
  directives: {
    resize,
  },
```

## API

| 参数 | 说明 | 参数类型 | 值类型 | 默认值 |
| --- | --- | --- | --- | --- |
| east | 是否允许右边拖拽缩放(right) | args/modifiers/Object | boolean | false |
| south | 是否允许下边拖拽缩放(bottom) | args/modifiers/Object | boolean | false |
| west | 是否允许左边拖拽缩放(left) | args/modifiers/Object | boolean | false |
| north | 是否允许下边拖拽缩放(top) | args/modifiers/Object | boolean | false |
| maxWidth | 允许放大的最大宽度 |Object | Number | 700 |
| minWtdth | 允许缩小的最小宽度 | Object | Number | 0 |
| manHeight | 允许放大的最大高度 | Object | Number | 100% |
| minHeight | 允许缩小的最小高度 | Object | Number | 0 |

