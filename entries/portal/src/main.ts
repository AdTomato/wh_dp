import 'babel-polyfill';

import './config/axios';

import '@/views/applications/report-service';

import env from '@/config/env';

import * as platform from '@cloudpivot/platform';

import { formApi } from '@cloudpivot/api';


platform.start(env.client_id, env.scope).then((result: any) => {
  const { query } = result;
  if (query.messageId) {
    openMessage(query.messageId);
  } else {
    require('./startup').startup(query);
  }
});


/**
 * 根据消息打开页面
 * @param messageId 
 */
async function openMessage(messageId: string) {

  const $app = document.getElementById('app');
  if(!$app){
    throw new Error(`can't find #app`);
  }

  const params: OAuth.FormUrlParams = {
    messageId
  };

  const token = localStorage.getItem('token');

  const res = await formApi.getMessageFormUrl(params);

  if (res.errcode === 0 && res.data) {
    // 跳转到消息地址或者第三方浏览器直接打开地址
    const { bizObjectId, workItemId, workflowInstanceId, schemaCode, sheetCode } = res.data;
    // alert(`结果详情：bizobjectid:${bizObjectId},workitemid:${workItemId},workflowinstanceid:${workflowInstanceId}`);

    let url = `${env.portalHost}/form/detail?`;

    if (workflowInstanceId) {
      url += `workflowInstanceId=${workflowInstanceId}&workitemId=${workItemId || ''}&access_token=${token}`;
    } else {
      url += `objectId=${bizObjectId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&access_token=${token}`;
    }

    $app.innerText = '';
    $app.style.textAlign = 'center';
    $app.style.paddingTop = '20px';
    $app.style.color = '#666';
    $app.style.fontSize = '18px';

    const $a = document.createElement('a');
    $a.style.textDecoration = 'underline';
    $a.href = url;
    $a.target = '_blank';
    $a.innerText = '浏览器打开应用';
    $app.appendChild($a);

    platform.service.openLink(url);

  }

}