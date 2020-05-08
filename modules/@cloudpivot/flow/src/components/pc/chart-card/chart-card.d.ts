import { workflow }  from '@cloudpivot/api';

export interface ChartCardOptions {
  record?: workflow.WorkflowTrackLog | any// 流程跟踪日志纪律
  rect?: DOMRect// 需要定位元素的Rect
  estimate?: Boolean// 是否是预估处理人
  fn?: Function // 跳转子流程方法
  i18n?: any // 语言国际化
  statusFn?: Function // 流程状态枚举国际化
}
