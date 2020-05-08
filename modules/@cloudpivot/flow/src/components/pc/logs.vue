<template>
  <a-table
    class="flow-track-log"
    :columns="columns"
    :rowKey="rowKey"
    :dataSource="this.logs"
    :pagination="false"
    size="small"
  >
    <Participants 
      slot="originator" 
      slot-scope="text,record" 
      :participants="text ? [text] : []"
    ></Participants>
    <template slot="approvalActionStatus" slot-scope="text,record">
      <a
        v-if="record.subInstanceActivity"
        @click="goToSubInstance(record.subWorkItemId, record.subWorkflowInstanceId)"
      >{{ getWorkItemStatus(record.workItemStatus) }}</a>
      <span v-else>{{ getWorkflowActionStatus(record.approvalActionStatus) }}</span>
    </template>

    <!-- 序号 -->
    <span
      slot="codeTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.Number') }}</span>

    <!-- 节点名称 -->
    <span
      slot="activityNameTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.ActivityName') }}</span>

    <!-- <span
      slot="activity"
      slot-scope="text,record"
      class="resize"
    >{{ isChinese ? text : record.name_i18n[$i18n.locale] }}</span> -->

    <!-- 接收时间 -->
    <span
      slot="receiveTimeTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.ReceiveTime') }}</span>

    <!-- 完成时间 -->
    <span
      slot="finishTimeTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.FinishTimes') }}</span>

    <!-- 耗时 -->
    <span
      slot="usedTimeTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.CostTime') }}</span>

    <!-- 参与者 -->
    <span
      slot="originatorTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.Originator') }}</span>

    <!-- 操作 -->
    <span
      slot="approvalActionStatusTitle"
      class="resize"
    >{{ $t('cloudpivot.flow.pc.ApprovalAction') }}</span>
  </a-table>
</template>

<script lang="ts">
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import { Table } from "h3-antd-vue";
import Participants from "./participants.vue";
import WorkflowMixin from "./mixins/workflow";
import { msesToTimeStr } from "@cloudpivot/common/src/utils/date";

import { workflow } from "@cloudpivot/api";

let tmpActivityCode:string = '';

@Component({
  name: "flow-track-log",
  components: {
    ATable: Table,
    Participants
  }
})
export default class FormWorkflowTrackLog extends mixins(WorkflowMixin) {
  @Prop({ default: [] }) logs!: workflow.WorkflowTrackLog[];

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  logsCode: any = {};

  columns: any[] = [];

  mounted() {
    this.initColums();
  }

  /**
   * 获取table Index
   * @param record
   * @param index
   */
  rowKey(record: workflow.WorkflowTrackLog, index: number) {
    return index;
  }

  // 初始化表格配置
  initColums() {
    const vm:any = this;
    this.columns = [
      {
        dataIndex: "code",
        key: "code",
        // width: 125,
        width: 60,
        align: "center",
        slots: { title: 'codeTitle' },
        customRender: (
          text: any,
          record: workflow.WorkflowTrackLog,
          index: number
        ) => index + 1
      },
      {
        dataIndex: "activityName",
        slots: { title: 'activityNameTitle' },
        // scopedSlots: { customRender: 'activity' },
        width: 139,
        customRender: (
          text: any,
          record: workflow.WorkflowTrackLog,
          index: number
        ) => {
          if (record.activityCode === tmpActivityCode) {
            return '';
          }
          tmpActivityCode = record.activityCode || '';
          if (vm.$i18n) {
            return vm.isChinese ? text : record.name_i18n[vm.$i18n.locale];
          }
          return text;
        }
      },
      {
        dataIndex: "receiveTime",
        slots: { title: 'receiveTimeTitle' },
        width: 162,
        customRender: this.workItemLogTimeFormat
      },
      {
        dataIndex: "finishTime",
        slots: { title: 'finishTimeTitle' },
        width: 162,
        customRender: this.workItemLogTimeFormat
      },
      {
        dataIndex: "usedTime",
        slots: { title: 'usedTimeTitle' },
        width: 160,
        customRender: (
          text: any,
          record: workflow.WorkflowTrackLog,
          index: number
        ) => { return msesToTimeStr(text) ? msesToTimeStr(text) : '--'; }
      },
      {
        dataIndex: "originator",
        slots: { title: 'originatorTitle' },
        width: 160,
        scopedSlots: { customRender: "originator" }
      },
      {
        dataIndex: "approvalActionStatus",
        slots: { title: 'approvalActionStatusTitle' },
        width: 80,
        scopedSlots: { customRender: "approvalActionStatus" }
      }
    ];
  }

  /**
   * 跳转到子流程实例
   * @param subWorkItemId
   * @param subWorkflowInstanceId
   */
  goToSubInstance(subWorkItemId: string, subWorkflowInstanceId: string) {
    this.$router.push({
      name: "form-detail",
      query: {
        workflowInstanceId: subWorkflowInstanceId,
        workitemId: subWorkItemId,
        return: `${location.pathname + location.search}`
      }
    });
  }

  @Watch('logs')
  onSaveFlagChange() {
    tmpActivityCode = '';
  }
}
</script>
<style lang="less" >
.flow-track-log {
  margin-bottom: 80px;
  .ant-table-thead{
    >tr>th{
      color: @light-color-2;
    }
  }
  .ant-table-body {
    > table {
      padding: 0 !important;
      color: @light-color-1;
    }
  }
}
</style>
