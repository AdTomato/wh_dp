<template>
  <div class="workitem-box my-workflow" ref="workItem">
    <div class="content-top">
      <h2>{{ $t('cloudpivot.flowCenter.pc.taskSearch') }}</h2>
      <div class="tabs">
        <div 
          class="tab-btn"
          v-for="(tab, index) in tabs"
          :key="index"
          :class="tab.key === curKey ? 'active' : ''"
          @click="tabChange(tab.key)"
        >{{ tab.name }}</div>
      </div>
      <div class="content-top-right-box">
        <filterCard 
          @clear="clear('tab')" 
          v-if="queryConditionSource.length === 1" 
          :source="queryConditionSource"
        />
        <filterCard 
          class="mr" 
          @item-click="toggleQuery" 
          @clear="clear('tab')" 
          v-else-if="queryConditionSource.length > 1"  
          :source="queryConditionSource"
        />
        <a-tooltip v-if="queryConditionSource.length <= 1">
          <template slot="title">
            {{ $t('cloudpivot.list.pc.Screen') }}
          </template>
          <i 
            class="icon aufontAll  h-icon-all-filter-o mr" 
            :class="{'high-light': isShowQueryItem}" 
            @click="toggleQuery"
          ></i>
        </a-tooltip>
      </div>
    </div>

    <PageLoading
      v-model="isLoading"
      shadeColor="#F4F6FC"
      :shadeOpacity="1"
    />

    <div class="table-box" v-if="isShowTableBox">
      <div :class="$i18n.locale === 'zh' ? 'my-workflow-tabs' : 'my-workflow-tabs en'">
        <div
          class="table-tab"
          ref="table"
          defaultActiveKey="INPROGRESS"
          :class="isShowPagination ? '' : 'has-pager'"
        >
          <!-- 未打开 -->
          <div v-if="curKey === 'NOTSTARTED'">
            <tab-table
              ref="tabTable"
              :isShowQueryItem="isShowQueryItem"  
              tabType="task"
              :timeLable="$t('cloudpivot.flowCenter.pc.initiationTime')"
              v-if="isShowTableBox && instanceState === 'NOTSTARTED'"
              :resetFields="isResetFields"
              :isShowInstanceState="false"
              :isShowOriginator="true"
              :columns="noStartedColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              @onReset="onReset"
              @onSearch="onSearch"
              @hide="hideQueryItem"
            ></tab-table>
          </div>

          <!-- 进行中 -->
          <div v-if="curKey === 'INPROGRESS'">
            <tab-table
              ref="tabTable"
              :isShowQueryItem="isShowQueryItem"
              tabType="task"
              :timeLable="$t('cloudpivot.flowCenter.pc.initiationTime')"
              v-if="isShowTableBox && instanceState === 'INPROGRESS'"
              :resetFields="isResetFields"
              :isShowInstanceState="false"
              :isShowOriginator="true"
              :columns="processingColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              @onReset="onReset"
              @onSearch="onSearch"
              @hide="hideQueryItem"
            ></tab-table>
          </div>

          <!-- 已完成 -->
          <div v-if="curKey === 'FINISHED'">
            <tab-table
              ref="tabTable"
              :isShowQueryItem="isShowQueryItem"
              tabType="task"
              :timeLable="$t('cloudpivot.flowCenter.pc.initiationTime')"
              v-if="isShowTableBox && instanceState === 'FINISHED'"
              :resetFields="isResetFields"
              :isShowInstanceState="false"
              :isShowOriginator="true"
              :columns="completedColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              @onReset="onReset"
              @onSearch="onSearch"
              @hide="hideQueryItem"
            ></tab-table>
          </div>

          <!-- 被取消 -->
          <div v-if="curKey === 'CANCELLED'">
            <tab-table
              ref="tabTable"
              :isShowQueryItem="isShowQueryItem"
              tabType="task"
              :timeLable="$t('cloudpivot.flowCenter.pc.cancelTime')"
              v-if="isShowTableBox && instanceState === 'CANCELLED'"
              :resetFields="isResetFields"
              :isShowInstanceState="false"
              :isShowOriginator="true"
              :columns="canceledColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              @onReset="onReset"
              @onSearch="onSearch"
              @hide="hideQueryItem"
            ></tab-table>
          </div>
        </div>

        <div class="pagination-box">
          <a-pagination
            :total="total"
            :showTotal="total => $t('cloudpivot.flowCenter.pc.total', { num: total })"
            :current="curPage"
            :pageSize="pageSize"
            :pageSizeOptions="pageSizeOptions"
            showSizeChanger
            showQuickJumper
            @change="onPaginationChange"
            @showSizeChange="onSizeChange"
          />
        </div>
      </div>
    </div>

    <div class="load-fail-box">
      <PageLoadFail v-model="isShowLoadFailBox" @refresh="reload"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import {
  Pagination, Button, Icon, Tooltip
} from 'h3-antd-vue';
import { mixins } from 'vue-class-component';

