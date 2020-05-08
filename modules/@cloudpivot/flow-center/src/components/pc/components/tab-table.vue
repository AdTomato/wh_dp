<template>
  <div class="tab-table">
    <div class="filters-box">
      <query-workitem
        ref="queryWorkitem"
        v-show="isShowQueryItem"
        :isShowInstanceState="isShowInstanceState"
        :isShowOriginator="isShowOriginator"
        :isResetFields="resetFields"
        :timeLable="timeLable"
        @reset="onReset"
        @search="onSearch"
        @hide="hideQueryItem"
      />
    </div>
    <div class="table">
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        :pagination="false"
        :scroll="{y: scrollY, x: scrollX}"
      >
        <!-- 序号 -->
        <span
          slot="indexTitle"
          class="resize resize-first"
        >{{ $t('cloudpivot.flowCenter.pc.orderNuber') }}</span>

        <!-- 流程名称 -->
        <span
          slot="instanceNameTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.flowName') }}</span>
        <template slot="instanceName" slot-scope="text,record">
          <span
            class="fake-btn text-ellipsis"
            @click.stop="openDetail(record)"
            v-html="text"
            :title="record.instanceName"
          ></span>
        </template>

        <!-- 流程模板 -->
        <span
          slot="workflowNameTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.flowTemplate') }}</span>
        <template slot="workflowName" slot-scope="text,record">
          <span 
            v-if="isChinese" 
            :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'" 
            :title="text"
          >{{ text }}</span>
          <span 
            v-else 
            :class="record.isRead ? 'gray text-ellipsis' : 'text-ellipsis'" 
            :title="record.name_i18n[$i18n.locale]"
          >{{ record.name_i18n[$i18n.locale] }}</span>
        </template>

        <!-- 当前处理人 -->
        <span
          slot="participantNameTitle"
          class="resize"
        >
          <span>{{ $t('cloudpivot.flowCenter.pc.curResolver') }}</span>
        </span>
        <span
          slot="participantName"
          slot-scope="text,record"
          class="participant-name"
        >
          <a-tooltip
            placement="topLeft"
            :mouseEnterDelay="0.5"
            :visible="visible&&curID===record.id"
            @visibleChange="toolTipShow($event,record)"
          >
            <template slot="title">
              <span class="space">&nbsp;</span>
              <template v-for="(p,index) in tooltipParticipants">
                <div :key="index" class="participant-wrap">
                  {{ `${p.activityName}:` }}
                  <template v-for="(participant,i) in p.participants">
                    <span
                      class="fake-btn"
                      :key="i"
                      v-if="i === (p.participants.length-1)"
                      @click="showDrawer(participant.id)"
                    >{{ `${participant.name};` }} </span>
                    <span
                      class="fake-btn"
                      :key="i"
                      v-else
                      @click="showDrawer(participant.id)"
                    >{{ `${participant.name}、` }} </span>
                  </template>
                  <br/>
                </div>
              </template>
            </template>
            <div class="p-box">
              <span
                class="fake-btn"
                v-if="record.participants.name"
                @click="showDrawer(record.participants.id)"
              >{{ `${record.participants.name}...` }} </span>
            </div>
          </a-tooltip>
        </span>

        <!-- 处理人 -->
        <span
          slot="resolverTitle"
          class="resize"
        >
          <span>{{ $t('cloudpivot.flowCenter.pc.resolver') }}</span>
        </span>
        <span
          slot="resolverName"
          slot-scope="text,record"
          class="participant-name"
        >
          <div class="p-box">
            <span class="fake-btn" @click="showDrawer(record.participants.id)">{{ record.participants.name }} </span>
          </div>
        </span>

        <!-- 已用时 -->
        <span
          slot="stayTimeTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.usedTime') }}</span>

        <!-- 发起时间 -->
        <span
          slot="startTimeTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.initiationTime') }}</span>

        <!-- 发起人 -->
        <span
          slot="originatorNameTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.originatorName') }}</span>
        <template slot="originatorName" slot-scope="text,record">
          <span
            class="fake-btn"
            @click.stop="showDrawer(record.originator)"
            v-html="text"
          ></span>
        </template>

        <!-- 发起人所属部门 -->
        <span
          slot="departmentNameTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.originatorDepartment') }}</span>

        <!-- 流程状态 -->
        <span
          slot="stateTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.flowStatus') }}</span>

        <template slot="state" slot-scope="text,record">
          <span>{{ showWorkflowState(text) }}</span>
        </template>

        <template slot="stateTxt" slot-scope="text,record">
          <span>{{ text }}</span>
        </template>

        <!-- 完成时间 -->
        <span
          slot="finishedTimeTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.finishedTime') }}</span>

        <!-- 耗时 -->
        <span
          slot="costTimeTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.costTime') }}</span>

        <!-- 停留时间 -->
        <span
          slot="haveStayedTimeTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.stayTime') }}</span>
        <template slot="stayTime" slot-scope="text,record">
          <span :class="record.isRead ? 'gray' : ''">{{ record.time }}<span v-if="record.workItemTimeoutStatus === 'RED' || record.workItemTimeoutStatus === 'ORANGE'">后超时</span></span>
          <span class="deadline-tip">
            <i class="overtime" v-if="record.workItemTimeoutStatus === 'TIMEOUT'">{{ $t('cloudpivot.flowCenter.pc.timeout') }}</i>
            <img
              v-else-if="record.workItemTimeoutStatus === 'RED'"
              class="overtime-icon"
              src="../assets/icons/warning01.png"
            >
            <img
              v-else-if="record.workItemTimeoutStatus === 'ORANGE'"
              class="overtime-icon"
              src="../assets/icons/warning02.png"
            >
          </span>
        </template>

        <!-- 发起人组织 -->
        <template slot="departmentName" slot-scope="text,record">
          <span
            class="text-ellipsis"
            :title="text"
          >{{ text }}</span>
        </template>

        <!-- 接收时间 -->
        <span
          slot="receiveTimeTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.reciveTime') }}</span>

        <!-- 处理结果 -->
        <span
          slot="approvalTitle"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.resolveRzt') }}</span>

        <!-- 作废时间 -->
        <span
          slot="cancellationTime"
          class="resize"
        >{{ $t('cloudpivot.flowCenter.pc.cancelTime') }}</span>
      </a-table>
    </div>


    <div class="no-data">
      <PageNoData
        :isShowNoData="isShowNoData"
        :isShowSearchNoData="isShowSearchNoData"
        :tipText="$t('cloudpivot.flowCenter.pc.noContent')"
      />
    </div>

    <common-drawer
      v-model="isShowDrawer"
      :data="userInfo"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';
