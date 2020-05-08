
import { BizObject } from './form-params';

/**
 * 流程action 后台API接口
 */
export enum WorkflowApiActionStatus {
  APPROVAL = 0,
  SUBMIT = 1,
  CANCELLED = 2,
  AGREE = 3,
  DISAGREE = 4,
  ADJUSTPARTICIPATORS = 5,
  ASSIST = 6,
  FORWARD = 7,
  REJECT = 8,
  FINISHED = 9
}

/**
 * 流程action Web映射
 */
export enum WorkflowWebActionStatus {
  APPROVAL = '意见',
  SUBMIT = '提交',
  CANCELLED = '作废',
  AGREE = '同意',
  DISAGREE = '不同意',
  ADJUSTPARTICIPATORS = '加签',
  ASSIST = '协办',
  FORWARD = '转办',
  REJECT = '驳回',
  FINISHED = '结束流程'
}

/**
 * 参与者的类型
 */
export enum WorkflowParticipantType {
  MORMAL = 0,
  FORWARD = 1,
  ASSIST = 2,
  ADD_WORKITEM = 3,
  CIRCULATE_ITEM = 4
}
/**
* 可驳回节点
*/
export interface RejectActivity {
  activityCode: string
  activityName: string
  /**
   * 流程实例状态 ['DRAFT', 'PROCESSING', 'COMPLETED', 'CANCELED']
   */
  status?: string
}

/**
 * 获取可驳回节点列表
 */
export interface GetRejectActivitiesParams {
  /**
   * 流程实例ID
   */
  workflowInstanceId: string
  /**
   * 当前活动节点编码
   */
  activityCode: string
}

/**
 * 更新为已阅
 */
export interface UpdateCirculateReadedParams {
  circulateItemIds: string[]
}

/**
 * 撤回参数
 */
export interface RevokeWorkitemParams {
  /**
   * 当前节点code
   */
  activityCode: string
  /**
   * 流程实例ID
   */
  workflowInstanceId: string
}

/**
 * 驳回参数
 */
export interface RejectParams {

  formType: string

  workItemId: string

  workflowCode: string

  workflowInstanceId: string

  rejectToActivityCode: string

  submitToReject: boolean

  bizObject: BizObject

}


/**
 * 转办参数
 */
export interface ForwardParams {

  comment: string

  workItemId: string

  workflowInstanceId: string

  activityCode: string

  participantors: string[]

}

/**
 * 协办
 */
export interface AssistParams extends ForwardParams {

  // /**
  //  * 记录传阅任务的来源
  //  */
  // circulateResource: string

}

/**
 * 获取审批意见参数
 */
export interface GetCommentParams {
  workItemId: string

  workflowInstanceId: string

  tokenId: string
}


export interface ApprovalValue{

  activityCode: string

  activityName: string

  /**
   * 审批结果. 1: 同意, 2: 不同意, 3: 转办, 0或null: 空(无意义的值)
   */
  result: number

  content: string

  workItemId: string

  workflowInstanceId: string

  workflowTokenId: string

  resources: CommentResource[]
}


export interface BizCommentModel {

  /**
   * 1 审批 2 协办 3 加签. 2, 3不需要审批结果
   */
  actionType: number

  activityCode: string

  activityName: string

  bizPropertyCode: string

  commentTime: string

  content: string

  workItemId: string

  /**
   * 审批结果. 1: 同意, 2: 不同意, 3: 转办, 0或null: 空(无意义的值)
   */
  result: number

  resources: CommentResource[]
}

export interface CommentResource {

  fileExtension: string

  fileSize: number

  id: string

  mimeType: string

  name: string

  refId: string

  schemaCode: string

  storageMethod: string
}

/**
   * 流程基础信息
   */
export interface InstanceBaseInfo {
  participants?: WorkflowNode[]// 当前活动节点
  cancelTime?: string// 作废时间
  finishTime?: string// 结束时间
  headerAction?: HeaderAction// 头部操作区权限
  startTime?: string//开始时间
  status?: string // 流程实例状态 = ['DRAFT', 'PROCESSING', 'COMPLETED', 'CANCELED']
  workflowName?: string// 流程模板名称
  name_i18n?: any // 流程模板名称国际化
  usedTime?: number
}

/**
 * 流程跟踪操作权限
 */
export interface HeaderAction {
  showAdjust?: Boolean// 是否调整节点权限
  showCancel?: Boolean// 是否有作废权限
  showEditable?: Boolean// 是否有编辑权限
  showRemove?: Boolean// 是否有删除权限
  showUserLog?: Boolean// 是否有用户日志权限
}

/**
 * 当前活动节点
 */