import { workflowCenterApi, workflowCenter as workflowCenterParams, workflowApi }  from '@cloudpivot/api';

import * as WorkflowCenterTypes from './typings/workflow-center';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import filterCard from '@cloudpivot/list/src/components/pc/components/filter-card/filter-card.vue';

import WorkItemMixin from './mixins/workitem';
import * as Helper from './helper/helper';

import TabTable from './components/tab-table.vue';

import common from '@cloudpivot/common';
@Component({
  name: 'task-search',
  components: {
    filterCard: filterCard,
    AButton: Button,
    AIcon: Icon,
    APagination: Pagination,
    ATooltip: Tooltip,
    TabTable,
    PageLoading: common.components.pc.PageLoading,
    PageLoadFail: common.components.pc.LoadFail
  }
})
export default class TaskSearch extends mixins(WorkItemMixin) {
  /**
   * 自定义表格的列
   */
  @Prop() tableNotStartedColumns!: any;
  @Prop() tableProcessingColumns!: any;
  @Prop() tableCompletedColumns!: any;
  @Prop() tableCanceledColumns!: any;
  searchParams:workflowCenterParams.ListInstancesParams = {
    workflowName: '',
    workflowCode: '',
    startTime: '',
    endTime: '',
    originator: '',
    unitType: '',
  };

  instanceState:string = 'INPROGRESS'; // 流程实例状态

  isResetFields:boolean = false;

  defaultNotStartedColumns:any = [
    {
      dataIndex: 'index',
      width: 80,
      align: 'center',
      slots: { title: 'indexTitle' },
    },
    {
      dataIndex: 'instanceName',
      width: 220,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'workflowName',
      width: 130,
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' }
    },
    {
      dataIndex: 'participants',
      width: 130,
      slots: { title: 'participantNameTitle' },
      scopedSlots: { customRender: 'resolverName' }
    },
    {
      dataIndex: 'time',
      width: 220,
      slots: { title: 'haveStayedTimeTitle' },
      scopedSlots: { customRender: 'stayTime' }
    },
    {
      dataIndex: 'receiveTime',
      width: 180,
      slots: { title: 'receiveTimeTitle' },
    },
    {
      dataIndex: 'originatorName',
      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' },
      width: 180
    },
  ];

  defaultProcessingColumns:any = [
    {
      dataIndex: 'index',
      width: 80,
      align: 'center',
      slots: { title: 'indexTitle' },
    },
    {
      dataIndex: 'instanceName',
      width: 220,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'workflowName',
      width: 130,
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' }
    },
    {
      dataIndex: 'participants',
      width: 130,
      slots: { title: 'participantNameTitle' },
      scopedSlots: { customRender: 'resolverName' }
    },
    {
      dataIndex: 'receiveTime',
      width: 180,
      slots: { title: 'receiveTimeTitle' },
    },
    {
      dataIndex: 'time',
      width: 220,
      slots: { title: 'haveStayedTimeTitle' },
      scopedSlots: { customRender: 'stayTime' }
    },
    {
      dataIndex: 'originatorName',
      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' },
      width: 180
    },
    // {
    //   title: '备注',
    //   dataIndex: 'remarks',
    //   width: 130
    // },
  ];

  defaultCompletedColumns:any = [
    {
      dataIndex: 'index',
      width: 80,
      align: 'center',
      slots: { title: 'indexTitle' }
    },
    {
      dataIndex: 'instanceName',
      width: 220,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'workflowName',
      width: 130,
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' }
    },
    {
      dataIndex: 'participants',
      width: 130,
      slots: { title: 'resolverTitle' },
      scopedSlots: { customRender: 'resolverName' }
    },
    {
      dataIndex: 'approvalTxt',
      width: 130,
      slots: { title: 'approvalTitle' },
    },
    {
      dataIndex: 'finishTime',
      width: 180,
      slots: { title: 'finishedTimeTitle' }
    },
    {
      dataIndex: 'originatorName',
      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' },
      width: 130
    }
  ];

