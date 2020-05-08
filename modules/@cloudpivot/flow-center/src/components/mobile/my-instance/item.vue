<template>
  <base-item
    @click="goForm"
    class="work-item"
    :title="workitem.instanceName"
    :summary="workitem.activityName"
  >
    <!-- <div class="start-time" slot="right">
      <span>{{ workitem.startTime }}</span>
    </div>-->
    <span slot="time" class="work-item-time">
      {{ time }}
      <span class="time-start">{{ rightContent }}</span>
    </span>
  </base-item>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import common from '@cloudpivot/common';

@Component({
  name: 'instancesItem',
  components: {
    BaseItem: common.components.mobile.BaseItem
  }
})
export default class MyInstancesItem extends Vue {
  @Prop() workitem!: any;

  status: string = '';

  rightContent: string = '';

  time: string = '';

  goForm() {
    this.$emit('openForm');
  }

  formatTimeStr() {
    let day: number = 0;
    let hour: number = 0;
    let min: number = 0;
    if (this.workitem.stayTime || this.workitem.costTime) {
      const { stayTime } = this.workitem;
      const { costTime } = this.workitem;
      if (this.workitem.state === 'COMPLETED' || this.workitem.state === 'CANCELED') {
        day = Math.floor(costTime / (24 * 60 * 60 * 1000));
        hour = Math.floor(costTime % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        min = Math.ceil(costTime % (24 * 60 * 60 * 1000) % (60 * 60 * 1000) / (60 * 1000));
      } else {
        day = Math.floor(stayTime / (24 * 60 * 60 * 1000));
        hour = Math.floor(stayTime % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        min = Math.ceil(stayTime % (24 * 60 * 60 * 1000) % (60 * 60 * 1000) / (60 * 1000));
      }
    }
    if (day > 0) {
      return `${day}${this.$t('cloudpivot.flowCenter.mobile.days')}${hour}${this.$t('cloudpivot.flowCenter.mobile.hours')}`;
    }
    return `${hour}${this.$t('cloudpivot.flowCenter.mobile.hours')}${min}${this.$t('cloudpivot.flowCenter.mobile.minutes')}`;
  }

  beforeMount() {
    const timeStr: string = this.formatTimeStr();
    const { state, finishTime, startTime } = this.workitem;
    this.time = state === 'COMPLETED' ? `${this.$t('cloudpivot.flowCenter.mobile.costTime')}${timeStr}` : `${this.$t('cloudpivot.flowCenter.mobile.usedTime')}${timeStr}`;
    switch (state) {
      case 'COMPLETED':
        this.rightContent = `${this.$t('cloudpivot.flowCenter.mobile.finishTime')}${finishTime}`;
        break;
      case 'CANCELED':
        this.rightContent = `${this.$t('cloudpivot.flowCenter.mobile.cancelTime')}${finishTime}`;
        break;
      default:
        this.rightContent = startTime;
        break;
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";

@timeout-width: 120px;

@warning-size: 30px;
.work-item {
  .work-item-time {
    .time-start {
      float: right;
    }
  }
  .start-time {
    display: flex;
    align-items: bottom;
    align-items: flex-end;
    min-width: 20px;
    span {
      position: absolute;
      white-space: nowrap;
      .px2rem(right, 30px);
    }
  }
}
</style>
