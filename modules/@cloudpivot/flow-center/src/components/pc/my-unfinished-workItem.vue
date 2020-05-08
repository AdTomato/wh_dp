<template>
  <div
    id="MyUnfinishedWorkItem"
    class="workitem-box"
    ref="workItem"
  >
    <div class="content-top">
      <h2>{{ $t('cloudpivot.flowCenter.pc.todoList') }}</h2>
      <div class="content-right">
        <a-button
          v-if="originate"
          type="primary"
          @click="startWorkflow"
        >{{ $t('cloudpivot.flowCenter.pc.startFlow') }}</a-button>
        <a-input
          class="search-input"
          :placeholder="$t('cloudpivot.flowCenter.pc.searchFlowPlaceholder')"
          style="width: 300px"
          v-model="wd"
          @pressEnter="onSearch"
        >
          <a-icon
            class="suffix-icon close-icon"
            v-if="wd.length > 0 "
            slot="suffix"
            type="close-circle"
            @click="clearKeyword"
          />

          <a-icon
            class="suffix-icon search-icon"
            type="search"
            slot="suffix"
            @click="onSearch"
          />
        </a-input>
      </div>
    </div>

    <PageLoading
      v-model="isLoading"
      shadeColor="#F4F6FC"
      :shadeOpacity="1"
    />

    <div class="table-box" v-if="isShowTableBox">
      <!-- <div class="search-result" v-if="searchNumber >= 0">{{ $t('cloudpivot.flowCenter.pc.searchRzt') }} <span>{{ searchNumber }}</span> {{ $t('cloudpivot.flowCenter.pc.items') }}</div> -->
      <div class="table" ref="table">
        <a-table
          :dataSource="tableData"
          :pagination="false"
          :scroll="{y: scrollYHeight, x: 1060}"
          :columns="columns"
        >
          <!-- 序号 -->
          <span
            slot="indexTitle"
            class="resize resize-first"
          >{{ $t('cloudpivot.flowCenter.pc.orderNuber') }}</span>
          <template slot="orderNumber" slot-scope="text,record">
            <span
              :class="record.isRead ? 'gray text-ellipsis' : ' text-ellipsis'"
            >{{ text }}</span>
          </template>

          <!-- 流程名称 -->
          <span
            slot="instanceNameTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.flowName') }}</span>
          <template slot="instanceName" slot-scope="text,record">
            <span
              :class="record.isRead ? 'gray fake-btn text-ellipsis' : 'fake-btn text-ellipsis'"
              @click="openDetail(record)"
              v-html="text"
              :title="record.instanceName"
            ></span>
          </template>

          <!-- 当前节点 -->
          <span
            slot="activityNameTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.curActivity') }}</span>
          <template slot="activityName" slot-scope="text,record">
            <span v-if="isChinese" :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'">{{ text }}</span>
            <span v-else :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'">{{ record.name_i18n[$i18n.locale] }}</span>
          </template>

          <!-- 停留时间 -->
          <span
            slot="stayTimeTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.stayTime') }}</span>
          <template slot="stayTime" slot-scope="text,record">
            <span :class="record.isRead ? 'gray' : ''">{{ record.time }}<span v-if="record.workItemTimeoutStatus === 'RED' || record.workItemTimeoutStatus === 'ORANGE'">{{ $t('cloudpivot.flowCenter.pc.timeOutAfter') }}</span>
            </span>
            <span class="deadline-tip">
              <i class="overtime beUrged" v-if="record.urgeCount > 0">{{ $t('cloudpivot.flowCenter.pc.beUrged') }}</i>
              <i class="overtime" v-if="record.workItemTimeoutStatus === 'TIMEOUT'">{{ $t('cloudpivot.flowCenter.pc.timeout') }}</i>
              <img
                v-else-if="record.workItemTimeoutStatus === 'RED'"
                class="overtime-icon"
                src="./assets/icons/warning01.png"
              >
              <img
                v-else-if="record.workItemTimeoutStatus === 'ORANGE'"
                class="overtime-icon"
                src="./assets/icons/warning02.png"
              >
            </span>
          </template>

          <!-- 发起人 -->
          <span
            slot="originatorNameTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.originatorName') }}</span>
          <template slot="originatorName" slot-scope="text,record">
            <span
              :class="record.isRead ? 'gray fake-btn text-ellipsis' : 'fake-btn text-ellipsis'"
              @click.stop="showDrawer(record.originator)"
              v-html="text"
            ></span>
          </template>

          <!-- 发起人组织 -->
          <span
            slot="departmentNameTitle"
            class="resize"
          >{{ $t('cloudpivot.flowCenter.pc.departmentName') }}</span>
          <template slot="departmentName" slot-scope="text,record">
            <span :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'" :title="text">{{ text }}</span>
          </template>
        </a-table>
        <div class="no-data">
          <PageNoData
            :isShowNoData="isShowNoData"
            :isShowSearchNoData="isShowSearchNoData"
            :tipText="$t('cloudpivot.flowCenter.pc.noDataText')"
          />
        </div>
      </div>

      <div class="pagination-box">
        <a-pagination
          :current="curPage"
          :total="total"
          :showTotal="total => $t('cloudpivot.flowCenter.pc.total', { num: total })"
          :pageSize="pageSize"
          :pageSizeOptions="pageSizeOptions"
          showSizeChanger
          showQuickJumper
          @change="onPaginationChange"
          @showSizeChange="onSizeChange"
        />
      </div>
    </div>

    <div class="load-fail-box">
      <PageLoadFail v-model="isShowLoadFailBox" @refresh="reload"/>
    </div>

    <common-drawer
      v-model="isShowDrawer"
      :data="userInfo"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { mixins } from 'vue-class-component';

