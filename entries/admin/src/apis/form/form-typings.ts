
export interface FormItem {

  code: string

  icon: string

  id: string

  name: string

  schemaCode: string

}


export interface FormUpdate {

  /***
   * 表单编码
   */
  code: string

  /**
   * 草稿控件属性
   */
  draftAttributesJson: string

  /**
   * 草稿表单视图
   */
  draftViewJson: string

  icon: string

  id: string

  mobileIsPc?: boolean

  /**
   * 移动访问的url
   */
  mobileUrl?: string

  /**
   * 表单名称
   */
  name: string

  /**
   * pc访问的url
   */
  pcUrl?: string

  /**
   * 打印访问的url
   */
  printIsPc?: boolean

  /**
   * 打印访问的url
   */
  printUrl?: string

  /**
   * 是否发布
   */
  published: boolean

  /**
   * 发布控件属性
   */
  publishedAttributesJson: string

  /**
   * 发布表单视图
   */
  publishedViewJson: string

  /**
   * 数据模型编码
   */
  schemaCode: string

  /**
   * 表单类型 0：默认表单 1：自定义表单
   */
  sheetType: number

  /**
   * 表单类型-显示名称
   */
  sheetTypeName: string

  /**
   * 排序号
   */
  sortKey: number

}