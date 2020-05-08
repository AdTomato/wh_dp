import * as QueryCondition from './query-conditions.typings';
import { DataItemType } from '@cloudpivot/form/schema';
/**
 * 将搜索条件整理成相关格式得数据
 * 当只有一个搜索条件有值的时候, 展示这个搜索条件 name: content
 * 当搜索条件有多个值的时候, 展示长度
 */
class QueryConditions {
  
  // 空值形式, 每种控件的空值形式一样
  emptyValues:Array<any> = ['', '[]', ';', undefined, '{}', null]

  /** 
   * 判断是否有值
  */
  getValue(type:number, queryConditions:Array<QueryCondition.QueryCondition> = [], filterData:Array<QueryCondition.FilterData> = []){
    if (type === QueryCondition.CheckTypes.FromDefault) {
      return this.getValueFromDefault(queryConditions);
    } else {
      return this.getValueFromFilterData(queryConditions, filterData)
    }
  }

  /**
   * 从默认查询条件中查询
   */
  getValueFromDefault(queryConditions:Array<QueryCondition.QueryCondition>):Array<QueryCondition.QueryCondition>{
    if (queryConditions.length <= 0) return [];
    const arr:Array<QueryCondition.QueryCondition> = [];
    queryConditions.forEach((qc:QueryCondition.QueryCondition) => {
      let isEmpty:boolean = true;
      switch (qc.propertyType) {
        case DataItemType.ShortText:
          isEmpty = !this.getDefaultValue(qc);
          break;
        case DataItemType.LongText:
          isEmpty = !this.getDefaultValue(qc);
          break;
        case DataItemType.Number:
          isEmpty = this.getRange(qc).every((val:string) => !val);
          break;
        case DataItemType.Date:
          isEmpty = this.getRange(qc).every((val:string) => !val);
          break;
        case DataItemType.Logic:
          isEmpty = false;
          break;
        case DataItemType.StaffSelector:
          isEmpty = this.getDefaultValue(qc) === "0"; // 选人控件为空时,defaultValue为"0"
          break;
        case DataItemType.RelevanceForm:
          isEmpty = true; // 关联表单没有默认值
          break;
        case DataItemType.Address:
          isEmpty = !this.getDefaultValue(qc);
          break;
        default:
          break;
      }
      if (!isEmpty) { // 不为空
        arr.push(qc);
      }
    });
    return arr;
  }

  /**
   * 从filtyerData中整合数据
   */
  getValueFromFilterData(queryConditions:Array<QueryCondition.QueryCondition>, filterData:Array<QueryCondition.FilterData>){
    queryConditions = queryConditions.filter((qc:QueryCondition.QueryCondition) => qc.visible);
    // 1. 根据propertyValue判断, 取出有值的搜索条件, 此时需要判断空值
    const vals:Array<any> = [];
    filterData.forEach((filterDataItem:QueryCondition.FilterData) => {
      if (filterDataItem.propertyType === DataItemType.Logic) {
        vals.push(filterDataItem);
      } else if (this.emptyValues.indexOf(filterDataItem.propertyValue) <= -1) {
        vals.push(filterDataItem);
      }
    })

    // 2. 整合数据, 根据propertyCode去queryConditions里面取name和name_i18n
    if (vals.length <= 0 || queryConditions.length <= 0) return []; 
    const arr:Array<any> = [];
    vals.forEach((val:QueryCondition.FilterData) => {
      const cd:QueryCondition.QueryCondition = queryConditions.find((qc:QueryCondition.QueryCondition) => qc.propertyCode === val.propertyCode) as QueryCondition.QueryCondition;
      if (cd) {
        if (cd.propertyCode === 'sequenceStatus') {
          arr.push({
            name: cd.name,
            name_i18n: cd.name_i18n,
            content: this.sequenceStatusTranslator(val.propertyValue),
            type: -2
          })
        } else if (cd.propertyType === DataItemType.RelevanceForm) {
          arr.push({
            name: cd.name,
            name_i18n: cd.name_i18n,
            content: val.propertyValueName,
            type: val.propertyType
          })
        } else {
          arr.push({
            name: cd.name,
            name_i18n: cd.name_i18n,
            content: val.propertyValue,
            type: val.propertyType
          })
        }
      } 
    });
    // 3. 返回出去
    return arr;
  }


  /** 
   * 从defaultValue中获取默认值
  */
  getDefaultValue(qc:QueryCondition.QueryCondition):string{
    return qc.defaultValue;
  }

  /** 
   * 从startValue endValue中获取值
  */
  getRange(qc:QueryCondition.QueryCondition):Array<string>{
    return [qc.startValue, qc.endValue];
  }

  /**
   * 取逻辑默认值
  */
  getLogicDefaultValue(qc:QueryCondition.QueryCondition){
    return qc.defaultState;
  }

  /** 
   * 根据类型获取默认值
  */
  value(qc:QueryCondition.QueryCondition){
    let v:any;
    switch (qc.propertyType) {
      case DataItemType.ShortText:
        v = this.getDefaultValue(qc);
        break;
      case DataItemType.LongText:
        v = this.getDefaultValue(qc);
        break;
      case DataItemType.Number:
        v = this.getRange(qc);
        break;
      case DataItemType.Date:
        v = this.getRange(qc);
        break;
      case DataItemType.Logic:
        v = this.getLogicDefaultValue(qc);
        break;
      case DataItemType.StaffSelector:
        v = this.getDefaultValue(qc); // 选人控件为空时,defaultValue为"0"
        break;
      case DataItemType.Address:
        v = this.getDefaultValue(qc);
        break;
      default:
        break;
    }
    return v;
  }

  /**
   * 单据状态转换成多语言
   */
  sequenceStatusTranslator(value:string){
    const arr:Array<string> = value.split(';');
    const zhVal:Array<any> = [];
    arr.forEach((val:string) => {
      switch(val){
        case QueryCondition.SequenceStatus.Draft:
          zhVal.push('草稿');
          break;
        case QueryCondition.SequenceStatus.Completed:
          zhVal.push('已完成');
          break;
        case QueryCondition.SequenceStatus.Processing:
          zhVal.push('进行中');
          break;
        case QueryCondition.SequenceStatus.Canceled:
          zhVal.push('已作废');
          break;
        default:
          break;
      }
    });
    return {"en": value, "zh": zhVal.join(';')}
  }
}

export default new QueryConditions();