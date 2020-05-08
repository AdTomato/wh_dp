
import { IS_IOS } from '../is-platform'

import { dingTalkApi } from '@cloudpivot/api'

import { dd, DingTalkService } from './dingtalk-service'
import { platform } from 'os';

import * as platformService from '@cloudpivot/platform';


export {
  DingTalkService
}

export const jsApiList = [
  'runtime.info',
  'biz.contact.choose',
  'biz.contact.chooseMobileContacts',
  'device.notification.confirm',
  'device.notification.alert',
  'device.notification.prompt',
  'device.notification.showPreloader',
  'device.notification.hidePreloader',
  'biz.ding.post',
  'device.geolocation.get',
  'biz.map.locate',
  'biz.map.search',
  'biz.map.view',
  'biz.util.datepicker',
  'biz.util.timepicker',
  'biz.util.datetimepicker',
  'biz.util.scan',
  'biz.util.scanCard',
  'biz.util.uploadImageFromCamera',
  'biz.util.uploadAttachment',
  'biz.cspace.preview',
  'biz.cspace.chooseSpaceDir',
  'biz.util.uploadImage',
  'biz.util.uploadAttachment',
  'biz.util.previewImage',
  'biz.user.get',
  'biz.cspace.chooseSpaceDir',
  'biz.cspace.saveFile',
  'biz.contact.complexChoose',
  'biz.navigation.setTitle',
  'biz.navigation.setIcon',
  'biz.navigation.setLeft',
  'biz.navigation.setMenu',
  'biz.navigation.close',
  'biz.chat.pickConversation',
  'biz.telephone.showCallMenu',
  'biz.telephone.call',
  'biz.util.ut',
  'biz.util.open',
  'biz.util.openLink',
  'ui.nav.preload',
  'ui.nav.go',
  'biz.store.inquiry', // 询价
  'biz.store.createOrder', // 下单
  'biz.store.getPayUrl', // 获取下单URL
  'biz.alipay.pay', // 唤醒支付宝
  'biz.ding.create'
];


export async function init(client_id: string, scope: string, query: any) {

  const { corpId, agentId } = query;
  if (!corpId) {
    console.log('缺少corpId');
    return;
  }

  // if (!agentId) {
  //   console.log('缺少agentId');
  //   return;
  // }

  const signResult = await sign();

  console.log('sign', signResult);

  const params = signResult as any;
  params.corpId = corpId;

  if (agentId) {
    params.agentId = agentId;
  }

  params.jsApiList = jsApiList;

  await ready(params);
  const loginReuslt = await login(client_id, scope, corpId);

  if ((loginReuslt as any).errcode === 10002)  {
    (dd.device.notification.alert as any)({
      message: "您无此访问权限，请联系管理员",
      buttonName: "确定",
      onSuccess : function() {
        platformService.service.close();
      },
    });
  }

  return loginReuslt;
}


export async function sign() {

  const sourceUrl: string = window.location.href.replace(/#\/(.+)?/, '');
  const params = {
    url: encodeURIComponent(sourceUrl)
  };
  const res = await dingTalkApi.sign(params);

  return res.data;
}


export interface ConfigParams {

  timeStamp: string

  nonceStr: string

  signature: string

  corpId: string

  agentId: string

  jsApiList: string[]
}

export function ready(params: ConfigParams) {

  dd.config(params);

  return new Promise((resolve, reject) => {

    dd.ready(() => {
      if (IS_IOS) {
        dd.ui.webViewBounce.disable({});
      }
      resolve();
    });

    dd.error((err: any) => {
      let msg = '';
      for (const key in err) {
        if (Object.prototype.hasOwnProperty.call(err, key)) {
          msg += `${key}:${err[key]};`;
        }
      }
      if (msg.indexOf('uid is not employee for orgid') > -1) {
        msg = '你不在当前组织机构中，无权限查看！';
      }
    });

  });

}


export async function login(client_id: string, scope: string, corpId: string) {

  const authCodeRes = await dd.runtime.permission.requestAuthCode({
    corpId
  });

  const code = authCodeRes.code;

  const loginRes = await dingTalkApi.login({
    code,
    client_id,
    scope,
  });

  console.log('login', loginRes);

  return loginRes;
}