

import { utils } from '@cloudpivot/common'

import { dingTalk } from '@cloudpivot/api';

import { IS_DEBUG, IS_DINGTALK, IS_IOS } from './is-platform'

import { PlatformServiceLike, BrowserService } from './platform-service';

// import { DingTalkService } from './dingtalk/dingtalk-service';


import { Base64 } from 'js-base64';


function parseToken(token: string) {
    const useInfoBs: string = token.split('.')[1];
    const useInfo = JSON.parse(Base64.decode(useInfoBs));
    return useInfo;
}

export {
    IS_DEBUG,
    IS_DINGTALK,
    IS_IOS
}

export let service: PlatformServiceLike;


export async function start(client_id: string, scope: string) {

    let _service: PlatformServiceLike | null = null;

    const query = utils.parseQuery();

    let loginInfo: any;

    let p: Promise<dingTalk.LoginResult> | null = null;

    if (IS_DEBUG) {
    } else {

        if (IS_DINGTALK) {
            const dingtalk = require('./dingtalk');
            p = dingtalk.init(client_id, scope, query);
            _service = new dingtalk.DingTalkService();
        }

    }

    if (_service === null) {
        _service = new BrowserService();
    }

    if (_service) {
        service = _service;
    }

    if (p) {

        const res = await p;

        if (res) {
            const { access_token, userinfo, refresh_token, expiration } = res;

            loginInfo = res;

            const info = parseToken(access_token);
            if (info) {
                const user = userinfo as any;
                user.isAppAdmin = info.isAppAdmin;
                user.isAdmin = info.isAdmin;
            }

            sessionStorage.setItem('user', JSON.stringify(userinfo));
            localStorage.setItem('token', access_token);
            localStorage.setItem('refresh_token', JSON.stringify(refresh_token));
            localStorage.setItem('expireTime', `${expiration}`);
        }

    } else {
        if (query.access_token) {
            localStorage.setItem('token', query.access_token);
        }
    }

    return {
        query,
        loginInfo
    };
}