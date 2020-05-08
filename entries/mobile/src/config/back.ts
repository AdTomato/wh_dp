import Vue from 'vue';
// import { closeApp, setLeft } from '@/utils/dingtalk';

import common from '@cloudpivot/common';

import * as platform from '@cloudpivot/platform';


export class BackOptions {
  callback?: Function; // 回调事件
}

let backStack: Array<BackOptions> = []; // 返回回调事件堆栈

/**
 * 返回订阅事件
 * @param options
 */
export const subscribeBack = (options: BackOptions) => {
  backStack.push(options);
};
/**
 * 返回取消订阅事件
 * @param options
 */
export const unsubscribeBack = (options: BackOptions) => {
  const tmpBackStack = new Set(backStack);
  tmpBackStack.delete(options);
  backStack = [...tmpBackStack];
};
export default () => {
  let stackLength = 0;
  platform.service.setLeft({
    fn: () => {
      if (backStack.length) {
        const back: BackOptions = backStack.pop() as BackOptions;
        back.callback && back.callback();
      }
      // else if (Vue.prototype.router.app.$route.query.goindex) {
      //   closeApp();
      // } 
      else if (window.history.length <= 1 || window.Environment.historyLength - stackLength <= 1) {
        platform.service.close();
        // closeApp();
      }
      else {
        Vue.prototype.router.back();
        window.Environment.historyLength -= 1;
        stackLength += 1;
      }
    }
  });
};


common.directives.controlBackConfig.handler = {

  subscribe: subscribeBack,

  unsubscribe: unsubscribeBack

};