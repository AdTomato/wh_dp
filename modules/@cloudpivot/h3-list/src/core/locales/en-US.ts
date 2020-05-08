export default {
  // 自定义样式注释
  'customStyleTopComment':'',
  'customStyleInnerTopComment':'Here you can write custom styles',
  // 自定义脚本注释
  'customActionTopComment':'',
  'customActionInnerTopComment':'The order can be adjusted using <alt+[arrow keys]>; the default operation buttons cannot be deleted;',
  // 预设模板注释
  'presetTemplateTopComment':'',
  'presetTemplateInnerTopComment':'',
  'presetTemplateInnerTHeadComment':'You can use <alt+[arrow keys]> to adjust the field order; other modifications are invalid. To customize, please use the custom template below.',
  'presetTemplateInnerTBodyComment':'',
  // 自定义模板
  'customTemplateTopComment':'Here you can write a custom template, the content of the preset template will not be rendered when the effective content is written here.',
  'customScriptTopComment':'',
  // 自定义脚本
  // 函数头
  'customScriptHookFunctionTopComment':`/**
     * Field explanation:
     * @global this: Global reference, vue instance
     * @global list: Global reference, list object
     *
     * @param  data: Parameter field, list data of the current page
     * @param  action: Action object, in the format: { actionCode:'add', name:'add', ... }
     * @param  result: Event processing result, true | false | any
     *
     * @return Promise
     */`,
  // onLoad
  'customScriptHookOnLoadComment':`/**
     * After the list data is loaded
     * @params data
     * @return Promise
     */`,
  // onRendered
  'customScriptHookOnRenderComment':`/**
     * After the list data is rendered
     * @params data
     * @return Promise
     */`,
  // onPreAction
  'customScriptHookOnPreActionComment':`/**
     * Before the action is triggered, return false to prevent subsequent execution, return empty or other do not block
     * @param action
     * @param data
     * @return Promise
     */`,
  // onCustomAction
  'customScriptHookOnCustomActionComment':`/**
     * Custom action execution content, execution will (asynchronous) trigger actionDone
     * @param action
     * @param data
     * @return Promise
     */`,
  // onActionDone
  'customScriptHookOnActionDoneComment':`/**
     * After the operation is completed
     * @param action
     * @param data
     * @params result
     * @return Promise
     */`,
}