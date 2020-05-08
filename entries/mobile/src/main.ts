// import FastClick from 'fastclick';
import Vue from 'vue';
import Router from 'vue-router';
import App from './App.vue';
import routes from './routes';
import store from './store';
import i18n from './config/i18n';

import * as platform from '@cloudpivot/platform';
import { formApi } from '@cloudpivot/api';

import './config/h3-mobile';
import './config/axios';
import './config/h3-form';
import './config/api';

import '@/views/apps/report-service';

import 'h3-mobile-vue/lib/theme/h3-mobile-vue.css';
import './lib/rem';

import './directives/hight-light';

// 钉钉设置title
import zh from './locale/common.zh-CN';
import en from './locale/common.en-US';


const titleMap: any = {
  zh,
  en
}
// 钉钉设置title


// 钉钉授权导入
import env from '@/config/env';

import OauthApi from '@/apis/oauth';
// 钉钉授权导入__End

// 钉钉全局返回监听
import Back from '@/config/back';

// vconsole 调试 start
if (env.enableProxy) {
  /* eslint-disable-next-line */
  // const VConsole = require('vconsole');
  // new VConsole();
}
// vconsole 调试 end

// if ('addEventListener' in document) {
//   document.addEventListener('DOMContentLoaded', () => {
//     FastClick.attach(document.body);
//   }, false);
// }
Vue.config.productionTip = false;

Vue.use(Router);

window.Environment = {
  corpId: '',
  agentId: '',
  messageId: '',
  appCode: '',
  messageJson: null,
  isDingTalk: platform.IS_DINGTALK
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
      const formRoutes = require('./routes/form');
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
    appCode, mode, messageId, messageJson, sheetCode, schemaCode, id, sCode
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
const startApp = () => {
  setDefaultHomeAddress();
  // alert('wait---:'+ JSON.stringify(routes[0]));
  const router = new Router({
    // mode: 'history',
    base: process.env.BASE_URL,
    routes
  });
  window.Environment.historyLength = 0;
  router.beforeEach((to, form, next) => {
    if (to.name === 'singleApp') {
      const appName:string = window.Environment.appName || '';
      if (appName) {
        platform.service.setTitle(appName);
      }
    } else {
      const title: string = to.meta.title; // || '云枢';
      const titleKey: string = to.meta.titleKey; // 通过这个key值去映射国际化标题
      if (titleKey) {
        const locale: string = (window as any).localStorage.getItem('locale') as string || 'zh';
        const t: string = titleMap[locale][titleKey];

        platform.service.setTitle(t);
        // setTitle(t);
      } else if (title) {
        platform.service.setTitle(title);
        // setTitle(title);
      }
    }
    window.Environment.historyLength += 1;
    next();
  });
  new Vue({
    router,
    i18n,
    store,
    created() {
      // 会导致无法跳转到目标路由
      const {
        appCode, mode, messageId, messageJson,
        schemaCode, sheetCode, id, workflowInstanceId, workItemId, workflowCode, sCode
      } = window.Environment;
      // if (window.history.length <= 1 && !(this.$route.query.goindex || appCode || mode || messageId)) {
      //   this.$router.replace({ path: window.location.pathname.replace(process.env.BASE_URL, '') + window.location.search, query: Object.assign({}, this.$route.query, { goindex: 'true' }) });
      // }
      // 从钉钉通知到达
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
      } else if (mode === 'form') {

        if (workflowInstanceId && workItemId) { // 流程表单
          const params = {
            workflowInstanceId,
            workitemId: workItemId
          }
          router.replace({
            name: 'form-detail',
            // path: '/form/detail/',
            query: params
          });
        } else if (workflowCode) { // 发起流程
          router.replace({
            name: 'form-detail',
            // path: '/form/detail/',
            query: {
              startWorkflowCode: workflowCode
            }
          });
        } else if (schemaCode) { // 查看业务表单
          const params: any = {
            schemaCode,
            sheetCode
          }
          if (id) {
            params.objectId = id
          }
          router.replace({
            path: '/form/detail/',
            query: params
          });
        }
      }
      else if (sCode) { // 批量打印二维码扫码查看表单
        // 通过短码去获取相关参数
        OauthApi.getShortCode(sCode).then((sCodeRes: any) => {
          if (sCodeRes.errcode === 0) {
            const json: any = JSON.parse(sCodeRes.data.pairValue);
            // const { sheetCode, schemaCode, id } = json;
            if (json.sheetCode && json.schemaCode && json.id) {
              const qrcodeParams: OAuth.GetFormUrlParams = {
                formCode: json.sheetCode,
                schemaCode: json.schemaCode,
                bizObjectId: json.id,
              };
              OauthApi.getFormUrl(qrcodeParams).then((res: any) => {
                if (res) {
                  router.replace(res);
                }
              });
            }
          } else {
            console.log(sCodeRes.errmsg)
          }
        })
      }
    },
    mounted() {
      if (platform.IS_DINGTALK) {
        // const back = require('./config/back');
        this.$nextTick(() => {
          // back.default();
          Back();
        });
      }
    },
    render: h => h(App),
  }).$mount('#app');
  Vue.prototype.router = router;
};

/**
 * 获取消息打开地址
 */
const getMessageUrl = async () => {
  const params: OAuth.FormUrlParams = {
    messageId: window.Environment.messageId
  };

  const token = localStorage.getItem('token');

  // const res = await OauthApi.getFormUrl(params);
  const res = await formApi.getMessageFormUrl(params);
  if (res.errcode === 0 && res.data) {
    // alert('获取消息参数结果：'+ res.data);
    // 跳转到消息地址或者第三方浏览器直接打开地址
    const { bizObjectId, workItemId, workflowInstanceId, schemaCode, sheetCode } = res.data;

    window.Environment.messageJson = {
      objectId: bizObjectId,
      workitemId: workItemId,
      workflowInstanceId,
      access_token: token,
      schemaCode,
      sheetCode
    };

    startApp();

  }
};

export function init() {

  platform.start(env.client_id, env.scope).then((result: any) => {
    console.log(result, 'main init error');
    const { query } = result;
    window.Environment = query;

    if (query.messageId) {
      getMessageUrl();
    } else {
      // alert('开始请求消息参数:消息id：'+window.Environment.messageId);
      startApp();
    }
  });

}


init();
