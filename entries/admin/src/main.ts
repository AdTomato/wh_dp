import "babel-polyfill";
import Vue from "vue";
import App from "./app.vue";
import router from "./router/";
import store from "./store/";
import Filters from "./common/filters";
import { i18n } from "./config/i18n";
import "./config/print";
import "./config/index";
import "./config/h3-form";

import "./styles/index.less";
import "./directives/hight-light";

import env from "./env";

import { parseSearch, parseUrlParam } from "./common/utils";

import OAuthApi from "./apis/oauth";
import { getUserInfoLogin } from "./apis/organization";

import { Base64 } from "js-base64";

// 配置全局的校验默认规则
(window as any).$defaultRuleOptions = {
  local: "cn", // 语言 默认中文 （暂时不支持）
  errMsg: () => ({
    // 默认的错误提示
    required: "字段不能为空",
    noRegexp: "没有找到正则规则"
  }),
  cnChart: false, // 中文字节 true 算两个字节，false算一个字节
  formRegexp: {},
  error: () => {},
  success: () => {}
};

// const token:any = localStorage.getItem('token');

// if(!token) {
//   window.location.href = OAuthApi.OAuthLoginUrl;
// }

/**
 * 下拉元素绑定再元素节点下
 */
Vue.prototype.getPopupContainer = (triggerNode: any) => {
  return triggerNode.parentNode;
};

// 钉钉应用跳转后台免登
const admin_token = parseUrlParam(window.location.href, "admin_token");
if (admin_token) {
  localStorage.setItem("token", admin_token);
}

if (window.location.hash.endsWith("/oauth")) {
  localStorage.removeItem("token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("expireTime");

  // const code = parseUrlParam(window.location.href, 'code');
  const query = parseSearch(window.location.search);

  const params: OAuth.RequestParams = {
    client_id: `${env.client_id}`,
    client_secret: `${env.secret}`,
    grant_type: "authorization_code",
    redirect_uri: `${env.redirectHost}`,
    code: query.code
  };

  OAuthApi.getSSOToken(params).then(res => {
    const token = (res as any).access_token;
    const refresh_tokens = (res as any).refresh_token;
    const expireTime = (res as any).exp;

    localStorage.setItem("refresh_token", refresh_tokens);
    localStorage.setItem("expireTime", expireTime);
    localStorage.setItem("token", token);
    window.location.href = env.redirectHost + query.state;
  });
} else {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = OAuthApi.OAuthLoginUrl;
  } else {
    getUserInfoLogin().then(res => {
      if (res.errcode === 0) {
        setUserInfo(res.data);
        mount();
      } else {
        console.error(res.errmsg);
      }
    });
  }
}

function setUserInfo(info: any) {
  const isAppAdmin: boolean = info.permissions.includes("APP_MNG");
  const isSysAdmin: boolean = info.permissions.includes("SYS_MNG");
  const isRootAdmin: boolean = info.permissions.includes("ADMIN");
  const isAdmin: boolean = isAppAdmin || isSysAdmin || isRootAdmin;
  const isOnlyAppAdmin: boolean = isAppAdmin && !isSysAdmin && !isRootAdmin;
  store.commit("System/User/setOnlyAppAdmin", isOnlyAppAdmin);
  store.commit("System/User/setIsAdmin", isAdmin);
}

function mount() {
  Object.entries(Filters).forEach(([k, v]) => {
    Vue.filter(k, v);
  });
  Vue.config.productionTip = false;

  const vm = new Vue({
    router,
    i18n,
    store,
    render: h => h(App)
  }).$mount("#app");
}
