
<template>
  <h3-field
    v-if="controlOpts.displayMode === 'accurate' && !isEl"
    :required="ctrl.required"
    :readOnly="readonly || readonlyFormula"
    :showIcon="true"
    @contentClick="onClickContent"
    @iconClick="onClickContent"
    :label="label"
    :class="{locationVertical: layoutType}"
    :labelStyle="styleObj"
  >
    <div :class="{'field__control' : !readonly}">
      <span v-if="address" style="color: #333333">{{ address }}</span>
      <span class="placeholder" v-if="!address && !(readonly || readonlyFormula)">{{ placeholder }}</span>
    </div>
    <span
      slot="extra"
      @click.stop="onClickContent"
      class="aufontAll h-icon-all-get-address-o"
    ></span>
  </h3-field>
  <smart-location
    v-else
    :labelStyle="styleObj"
    :title="label"
    :required="ctrl.required"
    :readonly="readonly"
    v-model="val"
    @change="valueChange"
    :range="range"
  />
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl } from "../../typings";

import { FormControlType, LocationOptions } from "../../typings";

import { FormLocationControl } from "../../controls";

import { H3Field } from 'h3-mobile-vue';

import SmartLocation from '../shared/mobile-smart-location/smart-location.vue'

import { FromAddressValueService } from "../../services"

@Component({
  name: "input-location",
  components:{
    H3Field,
    SmartLocation
  }
})
export default class InputLocation extends FormLocationControl {

  onClickContent() {
    if(this.readonly || this.readonlyFormula){
      return false;
    }
    return !this.readonly ? this.onPosition() : this.onNavigation();
  }

  // created() {
  //   debugger
  //   console.log('111111111',this.controlOpts.displayMode);
  // }
  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType(){
    if(this.layoutTypeFn){
      return this.layoutTypeFn();
    }
  }

  get range() {

    let range = 500;
    if(this.controlOpts.range) {

      const rangeMapping:any = {
        '1km': 1000,
        '500m': 500,
        '200m': 200
      };

      range = rangeMapping[this.controlOpts.range];
    }
    return  range;
  }

  onPosition(){
    this.position();
  }
  onNavigation() {
    this.navigation();
  }

  valueChange(val:any) {
    if(val.adcode){
      const value:any = FromAddressValueService.setAddressVal(val.adcode);
      this.ctrl.value = Object.assign(val,value);
    }else{
      this.ctrl.value = null;
    }
  }
}
</script>

<style lang="less" scoped>
.field__control{
  min-height: 10px;
}
</style>
<style>
.locationVertical .h3-field-icon-wrapper{
  width: 22px;
  height: 22px;
  position: absolute;
  bottom: 10px;
  right: 15px;
  text-align: center;
  line-height: 22px;
}
</style>

