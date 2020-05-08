import axios from 'axios';

export default {
  /**
   * 获取业务方法列表
   * @param params 
   */
  listBizMethods(params: BizMethod.ListParam): Promise<Common.Res<BizMethod.MethodItem[]>> {
    return axios.get('/api/app/bizmethod/list', {
      params
    })
  },
  /**
   * 创建业务方法
   * @param params 
   */
  createBizMethod(params: BizMethod.CreateParam): Promise<Common.Response> {
    return axios.post('/api/app/bizmethod/create', params)
  },
  /**
   * 更新业务方法
   * @param params 
   */
  updateBizMethod(params: BizMethod.MethodItem): Promise<Common.Response> {
    return axios.put('/api/app/bizmethod/update', params)
  },
  /**
   * 删除业务方法
   * @param params 
   */
  deleteBizMethod(params: BizMethod.DeleteParam): Promise<Common.Response> {
    return axios.delete('/api/app/bizmethod/delete', {
      params
    })
  },

  /**
   * 保存绑定的集成服务集成方法
   * @param params 
   */
  createBindService(params: BizMethod.CreateBindParam): Promise<Common.Response> {
    return axios.post('/api/app/bizmethod/create_mapping', params)
  },
  /**
   * 删除绑定的集成方法
   * @param params 
   */
  deleteBindService(params: BizMethod.DeleteBindParam): Promise<Common.Response> {
    return axios.delete('/api/app/bizmethod/delete_mapping', {
      params
    })
  },
  /**
   * 更新绑定的集成服务信息
   * @param params 
   */
  updateBindService(params: BizMethod.BindDetailItem): Promise<Common.Response> {
    return axios.put('/api/app/bizmethod/update_mapping', params)
  },
  /**
   * 获取绑定的集成服务的详情信息——编辑时
   * @param params 
   */
  getBindDetail(params: BizMethod.GetBindDetailParam): Promise<Common.Res<BizMethod.BindDetailItem>> {
    return axios.get('/api/app/bizmethod/get_mapping', {
      params
    })
  },
  /**
   * 获取绑定的集成服务的列表--展示
   * @param params 
   */
  listBindServices(params: BizMethod.ListBindServicesParam): Promise<Common.Res<BizMethod.BindDetailItem[]>> {
    return axios.get('/api/app/bizmethod/list_mapping', {
      params
    })
  },
}