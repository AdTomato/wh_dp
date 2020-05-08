
<template>

  <h3-input
    v-model="value"
    :required="ctrl.required"
    :title="label"
    :placeholder="placeholder"
    :readonly="readonly"
    moneyKeyboardAlign="left"
    :floater="floater"
    :currency="currency"
    :percent="percent"
    :isToKBit="isToKBit"
    :clear="true"
    :labelStyle="styleObj"
    type="money"
    @onChange="onChange"
  ></h3-input>

</template>

<script lang="ts">

import { Subscription } from 'rxjs';

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl, NumberOptions,NumberFormatType } from "../../typings";

import { NumberInputControl } from "../../controls";

import { H3Input } from 'h3-mobile-vue';

import numberFilter from "../number-filter";

import { NumberControl } from 'h3-forms';

@Component({
  name: "input-number",
  components:{
    H3Input
  },
  filters: {
    number: numberFilter
  }
})
export default class InputNumber extends NumberInputControl {

  value = '';

  floater: number = 0;

  currency: string = '';

  percent: boolean = false;

  isToKBit: boolean = false;

  subscription?: Subscription

  setControl() {
    const _ctrl = this.ctrl as NumberControl;

    if(_ctrl.hasValue){
      this.value = (_ctrl.value as any).toString();
    }

    if(this.subscription){
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }

    this.subscription = _ctrl.valueChange.subscribe(change => {
      this.value = _ctrl.hasValue ? (_ctrl.value as any).toString() : '';
    });
  }

  mounted() {
    const type = this.control.options.format;
    
    switch(type) {
      case NumberFormatType.Tenths:
        this.floater = 1;
        this.isToKBit = true;
        return;
      case NumberFormatType.Decimal:
        this.floater = 2;
        this.isToKBit = true;
        return;
      case NumberFormatType.Ratio:
        this.percent = true;
        return;
      case NumberFormatType.Ratio2:
        this.percent = true;
        this.floater = 1;
        return;
      case NumberFormatType.Ratio3:
        this.percent = true;
        this.floater = 2;
        return;
      case NumberFormatType.CurrencyRMB:
        this.isToKBit = true;
        this.currency = '￥';
        return;
      case NumberFormatType.CurrencyDollar:
        this.isToKBit = true;
        this.currency = '$';
        return;
      case NumberFormatType.CurrencyEuro:
        this.isToKBit = true;
        this.currency = '€';
        return;
      case NumberFormatType.CurrencyHK:
        this.isToKBit = true;
        this.currency = 'HK$';
        return;
    }

  }

  onChange(val:string){
    this.ctrl.value = val === '' ? undefined : Number(val);
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

<style lang="less" scoped>
</style>

