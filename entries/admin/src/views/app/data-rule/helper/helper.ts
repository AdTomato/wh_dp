import { pattern } from '@/common/utils';
import AppsApi from '@/apis/apps';

import { DataItemType } from "@cloudpivot/form/schema";

import * as DataRuleTypes from '../typings/data-rule.typings';

export abstract class Helper {
  /**
    * 校验规则名称
  */
  static validateRuleName(name:string){
    const reg:any = pattern('name'); // 使用公共正则;
    const json = {isOk: false, validateMsg: ''}
    
    if(name === '') {
      json.isOk = false;
      json.validateMsg = '规则名称不能为空';
      return json;
    }
  
    if (!reg.test(name)) {
      json.isOk = false;
      json.validateMsg = '仅限50个字符以内，并不能以空格开头';
    } else {
      json.isOk = true;
      json.validateMsg = '';
    }
    return json;
  }

  /**
    * 通过模型编码获取所有数据项
  */
  static async getDataItemsBySchemaCode(schemaCode:string){
    const params:Apps.Datamodel.DataItemListParams = { schemaCode };
    const res = await AppsApi.getDataItemList(params);
    return res;
  }

  /**
   * 找出子表
   */
  static findSubSchema(data:any[]){
    if(!data || !data.length) return ;
    let json:any[] = [];
    data.forEach((item:any) => {
      if(item.propertyType === 8 && item.published) {
        json.push(item);
      }
    })
    return json;
  }

  /**
   * 过滤掉子表且未发布的数据项
   * 20190510 追加过滤项目，附件、审批意见
   */
  static filterSubSchema(data:any[]){
    const unAbledDataItemType:Array<number> = [DataItemType.Sheet, DataItemType.Attachment, DataItemType.ApprovalOpinion];
    if(!data || !data.length) return ;
    let json:any[] = [];
    json = data.filter((item:any) => unAbledDataItemType.indexOf(item.propertyType) <= -1  && item.published);
    return json;
  }

  /**
   * Json结构深复制
   */
  static jsonDeepCopy(json:any){  
    return JSON.parse(JSON.stringify(json));
  }

