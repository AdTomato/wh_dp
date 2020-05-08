import Vue from 'vue';
import axios from 'axios';
import router from '@/router/';
 
import env from '@/env';
// import OAuthApi from '../apis/oauth';

const prefix = '/api';


// 请求拦截器
axios.interceptors.request.use((config) => {
  if (!env.enableProxy && (config.url as string).slice(0, prefix.length) === prefix) {
    config.url = `${env.apiHost}${config.url}`;
  }


  const expiration = localStorage.getItem('expireTime') ? localStorage.getItem('expireTime') : '';
  const refresh_token = localStorage.getItem('refresh_token');
  const nowDate = new Date().getTime();
  const isOther = /login\/Authentication\/get_refresh_token/g.test(config.url as string);
  // 距离超时时间20分钟时刷新token
  if (nowDate > parseInt(expiration as string) * 1000 - 1200000 && !isOther && nowDate <= parseInt(expiration as string) * 1000 && refresh_token) {
    const params = {
      url: `${env.oauthHost}`,
      client_id: 'api',
      client_secret: `${env.secret}`,
      refresh_token,
    };
    axios.get(`${env.apiHost}/login/Authentication/get_refresh_token`, { params }).then((res: any) => {
      if (res) {
        const token = (res as any).access_token;
        const refresh_tokens = (res as any).refresh_token;
        const expireTime = (res as any).exp;

        localStorage.setItem('refresh_token', refresh_tokens);
        localStorage.setItem('expireTime', expireTime);
        localStorage.setItem('token', token);
      }
    });

  }
  // 每次发送请求之前检测sessionstorage存有token,那么都要放在请求头发送给服务器
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));


// 响应拦截器
axios.interceptors.response.use(
  response => {
    // errcode为700017代表没有权限访问这个接口，跳转无权限提示页面
    if (response.data && (response.data.errcode === 700017 || response.data.errcode === 40005)) {
      window.location.href = env.redirectHost + '/no-permission.html';
    }
    return response.data
  }
  ,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // window.location.href = OAuthApi.OAuthLoginUrl;
          window.location.href = `${env.portalHost}/login`;
          // Vue.prototype.$router && Vue.prototype.$router.replace({path: '/login'});
          break;
        default:
          Vue.prototype.$message.error(error.response.data);
          break;
      }
    }else{
      Vue.prototype.$message.error(error.message);
    }
    return Promise.reject(error);
  }
);
export default axios;
