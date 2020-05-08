<template>
  <div class="edit-app">
    <a-tabs :defaultActiveKey="defaultActiveTab" :animated="false">
      <a-tab-pane
        v-for="t in tabs"
        :key="t.key"
        :tab="t.tab"
      >
        <component
          :is="t.key"
          :isTabPane="true"
          class="edit-app__panel"
        />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { Mutation, namespace } from 'vuex-class';
import Basic from '../settings/base-setting.vue';
import Permission from '../settings/permission-setting.vue';
// import Configs from '../settings/package-setting.vue';

@Component({
  name: 'edit-package',
  components: {
    Basic,
    Permission,
    // Configs,
  }
})
export default class EditPackage extends Vue {
  defaultActiveTab: string = 'basic';

  tabs: any[] = [];

  mounted() {
    this.tabs = [
      {
        tab: this.$t('languages.appSettings.baseSetting'),
        key: 'basic'
      },
      {
        tab: this.$t('languages.appSettings.permissionSetting'),
        key: 'permission'
      },
      // {
      //   tab: this.$t('languages.appSettings.packageSetting'),
      //   key: 'configs'
      // }
    ];
  }
}
</script>
<style lang="less" scoped>
.edit-app {
  height: 100%;
  /deep/.ant-tabs {
    height: 100%;
  }
  /deep/.ant-tabs-content {
    height: calc(100% - 56px);
  }
  /deep/.ant-tabs-tabpane {
    height: 100%;
  }
  /deep/.ant-tabs-bar {
    margin: 0 24px;
  }
  &__panel {
    &.base-settings {
      margin-top: 30px;
    }
  }
}
</style>
