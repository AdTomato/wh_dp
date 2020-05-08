<template>
  <div
    id="MyFinishedWorkitem"
    class="workitem-box"
    ref="workItem"
  >
    <div class="content-top">
      <h2>{{ $t('cloudpivot.flowCenter.pc.doneList') }}</h2>
      <div class="content-top-right-box">
        <filterCard 
          @clear="clear" 
          v-if="queryConditionSource.length === 1" 
          :source="queryConditionSource" 
        />
        <filterCard 
          class="mr" 
          @item-click="toggleQuery" 
          @clear="clear" 
          v-else-if="queryConditionSource.length > 1"  
          :source="queryConditionSource" 
        />
        <a-tooltip v-if="queryConditionSource.length <= 1">
          <template slot="title">
            {{ $t('cloudpivot.list.pc.Screen') }}
          </template>
          <i 
            class="icon aufontAll  h-icon-all-filter-o mr icon-shake" 
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
      <div class="filters-box">
        <query-workitem
          class="query-box"
          ref="queryWorkitem"
          v-show="isShowQueryItem"
          :isShowInstanceState="true"
          :isShowOriginator="true"
          :timeLable="$t('cloudpivot.flowCenter.pc.resolveTime')"
          @reset="onReset"
          @search="onSearch"
          @hide="hideQueryItem"
        />
      </div>
      <div class="table" ref="table">
        <a-table
          :dataSource="tableData"
          :pagination="false"
          :scroll="{y: scrollYHeight, x: 1060}"
          :columns="columns"
        >
          <!-- 自定义标题 -->
          <span
            slot="indexTitle"
            class="resize resize-first"
          >{{ $t('cloudpivot.flowCenter.pc.orderNuber') }}</span>

          <!-- 流程名称 -->
          <span
            slot="instanceTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.flowName') }}</span>
          <template slot="instanceName" slot-scope="text,record">
            <span
              class="fake-btn text-ellipsis"
              v-html="text"
              :title="record.instanceName"
              @click="openDetail(record)"
            ></span>
          </template>

          <!-- 审批节点 -->
          <span
            slot="activityNameTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.approvalNode') }}</span>
          <template slot="activityName" slot-scope="text,record">
            <span v-if="isChinese" :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'">{{ text }}</span>
            <span v-else :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'">{{ record.name_i18n[$i18n.locale] }}</span>
          </template>

          <!-- 处理结果 -->
          <span
            slot="approvalTxtTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.resolveRzt') }}</span>
          <template slot="approvalTxt" slot-scope="text,record">
            <span class="text-ellipsis">{{ text }}</span>
          </template>


          <!-- 处理时间 -->
          <span
            slot="finishTimeTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.resolveTime') }}</span>
          <template slot="finishTime" slot-scope="text,record">
            <span class="text-ellipsis">{{ text }}</span>
          </template>

          <!-- 发起人 -->
          <span
            slot="originatorNameTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.originatorName') }}</span>
          <template slot="originatorName" slot-scope="text,record">
            <span
              class="text-ellipsis fake-btn"
              @click.stop="showDrawer(record.originator)"
              v-html="text"
            ></span>
          </template>

          <!-- 流程状态 -->
          <span
            slot="workflowInstanceStateTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.flowStatus') }}</span>
          <template slot="workflowInstanceStateTxt" slot-scope="text,record">
            <span class="text-ellipsis">{{ text }}</span>
          </template>
        </a-table>

        <div class="no-data">
          <PageNoData
            :isShowNoData="isShowNoData"
            :isShowSearchNoData="isShowSearchNoData"
            :tipText="$t('cloudpivot.flowCenter.pc.noContent')"
          />
        </div>
      </div>

      <div class="pagination-box">
        <a-pagination
          :total="total"
          :showTotal="total => $t('cloudpivot.flowCenter.pc.total', { num: total })"
          :pageSize="pageSize"
          :current="curPage"
          :pageSizeOptions="pageSizeOptions"
          showSizeChanger
          showQuickJumper
          @change="onPaginationChange"
          @showSizeChange="onSizeChange"
        />
      </div>

      <common-drawer
        v-model="isShowDrawer"
        :data="userInfo"
      />
    </div>

    <div class="load-fail-box">
      <PageLoadFail v-model="isShowLoadFailBox" @refresh="reload"/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

import {
  Button, Modal, Table, Pagination, Icon, Tooltip
} from 'h3-antd-vue';

import { mixins } from 'vue-class-component';

import QueryWorkitem from './components/query-condition/query-workitem.vue';

import { workflowCenterApi, workflowCenter as workflowCenterParams, workflowApi }  from '@cloudpivot/api';

import * as WorkflowCenterTypes from './typings/workflow-center';

import WorkItemMixin from './mixins/workitem';

import * as Helper from './helper/helper';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import common from '@cloudpivot/common';

import CommonDrawer from './components/modals/drawer.vue';

import filterCard from '@cloudpivot/list/src/components/pc/components/filter-card/filter-card.vue';


@Component({
  name: 'MyFinishedWorkitem',
  components: {
    filterCard: filterCard,
    AButton: Button,
    AModal: Modal,
    ATable: Table,
    ATableColumn: Table.Column,
    APagination: Pagination,
    AIcon: Icon,
    ATooltip: Tooltip,
    QueryWorkitem,
    CommonDrawer,
    PageLoading: common.components.pc.PageLoading,
    PageNoData: common.components.pc.PageNoData,
    PageLoadFail: common.components.pc.LoadFail
  }
})
export default class MyFinishedWorkitem extends mixins(WorkItemMixin) {
  /**
   * 单应用集成属性,集成时不显示title
   */
  @Prop({
    default: true
  }) showTitle!: boolean;

