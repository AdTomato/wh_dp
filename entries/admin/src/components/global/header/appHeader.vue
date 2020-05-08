<template>
  <div class="app-header">
    <div class="header-left">
      <router-link
        tag="i"
        :to="{ name: 'appcenter' }"
        class="icon aufontAll h-icon-all-arrow-left-o"
      >
      </router-link>
      <span v-if="$i18n.locale === 'zh'">{{ appInfo.name }}</span>
      <span v-else>{{ appName }}</span>
    </div>
    <div class="header-right">
      <!--
        // NOTE: 暂时隐藏应用设置独立路由
       -->
      <!-- <span @click="toSetting">{{ $t('languages.Apps.AppSetting') }}</span> -->
      <!-- <i class="divide"></i> -->
      <!-- <i class="icon aufontAll h-icon-all-question-circle-o"></i> -->
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { State, Action, namespace } from 'vuex-class';

import { LanguageTransform } from '@/utils';

const AppCenterModule = namespace('Apps/AppCenter');


@Component({
  name: 'AppHeader'
})

export default class AppHeader extends Vue {
  /* State */
  @AppCenterModule.State('appInfo') appInfo: any;

  /* Action */
  @AppCenterModule.Action('getAppDetail') getAppDetail: any;

  mounted() {
    const params: Apps.AppCenter.AppInfoParams = {
      appCode: this.$route.params.appCode
    };
    if (params.appCode) {
      this.getAppDetail(params);
    }
  }

  /**
   * 获取当前展示名
   */
  get appName() {
    if (!this.appInfo) {
      return '';
    }
    return LanguageTransform.getLang(this.appInfo.name, this.appInfo.name_i18n);
  }

  /**
   * 跳转到设置
   */
  toSetting() {
    this.$router.push({
      name: 'appSettings',
      params: {
        appCode: this.$route.params.appCode
      }
    });
  }
}
</script>

<style lang="less" scoped>
// .app-header {
//   background: #052535;
// }
.header-left {
  position: absolute;
  left: 24px;
  top: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  font-size: 18px;
  color: #fff;
  min-width: 170px;
  span {
    display: inline-block;
    margin-left: 25px;
  }
  .h-icon-all-arrow-left-o {
    cursor: pointer;
  }
}
.header-right {
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
  .divide {
    display: inline-block;
    width: 1px;
    height: 20px;
    margin: 0 24px;
    background: rgba(255, 255, 255, 0.2);
  }
}
</style>