import {
  Button, Input, Table, Pagination, Icon
} from 'h3-antd-vue';

import WorkItemMixin from './mixins/workitem';

import CommonDrawer from './components/modals/drawer.vue';

import { workflowCenterApi, workflowCenter as workflowCenterParams }  from '@cloudpivot/api';

import * as WorkflowCenterNS from './typings/workflow-center';

import * as WorkflowCenterHelper from './helper/helper';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import common from '@cloudpivot/common';


@Component({
  name: 'MyUnfinishedWorkItem',
  components: {
    AButton: Button,
    AInputSearch: Input.Search,
    AInput: Input,
    ATable: Table,
    ATableColumn: Table.Column,
    APagination: Pagination,
    AIcon: Icon,
    CommonDrawer,
    PageLoading: common.components.pc.PageLoading,
    PageNoData: common.components.pc.PageNoData,
    PageLoadFail: common.components.pc.LoadFail
  }
})

export default class MyUnfinishedWorkItem extends mixins(WorkItemMixin) {

  /**
   * 单应用集成属性,集成时不显示title
   */
  @Prop({
    default: true
  }) showTitle!: boolean;

  /**
   * 单应用集成属性,集成时不显示发起流程按钮
   */
  @Prop({
    default: true
  }) originate!: boolean;

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

  wd:string = '';

