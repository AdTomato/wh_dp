<template>
  <section class="main">
    <div class="content">
      <BaseInfo ref="baseInfo" :baseInfo="baseInfo"></BaseInfo>
      <a-tabs class="form-track__tabs" defaultActiveKey="chart">
        <a-tab-pane :tab="$t('cloudpivot.flow.pc.WorkflowChart')" key="chart">
          <Chart
            v-show="chart && chart.activities"
            :chart="chart"
            :workflowStatus="baseInfo.status"
            @clickActivity="clickActivity"
          >
          </Chart>
        </a-tab-pane>
        <a-tab-pane :tab="$t('cloudpivot.flow.pc.ApprovalLog')" key="logs">
          <Log :logs="logs"></Log>
        </a-tab-pane>
      </a-tabs>
      <PageLoading v-model="loading"></PageLoading>
    </div>
  </section>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";
import { Tabs } from "h3-antd-vue";
import { mixins } from "vue-class-component";
import WorkflowMixin from "./mixins/workflow";
import BaseInfo from "./base-info.vue";
import Chart from "./chart.vue";
import Log from "./logs.vue";
import ChartCard from "./chart-card";
import common from "@cloudpivot/common";
import { workflowApi, workflow } from "@cloudpivot/api";

@Component({
  name: "workflow-track",
  components: {
    BaseInfo,
    Chart,
    Log,
    PageLoading: common.components.pc.PageLoading,
    ATabs: Tabs,
    ATabPane: Tabs.TabPane
  }
})
export default class FormWorkflowTrack extends mixins(WorkflowMixin) {

  @Prop({
    default: {}
  })
  baseInfo !: workflow.InstanceBaseInfo; // 流程跟踪基础信息

  @Prop({
    default: {}
  })
  chart!: workflow.Chart; // 流程图

  @Prop({
    default: []
  })
  logs !: workflow.WorkflowTrackLog[]; // 审批日志

  record: workflow.WorkflowTrackLog[] = [];

  @Prop({
    default: true
  })
  loading !: boolean;

  @Prop({
    default: ""
  })
  workflowInstanceId!: string; // 流程实例Id

  // @Prop({
  //   default: ""
  // })
  // workItemId!: string; // 流程Id

  i18n: any = {};

  mounted() {
    this.i18n = {
      receiverTime: `${this.$t('cloudpivot.flow.pc.ReceiveTime')}:`,
      finishTime: `${this.$t('cloudpivot.flow.pc.FinishTimes')}:`,
      predictor: `${this.$t('cloudpivot.flow.pc.Predictor')}`,
      assist: `${this.$t('cloudpivot.flow.pc.Assist')}`,
      addWorkitem: `${this.$t('cloudpivot.flow.pc.AddWorkitem')}`,
      circulate: `${this.$t('cloudpivot.flow.pc.Circulate')}`,
      forward: `${this.$t('cloudpivot.flow.pc.Forward')}`,
    };
  }


  /**
   * 流程点击回调
   * @params activity 流程原型数据
   * @params e        触发的Element Event
   */
  async clickActivity(activity: any, e: MouseEvent) {
    // 系统活动节点暂不生成chartCard
    if (activity.activityType === 'SYSTEM_ACTIVITY') {
      return;
    }
    this.record = [];
    const rect: DOMRect = (e.currentTarget as HTMLElement).getBoundingClientRect() as DOMRect;
    this.record = this.logs.filter(
      (log: workflow.WorkflowTrackLog) => log.activityCode === activity.activityCode
    );
    if (this.record && this.record.length) {
      ChartCard({ record: this.record, rect, fn: this.goSubWorkflowForm, i18n: this.i18n, statusFn: this.chartCardStatus });
    } else {
      const res: any = await workflowApi.getActivityPreprocessors({
        workflowInstanceId: this.workflowInstanceId,
        activityCode: activity.activityCode
      });
      if (!res.errcode && res.data.length) {
        ChartCard({ record: res.data, rect, estimate: true, i18n: this.i18n, statusFn: this.chartCardStatus });
      }
    }
  }

  /**
   * 打开子流程表单
   */
  goSubWorkflowForm(log: any) {
    this.$router.push({
      name: "form-detail",
      query: {
        workflowInstanceId: log.subWorkflowInstanceId,
        workitemId: log.subWorkItemId,
        return: `${location.pathname + location.search}`
      }
    });
  }

  // ChartCard状态多语言
  chartCardStatus(value: any, type: string) {
    if (type === 'subInstance') {
      return this.getSubWorkflowActionStatus(value);
    } else {
      return this.getWorkflowActionStatus(value);
    }
  }

}
</script>
<style lang="less">
.ant-popover-inner {
  box-shadow: 0 2px 8px 0 rgba(30, 85, 255, 0.15);
}
</style>
<style lang="less">
@import "../style.less";

.form-track {
  .main {
    flex:none!important;
    display: flex;
    flex-direction: column;
    position: relative;
    height:calc(100vh - 64px);
    > .content {
      padding: 60px 0 100px;
      align-self: center;
      height: auto;
      width: @layout-min-width !important;
    }
  }
  &__tabs {
    margin-top: @base4-padding-sm;
  }
}
</style>
