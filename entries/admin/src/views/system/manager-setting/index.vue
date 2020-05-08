<template>
  <div class="manager-setting">
    <div class="manager-setting__tabs">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane :tab="'系统管理员'" key="1">
          <div class="tabs__wrap">
            <system-manager/>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="'应用管理员'" key="2">
          <div class="tabs__wrap">
            <apps-manager/>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="'数据管理员'" key="3">
          <div class="tabs__wrap">
            <data-manager/>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import SystemManager from './system-manager.vue';
import AppsManager from './apps-manager.vue';
import DataManager from './data-manager.vue';

@Component({
  name: "manager-setting",
  components: {
  SystemManager,
  AppsManager,
  DataManager
  }
  })
export default class ManagerSetting extends Vue {}
</script>
<style lang="less" scoped>
.manager-setting {
  text-align: left;
  &__tabs {
    /deep/.ant-tabs-nav {
      margin: 0 24px;
    }
    .tabs__wrap{
      margin:0 24px;
    }
  }
  /deep/.ant-table-body, /deep/.ant-table-header {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>

