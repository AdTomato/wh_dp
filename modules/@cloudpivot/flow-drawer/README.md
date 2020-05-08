# 流程图绘制

引入：
`import WorkflowDesigner from '@cloudpivot/flow-drawer'`

使用:
`<workflow-designer :flowData="flowData" @onActivity="clickActivity"/>`

传入参数范例:
`src/mock.json`

组件回传事件：
1. 点击节点： `@onActivity`
  返回： 被点击节点的所有数据
