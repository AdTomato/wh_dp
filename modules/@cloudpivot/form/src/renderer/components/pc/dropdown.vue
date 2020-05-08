
<template>
  <!-- <div v-if="!readonly"  @click="getOPt"> -->
    <!--  -->
     <!-- :placeholder="emptyValue || ''" -->
    <a-select
      v-if="!readonly"
      :value="val"
      :mode="mode"
      @change="onChange"
      style="width:100%"
      :allowClear="true"
      :disabled="readonlyFormula"
      :getPopupContainer="getPopupContainer()"
      
      @focus="getOPt"
    >
      <a-select-option v-if="hasEmpty" key>{{ emptyValue }}</a-select-option>

      <a-select-option
        v-for="(opt,index) in options"
        :key="opt"
        :disabled="disableds[index]"
      >
        <a-tooltip :title="opt">
          <div class="h3-from-select-opinion">{{ opt }}</div>
        </a-tooltip>
      </a-select-option>
    </a-select>
  <!-- </div> -->
  

  <div class="items" v-else>
    <span v-if="!multiple">{{ text }}</span>

    <template v-else>
      <!-- <span v-for="(x, index) in val" :key="index">{{ x }}</span> -->
      {{ text }}
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  DropdownOptions,
  FormControlType
} from "../../typings";

import { DropdownControl } from "../../controls";

import { H3Dropdown } from "@h3/awesome-ui";

// import { Select, Tooltip } from "@h3/antd-vue";

import { Select, Tooltip } from "h3-antd-vue";

@Component({
  name: "dropdown",
  components: {
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Select.Option
  }
})
export default class Dropdown extends DropdownControl {

  onChange(val : any[]) {
    // debugger;
    console.log(val, this.placeholder, this.hasEmpty, this.ctrl, this.emptyValue)
    if(val && val.length > 0){
      this.setValue(Array.isArray(val) ? val.slice() : [val]);
    }else{
      this.ctrl.value = null;
    }

    if (!this.multiple) {
      return;
    }
    super.resetDisableds();
  }

  getOPt() {
    super.getOptions()
  }

  clearOption(change:any) {
    this.options = [];
    this.ctrl.value = null;
  }

}
</script>

<style lang="less">
.h3-from-select-opinion {
  display: inline-block;
  overflow: hidden;
  width: 100%;
  text-overflow: ellipsis;
}
.ant-tooltip {
    max-width: 800px;
}

.items{
  word-break: break-all;
}

// .items > span::after {
//   // margin-right: 0.5em;
//   content: ";";
// }

</style>

