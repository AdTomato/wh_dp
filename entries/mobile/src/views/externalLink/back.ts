

import common from '@cloudpivot/common';


export class BackOptions {
  callback?: Function; // 回调事件
}


export let backStack: Array<BackOptions> = []; // 返回回调事件堆栈

/**
 * 返回订阅事件
 * @param options
 */
export const subscribeBack = (options:BackOptions) => {
  backStack.push(options);
};
/**
 * 返回取消订阅事件
 * @param options
 */
export const unsubscribeBack = (options:BackOptions) => {
  const tmpBackStack = new Set(backStack);
  tmpBackStack.delete(options);
  backStack = [...tmpBackStack];
};


common.directives.controlBackConfig.handler = {

  subscribe: subscribeBack,

  unsubscribe: unsubscribeBack

};