import {
  Table, Tooltip
} from 'h3-antd-vue';

import QueryWorkitem from './query-condition/query-workitem.vue';

import CommonDrawer from './modals/drawer.vue';

import common from '@cloudpivot/common';

import * as WorkflowCenterTypes from '../typings/workflow-center';

import { workflowCenterApi, workflowCenter as workflowCenterParams, workflowApi }  from '@cloudpivot/api';

@Component({
  name: 'tab-table',
  components: {
    ATable: Table,
    ATooltip: Tooltip,
    CommonDrawer,
    QueryWorkitem,
    PageNoData: common.components.pc.PageNoData
  }
})
export default class TabTable extends Vue {
  @Prop() timeLable!:string; // 查询条件时间段显示文本

  @Prop() columns!:any; // 表格行配置（表头配置）

  @Prop() dataSource!:any; // 表格数据

  @Prop() scrollY!:number;// 表头固定

  @Prop() isShowInstanceState!:boolean;

  @Prop() isShowOriginator!:boolean;

  @Prop() resetFields!:boolean;

  @Prop() tabType!:string; // 展示type的模块类型

  @Prop() isShowLoadAll!:boolean;

  @Prop() isShowNoData!:boolean;

  @Prop() isShowSearchNoData!:boolean;

  @Prop() isShowQueryItem!:boolean; // 是否展示查询条件


  isShowDrawer:boolean = false;

  userInfo:any = {};

  visible:boolean = false;

  curID:string = '';

  tooltipParticipants:any = [];

  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  get scrollX() {
    let _w:number = 0;
    if (this.columns) {
      this.columns.forEach((col:any) => {
        _w += col.width;
      });
      return _w + 1;
    }
    return 0;
  }

  async toolTipShow(visible: boolean, workflowData: any) {
    this.curID = workflowData.id;
    if (visible) {
      const params:workflowCenterParams.participantParams = {
        workflowInstanceId: this.tabType === 'task' ? workflowData.instanceId : workflowData.id,
        circulateResource: 'WORKITEM',
      };
      const res = await workflowCenterApi.getParticipants(params);
      if (res.errcode === 0) {
        this.tooltipParticipants = res.data;
        this.visible = true;
      }
    } else {
      this.visible = false;
    }
  }

  /*
  * 重置事件
  */
  onReset() {
    this.$emit('onReset');
  }

  /*
  * 搜索事件
  */
  onSearch(params:any) {
    this.$emit('onSearch', params);
  }

  // 展示抽屉
  async showDrawer(id:string) {
    await this.getUserInfo(id);
    this.isShowDrawer = true;
  }

  async getUserInfo(id:string) {
    const res = await workflowCenterApi.getUserInfo({ id });
    if (res.errcode === 0) {
      this.userInfo = res.data;
    }
  }

  // 流程状态展示
  showWorkflowState(state:string) {
    let stateTxt:any = '';
    switch (state) {
      case WorkflowCenterTypes.WorkflowInstanceState.EXCEPTION:
        stateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.exception');
        break;
      case WorkflowCenterTypes.WorkflowInstanceState.PROCESSING:
        stateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.processing');
        break;
      case WorkflowCenterTypes.WorkflowInstanceState.COMPLETED:
        stateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.completed');
        break;
      case WorkflowCenterTypes.WorkflowInstanceState.CANCELED:
        stateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.canceled');
      case WorkflowCenterTypes.WorkflowInstanceState.DRAFT:
        stateTxt = this.$t('cloudpivot.flowCenter.pc.workflowState.draft');
        break;
    }
    return stateTxt;
  }

  /**
   * 打开表单
   */
  openDetail(obj:any) {
    let url:string = '';
    if (this.tabType === 'instance') {
      url = `/form/detail?workflowInstanceId=${obj.id}&return=${location.pathname + location.search}`;
    } else if (this.tabType === 'task') {
      url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${obj.instanceId}&return=${location.pathname + location.search}`;
    }
    if (this.isDingTalk) {
      this.$router.push({
        path: url
      });
    } else {
      window.open(url);
    }
  }

  hideQueryItem(){
    this.$emit('hide');
  }
}

</script>
<style lang='less' scoped>
@import '../style/index.less';
.filters-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 45px;
  z-index: 99;
}

.table {
  margin-top: 46px;
}

.participant-name{
  div.p-box {
   display: -webkit-box;
   -webkit-line-clamp: 1;
   -webkit-box-orient: vertical;
   overflow: hidden;
  }
  .participant-wrap{
    float: left;
  }
}

.space{
  float: left;
}

.fake-btn {
  cursor: pointer;
  transition: all ease .3s;
  &:hover {
    color: @primary-color;
  }
}
</style>
