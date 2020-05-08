import axios from 'axios';

export default {
  /**
   * 列出目录
   */
  listCategory(): Promise<Common.Res<BizService.Category.Item[]>> {
    return axios.get('/api/bizservice/category/list')
  },
  /**
   * 添加目录
   * @param params 
   */
  createCategory(params: BizService.Category.CreateParams): Promise<Common.Response> {
    return axios.post('/api/bizservice/category/create', params)
  },
  /**
   * 更新目录
   * @param params 
   */
  updateCategory(params: BizService.Category.UpdateParams): Promise<Common.Response> {
    return axios.put('/api/bizservice/category/update', params)
  },
  /**
   * 删除目录
   * @param params 
   */
  deleteCategory(params: BizService.Category.DeleteParams): Promise<Common.Response> {
    return axios.delete('/api/bizservice/category/delete', {
      params
    })
  },
}