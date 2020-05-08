<template>
  <div class="login-account" :class="{ 'login-err-box': passwordErr }">
    <div class="login-account-login">
      <img src="./logo.svg" />
    </div>
    <div class="login-account-form">
      <login-input
        :placeholder="'请输入账号'"
        :lable="'账号'"
        v-model="userName"
        @change="becanLogin"
        :type="'text'"
      />

      <login-input
        :placeholder="'请输入密码'"
        :lable="'账号密码'"
        class="login-last-input"
        v-model="passWord"
        @change="becanLogin"
        :type="'password'"
      />
    </div>

    <div class="login-account-button">
      <h3-button @click="login"> 登&nbsp;录 </h3-button>
    </div>

    <div class="login-forget-tips clearfix">
      <span @click="toggle">忘记密码</span>
    </div>

    <div>
      <h3-dialog v-model="showToast" class="dialog-main">
        <div>
          <div class="dialog-content">
            <p>请联系系统管理员重置密码</p>
          </div>

          <div class="dialog-footer">
            <span @click="showToast = false">确定</span>
          </div>
        </div>
        <!-- <div @click="showToast=false">
          <span class="h3-close"></span>
        </div> -->
      </h3-dialog>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import OAuthApi from "./oauth-api";

import env from "@/config/env";

import LoginInput from "./login-input.vue";

import { H3Input, H3Button, datetime, H3Modal } from "h3-mobile-vue";

import H3Dialog from "h3-mobile-vue/src/components/h3-dialog/index";

enum loginError {
  passwordErr = 1000,
  overThreeErr = 10001
}

@Component({
  name: "login-account",
  components: {
    LoginInput,
    H3Button,
    H3Dialog,
    H3Modal
  }
})
export default class LoginAccount extends Vue {
  @Prop({
    default: false
  })
  toggleMode!: boolean;

  redirectUrl: string = ""; // 登陆回跳地址

  getTokenParams: any = {
    code: "",
    url: "",
    client_secret: "",
    client_id: "",
    redirect_uri: ""
  };

  passwordErr: boolean = false; // 账户密码错误

  passwordType: string = "password"; // 密码的展示形式

  showPassword: boolean = false;

  overflowTips: boolean = false; // 密码输入已超过3次提示

  loginDisabled: boolean = false; // 登录禁用状态

  userName: string = ""; // 登录账号

  passWord: string = ""; // 登录密码

  visible: boolean = false; // 忘记密码提示窗

  created() {
    this.generateUrls();
  }

  /**
   * 初始化地址和固定传参
   */
  generateUrls() {
    const { oauthHost, client_id, scope, secret, redirectHost } = env;
    // debugger;
    // 回跳地址
    this.redirectUrl = `${oauthHost}/login?redirect_uri=${encodeURIComponent(
      `${oauthHost}/oauth/authorize?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirectHost}/oauth`
    )}`;
    // 请求token参数
    this.getTokenParams = {
      code: "",
      url: oauthHost,
      client_secret: secret,
      client_id: client_id,
      redirect_uri: `${redirectHost}/oauth`
    };
  }

  passwordVisible() {
    if (this.showPassword) {
      this.passwordType = "password";
    } else {
      this.passwordType = "text";
    }
    this.showPassword = !this.showPassword;
  }

  becanLogin() {
    // debugger;
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
    } else if (res.errcode === loginError.passwordErr) {
      this.passwordErr = true;
      this.showError("用户名或密码错误，请重新输入");
    } else if (res.errcode === loginError.overThreeErr) {
      this.passwordErr = true;
      this.overflowTips = true; // 超过3次
      this.showError("密码输入已超过3次,请1分钟后再尝试");
    }
  }

  showError(text: string) {
    this.$h3.toast.show({
      text,
      autoHide: true,
      iconType: text.length < 8 ? "close" : ""
    });
  }

  /**
   * 获取token
   */
  async getToken(params: any) {
    const res = await OAuthApi.getToken(params);
    if (res && res.success) {
      // debugger;
      const token = (res as any).access_token;
      const refresh_tokens = (res as any).refresh_token;
      const expireTime = (res as any).exp;

      localStorage.setItem("refresh_token", refresh_tokens);
      localStorage.setItem("expireTime", expireTime);
      localStorage.setItem("token", token);
      this.$router.push({ name: "home" });
    }
  }
  showToast = false;
  toggle() {
    // this.showError('请联系系统管理员重置密码');
    this.showToast = true;
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.login-account {
  background: #fff;
  overflow: hidden;
  height: 100%;
  height: 100%;
  .login-account-login {
    padding-top: 2rem;
    padding-bottom: 1.76rem;
    img {
      width: 1.86rem;
    }
  }
  .login-account-form {
    margin: 0 0.86rem;
    .login-last-input {
      margin-top: 0.387rem;
    }
  }
  .login-account-button {
    margin: 0 0.86rem;
    margin-top: 1.6rem;
    /deep/.h3-button {
      border-radius: 47px;
      background-color: @primary-color;
      color: #fff;
    }
  }
  .login-forget-tips {
    margin: 0 0.86rem;
    padding-top: 0.63rem;
    span {
      float: right;
      color: rgba(153, 153, 153, 1);
      font-size: 0.373rem;
    }
  }
  .dialog-main {
    border-radius: 0.186rem;
    .dialog-footer {
      span {
        line-height: 1.33rem;
        color: @primary-color;
        font-size: 0.453rem;
      }
      position: relative;
      .hairline("top", rgba(221, 221, 221, 1));
    }
    .dialog-content {
      min-height: 2.266rem;
      display: flex;
      justify-content: center;
      // justify-items: center;
      align-items: center;
      p {
        font-size: 0.4rem;
        color: rgba(51, 51, 51, 1);
      }
    }
  }
}
</style>
