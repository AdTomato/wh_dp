
<template>
  <iphone-x v-if="mobile && isPreview">
    <mobile-form-renderer :controls="controls" :formControls="formControls"></mobile-form-renderer>
  </iphone-x>

  <mobile-form-renderer v-else-if="mobile" :controls="controls" :formControls="formControls"></mobile-form-renderer>

  <div v-else class="smart-form">
    <div>
      <pc-form-renderer ref="formRenderer" :class="{'has-form-border': preview.borderMode === 'open'}" :controls="controls" :formControls="formControls"></pc-form-renderer>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Provide } from "vue-property-decorator";

// import MobileFormRenderer from "./form-renderer/mobile-form-renderer.vue";
// import PcFormRenderer from "./form-renderer/pc-form-renderer.vue";
import MobileFormRenderer from "@cloudpivot/form/src/renderer/components/mobile-form-renderer.vue";

import PcFormRenderer from "@cloudpivot/form/src/renderer/components/pc-form-renderer.vue";

import IphoneX from "./iphone-x.vue";

import axios from "axios";

import {
  FormControl,
  FormControlType,
  FormSheet
} from "@cloudpivot/form/schema";

import { schema } from "@cloudpivot/form";

import {
  RendererControl,
  RendererFormControl,
  DesignLayoutControl,
  RendererLayoutControl
} from "@cloudpivot/form/schema";

import { FormRendererHelper } from "@cloudpivot/form/src/renderer/components/form-renderer-helper";

import { FormBuilder, FormGroup, Control } from "h3-forms";

import { TemplateOptions, TemplateControl } from "@/template/template";

export interface PreviewOptions {
  controls: { [key: string]: FormControl };

  layout: string[][];

  borderMode: string;

  layoutType: string;
}

@Component({
  name: "smart-form",
  components: {
    MobileFormRenderer,
    PcFormRenderer,
    IphoneX
  }
})
export default class SmartForm extends Vue {
  @Prop()
  template!: TemplateOptions;

  @Prop()
  preview!: PreviewOptions;

  @Prop()
  mobile!: boolean;

  controls: RendererControl[] = [];

  formControls: any[] = [];

  private _controller?: FormGroup;

  private _proxy?: any;

  private isPreview = true;

  private _formObject?: any;

  @Provide()
    layoutTypeFn() {
      return (
        this.preview &&
        this.preview.layoutType === "vertical"
      );
    }

  /**
   * 表单预览
   */
  @Watch("preview", {
    immediate: true
  })
  setPreview(opts: PreviewOptions) {
    if (!opts || !opts.controls) {
      return;
    }

    const controls = FormRendererHelper.convertDesign(
      JSON.parse(JSON.stringify(opts.controls)),
      opts.layout
    );

    const formControls: any[] = [];
    FormRendererHelper.findFormControl(controls, formControls);
    FormRendererHelper.mergeValue(formControls, {}, true);

    this.controls = controls;
    this.formControls = formControls;
    // const reverseRelevances = formControls.filter(c => c.type === schema.FormControlType.ReverseRelevance && c.options.listDisplayMode === schema.ListDispalyMode.Tabs);
    this.edit();
  }

  @Watch("template", {
    immediate: true
  })
  run(tpl: TemplateOptions) {
    // debugger;
    if (!tpl || !tpl.template) {
      return;
    }

    this.isPreview = false;
    const controls = FormRendererHelper.convertTemplate(tpl.template);

    FormRendererHelper.mergeValue(controls as any[], {}, true);

    this.controls = controls;
  }

  edit() {
    setTimeout(() => {
      const renderer = this.$refs.formRenderer as any;
      if (renderer) {
        renderer.edit();
      }
    }, 1000);
  }

  destroyed() {}
}
</script>

<style lang="less">
@import "./mobile.less";
</style>

<style lang="less" scoped>
.smart-form {
  text-align: left;
}
/deep/.field__label {
  width: 102px;

  &.top {
    padding-top: 0.4em;
    align-items: flex-start !important;
  }
}

/deep/.field__control {
  color: rgba(0, 0, 0, 0.85);
}

/deep/.ant-row-flex {
  .field.system .field__control {
    padding-left: 5px;
  }

  .field.system {
    padding-left: 0;
    padding-right: 0;
    .field__label {
      flex-grow: 0;
      max-width: none;
      margin-right: 0;
      margin-left: 8px;
    }
  }

  & > .ant-col:first-child > .field.system {
    .field__label {
      min-width: 1em;
      width: auto;
      margin-right: 0;
      justify-content: flex-start;
      flex-grow: 0 !important;
    }
  }

  & > .ant-col:last-child > .field.system {
    .field__label {
      flex-grow: 0;
      margin-right: 0;
      max-width: none;
    }

    .field__control {
      flex-grow: 0;
      flex-shrink: 0;
      justify-content: flex-end;
    }
  }
}
</style>
