<template>
  <sider-layout
    v-if="appInfo && appInfo.code && menus.length"
    :list="menus"
    @onRoute="onRoute"
  />
</template>

<script lang="ts">
/* NOTE: 无用组件 */
import { Component, Vue } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import SiderLayout from '@/components/global/sider-layout/index.vue';

const AppCenterModule = namespace('Apps/AppCenter');

interface MenuItem {
  name: string,
  icon: string,
  code: string,
  isSelected: boolean
}

@Component({
  name: 'settings',
  components: {
    SiderLayout
  }
})
export default class Settings extends Vue {
  @AppCenterModule.State('appInfo') appInfo: any;

  @AppCenterModule.Action('getAppDetail') getAppDetail: any;

  menus: Array<MenuItem> = [];

  /**
   * 点击切换路由
   */
  onRoute(item: MenuItem) {
    this.$router.push({ name: item.code });
  }

  /**
   * 设置多语言配置菜单
   */
  setMenus() {
    this.menus = [{
      name: 'languages.appSettings.baseSetting',
      code: 'baseSetting',
      icon: 'h-icon-all-setting-o',
      isSelected: true
    },
    {
      name: 'languages.appSettings.permissionSetting',
      code: 'permissionSetting',
      icon: 'h-icon-all-setting-o',
      isSelected: true
    },
    {
      name: 'languages.appSettings.packageSetting',
      code: 'packageSetting',
      icon: 'h-icon-all-setting-o',
      isSelected: true
    }];
  }

  beforeMount() {
    this.setMenus();
    const params: Apps.AppCenter.AppInfoParams = {
      appCode: this.$route.params.appCode
    };
    if (params.appCode) {
      this.getAppDetail(params);
    }
  }
}
</script>
