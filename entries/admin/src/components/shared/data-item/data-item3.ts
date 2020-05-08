import { DataItemType } from "@cloudpivot/form/schema";

export interface DataItem {

  id?: string

  code: string

  name: string

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


/**
 * 数据项操作符
 */
export interface DataItemOperator {

  label: string

  value: string

}

export enum DateItemOperatorType {

  equal = 1,

  notEqual = 2,

  greaterThan = 3,

  lessThan = 4,

  greaterThanOrEqual = 5,

  lessThanOrEqual = 6,

  contains = 7,

  notContains = 8

}

/**
 * 逻辑型数据项操作符集合
 */
export const logicDataItemOperators = [{
  label: '==',
  value: DateItemOperatorType.equal
}
// ,
//  {
//   label: '!=',
//   value: DateItemOperatorType.notEqual
// }
];

export const sequenceStatusOperators = [
  ...logicDataItemOperators,
  {
    label: '!=',
    value: DateItemOperatorType.notEqual
  }
];


/**
 * 数值型数据项操作符集合
 */
export const numberDataItemOperators = [
  ...sequenceStatusOperators,
  {
    label: '>',
    value: DateItemOperatorType.greaterThan
  }, {
    label: '<',
    value: DateItemOperatorType.lessThan
  }, {
    label: '>=',
    value: DateItemOperatorType.greaterThanOrEqual
  }, {
    label: '<=',
    value: DateItemOperatorType.lessThanOrEqual
  }];


/**
 * 文本型数据项操作符集合
 */
export const textDataItemOperators = [
  ...sequenceStatusOperators,
  {
    label: '包含',
    value: DateItemOperatorType.contains
  }, {
    label: '不包含',
    value: DateItemOperatorType.notContains
  }];



export abstract class OperatorService {

  static findByLabel(type: DataItemType, label: string) {
    let operator;
    if (type === DataItemType.Number || type === DataItemType.Date) {
      operator = numberDataItemOperators.find((o: any) => o.label === label);
    } else if (type === DataItemType.Logic) {
      operator = logicDataItemOperators.find((o: any) => o.label === label);
    } else {
      operator = textDataItemOperators.find((o: any) => o.label === label);
    }
    return operator;
  }

  static findByValue(type: DataItemType, value: DateItemOperatorType) {
    let operator;
    if (type === DataItemType.Number || type === DataItemType.Date) {
      operator = numberDataItemOperators.find((o: any) => o.value === value);
    } else if (type === DataItemType.Logic) {
      operator = logicDataItemOperators.find((o: any) => o.value === value);
    } else {
      operator = textDataItemOperators.find((o: any) => o.value === value);
    }
    return operator;
  }

}