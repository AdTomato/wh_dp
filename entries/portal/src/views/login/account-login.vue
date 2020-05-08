<template>
  <div class="login-account" :class="{'login-err-box':passwordErr}">
    <div class="login-account-header">账号登录</div>
    <a-tooltip placement="left" v-if="toggleMode">
      <template slot="title">
        <span>扫码登录</span>
      </template>
      <div class="login-account-type" @click="$emit('toggle')">
        <img src="../../assets/images/qrcode.svg" />
      </div>
    </a-tooltip>
    <p v-if="passwordErr" class="err-tips">请输入正确的账号或密码</p>
    <a-input
      placeholder="请输入账号"
      style="width: 280px;margin-bottom: 30px;"
      v-model="userName"
      @change="becanLogin"
    ></a-input>
    <a-input
      placeholder="请输入密码"
      style="width: 280px;margin-bottom: 16px;"
      v-model="passWord"
      @change="becanLogin"
      :type="passwordType"
      autocomplete="off"
    >
      <i
        class="icon aufontAll"
        :class="{'h-icon-all-eye-close': !showPassword,'h-icon-all-eye-o': showPassword}"
        slot="suffix"
        @click="passwordVisible"
      ></i>
    </a-input>
    <p class="login-account-forget" @click="visible = true">忘记密码</p>
    <div
      class="login-btn"
      :class="{'loginDisabled': !loginDisabled}"
      @click="login">登 录</div>
    <!-- 弹窗 -->
    <a-modal
      title="提示"
      :bodyStyle="{'text-align':'center'}"
      v-model="visible"
      :maskClosable="false"
      :keyboard="false"
    >
      <template slot="footer">
        <a-button
          key="ok"
          class="ok-btn"
          type="primary"
          @click="visible = false">确认</a-button>
      </template>
      <img class="img" src="../../assets/images/forget.png" />
      <p class="img-text">请联系系统管理员重置密码</p>
    </a-modal>
    <a-modal
      title="提示"
      :bodyStyle="{'text-align':'center'}"
      v-model="overflowTips"
      :maskClosable="false"
      :keyboard="false"
    >
      <template slot="footer">
        <a-button
          key="ok"
          class="ok-btn"
          type="primary"
          @click="overflowTips = false">确认</a-button>
      </template>
      <p class="overflow-text">密码输入已超过3次,请1分钟后再尝试</p>
    </a-modal>
    <!-- 未授权 -->
    <a-modal
      title="提示"
      :bodyStyle="{'text-align':'center'}"
      v-model="unAuthed"
      :maskClosable="false"
      :keyboard="false">
      <p class="overflow-text">当前账号用户未被授权，请联系管理员</p>
      <template slot="footer">
        <a-button
          key="ok"
          class="ok-btn"
          type="primary"
          @click="unAuthed = false">确认</a-button>
      </template>
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import OAuthApi from '@/apis/oauth';

import env from '@/config/env';

import {
  Modal, Input, Button, Tooltip
} from 'h3-antd-vue';

@Component({
  name: "login-account",
  components: {
    AInput: Input,
    AModal: Modal,
    AButton: Button,
    ATooltip: Tooltip,
  }
})
export default class LoginAccount extends Vue {
  @Prop({
    default: false
  }) toggleMode!: boolean;

  redirectUrl: string = '';  // 登陆回跳地址

  getTokenParams: any = {
    code: '',
    url: '',
    client_secret: '',
    client_id: '',
    redirect_uri: ''
  };

  passwordErr: boolean = false; // 账户密码错误

  passwordType: string = 'password'; // 密码的展示形式

  showPassword: boolean = false;

  overflowTips: boolean = false; // 密码输入已超过3次提示

  loginDisabled: boolean = false; // 登录禁用状态

  userName: string = ''; // 登录账号

  passWord: string = ''; // 登录密码

  visible: boolean = false; // 忘记密码提示窗

