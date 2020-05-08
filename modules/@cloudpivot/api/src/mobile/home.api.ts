import Axios from '../axios';
import { HttpResponse } from '../response';

import * as Index from './home-params'

export class HomeApi {
  /**
   *  获取待办列表
   */
  searchWorkitems(params: Index.QueryAwaitParams):Promise<HttpResponse<any>> {
    return Axios.get('/api/runtime/workflow/search_workitems', {
      params
    });
  }

  /**
   * 获取待阅
   */
  searchCirculates(params: Index.QueryAwaitParams):Promise<HttpResponse<any>> {
    return Axios.get('/api/runtime/workflow/search_circulates', {
      params
    });
  }

  /**
   * 获取已办
   */
  getFinishedWorkitems(params: Index.QueryParams):Promise<HttpResponse<any>> {
    return Axios.get('/api/runtime/workflow/list_finished_workitems', {
      params
    });
  }

  /**
   * 获取已阅
   */
  getFinishedCirculates(params: Index.QueryParams):Promise<HttpResponse<any>> {
    return Axios.get('/api/runtime/workflow/list_finished_circulates', {
      params
    });
  }

  /**
   * 标记为已阅
   */
  updateCirculateReaded(circulateItemIds: Array<string>):Promise<HttpResponse<any>> {
    return Axios.post('/api/runtime/workflow/update_circulate_readed', {
      circulateItemIds
    });
  }

  /**
   * 获取待办，待阅数量
   */
  getWorkCount(appCode:string = ''):Promise<HttpResponse<any>> {
    const params = {
      appCode
    };
    return Axios.get('/api/runtime/workflow/get_work_count', { params });
  }
};
