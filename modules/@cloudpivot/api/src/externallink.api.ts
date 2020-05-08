
import Axios from './axios';

import Mappings from './api.mappings';

import * as externallink from './externallink-params';

export class ExternalLinkApi {
  sheet(id: string):any {
    const params = {
      id,
    }
    return Axios.get(Mappings.externalLink.sheet, { params });
  }

  /**
   * 根据url获取图片文件流
   * @param string 图片获取地址
   */
  generateQrcode(string:string):any{
    const params = {
      text: string
    }
    return Axios.get(Mappings.externalLink.generateQrcode, {
      params,
      responseType: 'arraybuffer'
    });
  }


  getShortCode(params:externallink.GetShortCodeParams):any {
    return Axios.post(Mappings.externalLink.getShortCode, params);
  }
}