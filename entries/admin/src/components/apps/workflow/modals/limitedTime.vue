<template>
  <a-modal
    title="限时设置"
    width="480px"
    :visible="value"
    :cancelText="'取消'"
    :okText="'保存'"
    @cancel="closeModal"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
  >
    <!-- 限时时间 -->
    <div class="time-wrap">
      <span class="time-text">限时时间</span>
      <a-input-number
        :min="0"
        :precision="0"
        v-model="allowedTime.dayValue"
      />
      <span>天</span>
      <a-input-number
        :min="0"
        :max="23"
        :precision="0"
        v-model="allowedTime.hourValue"
      />
      <span>小时</span>
      <a-input-number
        :min="0"
        :max="59"
        :precision="0"
        v-model="allowedTime.minuteValue"
      />
      <span>分</span>
      <a-input-number
        :min="0"
        :max="59"
        :precision="0"
        v-model="allowedTime.secondValue"
      />
      <span>秒</span>
    </div>
    <!-- 超时预警1 -->
    <div class="time-wrap">
      <span class="time-text long-text">超时预警1</span>
      <a-input-number
        :min="0"
        :precision="0"
        v-model="timeoutWarning1.dayValue"
      />
      <span>天</span>
      <a-input-number
        :min="0"
        :max="23"
        :precision="0"
        v-model="timeoutWarning1.hourValue"
      />
      <span>小时</span>
      <a-input-number
        :min="0"
        :max="59"
        :precision="0"
        v-model="timeoutWarning1.minuteValue"
      />
      <span>分</span>
      <a-input-number
        :min="0"
        :max="59"
        :precision="0"
        v-model="timeoutWarning1.secondValue"
      />
      <span>秒</span>
    </div>
    <!-- 超时预警2 -->
    <div class="time-wrap last">
      <span class="time-text long-text">超时预警2</span>
      <a-input-number
        :min="0"
        :precision="0"
        v-model="timeoutWarning2.dayValue"
      />
      <span>天</span>
      <a-input-number
        :min="0"
        :max="23"
        :precision="0"
        v-model="timeoutWarning2.hourValue"
      />
      <span>小时</span>
      <a-input-number
        :min="0"
        :max="59"
        :precision="0"
        v-model="timeoutWarning2.minuteValue"
      />
      <span>分</span>
      <a-input-number
        :min="0"
        :max="59"
        :precision="0"
        v-model="timeoutWarning2.secondValue"
      />
      <span>秒</span>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

@Component({
  name: 'LimitedTime'
})
export default class LimitedTime extends Vue {
  @Prop() value!: boolean;
  @Prop() timeItem!: any;
  // 限时时间
  allowedTime:any = {
    dayValue: '',
    hourValue: '',
    minuteValue: '',
    secondValue: ''
  };
  // 超时预警时间1
  timeoutWarning1:any = {
    dayValue: '',
    hourValue: '',
    minuteValue: '',
    secondValue: ''
  };
  // 超时预警时间2
  timeoutWarning2:any = {
    dayValue: '',
    hourValue: '',
    minuteValue: '',
    secondValue: ''
  };

  // 数据渲染
  dataMounted(value:any) {
    this.allowedTime = this.msecToTime(value.allowedTime);
    this.timeoutWarning1 = this.msecToTime(value.timeoutWarning1);
    this.timeoutWarning2 = this.msecToTime(value.timeoutWarning2);
  }
  // 点击关闭事件
  closeModal() {
    this.$emit('close');
  }
  // 点击保存事件
  handleOk() {
    const allowedMesc = this.timeSpanToMsec(this.allowedTime);
    const timeoutWarning1Mesc = this.timeSpanToMsec(this.timeoutWarning1);
    const timeoutWarning2Mesc = this.timeSpanToMsec(this.timeoutWarning2);
    const time = {
      allowedTime: allowedMesc,
      timeoutWarning1: timeoutWarning1Mesc,
      timeoutWarning2: timeoutWarning2Mesc
    };
    if (!allowedMesc && !timeoutWarning1Mesc && !timeoutWarning2Mesc) {
      this.$emit('submit', time);
      this.closeModal();
      return;
    }
    if (!allowedMesc) {
      this.$message.warning('超时预警需要根据限时时间计算，请填写限时时间！');
      return;
    }
    if (allowedMesc < timeoutWarning1Mesc || allowedMesc < timeoutWarning2Mesc || timeoutWarning1Mesc < timeoutWarning2Mesc) {
      this.$message.warning('限时设置不合理，要求限时时间>超时预警1>超时预警2！');
      return;
    }
    this.$emit('submit', time);
    this.closeModal();
  }
  // 时间段对象转毫秒数
  timeSpanToMsec(time:any) {
    if (time) {
      const days = parseInt(time.dayValue ? time.dayValue : 0, 10) * 1000 * 60 * 60 * 24;
      const hours = parseInt(time.hourValue ? time.hourValue : 0, 10) * 1000 * 60 * 60;
      const minutes = parseInt(time.minuteValue ? time.minuteValue : 0, 10) * 1000 * 60;
      const seconds = parseInt(time.secondValue ? time.secondValue : 0, 10) * 1000;
      return days + hours + minutes + seconds;
    }
    return 0;
  }
  // 毫秒数转为时间对象
  msecToTime(msec:number) {
    let timeObj = {
      dayValue: '',
      hourValue: '',
      minuteValue: '',
      secondValue: ''
    };
    if (msec) {
      const days = Math.floor(msec / (1000 * 60 * 60 * 24));
      const hours = Math.floor((msec % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((msec % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((msec % (1000 * 60)) / 1000);
      timeObj = {
        dayValue: `${days}`,
        hourValue: `${hours}`,
        minuteValue: `${minutes}`,
        secondValue: `${seconds}`
      };
    }
    return timeObj;
  }

  @Watch('value')
  onValueChange(v:any) {
    if (v) {
      this.dataMounted(this.timeItem);
    }
  }

  @Watch('timeItem', { deep: true })
  onTimeItemChange(v:any) {
    this.dataMounted(v);
  }
}
</script>
<style lang="less">
.time-wrap{
  margin-bottom: 16px;
  .time-text{
    margin-right: 14px;
  }
  span.long-text{
    margin-right: 6px;
  }
  .ant-input-number{
    width: 60px;
    margin: 0 8px 0 5px;
    .ant-input-number-handler-wrap{
      width: 18px;
      .ant-input-number-handler-up-inner,.ant-input-number-handler-down-inner{
        right: 2px;
      }
    }
    input{
      font-size: 14px;
    }
  }
  &.last{
    margin-bottom: 0;
  }
}
</style>
