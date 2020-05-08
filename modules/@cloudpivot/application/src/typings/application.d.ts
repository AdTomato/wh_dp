

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
  source: number,
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

interface QueryColumns {
  displayFormat: string,
  id: string,
  name: string,
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

export interface QueryListParams {
  mobile: boolean,
  page: number,
  size: number,
  queryCode: string,
  schemaCode: string,
  filters: Array<Filters>,
  options?: QueryListOptions
}

export interface FormUrlParams {
  bizObjectId: string,
  schemaCode: string,
}

export interface Filters {
  propertyCode: string,
  propertyType: number,
  propertyValue: string
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
export interface ImportParams {
  fileName: string,
  schemaCode: string,
  queryCode: string
}

/**
 * 导入结果代码
 */
export enum ImportResult {
  Success = 0,
  PartialSuccess = 1,
  FileTypeError = 2,
  DataNumExceed = 3,
  DataColumnError = 4,
  SystemError = 5,
  Unspecified = 6
}
export interface DeleteListParams {
  ids: Array<string>,
  schemaCode: string
}

export interface ExportDataParams {
  filters: Array<Filters>,
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
  appCode: string,
  searchKey: string
}