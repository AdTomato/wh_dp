
<template>
  <a-tabs class="form-panel" defaultActiveKey="2">
    <a-tab-pane :tab="$t('languages.Apps.FormDesignPage.DataItem')" key="1">
      <data-item-panel></data-item-panel>
    </a-tab-pane>

    <a-tab-pane :tab="$t('languages.Apps.FormDesignPage.Control')" key="2">
      <control-panel></control-panel>
    </a-tab-pane>
  </a-tabs>
</template>


<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

import ControlPanel from "./control-panel.vue";
import DataItemPanel from "./data-item-panel.vue";

@Component({
  name: "form-design-panel",
  components: {
    ControlPanel,
    DataItemPanel
  }
})
export default class FormDesignPanel extends Vue {}
</script>

<style lang="less">

.form-panel {
  padding-right: 8px;
  &.ant-tabs {
    display: flex;
    flex-direction: column;
    // height: 100%;
  }
  .ant-tabs-bar, .ant-tabs-tabpane {
    background: #fff;
    border-radius: 4px;
  }
  .ant-tabs-tab {
    width: 88px;
    font-size: 12px;
  }
  .ant-tabs-nav-wrap{
    text-align: center;
  }
  .ant-tabs-content {
    flex: 1;
    height: 100%;
    .ant-tabs-tabpane {
      overflow: auto;
      min-height: 100%;
    }
  }
  .h3-panel-header > span{
    font-size: 12px !important;
  }
  
}
</style>