  /**
   * 单应用集成属性,集成时表格高度
   */
  @Prop() scrollHeight!: number;

  /**
   * 单应用集成属性,单应用appCode
   */
  @Prop() appCode!: string;

  /**
   * 自定义表格的列
   */
  @Prop() tableColumns!: any;

  searchParams:workflowCenterParams.FinishedWorkItemParams = {
    workflowName: '',
    workflowCode: '',
    originator: '',
    unitType: '',
    instanceState: '',
    startTime: '',
    endTime: '',
    appCode: this.appCode
  }

  defaultTableColumns:any = [
    {
      dataIndex: 'orderNumber',
      width: 80,
      align: 'center',
      slots: { title: 'indexTitle' }
    },
    {
      dataIndex: 'instanceName',
      width: 220,

      slots: { title: 'instanceTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'activityName',
      width: 130,

      slots: { title: 'activityNameTitle' },
      scopedSlots: { customRender: 'activityName' }
    },
    {
      dataIndex: 'approvalTxt',
      width: 130,

      slots: { title: 'approvalTxtTitle' },
      scopedSlots: { customRender: 'approvalTxt' }
    },
    {
      dataIndex: 'finishTime',
      width: 180,

      slots: { title: 'finishTimeTitle' },
      scopedSlots: { customRender: 'finishTime' }
    },
    {
      dataIndex: 'originatorName',
      width: 130,

      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' }
    },
    {
      dataIndex: 'workflowInstanceStateTxt',
      width: 130,
      slots: { title: 'workflowInstanceStateTitle' },
      scopedSlots: { customRender: 'workflowInstanceStateTxt' }
    },
  ]

  get scrollYHeight() {
    if (this.scrollHeight) {
      return this.scrollHeight;
    }
    return this.scrollY;
  }

  get columns() {
    if(this.tableColumns) {
      return this.tableColumns;
    }
    return this.defaultTableColumns;
  }

  mounted() {
    this.getMyFinishWorkitem();
    window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event:any) {
    if (event.source === window) return;
    if (event.data.indexOf('/workflow-center/my-finished-workitem') !== -1 || event.data.indexOf('%2Fworkflow-center%2Fmy-finished-workitem') !== -1) {
      this.getMyFinishWorkitem();
    }
  }

  destroyed() {
    window.removeEventListener('resize', this.setTableMaxHeight);
    window.removeEventListener('message', this.reloadMessage, false);
  }

  resetParams() {
    this.searchParams = {
      workflowName: '',
      workflowCode: '',
      originator: '',
      unitType: '',
      instanceState: '',
      startTime: '',
      endTime: '',
      appCode: this.appCode
    };
  }

  onReset() {
    this.queryConditionSource = [];
    this.curPage = 1;
    this.resetParams();
    this.getMyFinishWorkitem();
  }

  onSearch(params:workflowCenterParams.FinishedWorkItemParams) {
    const vals:any = this.dataTranslateToFilterCard(params);
    this.queryConditionSource = vals;

    this.curPage = 1;
    this.searchParams = {
      ...params
    };
    this.getMyFinishWorkitem('search');
  }

  // 分页改变
  onPaginationChange(page:number, size:number) {
    this.curPage = page;
    this.getMyFinishWorkitem('pageChange');
  }

  // 分页pageSize改变
  onSizeChange(current:number, size:number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getMyFinishWorkitem('pageChange');
  }

  // 加载失败重新加载
  reload() {
    this.curPage = 1;
    this.pageSize = 20;
    this.resetParams();

    this.getMyFinishWorkitem();
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
      // item.workflowInstanceState = Helper.workflowStateTranslator(item.workflowInstanceState);
      switch (item.workflowInstanceState) {
        case WorkflowCenterTypes.WorkflowInstanceState.DRAFT:
          item.workflowInstanceStateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.draft');
          break;
        case WorkflowCenterTypes.WorkflowInstanceState.PROCESSING:
          item.workflowInstanceStateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.processing');
          break;
        case WorkflowCenterTypes.WorkflowInstanceState.COMPLETED:
          item.workflowInstanceStateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.completed');
          break;
        case WorkflowCenterTypes.WorkflowInstanceState.EXCEPTION:
          item.workflowInstanceStateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.exception');
          break;
        case WorkflowCenterTypes.WorkflowInstanceState.CANCELED:
          item.workflowInstanceStateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.canceled');
          break;
      }
      return item;
  }

  // 获取已办列表
  async getMyFinishWorkitem(type?:string) {
    const p = {
      ...this.searchParams,
      page: this.curPage - 1,
      size: this.pageSize,
      appCode: this.appCode
    };

    // 数据处理函数
    this.dataHandler = (data:any) => {
      data.forEach((item:any, index:number) => {
        item.orderNumber = index + 1;
        item.key = index;
        // 处理结果
        
        item = this.i18nHandle(item);

        item.finishTime = Helper.removeSeconds(item.finishTime);


        // 设置高亮
        item.instanceName = utils.searchHighLight(this.searchParams.workflowName, item.instanceName);
        
        // 国际化兼容
        item = utils.compatible(item, 'activityName');
      });
      return data;
    };

    this.isLoading = true;
    const res:any = await workflowCenterApi.listFinishedWorkitems(p);
    this.commonHandler(res, type);
  }


  @Watch('$i18n.locale')
  onLanguageChange(){
    this.tableData.forEach((item:any) => {
      item = this.i18nHandle(item);
    });
    this.setLoadAllTxt();
    this.setTableMaxHeight();
  }
}

</script>
<style lang='less' scoped>
@import './style/index.less';
.filters-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  z-index: 99;
}
.workitem-box .table-box{
  .table {
    max-height: calc( 100% - 58px );
  }
}
.load-fail-box {
  padding-top: 100px;
  text-align: center;
}
</style>
