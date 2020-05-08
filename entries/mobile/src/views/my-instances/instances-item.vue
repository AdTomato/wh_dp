<template>
  <base-item
    @click="goForm"
    class="work-item"
    :title="workitem.instanceName"
    :summary="workitem.activityName"
  >
    <!-- <div class="start-time" slot="right">
      <span>{{ workitem.startTime }}</span>
    </div> -->
    <span slot="time" class="work-item-time">{{ time }} <span class="time-start">{{ rightContent }}</span></span>
  </base-item>
</template>
<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

import BaseItem from '../home/items/base-item.vue';

@Component({
  name: 'instancesItem',
  components: {
    BaseItem
  }
})
export default class InstancesItem extends Vue {
  @Prop() workitem!: Index.Workitem;

  status: string = '';

  rightContent: string = '';

  time: string = '';

  goForm() {
    this.$router.push({
      name: 'form-detail',
      query: {
        // workitemId: this.workitem.id,
        workflowInstanceId: this.workitem.id,
        return: this.$route.fullPath
      }
    });
  }

  formatTimeStr() {
    let day: number = 0;
    let hour: number = 0;
    let min: number = 0;
    if (this.workitem.stayTime) {
      const { stayTime } = this.workitem;
      day = Math.floor(stayTime / (24 * 60 * 60 * 1000));
      hour = Math.floor(stayTime % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
      min = Math.floor(stayTime % (24 * 60 * 60 * 1000) % (60 * 60 * 1000) / (60 * 1000));
    }
    if (day > 0) {
      return `${day}天${hour}小时`;
    }
    return `${hour}小时${min}分钟`;
  }

  beforeMount() {
    const timeStr:string = this.formatTimeStr();
    const { state, finishTime, startTime } = this.workitem;
    this.time = state === 'COMPLETED' ? `耗时：${timeStr}` : `已用时：${timeStr}`;
    switch (state) {
      case 'COMPLETED':
        this.rightContent = `完成时间：${finishTime}`;
        break;
      case 'CANCELED':
        this.rightContent = `作废时间：${finishTime}`;
        break;
      default:
        this.rightContent = startTime;
        break;
    }
  }
}
</script>
<style lang="less" scoped>

@import '~@cloudpivot/common/styles/mixins.less';

@timeout-width: 120px;

@warning-size: 30px;
.work-item {
  .work-item-time{
    .time-start{
      float: right;
    }
  }
  .start-time {
    display: flex;
    align-items:bottom;
    align-items: flex-end;
    min-width: 20px;
    span{
      position: absolute;
      white-space : nowrap;
      .px2rem(right, 30px);
    }
  }
}
</style>
