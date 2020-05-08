import FastClick from 'fastclick';
import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import routes from './routes';
import store from '../../store';
import i18n from '../../config/i18n';

import '../../config/h3-mobile';
import '../../config/axios';
import '../../config/h3-form';
import '../../config/api';

import 'h3-mobile-vue/lib/theme/h3-mobile-vue.css';
import '../../lib/rem';

import '../../styles/common.less';

import * as platform from '@cloudpivot/platform';


// 钉钉授权导入
import env from '@/config/env';
import Utils from '@/utils';


import {  backStack, BackOptions } from './back';

import { externalLinkApi, listApi } from '@cloudpivot/api';



// vconsole 调试 start
// if (env.enableProxy) {
//   /* eslint-disable-next-line */
//   const VConsole = require('vconsole');
//   new VConsole();
// }
// vconsole 调试 end

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', () => {
    FastClick.attach(document.body);
  }, false);
}
Vue.config.productionTip = false;
// window.dd = dd;

Vue.use(Router);

window.Environment = {
  corpId: '',
  agentId: '',
  messageId: '',
  appCode: '',
  messageJson: null
};

/**
 * 设置路由集合
 * @param routeName 目标路由的名称
 */
function setRoute(routeName: string, options: any = {}) {
  let routeIndex = -1;
  // 寻找匹配的单个路由
  const route: any = routes.find((r: any, idx: number) => {
    if (r.name === routeName) {
      routeIndex = idx;
      return r;
    }
  });
  if (route) {
    // 如果是表单详情，则清空路由数组，仅保留表单详情并带入查询参数
    if (routeName === 'form-detail') {
      const formRoutes = require('../../routes/form');
      routes.splice(0, routes.length);
      routes.push({
        ...route,
        query: options.query
      });
      routes.push(...formRoutes.default)
      return;
    }
    // 普通路由设置，则将该路由重置为默认根路径的路由
    routes.splice(routeIndex, 1);
    routes[0] = Object.assign(
      {},
      route,
      { path: '/' },
      options
    );
  }
}

/**
 * 设置移动端默认首页地址
 */
const setDefaultHomeAddress = () => {
  const {
    appCode, mode, messageId, messageJson
  } = window.Environment;
  // 包含单应用的编码，进入单应用
  if (appCode) {
    setRoute('singleApp');
  }
  // 进入通知消息页面——表单详情
  else if (messageId) {
    setRoute('form-detail', {
      query: messageJson
    });
  }
  // 进入发起流程填写表单页——表单详情
  else if (mode === 'create') {
    try {
      const query = JSON.parse((`{"${window.location.search.replace('?', '')}"}`).replace(/&/g, '","').replace(/=/g, '":"'));
      setRoute('form-detail', {
        query
      });
    } catch (error) {
      console.error(error);
    }
  }
};

/**
 * 启用Vue实例挂载
 */
const startApp = (schemaCode:string,sheetCode:string) => {
  setDefaultHomeAddress();
  const router:any = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
  });
  router.beforeEach((to:any, form:any, next:any) => {

    if (backStack.length) {
      const back: BackOptions = backStack.pop() as BackOptions;
      back.callback && back.callback();
      next(false);
      return;
    }

    const title: string = to.meta.title; // || '云枢';
    if (title) {
      // setTitle(title);
      platform.service.setTitle(title);
    }
    next();
  });

  // getToken()

  new Vue({
    router,
    i18n,
    store,
    created() {
      // 会导致无法跳转到目标路由
      const {
        appCode, mode, messageId, messageJson
      } = window.Environment;
    
      if (messageId) {
        router.replace({
          path: '/form/detail/',
          query: messageJson
        });
      } else if (mode === 'create') { // 从发起表单到达
        const params = window.location.search;
        router.replace({
          path: `/form/detail/${params}`
        });
      }
    },
    render: h => h(App),
  }).$mount('#app');
  Vue.prototype.router = router;
  if(router.name === 'form-detail') {
    return;
  }
  const params = getParams();

  if (params.formId) {
    router.replace('/');
    router.push({
      name: 'form-detail',
      query: {
        schemaCode: schemaCode,
        sheetCode: sheetCode,
      }
    });
  } else {
    router.replace('/');
    router.push({
      name: 'form-detail',
      query: {
        ssc: params.c,
      }
    });
  }
  
  
};



/**
 * 全站执行启动
 */
const init = () => {
  const corpId: string | null = Utils.parseUrlParam(window.location.href, 'corpId');
  const agentId: string | null = Utils.parseUrlParam(window.location.href, 'agentId');
  const messageId: string | null = Utils.parseUrlParam(window.location.href, 'messageId');
  const appCode: string | null = Utils.parseUrlParam(window.location.href, 'appCode');
  const mode: string | null = Utils.parseUrlParam(window.location.href, 'mode'); // mode用于区分路由模式，如直接打开表单新增， 直接打开列表、报表等
  const schemaCode: string | null = Utils.parseUrlParam(window.location.href, 'schemaCode');
  const sheetCode: string | null = Utils.parseUrlParam(window.location.href, 'sheetCode');
  window.Environment.corpId = corpId;
  window.Environment.agentId = agentId;
  window.Environment.messageId = messageId;
  window.Environment.appCode = appCode;
  window.Environment.mode = mode;
  window.Environment.schemaCode = schemaCode;
  window.Environment.sheetCode = sheetCode;

  const params = getParams();
  getToken(params);
};

init();

/**
   * 权限控制
   */
  function getToken(params:any) {
    externalLinkApi.sheet(params.formId || params.c).then((res:any) => {
     debugger
      if (res.errcode === 0) {
         sessionStorage.setItem('user', JSON.stringify(res.data.info_login));
         (window as any).externalLinkToken = res.data.access_token;
         startApp(res.data.schemaCode,res.data.sheetCode);
         
      } else {
        console.log('33344',env);
        window.location.href = env.redirectHost + '/no-permission.html';
        // const v:any = new Vue();
        // v.$h3.toast.show({ text: '暂无权限！' });
        // Vue.prototype.$message.error('暂无权限！',10);
        // this.$router.replace('/');
      }
    });
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

