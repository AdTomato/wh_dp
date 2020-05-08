
<template>
  <div v-if="!readonly">
    <a-date-picker
      v-if="!showMonth"
      v-model="val"
      :format="format"
      :showTime="showTime"
      :disabledDate="disabledDate"
      :placeholder="placeholder"
      :disabled="readonlyFormula"
      :getCalendarContainer="getPopupContainer()"
      @change="onChange"
      style="width:100%"
    ></a-date-picker>
    <a-month-picker
      v-else
      v-model="val"
      :format="format"
      :disabledDate="disabledDate"
      :placeholder="placeholder"
      :disabled="readonlyFormula"
      :getCalendarContainer="getPopupContainer()"
      @change="onChange"
      style="width:100%"
    />
  </div>
  <span v-else>{{ text }}</span>
</template>


<script lang="ts">
import { Subscription } from "rxjs";

import moment from "moment";

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl, FormControlType } from "../../typings";

import { DateInputControl } from "../../controls";

import { ControlPropertyChange, DateControl } from "h3-forms";

import { DatePicker } from "h3-antd-vue";

import { dateFormatter } from "../../utils/date-formatter";

@Component({
  name: "input-date",
  components: {
    ADatePicker: DatePicker,
    AMonthPicker: DatePicker.MonthPicker
  }
})
export default class InputDate extends DateInputControl {
  val: any = "";

  text = "";

  private _min!: any;

  private _max!: any;

  subscription?: Subscription;

  getCalendarContainer(trigger: any) {
    return trigger;
  }

  setMax(){
    if(this._max){
      this._max.hours(23);
      this._max.minutes(59);
      this._max.seconds(59);
      this._max.milliseconds(999);
      // 当最大值只有年月日时，无法通过校验，需要设为当天最大值
      if(this.format.indexOf('HH') > -1){
        const max = this.dateCtrl.max;
        if(max && max.getHours() === 0 && max.getMinutes() === 0 && max.getMilliseconds() === 0){
          max.setHours(23);
          max.setMinutes(59);
          max.setSeconds(59)
          max.setMilliseconds(999);
        }
      }
    }
  }

  setMin(){
    if(this._min){
      this._min.hours(0);
      this._min.minutes(0);
      this._min.seconds(0);
      this._min.milliseconds(0);
    }
  }

  setControl() {
    this.initMinAndMax();

    const _ctrl = this.ctrl as DateControl;

    if (!_ctrl) {
      return;
    }

    if (_ctrl.value) {
      this.val = moment(_ctrl.value);
      this.text = dateFormatter(_ctrl.value, this.format);
    } else {
      this.val = this.text = "";
    }

    if (_ctrl.min) {
      this._min = moment(_ctrl.min);
      this.setMin();
    }

    if (_ctrl.max) {
      this._max = moment(_ctrl.max);
      this.setMax();
    }

    this.unsubscribe();

    this.subscription = _ctrl.propertyChange.subscribe(
      (change: ControlPropertyChange) => {
        switch (change.name) {
          case "value":
            if (change.value) {
              this.text = dateFormatter(change.value, this.format);
              // this.val = moment(new Date(this.text));
              // const date = new Date(this.text);
              this.val = moment(change.value);
              // if(_ctrl && _ctrl.value) {
              //   _ctrl.value.setTime(date.getTime());
              // }
              // this.text = dateFormatter(change.value, this.format);
            } else {
              this.val = "";
            }
            break;
          case "min":
            if (change.value) {
              this._min = moment(change.value);
              this.setMin();
            } else {
              this._min = "";
            }
            break;
          case "max":
            if (change.value) {
              this._max = moment(change.value);
              this.setMax();
            } else {
              this._max = "";
            }
            break;
        }
      }
    );
  }

  initMinAndMax() {
    const min = this.controlOpts.minDate;
    if (!min) {
      this._min = moment("1900-01-01");
    } else {
      if (min.indexOf("{") === -1) {
        this._min = moment(min);
      }
    }

    let max = this.controlOpts.maxDate;
    if (!max) {
      this._max = moment("2101");
    } else {
      if (max.indexOf("{") === -1) {
        max += " 23:59:59";
        this._max = moment(max);
      }
    }
  }

  onChange(date: moment.Moment, dateString: string) {
    // dateString 是格式化的，使用格式化后的日期字符串构建日期对象，可以过滤掉格式外多余的时分秒值
    const val = dateString ? moment(dateString).toDate() : null;
    this.setValue(val);
  }

  disabledDate(val: moment.Moment) {
    if (!val) {
      return false;
    }

    if (this._min) {
      if (val.valueOf() < this._min.valueOf()) {
        return true;
      }
    }

    if (this._max) {
      if (val.valueOf() > this._max.valueOf()) {
        return true;
      }
    }
    return false;
  }

  unsubscribe() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

  destroyed() {
    super.destroyed();

    this.unsubscribe();
  }
}
</script>

<style lang="less" scoped>
</style>

