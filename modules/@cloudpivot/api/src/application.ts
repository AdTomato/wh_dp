

/**
 * 定义流程api相关接口
*/
export interface List {
  code: string,
  disabled: boolean,
  id: string,
  logoUrl: string,
  logoUrlId: string,
  name: string,
  sortKey: number
}

export interface tree {
  appCode: string,
  bizSchemaCode: string,
  children: Array<tree>,
  code: string,
  icon: string,
  id: string,
  name: string,
  name_i18n?: string,
  parentId: string,
  sortKey: number,
  type: string
}

export interface IsMobileSchema {
  isMobile: boolean
}

export interface FolderSchema {
  appCode: string,
  isMobile: boolean
}

export interface folderIdSchema {
  id: string
}

export interface ListConfigSchame {
  code: string,
  schemaCode: string,
  source?: number,
  clientType?: string
}

export interface ListConfigData {
  code: string,
  icon: string,
  id: string,
  name: string,
  queryActions: Array<QueryActions>,
  queryColumns: Array<QueryColumns>,
  queryConditions: Array<QueryConditions>,
  querySorts: Array<QuerySorts>,
  schemaCode: string,
  sortKey: number
}

export interface QueryActions {
  actionCode: string,
  associationCode: string,
  associationType: number,
  checked: false,
  customService: false,
  icon: string,
  id: string,
  name: string,
  queryActionType: number,
  queryId: string,
  schemaCode: string,
  scopedSlots: string,
  serviceCode: string,
  serviceMethod: string,
  sortKey: number,
}

export interface QueryColumns {
  displayFormat: number,
  id: string,
  name: string,
  name_i18n: string,
  propertyCode: string,
  propertyType: number,
  queryId: string,
  schemaCode: string,
  scopedSlots: string,
  sortKey: number,
  sumType: number,
  unit: number,
  width: string
}

export interface QueryConditions {
  choiceType: number,
  dataStatus: number,
  defaultValue: any,
  displayType: number,
  endValue: string,
  id: string,
  name: string,
  options: string,
  propertyCode: string,
  propertyType: number,
  queryId: string,
  schemaCode: string,
  scopedSlots: string,
  sortKey: number,
  startValue: string,
  userOptionType: number,
  visible: false
}

interface QuerySorts {
  direction: number,
  id: string,
  name: string,
  propertyCode: string,
  propertyType: number,
  queryId: string,
  schemaCode: string,
  scopedSlots: string,
  sortKey: number
}

export interface QueryHeaderParams {
  schemaCode: string,
  clientType: QueryClientType
}

export interface QueryListParams {
  mobile: boolean,
  page: number,
  size: number,
  queryCode: string,
  schemaCode: string,
  filters: Array<Filters>,
  options?: QueryListOptions,
  formCode?: string,
  reverseCode?: string,
  reverseSchemaCode?: string
}

export interface FormUrlParams {
  bizObjectId: string,
  schemaCode: string,
  formCode?: string,
}

export interface Filters {
  propertyCode: string,
  propertyType: number,
  propertyValue: string
}

export enum QueryClientType {

  /**
   *客户端类型--PC
   */
  PC = 'PC',

  /**
   * 客户端类型--MOBILE
   */
  APP = 'APP',

  /**
   * 客户端类型--OTHER
   */
  OTHER = 'OTHER'

}

export enum QueryDisplayType {

  /**
   * 默认展示查询列表配置的显示字段
   */
  Default = '0',

  /**
   * 覆盖展示查询列表配置的显示字段
   */
  Override = '1',

  /**
   * 在查询列表配置的显示字段的基础上新增显示字段
   */
  Append = '2'

}

export interface QueryListOptions {

  customDisplayColumns: string[]

  queryDisplayType: QueryDisplayType

}

/**
 * 下载示例文件请求参数
 */
export interface ExportTemplateParams {
  schemaCode: string,
  queryCode: string
}


/**
 * 导入请求参数
 */
export interface SecondImportParams {
  headColumns: Array<any>,
  secondImportData: Array<any>,
  queryField: string,
}

export interface ImportParams {
  fileName: string,
  schemaCode: string,
  queryCode: string,
  queryField: string,
}

/**
 * 导入结果代码
 */
export enum ImportResult {
  None = -1, 
  Success = 0, // 导入成功
  PartialSuccess = 1, // 导入部分成功
  FileTypeError = 2, // 文件类型错误
  DataNumExceed = 3, // 数据超过500限制
  DataColumnError = 4, // 文件展示头信息错误
  SystemError = 5, // 系统错误
  Unspecified = 6, // 表单关联了流程实例
  TemplateEmpty = 7, // 模板为空，请填写信息
  FaileReImport = 8, // 选人数据项填入的值不唯一或者为空，请确定后再导入这部分内容
}
export interface DeleteListParams {
  ids: Array<string>,
  schemaCode: string
}

export interface ExportDataParams {
  filters: Array<Filters>,
  allObjectId?: any,
  columns?: any,
  objectIds?: any,
  mobile: boolean,
  page: number,
  queryCode: string,
  schemaCode: string,
  size: number
}

export interface WorkflowSchemaCode {
  schemaCode: string
}

export interface AppCode {
  appCode: string
}

export interface SearchBizModelRequest {
  appCode?: string,
  searchKey: string
}


export interface AppPackageSearch {

  name: string

  appCode?: string

}

export interface GenShortCodesParams {
  pairSettingModels: Array<ShortCodeParams>
}

interface ShortCodeParams {
  pairValue: string
}

export interface GetReportParams {
  code: string
}

export interface FormItem {
  schemaCode: string
  id: string
  data: FormData
  instanceId: string
  sequenceStatus: string
  modifiedTime: string
  return?: any
}

interface FormData {
  instanceId: string
  startTime: string
  finishedTime: string
  imgUrl: string
  userName: string
  name: string
  sheetCode: string
  modifiedTime: string
  createdTime: string
}
