import Axios from './axios';

import Mappings from './api.mappings';

import { HttpResponse } from './response';

export class InitialInstanceApi {
  /* 获取可发起流程的应用列表 */
  listMyWorkflow(isMobile: boolean = false): Promise<HttpResponse<any>> {
    return Axios.get(Mappings.workflow.listMyWorkflow, {
      params: {
        isMobile: !!isMobile
      }
    });
  }

  /* 根据目录ID获取该目录下的流程数据 */
  listMyWorkflowByFolderId(id:string, isMobile?:boolean): Promise<HttpResponse<any>> {
    return Axios.get(Mappings.workflow.listMyWorkflowByFolderId, {
      params: {
        id,
        isMobile: !!isMobile
      }
    });
  }

  /* 查询常用流程 */
  listFavoriteWorkflows():Promise<HttpResponse<any>> {
    return Axios.get(Mappings.workflow.listFavoritesWorkflow);
  }

  /* 根据流程名称查询流程 */
  listWorkflowsByName(params:any): Promise<HttpResponse<any>> {
    return Axios.get(Mappings.workflow.listMyWorkflowByName, {
      params
    });
  }

};
