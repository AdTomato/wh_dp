import axios from 'axios';

export default {
  /**
   * 根据服务编码获取服务方法
   * @param params 
   */
  listMethodsByCode(params: BizService.Method.ListByCodeParams)
    : Promise<Common.Res<BizService.Method.Item[]>> {
    return axios.get('/api/bizservice/method/list_by_service_code', {
      params
    })
  },
  /**
   * 创建服务方法
   * @param params 
   */
  createMethod(params: BizService.Method.CreateParams): Promise<Common.Response> {
    return axios.post('/api/bizservice/method/create', params)
  },
  /**
   * 删除服务方法
   * @param params 
   */
  deleteMethod(params: BizService.Method.DeleteParams): Promise<Common.Response> {
    return axios.delete('/api/bizservice/method/delete', {
      params
    })
  },
  /**
   * 更新服务方法
   * @param params 
   */
  updateMethod(params: BizService.Method.UpdateParams): Promise<Common.Response> {
    return axios.put('/api/bizservice/method/update', params)
  },
  /**
   * 获取服务方法详情
   * @param params 
   */
  getMethodDetails(params: BizService.Method.DetailsParams)
    : Promise<Common.Res<BizService.Method.Item>> {
    return axios.get('/api/bizservice/method/get', {
      params
    })
  },
  /**
   * 运行服务方法
   * @param params 
   */
  testMethod(params: BizService.Method.TestParams): Promise<Common.Response> {
    return axios.put('/api/bizservice/method/service_test', params)
  },
  /**
   * 列出参数应用位置选项
   */
  listLocationType(): Promise<Common.Response> {
    return axios.get('/api/bizservice/method/list_location_type')
  },
  /**
   * 列出参数类型选项
   */
  listParamType(): Promise<Common.Response> {
    return axios.get('/api/bizservice/method/list_param_type')
  },
  listHttpType(): Promise<Common.Response> {
    return axios.get('/api/bizservice/method/list_http_type')
  }
}