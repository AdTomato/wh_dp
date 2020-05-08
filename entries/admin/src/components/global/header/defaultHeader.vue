<template>
  <div class="top-header">
    <div class="header-left flex-center">
      <img class="logo" src="~assets/images/logo.png" />
      <span>{{ $t('languages.ConsoleManager') }}</span>
    </div>
    <div class="header-content flex-center">
      <ul>
        <router-link
          tag="li"
          :to="module.url"
          activeClass="active"
          class="flex-center cursor-pointer"
          v-for="(module, index) in userModules"
          :key="index"
        >
          {{ $t('languages.'+ module.code) }}
          <span
            class="count-tips"
            v-if="module.code === 'SystemManager' && systemUnsetCount > 0"
          >{{ systemUnsetCount }}</span>
        </router-link>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';

import { State, namespace, Action } from 'vuex-class';

const UserModule = namespace('System/User');


@Component({
  name: 'defaultheader'
})

export default class defaultheader extends Vue {
  @UserModule.State('isOnlyAppAdmin') isOnlyAppAdmin!: boolean;

  @Action('getConfigCount') getConfigCount: any;

  @State('systemUnsetCount') systemUnsetCount!: number;

  // @State('showSysSettingCount') showSysSettingCount!: boolean;

  modules: Array<Common.AppModule> = [];

  userModules: Array<Common.AppModule> = [];

  // beforeMount() {
  //   this.modules =
  // }
  created() {
    this.getConfigCount();
    this.modules = [
      {
        code: 'AppManager',
        url: '/apps'
      },
      {
        code: 'Organization',
        url: '/organization'
      },
      {
        code: 'BizIntegration',
        url: '/integration'
      },
      {
        code: 'SystemManager',
        url: '/system',
      }
    ];

    if (this.isOnlyAppAdmin) {
      this.userModules = this.modules.filter((res: any) => {
        return res.code === 'AppManager'|| res.code === 'Organization'
      });
    } else {
      this.userModules = this.modules;
    } 
  }

  @Watch('isOnlyAppAdmin')
  onIsAdminChange() {
    if (this.isOnlyAppAdmin) {
      this.userModules = this.modules.filter((res: any) => {
        return res.code === 'AppManager'|| res.code === 'Organization'
      });
    } else {
      this.userModules = this.modules;
    }
  }
}
</script>


<style lang="less" scoped >
@import "~styles/themes/index.less";
.header-content {
  width: 100%;
  height: 100%;
  // background: #052535;
  @media screen and (min-width: 850px) {
    ul {
      height: 100%;
      margin: 0;
      li {
        position: relative;
        height: 100%;
        float: left;
        margin: 0 12px;
        padding: 0 8px;
        color: #fff;
        font-size: 16px;
        cursor: default;
        &.active {
          cursor: default !important;
          color: @header-active-color;
          // border-bottom: 2px solid @primary-color;
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            border-bottom: 3px solid @header-active-color;
          }
        }
        .count-tips {
          position: absolute;
          right: -6px;
          top: 11px;
          z-index: 9;
          display: inline-block;
          width: 20px;
          height: 20px;
          line-height: 20px;
          text-align: center;
          border: 1px solid #fff;
          color: #fff;
          font-size: 12px;
          border-radius: 50%;
          background: #f5222d;
        }
      }
    }
  }
  @media screen and (max-width: 850px) {
    ul {
      display: none;
    }
  }
}
.header-left {
  position: absolute;
  top: 0;
  left: 24px;
  height: 100%;
  min-width: 170px;
  .logo {
    display: inline-block;
    height: 31px;
  }
  span {
    margin-left: 20px;
    font-size: 18px;
    color: #fff;
  }
}
</style>
