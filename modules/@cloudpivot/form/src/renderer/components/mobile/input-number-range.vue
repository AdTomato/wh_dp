<template>
  <div>
    <h3-input
      :value="begin"
      :required="ctrl.required"
      :title="label"
      :placeholder="placeholder"
      type="money"
      :moneyKeyboardAlign="'left'"
      @onChange="onBeginChange"
    ></h3-input>

    <h3-input
      :value="end"
      :required="ctrl.required"
      :title="label"
      :placeholder="placeholder"
      type="money"
      :moneyKeyboardAlign="'left'"
      @onChange="onEndChange"
    ></h3-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  NumberOptions,
  NumberFormatType
} from "../../typings";

import { NumberInputControl } from "../../controls";

import { H3Input } from "h3-mobile-vue";

import PcInputNumber from "../pc/input-number.vue";

@Component({
  name: "input-number-range",
  components: {
    H3Input
  }
})
export default class InputNumberRange extends NumberInputControl {
  get begin() {
    if (this.ctrl.value && this.ctrl.value.length > 1) {
      const val = this.ctrl.value[0];
      if(val !== null){
        return val.toString();
      }
      return '';
    }
  }

  get end() {
    if (this.ctrl.value && this.ctrl.value.length === 2) {
      const val = this.ctrl.value[1];
      if(val !== null){
        return val.toString();
      }
      return '';
    }
  }

  onBeginChange(val: string) {
    const value = Number(val);
    if (!this.ctrl.value || this.ctrl.value.length === 0) {
      this.ctrl.value = [value];
    } else {
      this.ctrl.value.splice(0, 1, value);
    }
  }

  onEndChange(val: string) {
    const value = Number(val);
    if (!this.ctrl.value || this.ctrl.value.length === 0) {
      this.ctrl.value = [null, value];
    } else if (this.ctrl.value.length === 1) {
      this.ctrl.value.push(value);
    } else {
      this.ctrl.value.splice(1, 1, value);
    }
  }
}
</script>

<style lang="less" scoped>
</style>