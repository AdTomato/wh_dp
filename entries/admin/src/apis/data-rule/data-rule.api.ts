import axios from 'axios';

import * as DataRuleType from './data-rule.typings';

const path = '/api/app/bizrule';

/**
 * 获取数据规则列表
 */
export function list(params: DataRuleType.ListParams): Promise<Common.Data>{
  return axios.get(`${path}/list`, { params });
}


/**
 * 创建数据规则
 */
 export function create(params:DataRuleType.RuleModel): Promise<Common.Data>{
  return axios.put(`${path}/create`, params)
 }


 /**
  * 获取所有数据规则类型
  */
 export function listAllType(){
   return axios.get(`${path}/list_all_type`);
 }


 /** 
  * 启用数据规则
 */
 export function updateEnable(params:DataRuleType.UpdateEnableParams): Promise<Common.Data>{
  return axios.put(`${path}/updateEnable`, null, {params});
 }


/**
 * 删除数据规则
 */
export function deleteDataRule(params:DataRuleType.IdParams):Promise<Common.Data> {
  return axios.delete(`${path}/delete`, { params })
}


/**
 * 获取单条数据规则详情
 */
export function getDetail(params:DataRuleType.IdParams):Promise<Common.Data>{
  return axios.get(`${path}/get`, {params})
}

/** 
 * 更新数据规则
 * PUT /api/app/bizrule/update
*/
export function update(params:DataRuleType.RuleModel): Promise<Common.Data>{
  return axios.put(`${path}/update`, params);
}