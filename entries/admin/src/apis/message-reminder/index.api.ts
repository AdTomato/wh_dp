import axios from 'axios'

export default {
  /**
   * 获取消息提醒列表
   * @param params
   */
  getList(params: any) {
    return axios.get('/api/app/remind/list', {
      params
    })
  },

  /**
   * 创建表单消息提醒
   * @param params
   */
  createListItem(params: any) {
    return axios.post('/api/app/remind/create', params)
  },

   /**
   * 更新表单消息提醒
   * @param params
   */
  upDateListItem(params: any) {
    return axios.post('/api/app/remind/update', params)
  },

  /**
   * 切换消息列表中某个item的enable值
   * @param params
   */
  switchListItem(params: any) {
    return axios.post('/api/app/remind/updateEnable', params)
  },

  /**
   * 删除消息列表中的某个item
   * @param params
   */
  delListItem(params: any) {
    return axios.post('/api/app/remind/delete', params)
  },

  /**
   * 获取枚举数据接口
   */
  getEnumList() {
    return axios.get('/api/app/remind/list_all_type')
  }
}

