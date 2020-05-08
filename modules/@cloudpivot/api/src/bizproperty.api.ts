
import axios from './axios';

import Mappings from './api.mappings';

import * as bizproperty  from './bizproperty-params';

import { HttpResponse } from './response';

export class BizpropertyApi {

  sortkeys(params: bizproperty.SortkeysParams):
    Promise<HttpResponse<any>> {
    return axios.put(Mappings.bizproperty.sortkeys, params);
  }

};