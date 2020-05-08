
<template>
  <h3-radio-list
    v-control-back
    v-if="isRadio"
    showMode="0"
    layout="v"
    :value="val"
    :show="showModal"
    :options="options"
    :class="{radioVertical: layoutType}"
    :required="ctrl.required"
    :editable="!readonly"
    :title="label"
    :labelStyle="styleObj"
    :cancelText="$t('cloudpivot.form.renderer.cancel')"
    :confirmText="$t('cloudpivot.form.renderer.ok')"
    :clearText="$t('cloudpivot.form.renderer.clear')"
    :placeholder="placeholder"
    :notFoundText="$t('cloudpivot.form.renderer.noOptions')"
    @onShow="show"
    @onHide="close"
    @onChange="onChange"
  ></h3-radio-list>

  <h3-checkbox-list
    v-control-back
    v-else
    showMode="0"
    layout="v"
    :show="showModal"
    :value="val"
    :options="options"
    :class="{checkBoxVertical: layoutType}"
    :required="ctrl.required"
    :editable="!readonly"
    :title="label"
    :labelStyle="styleObj"
    :cancelText="$t('cloudpivot.form.renderer.cancel')"
    :okText="$t('cloudpivot.form.renderer.ok')"
    :clearText="$t('cloudpivot.form.renderer.clear')"
    :placeHolder="placeholder"
    :notFoundText="$t('cloudpivot.form.renderer.noOptions')"
    :checkAllText="$t('cloudpivot.form.renderer.checkAll')"
    @onShow="show"
    @onHide="close"
    @onChange="onChange"
    @input="onChange"
  ></h3-checkbox-list>

  <!-- <div class="h3-dropdown">
    <div class="h3-dropdown-title">{{ label }}</div>
    <div><input :value="control.options.value"/></div>
    <span class="h3-dropdown-icon aufontAll h-icon-all-right-o"></span>
  </div>-->
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { H3RadioList, H3CheckboxList } from 'h3-mobile-vue';

import { RendererFormControl, CheckboxOptions, FormControlType } from "../../typings";

import ControlBack from '../../directives/control-back'

import { CheckboxGroupControl } from "../../controls";

@Component({
  name: "checkbox-group",
  components: {
    H3RadioList,
    H3CheckboxList
  },
  directives: {
    ControlBack,
  },
})
export default class CheckboxGroup extends CheckboxGroupControl {

  showModal: boolean = false;

  show() {
    this.showModal = true;
  }
  close() {
    this.showModal = false;
  }

  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType(){
    if(this.layoutTypeFn){
      return this.layoutTypeFn();
    }
  }

  onChange(val: any) {
    if(val){
      if(this.isRadio){
        this.ctrl.value = typeof val === 'string' ? val : val.value;
      }else{
        this.ctrl.value = val.slice();
      }
    }else{
      this.ctrl.value = null;
    }
  }
}
</script>

<style lang="less" scoped>
.h3-dropdown {
  align-items: center;
  display: flex;
  position: relative;
  border-bottom: 1px solid #eee;
  &-title {
    text-align: left;
    color: #666;
  }
  &-icon {
    color: #999;
    position: absolute;
    font-size: 12px;
  }
}
</style>

<style>
.radioVertical .h3-field-icon-wrapper{
  width: 22px;
  height: 22px;
  position: absolute;
  top: 11px;
  right: 15px;
  text-align: center;
  line-height: 22px;
}
.checkBoxVertical .h3-field-icon-wrapper{
  position: absolute !important;
  line-height: 22px !important;
}
.checkBoxVertical .h3-FBH>.h3-FB1,.radioVertical .h3-FBH>.h3-FB1{
  padding-top: 10px !important;
}
</style>

