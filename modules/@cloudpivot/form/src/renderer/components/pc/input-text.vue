
<template>
  <div>
    <div class="text" v-if="readonly">{{ val }}</div>

    <template v-else>
      <h3-textarea
        v-if="isTextarea"
        v-model="val"
        :placeholder="placeholder"
        :autosize="rows"
        :maxLength="maxLength"
        :disabled="readonlyFormula"
        @change="onChange"
      ></h3-textarea>

      <a-input
        v-else
        v-model="val"
        :placeholder="placeholder"
        :disabled="readonlyFormula"
        @keydown="onKeydown"
        @keyup="onKeyup"
        style="width:100%"
        @blur="onBlur"
        @change="onChange"
      ></a-input>
    </template>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  FormControlType,
  TextOptions
} from "../../typings";

import { TextInputControl } from "../../controls";

import { Input } from "h3-antd-vue";

import H3Textarea from "./h3-textarea.vue";

import MutilText from "../shared/mutil-text.vue";

@Component({
  name: "input-text",
  components: {
    AInput: Input,
    // ATextarea: Input.TextArea,
    H3Textarea,
    MutilText
  }
})
export default class InputText extends TextInputControl {
  onKeydown(evt: KeyboardEvent) {
    const key = evt.key.toLowerCase();
    if (key !== "delete" && key !== "backspace") {
      if (this.ctrl.value && this.ctrl.value.length > this.maxLength) {
        evt.preventDefault();
      }
    }
  }

  onKeyup() {
    if (this.ctrl.value && this.ctrl.value.length > this.maxLength) {
      const val = this.ctrl.value.substr(0, this.maxLength);
      this.setValue(val);
    }
  }

  onBlur() {
    super.validate();
  }

  onChange() {
    const val = this.val.length === 0 ? null : this.val;
    this.setValue(val);
  }
}
</script>

<style lang="less" scoped>
.textarea-warp {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 4px;

  & > textarea {
    border: none;
    box-shadow: none;
  }

  & > div {
    text-align: right;
    color: rgba(0, 0, 0, 0.25);
    bottom: 0;
    padding-right: 12px;
    user-select: none;
    font-size: 13px;

    & > .error {
      color: #f5222d;
    }
  }
}

.text {
  white-space: pre-wrap;
  word-break: break-word;
}
</style>

