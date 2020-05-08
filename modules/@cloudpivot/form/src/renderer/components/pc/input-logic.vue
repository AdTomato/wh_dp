
<template>
  <a-switch
    v-if="!readonly"
    :disabled="readonly"
    :checked="ctrl.value"
    @change="onChange"
  />
  <div v-else>
    <span v-if="ctrl.value"> {{ $t('cloudpivot.form.renderer.sheet.logicTrueValue') }} </span>
    <span v-else> {{ $t('cloudpivot.form.renderer.sheet.logicFalseValue') }} </span>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl, LogicOptions } from "../../typings";

import { BaseControl } from "../../controls";

import {
  Switch
} from 'h3-antd-vue';

@Component({
  name: "input-logic",
  components:{
    ASwitch: Switch
  }
})
export default class InputLogic extends BaseControl<LogicOptions> {
  
  onChange(evt : boolean){
    debugger;
      if(this.ctrl){
        // this.ctrl.value = evt;
        this.setValue(evt);
      }
  }

}
</script>

<style lang="less" scoped>
</style>

