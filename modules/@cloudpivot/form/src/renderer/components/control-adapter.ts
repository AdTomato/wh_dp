
import { Vue, Prop, Component, Inject } from "vue-property-decorator";

import * as typings from "../typings";

import { FormControlType,RendererFormControl } from "../typings";

import { FormControl, FormControlErrorCodes } from "h3-forms";

import { FormRendererHelper } from "./form-renderer-helper";

import { ControlHelper } from "../controls/control-helper";


export default class ControlAdapter extends Vue {
  @Prop()
  control!: RendererFormControl;

  get id() {
    if (this.control.parentKey) {
      return `${this.control.parentKey}-${this.control.key}`;
    }
    return this.control.key;
  }

  get ctrl() {
    return this.control.controller as FormControl<any>;
  }

  get hasError() {
    if (this.ctrl) {
      return this.ctrl.hasError;
    }
    return false;
  }

  get errors() {
    if (this.ctrl) {
      return this.ctrl.errors;
    }
    return [];
  }

  get isSystem() {
    return this.control.type >= FormControlType.SequenceNo
      && this.control.type <= FormControlType.SystemOther
    // && this.control.type !== FormControlType.OwnerId;
  }

  get isTitle() {
    return this.control.type === FormControlType.Title;
  }

  get isDescription() {
    return this.control.type === FormControlType.Description;
  }

  get isStaffSelector() {
    return this.control.type === FormControlType.StaffSelector;
  }

  get isSheet() {
    return this.control.type === FormControlType.Sheet;
  }
  
  get isDropdown() {
    return this.control.type === FormControlType.Dropdown;
  }

  get isReverseRelevance() {
    return this.control.type === FormControlType.ReverseRelevance;
  }

  get isHtml() {
    return this.control.type === FormControlType.Html;
  }

  get show() {
    const visible = this.control.options.visible;
    if (visible === false || visible === 0) {
      return false;
    }
    if (this.ctrl && this.ctrl.display === false) {
      return false;
    }
    return true;
  }

  get required() {
    return this.ctrl && this.ctrl.required;
  }

  get isHigh(){
    const type = this.control.type;

    // 选人控件
    if (type === FormControlType.DepartmentMultiSelector 
      || type === FormControlType.DepartmentSelector
      || type === FormControlType.StaffSelector 
      || type === FormControlType.StaffMultiSelector
      || type === FormControlType.Signature
      || type === FormControlType.Attachment
      || type === FormControlType.Image
    ) {
      return true;
    }
    
    // 只读
    if(this.control.edit === false){
      return false;
    }

    return true;

  }

  get style() {
    const opt = this.control.options;
    if (!opt || !opt.style) {
      return '';
    }
    return opt.style;
  }

  get label() {
    return ControlHelper.getControlLabel(this.control, this.$i18n.locale);
  }
  get tips() {
    let { tips } = this.control.options;
    return tips;
  }
  getErrorMessage(errCode: FormControlErrorCodes) {
    return FormRendererHelper.getErrorMessage(this.control, errCode, this.$i18n.locale);
  }
}