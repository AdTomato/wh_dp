
<template>
  <div class="login-qrcode">
    <div class="login-qrcode-header">钉钉登录</div>
    <a-tooltip placement="left" v-if="toggleMode">
      <template slot="title">
        <span>密码登录</span>
      </template>
      <div class="login-qrcode-type" @click="$emit('toggle')">
        <img src="../../assets/images/login.svg" />
      </div>
    </a-tooltip>
    <div id="qrcode-box" class="qrcode"></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Tooltip } from 'h3-antd-vue';

import env from '@/config/env';

@Component({
  name: "login-qrcode",
  components: {
    ATooltip: Tooltip,
  }
})
export default class LoginQrcode extends Vue {
  @Prop({
    default: false
  }) toggleMode!: boolean;

  @Prop() appId!: string;

  redirectUrl: string = ''; // 登陆成功回调地址

  gotoUrl: string = '';  // 钉钉扫码回调地址

  @Watch('appId')
  onAppIdChange(v:any) {
    if (v) {
      this.initLoginQrcode();
    }
  }

  created() {
    this.insertQrcode();
  }

  beforeDestroy() {
    if (typeof window.removeEventListener !== 'undefined') {
      window.removeEventListener('message', this.handleMessage);
    } else if (typeof (window as any).detachEvent !== 'undefined') {
      (window as any).detachEvent('onmessage', this.handleMessage);
    }
  }

  /**
   * 嵌入二维码
   * @sourceFile https://g.alicdn.com/dingding/dinglogin/0.0.5/ddLogin.js
   * @description 此方法来自外链文件，方法内容请勿修改，如遇到二维码加载失效，请打开 @sourceFile 检查文件内容中的远程地址（*.dingtalk.com/*）是否不一致
   */
  insertQrcode() {
    function qd(a) {
      var e, 
        c:any = document.createElement("iframe"),
        d = "https://login.dingtalk.com/login/qrcode.htm?goto=" + a.goto;
        d += a.style ? "&style=" + encodeURIComponent(a.style) : "",
        d += a.href ? "&href=" + a.href : "",
        c.src = d,
        c.frameBorder = "0",
        c.allowTransparency = "true",
        c.scrolling = "no",
        c.width = a.width ? a.width + 'px' : "365px",
        c.height = a.height ? a.height + 'px' : "400px",
        e = document.getElementById(a.id),
        e.innerHTML = "",
        e.appendChild(c)
    }
    (window as any).DDLogin = qd;
  }

  /**
   * 组装回调链接地址
   */
  generateUrls() {
    // 基础参数
    const {
      scope,
      client_id,
      redirectHost,
      oauthHost,
      portalHost,
    } = env;
    const failUrl: string = `${portalHost}/login`;
    // 组装地址
    this.redirectUrl = `${oauthHost}/login/dingtalk?redirect_uri=${encodeURIComponent(`${oauthHost}/oauth/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirectHost}/oauth`)}&login_fail_redirect_uri=${encodeURIComponent(failUrl)}`;
    // 组装二维码请求地址参数
    this.gotoUrl = encodeURIComponent(`https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${encodeURIComponent(this.redirectUrl)}`);
  }

  /**
   * 初始化登陆二维码
   */
  initLoginQrcode() {
    this.generateUrls();
    if (!this.gotoUrl || !(window as any).DDLogin) {
      this.insertQrcode();
    }
    (window as any).DDLogin({
      id: 'qrcode-box',
      goto: this.gotoUrl,
      style: 'border:none;background-color:#FFFFFF;margin-top:-14px;',
      width: '365',
      height: '300'
    });
    if (typeof window.addEventListener !== 'undefined') {
      window.addEventListener('message', this.handleMessage, false);
    } else if (typeof (window as any).attachEvent !== 'undefined') {
      (window as any).attachEvent('onmessage', this.handleMessage);
    }
  }

  /**
   * 扫码结果处理
   */
  handleMessage(event: any) {
    console.log('qrcode message: ',event);
    const { origin } = event;
    if (origin === 'https://login.dingtalk.com') {
      const loginTmpCode = event.data;
      const url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${this.appId}&response_type=code&scope=snsapi_login&state=STATE&redirect_uri=${this.redirectUrl}&loginTmpCode=${loginTmpCode}`;
      window.location.href = url;
    }
  }
}
</script>
<style lang="less" scoped>
.login-qrcode {
  float: right;
  margin-top: 110px;
  width: 360px;
  height: 400px;
  position: relative;
  background: #fff;
  border-radius: 6px;
  text-align: center;
  &-header {
    font-size: 30px;
    color: #333;
    line-height: 40px;
    margin: 50px 0 0 0;
  }
  &-type {
    position: absolute;
    top: 32px;
    right: 32px;
    cursor: pointer;
  }
}
</style>