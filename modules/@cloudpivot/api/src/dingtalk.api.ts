
import axios from './axios';

import api from './api.mappings';

import * as dingtalk from './dingtalk-params';


export class DingTalkApi {

    sign(params: dingtalk.SignParams) {
        return axios.get(api.dingTalk.sign, {
            params
        });
    }

    login(params: dingtalk.LoginParams) {
        return axios.get(api.dingTalk.login, {
            params
        });
    }

}