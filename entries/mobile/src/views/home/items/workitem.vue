<template>
  <div @click="goForm">
    <base-item
      class="work-item"
      :title="workitem.instanceName"
      :summary="workitem.activityName"
      :time="stayTime"
      :avatar="workitem.imgUrl"
      :username="workitem.originatorName"
      :avatarPlacehold="true"
    >
      <div class="item-status" slot="right">
        <img
          :class="classname"
          v-if="status"
          :src="status ? require(`@/assets/images/${status}.png`):''"
        >
      </div>
    </base-item>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseItem from './base-item.vue';
import Home from '@/views/home/index.vue';

@Component({
  name: 'WorkItem',
  components: {
    BaseItem
  }
})
export default class WorkItem extends Vue {
  @Prop() workitem!: Index.Workitem;

  status: string = '';

  classname: string = '';

  stayTime: string = '';

  stayTimeArray:Array<number> = [];

  setTimeType() {
    let day: number = 0;
    let hour: number = 0;
    let min: number = 0;
    if (this.workitem.stayTime) {
      const { stayTime } = this.workitem;
      const { remainingTime } = this.workitem;
      if (this.workitem.workItemTimeoutStatus === 'RED' || this.workitem.workItemTimeoutStatus === 'ORANGE') {
        day = Math.floor(remainingTime / (24 * 60 * 60 * 1000));
        hour = Math.floor(remainingTime % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        min = Math.floor(remainingTime % (24 * 60 * 60 * 1000) % (60 * 60 * 1000) / (60 * 1000));
      } else {
        day = Math.floor(stayTime / (24 * 60 * 60 * 1000));
        hour = Math.floor(stayTime % (24 * 60 * 60 * 1000) / (60 * 60 * 1000));
        min = Math.floor(stayTime % (24 * 60 * 60 * 1000) % (60 * 60 * 1000) / (60 * 1000));
      }
    }
    const getTimerString:Array<number> = [day, hour, min];
    switch (this.workitem.workItemTimeoutStatus) {
      case 'TIMEOUT':
        this.stayTime = `已超时${this.getTimerString(getTimerString)}`;
        // if (day > 0) {
        //   this.stayTime = `已超时${day}天${hour}小时`;
        // } else {
        //   this.stayTime = `已超时${hour}小时${min}分钟`;
        // }
        break;
      case 'RED':
      case 'ORANGE':
        this.stayTime = `${this.getTimerString(getTimerString)}后超时`;
        // if (day > 0) {
        //   this.stayTime = `${day}天${hour}小时后超时`;
        // } else {
        //   this.stayTime = `${hour}小时${min}分钟超时`;
        // }
        break;
      default:
        this.stayTime = `已等待${this.getTimerString(getTimerString)}`;
        // if (day > 0) {
        //   this.stayTime = `已等待${day}天${hour}小时`;
        // } else {
        //   this.stayTime = `已等待${hour}小时${min}分钟`;
        // }
        break;
    }
  }

  getTimerString(list: Array<number>): string {
    let str = '';

    let count = 0;
    list.forEach((res:number, index:number) => {
      count += res;
      if (index === 0 && res > 0) {
        str += `${res}天`;
      }
      if (index === 1 && res > 0) {
        str += `${res}小时`;
      }
      if (index === 2 && res > 0) {
        str += `${res}分钟`;
      }
    });
    if (count === 0) {
      return '时间小于1分钟';
    }
    return str;
  }

  getTimerStr(number: number, type: string) {
    if (!number) return '';
    let str = '';
    switch (type) {
      case 'day':
        str = `${number}天`;
        break;
      case 'hour':
        str = `${number}小时`;
        break;
      case 'min':
        str = `${number}分钟`;
        break;
      default:
        break;
    }
  }

  goForm() {
    console.log(this.workitem);
    this.$router.push({
      name: 'form-detail',
      query: {
        workitemId: this.workitem.id,
        workflowInstanceId: this.workitem.instanceId,
        return: this.$route.fullPath
      }
    });
  }

  beforeMount() {
    this.setTimeType();
    let randomIdx: number = 3;
    switch (this.workitem.workItemTimeoutStatus) {
      case 'TIMEOUT':
        randomIdx = 0;
        break;
      case 'RED':
        randomIdx = 1;
        break;
      case 'ORANGE':
        randomIdx = 2;
        break;
      default:
        randomIdx = 3;
        break;
    }
    this.status = [
      'timeout',
      'warning-red',
      'warning-orange',
      '', // 正常
      'pending',
      'complete',
      'draft',
      'closure'
    ][randomIdx];
    this.classname = randomIdx > 0 && randomIdx < 4 ? 'warning' : 'status';
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/mixins.less';
@timeout-width: 120px;
@timeout-height: 96px;
@warning-size: 30px;
.work-item {
  .item-status {
    .px2rem(margin-left, @horizontal-padding-sm);
    .px2rem(width, @timeout-width);
    .status {
      .px2rem(width, @timeout-width);
      .px2rem(height, @timeout-height);
    }
    .warning {
      .px2rem(height, @warning-size);
      .px2rem(width, @warning-size);
    }
  }
}
</style>