  defaultTableColumns:any = [
    {
      dataIndex: 'orderNumber',
      width: 80,
      align: 'center',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'orderNumber' }
    },
    {
      dataIndex: 'instanceName',
      width: 220,
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' }
    },
    {
      dataIndex: 'activityName',
      width: 130,
      slots: { title: 'activityNameTitle' },
      scopedSlots: { customRender: 'activityName' }
    },
    {
      dataIndex: 'stayTime',
      width: 300,
      slots: { title: 'stayTimeTitle' },
      scopedSlots: { customRender: 'stayTime' }
    },
    {
      dataIndex: 'originatorName',
      width: 100,
      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' }
    },
    {
      dataIndex: 'departmentName',
      width: 170,
      slots: { title: 'departmentNameTitle' },
      scopedSlots: { customRender: 'departmentName' }
    }
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
    this.getUnfinishedWorkflowItems();
    window.addEventListener('resize', this.setTableMaxHeight);
    window.addEventListener('message', this.reloadMessage, false);
  }

  reloadMessage(event:any) {
    if (event.source === window) return;
    if (event.data.indexOf('/workflow-center/my-unfinished-workitem') !== -1 || event.data.indexOf('%2Fworkflow-center%2Fmy-unfinished-workitem') !== -1) {
      this.getUnfinishedWorkflowItems();
    }
  }

  destroyed() {
    window.removeEventListener('resize', this.setTableMaxHeight);
    window.removeEventListener('message', this.reloadMessage, false);
  }

  // 清空关键字
  clearKeyword() {
    this.wd = '';
    this.curPage = 1;
    this.getUnfinishedWorkflowItems();
  }

  // 点击搜索
  onSearch() {
    this.curPage = 1;
    this.getUnfinishedWorkflowItems('search');
  }

  // 分页改变
  onPaginationChange(page:number, size:number) {
    this.curPage = page;
    this.getUnfinishedWorkflowItems();
  }

  // 分页pageSize改变
  onSizeChange(current:number, size:number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getUnfinishedWorkflowItems('pageChange');
  }

  // 打开发起流程
  startWorkflow() {
    this.$router.push({ name: 'startWorkflow' });
  }

  // 重新加载
  reload() {
    this.wd = '';
    this.curPage = 1;
    this.pageSize = 20;

    this.getUnfinishedWorkflowItems();
  }

  setTime(item:any){
    if (item.workItemTimeoutStatus === 'NORMAL' || item.workItemTimeoutStatus === 'TIMEOUT') {
        item.time = WorkflowCenterHelper.timeTranslate(item.stayTime);
      } else if (item.workItemTimeoutStatus === 'ORANGE' || item.workItemTimeoutStatus === 'RED') {
        item.time = WorkflowCenterHelper.timeTranslate(item.remainingTime);
      }
      return item;
  }

  /**
   * 获取待办列表
   * type: search 搜索的时候内容为空展示不同的img pageChange 页码改变的时候
   * */
  async getUnfinishedWorkflowItems(type?:string) {
    const params:workflowCenterParams.SearchParams = {
      wd: this.wd,
      appCode: this.appCode,
      page: this.curPage - 1,
      size: this.pageSize
    };

    // 数据处理函数
    this.dataHandler = (data:any) => {
      data.forEach((item:any, index:number) => {
        item.orderNumber = index + 1;
        item.key = index;
        item.isRead = item.state === WorkflowCenterNS.WorkItemStatus.INPROGESS;
        item = this.setTime(item);
        item.departmentName = WorkflowCenterHelper.departmentNameTranslator(item.departmentName);

        // 设置高亮
        item.originatorName = utils.searchHighLight(this.wd, item.originatorName);
        item.instanceName = utils.searchHighLight(this.wd, item.instanceName);

        // 国际化兼容
        item = utils.compatible(item, 'activityName');
      });
      return data;
    };

    this.isLoading = true;
    const res = await workflowCenterApi.searchWorkitems(params);
    this.commonHandler(res, type);
    this.$store.dispatch('WorkflowCenterStore/getWorkCount');
  }

  @Watch('$i18n.locale')
  onLanguageChange(){
    this.tableData.forEach((item:any) => {
      item = this.setTime(item)
    });
    this.setLoadAllTxt();
    this.setTableMaxHeight();
  }
}
</script>

<style lang="less" scoped>
@import './style/index.less';
.table {
  max-height: calc( 100% - 58px );
}
.load-fail-box {
  padding-top: 100px;
  text-align: center;
}
.search-result {
  padding: 0 0 16px 16px;
  color: @light-color-2;
  & span {
    color: @primary-color;
  }
}
</style>