export interface WorkflowNode {
  // activityCode?: string// 当前活动节点编码
  activityName?: string// 当前活动节点名称
  name_i18n?: any // 活动节点名称国际化
  participants?: ParticipantInfo[]//流程实例参与者
}

/**
* 流程实例参与者
*/
export interface Participant {
  id?: string //用户id
  name?: string //用户名称 "李思维"
  sourceId?: string //来源id "Activity2"
  sourceName?: string // 来源名称 "填写申请单"
  workItemType?: Number // 来源类型 "NORMAL"
}

export interface ParticipantInfo {

  id: string

  name: string

  sourceId: string

  sourceName: string

  workItemType: string

}

/**
 * 流程跟踪实例参数
 */
export interface GetWorkflowTrackParams {
  workflowInstanceId?: string
  activityCode?: string
}


export enum ActivityStatus {
  UNPASS,// 不通过
  PASS, // 通过
  INPROGRESS, // 进行中
  NOTSTARTED// 未启动
}
/**
 * 审批记录的实例
 */
export interface ApprovalInstance {
  activityCode: string// 当前节点编码 ,
  activityName: string// 当前节点名称 ,
  name_i18n: any // 节点名称国际化
  activityStatus: ActivityStatus// 当前节点状态
  nodes: ApprovalNode[]// 审批节点详情 ,
  subInstanceActivity: Boolean// 当前流程类型：是否是子流程
}

/**
 * 流程记录节点数据
 */
export interface ApprovalNode {
  approvalTime?: string// 审批时间 ,
  approvaler?: any//Users.Info | Users.Info[]//用户信息 ,
  bizComment?: bizComment// 流程意见 ,
  dept?: string// 当前审批人部门 ,
  from?: From //当前流程来源 ,
  resources?: Resource[]// 附件 ,
  subInstanceStatus?: any // 子流程实例状态
  workItemStatus?: WorkflowApiActionStatus// 流程状态：完成FINISHED、进行中INPROGRESS、未打开NOTSTARTED
  workActionType?: string// 流程动作：同意AGREE、不同意DISAGREE ,
  workItemId?: string// 流程任务id ,
  workflowInstanceId?: string// 流程实例id
}
export interface bizComment {
  title: string // 意见标题
  type: WorkflowApiActionStatus // 类型
  text: string // 文本
  userInfos: any //Users.Info[]// 相关人信息
}
/**
 * 流程来源
 */
export interface From {
  fromType: WorkflowApiActionStatus// 来源类型 ,
  userInfo: any// Users.Info[]// 来源人
}

/**
 * 附件
 */
export interface Resource {
  fileExtension: string// 资源文件扩展名 ,
  fileSize: number// 资源大小 ,
  id: string// 资源id ,
  mimeType: string// 资源mime type ,
  name: string// 资源名称 ,
  refId: string// 资源关联id ,
  schemaCode: string// 模型编码 ,
  storageMethod: string// 存储方式
}

export interface SearchParams {
  wd: string,
  appCode?: string,
  page: number,
  size: number
}


/**
 * 操作日志
 */
export interface WorkflowOperationLog {
  client: string// 客户端 ,
  id: string// id
  ip: string// 访问ip ,
  operateNode: string// 操作节点 ,
  operationType: string// 操作类型 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'],
  operationTypeName: string// 操作类型名称 ,
  detail: string// 备注，详细信息 ,
  time: string// 操作时间 ,
  username: string // 用户
}

export interface WorkflowTrackLog {
  activityCode?: string// 节点编码
  activityName?: string// 节点名称
  name_i18n?: any;// 国际化名称
  approvalActionStatus?: WorkflowApiActionStatus// 操作
  finishTime?: string// 完成时间
  originator?: Participant[]// 发起人
  receiveTime?: string// 接收时间
  userTime?: number// 使用时间
  subInstanceActivity: Boolean// 是否是子流程
  subWorkItemId: string// 子流程任务id
  subWorkflowInstanceId: string// 子流程流程实例id
  workItemStatus: number// 任务状态:1 未启动,2 进行中,3 已完成,4 被取消,5 草稿 = ['1', '2', '3', '4', '5']
}

/**
* 流程图
*/
export interface Chart {
  activities?: any[]// 节点
  rules?: any[]// 连接线
  activityStatus?: any[]// 流程状态
  workflowCode?: string//流程编码
}


/**
 * 流程跟踪操作权限
 */
export interface HeaderAction {
  showAdjust?: Boolean// 是否调整节点权限
  showCancel?: Boolean// 是否有作废权限
  showEditable?: Boolean// 是否有编辑权限
  showRemove?: Boolean// 是否有删除权限
  showUserLog?: Boolean// 是否有用户日志权限
}

/**
 * 流程是否被被撤回
 */
export interface GetWorkitem {
  workflowInstanceId: string
}
