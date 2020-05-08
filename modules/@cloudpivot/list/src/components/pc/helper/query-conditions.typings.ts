export enum CheckTypes {
  FromDefault = 0, // 从默认中获取,即queryConditions中判断
  FromFilterData = 1 // 从已填写的查询条件中获取
 }

 export interface FilterData {
  propertyCode: string,
  propertyType: number,
  propertyValue: string
  propertyValueName: string
 }

 export interface QueryCondition {
  accurateSearch: boolean,
  choiceType: number,
  dataStatus: any,
  defaultState: number,
  defaultValue: string,
  displayFormat: string,
  displayType: number,
  endValue: string,
  id: string,
  modifiedTime: string,
  name: string,
  name_i18n: string,
  options: string,
  propertyCode: string,
  propertyType: number,
  queryId: string,
  relativeQueryCode: string,
  relativeSchemaCode: any,
  schemaCode: string,
  sortKey: number,
  startValue: string,
  userOptionType: number,
  visible: boolean
 }
 
 export enum SequenceStatus {
   Draft = 'DRAFT',
   Completed = 'COMPLETED',
   Processing = 'PROCESSING',
   Canceled = 'CANCELED',
 }