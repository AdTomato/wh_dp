<template>
  <div class="activity-box">
    <div
      v-for="(instance,idx) in activities"
      :key="idx"
      :class="[
        'activity-instance',
        setFlowStatus(instance.activityCode),
        ['START','END'].includes(instance.activityType) && setStartOrEndStatus(instance)
      ]"
      :style="{
        left: instance.x + 'px',
        top: instance.y + 'px',
        width: instance.width + 'px',
        height: instance.height + 'px'
      }"
      @click="onActivity(instance, $event)"
    >
      <div class="activity-content">
        <div class="content-wrap">
          <i class="icon aufontAll" v-html="instance.icon"></i>
          <span>{{ lang === 'zh'? instance.activityName: instance.name_i18n[lang] }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { Activity } from '../typings/workflow';

@Component({
  name: 'ActivityInstance'
})
export default class ActivityInstance extends Vue {
  @Prop() activities!: Activity[];
  @Prop() workflowStatus?: string;
  @Prop({ type: Array, default:() => [] }) flowStatus!: any;

  /**
   * 获取当前语言状态
   */
  get lang() {
    return localStorage.getItem('locale') ? localStorage.getItem('locale') : 'zh';
  }

  /**
   * 读取当前节点的状态
   */
  setFlowStatus(activityCode: string) {
    const flowState = this.flowStatus.find((state:any) => state.activityCode == activityCode);
    return flowState ? flowState.status : '';
  }
  /**
   * 设置开始节点/结束节点 与 流程状态相关联状态：
   * 流程开始：开始节点呈完成颜色
   * 流程结束：结束节点呈完成颜色
   */
  setStartOrEndStatus(activity: any){
    let startState:string = '',endState:string = '';
    switch(this.workflowStatus){
      case 'PROCESSING':
        startState = 'finish';
        endState = '';
        break;
      case 'COMPLETED':
      case 'CANCELED':
        startState = 'finish';
        endState = 'finish';
        break;
    }
    if (activity.activityType === 'START') {
      return startState;
    }
    return endState;
  }
  /**
   * 节点单击事件
   */
  onActivity(activity: Activity, e: Event) {
    this.$emit('click', activity, e);
  }
}
</script>
<style lang="less">
.activity-instance {
  position: absolute;
  z-index: 9;
  padding: 5px;
  width: 158px;
  height: 40px;
  line-height: 30px;
  background: #fff;
  border-radius: 2px;
  border: 1px solid #052535;
  font-size: 14px;
  color: #000;
  box-sizing: border-box;
  cursor: pointer;
  &:hover {
    border: 1px solid #70c922;
  }
  .activity-content {
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: Center;
    word-break: break-all;
    i {
      font-size: 14px;
      margin-right: 5px;
    }
    .content-wrap{
      max-height: 100%;
    }
  }
}
</style>
