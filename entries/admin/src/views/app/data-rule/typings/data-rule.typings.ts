export enum ModelType {
  CurModel = 'current',
  TargetModel = 'target'
}

export enum ValueType {
  DynamicValue = 1,
  FixedValue = 2,
  ToBeNull = 3
}

export interface ValueItem {
  index: string,
  name: string,
  disabled: boolean
}

export enum DataType {
  Filter = 'filter',
  Action = 'action',
  DataCondition = 'dataCondition',
  SheetFilter = 'sheetFilter',
  MainQuery = 'mainQuery'
}

export enum TriggerActionType {
  Add = 1,
  Update = 2,
  Delete = 3
}

export enum ConditionType {
  Equal = 1,
  NotEqual = 2,
  Greater = 3,
  Smaller = 4,
  GreaterEqual = 5,
  SmallerEqual = 6
}

 export enum ActionType {
   Equal = 1,
   Accumulation = 2,
   Deduction = 3
 }

export enum OperationMode {
  Add = 'add',
  Edit = 'edit'
}

export interface FilterFieldParams{
  curChangingModel: string, // 模型类型 变化的是过滤条件还是数据动作
  curDataType: string, // 数据类型 变化的是目标字段还是当前字段
  index: number,  // 当前下标
  propertyType: number, // 当前所选字段的数据类型
  relativeCode: string, // 所关联表单的code
  value: string // 当前选中的值
}

export interface OperatorChangeParams {
  curDataType: string, // 数据类型 变化的是目标字段还是当前字段
  value:number, // 当前操作符的值
  index: number, // 当前下标
}

export interface ValueChangeParams {
  curDataType: string, // 数据类型 变化的是目标字段还是当前字段
  value:number, // 当前操作符的值
  index: number, // 当前下标
}

export enum ButtonTypes {
  FilterCondition = 1,
  DataAction = 2,
  DataCondition = 3
}

export enum ValueDisplay {
  Input = 1,
  Select = 2,
  StaffSelector = 3
}

export enum DataConditionFilterType {
  EQ = 1,
  NEQ = 2, 
  GT = 3,
  LT = 4,
  GTEQ = 5,
  LTEQ = 6,
  CT = 7, // 包含
  NCT = 8,
  EP = 9, // 为空
  NEP = 10,
  OF = 11 // 属于
}

export enum ValueDisplay {
  CommonInput = 1,
  DateInput = 2,
  NumberInput = 3,
  Null = 4,
  Logic = 5,
  Staff = 6,
  SeqState = 7
}

export enum DataType {
  MainCondition = 1, // 主表条件
  SheetCondition = 2, // 子表条件
  QueryMain = 3, // 查找主表
  DataAcition = 4 // 数据动作
}