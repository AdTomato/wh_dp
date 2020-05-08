<template>
  <div @click="goForm">
    <base-item
      class="work-item"
      :title="workitem.instanceName"
      :summary="summary"
      :time="stayTime"
      :avatar="workitem.imgUrl"
      :username="workitem.originatorName"
      :avatarPlacehold="true"
      :isShowUrged="workitem.urgeCount > 0"
    >
      <div class="item-status" slot="right">
        <img
          v-if="status"
          :class="classname"
          :src="status ? require(`../assets/images/${status}.png`):''"
        >
      </div>
    </base-item>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import BaseItem from './base-item.vue';

import { mobileHome }  from '@cloudpivot/api';


@Component({
  name: 'WorkItem',
  components: {
    BaseItem
  }
})
export default class WorkItem extends Vue {
  @Prop() workitem!: mobileHome.Workitem;

  status: string = '';

  classname: string = '';

  stayTime: string = '';

  stayTimeArray:Array<number> = [];

  get summary(){
    if(this.$i18n) {
      const locale:string = this.$i18n.locale as string;
      return this.$i18n.locale === 'zh' ?  this.workitem.activityName : this.workitem.name_i18n[locale];
    }
    return '';
  }

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
        this.stayTime = `${this.$t('cloudpivot.flowCenter.mobile.timeOut')} ${this.getTimerString(getTimerString)}`;
        // if (day > 0) {
        //   this.stayTime = `已超时${day}天${hour}小时`;
        // } else {
        //   this.stayTime = `已超时${hour}小时${min}分钟`;
        // }
        break;
      case 'RED':
      case 'ORANGE':
        this.stayTime = ` ${this.getTimerString(getTimerString)} ${this.$t('cloudpivot.flowCenter.mobile.timeoutLater')}`;
        // if (day > 0) {
        //   this.stayTime = `${day}天${hour}小时后超时`;
        // } else {
        //   this.stayTime = `${hour}小时${min}分钟超时`;
        // }
        break;
      default:
        this.stayTime = ` ${this.$t('cloudpivot.flowCenter.mobile.haveWaitFor')} ${this.getTimerString(getTimerString)}`;
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
        str += ` ${res} ${this.$t('cloudpivot.flowCenter.mobile.days')}`;
      }
      if (index === 1 && res > 0) {
        str += ` ${res} ${this.$t('cloudpivot.flowCenter.mobile.hours')}`;
      }
      if (index === 2 && res > 0) {
        str += ` ${res} ${this.$t('cloudpivot.flowCenter.mobile.minutes')}`;
      }
    });
    if (count === 0) {
      return this.$t('cloudpivot.flowCenter.mobile.lessOneMinute').toString();
    }
    return str;
  }

  getTimerStr(number: number, type: string) {
    if (!number) return '';
    let str = '';
    switch (type) {
      case 'day':
        str = `${number}${this.$t('cloudpivot.flowCenter.mobile.days')}`;
        break;
      case 'hour':
        str = `${number}${this.$t('cloudpivot.flowCenter.mobile.hours')}`;
        break;
      case 'min':
        str = `${number}${this.$t('cloudpivot.flowCenter.mobile.minutes')}`;
        break;
      default:
        break;
    }
  }

  goForm() {
    this.$emit('openForm');
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
    const locale:string = this.$i18n.locale as string;
    this.status = [
      locale === 'zh' ? 'timeout' : 'timeout-en',
      'warning-red',
      'warning-orange',
      '', // 正常
      locale === 'zh' ? 'pending' : 'pending-en',
      locale === 'zh' ? 'complete' : 'complete-en',
      locale === 'zh' ? 'draft' : 'draft-en',
      locale === 'zh' ? 'closure' : 'closure-en',
    ][randomIdx];
    this.classname = randomIdx > 0 && randomIdx < 4 ? 'warning' : 'status';
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
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
