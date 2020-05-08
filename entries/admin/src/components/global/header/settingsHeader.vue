<template>
  <div class="settings-header">
    <div class="settings-header__left">
      <router-link
        tag="i"
        :to="{ name: 'appitem' }"
        class="icon aufontAll h-icon-all-arrow-left-o"
      >
      </router-link>
      <span>{{ $t('languages.Apps.AppSetting') }}</span>
      <i class="divide"></i>
      <span>{{ appInfo.name }}</span>
    </div>
    <div class="settings-header__right">
      <i class="icon aufontAll h-icon-all-question-circle-o"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';

const AppCenterModule = namespace('Apps/AppCenter');


@Component({
  name: 'AppHeader'
  })

export default class AppHeader extends Vue {
  /* State */
  @AppCenterModule.State('appInfo') appInfo: any;
}
</script>

<style lang="less" scoped>
.settings-header {
  .settings-header__left {
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #fff;
    span {
      display: inline-block;
      &:first-of-type {
        margin-left: 25px;
      }
    }
    .h-icon-all-arrow-left-o {
      cursor: pointer;
    }
  }
  .settings-header__right {
    position: absolute;
    right: 130px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    color: #fff;
    span {
      display: inline-block;
      padding: 2px 8px;
      border:1px solid #fff;
      border-radius:4px;
      font-family:PingFangSC-Regular;
      font-weight:400;
      cursor: pointer;
    }
    .h-icon-all-question-circle-o {
      font-size: 20px;
    }
  }
  .divide {
    display: inline-block;
    width: 1px;
    height: 20px;
    margin: 0 16px;
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
