/*
 * @Author: nooldey <nooldey@gmail.com> 
 * @Date: 2019-02-18 11:52:35 
 * @Last Modified by: nooldey
 * @Last Modified time: 2019-02-18 15:51:11
 * 业务集成相关状态管理
 */
import Category from './category';
import Service from './service';
import Methods from './methods';
export default {
  namespaced: true,
  modules: {
    Category,
    Service,
    Methods
  }
}