<template>
  <div class="workflow-setting">
    <a-tabs defaultActiveKey="1">
      <!-- 参数设置 -->
      <a-tab-pane tab="参数设置" key="1">
        <param-setting/>
      </a-tab-pane>
      <!-- 历史版本 -->
      <a-tab-pane tab="历史版本" key="2">
        <history-version/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import ParamSetting from '@/components/apps/workflowSetting/paramSetting.vue';
import HistoryVersion from '@/components/apps/workflowSetting/historyVersion.vue';

@Component({
  name: 'WorkflowSetting',
  components: {
  ParamSetting,
  HistoryVersion
  }
  })
export default class WorkflowSetting extends Vue {
}
</script>
<style lang="less">
.workflow-setting{
  .ant-tabs-bar{
    margin: 0px;
    .ant-tabs-nav-scroll{
      text-align: left;
      margin: 0px 24px;
      .ant-tabs-tab{
        padding: 16px 16px 12px 16px;
      }
    }
  }
}
</style>
