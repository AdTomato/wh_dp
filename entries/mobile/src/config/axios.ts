import Vue from 'vue';
import axios from 'axios';
import env from './env';



const prefixs = ['/api', '/externalLink', '/login/mobile/ajax', '/public/system/config'];

const ignoreApis = ['/login/mobile/ajax'];

// 请求拦截器
axios.interceptors.request.use((config) => {
  // prefix.forEach((pre: string) => {
  //   if (!env.enableProxy && (config.url as string).slice(0, pre.length) === pre) {
  //     config.url = `${env.apiHost}${config.url}`;
  //   }
  // });
  // 每次发送请求之前检测localStorage存有token,那么都要放在请求头发送给服务器
  const token = (window as any).externalLinkToken  || localStorage.getItem('token');
  // const token = localStorage.getItem('token');
  if (token && config.url && !ignoreApis.includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (!env.enableProxy && prefixs.some(pre => !!config.url && config.url.slice(0, pre.length) === pre)){
    config.url = `${env.apiHost}${config.url}`;
  }
  
  return config;
}, error => Promise.reject(error));


// 响应拦截器
axios.interceptors.response.use(
  response => response.data,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          if (error.response.config && error.response.config.url.indexOf('public/system/config') === -1 && !window.Environment.isDingTalk) {
            window.location.href = '#/login';
          }
          break;
        case 500:
          break;
        default:
          break;
      }
    }
    return Promise.reject(error);
  }
);
export default axios;
