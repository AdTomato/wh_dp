/**
 * 流程中心
 */

// import { Vue } from 'vue-property-decorator';

export enum SelectKeysMapping {
  MyUnfinishedWorkItem = 1,
  MyUnReadWorkItem = 2,
  MyFinishedWorkItem = 3,
  MyReadWorkItem = 4,
  MyWorkflow = 5,
  QueryInstance = 6,
  QueryParticipantWorkItem = 7,
  MyComments = 8
 }

// 超时
export enum WorkItemTimeoutStatus {
  TIMEOUT = 'TIMEOUT',
  RED = 'RED',
  ORANGE = 'ORANGE',
  NORMAL = 'NORMAL'
}

// 已读标识
export enum WorkItemStatus {
  NOTSTART = 1,
  INPROGESS = 2
}

export enum WorkflowInstanceState {
  DRAFT = 'DRAFT',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
  EXCEPTION = 'EXCEPTION',
}

export enum ApprovalState {
  AGREE = 1,
  REJECT = 2,
  FORWARD = 3,
  CANCELLED = 4,
  UNDO = 5
}

export interface TableHeaderFix {
  vm: any,
  type: string
}

/**
 * 路由名称
 */
export enum WorkflowCenterRouter {
  MyUnfinishedWorkItem = 'myUnfinishedWorkItem',
  StartWorkflow = 'startWorkflow',
  MyUnReadWorkItem = 'myUnReadWorkItem',
  MyFinishedWorkItem = 'myFinishedWorkItem',
  MyReadWorkItem = 'myReadWorkItem',
  MyWorkflow = 'myWorkflow',
  QueryInstance = 'queryInstance',
  QueryParticipantWorkItem = 'queryParticipantWorkItem',
}

/**
 * 计算表格最大高度的类型
 */
export enum CalculateMaxHeightTypes {
  OnlyTable = 'onlyTable', // 只有表格
  HasBtns = 'hasBtns', // 有操作按钮
  HasFilters = 'hasFilters', // 有过滤条件
  HasTabsAndFilters = 'hasTabsAndFilters' // 有过滤条件和tab切换
}
