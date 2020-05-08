
<template>
  <div class="h3-textarea" :class="{'h3-textarea_focus': isFocus, 'disabled': disabled}">
    <a-textarea
      autosize
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @focus="focus"
      @blur="blur"
      @change="onChange"
    ></a-textarea>

    <div>
      <span :class="{ error : length >= maxLength }">{{ length }}</span>
      /{{ maxLength }}
    </div>
  </div>
</template>


<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Inject,
  Model
} from "vue-property-decorator";

import {
  RendererFormControl,
  FormControlType,
  TextOptions
} from "../../typings";

import { TextInputControl } from "../../controls";

import { Input } from "h3-antd-vue";

@Component({
  name: "h3-textarea",
  components: {
    ATextarea: Input.TextArea
  }
})
export default class H3Textarea extends Vue {
  @Prop({
    default: 2000
  })
  maxLength!: number;

  @Prop({
    default: false
  })
  disabled!: boolean;

  @Model("change")
  value!: string;

  @Prop({
    default: ""
  })
  placeholder!: string;

  // @Prop({
  //   default: {
  //     minRows: 1,
  //     maxRows: 5
  //   }
  // })
  // autosize!: { minRows: number; maxRows: number };

  @Prop({
    default: true
  })
  autosize!: boolean;

  isFocus: boolean = false;

  get length() {
    return this.countLengthOf(this.value);
  }

  onChange(evt: Event) {
    const val = (evt.target as HTMLInputElement).value;
    const length = this.countLengthOf(val);
    if (length <= this.maxLength) {
      this.$emit("change", val);
    }
  }

  // countLengthOf(s: string) {
  //   if (!s) {
  //     return 0;
  //   }
  //   const reg = /[\u4e00-\u9fa5]+/;
  //   let result: RegExpExecArray | null;
  //   let len = 0;
  //   while (((result = reg.exec(s)), result !== null)) {
  //     len += result[0].length * 2;
  //     s = s.replace(reg, "");
  //   }
  //   len += s.length;
  //   return len;
  // }
  countLengthOf(s: string) {
    if (!s) {
      return 0;
    }
    return s.length;
  }

  focus() {
    this.isFocus = true;
  }

  blur() {
    this.isFocus = false;
  }
}
</script>

<style lang="less" scoped>
.h3-textarea {
  position: relative;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  width: 100%;
  padding: 0.5px;

  &:hover {
    border-radius: 4px;
    border: 1px solid @primary-color;
  }

  &.disabled:hover{
    border-color: rgb(217, 217, 217);
  }

  & > textarea {
    border: none;
    box-shadow: none;
    overflow-y: auto !important;
  }

  & > div {
    text-align: right;
    color: rgba(0, 0, 0, 0.25);
    bottom: 0;
    padding-right: 12px;
    user-select: none;
    font-size: 12px;

    & > .error {
      color: #f5222d;
    }
  }

  &.disabled > div {
    background: rgb(245, 245, 245);
    cursor: not-allowed;
  }

  &_focus {
    box-shadow: 0px 0px 0px 2px @primary-light-color;
    border-radius: 4px;
    border: 1px solid @primary-color;
  }
}
</style>

