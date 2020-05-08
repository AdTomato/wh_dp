/* eslint-disable */
import common from './common';

import { DingTalk } from './dingtalk.typings.js';

import dd from 'dingtalk-jsapi';

window.dd = dd;

export default dd;

/**
 *钉钉config
 */
export const ddConfig = (config: DingTalk.DingtalkConfig) => {
  window.dd.config({
    agentId: config.agentId,
    corpId: config.corpId,
    timeStamp: config.timeStamp,
    nonceStr: config.nonceStr,
    signature: config.signature,
    jsApiList: [
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
      'biz.cspace.preview',
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
    ],
  });
  window.dd.ready(() => {
    document.addEventListener('resume', function () {
      // 在这里处理你的业务逻辑
      config.resume();
    });
    if (common.isiOS) {
      window.dd.ui.webViewBounce.disable();
    }
    config.back();
    config.cb();
  });
  window.dd.error((err: any) => {
    let msg = '';
    for (const key in err) {
      if (Object.prototype.hasOwnProperty.call(err, key)) {
        msg += `${key}:${err[key]};`;
      }
    }
    if (msg.indexOf('uid is not employee for orgid') > -1) {
      msg = '你不在当前组织机构中，无权限查看！';
    }
    // ddAlert('提示', msg);
  });
};

/**
 *获取免登授权码
 */
export const requestAuthCode = (corpId: string, cb: any) => {
  window.dd.runtime.permission.requestAuthCode({
    corpId,
    onSuccess: (result: any) => {
      cb(result.code);
    },
    onFail(err: any) {
      let msg = '';
      for (const key in err) {
        if (Object.prototype.hasOwnProperty.call(err, key)) {
          msg += `key:${err[key]};`;
        }
      }
      ddAlert('提示', msg);
    },
  });
};

/**
 *钉钉弹窗
 */
export const ddAlert = (title: string, msg: string, callback: any = null) => {
  window.dd.device.notification.alert({
    message: msg,
    title,
    buttonName: '确认',
    onSuccess() {
      if (typeof (callback) !== 'undefined') {
        callback.call(this);
      }
    },
    onFail() { },

  });
};

export const setTitle = (title: string) => {
  if (common.isDingtalk) {
    window.dd.biz.navigation.setTitle({
      title, // 控制标题文本，空字符串表示显示默认文本
      onSuccess() { },
      onFail() { },
    });
  }
};

/**
 * 设置钉钉左侧返回菜单
 * 同时兼容IOS与Android
 * cb 左侧按钮返回回调函数
 */
let backbuttonListener = (e: any) => { };

export const setLeft = function setLeftFunc(cb: any) {
  if (common.isDingtalk) {
    if (common.isiOS) {
      setLeftFunc.callback = cb;
      window.dd.biz.navigation.setLeft({
        show: true, // 控制按钮显示， true 显示， false 隐藏， 默认true
        control: true, // 是否控制点击事件，true 控制，false 不控制， 默认false
        showIcon: true, // 是否显示icon，true 显示， false 不显示，默认true； 注：具体UI以客户端为准
        text: '返回', // 控制显示文本，空字符串表示显示默认文本
        onSuccess() {
          cb.apply(this, []);
        },
        onFail() { },
      });
    } else {
      document.removeEventListener('backbutton', backbuttonListener);
      backbuttonListener = function backbuttonListener(e: any) {
        cb();
        if (e) {
          e.preventDefault();
        }
      };
      document.addEventListener('backbutton', backbuttonListener);
      setLeftFunc.callback = backbuttonListener;
    }
  }
};
setLeft.callback = (e: any) => { };

export const openLink = (url: string) => {
  if (common.isDingtalk) {
    window.dd.biz.util.openLink({
      url: url,
    });
  }
};

export const closeWindow = () => {
  if (common.isDingtalk) {
    window.dd.biz.navigation.close();
  }
};


/**
 * 关闭应用
 */
export const closeApp = () => {
  if (common.isDingtalk) {
    window.dd.biz.navigation.close({
      onSuccess: function (result: any) {
        /*result结构 {} */
      },
      onFail: function (err: any) { }
    });
  }
};


/**
 *钉钉定位获取当前位置
 */
export const getLocation = (fn: Function, withReGeocode: any, failFn: Function) => {
  if (common.isDingtalk) {
    window.dd.device.geolocation.get({
      targetAccuracy: 200,
      coordinate: 1,
      withReGeocode,
      onSuccess: function (result: any) {
        fn.call(this, result);
      },
      onFail: function (err: any) {
        if (failFn) {
          failFn.call(this, err);
        }
      },
    });
  } else {
    // failFn.call(this);
    // fn.call(this, { longitude: 113 }); // 测试经度定位
  }
};
/**
     *钉钉定位poi
     */
export const searchMapLocation = (scope: number, latitude?: number, longitude?: number, ) => {

  let opts: any = {
    scope
  };

  if (typeof latitude === 'number' && typeof longitude === 'number') {
    opts.latitude = latitude;
    opts.longitude = longitude;
  }
  //alert(JSON.stringify(opts));
  return dd.biz.map.search(opts);

  // if (common.isDingtalk) {
  //   return new Promise((resolve, reject) => {
  //     window.dd.biz.map.search({
  //       latitude,
  //       longitude,
  //       scope: scope,
  //       onSuccess: function (result: any) {
  //         resolve(result);
  //       },
  //       onFail: function (err: any) {
  //         reject(err);
  //       },
  //     });
  //   });
  // } else {
  //   return Promise.reject();
  // }
};
/**
     *钉钉定位
     */
export const locateMapLocation = (fn: Function, latitude: number, longitude: number) => {
  if (common.isDingtalk) {
    window.dd.biz.map.locate({
      latitude,
      longitude,
      onSuccess: function (result: any) {
        fn.call(this, result);
      },
      onFail() { },
    });
  }
};

/**
 *钉钉导航
  */
export const locateNavigation = (latitude: number, longitude: number, title: string) => {
  if (common.isDingtalk) {
    window.dd.biz.map.view({
      latitude,
      longitude,
      title,
    });
  }
};

interface previewImage {
  current: string,
  urls: Array<string>,
  fn?: Function,
  failFn?: Function
}

/**
 *钉钉图片预览
  */
export const previewImage = ({ current, urls, fn, failFn }: previewImage) => {
  if (common.isDingtalk) {
    window.dd.biz.util.previewImage({
      urls,
      current,
      onSuccess: function (result: any) {
        fn && fn.call(this, result);
      },
      onFail: function (err: any) {
        failFn && failFn.call(this, failFn);
      }
    });
  }
}
