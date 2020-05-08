<template>
  <div
    ref="chartCard"
    :style="positionStyle"
    :class="flowTrackChartCardPrefixCls"
  >
    <template v-if="!estimate">
      <div
        v-for="(log, i) in record"
        :key="i"
        class="item"
        :class="{'sub-item': log.subInstanceActivity}"
        @click="goSubWorkflowForm(log)"
      >
        <a-avatar
          class="avatar"
          :size="32"
          icon="user"
          :src="log.originator.imgUrl"
        />
        <div class="content">
          <div class="user" v-if="log.subInstanceActivity">
            <Participants
              class="name"
              slot="originator"
              :i18nData="i18n"
              :participants="[log.originator]"
            ></Participants>
            <label v-if="!!statusFn(log.subInstanceStatus, 'subInstance')" :class="`workflow-action ${getSubWorkflowActionStatusColorClass(log.subInstanceStatus)}`"><span>{{ statusFn(log.subInstanceStatus, 'subInstance') }}</span></label>
          </div>
          <div class="user" v-else>
            <Participants
              class="name"
              slot="originator"
              :i18nData="i18n"
              :participants="[log.originator]"
            ></Participants>
            <label v-if="!!statusFn(log.approvalActionStatus, 'workflow')" :class="`workflow-action ${getWorkflowActionStatusColorClass(log.approvalActionStatus)}`"><span>{{ statusFn(log.approvalActionStatus, 'workflow') }}</span></label>
          </div>
          <div class="timers">
            <label class="timer">{{ `${receiverTime}${workItemLogTimeFormat(log.receiveTime, log)}` }}</label>
            <label class="timer">{{ `${finishTime}${workItemLogTimeFormat(log.finishTime, log)}` }}</label>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <label class="title">{{ predictor }}</label>
      <div
        class="estimate-item"
        v-for="(user, i) in record"
        :key="i"
      >
        <a-avatar
          class="avatar"
          :size="32"
          icon="user"
          :src="user.imgUrl"
        />
        <Participants
          class="name"
          slot="originator"
          :participants="[user]"
          :i18nData="i18n"
        ></Participants>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import {
  Avatar
} from 'h3-antd-vue';
import WorkflowMixin from '../mixins/workflow';
import Participants from '../participants.vue';
import { closest } from '@cloudpivot/common/src/utils/dom';

import { workflow } from "@cloudpivot/api";

@Component({
  name: 'flow-track-chart-card',
  components: {
    AAvatar: Avatar,
    Participants
  }
})
export default class FormWorkflowTrackChartCard extends mixins(WorkflowMixin) {
  @Prop({ default: () => [] }) record!: workflow.WorkflowTrackLog | any;

  @Prop({ default: () => ({}) }) rect?: DOMRect;

  @Prop({ default: false }) estimate?: Boolean;

  @Prop() fn?: any;

  @Prop() i18n?: any;

  @Prop() statusFn!: any;

  receiverTime:any = '接收时间:';

  finishTime:any = '完成时间:';

  predictor:any = '预估处理人';

  /**
   * 获取
   */
  get flowTrackChartCardPrefixCls() {
    return {
      'flow-track-chart-card': true,
      'flow-track-chart-card--estimate': this.estimate
    };
  }

  /**
   * 获取元素位置
   */
  get positionStyle() {
    const windowWidth:number = document.documentElement ? document.documentElement.clientWidth : 0;
    const mainScrollTop:number = document.getElementsByClassName('main')[0] ? document.getElementsByClassName('main')[0].scrollTop - 64 : 0;
    let pageX:number = 0;
    let pageY:number = 0;
    if (this.rect && this.rect.right && this.rect.left) {
      pageX = windowWidth / 2 < this.rect.right ? this.rect.left - (this.estimate ? 390 : 310) : this.rect.right + 30;
      pageY = mainScrollTop ? mainScrollTop + this.rect.y : this.rect.y;
    }
    return `top:${pageY}px;left:${pageX}px`;
  }

  /**
   * 文本区域点击事件
   * @param e
   */
  documentClick(e: any) {
    if (!closest(e.target, '.flow-track-chart-card')) {
      this.$emit('destroy');
    }
  }

  mounted() {
    this.$nextTick(() => {
      if (this.i18n && this.i18n.receiverTime) {
        this.receiverTime = this.i18n.receiverTime;
        this.finishTime = this.i18n.finishTime;
        this.predictor = this.i18n.predictor;
      }
      (this.$refs.chartCard as HTMLElement).classList.add('flow-track-chart-card--show');
      // 延时注册事件，防止流程节点点击事件的干扰
      setTimeout(() => {
        document.addEventListener('click', this.documentClick, false);
      }, 300);
    });
  }

  /**
   * 销毁周期
   */
  destroyed() {
    document.removeEventListener('click', this.documentClick, false);
  }

  /**
   * 打开子流程表单
   */
  goSubWorkflowForm(log:any) {
    if (log.subInstanceActivity) {
      this.fn(log);
      this.$emit('destroy');
    }
  }
}
</script>
<style lang="less">
  .flow-track-chart-card{
    position: absolute;
    transition: all .25s;
    transform: scale(0.7);
    opacity: 0;
    top:0;
    padding: @base4-padding-md;
    margin-bottom: @base4-padding-md;
    background:#FFF;
    box-shadow:0 2px 8px 0 rgba(30,85,255,0.15);
    border-radius:4px;
    width: 280px;
    max-height: 280px;
    overflow-x: hidden;
    overflow-y: auto;
    z-index: 999;
    &--estimate{
      width: 360px;
    }
    .item{
      display: flex;
      padding: @base4-padding-sm 0;
      border-bottom:1px solid rgba(234,237,243,1);
      .avatar{
        flex: 0 0 32px;
        margin-right: @base4-padding-md;
      }
      .content{
        flex: 1 1;
        .name{
          display: inline-block;
          margin-right: @base4-padding-md;
          font-weight:@font-weight-md;
          a {
            color: @light-color-1;
          }
        }
        .approval{
          padding: 0 8px;
          background:rgba(50,182,131,1);
          border-radius:9px;
          color: #FFFFFF;
          line-height: 18px;
          span{
            display: inline-block;
            vertical-align: text-top;
            font-size: @font-size-12;
            transform: scale(0.8);
          }

        }
        .timers{
          font-size: @font-size-12;
          margin-top: @base4-padding-xs;
          .timer{
            display: block;
            color:@light-color-3;
          }
          .timer:first-child{
            margin-bottom: 3px;
          }
        }
      }
    }
    .item:first-child{
      padding-top: 0;
    }
    .item:last-child{
      padding-bottom: 0;
      border: 0;
    }
    .sub-item{
      cursor: pointer !important;
      .timer{
        cursor: pointer;
      }
    }

    .title{
      display: block;
      color:@light-color-1;
      font-size:@font-size-14;
      margin-bottom: 16px;
    }
    .estimate-item{
      display: inline-flex;
      align-items: center;
      width: 33.33%;
      .avatar{
        margin-right: 16px;
      }
      a{
        font-size:@font-size-12;
        color: @light-color-1 !important;
      }
    }
  }
  .flow-track-chart-card--show{
    opacity: 1;
    transform: scale(1);
  }
</style>