  defaultCanceledColumns:any = [
    {
      dataIndex: 'index',
      width: 80,
      align: 'center',
      slots: { title: 'indexTitle' }
    },
    {
      dataIndex: 'instanceName',
      width: 220,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'workflowName',
      width: 130,
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' }
    },
    {
      dataIndex: 'startTime',
      width: 180,
      slots: { title: 'startTimeTitle' }
    },
    {
      dataIndex: 'finishTime',
      width: 180,
      slots: { title: 'cancellationTime' }
    },
    {
      dataIndex: 'originatorName',
      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' },
      width: 130
    }
  ];

  get noStartedColumns(){
    if(this.tableNotStartedColumns) {
      return this.tableNotStartedColumns;
    }
    return this.defaultNotStartedColumns;
  }
  // 所有tab按钮
  tabs:Array<any> = [];

  curKey:string = '';

  get processingColumns(){
    if(this.tableProcessingColumns) {
      return this.tableProcessingColumns;
    }
    return this.defaultProcessingColumns;
  }

  get completedColumns(){
    if(this.tableCompletedColumns) {
      return this.tableCompletedColumns;
    }
    return this.defaultCompletedColumns;
  }

  get canceledColumns(){
    if(this.tableCanceledColumns) {
      return this.tableCanceledColumns;
    }
    return this.defaultCanceledColumns;
  }

  mounted() {
    this.setTabBtns();
    this.curKey = this.tabs[1].key;
    this.listWorkitems();
    window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event:any) {
    if (event.source === window) return;
    if (event.data.indexOf('/workflow-center/query-participant-workItem') !== -1 || event.data.indexOf('%2Fworkflow-center%2Fquery-participant-workItem') !== -1) {
      this.listWorkitems();
    }
  }

  destroyed() {
    window.removeEventListener('resize', this.setTableMaxHeight);
    window.removeEventListener('message', this.reloadMessage, false);
  }

  /** 
   * 设置tab按钮
  */
  setTabBtns(){
    this.tabs = [
      {
        name: this.$t('cloudpivot.flowCenter.pc.noStarted'),
        key: 'NOTSTARTED'
      },
      {
        name: this.$t('cloudpivot.flowCenter.pc.resolving'),
        key: 'INPROGRESS'
      },
      {
        name: this.$t('cloudpivot.flowCenter.pc.completed'),
        key: 'FINISHED'
      },
      {
        name: this.$t('cloudpivot.flowCenter.pc.beCancled'),
        key: 'CANCELLED'
      }

    ]
  }

  /*
  * tab页栏切换
  */
  tabChange(key:any) {
    this.queryConditionSource = [];
    this.curKey = key;
    this.curPage = 1;
    this.pageSize = 20;
    this.isResetFields = true;
    this.instanceState = key;
    this.resetParams();
    this.listWorkitems();
    setTimeout(() => {
      this.isResetFields = false;
    }, 100);
  }

  /*
  * 分页改变
  */
  onPaginationChange(page:number, size:number) {
    this.curPage = page;
    this.listWorkitems('search');
  }

  /*
  * 分页pageSize改变
  */
  onSizeChange(current:number, size:number) {
    this.curPage = 1;
    this.pageSize = size;
    this.listWorkitems('search');
  }

  /*
  * 重置查询参数
  */
  resetParams() {
    this.searchParams = {
      workflowName: '',
      workflowCode: '',
      startTime: '',
      endTime: '',
      originator: '',
      unitType: '',
    };
  }

  /*
  * 查询条件重置事件
  */
  onReset() {
    this.queryConditionSource = [];
    this.curPage = 1;
    this.resetParams();
    this.listWorkitems();
  }

  /*
  * 查询条件搜索事件
  */
  onSearch(params:workflowCenterParams.ListInstancesParams) {
    let type:string =  '';
    if (this.curKey === 'NOTSTARTED' || this.curKey === 'INPROGRESS' || this.curKey === 'FINISHED') {
      type = 'processing';
    } else {
      type = 'canceled';
    }
    const vals:any = this.dataTranslateToFilterCard(params, type);
    this.queryConditionSource = vals;

    this.curPage = 1;
    this.searchParams = {
      ...params
    };
    this.listWorkitems('search');
  }

