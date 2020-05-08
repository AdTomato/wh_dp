
import { schema } from '@cloudpivot/form';

type DataItemType = schema.DataItemType;

export interface DataItem {

  id?: string

  code: string

  name: string

  name_i18n?:string

  type: DataItemType

  isSystem: boolean

  published: boolean

  properties?: DataItem[]

  parentCode?: string

  defaultValue?: any

  propertyIndex?: boolean

  propertyEmpty?: boolean

  schemaCode?: string

  relativeCode?: string

  relativeName?: string

  appFunctionCode?: string

  appPackageCode?: string

}

// /**
//  * 数据项类型
//  */
// export enum DataItemType {

//   /**
//    * 短文本
//    */
//   ShortText = 0,

//   /**
//    * 长文本
//    */
//   LongText = 1,

//   /**
//    * 数值
//    */
//   Number = 2,

//   /**
//    * 日期
//    */
//   Date = 3,

//   /**
//    * 逻辑
//    */
//   Logic = 4,

//   /**
//    * 选人控件
//    */
//   StaffSelector = 5,

//   /**
//    * 附件
//    */
//   Attachment = 6,

//   /**
//    * 审批意见
//    */
//   ApprovalOpinion = 7,

//   /**
//    * 子表
//    */
//   Sheet = 8,

//   /**
//    * 关联表单
//    */
//   RelevanceForm = 9

// }