
import Vue from 'vue';
import Router from 'vue-router';

import App from './App.vue';
import store from './store';
import i18n from './config/i18n';
import axios from 'axios';

// // 引入自定义指令
// import directives from './directives';

import env from '@/config/env';

import routes from './routes';

import * as platform from '@cloudpivot/platform';


import './config/api';
import './config/antd';

import './styles/index.less';


/**
 * 页面禁用拖拽上传时 浏览器默认打开图片
 */
document.addEventListener('drop', function (e) {
    e.preventDefault()
}, false)

document.addEventListener('dragover', function (e) {
    e.preventDefault()
}, false)


export async function startup(environment: any) {

    // 地址参数上携带access_token的，将token存在localstorage并清理地址上的参数
    if (environment && environment.access_token) {
        // 通过token获取refresh_token，实现token续期
        await axios.post(`${env.apiHost}/login/Authentication/get_refresh_token`, { access_token: environment.access_token }).then((res: any) => {
            if (res.errcode === 0 && res.data) {
                const refresh_tokens = (res as any).data.refresh_token;
                let expireTime = (res as any).data.expiration;

                // 时间戳如果为13位则单位是ms,把单位转为s
                if (expireTime.toString().length === 13) {
                    expireTime = expireTime.toString().slice(0, -3);
                }
        
                localStorage.setItem('refresh_token', refresh_tokens);
                localStorage.setItem('expireTime', expireTime);
            }
        });
        const url = decodeURIComponent(window.location.href).replace('&access_token', 'access_token');
        window.location.href = url.replace(`access_token=${environment.access_token}`, '');
    }

    window.Environment = environment;

    Vue.config.productionTip = false;

    Vue.use(Router);

    // 单应用路由
    if (window.Environment.appCode) {
        ((routes[0]) as any).redirect = '/app-home';
    } else if (window.Environment.messageId) {
        // 消息路由
    }

    const router = new Router({
        mode: 'history',
        base: process.env.BASE_URL,
        routes
    });

    Vue.prototype.router = router;

    router.beforeEach((to: any, from: any, next: any) => {

        let title = '奥哲云枢';
        if (to.meta && to.meta.title) {
            title = to.meta.title
        }
        platform.service.setTitle(title);

        const token = localStorage.getItem('token');

        if (env.enableProxy) {
            next();
        } else {
            // document.title = to.meta.title;
            if (!token && to.name !== 'login' && to.name !== 'oauth') {
                // alert(JSON.stringify(to));
                // window.location.href = '/login';
                next({ name: 'login' });
            } else {
                next();
            }
        }
    });

    // 全局注册自定义指令
    // Object.entries(directives).forEach((directive: any) => {
    //     const directiveName = directive[0];
    //     const directiveFunc = directive[1];
    //     Vue.directive(directiveName, directiveFunc);
    // });

    new Vue({
        router,
        i18n,
        store,
        render: (h: any) => h(App),
    }).$mount('#app');

}