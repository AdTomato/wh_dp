export interface getParams {
  schemaCode: string
}

export interface permissionProperty {
  bizPermType: number
  groupId?: string
  id?: string
  modifiedTime?: string
  name: string
  name_i18n: string
  propertyCode: string
  propertyType: number
  required: boolean
  visible: boolean
  writeAble: boolean
  schemaCode?: string // 父级数据项code
}

export interface updateParams {
  enabled: boolean
  id?: string
  modifiedTime?: string
  name?: string
  name_i18n?: string
  permProperties: Array<permissionProperty>
  roles: string
  schemaCode: string
}

export interface deleteParams {
  groupId: string
}

export interface getPropertyParams extends deleteParams {}