export interface ListItem {

  code: string

  icon: string

  id: string

  name: string

  schemaCode: string

  queryPresentationType: string

}

export interface SortParams {

  code: string

  schemaCode: string

  sortKey: number

}

export interface ShowOnParams {

  code: string

  schemaCode: string

  showOnMobile: boolean

  showOnPc: boolean

}