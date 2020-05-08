<template>
  <div class="form-operation-logs">
    <div class="header form-header">
      <div class="back">
        <a
          href="javascript:"
          class="link"
          @click="back"
        >{{ $t('cloudpivot.flow.pc.Back') }}</a>
        <span class="line">|</span><label>{{ $t('cloudpivot.flow.pc.OperationLogs') }}</label>
      </div>
    </div>
    <section class="main">
      <a-table
        class="bpm-table"
        :columns="columns"
        :rowKey="rowKey"
        :dataSource="this.data"
        :pagination="false"
        size="small"
      >
        <a
          slot="approval"
          slot-scope="text,record"
          href="javascript:void(0)"
          @click="showDetail(record)"
        >{{ $t('cloudpivot.flow.pc.View') }}</a>

        <!-- 序号 -->
        <span
          slot="codeTitle"
        >{{ $t('cloudpivot.flow.pc.Number') }}</span>

        <!-- 操作类型 -->
        <span
          slot="operationTypeNameTitle"
          class="resize"
        >{{ $t('cloudpivot.flow.pc.OperationType') }}</span>

        <!-- 操作时间 -->
        <span
          slot="timeTitle"
          class="resize"
        >{{ $t('cloudpivot.flow.pc.OperationTime') }}</span>

        <!-- 用户 -->
        <span
          slot="usernameTitle"
          class="resize"
        >{{ $t('cloudpivot.flow.pc.User') }}</span>

        <!-- 操作对象 -->
        <span
          slot="operateNodeTitle"
          class="resize"
        >{{ $t('cloudpivot.flow.pc.Operations') }}</span>

        <!-- 平台 -->
        <span
          slot="clientTitle"
          class="resize"
        >{{ $t('cloudpivot.flow.pc.Platform') }}</span>

        <!-- ip -->
        <span
          slot="ipTitle"
          class="resize"
        >IP</span>

        <!-- 详细 -->
        <span
          slot="approvalTitle"
          class="resize"
        >{{ $t('cloudpivot.flow.pc.Detail') }}</span>
      </a-table>
      <PageLoading v-model="loading"></PageLoading>
    </section>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue
} from 'vue-property-decorator';
import {
  Table
} from 'h3-antd-vue';

import confirm from './confirm';
import { ConfirmOptions } from './confirm/confirm';
import common from '@cloudpivot/common';
import { workflowApi }  from '@cloudpivot/api';

@Component({
  name: 'form-operation-logs',
  components: {
    ATable: Table,
    PageLoading: common.components.pc.PageLoading
  }
})
export default class FormOperationLogs extends Vue {
  loading: Boolean = true;

  data: any[] = [];

  columns: any[] = [
    {
      dataIndex: 'code',
      width: 50,
      slots: { title: 'codeTitle' },
      customRender: (text: any, record: any, index: number) => index + 1
    },
    {
      dataIndex: 'operationTypeName',
      slots: { title: 'operationTypeNameTitle' },
      width: 150
    },
    {
      dataIndex: 'time',
      slots: { title: 'timeTitle' },
      width: 150
    },
    {
      dataIndex: 'username',
      slots: { title: 'usernameTitle' },
      width: 100
    },
    {
      dataIndex: 'operateNode',
      slots: { title: 'operateNodeTitle' },
      width: 150
    },
    {
      dataIndex: 'client',
      slots: { title: 'clientTitle' },
    },
    {
      dataIndex: 'ip',
      slots: { title: 'ipTitle' },
      width: 120,
    },
    {
      dataIndex: 'approval',
      slots: { title: 'approvalTitle' },
      width: 80,
      scopedSlots: { customRender: 'approval' }
    }
  ];

  created() {
    const workflowInstanceId: any = {
      workflowInstanceId: (this.$route.params as any).workflowInstanceId
    };
    workflowApi.getWorkflowOperationLog(workflowInstanceId).then((res: any) => {
      this.data = res.data || [];
      this.loading = false;
    });
  }

  /**
   * 回退事件
   */
  back() {
    this.$router.go(-1);
  }

  /**
   * row key
   * @param record
   * @param index
   */
  rowKey(record: any, index: number) {
    return index;
  }

  /**
   * 打开详情
   * @param data
   */
  showDetail(data: any) {
    const formOptions: ConfirmOptions = {
      title: `${this.$t('cloudpivot.flow.pc.DetailInfo')}`,
      content: `${ data.detail ? data.detail : this.$t('cloudpivot.flow.pc.NoDetail')}`,
      buttons: ['ok'],
      align: 'center',
      buttonsText: [`${this.$t('cloudpivot.flow.pc.Cancel')}`, `${this.$t('cloudpivot.flow.pc.OK')}`]
    };
    if (data.operationType === 26) {
      const id:string = data.id;
      window.open('/from/operation-log-compare/' + id);
      return ;
    }
    confirm(formOptions);
  }
}
</script>

<style lang="less">
  // @import "../../../styles/themes/default.less";
  .form-operation-logs{
    .bpm-table{
      padding: 32px @base4-padding-xs;
    }
    .back{
      flex: 0 0 250px !important;
    }
    .ant-table-thead{
      >tr>th{
        color: @light-color-2;
        font-weight: @font-weight-lg;
      }
    }
    .ant-table-body {
      > table {
        color: @light-color-1;
      }
    }
  }
</style>
