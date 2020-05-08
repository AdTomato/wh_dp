
<template>
  <div
    class="field relevance-form"
    :class="{ required: ctrl.required }"
  >
    <div class="field__label" :style="style">{{ label }}</div>
    <div class="field__control" @click="onClick">
      <template v-if="name">{{ name }}</template>
      <span v-else-if="isEditState" class="placeholder">{{ placeholder }}</span>
    </div>

    <i v-if="isEditState" class="icon aufontAll h-icon-all-right-o"/>
    <relevance-form-modal
      class="relevance-form-panel"
      v-control-back
      v-transfer-dom
      :value="val"
      :visible="showModal"
      :control="control"
      @change="onChange"
      @back="close"
    ></relevance-form-modal>
    
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { H3Field } from 'h3-mobile-vue';

import { RelevanceFormControl } from "../../../controls";

import RelevanceFormModal from "./relevance-form-modal.vue";

import ControlBack from '../../../directives/control-back';

import TransferDom from '../../../directives/transfer-dom';


@Component({
  name: "relevance-form",
  components: {
    RelevanceFormModal,
    H3Field
  },
  directives: {
    ControlBack,
    TransferDom
  }
})
export default class MobileRelevanceForm extends RelevanceFormControl {

  showModal: boolean = false;

  show() {
    this.showModal = true;
  }
  close() {
    this.showModal = false;
  }

  get val(){
    return this.ctrl.value || {};
  }

  get name() {
    if (!this.ctrl.value) {
      return "";
    }
    console.info(this.ctrl.value, this.getDisplayField)
    return this.parseDisplayFieldValue(this.ctrl.value[this.getDisplayField],this.getDisplayField)
  }

  get isEditState () {
    return !this.readonly || (this.showLink&&this.ctrl.value&&this.ctrl.value.id)
  }

  onClick() {
    if (this.readonly) {
      if(this.showLink){
        super.open();
      }
    }else{
      this.show();
    }
  }

  onChange(val: any) {
    if(val && Object.keys(val).length > 0){
      this.ctrl.value = val;
    }else{
      this.ctrl.value = null;
    }
    this.close();
  }
}
</script>

<style lang="less">
.relevance-form-panel{
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
}
.relevance-form.vertical{
  display: block !important;
  .field__label{
    padding: 10px 0;
  }
  .field__control{
    padding-bottom: 10px;
  }
  .h-icon-all-right-o{
    position: absolute;
    bottom: 14px;
    right: 20px;
  }
}

</style>