  unAuthed: boolean = false; // 未授权提示窗

  created() {
    this.generateUrls();
  }

  /**
   * 初始化地址和固定传参
   */
  generateUrls() {
    const {
      oauthHost,
      client_id,
      scope,
      secret,
      redirectHost
    } = env;
    // 回跳地址
    this.redirectUrl = `${oauthHost}/login?redirect_uri=${encodeURIComponent(`${oauthHost}/oauth/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirectHost}/oauth`)}`;
    // 请求token参数
    this.getTokenParams = {
      code: '',
      url: oauthHost,
      client_secret: secret,
      client_id: client_id,
      redirect_uri: `${redirectHost}/oauth`
    };
  }

  passwordVisible() {
    if (this.showPassword) {
      this.passwordType = 'password';
    } else {
      this.passwordType = 'text';
    }
    this.showPassword = !this.showPassword;
  }

  becanLogin() {
    if (this.userName && this.passWord) {
      this.loginDisabled = true;
    } else {
      this.loginDisabled = false;
    }
  }

  /**
   * 账户密码登录
   */
  async login() {
    if (!this.loginDisabled) {
      return;
    }
    this.passwordErr = false;
    const params = {
      username: this.userName,
      password: this.passWord,
      url: this.redirectUrl,
      portal: true
    };
    const res = await OAuthApi.login(params);
    if (res.errcode === 200 && res.code) {
      this.getTokenParams.code = res.code;
      this.getToken(this.getTokenParams);
    } else if (res.errcode === 1000) {
      this.passwordErr = true;
    } else if (res.errcode === 10001) {
      this.passwordErr = true;
      this.overflowTips = true;
    } else if (res.errcode === 10002) {
      this.unAuthed = true;
    }
  }

  /**
   * 获取token
   */
  async getToken(params: any) {
    const res = await OAuthApi.getToken(params);
    if (res && res.success) {
      const token = (res as any).access_token;
      const refresh_tokens = (res as any).refresh_token;
      const expireTime = (res as any).exp;

      localStorage.setItem('refresh_token', refresh_tokens);
      localStorage.setItem('expireTime', expireTime);
      localStorage.setItem('token', token);
      this.$router.push({ name: 'myUnfinishedWorkItem' });
    }
  }

}
</script>
<style lang="less" scoped>
.login-account {
  float: right;
  margin-top: 110px;
  width: 360px;
  height: 400px;
  position: relative;
  background: #fff;
  border-radius: 6px;
  text-align: center;
  padding: 0 40px;
  &-header {
    font-size: 30px;
    color: #333;
    line-height: 40px;
    margin: 50px 0 42px 0;
  }
  &-type {
    position: absolute;
    top: 32px;
    right: 32px;
    cursor: pointer;
    img {
      width: 44px;
    }
  }
  &-forget {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    text-align: right;
    cursor: pointer;
  }
  .login-btn {
    width: 280px;
    background: #17bc94;
    border-radius: 4px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    color: #fff;
    margin: 42px auto;
    cursor: pointer;
  }
  .loginDisabled {
    color: rgba(255, 255, 255, 0.6);
  }
  .icon {
    cursor: pointer;
  }
}
.login-err-box {
  position: relative;
  /deep/ .ant-input {
    border-color: #f5222d !important;
    &:focus {
      box-shadow: 0 0 0 2px rgba(245, 34, 45, 0.2);
    }
  }
  .err-tips {
    font-size: 12px;
    color: #f5222d;
    text-align: left;
    line-height: 20px;
    position: absolute;
    top: 108px;
    left: 40px;
  }
}
.ant-modal-content {
  .ok-btn {
    background: #17bc94;
    border: 1px solid #17bc94;
  }
  .ant-modal-body {
    .img {
      margin-top: 26px;
    }
    .img-text {
      margin: 16px 0 18px 0;
    }
    .overflow-text {
      font-size: 16px;
    }
  }
}
</style>