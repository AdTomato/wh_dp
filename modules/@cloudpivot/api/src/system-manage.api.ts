
import Axios from './axios';

import Mappings from './api.mappings';

import * as systemManage from './system-manage-params';

export class SystemManageApi {
  listBizRuleLog(params: systemManage.ListBizRuleLog):any {
    return Axios.get(Mappings.systemManage.listBizRuleLog, { params });
  }

  getBizRuleLogDetail(id: string):any{
    const params = {
      id
    }
    return Axios.get(Mappings.systemManage.getBizRuleLogDetail, { params });
  }
}