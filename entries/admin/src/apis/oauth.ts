import Axios from 'axios';
import env from '../env';
import qs from 'qs';


const response_type: string = 'code';
const redirect_uri: string = `${env.redirectHost}#/oauth`;
const state: string = '';


const oAuthLoginUrl = `${env.oauthHost}/oauth/authorize`;
const oAuthTokenUrl = `${env.oauthHost}/oauth/token`;

const configUrl = `${env.apiHost}/public/system/config`;

export default {
  getSSOToken(params: OAuth.RequestParams): Promise<OAuth.Response> {
    // 解决跨端口访问时跨域的问题
    return Axios.post(`${oAuthTokenUrl}`, qs.stringify(params), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  OAuthLoginUrl: `${oAuthLoginUrl}?client_id=${env.client_id}&response_type=${response_type}&scope=${env.scope}&state=${state}&redirect_uri=${redirect_uri}`,

  /**
   * 获取系统环境配置
   */
  getSystemConfig(): Promise<any> {
    return Axios.get(`${configUrl}`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }) as any;
  },
};
