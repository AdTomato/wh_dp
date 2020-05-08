
<template>

  <h3-datetime
    v-control-back
    :title="label"
    :required="ctrl.required"
    :readonly="readonlyFormula || readonly"
    :locale="locale"
    :cancelText="$t('cloudpivot.form.renderer.cancel')"
    :confirmText="$t('cloudpivot.form.renderer.ok')"
    :clearText="$t('cloudpivot.form.renderer.clear')"
    currentText=""
    :format="format"
    :value="val"
    :startDate="min"
    :endDate="max"
    :show="showModal"
    :labelStyle="styleObj"
    :placeholder="placeholder"
    :class="{dataVertical: layoutType}"
    @on-show="show"
    @on-hide="close"
    @on-clear="clearVal"
    @onConfirm="onConfirm"
  ></h3-datetime>

</template>

<script lang="ts">

import { Subscription } from 'rxjs';

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl,FormControlType } from "../../typings";

import { DateInputControl } from '../../controls';

import { H3Input, H3Datetime } from 'h3-mobile-vue';

import ControlBack from '../../directives/control-back'

import { ControlPropertyChange,DateControl } from "h3-forms";

import { dateFormatter } from '../../utils';


@Component({
  name: "input-date",
  components:{
    H3Input,
    H3Datetime
  },
  directives: {
    ControlBack,
  },
})
export default class InputDate extends DateInputControl {
  
  showModal: boolean = false;

  show() {
    this.showModal = true;
  }
  close() {
    this.showModal = false;
  }

  clearVal() {
    this.val =  '';
    this.ctrl.value = null;
  }

  onConfirm(value: any) {
    const _this = this;
    // iOS兼容
    value = value.replace(/-/g, "/");
    if(/^\d{4}\/\d{2}$/.test(value)){
      value += '/01';
    }
    _this.ctrl.value = new Date(value);
  }

  val: any = "";

  min: any = "";

  max: any = "";

  subscription?: Subscription

  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType(){
    if(this.layoutTypeFn){
      return this.layoutTypeFn();
    }
  }

  getCalendarContainer(trigger: any) {
    return trigger;
  }

  dateFormat(val : Date){
    return dateFormatter(val,'YYYY-MM-DD HH:mm:ss');
  }
  
  setMax(max : Date | null){
    if(max){
      // max.setHours(23);
      // max.setMinutes(59);
      // max.setSeconds(59);
      // max.setMilliseconds(999);

      // 当最大值只有年月日时，无法通过校验，需要设为当天最大值
      if(this.format.indexOf('HH') > -1){
        max = this.dateCtrl.max;
        if(max && max.getHours() === 0 && max.getMinutes() === 0 && max.getMilliseconds() === 0){
          max.setHours(23);
          max.setMinutes(59);
          max.setSeconds(59);
          max.setMilliseconds(999);
        }
      }
    }
  }

  setMin(min : Date | null){
    if(min){
      if(this.format.indexOf('HH') > -1){
        min = this.dateCtrl.min;
        if(min && min.getHours() === 0 && min.getMinutes() === 0 && min.getMilliseconds() === 0){
          min.setHours(0);
          min.setMinutes(0);
          min.setSeconds(0);
          min.setMilliseconds(0);
        }
      }
    }
  }


  setControl() {
    this.initMinAndMax();
    const _ctrl = this.ctrl as DateControl;
    console.log(this.ctrl)

    if (!_ctrl) {
      return;
    }

    if (_ctrl.value) {
      this.val = this.dateFormat(_ctrl.value);
    }else{
      this.val =  '';
    }
    
    if (_ctrl.min) {
      this.setMin(_ctrl.min as any);
      this.min = this.dateFormat(_ctrl.min);
    }
    
    if (_ctrl.max) {
      this.setMax(_ctrl.max as any);
      this.max = this.dateFormat(_ctrl.max);
    }

    
    if(this.subscription){
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }

    this.subscription = _ctrl.propertyChange.subscribe((change: ControlPropertyChange) => {
      switch (change.name) {
        case "value":
          if (change.value) {
            this.val = this.dateFormat(change.value);
          } else {
            this.val = "";
          }
          break;
        case "min":
          if (change.value) {
            const _min = change.value as Date;
            this.setMin(_min);
            this.min = this.dateFormat(_min);
          } else {
            this.min = "";
          }
          break;
        case "max":
          if (change.value) {
            const _max = change.value as Date;
            this.setMax(_max);
            this.max = this.dateFormat(_max);
          } else {
            this.max = "";
          }
          break;
      }
    });
  }

  initMinAndMax() {
    const min = this.controlOpts.minDate;
    if (!min) {
      this.min = "1900-01-01";
    } else {
      if (min.indexOf("{") === -1) {
        this.min = min;
      }
    }

    const max = this.controlOpts.maxDate;
    if (!max) {
      this.max = "2101-01-01";
    } else {
      if (max.indexOf("{") === -1) {
        this.max = max;
      }
    }
  }
  
  destroyed() {
    super.destroyed();

    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }

}
</script>

<style lang="less">
.h3-field-box .h3-PR{
  text-align: left;
}
.dataVertical .h3-field-icon-wrapper{
  width: 22px;
  height: 22px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  text-align: center;
  line-height: 22px;
}
</style>

