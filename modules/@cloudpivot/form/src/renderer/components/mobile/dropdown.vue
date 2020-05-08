
<template>
  <h3-checkbox-list
    v-control-back
    showMode="0"
    :show="showModal"
    v-if="multiple"
    :value="val"
    :options="options"
    :class="{dropDownVertical: layoutType}"
    :required="ctrl.required"
    :editable="!(readonlyFormula || readonly)"
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
    @onFocus="getOPt"
    @onClear="onChange"
  ></h3-checkbox-list>

  <h3-radio-list
    v-control-back
    showMode="0"
    v-else
    :show="showModal"
    :value="val"
    :options="options"
    :required="ctrl.required"
    :class="{dropDownVertical: layoutType}"
    :editable="!(readonlyFormula || readonly)"
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
    @onFocus="getOPt"
    @onClear="onChange"
  ></h3-radio-list>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { H3RadioList, H3CheckboxList } from "h3-mobile-vue";
import {
  RendererFormControl,
  DropdownOptions,
  FormControlType
} from "../../typings";

import { DropdownControl } from "../../controls";

import ControlBack from "../../directives/control-back";

@Component({
  name: "dropdown",
  components: {
    H3RadioList,
    H3CheckboxList
  },
  directives: {
    ControlBack
  },
  mixins: []
})
export default class Dropdown extends DropdownControl {
  showModal: boolean = false;

  show() {
    this.showModal = true;
    this.getOPt();
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
    if (val) {
      this.ctrl.value = this.multiple ? val.slice() : val.value;
    } else {
      this.ctrl.value = null;
    }
  }

  handleValueChange(value: any[]): void {
    if(Array.isArray(value)){
      value = value.filter(x => !!x);
    }
    super.handleValueChange(value);
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

.dropDownVertical .h3-field-icon-wrapper{
  width: 22px;
  height: 22px;
  position: absolute;
  bottom: 11px;
  right: 15px;
  text-align: center;
  line-height: 22px;
}
</style>

