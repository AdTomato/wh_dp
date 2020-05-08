<template>
  <div class="exception">
    <!-- 改变布局 -->
    <div class="clearfix exception__header">
      <smart-search @reset="reset" @search="query">
        <ul class="exception__filter--left" slot="search">
          <li class="exception-item">
            <span class="exception-item__label">流程模版：</span>
            <div class="exception-item__input">
              <workflow-selector v-model="params.workflowCode" placeholder="请选择"/>
            </div>
          </li>
          <li class="exception-item">
            <span class="exception-item__label">流程实例：</span>
            <div class="exception-item__input">
              <a-input v-model="params.workflowInstanceName" placeholder="请输入"/>
            </div>
          </li>
          <li class="exception-item">
            <span class="exception-item__label">创建人：</span>
            <div class="exception-item__input staff-selector-adjust">
              <staff-selector
                :options="staffSelectorOpts"
                v-model="originators"
              />
            </div>
          </li>
          <li class="exception-item">
            <span class="exception-item__label">创建时间：</span>
            <div class="exception-item__input">
              <a-range-picker v-model="queryTime" :placeholder="['开始时间','结束时间']"/>
            </div>
          </li>
        </ul>
      </smart-search>
    </div>
    <div class="exception__content">
      <a-table
        :columns="columns"
        size="small"
        :pagination="false"
        :loading="false"
        :locale="{emptyText: $t('languages.NoRelevantData')}"
        :scroll="{ y: 500 }"
        :dataSource="dataSource"
        rowKey="id"
      >
        <span slot="indexTitle">{{ $t('languages.NO') }}</span>
        <span slot="workflowTitle" class="resize">流程模版</span>
        <span slot="instanceTitle" class="resize">流程实例</span>
        <span slot="createrTitle" class="resize">创建人</span>
        <span slot="createdTimeTitle" class="resize">创建时间</span>
        <span slot="statusTitle" class="resize">修复状态</span>
        <span slot="fixedTimeTitle" class="resize">修复时间</span>
        <span slot="actionTitle" class="resize">操作</span>

        <span
          slot="workflowName"
          slot-scope="text"
          class="text-ellipsis"
        >{{ text }}</span>
        <span
          slot="workflowInstanceName"
          slot-scope="text"
          class="text-ellipsis"
        >
          <a-tooltip placement="top">
            <template slot="title">
              <span>{{ text }}</span>
            </template>
            <span>{{ text }}</span>
          </a-tooltip>
        </span>

        <span
          slot="createdTime"
          slot-scope="text"
          class="text-ellipsis"
        >{{ text }}</span>
        <span slot="status" slot-scope="text, record">{{ text === 1 ? '已修复' : '未修复' }}</span>
        <span
          slot="fixedTime"
          slot-scope="text"
          class="text-ellipsis"
        >{{ text }}</span>
        <p
          slot="action"
          slot-scope="text, record"
          class="exception__actions"
        >
          <a v-if="record.status === 0" @click="fix(record)">修复</a>
          <a @click="openDetail(record)">打开</a>
          <a @click="openForm(record)">表单详情</a>
        </p>
      </a-table>
    </div>
    <div class="exception__footer" v-show="totalPage">
      <div>
        <a-pagination
          :defaultPageSize="params.size"
          :total="totalPage"
          :showTotal="total => `共${totalPage}条`"
          :current="params.page + 1"
          :pageSizeOptions="pageSizeOptions"
          showSizeChanger
          showQuickJumper
          @change="pageChange"
          @showSizeChange="pageSizeChange"
        />
      </div>
    </div>
    <!-- 异常日志信息 -->
    <a-drawer
      wrapClassName="exception-info-drawer"
      width="850"
      title="详情"
      placement="right"
      :visible="showExceptionInfo"
      :closable="true"
      :destroyOnClose="true"
      @close="closeExceptionInfo"
    >
      <exception-info
        :info="exceptionInfo"
        @fix="fix(exceptionInfo)"
        @close="closeExceptionInfo"
        @openForm="openForm(exceptionInfo)"
      />
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import moment from 'moment';
import 'moment/locale/zh-cn';
import env from '@/env';
import systemApi from '@/apis/system/system-manager.api';
import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';
import workflowSelector from '@/components/global/workflow-selector/index.vue';
import SmartSearch from '@/components/global/smart-search.vue';
import ExceptionInfo from './exception-info.vue';

@Component({
  name: 'exception',
  components: {
    ExceptionInfo,
    StaffSelector,
    workflowSelector,
    SmartSearch
  }
})
export default class Exception extends Vue {
  isShow: boolean = false;

