<template>
  <a-collapse
    class="worflow-track-base workflow-collapse"
    v-model="activeKey"
    :bordered="false"
  >
    <a-collapse-panel
      class="worflow-track-base__info worflow-track-base__info--base bold-collapse-panel"
      :header="$t('cloudpivot.flow.pc.BaseInfo')"
      key="baseInfo"
    >
      <a-row>
        <a-col :span="4"><label>{{ $t('cloudpivot.flow.pc.WorkflowName') }}</label></a-col>
        <a-col :span="8"><span v-if="baseInfo.workflowName">{{ isChinese ? baseInfo.workflowName : baseInfo.name_i18n[$i18n.locale] }}</span></a-col>
        <a-col :span="4"><label>{{ $t('cloudpivot.flow.pc.Status') }}</label></a-col>
        <a-col :span="8"><span>{{ workflowState }}</span></a-col>
      </a-row>
      <a-row>
        <a-col :span="4"><label>{{ $t('cloudpivot.flow.pc.StartTime') }}</label></a-col>
        <a-col :span="8"><span>{{ baseInfo.startTime }}</span></a-col>
        <a-col :span="4"><label>{{ $t('cloudpivot.flow.pc.FinishedTime') }}</label></a-col>
        <a-col :span="8"><span>{{ baseInfo.finishTime }}</span></a-col>
      </a-row>
    </a-collapse-panel>
    <a-collapse-panel
      class="worflow-track-base__info worflow-track-base__info--node"
      :header="$t('cloudpivot.flow.pc.CurNode')"
      key="node"
      v-if="participants && participants.length"
    >
      <div ref="trackNode" class="worflow-track-base__node">
        <article
          v-for="(info, i) in participants"
          :key="i"
          :class="`worflow-track-base__node-item color-${i % 2}`"
        >

          <div class="worflow-track-base__node-item-txt">
            <label>{{ $t('cloudpivot.flow.pc.ActivityName') }}</label>
            <span>{{ isChinese ? info.activityName : info.name_i18n[$i18n.locale] }}</span>
          </div>
          <Participants
            class="worflow-track-base__node-item-txt"
            :pSlot="$t('cloudpivot.flow.pc.NoFinishOriginator')"
            :participants="info.participants"
          ></Participants>
        </article>
      </div>
    </a-collapse-panel>
  </a-collapse>
</template>

<script lang="ts">
import {
  Component, Vue, Watch, Prop
} from 'vue-property-decorator';
import {
  Collapse, Row, Col
} from 'h3-antd-vue';
import Participants from './participants.vue';
import { WorkflowState } from '../../typings/workflow-enum';
import common from '@cloudpivot/common';

import { workflow } from '@cloudpivot/api';

@Component({
  name: 'form-flow-track-base',
  components: {
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    ARow: Row,
    ACol: Col,
    UserPopover: common.components.pc.UserPopover,
    Participants
  }
})
export default class FormflowTrackBase extends Vue {
  @Prop({
    default: {
      headerAction: {},
      participants: []
    }
  }) baseInfo!: workflow.InstanceBaseInfo; // 流程跟踪基础信息

  activeKey: string[] = ['baseInfo', 'node']; // 默认展开节点

  /**
   * 获取当前活动节点明显
   */
  get participants() {
    return this.baseInfo.participants;
  }

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  /**
   * 获取流程状态
   */
  get workflowState() {
    return this.$t(`cloudpivot.flow.pc.WorkflowState.${WorkflowState[this.baseInfo.status as any]}`);
  }

  beforeMount() {
    console.log('base',this.baseInfo);
  }
}
</script>
<style lang="less">
// @import "../../../../styles/themes/default.less";
.worflow-track-base{
  border: 0;
  &__info--base{
    .ant-collapse-content-box{
      display: flex;
      flex-direction: column;
      height: 118px;
      .ant-row{
        flex: 1 1;
        display: flex;
        align-items: center;
        padding: 0 @base4-padding-md;
        label {
          color: @light-color-2;
        }
        span {
          color: @light-color-1;
        }
      }
    }
  }
  &__node-item {
    display: flex;
    flex-direction: column;
    position: relative;
    padding: @base10-padding-md;
    background:rgba(244,246,252,1);
    border-radius:@border-radius-lg;
    justify-items: center;
    margin-bottom: @base4-padding-xs;
  }
  &__node-item:before{
    content: '';
    position: absolute;
    top:20px;
    left: 0;
    width: 2px;
    height: calc(100% - 40px);
  }
  &__node-item.color-0:before{
    background-color: rgba(255, 147, 14, 1);
  }
  &__node-item.color-1:before{
    background-color: rgba(50, 182, 131, 1);
  }
  &__node-item-txt{
    color: @light-color-1 !important;
    label{
      color: @light-color-2;
      margin-right: @base4-padding-md;
    }
    span{
      display: inline-block;
      white-space:nowrap;
      color: @light-color-1;
      font-weight:@font-weight-base;
    }
    a {
      color: @light-color-1 !important;
    }
  }
  &__node-item-txt:first-child{
    margin-bottom: @base10-padding-sm;
  }
  .user-name{
    color: rgba(0,0,0,0.85) !important;
    &:hover{
      color: @primary-color !important;
    }
  }
}
</style>
