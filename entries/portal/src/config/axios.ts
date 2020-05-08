import Vue from 'vue';
import axios from 'axios';
import env from './env';

const prefixs = ['/api', '/externalLink', '/login/mobile/ajax', '/public/system/config'];

// 请求拦截器
axios.interceptors.request.use((config) => {
  // debugger
  // prefix.forEach((pre: string) => {
  //   if (!env.enableProxy && (config.url as string).slice(0, pre.length) === pre) {
  //     config.url = `${env.apiHost}${config.url}`;
  //   }
  // });

  if (!env.enableProxy && prefixs.some(pre => !!config.url && config.url.slice(0, pre.length) === pre)){
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
      // console.log(res);
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

  // 每次发送请求之前检测localStorage存有token,那么都要放在请求头发送给服务器
  const token = (window as any).externalLinkToken || localStorage.getItem('token');
  // const token = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOlsiYXBpIl0sInVzZXJfaWQiOiIyYzkyODBhMjY3MDZhNzNhMDE2NzA2YTkzY2NmMDAyYiIsInVzZXJfbmFtZSI6ImFkbWluIiwic2NvcGUiOlsicmVhZCJdLCJleHAiOjE1NDc1NTEwNTcsImF1dGhvcml0aWVzIjpbIlVTRVIiLCJBVVRIX1NZU1RFTV9NQU5BR0UiXSwianRpIjoiYWQyODIzMTItZjkzYi00ZWNmLTgyNTMtYTI1NTk0OWRiMzE5IiwiY2xpZW50X2lkIjoiYXBpIn0.CCl5S_OT3PLuM7CTjmx1ImCUclQcUpZkftCFcIcclXP_hfO7of6ycUl1EGfVhAciEQZClQMF90_HVHaOAAz0JgwexOPD-kLiX48v5qih6Lb8e7B9BWHezY3_Sr-DZkEm0_gfRpSAN6FOHYn68s6MLUyNuyR3RnIeasWaG8_HS-XOuIgandZWLMhRTfmtVwQ7B8ambBR31Y3q81BKhlxnoUmK2l04ESLq_yd_YFozG74-R5o0zchZOmgMCJ3Jr9_o-CSFTJSkpaP1K12oPkaWutR1xvvm5A7aUxi9OdJ_1TjYzbFsifkwQYWVphmiAkUrMh3annDqb_gyafXy-dWi2g';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
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
          if (error.response.config && error.response.config.url.indexOf('public/system/config') === -1) {
            window.location.href = '/login';
          }
          // Vue.prototype.$router && Vue.prototype.$router.replace({path: '/login'});
          break;
        default:
          // note: 20191030 增加判断阻断，避免重复跳转死循环。
          const localUrl:string = window.location.href;
          if (localUrl.indexOf('/error') < 0 && localUrl.indexOf('/login') < 0) {
            window.location.href = '/error';
          }
          break;
      }
    }
    return Promise.reject(error);
  }
);
export default axios;
