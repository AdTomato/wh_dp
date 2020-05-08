<template>
  <div class="login">
    <div class="login-head">
      <img src="../../assets/images/yslogo.png" />
    </div>
    <div class="login-content">
      <div class="login-content-contain">
        <div class="login-content-contain__left">
          <!-- <h1>重塑连接，赋能业务在线</h1>
          <h2>弥合管理碎片，盘活IT资产</h2>-->
          <img class="bj-image" src="../../assets/images/bj.png" />
        </div>

        <account-login
          v-show="loginMode !== 1 && defaultView ==='pwd'"
          :toggleMode="toggleMode"
          @toggle="toggleLoginType('pwd')"
        />

        <qrcode-login
          v-show="loginMode !== 0 && defaultView ==='qrcode'"
          :toggleMode="toggleMode"
          :appId="appId"
          ref="qrcodeLogin"
          @toggle="toggleLoginType('qrcode')"
        />

      </div>
    </div>
    <div class="login-footer">
      <div class="login-footer-center">
        <div class="login-line"></div>
        <div>版权所有 &copy;深圳奥哲网络科技有限公司 粤ICP备10083177号</div>
        <div class="login-line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Model } from 'vue-property-decorator';
import {
  Modal,
} from 'h3-antd-vue';
import OAuthApi from '@/apis/oauth';
import { utils } from '@cloudpivot/common';

import QrcodeLogin from './qrcode-login.vue';

import AccountLogin from './account-login.vue';

@Component({
  name: 'Login',
  components: {
    QrcodeLogin,
    AccountLogin,
  }
})
export default class Login extends Vue {
  appId: string = '';

  loginMode: number = 1; // 登录模式: 0,账户密码登录   1，扫码登录  2,账户密码与扫码切换登录

  toggleMode: boolean = false; // 是否展示切换模式

  defaultView: string = 'qrcode'; // 默认展示页面

  async mounted() {
    // 获取环境配置
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('expireTime');
    const config = await OAuthApi.getSystemConfig();
    // console.log('config', config);
    if (config) {
      this.appId = config.scanAppId;
      this.loginMode = config.loginType;
    }

    this.toggleMode = this.loginMode === 2;
    this.defaultView = this.loginMode === 0 ? 'pwd' : 'qrcode';
    if (this.loginMode !== 0) {
      const qrcodeLoginModal: any = this.$refs.qrcodeLogin;
      qrcodeLoginModal.initLoginQrcode();
    }

    const errcode = utils.parseUrlParam(window.location.href, 'errcode');
    
    if (errcode) {
      let errMsg:string = '当前企业没有此用户，请联系管理员！';
      
      if (errcode === '201018') {
        errMsg = '该用户已被停用，请联系管理员！';
      } else if (errcode === '10002') {
        errMsg = '您无此访问权限，请联系管理员'
      }

      const vm:any = this;
      Modal.error({
        title: errMsg,
        onOk() {
          vm.$router.replace({
            ...vm.$route,
            query: {}
          })
        }
      });

    }
  }

  /*
  * 切换登录方式
  */
  toggleLoginType(type: string) {
    console.log(type);
    if (type === 'qrcode') {
      this.loginMode = 0;
      this.defaultView = 'pwd';
    } else {
      this.loginMode = 1;
      this.defaultView = 'qrcode';
    }
  }

}
</script>

<style lang="less" scoped>
.login {
  .login-head {
    width: 100%;
    height: 64px;
    line-height: 64px;
    padding-left: 24px;

    & > img {
      max-height: 30px !important;
    }
  }
  .login-content {
    height: 736px;
    background: #002638;
    &-contain {
      width: 1066px;
      height: 100%;
      overflow: hidden;
      margin: 0 auto;
      &__left {
        position: relative;
        height: 100%;
        float: left;
        h1 {
          font-size: 40px;
          margin-top: 80px;
          margin-left: 82px;
          font-weight: 400;
          line-height: 48px;
          color: #fff;
        }
        h2 {
          font-size: 28px;
          margin-top: 8px;
          margin-left: 82px;
          margin-bottom: 8px;
          font-weight: 400;
          color: #fff;
        }
        .bj-image {
          margin-top: 102px;
        }
      }
    }
  }
  .login-footer {
    height: 79px;
    font-size: 12px;
    line-height: 79px;
    background: #fff;
    z-index: 9;
    text-align: center;
    .login-footer-center {
      width: 600px;
      overflow: hidden;
      margin: 0 auto;
      div {
        float: left;
      }
      .login-line {
        width: 94px;
        height: 1px;
        margin: 39px 16px;
        background: #efefef;
      }
    }
  }
}
</style>
