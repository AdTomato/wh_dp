<template>
  <div class="header common-header">
    <div class="logo" @click="goHome">
      <img :src="logo" alt />
      <a
        class="open-blank"
        v-if="isDingTalk"
        @click="openBlank">在浏览器中打开</a>
    </div>

    <div class="header-right">
      <div class="menu">
        <ul>
          <application-header />
          <li>
            <a-dropdown :trigger="['click']">
              <div class="user-info">
                <div class="avatar-box">
                  <img v-if="userInfo.imgUrl" :src="userInfo.imgUrl" />
                  <i v-else class="icon aufontAll h-icon-all-normal_smile default-avatar"></i>
                  <i class="icon aufontAll h-icon-all-caret-down"></i>
                </div>
              </div>
              <div class="info-box" slot="overlay">
                <ul>
                  <li class="user" @click="toUserInfo">
                    <div class="user-name">
                      <span>{{ userInfo.name }}</span>
                      <span class="mobile">{{ userInfo.mobile }}</span>
                    </div>
                  </li>
                  <li v-if="isAdmin">
                    <a @click="toAdmin">
                      <i class="icon aufontAll h-icon-all-disassembly-o"></i>
                      {{ $t('languages.common.backStageManager') }}
                    </a>
                  </li>
                  <!-- <li>
                    <a @click="toUserInfo">
                      <i class="icon aufontAll h-icon-all-team-singlechoice-o"></i>
                      {{ $t('languages.common.personalInfo') }}
                    </a>
                  </li> -->
                  <li v-if="isShowToggle">
                    <a @click="toggleLanguage" class="toggle-lang">
                      <i class="icon aufontAll h-icon-all-swap-o"></i>
                      {{ $t('languages.common.switch') }}
                      <span
                        :class="$i18n.locale === 'zh' ? 'active' : ''"
                      >中</span> /
                      <span :class="$i18n.locale === 'en' ? 'active' : ''">En</span>
                    </a>
                  </li>
                  <li>
                    <a href="http://help.cloudpivot.cn/" target="_blank">
                      <i class="icon aufontAll h-icon-all-question-circle-o"></i>
                      {{ $t('languages.common.helpCenter') }}
                    </a>
                  </li>
                  <li v-if="!isDingTalk">
                    <a @click="logout">
                      <i class="icon aufontAll h-icon-all-poweroff-o"></i>
                      {{ $t('languages.common.exitSys') }}
                    </a>
                  </li>
                </ul>
              </div>
            </a-dropdown>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import * as ApplicationComponents from '@cloudpivot/application';

import {
  Dropdown
} from 'h3-antd-vue';

import {
  Mutation, namespace
} from 'vuex-class';

import OAuthApi from '@/apis/oauth';

import env from '@/config/env';
import site from '@/config/site';

const icon = require('@/assets/icons/appicon.svg');

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

const SystemModule = namespace('System/System');

@Component({
  name: 'common-header',
  components: {
    ADropdown: Dropdown,
    ApplicationHeader: ApplicationComponents.components.pc.ApplicationHeader
  }
})

export default class CommonHeader extends Vue {
  @WorkflowCenterModule.Mutation('setAsideTitle') setAsideTitle: any;

  @WorkflowCenterModule.Mutation('setUserId') setUserId: any;

  @SystemModule.State('isAdmin') isAdmin: any;

  @SystemModule.Mutation('setIsAdmin') setIsAdmin: any;

  @SystemModule.Mutation('setAdmin') setAdmin: any;

  get logo() {
    return site.logo;
  }

  get isShowToggle() {
    return this.$store.state.config.multiLanguageSwitch;
  }

  // 用户信息
  userInfo: any = {}


  created() {
    // 获取当前选中的菜单名称
    this.getUserInfo();
  }


  // 跳转到个人中心
  toUserInfo() {
    // window.location.href = '/user/info';
    this.$router.push('/user');
  }

  // 跳转后台管理
  toAdmin() {
    const token = localStorage.getItem('token');
    if (this.isDingTalk && token) {
      window.open(`${env.portalHost}/admin?admin_token=${token}`, '_blank');
    } else {
      window.open(`${env.portalHost}/admin`, '_blank');
    }
  }

  // 退出登录
  logout() {
    const vm = this;
    vm.$confirm({
      title: this.$t('languages.common.tip.sureToLogOut').toString(),
      okText: this.$t('languages.common.tip.confirm').toString(),
      cancelText: this.$t('languages.common.tip.cancel').toString(),
      onOk() {
        const logoutIP = env.oauthHost;
        const redirectIP = env.redirectHost;
        const token = localStorage.getItem('token');
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('expireTime');
        sessionStorage.removeItem('user');
        window.location.href = `${logoutIP}/logout?redirect_uri=${redirectIP}/login&access_token=${token}`;
      }
    });
  }

  // 跳转到首页
  goHome() {
    const appCode = window.Environment ? window.Environment.appCode : null;
    if (appCode) {
      this.$router.push({
        name: 'singleApp',
        params: {
          appCode
        }
      })
    } else {
      this.$router.push({ name: "myUnfinishedWorkItem" });
    }
  }