  /** 
   * 根据数据项类型获取数据条件映射关系
   * @param key 可以时按type取或者按code取
   * @return { filterConditionArr, valueDisplay }
  */
  static getDataConditionFilterMap(key:number|string):Array<number>{
    const dataConditionFilterMap:any = {
      [`type${DataItemType.ShortText}`]: [DataRuleTypes.DataConditionFilterType.CT, DataRuleTypes.DataConditionFilterType.NCT, DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP],
      [`type${DataItemType.LongText}`]: [DataRuleTypes.DataConditionFilterType.CT, DataRuleTypes.DataConditionFilterType.NCT, DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP],
      [`type${DataItemType.Date}`]: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.GT, DataRuleTypes.DataConditionFilterType.LT, DataRuleTypes.DataConditionFilterType.LTEQ, DataRuleTypes.DataConditionFilterType.GTEQ, DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP],
      [`type${DataItemType.Number}`]: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.GT, DataRuleTypes.DataConditionFilterType.LT, DataRuleTypes.DataConditionFilterType.LTEQ, DataRuleTypes.DataConditionFilterType.GTEQ, DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP],
      [`type${DataItemType.Logic}`]: [DataRuleTypes.DataConditionFilterType.EQ],
      [`type${DataItemType.StaffSelector}`]: [DataRuleTypes.DataConditionFilterType.OF, DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP],
      ['creater']: [DataRuleTypes.DataConditionFilterType.OF],
      ['createdDeptId']: [DataRuleTypes.DataConditionFilterType.OF],
      ['owner']: [DataRuleTypes.DataConditionFilterType.OF],
      ['ownerDeptId']: [DataRuleTypes.DataConditionFilterType.OF],
      ['createdTime']: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.GT, DataRuleTypes.DataConditionFilterType.LT, DataRuleTypes.DataConditionFilterType.GTEQ, DataRuleTypes.DataConditionFilterType.LTEQ],
      ['modifiedTime']: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.GT, DataRuleTypes.DataConditionFilterType.LT, DataRuleTypes.DataConditionFilterType.GTEQ, DataRuleTypes.DataConditionFilterType.LTEQ],
      ['sequenceStatus']: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ],
      ['sequenceNo']: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.CT, DataRuleTypes.DataConditionFilterType.NCT],
      ['name']: [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.CT, DataRuleTypes.DataConditionFilterType.NCT],
      ['parentId']: [DataRuleTypes.DataConditionFilterType.EQ],
      ['all']: [
        DataRuleTypes.DataConditionFilterType.EQ,
        DataRuleTypes.DataConditionFilterType.NEQ,
        DataRuleTypes.DataConditionFilterType.GT,
        DataRuleTypes.DataConditionFilterType.LT,
        DataRuleTypes.DataConditionFilterType.GTEQ,
        DataRuleTypes.DataConditionFilterType.LTEQ,
        DataRuleTypes.DataConditionFilterType.CT,
        DataRuleTypes.DataConditionFilterType.NCT,
        DataRuleTypes.DataConditionFilterType.EP,
        DataRuleTypes.DataConditionFilterType.NEP,
        DataRuleTypes.DataConditionFilterType.OF
      ]
    }
    let k:string = '';
    if (typeof key === 'number') {
      k = `type${key}`
    } else {
      k = key
    }
    let backData = [];

    if (dataConditionFilterMap[k]) {
      backData = dataConditionFilterMap[k]
    } else {
      backData = dataConditionFilterMap['all']
    }

    return backData.sort((a:number, b:number) => a - b);
  }

  /**
   * 通过数据项类型与过滤条件决定展示内容
   * @params dataItemType 数据项类型或者数据项code
   * @params filterConditionType 过滤条件类型
  */
 static getDisplayType(dataItemType:number|string, filterConditionType:number):number {

  // 长文本短文本
  if (dataItemType === DataItemType.ShortText || dataItemType === DataItemType.LongText) {
    const commonInputs:Array<number> = [DataRuleTypes.DataConditionFilterType.CT, DataRuleTypes.DataConditionFilterType.NCT, DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ];
    const nullInputs:Array<number> = [DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP];
    if (commonInputs.indexOf(filterConditionType) > -1) {
      return DataRuleTypes.ValueDisplay.CommonInput;
    } else if (nullInputs.indexOf(filterConditionType) > -1) {
      return  DataRuleTypes.ValueDisplay.Null;
    }
  }

  // 日期
  if (dataItemType === DataItemType.Date || dataItemType === DataItemType.Number) {
    const dateInputs:Array<number> = [DataRuleTypes.DataConditionFilterType.EQ,DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.LT, DataRuleTypes.DataConditionFilterType.GT, DataRuleTypes.DataConditionFilterType.LTEQ, DataRuleTypes.DataConditionFilterType.GTEQ];
    const nullInputs:Array<number> =  [DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP];
    if (dateInputs.indexOf(filterConditionType) > -1) {
      return dataItemType === DataItemType.Date ? DataRuleTypes.ValueDisplay.DateInput : DataRuleTypes.ValueDisplay.NumberInput;
    } else if (nullInputs.indexOf(filterConditionType) > -1) {
      return DataRuleTypes.ValueDisplay.Null;
    } 
  }

  // 逻辑
  if (dataItemType === DataItemType.Logic) {
    return DataRuleTypes.ValueDisplay.Logic;
  }

  // 选人控件
  if (dataItemType === DataItemType.StaffSelector) {
    const nullInputs:Array<number> =  [DataRuleTypes.DataConditionFilterType.EP, DataRuleTypes.DataConditionFilterType.NEP];
    if (filterConditionType === DataRuleTypes.DataConditionFilterType.OF) {
      return DataRuleTypes.ValueDisplay.Staff;
    } else if (nullInputs.indexOf(filterConditionType) > -1) {
      return DataRuleTypes.ValueDisplay.Null;
    }
  } 

  // 创建人/所有人/创建人部门/所有人部门
  const createrArr:Array<string> = ['creater', 'createdDeptId', 'owner', 'ownerDeptId'];
  if (createrArr.indexOf(dataItemType as string) > -1) {
    return DataRuleTypes.ValueDisplay.Staff;
  }

  // 创建时间/修改时间
  const createdTimeArr:Array<string> = ['createdTime', 'modifiedTime'];
  if (createdTimeArr.indexOf(dataItemType as string) > -1) {
    const dateInputs:Array<number> = [DataRuleTypes.DataConditionFilterType.EQ,DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.LT, DataRuleTypes.DataConditionFilterType.GT, DataRuleTypes.DataConditionFilterType.LTEQ, DataRuleTypes.DataConditionFilterType.GTEQ];
    if (dateInputs.indexOf(filterConditionType) > -1) {
      return DataRuleTypes.ValueDisplay.DateInput;
    }
  }

  // 单据状态
  if (dataItemType === 'sequenceStatus') {
    const logicArr:Array<number> = [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ];
    if (logicArr.indexOf(filterConditionType) > -1) {
      return DataRuleTypes.ValueDisplay.SeqState;
    }
  }

  // 单据号/数据标题
  const seqArr:Array<string> =  ['sequenceNo', 'name'];
  if (seqArr.indexOf(dataItemType as string) > -1) {
    const commonInputs:Array<number> = [DataRuleTypes.DataConditionFilterType.EQ, DataRuleTypes.DataConditionFilterType.NEQ, DataRuleTypes.DataConditionFilterType.CT, DataRuleTypes.DataConditionFilterType.NCT];
    if (commonInputs.indexOf(filterConditionType) > -1) {
      return DataRuleTypes.ValueDisplay.CommonInput;
    }
  }

  return DataRuleTypes.ValueDisplay.CommonInput;
 }
}