
<script lang='ts'>
import { Vue, Prop, Component, Watch } from "vue-property-decorator";

import { RendererFormControl, RelevanceFormOptions } from "../../typings";

import { FormControlType, FormHtmlControl } from "../../typings";

import Upload from "./upload.vue";

import CheckboxGroup from "./checkbox-group.vue";
import Dropdown from "./dropdown.vue";

import InputText from "./input-text.vue";
import InputNumber from "./input-number.vue";
import InputDate from "./input-date.vue";
import InputLogic from "./input-logic.vue";
import InputLocation from "./input-location.vue";
import InputDateRange from "./input-date-range.vue";
import InputNumberRange from "./input-number-range.vue";

import FormStaffSelector from "./form-staff-selector.vue";
import ApproveOpinion from "./approve-opinion.vue";
import RelevanceForm from "./relevance-form/relevance-form.vue";
import InputAddress from "./input-address.vue";

import InputSignsture from "./input-signsture/input-signsture.vue";

import InputTextarea from "./input-textarea/input-textarea.vue";

@Component({
  name: "base-control-adapter",
  components: {
    Upload,
    CheckboxGroup,
    Dropdown,
    InputText,
    InputNumber,
    InputDate,
    InputDateRange,
    InputNumberRange,
    InputLogic,
    InputLocation,
    FormStaffSelector,
    ApproveOpinion,
    RelevanceForm,
    InputAddress,
    InputSignsture,
    InputTextarea
  }
  // components: {
  //   Upload: () => import('./upload.vue'),
  //   CheckboxGroup: () => import('./checkbox-group.vue'),
  //   Dropdown: () => import('./dropdown.vue'),
  //   InputText: () => import('./input-text.vue'),
  //   InputNumber: () => import('./input-number.vue'),
  //   InputDate: () => import('./input-date.vue'),
  //   InputDateRange: () => import('./input-date-range.vue'),
  //   InputNumberRange: () => import('./input-number-range.vue'),
  //   InputLogic: () => import('./input-logic.vue'),
  //   InputLocation: () => import('./input-location.vue'),
  //   FormStaffSelector: () => import('./form-staff-selector.vue'),
  //   ApproveOpinion: () => import('./approve-opinion.vue'),
  //   RelevanceForm: () => import('./relevance-form/relevance-form.vue'),
  //   InputAddress: () => import('./input-address.vue'),
  //   InputSignsture: () => import('./input-signsture/input-signsture.vue'),
  //   InputTextarea: () => import('./input-textarea/input-textarea.vue')
  // }
})
export default class BaseControlAdapter extends Vue {
  @Prop()
  control!: RendererFormControl;

  render(h: Function) {
    const control = this.control;

    const type = control.type;

    if (this.control.type === FormControlType.Label) {
      return h("label", [control.controller.value]);
    }

    const opts = {
      props: {
        control: control
      }
    };
    switch (control.type) {
      case FormControlType.Text:
        return h("input-text", opts);
      case FormControlType.Textarea:
        // return h("input-text", opts);
        return h('input-textarea', opts)
        

      case FormControlType.Date:
        return h("input-date", opts);
      case FormControlType.DateRange:
        return h("input-date-range", opts);

      case FormControlType.Number:
        return h("input-number", opts);
      case FormControlType.NumberRange:
        return h("input-number-range", opts);

      case FormControlType.Location:
        return h("input-location", opts);

      case FormControlType.Logic:
        return h("input-logic", opts);

      case FormControlType.Radio:
      case FormControlType.Checkbox:
        return h("checkbox-group", opts);
      case FormControlType.Signature:
        return h("input-signsture", opts);

      case FormControlType.Dropdown:
        return h("dropdown", opts);

      case FormControlType.ApprovalOpinion:
        return h("approve-opinion", opts);

      case FormControlType.Attachment:
      case FormControlType.Image:
        return h("upload", opts);

      // case FormControlType.OwnerId:
      case FormControlType.StaffSelector:
      case FormControlType.StaffMultiSelector:
      case FormControlType.DepartmentSelector:
      case FormControlType.DepartmentMultiSelector:
        return h("form-staff-selector", opts);

      case FormControlType.RelevanceForm:
        return h("relevance-form", opts);
      case FormControlType.Address:
        return h("input-address", opts);

      case FormControlType.Html:
        return this.createHtml(h, control as any);
    }
  }

  createHtml(h: Function, hc: FormHtmlControl) {
    const attrs: any = {};
    hc.attrs.forEach(a => (attrs[a.name] = a.value));
    const domProps = {
      innerHTML: hc.innerHTML
    };
    return h(hc.tagName, {
      attrs,
      domProps
    });
  }
}
</script>

