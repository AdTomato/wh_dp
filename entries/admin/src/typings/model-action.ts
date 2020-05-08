/**
 * 标记定位类型
 */
export enum ModalActionTypes {
  DataModel = 1,
  Form = 2,
  Workflow = 3,
  List = 4
}

export enum ModelType {
  // 业务模型
  BizModal = 'BizModel',
  // 自定义页面
  Page = 'Page',
  
  Report = 'Report'
}

export interface ModelActionItem {
  type: number,
  code: string,
  bizSchemaCode: string
}