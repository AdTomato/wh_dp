
import {
    RendererFormControl,
    StyleControlOptions,
    FormControlType,
    CreatedTimeOptions
  } from "../typings";
  
  import { BaseControl } from "./base-control";
  
  import { dateFormatter } from '../utils';

export class SystemControl extends BaseControl<StyleControlOptions> {

    get text() {
        let val = this.ctrl.value;
        const ct = this.control.type;
        if (
          ct === FormControlType.CreatedTime ||
          ct === FormControlType.ModifiedTime
        ) {
          if (!val) {
            val = new Date();
          }
          const format = (this.controlOpts as CreatedTimeOptions).format;
          return dateFormatter(val, format);
        }
    
        if (Array.isArray(val)) {
          return val.length > 0 ? val[0].name : "";
        }else if (val && typeof val === "object") {
          return val.name;
        } else {
          return val || this.$t('cloudpivot.form.runtime.biz.systemValue');
        }
    }

    get tips() {
      let { tips } = this.control.options;
      return tips;
    }
  }