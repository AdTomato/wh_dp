
import axios from './axios';

import Mappings from './api.mappings';

import * as user from './users.typings';

import { HttpResponse } from './response';

export class UserApi {

  getUserInfo(id: string):
    Promise<HttpResponse<user.Info>> {
    return axios.get(Mappings.user.getInfo, {
      params: {
        id
      }
    });
  }

  getUserDepartments(id: string):
    Promise<HttpResponse<any[]>> {
    return axios.get(Mappings.user.departments, {
      params: {
        id
      }
    });
  }

};
