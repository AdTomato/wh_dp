
export interface DataItem {

  code: string

  name: string

  type: DataItemType

  isSystem: boolean

  published: boolean

  properties?: DataItem[]

  parentCode?: string

  defaultValue?:any

}

/**
 * 数据项类型
 */
export enum DataItemType {

  /**
   * 短文本
   */
  ShortText = 0,

  /**
   * 长文本
   */
  LongText = 1,

  /**
   * 数值
   */
  Number = 2,

  /**
   * 日期
   */
  Date = 3,

  /**
   * 逻辑
   */
  Logic = 4,

  /**
   * 选人控件
   */
  StaffSelector = 5,

  /**
   * 附件
   */
  Attachment = 6,

  /**
   * 审批意见
   */
  ApprovalOpinion = 7,

  /**
   * 子表
   */
  Sheet = 8,

  /**
   * 关联表单
   */
  RelevanceForm = 9,

  Address = 10
}
