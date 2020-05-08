
<template>
  
  <a-range-picker
    v-if="!readonly"
    v-model="dates"
    :placeholder="['开始时间','结束时间']"
    style="width:100%"
    @change="onChange"
  ></a-range-picker>

  <div v-else>

    <template v-if="ctrl.value">
      <span>{{ ctrl.value[0] }}</span> ~ <span>{{ ctrl.value[1] }}</span>
    </template>

  </div>

</template>

<script lang="ts">

import { Subscription } from 'rxjs';

import moment from 'moment';

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { DateOptions } from '../../typings';

import { DateInputControl } from '../../controls';

import { ControlPropertyChange,DateControl } from "h3-forms";

import {
  DatePicker
} from 'h3-antd-vue';


@Component({
  name: "input-date-range",
  components: {
    ARangePicker: DatePicker.RangePicker
  }
})
export default class InputDateRange extends DateInputControl {

  dates : moment.Moment[] = [];

  setDates(){
    if(this.ctrl && this.ctrl.value){
      this.dates = this.ctrl.value.map((s:string) => {
        if(s){
          return moment(s);
        }
        return s;
      });
    }else{
      this.dates = [];
    }
  }
  
  setControl() {
    this.setDates();
  }

  handleValueChange(value: any): void {
    this.setDates();
  }

  onChange(dates: moment.Moment[], dateStrings: string[]) {
    this.ctrl.value = dateStrings && dateStrings.length > 0 ? dateStrings : null;
  }

}
</script>

<style lang="less" scoped>
</style>