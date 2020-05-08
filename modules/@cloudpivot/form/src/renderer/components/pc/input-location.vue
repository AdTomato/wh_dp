
<template>
  <SmartLocation
    v-if="!readonly"
    v-model="val"
    :vid="control.key"
    @ok="valueChange"
    :showTip="controlOpts.displayMode === 'accurate'"
    :placeholder="placeholder"
    :disabled="readonlyFormula"
    :initMap="initMap"
  ></SmartLocation>

  <div v-else>{{ address }}</div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl } from "../../typings";

import { FormControlType, LocationOptions } from "../../typings";

import SmartLocation from "../shared/smart-location/index.vue";

import { FormLocationControl } from "../../controls";

import { FromAddressValueService } from "../../services";

@Component({
  name: "input-location",
  components: {
    SmartLocation
  }
})
export default class InputLocation extends FormLocationControl {
  get initMap() {
    return FormLocationControl.service.initMap;
  }

  valueChange(val:any) {
    if(val.adcode){
      const value:any = FromAddressValueService.setAddressVal(val.adcode);
      // this.ctrl.value = Object.assign(this.val,value);
      this.setValue(Object.assign(this.val,value));
    }else{
      this.ctrl.value = null;
    }
  }
}
</script>

<style lang="less" scoped>
</style>

