export * from './response';


export interface LoadParams {

  schemaCode: string

  sheetCode: string

}

/**
 * 表单单据状态
 */
export enum SequenceStatus {

  /**
   * 草稿
   */
  Draft = 'DRAFT',

  /**
   * 进行中
   */
  Processing = 'PROCESSING',

  /**
   * 已完成
   */
  Completed = 'COMPLETED',

  /**
   * 已作废
   */
  Canceled = 'CANCELED',

  /**
   * 流程异常
   */
  Exception = 'EXCEPTION'
}


export const sequenceStatusZh : any = {
  [SequenceStatus.Draft]:'草稿',
  [SequenceStatus.Processing]:'进行中',
  [SequenceStatus.Completed]:'已完成',
  [SequenceStatus.Canceled]:'已作废',
  [SequenceStatus.Exception]:'流程异常',
};

export interface BizObject {

  id: string
  /**
   * 表单编码
   */
  sheetCode?: string

  /**
   * 模型编码
   */
  schemaCode?: string

  /**
   * 流程实例ID
   */
  workflowInstanceId?: string

  data: any

  [key: string]: any
}


export interface FormObject {

  workItemId?: string

  workflowCode?: string

  workflowInstanceId?: string

  workflowTokenId?: string
  
  workflowVersion?: number

  /**
   * 已第一次提交
   */
  workflowInstanceIsSubmit: boolean

  /**
   * 当前活动节点Code
   */
  activityCode?: string

  /**
   * 当前活动节点名称
   */
  activityName?: string

  instanceName?: string

  bizObject: BizObject

  bizSchema: any

  bizSheet: any

  commentInfo: any

  /**
   * 当前用户所属部门列表
   */
  departments: {
    id: string
    name: string
    [key: string]: any
  }[]

  /**
   * 表单权限
   */
  formPermission: {

    /**
     * 按钮权限
     */
    actionPermission: { [key: string]: boolean }

    /**
     * 数据权限
     */
    dataPermissions: {
      [key: string]: {
        /**
         * 可见
         */
        v: boolean
        /**
         * 可编辑
         */
        e: boolean
        /**
         * 必填
         */
        r: boolean
      }
    }

  }

}




/**
 * 暂存参数
 */
export interface SaveParams {
  /**
   * 工作项ID
   */
  workItemId?: string
  /**
   * 流程编码
   */
  workflowCode?: string
  /**
   * 流程实例ID
   */
  workflowInstanceId?: string

  bizObject: BizObject

  /**
   * 是否保存BizObject
   */
  saveBizObject?: boolean

  approval ?: any
}


/**
 * 提交参数
 */
export interface SubmitParams extends SaveParams {

  formType: string

  agree: boolean

  depatmentId: string

  actionCode: string

}


/**
 * form/delete 参数
 */
export interface DeleteFormParams {
  schemaCode: string
  objectId: string
}

/**
 * 保存催办消息 参数
 */
export interface SaveDingParams {
  urgeType: number,
  instanceId: string,
  text: string
}

/**
 * 子表导入参数
 */

export interface ImportSheetParams {
  fileName: string  //文件名
  formCode: string //表单编码
  schemaCode: string // 模型编码
  objectId: string // 数据id
  objectIds: string[] // 选择中 要导入的id
  sequenceStatus: string // 流程状态
  startWorkflowCode: string // 发起节点编码
  subSchemaCode: string // 子表编码
  workitemId: string // 代办id
}

/**
 * 更新表单排序
 */
export interface UpdateSortkeyParams {
  sheetCode: string
  schemaCode: string
  sortKey: number
}

/**
 * 获取打印模板draftAttributesJson的数据参数约束
 */

export interface getDraftAttributesJsonParams {
  sheetCode: string,
  schemaCode: string
}


export interface getMessageFormUrlParams {

  messageId: string

}


export interface getMessageFormUrlResult {

  bizObjectId: string

  workItemId: string

  workflowInstanceId: string

  schemaCode: string

  sheetCode: string
  
}