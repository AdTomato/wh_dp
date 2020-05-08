import { Vue, Prop, Watch, Provide } from "vue-property-decorator";

import {
  RendererControl,
  RendererFormControl,
  FormControlType,
  DataItemLike
} from "../typings";

import { FormRendererHelper } from "./form-renderer-helper";
import { FormBuilderHelper } from "../controls/form-builder-helper";
import { ControlHelper } from "../controls/control-helper";
import { FormGroup, FormControlErrorCodes } from "h3-forms";
import {
  FormControlValueService,
  FormControlOptionsService
} from "../services";
import * as schema from "../../schema";

import { FormRendererLike } from "../form-renderer-like";

export class FormRenderer extends Vue implements FormRendererLike {
  @Prop()
  controls!: RendererControl[];

  @Prop({ default: () => [] })
  dataItems!: DataItemLike[];

  private _controller?: FormGroup;

  private _formControlMap: {
    [key: string]: RendererFormControl;
  } = {};

  get controller() {
    return this._controller;
  }

  get formControlMap() {
    return this._formControlMap;
  }

  findFormControls(keys?: string[]) {
    return Object.keys(this._formControlMap)
      .filter(k => {
        if (keys) {
          return keys.indexOf(k) > -1;
        }
        return true;
      })
      .map(k => this._formControlMap[k]);
  }

  // get formControls() {
  //     let formControls: RendererFormControl[] = [];
  //     FormRendererHelper.findFormControl(this.controls, formControls);
  //     return formControls;
  // }
  @Watch("controls", {
    immediate: true
  })
  setControls(controls: RendererControl[], oldControls?: RendererControl[]) {
    if (!controls || controls === oldControls) {
      return;
    }

    let formControls: RendererFormControl[] = [];
    FormRendererHelper.findFormControl(controls, formControls);

    // const owner = formControls.find(c => c.type === FormControlType.OwnerId);
    // if (owner) {
    //     this.convertOwner(owner);
    // }

    this._controller = FormRendererHelper.buildController(controls);

    const map: any = {};
    formControls.filter(c => c.key).forEach(c => (map[c.key] = c));
    this._formControlMap = map;
  }

  convertOwner(owner: RendererFormControl) {
    owner.type = FormControlType.StaffSelector;
    owner.required = true;

    const options = FormControlOptionsService.buildFor(
      owner.type,
      owner.options
    );
    if (options) {
      options.defaultValueType = schema.StaffSelectorValueType.Originator;
      owner.options = options;
    }
  }

  render(h: Function, mobile: boolean) {
    if (!this.controls || !this.controls.length) {
      return;
    }
    // debugger
    const children = this.controls.map(c =>
      FormRendererHelper.render(h, c, mobile, this)
    );
    const tabs = this.findFormControls().find(
      c =>
        c.type === FormControlType.ReverseRelevance ||
        c.options.listDisplayMode === "tabs"
    );
    if (tabs) {
      return h("div", children);
    } else {
      return h("div", [h("div", this.$slots.default), ...children]);
    }
  }

  validate(excludes?: string[]) {
    if (!this.controller) {
      return true;
    }

    return this.controller.validate(excludes);
  }

  getErrors() {
    if (!this.controller) {
      return null;
    }

    return this.controller.errors;
  }

  getErrorMessage(
    controlId: string,
    errCode: FormControlErrorCodes,
    parentId?: string
  ) {
    if (!controlId) {
      return "";
    }

    let control = this._formControlMap[parentId || controlId];
    let parent = control;
    if (!control) {
      return "";
    }

    if (parentId) {
      const col = ((parent as any) as schema.FormSheet).columns.find(
        c => c.key === controlId
      );
      if (!col) {
        return "";
      }

      control = col as any;
    }

    const locale = this.$i18n.locale;

    let msg =
      FormRendererHelper.getErrorMessage(control, errCode, locale) || "";

    if (parentId) {
      msg = ControlHelper.getControlLabel(parent, locale) + " " + msg;
    }

    return msg;
  }

  getValue() {
    if (this.controller) {
      return this.controller.value;
    }
  }

  reset() {
    this.findFormControls().forEach(c => {
      if (c.controller) {
        const value = FormBuilderHelper.getControlValue(c);
        c.controller.value = value;
      }
    });
  }

  clear() {
    this.findFormControls().forEach(c => {
      if (c.controller) {
        c.controller.value = null;
      }
    });
  }

  edit(keys?: string[]) {
    this.setWritable(true, keys);
  }

  readonly(keys?: string[]) {
    this.setWritable(false, keys);
  }

  private setWritable(edit: boolean, keys?: string[]) {
    this.findFormControls(keys)
      .filter(c => !FormRendererHelper.isSystem(c.type))
      .forEach(control => {
        if (control.controller && control.controller.disabled) {
          return;
        }
        if (control.type === FormControlType.Sheet) {
          control.edit = edit;
        } else {
          if (control.writable === true && control.controller) {
            // control.edit = edit;
            control.controller.readonly = !edit;
          }
        }
      });
  }
}
