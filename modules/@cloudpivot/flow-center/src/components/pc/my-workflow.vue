<template>
  <div class="workitem-box my-workflow" ref="workItem">
    <div class="content-top">
      <h2>{{ $t('cloudpivot.flowCenter.pc.myFlow') }}</h2>
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
        >
          <!-- 进行中 -->
          <div v-if="curKey==='PROCESSING,EXCEPTION,DRAFT'">
            <tab-table
              ref="tabTable"
              tabType="instance"
              :timeLable="$t('cloudpivot.flowCenter.pc.initiationTime')"
              v-if="isShowTableBox && instanceState === 'PROCESSING,EXCEPTION,DRAFT'"
              :resetFields="isResetFields"
              :columns="processingColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              :isShowQueryItem="isShowQueryItem"
              @onReset="onReset"
              @onSearch="onSearch"
              @hide="hideQueryItem"
            ></tab-table>
          </div>
          <!-- 已完成 -->
          <div v-if="curKey==='COMPLETED'">
            <tab-table
              ref="tabTable"
              tabType="instance"
              :timeLable="$t('cloudpivot.flowCenter.pc.initiationTime')"
              v-if="isShowTableBox && instanceState === 'COMPLETED'"
              :resetFields="isResetFields"
              :columns="completedColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              :isShowQueryItem="isShowQueryItem"
              @onReset="onReset"
              @onSearch="onSearch"
              @hide="hideQueryItem"
            ></tab-table>
          </div>
          <!-- 已作废 -->
          <div v-if="curKey==='CANCELED'">
            <tab-table
              ref="tabTable"
              tabType="instance"
              :timeLable="$t('cloudpivot.flowCenter.pc.cancelTime')"
              v-if="isShowTableBox && instanceState === 'CANCELED'"
              :resetFields="isResetFields"
              :columns="canceledColumns"
              :dataSource="tableData"
              :scrollY="scrollY"
              :isShowLoadAll="isShowLoadAll"
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              :isShowQueryItem="isShowQueryItem"
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

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import WorkItemMixin from './mixins/workitem';
import * as Helper from './helper/helper';
import TabTable from './components/tab-table.vue';

import filterCard from '@cloudpivot/list/src/components/pc/components/filter-card/filter-card.vue';


import common from '@cloudpivot/common';

