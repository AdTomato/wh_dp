export default {
  // 自定义样式注释
  'customStyleTopComment':'',
  'customStyleInnerTopComment':'这里可以编写自定义样式',
  // 自定义脚本注释
  'customActionTopComment':'',
  'customActionInnerTopComment':'可使用<alt+方向键>调整顺序; 默认操作按钮不能删除;',
  // 预设模板注释
  'presetTemplateTopComment':'',
  'presetTemplateInnerTopComment':'',
  'presetTemplateInnerTHeadComment':'可使用<alt+方向键>调整字段顺序; 其他修改无效, 如需自定义请使用下方自定义模板',
  'presetTemplateInnerTBodyComment':'',
  // 自定义模板
  'customTemplateTopComment':'这里可以编写自定义模板，当此处编写有效内容后，预设模板的内容将不会渲染',
  'customScriptTopComment':'',
  // 自定义脚本
  // 函数头
  'customScriptHookFunctionTopComment':`/**
     * 字段解释:
     * @global this: 全局引用, vue 实例
     * @global list: 全局引用, 列表对象
     *
     * @param  data: 参数字段, 当前页的列表数据
     * @param  action: 动作对象, 格式为: { actionCode:'add', name:'新增', ... }
     * @param  result: 事件处理结果, true | false | any
     *
     * @return Promise
     */`,
  // onLoad
  'customScriptHookOnLoadComment':`/**
     * 列表数据加载后
     * @params data
     * @return Promise
     */`,
  // onRendered
  'customScriptHookOnRenderComment':`/**
     * 列表数据加载后
     * @params data
     * @return Promise
     */`,
  // onPreAction
  'customScriptHookOnPreActionComment':`/**
     * 动作触发前，返回false阻止后续执行, 返回空或者其他不做阻止
     * @param action
     * @param data
     * @return Promise
     */`,
  // onCustomAction
  'customScriptHookOnCustomActionComment':`/**
     * 自定义动作执行内容，执行完毕会(异步)触发 actionDone
     * @param action
     * @param data
     * @return Promise
     */`,
  // onActionDone
  'customScriptHookOnActionDoneComment':`/**
     * 操作完成后
     * @param action
     * @param data
     * @params result
     * @return Promise
     */`,
}