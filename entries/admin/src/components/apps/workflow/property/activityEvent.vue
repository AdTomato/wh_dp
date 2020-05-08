<template>
  <div class="activity-event-panel">
    <!-- 活动激活前 -->
    <property-widget label="活动激活前" tip="在活动由系统创建之前，系统内部触发的事件。">
      <template>
        <div slot="right" class="right-box">
          <ellipsis-input :value="eventSetting.beforeActivate?'已设置':''" @click="beforeActive"/>
        </div>
      </template>
    </property-widget>

    <!-- 活动激活后 -->
    <property-widget label="活动激活后" tip="在活动由系统创建之后，系统内部立即触发的事件；">
      <template>
        <div slot="right" class="right-box">
          <ellipsis-input :value="eventSetting.afterActivate?'已设置':''" @click="afterActive"/>
        </div>
      </template>
    </property-widget>

    <!-- 活动完成后 -->
    <property-widget label="活动完成后" tip="在活动完成后，由系统内部立即触发的事件">
      <template>
        <div slot="right" class="right-box">
          <ellipsis-input :value="eventSetting.endActivity?'已设置':''" @click="afterCompleted"/>
        </div>
      </template>
    </property-widget>

    <!-- 活动取消 -->
    <property-widget
      label="活动取消"
      tip="在活动被取消时，由系统内部立即调用的事件"
      v-if="type === 'PARTICIPANT'"
    >
      <template>
        <div slot="right" class="right-box">
          <ellipsis-input :value="eventSetting.cancelActivity?'已设置':''" @click="activityCancel"/>
        </div>
      </template>
    </property-widget>

    <!-- 任务提交后 -->
    <property-widget
      label="任务提交后"
      tip="当活动中的某个任务提交后，由系统内部立即调用的事件"
      v-if="type === 'PARTICIPANT'"
    >
      <template>
        <div slot="right" class="right-box">
          <ellipsis-input :value="eventSetting.jobSubmitted?'已设置':''" @click="afterSubmit"/>
        </div>
      </template>
    </property-widget>

    <!-- 任务驳回后 -->
    <property-widget
      label="任务驳回后"
      tip="当活动中的某个任务驳回后，由系统内部立即调用的事件"
      v-if="type === 'PARTICIPANT'"
    >
      <template>
        <div slot="right" class="right-box">
          <ellipsis-input :value="eventSetting.jobRejected?'已设置':''" @click="afterReject"/>
        </div>
      </template>
    </property-widget>

    <!-- 事件抽屉 -->
    <event-handler
      v-model="showEventHandler"
      :eventObj="eventObj"
      @saveEvent="saveEvent"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch, Provide
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import PropertyWidget from '../base/propertyWidget.vue';
import ellipsisInput from '../base/ellipsisInput.vue';
import EventHandler from '../modals/eventHandler.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'ActivityEvent',
  components: {
    PropertyWidget,
    ellipsisInput,
    EventHandler
  }
})

export default class ActivityEvent extends Vue {
  @WorkflowModule.State('currentActivity') currentActivity: any;

  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @Prop() type!:string;

  eventObj:any = {};

  showEventHandler:boolean = false;

  // 事件是否设置
  eventSetting: any = {
    beforeActivate: false,
    afterActivate: false,
    endActivity: false,
    cancelActivity: false,
    jobSubmitted: false,
    jobRejected: false,
  };

  beforeMount() {
    this.dataMounted();
  }

  // 数据渲染
  dataMounted() {
    if (!this.curActivityProps.acticityEvent) return;
    Object.keys(this.eventSetting).forEach((key:any) => {
      const data = this.curActivityProps.acticityEvent[key];
      if (data) {
        if (data.receiver || (data.dataDisposals && data.dataDisposals.length) || (data.bizActions && data.bizActions.length) || data.cancelParllelActivity || !data.rejectCancelParllelActivity) {
          this.eventSetting[key] = true;
        } else {
          this.eventSetting[key] = false;
        }
      }
    });
  }

  // 活动激活前
  beforeActive() {
    this.eventObj = {
      eventTitle: '活动激活前',
      eventCode: 'beforeActivate'
    };
    this.showEventHandler = true;
  }

  // 活动激活后
  afterActive() {
    this.eventObj = {
      eventTitle: '活动激活后',
      eventCode: 'afterActivate'
    };
    this.showEventHandler = true;
  }

  // 活动完成后
  afterCompleted() {
    this.eventObj = {
      eventTitle: '活动完成后',
      eventCode: 'endActivity'
    };
    this.showEventHandler = true;
  }

  // 活动取消
  activityCancel() {
    this.eventObj = {
      eventTitle: '活动取消',
      eventCode: 'cancelActivity'
    };
    this.showEventHandler = true;
  }

  // 任务提交后
  afterSubmit() {
    this.eventObj = {
      eventTitle: '任务提交后',
      eventCode: 'jobSubmitted'
    };
    this.showEventHandler = true;
  }

  // 任务驳回后
  afterReject() {
    this.eventObj = {
      eventTitle: '任务驳回后',
      eventCode: 'jobRejected'
    };
    this.showEventHandler = true;
  }

  // 事件抽屉保存事件
  saveEvent(data:any) {
    const vm = this;
    Object.keys(this.eventSetting).forEach((s:any) => {
      if (s === data.code) {
        vm.eventSetting[s] = data.isSetting;
      }
    });
    console.log(vm.eventSetting);
  }

  @Watch('currentActivity')
  onActivityChange(v: string) {
    this.dataMounted();
  }
}
</script>

<style lang="less" scoped>
.right-box{
  width: 100%;
  display: flex;
  align-items: center;
}
</style>
