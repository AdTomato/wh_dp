import axios from 'axios';

const prefix = '/api/qrcode';
export default {
  /**
   * 签到接口
   */
  signIn(params: any):
    Promise<Common.Data> {
    return axios.post(`${prefix}/save`, params);
  },
  /**
   * 生成二维码
   */
  generateQrcode(params: any):
    Promise<Common.Data> {
    return axios.post(`${prefix}/generate_qrcode`, params);
  },
};
