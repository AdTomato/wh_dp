<template>
  <div class="history-version">
    <a-table :dataSource="historyList" :pagination="false">
      <!-- 序列 -->
      <a-table-column
        key="order"
        dataIndex="order"
      >
        <span
          slot="title"
          class="resize resize-first"
          v-resize.east="{translateX: 16}"
        >序列</span>
      </a-table-column>

      <!-- 流程编码 -->
      <a-table-column
        key="workflowCode"
        dataIndex="workflowCode"
      >
        <span
          slot="title"
          class="resize"
          v-resize.east="{translateX: 16}"
        >流程编码</span>
      </a-table-column>

      <!-- 版本号 -->
      <a-table-column
        key="workflowVersion"
        dataIndex="workflowVersion"
      >
        <span
          slot="title"
          class="resize"
          v-resize.east="{translateX: 16}"
        >版本号</span>
      </a-table-column>

      <!-- 发布人 -->
      <a-table-column
        key="creater"
        dataIndex="creater"
      >
        <span
          slot="title"
          class="resize"
          v-resize.east="{translateX: 16}"
        >发布人</span>
      </a-table-column>

      <!-- 发布时间 -->
      <a-table-column
        key="createdTime"
        dataIndex="createdTime"
      >
        <span
          slot="title"
          class="resize"
          v-resize.east="{translateX: 16}"
        >发布时间</span>
      </a-table-column>

      <!-- 描述 -->
      <a-table-column
        key="remarks"
        dataIndex="remarks"
      >
        <span
          slot="title"
          class="resize"
          v-resize.east="{translateX: 16}"
        >描述</span>
      </a-table-column>

      <!-- 操作 -->
      <a-table-column
        key="operationIndex"
        dataIndex="operationIndex"
      >
        <span
          slot="title"
          class="resize"
          v-resize.east="{translateX: 16}"
        >操作</span>
        <a
          href="javascript:;"
          class="view"
          slot-scope="operationIndex, record"
          @click.stop="openWorkflowPage(record)"
        >查看</a>
      </a-table-column>
    </a-table>
  </div>
</template>
<script lang="ts">
import {
 Component, Vue, Prop, Watch 
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'HistoryVersion'
})
export default class HistoryVersion extends Vue {
  @WorkflowModule.State('historyList') historyList: any; // 表格数据数组

  @WorkflowModule.Action('getHistoryList') getHistoryList: any;

  // 流程code
  workflowCode:string = '';

  // 数据模型code
  bizSchemaCode:string ='';

  // 应用code
  appCode:string ='';

  beforeMount() {
    if (this.$route.params && this.$route.params.workflowCode && this.$route.params.appCode) {
      this.workflowCode = this.$route.params.workflowCode;
      this.bizSchemaCode = this.$route.params.bizSchemaCode;
      this.appCode = this.$route.params.appCode;
      this.getHistoryList({ workflowCode: this.workflowCode });
    }
  }

  openWorkflowPage(item:any) {
    if (!this.workflowCode) {
      return;
    }
    const { href } = this.$router.resolve({
      name: 'workflowDesign',
      params: {
        appCode: this.appCode,
        bizSchemaCode: this.bizSchemaCode,
        workflowCode: this.workflowCode
      },
      query: {
        version: item.workflowVersion
      }
    });
    window.open(href);
  }
}
</script>
<style lang="less" scoped>
.history-version{
  margin-top: 24px;
  padding: 0 24px;
  /deep/.ant-table-tbody > tr > td {
    padding: 8px 16px
  }
  /deep/.ant-table-thead > tr > th {
    padding:  8px 16px;
    font-weight: bold;
  }
  /deep/.ant-table-empty{
    .ant-table-body{
      overflow: inherit !important;
    }
    .ant-table-placeholder{
      /*display: none;*/
    }
  }
  .view{
    color: @primary-color;
  }
  .resize {
    display: inline-block;
    height: 22px;
    width: calc(100% + 32px);
    padding: 0 16px;
    -webkit-transform: translateX(-16px);
    transform: translateX(-16px);
    border-left: 1px solid #e8e8e8;
    font-weight: 600;
  }
  .resize-first {
    border-left: none;
  }
}
</style>
