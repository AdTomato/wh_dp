
<template>
  <h3-textarea
    v-if="!readonly && isTextarea"
    v-model="val"
    :title="label"
    :required="ctrl.required"
    :maxLength="maxLength"
    :placeholder="placeholder"
    :readonly="readonlyFormula || readonly"
    :error="ctrl.hasError"
    :labelStyle="styleObj"
    :rows="4"
    autoHeight
    @onChange="onChangeTextarea"
    ref="h3Textarea"
  ></h3-textarea>

  <h3-input
    v-else-if="!readonly && !isTextarea"
    v-model="val"
    :required="ctrl.required"
    :title="label"
    :placeholder="placeholder"
    :readonly="readonlyFormula || readonly"
    :clear="true"
    type="text"
    :maxLength="maxLength"
    :error="ctrl.hasError"
    :labelStyle="styleObj"
    @onBlur="onBlur"
    @onChange="onChange"
  ></h3-input>

  <div class="field" v-else>
    <div class="field__label top" :style="style">{{ label }}</div>
    <div class="field__control">
      <mutil-text v-if="isLangText" :text="val"></mutil-text>
      <div
        v-else 
        v-html="val" 
        class="editor-htm"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  TextOptions,
  FormControlType
} from "../../typings";

import { TextInputControl } from "../../controls";

import { H3Input, H3Textarea } from "h3-mobile-vue";

import MutilText from "../shared/mutil-text.vue";

@Component({
  name: "input-text",
  components: {
    H3Input,
    H3Textarea,
    MutilText
  }
})
export default class InputText extends TextInputControl {
  onBlur() {
    super.validate();
  }

  onChange() {
    this.ctrl.value = this.val.length === 0 ? null : this.val;
  }
  onChangeTextarea() {
    let el = (this.$refs.h3Textarea as any).$el;
    let h = el.offsetHeight;
    el.style.height = `${el.offsetHeight}px`;
    this.ctrl.value = this.val.length === 0 ? null : this.val;
    setTimeout(() => {
      el.style.height = "auto";
    }, 16.66666666);
  }
}
</script>

<style lang="less" scoped>
.field__control {
  padding: 0.5em 0;
}

/deep/.h3-input-control textarea {
  min-height: 1.7em;
}
.editor-html {
  line-height: normal !important;
  word-break: break-all;
  line-height: unset;
}
</style>

