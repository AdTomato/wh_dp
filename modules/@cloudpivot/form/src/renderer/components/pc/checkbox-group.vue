
<template>
  <div :class="{ verticalLayout : (layoutType && !ctrl.readonly), edit : !ctrl.readonly }">
    <template v-if="!ctrl.readonly">
      <a-radio-group
        v-if="isRadio"
        :value="val"
        :options="options"
        :class="{ vertical:isVertical }"
        @change="onRadioChange"
      />
      <a-checkbox-group
        v-else
        :value="val"
        :options="checkboxOptions"
        :class="{ vertical:isVertical }"
        @change="onChange"
      >
      </a-checkbox-group>
    </template>
    <div class="items" v-else>
      <span v-if="isRadio">{{ text }}</span>
      <template v-else>{{ text }}</template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  CheckboxOptions,
  FormControlType
} from "../../typings";

import { CheckboxGroupControl } from "../../controls";

import { Radio, Checkbox } from "h3-antd-vue";

@Component({
  name: "checkbox-group",
  components: {
    ARadioGroup: Radio.Group,
    ACheckboxGroup: Checkbox.Group
  }
})
export default class CheckboxGroup extends CheckboxGroupControl {

  @Inject()
  layoutTypeFn?: () => void;

  get layoutType() {
    if(this.layoutTypeFn){
      return this.layoutTypeFn()
    }
  }

  onChange(value: string[]) {
    const val = value && value.length > 0 ? value.filter(x => !!x) : null;
    this.setValue(val);
    super.resetCheckboxOptionDisabled();
  }

  onRadioChange(evt: MouseEvent) {
    const val = (evt.target as HTMLInputElement).value;
    this.setValue(val);
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-radio-group,
/deep/.ant-checkbox-group {
  &.vertical > label {
    display: block;
  }
}

/deep/.ant-radio-wrapper {
  overflow: hidden;
  line-height: 32px;
  position: relative;
  top: -4px;
  span {
    display: inline-flex;
    white-space: normal;
    position: relative;
    top: -1px;
  }
}

/deep/.ant-checkbox-wrapper{
  line-height: 32px;
  position: relative;
  top: -4px;
  overflow: hidden;
}

// .items > span::after{
//   // margin-right: 0.5em;
//   content: ';'
// }

.verticalLayout {
  margin-left: 12px;
}
</style>

