
<template>
  <div class="field" :class="{ required: ctrl.required }">
    <div class="field__label" :style="style">{{ label }}</div>

    <div class="field__control">
      <pc-input-number
        :control="control"
        :mobile="true"
        @focus="onFocus"
        @blur="onBlur"
        @change="onChange"
      ></pc-input-number>
    </div>

    <i
      class="icon aufont icon-base-close-circle"
      v-show="showClear"
      @click="onClear"
    ></i>
  </div>
</template>

<script lang="ts">
import { Subscription } from "rxjs";

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  NumberOptions,
  NumberFormatType
} from "../../typings";

import { NumberInputControl } from "../../controls";

import PcInputNumber from "../pc/input-number.vue";

import numberFilter from "../number-filter";

import { NumberControl } from "h3-forms";

@Component({
  name: "input-number",
  components: {
    PcInputNumber
  }
})
export default class MobileInputNumber extends NumberInputControl {
  focused = false;

  hasValue = false;

  get showClear() {
    return !this.readonly && this.focused && this.hasValue;
  }

  onFocus() {
    this.focused = true;
    this.onChange();
  }

  onBlur() {
    this.focused = false;
  }

  onChange() {
    const _ctrl = this.ctrl as NumberControl;
    this.hasValue = _ctrl.hasValue;
  }

  onClear() {
    this.ctrl.value = null;
    const input = this.$el.querySelector("input");
    if (input) {
      input.focus();
    }
  }

  // mounted() {
  //   const input = this.$el.querySelector('input');
  //   if(input){
  //     // input.type = "tel";
  //     // input.pattern = "[0-9\\.]*";
  //   }
  // }
}
</script>

<style lang="less" scoped>
/deep/.ant-input-number input {
  color: #333;
  font-size: 15px;
  line-height: 25px;
  width: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

.field > .icon {
  font-size: 16px;
  margin-right: 2px;
  height: 16px;
}
.field.vertical{
  display: block !important;
  .field__label{
    padding: 10px 0;
  }
  //兼容移动端与admin端mobile预览页面 相等高度
  .field__control{
    height: 32px;
  }
  .icon-base-close-circle{
    position: absolute;
    right: 20px;
    bottom: 8px;
  }
}
</style>

