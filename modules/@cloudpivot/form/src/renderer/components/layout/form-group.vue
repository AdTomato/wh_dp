
<template>
  <h3-panel
    v-show="display"
    :title="label"
    :tips="tips"
    :collapsible="true"
    :align="align"
    :vertical="layoutType"
    :collapsed="collapse"
    :labelStyle="style"
    :iconRight="true"
  >
    <slot></slot>
  </h3-panel>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  GroupTitleOptions,
  DesignLayoutControl,
  RendererFormControl
} from "../../typings";

import common from '@cloudpivot/common';

import { BaseControl } from "../../controls";

import { FormRendererHelper } from "../form-renderer-helper";

import {
  FormControl,
  Control,
  ControlPropertyChange,
  PropertyNames
} from "h3-forms";

@Component({
  name: "form-group",
  components: {
    H3Panel: common.components.pc.Panel,
  }
})
export default class FormGroup extends BaseControl<GroupTitleOptions> {
  display = true;

  taskRef: any;

  get align() {
    return this.controlOpts.align;
  }

  get collapse() {
    const expand = this.controlOpts.expand;
    if (typeof expand === "boolean") {
      return !expand;
    }
    return false;
  }
  get tips() {
    let { tips } = this.control.options;
    return tips;
  }

  @Inject()
  layoutTypeFn?: () => void;

  get layoutType() {
    if(this.layoutTypeFn){
      return this.layoutTypeFn()
    }
  }

  setControl() {
    if (this.controlOpts.displayFormula) {
      const ctrl = this.findController(this.control.key);

      if (ctrl) {
        this.display = ctrl.display;
        this.subscribePropertyChange((change: ControlPropertyChange) => {
          if (change.name === PropertyNames.Display) {
            this.display = change.value;
          }
        });
      }
    }else{
      this.display = !this.allChildrenHiddn();
    }
  }

  allChildrenHiddn(){
    const children = ((this.control as any) as DesignLayoutControl).children;
    if (children && children.length > 0) {
        let formControls: RendererFormControl[] = [];
        FormRendererHelper.findFormControl(children, formControls);
        const result = formControls
          .every(c => {
            let ctrl = c.controller;
            if(!ctrl){
              ctrl = this.findController(c.key);
            }
            if(ctrl){
              return !ctrl.display;
            }
            return false;
          });
        return result;
    }
    return true;
  }

  mounted() {
      this.taskRef = setInterval(() => {
        this.display = !this.allChildrenHiddn();
      }, 500);
  }

  destroyed() {
    clearInterval(this.taskRef);

    super.destroyed();
  }
}
</script>

<style lang="less">
// .h3-panel > .h3-panel-header {
//   height: 56px;
//   line-height: 40px;

//   & > span {
//     font-size: 18px;
//     font-weight: 500;
//     color: rgba(0, 0, 0, 0.85);
//   }
// }
</style>