  // 选人控件设置
  staffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    showModel: true,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择',
  };

  // 是否展示详情抽屉
  showExceptionInfo: boolean = false;

  // 当前展开的异常日志的详情
  exceptionInfo: BPM.System.ExceptionInfo | null = null;

  // 表头设置
  columns: Array<Common.TableHead> = [
    // 序号
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 60,
      key: 'index',
      align: 'center',
    },
    // 流程模版
    {
      dataIndex: 'workflowName',
      slots: { title: 'workflowTitle' },
      scopedSlots: { customRender: 'workflowName' },
      width: '12%',
      align: 'left',
      key: 'workflowName'
    },
    // 流程实例
    {
      dataIndex: 'workflowInstanceName',
      slots: { title: 'instanceTitle' },
      scopedSlots: { customRender: 'workflowInstanceName' },
      width: '12%',
      align: 'left',
      key: 'workflowInstanceName'
    },
    // 创建人
    {
      dataIndex: 'createrName',
      slots: { title: 'createrTitle' },
      width: '12%',
      align: 'left',
      key: 'createrName'
    },
    // 创建时间
    {
      dataIndex: 'createdTime',
      slots: { title: 'createdTimeTitle' },
      scopedSlots: { customRender: 'createdTime' },
      width: '12%',
      align: 'left',
      key: 'createdTime',
    },
    // 修复状态
    {
      dataIndex: 'status',
      slots: { title: 'statusTitle' },
      scopedSlots: { customRender: 'status' },
      key: 'status',
      align: 'left',
      width: '12%'
    },
    // 修复时间
    {
      dataIndex: 'fixedTime',
      slots: { title: 'fixedTimeTitle' },
      scopedSlots: { customRender: 'fixedTime' },
      align: 'left',
      key: 'fixedTime'
    },
    // 操作
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      key: 'action',
      align: 'left',
      width: 190
    },
  ];

  // 请求日志列表参数
  params: BPM.System.GetErrorLogParams = {
    startTime: '',
    endTime: '',
    workflowCode: '',
    workflowInstanceName: '',
    originator: '',
    page: 0,
    size: 20,
  }

  // 表格数据
  dataSource: any[] = [];

  // 选人控件选择结果
  originators: any[] = [];

  // 起始时间范围
  queryTime: string[] = [];

  // 总页数
  totalPage: number = 0;

  // 分页选项
  pageSizeOptions: Array<string> = [
    '10',
    '20',
    '50',
    '100'
  ];

  // selectFlow(val: string) {
  //   this.params.workflowCode = val;
  // }

  /**
   * 关闭异常日志详情信息
   */
  closeExceptionInfo() {
    this.showExceptionInfo = false;
  }

  /**
   * 重置
   */
  reset() {
    this.params = {
      startTime: '',
      endTime: '',
      workflowCode: '',
      workflowInstanceName: '',
      originator: '',
      page: 0,
      size: 20
    };
    this.originators = [];
    this.queryTime = [];
    this.getErrorLogList();
  }

  /**
   * 选人控件选择了用户
   */
  addUsers(val: any) {
    if (Array.isArray(val) && val.length) {
      this.params.originator = val.map((item: any) => item.id).join(',');
    }
  }
  query() {
    this.params.page = 0;
    this.getErrorLogList();
  }
  /**
   * 获取异常日志列表
   */
  getErrorLogList() {
    this.params.originator = this.originators.map((item: any) => item.id).join(',');
    if (!this.params.workflowCode) {
      this.params.workflowCode = '';
    }
    const params: BPM.System.GetErrorLogParams = {
      ...this.params,
      workflowCode: this.params.workflowCode.replace('workflow_', ''),
      startTime: '',
      endTime: '',
    };
    const { queryTime } = this;
    if (queryTime.length) {
      params.startTime = moment(queryTime[0]).format('YYYY-MM-DD');
      params.endTime = moment(queryTime[1]).format('YYYY-MM-DD');
    }

    systemApi.getErrorLog(params).then((res: any) => {
      if (res.data && !res.errcode) {
        this.dataSource = res.data.content;
        this.totalPage = res.data.totalElements;
        this.dataSource.forEach((item: any, index: number) => {
          item.index = index + 1 + params.page * params.size;
          Object.entries(item).forEach((data:any) => {
            const [key, value] = data;
            if (typeof value !== 'boolean' && !value) {
              item[key] = '- -';
            }
          });
        });
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  /**
   * 翻页操作
   */
  pageChange(page: number, pageSize: number) {
    this.params.page = page - 1;
    this.params.size = pageSize;
    this.getErrorLogList();
  }

  /**
   * 修改分页大小
   */
  pageSizeChange(current: number, pageSize: number) {
    this.params.page = 0;
    this.params.size = pageSize;
    this.getErrorLogList();
  }

  /**
   * 修复日志
   */
  fix(record: any) {
    console.log('fix', record);
    if (record.status) {
      return;
    }
    const params: BPM.System.ExceptionItemParams = { exceptionLogId: record.id };
    systemApi.fixException(params).then((res: any) => {
      if (!res.errcode) {
        this.$message.success('修复成功');
        this.showExceptionInfo = false;
        this.getErrorLogList();
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  /**
   * 打开日志详情
   */
  openDetail(record: BPM.System.ExceptionInfo) {
    console.log('open-details', record);
    const params: BPM.System.ExceptionItemParams = { exceptionLogId: record.id };
    systemApi.getExceptionInfo(params).then((res: Common.Res<BPM.System.ExceptionInfo>) => {
      if (res.data) {
        this.exceptionInfo = res.data;
        this.showExceptionInfo = true;
      }
    });
  }

  /**
   * 打开表单详情
   */
  openForm(record: BPM.System.ExceptionInfo) {
    console.log('open-form', record);
    if (record.workItemId) {
      const path: string = `${env.portalHost}/form/detail?workitemId=${record.workItemId}&workflowInstanceId=${record.workflowInstanceId}&return=${location.pathname + location.search}`;
      window.open(path);
      return;
    }
    const params: BPM.System.ExceptionFormParams = {
      workflowInstanceId: record.workflowInstanceId
    };
    systemApi.getWorkItemByInstanceId(params).then((res: Common.Data) => {
      if (res.data && !res.errcode) {
        this.$set(record, 'workItemId', res.data.workItemId);
        record.workItemId = res.data.workItemId;
        const path: string = `${env.portalHost}/form/detail?workitemId=${record.workItemId}&workflowInstanceId=${record.workflowInstanceId}&return=${location.pathname + location.search}`;
        window.open(path);
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  setMomentLocale(lang: string) {
    if (lang === 'en') {
      moment.locale('en-US');
    } else {
      moment.locale('zh-cn');
    }
  }

  /**
   * 选人控件placeholder多语言
   */
  placeHolderLang() {
    this.staffSelectorOpts.placeholder = this.$t('Languages.Apps.PlzSelect') as string;
  }

  // 日期控件国际化
  @Watch('$i18n.locale')
  onLanguageChange(val: any) {
    this.setMomentLocale(val);
    this.placeHolderLang();
  }

  created() {
    this.getErrorLogList();
    this.setMomentLocale(this.$i18n.locale);
  }
}
</script>
<style lang="less" scoped>
.exception {
  &__header {
    margin: 0 -23px;
  }
  .active {
    height: 100px;
  }
  &__filter {
    &--left {
      display: flex;
      flex-wrap: wrap;
      width: 100%;
      float: left;
    }
    &--right {
      width: 16%;
      text-align: right;
      float: right;
    }
  }
  &-item {
    margin-bottom: 16px;
    margin-right: 16px;
    // float: left;
    &__label {
      display: inline-block;
      line-height: 32px;
    }
    &__input {
      display: inline-block;
      vertical-align: top;
      width: 220px;
      margin-left: -2px;
      &.staff-selector-adjust {
        width: auto!important;
        min-width: 220px;
      }
    }
  }
  &__content {
    margin-top: 16px;
    // /deep/.ant-table-thead span {
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    /deep/.ant-table-body {
      color: rgba(0,0,0,0.85);
      max-height: calc(100vh - 260px) !important;
      height: calc(100vh - 260px) !important;
      /deep/.ant-table-row:last-child td {
        border-bottom: none !important;
      }
    }
  }
  &__footer {
    margin-left: -23px;
    margin-right: -23px;
    border-top: 1px solid rgba(232, 232, 232, 1);
    > div {
      float: right;
      padding: 8px 0;
      margin-right: 24px;
    }
    /deep/.ant-pagination-options-quick-jumper input {
      vertical-align: top;
    }
    /deep/.ant-pagination-options{
      height: 32px;
    }
  }
  &__buttons {
    text-align: right;
    button:not(:first-child) {
      margin-left: 8px;
    }
  }
  &__actions {
    width: 100%;
    white-space: nowrap;
    /*text-align: right;*/
    text-align: left;
    a {
      display: inline-block;
      vertical-align: middle;
      padding: 0 8px;
      margin-right: 1px;
      height: 14px;
      line-height: 14px;
      color: @primary-color;
      border-right: 1px solid #e8e8e8;
      user-select: none;
      &:last-child {
        border: none;
        margin-right: 0;
      }
      &:first-child {
        padding-left: 0;
      }
    }
  }
  /deep/.ant-pagination-total-text{
    margin-right: @base4-padding-md;
  }
}
</style>
