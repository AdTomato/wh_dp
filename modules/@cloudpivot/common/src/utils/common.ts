export const isDingtalk = /DingTalk/.test(navigator.userAgent);

export const isiOS = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // 判断是否ios终端

export default {
  isDingtalk,
  isiOS
};