  openBlank() {
    const url = `${location.href}${location.href.indexOf('?') > -1 ? '&' : '?'}access_token=${localStorage.getItem('token')}`;

    window.open(url, '_blank');
  }

  // 获取当前用户信息
  async getUserInfo() {
    const res = await OAuthApi.getUserInfo();
    if (res.errcode === 0) {
      const info:any = res.data;
      this.userInfo = info;
      this.setUserId(info.id);
      sessionStorage.setItem('user', JSON.stringify(info));
      // 判断当前用户角色
      const isAppAdmin:boolean = info.permissions.includes('APP_MNG');
      const isSysAdmin:boolean = info.permissions.includes('SYS_MNG');
      const isRootAdmin:boolean = info.permissions.includes('ADMIN');
      const isAdmin:boolean = isAppAdmin || isSysAdmin || isRootAdmin;
      this.setIsAdmin(isAdmin);
      this.setAdmin((isSysAdmin || isRootAdmin));
      // 禁止无权限访问流程查询页面
      if (!isSysAdmin && !isRootAdmin && this.$route.name && ['queryInstance','queryParticipantWorkItem'].includes(this.$route.name)) {
        this.$router.replace({ name: 'myUnfinishedWorkItem' })
      }
    }
  }

  /**
   * 切换多语言
   */
  toggleLanguage() {
    if (this.$i18n.locale === 'zh') {
      this.$i18n.locale = 'en';
    } else {
      this.$i18n.locale = 'zh';
    }
    this.$forceUpdate();
    localStorage.setItem('locale', this.$i18n.locale);
  }
}
</script>
<style lang="less" scoped>
@import "../../../styles/themes/default.less";
@menu-box-shadow: 0px 2px 8px 0px rgba(30, 85, 255, 0.1);
.common-header {
  height: 64px;
  padding: 0 @base4-padding-lg!important;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: @base4-padding-lg;
  box-shadow: @menu-box-shadow;
  .logo {
    margin-right: 10px;
    cursor: pointer;
    & > img {
      max-height: 30px !important;
    }
  }
  .header-right {
    .menu {
      height: 100%;
      ul {
        display: flex;
        align-items: center;
      }
    }
    .menu > ul > li {
      flex: none;
      margin-right: @base4-padding-lg * 2;
      &:last-of-type {
        margin-right: 0;
      }
      a {
        font-size: @font-size-14;
        color: @light-color-1;
        text-decoration: none;
        position: relative;
        display: block;
        line-height: 64px;
        span {
          max-width: 7em;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:hover {
          color: @primary-color;
        }
        &.router-link-active {
          color: @primary-color;
          &::after {
            content: "";
            display: block;
            position: absolute;
            left: -7px;
            bottom: 1px;
            width: calc(100% + 14px);
            height: 3px;
            border-radius: 2px;
            background: @primary-color;
          }
        }
      }
      &.more {
        position: relative;
        height: 64px;
        width: 33px;
        margin-right: 20px;
        cursor: pointer;
        .icon {
          display: block;
          height: 100%;
          line-height: 64px;
          color: @light-color-3;
          &.active {
            color: @primary-color;
            //   &::after {
            //   content: '';
            //   display: block;
            //   position: absolute;
            //   left: -7px;
            //   width: 100%;
            //   height: 3px;
            //   border-radius: 2px;
            //   background: @primary-color;
            // }
          }
        }
        &.active {
          color: @primary-color;
          &::after {
            content: "";
            display: block;
            position: absolute;
            left: -7px;
            width: calc(100% + 14px);
            height: 3px;
            border-radius: 2px;
            background: @primary-color;
          }
        }
      }
      & > .user-info {
        position: relative;
        display: flex;
        align-items: center;
        height: 64px;
        cursor: pointer;
        &::before {
          content: "";
          display: block;
          width: 1px;
          height: 30px;
          background-color: rgba(234, 237, 243, 1);
          position: absolute;
          left: -20px;
          top: 17px;
        }
        .avatar-box {
          & > img {
            width: 32px;
            height: 32px;
            border-radius: 50%;
          }
          & > .icon {
            margin-left: 5px;
            display: inline-block;
            vertical-align: middle;
            font-size: 14px;
            color: #8c8c8c;
            &.default-avatar {
              font-size: 32px;
              color: #7165ff;
            }
            &.h-icon-all-caret-down {
              transform: scale(0.7);
            }
          }
        }
      }
    }
  }
}
.info-box {
  background-color: white;
  text-align: left;
  box-shadow: 0px 2px 8px 0px rgba(30, 85, 255, 0.15);
  border-radius: @border-radius-lg;
  & > ul > li {
    padding: 5px @base10-padding-md;
    &.user {
      cursor: pointer;
      border-bottom: 1px solid @base-border-color;
      &::before{
        display: none;
      }
    }
    & > .user-name {
      text-align: left;
      span {
        display: block;
        color: @light-color-1;
        &.mobile {
          color: @light-color-3;
          &::before{
            display: none;
          }
        }
      }
    }
    a {
      color: @light-color-1;
      & > .icon {
        margin-right: 8px;
      }
    }
    &:hover {
      background-color: rgba(240, 247, 255, 1);
    }
  }
  .toggle-lang {
    & span.active {
      color: @primary-color;
    }
  }
}
</style>
