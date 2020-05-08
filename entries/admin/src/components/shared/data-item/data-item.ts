
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

  /**
   * 等于
   */
  Equal = 1,

  /**
   * 不等于
   */
  NotEqual = 2,

  /**
   * 大于
   */
  GreaterThan = 3,

  /**
   * 小于
   */
  LessThan = 4,

  /**
   * 大于等于
   */
  GreaterThanOrEqual = 5,

  /**
   * 小于等于
   */
  LessThanOrEqual = 6,

  /**
   * 包含
   */
  Contains = 7,

  /**
   * 不包含
   */
  NotContains = 8,

  /**
   * 为空
   */
  IsNull = 9,

  /**
   * 不为空
   */
  IsNotNull = 10,

  /**
   * 属于
   */
  Of = 11,

  /**
   * 不属于
   */
  NotOf = 12,
}

/**
 * 逻辑型数据项操作符集合
 */
export const logicDataItemOperators = [
  {
    label: '==',
    value: DateItemOperatorType.Equal
  }
];
/**
 * 业务数据项操作符集合
 */
export const businessDataItemOperators = [
  {
    label: '为空',
    value: DateItemOperatorType.IsNull
  }, {
    label: '不为空',
    value: DateItemOperatorType.IsNotNull
  }
];

export const sequenceStatusOperators = [
  // {
  //   label: '为空',
  //   value: DateItemOperatorType.IsNull
  // }, {
  //   label: '不为空',
  //   value: DateItemOperatorType.IsNotNull
  // },
  {
    label: '==',
    value: DateItemOperatorType.Equal
  },
  {
    label: '!=',
    value: DateItemOperatorType.NotEqual
  }
];


/**
 * 数值型数据项操作符集合
 */
export const numberDataItemOperators = [
  ...sequenceStatusOperators,
  {
    label: '>',
    value: DateItemOperatorType.GreaterThan
  }, {
    label: '<',
    value: DateItemOperatorType.LessThan
  }, {
    label: '>=',
    value: DateItemOperatorType.GreaterThanOrEqual
  }, {
    label: '<=',
    value: DateItemOperatorType.LessThanOrEqual
  }, {
    label: '为空',
    value: DateItemOperatorType.IsNull
  }, {
    label: '不为空',
    value: DateItemOperatorType.IsNotNull
  }];


/**
 * 文本型数据项操作符集合
 */
export const systemTextDataItemOperators = [
  ...sequenceStatusOperators,
  {
    label: '包含',
    value: DateItemOperatorType.Contains
  }, {
    label: '不包含',
    value: DateItemOperatorType.NotContains
  }];

/**
 * 文本型数据项操作符集合
 */
export const textDataItemOperators = [
  ...sequenceStatusOperators,
  {
    label: '为空',
    value: DateItemOperatorType.IsNull
  }, {
    label: '不为空',
    value: DateItemOperatorType.IsNotNull
  },
  {
    label: '包含',
    value: DateItemOperatorType.Contains
  }, {
    label: '不包含',
    value: DateItemOperatorType.NotContains
  }];



/**
 * 选人数据项操作符集合
 */
export const staffDataItemOperators = [
  // {
  //   label: '为空',
  //   value: DateItemOperatorType.IsNull
  // }, {
  //   label: '不为空',
  //   value: DateItemOperatorType.IsNotNull
  // },
  // {
  //   label: '包含',
  //   value: DateItemOperatorType.Contains
  // }, {
  //   label: '不包含',
  //   value: DateItemOperatorType.NotContains
  // },
  // {
  //   label: '位于',
  //   value: DateItemOperatorType.In
  // }, {
  //   label: '不位于',
  //   value: DateItemOperatorType.NotIn
  // },
  {
    label: '属于',
    value: DateItemOperatorType.Of
  },
  // {
  //   label: '不属于',
  //   value: DateItemOperatorType.NotOf
  // },
  // {
  //   label: '拥有',
  //   value: DateItemOperatorType.Have
  // }, {
  //   label: '不拥有',
  //   value: DateItemOperatorType.NotHave
  // }
];
/**
 * 选人数据项操作符集合 业务相关人员
 */
export const bussinessStaffDataItemOperators = [
  {
    label: '等于',
    value: DateItemOperatorType.Equal
  }, {
    label: '不等于',
    value: DateItemOperatorType.NotEqual
  },
  {
    label: '包含',
    value: DateItemOperatorType.Contains
  }, {
    label: '不包含',
    value: DateItemOperatorType.NotContains
  }
];

export abstract class OperatorService {

  static findByLabel(type: DataItemType, label: string) {
    let operator;
    if (type === DataItemType.Number || type === DataItemType.Date) {
      operator = numberDataItemOperators.find((o: any) => o.label === label);
    } else if (type === DataItemType.Logic) {
      operator = logicDataItemOperators.find((o: any) => o.label === label);
    } else if (type === DataItemType.StaffSelector) {
      operator = staffDataItemOperators.find((o: any) => o.label === label);
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
    } else if (type === DataItemType.StaffSelector) {
      operator = staffDataItemOperators.find((o: any) => o.value === value);
    } else {
      operator = textDataItemOperators.find((o: any) => o.value === value);
    }
    return operator;
  }

}