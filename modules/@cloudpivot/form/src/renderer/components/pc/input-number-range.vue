
<template>
  <div class="number">
    <template v-if="!readonly">
      <a-input-number
        style="width:40%"
        :value="begin"
        :placeholder="placeholder"
        @change="onBeginChange"
      ></a-input-number>
      <span class="separate">~</span>
      <a-input-number
        style="width:40%"
        :value="end"
        :placeholder="placeholder"
        @change="onEndChange"
      ></a-input-number>
    </template>

    <div v-else>
      <template v-if="ctrl.value">
        <span>{{ ctrl.value[0] }}</span> ~
        <span>{{ ctrl.value[1] }}</span>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { NumberOptions, NumberFormatType } from "../../typings";

import { NumberInputControl } from "../../controls";

import {
  InputNumber
} from 'h3-antd-vue';

@Component({
  name: "input-number-range",
  components: {
    AInputNumber: InputNumber
  }
})
export default class NumberRangeInput extends NumberInputControl {

  get begin() {
    if (this.ctrl.value && this.ctrl.value.length > 1) {
      return this.ctrl.value[0];
    }
  }

  get end() {
    if (this.ctrl.value && this.ctrl.value.length === 2) {
      return this.ctrl.value[1];
    }
  }


  onBeginChange(value: number) {
    if (!this.ctrl.value || this.ctrl.value.length === 0) {
      this.ctrl.value = [value];
    } else {
      this.ctrl.value.splice(0, 1, value);
      this.ctrl.value = this.ctrl.value.slice();
    }
  }

  onEndChange(value: number) {
    if (!this.ctrl.value || this.ctrl.value.length === 0) {
      this.ctrl.value = [null, value];
    } else if (this.ctrl.value.length === 1) {
      this.ctrl.value.push(value);
      this.ctrl.value = this.ctrl.value.slice();
    } else {
      this.ctrl.value.splice(1, 1, value);
      this.ctrl.value = this.ctrl.value.slice();
    }
  }

}
</script>

<style lang="less" scoped>
.number {
  .separate {
    line-height: 32px;
    display: inline-block;
    margin: 0px 10px;
  }
}
</style>

