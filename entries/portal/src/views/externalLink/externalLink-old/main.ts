import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import routes from './routes';

import i18n from '@/config/i18n';

import '@/config/axios';
import '@/config/antd';
import '@/config/h3-form';
import '@/config/api';

import '@/styles/index.less';

// // 引入自定义指令
// import directives from '@/directives';


import dd from 'dingtalk-jsapi';
// import init from '@/login';
import { externalLinkApi, listApi } from '@cloudpivot/api';

// import init from '../login';
// 钉钉授权导入__End

Vue.config.productionTip = false;
window.dd = dd;


Vue.use(Router);

window.Environment = {
  corpId: '',
  messageId: '',
  authcode: '',
  appCode: ''
};



  // // debugger
  // // 全局注册自定义指令
  // Object.entries(directives).forEach((directive:any) => {
  //   const directiveName = directive[0];
  //   const directiveFunc = directive[1];
  //   Vue.directive(directiveName, directiveFunc);
  // });

  init();

  function init() {
    const params = getParams();
    let url: string = '';
    const formId = params.formId;
    url = `${window.location.protocol}//${window.location.host}/el.html?formId=${formId}`;
    window.location.href = url;
  }
  /**
   * 获取 url 后面参数
   */
  function getParams () {

    const url = location.search;
    const theRequest:any = new Object();
    if (url.indexOf("?") != -1) {
      const str:string = url.substr(1);
      const strs:string[] = str.split("&");
      strs.forEach((res:string) => {
        theRequest[res.split("=")[0]] = decodeURI(res.split("=")[1]);
      })
    }
    // debugger
    return theRequest;

  }

  /**
   * 权限控制
   */
  function getToken(params:any) {
    
    externalLinkApi.sheet(params.formId || params.SSC).then((res:any) => {
    //  debugger
      if (res.errcode === 0) {
         sessionStorage.setItem('user', JSON.stringify(res.data.info_login));
         (window as any).externalLinkToken = res.data.access_token;
         initRouter(res.data.schemaCode,res.data.sheetCode);
         
      } else {
        Vue.prototype.$message.error('暂无权限！',10);
        // this.$router.replace('/');
      }
    });
  }

  /**
   * 初始路由
   */
  function initRouter(schemaCode:any,sheetCode:any) {
    const params = getParams();
    // debugger
    const router:any = new Router({
      base: process.env.BASE_URL,
      routes
    });
  
    new Vue({
      router,
      i18n,
      render: (h: any) => h(App),
    }).$mount('#app');
    Vue.prototype.router = router;

    if(router.name === 'form-detail') {
      return;
    }
    
    router.replace('/');
    router.push({
      name: 'form-detail',
      query: {
        sheetShortCode: params.SSC,
      }
    });
  }