  /*
  * 重新加载
  */
  reload() {
    this.listWorkitems();
  }

  i18nHandle(item:any){
      switch (item.approval) {
        case WorkflowCenterTypes.ApprovalState.AGREE:
          item.approvalTxt = this.$t('cloudpivot.flowCenter.pc.approval.agree');
          break;
        case WorkflowCenterTypes.ApprovalState.REJECT:
          item.approvalTxt = this.$t('cloudpivot.flowCenter.pc.approval.reject');
          break;
        case WorkflowCenterTypes.ApprovalState.FORWARD:
          item.approvalTxt = this.$t('cloudpivot.flowCenter.pc.approval.forward');
          break;
        case WorkflowCenterTypes.ApprovalState.CANCELLED:
          item.approvalTxt = this.$t('cloudpivot.flowCenter.pc.approval.canceled');
          break;
        case WorkflowCenterTypes.ApprovalState.UNDO:
          item.approvalTxt = this.$t('cloudpivot.flowCenter.pc.approval.undo');
          break;
      };
      return item;
    }

  /*
  * 获取我的流程列表
  */
  async listWorkitems(type?:string) {
    const params = {
      ...this.searchParams,
      status: this.instanceState,
      page: this.curPage - 1,
      size: this.pageSize
    };

    // 数据处理函数
    this.dataHandler = (data:any) => {
      data.forEach((item:any, index:number) => {
        item.index = index + 1;
        item.key = index;
        if (item.workItemTimeoutStatus === 'NORMAL' || item.workItemTimeoutStatus === 'TIMEOUT') {
          item.time = Helper.timeTranslate(item.stayTime);
        } else if (item.workItemTimeoutStatus === 'ORANGE' || item.workItemTimeoutStatus === 'RED') {
          item.time = Helper.timeTranslate(item.remainingTime);
        }
        item.receiveTime = Helper.removeSeconds(item.receiveTime);
        item.startTime = Helper.removeSeconds(item.startTime);
        item.finishTime = Helper.removeSeconds(item.finishTime);
        // item.approvalTxt = Helper.ApprovalTranslator(item.approval);
        item = this.i18nHandle(item);

        // 设置高亮
        item.instanceName = utils.searchHighLight(this.searchParams.workflowName, item.instanceName);

        // 国际化兼容
        item = utils.compatible(item, 'workflowName');
      });
      return data;
    };

    this.isLoading = true;
    const res:any = await workflowCenterApi.listWorkitems(params);
    this.commonHandler(res, type);
  }
  @Watch('$i18n.locale')
  onLanguageChange(){
    this.tableData.forEach((item:any) => {
      item = this.i18nHandle(item);
    });
    this.setLoadAllTxt();
    this.setTableMaxHeight();
    this.setTabBtns();
  }
}
</script>

<style lang='less' scoped>
@import './style/index.less';
.my-workflow{
  .table-box{
    padding: 0;
    .table-tab {
        height: 100%;
        max-height: calc( 100% - 58px );
        &::after{
          content: '*';
          font-size: 0;
          display: block;
          clear: both;
        }
        &.has-pager {
          max-height: calc( 100% - 16px );
        }
      }
    /deep/.my-workflow-tabs{
      height: 100%;
      .ant-tabs-nav-container{
        height: 48px;
        .ant-tabs-tab:first-child{
          margin-left: @base4-padding-md;
        }
        .ant-tabs-tab{
          margin-right: 0;
          border: 1px solid @dark-color-1;
          border-bottom: 0;
          background: @dark-color-1;
          transition: none;
          width: 88px;
          line-height: 46px;
          text-align: center;
        }
        .ant-tabs-tab-active{
          font-weight: @font-weight-md;
          color: @primary-color;
          border: 1px solid #e8e8e8;
          &::after{
            content: "";
            position: absolute;
            height: 0;
            width: 100%;
            top: 0;
            left: 0;
            border-top: 2px solid @primary-color;
          }
        }
      }
      .table{
        margin-top: 0;
      }
      &.en {
        .ant-tabs-tab{
          width: 110px;
        }
      }
    }
  }
  .load-fail-box {
    padding-top: 100px;
    text-align: center;
  }
}
</style>