@Component({
  name: 'my-workflow',
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
export default class MyWorkflow extends mixins(WorkItemMixin) {

  /**
   * 自定义表格的列
   */
  @Prop() tableProcessingColumns!: any;
  @Prop() tableCompletedColumns!: any;
  @Prop() tableCanceledColumns!: any;

  searchParams:workflowCenterParams.FinishedWorkItemParams = {
    workflowName: '',
    workflowCode: '',
    startTime: '',
    endTime: ''
  };

  instanceState:string = 'PROCESSING,EXCEPTION,DRAFT'; // 流程实例状态

  isResetFields:boolean = false;

  defaultProcessingColumns:any = [
    {
      slots: { title: 'indexTitle' },
      dataIndex: 'index',
      width: 80,
      align: 'center'
    },
    {
      dataIndex: 'instanceName',
      width: 296,
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
      scopedSlots: { customRender: 'participantName' }
    },
    {
      width: 180,
      dataIndex: 'stayTime',
      slots: { title: 'stayTimeTitle' },
    },
    {
      width: 130,
      dataIndex: 'state',
      slots: { title: 'stateTitle' },
      scopedSlots: { customRender: 'state' },
    },
  ];

  defaultCompletedColumns:any = [
    {
      slots: { title: 'indexTitle' },
      dataIndex: 'index',
      width: 80,
      align: 'center'
    },
    {
      dataIndex: 'instanceName',
      width: 296,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'workflowName',
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' },
      width: 130
    },
    {
      dataIndex: 'startTime',
      slots: { title: 'startTimeTitle' },
      width: 180
    },
    {
      dataIndex: 'finishTime',
      slots: { title: 'finishedTimeTitle' },
      width: 180
    },
    {
      dataIndex: 'costTime',
      slots: { title: 'costTimeTitle' },
      width: 180
    }
  ];

  defaultCanceledColumns:any = [
    {
      slots: { title: 'indexTitle' },
      dataIndex: 'index',
      width: 80,
      align: 'center'
    },
    {
      dataIndex: 'instanceName',
      width: 296,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'workflowName',
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' },
      width: 130
    },
    {
      dataIndex: 'startTime',
      slots: { title: 'startTimeTitle' },
      width: 180
    },
    {
      dataIndex: 'finishTime',
      slots: { title: 'cancellationTime' },
      width: 180
    }
  ];

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
    this.curKey = this.tabs[0].key;
    this.getMyInstanceList();
    window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event:any) {
    if (event.source === window) return;
    if (event.data.indexOf('/workflow-center/my-workflow') !== -1 || event.data.indexOf('%2Fworkflow-center%2Fmy-workflow') !== -1) {
      this.getMyInstanceList();
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
        name: this.$t('cloudpivot.flowCenter.pc.processing'),
        key: 'PROCESSING,EXCEPTION,DRAFT'
      },
      {
        name: this.$t('cloudpivot.flowCenter.pc.completed'),
        key: 'COMPLETED'
      },
      {
        name: this.$t('cloudpivot.flowCenter.pc.canceled'),
        key: 'CANCELED'
      }

    ]
  }

  /*
  * 重新加载
  */
  reload() {
    this.curPage = 1;
    this.pageSize = 20;
    this.resetParams();

    this.getMyInstanceList();
  }

  /*
  * tab页栏切换
  */
  tabChange(key:any) {
    this.queryConditionSource = [];
    this.curKey = key;
    this.isResetFields = true;
    this.instanceState = key;
    this.curPage = 1;
    this.pageSize = 20;
    this.resetParams();
    this.getMyInstanceList();

    setTimeout(() => {
      this.isResetFields = false;
    }, 100);
  }

  /*
  * 分页改变
  */
  onPaginationChange(page:number, size:number) {
    this.curPage = page;
    this.getMyInstanceList('pageChange');
  }

  /*
  * 分页pageSize改变
  */
  onSizeChange(current:number, size:number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getMyInstanceList('pageChange');
  }

  /*
  * 重置查询参数
  */
  resetParams() {
    this.searchParams = {
      workflowName: '',
      workflowCode: '',
      startTime: '',
      endTime: ''
    };
  }

  /*
  * 查询条件重置事件
  */
  onReset() {
    this.queryConditionSource = [];
    this.curPage = 1;
    this.resetParams();
    this.getMyInstanceList();
  }

  /*
  * 查询条件搜索事件
  */
  onSearch(params:workflowCenterParams.FinishedWorkItemParams) {
    let type:string =  '';
    if (this.curKey === 'PROCESSING,EXCEPTION,DRAFT' || this.curKey === 'COMPLETED') {
      type = 'processing';
    }  else {
      type = 'canceled';
    }

    const vals:any = this.dataTranslateToFilterCard(params, type);
    this.queryConditionSource = vals;

    this.curPage = 1;
    this.searchParams = {
      ...params
    };
    this.getMyInstanceList('search');
  }

  /*
  * 获取我的流程列表
  */
  async getMyInstanceList(type?:string) {
    const params = {
      ...this.searchParams,
      instanceState: this.instanceState,
      page: this.curPage - 1,
      size: this.pageSize
    };

    // 数据处理函数
    this.dataHandler = (data:any) => {
      data.forEach((item:any, index:number) => {
        item.index = index + 1;
        item.key = index;
        item.stayTime = Helper.timeTranslate(item.stayTime);
        item.costTime = Helper.timeTranslate(item.costTime);
        // 去掉秒钟
        if (item.startTime) {
          item.startTime = Helper.removeSeconds(item.startTime);
        }
        if (item.finishTime) {
          item.finishTime = Helper.removeSeconds(item.finishTime);
        }

        // 国际化兼容
        item = utils.compatible(item, 'workflowName');

        // 设置高亮
        item.instanceName = utils.searchHighLight(this.searchParams.workflowName, item.instanceName);

      });
      return data;
    };

    this.isLoading = true;
    const res:any = await workflowCenterApi.getMyInstanceList(params);
    this.commonHandler(res, type);
  }

  @Watch('$i18n.locale')
  onLanguageChange(){
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
          &:hover{
            color: #5291FF;
          }
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
}
</style>
