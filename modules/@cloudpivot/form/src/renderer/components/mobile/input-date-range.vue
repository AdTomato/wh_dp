
<template>
  <div>
    <!-- :value="ctrl.value" -->
    <h3-datetime
      v-control-back
      :title="beginLabel"
      :required="ctrl.required"
      :readonly="readonly"
      :locale="locale"
      :cancelText="$t('cloudpivot.form.renderer.cancel')"
      :confirmText="$t('cloudpivot.form.renderer.ok')"
      :clearText="$t('cloudpivot.form.renderer.clear')"
      currentText
      :format="format"
      :value="begin"
      :startDate="control.options.minDate"
      :endDate="control.options.maxDate"
      :show="showModals[0]"
      @on-show="show(0)"
      @on-hide="close(0)"
      @onConfirm="(value) => onConfirm(0,value)"
      @on-clear="clearVal(0)"
    ></h3-datetime>

    <h3-datetime
      v-control-back
      :title="endLabel"
      :required="ctrl.required"
      :readonly="readonly"
      :locale="locale"
      :cancelText="$t('cloudpivot.form.renderer.cancel')"
      :confirmText="$t('cloudpivot.form.renderer.ok')"
      :clearText="$t('cloudpivot.form.renderer.clear')"
      currentText
      :format="format"
      :value="end"
      :startDate="control.options.minDate"
      :endDate="control.options.maxDate"
      :show="showModals[1]"
      @on-show="show(1)"
      @on-hide="close(1)"
      @onConfirm="(value) => onConfirm(1,value)"
      @on-clear="clearVal(1)"
    ></h3-datetime>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl, FormControlType } from "../../typings";

import { DateInputControl } from "../../controls";

import { H3Input, H3Datetime } from "h3-mobile-vue";

import { dateFormatter } from '../../utils';

import ControlBack from "../../directives/control-back";

@Component({
  name: "input-date-range",
  components: {
    H3Input,
    H3Datetime
  },
  directives: {
    ControlBack
  }
})
export default class InputDateRange extends DateInputControl {
  showModals = [false, false];

  show(index: number) {
    this.showModals.splice(index, 1, true);
  }

  close(index: number) {
    this.showModals.splice(index, 1, false);
  }

  onConfirm(index: number, value: string) {
    const vals = this.ctrl.value.map((x: any) => x);
    vals[index] = value;
    this.ctrl.value = vals;
  }

  get begin() {
    if (this.ctrl.value && this.ctrl.value.length > 1) {
      return this.formatDate(this.ctrl.value[0]);
    }
    return "";
  }

  get end() {
    if (this.ctrl.value && this.ctrl.value.length === 2) {
      return this.formatDate(this.ctrl.value[1]);
      // return dateFormatter(this.ctrl.value[1],'YYYY-MM-DD');
      // return this.ctrl.value[1];
    }
    return "";
  }

  get beginLabel() {
    return this.control.options.name + '开始';
  }

  get endLabel() {
    return this.control.options.name + '结束';
  }

  formatDate(val:any) {
    if(typeof val === 'string'){
      return val;
    }else if(val instanceof Date){
      return dateFormatter(val,'YYYY-MM-DD');
    }
  }

  clearVal(index:number) {
    // debugger;
    this.ctrl.value[index] = '';
    this.ctrl.value = [...this.ctrl.value];
    // this.val =  '';
    // this.ctrl.value = null;
  }
  
}
</script>

<style lang="less" scoped>
</style>

