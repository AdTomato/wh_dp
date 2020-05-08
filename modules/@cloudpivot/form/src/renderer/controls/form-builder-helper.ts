import {
  RendererFormControl,
  FormControlType,
  FormSheet,
  StaffSelectorOptions
} from "../typings";

import * as typings from "../typings";

import * as forms from "h3-forms";

import { FormControlValueService, FormControlVerifyService } from "../services";
import { StaffSelectorControl } from "./staff-selector-control";

const isEmpty = (v: any) => v === undefined || v === null; // || v === '';

export abstract class FormBuilderHelper {
  static getControlValue(control: RendererFormControl) {
    let val: any = undefined;

    if (!isEmpty(control.value)) {
      val = control.value;
    }
    // else if (control.options && !isEmpty(control.options.defaultValue)) {
    //     switch (control.type) {
    //         case FormControlType.Date:
    //             val = FormControlValueService.transDefaultValue(control.options.defaultValue, control);
    //             break;

    //         default:
    //             val = control.options.defaultValue;
    //             break;
    //     }

    // }

    if (!isEmpty(val)) {
      val = FormControlValueService.convert(
        control.type,
        val,
        control.options.multi
      );
      val = Array.isArray(val) ? val.slice() : val;
    }

    // if (isEmpty(val)) {
    //     val = FormBuilderHelper.defaultValueOf(control);
    // }

    return val;
  }

  static defaultValueOf(control: RendererFormControl) {
    let val: any = null;

    if (control.type === FormControlType.Sheet) {
      const sheet = (control as any) as FormSheet;

      if (sheet.options.rows > 0) {
        val = new Array(Number(sheet.options.rows)).fill(0).map(() => {
          const row: any = {};
          sheet.columns.forEach(
            col => (row[col.key] = FormBuilderHelper.defaultValueOf(col as any))
          );
          return row;
        });
      }
    } else if (control.options && !isEmpty(control.options.defaultValue)) {
      switch (control.type) {
        case FormControlType.Date:
          val = FormControlValueService.transDefaultValue(
            control.options.defaultValue,
            control
          );
          break;

        default:
          val = control.options.defaultValue;
          break;
      }

      if (!isEmpty(val)) {
        val = FormControlValueService.convert(
          control.type,
          val,
          control.options.multi
        );
        val = Array.isArray(val) ? val.slice() : val;
      }
    }

    if (isEmpty(val)) {
      if (
        control.type === FormControlType.StaffSelector ||
        control.type === FormControlType.StaffMultiSelector ||
        control.type === FormControlType.DepartmentSelector ||
        control.type === FormControlType.DepartmentMultiSelector
      ) {
        const dvt = (control.options as StaffSelectorOptions).defaultValueType;
        if (dvt === typings.StaffSelectorValueType.Originator) {
          const user = StaffSelectorControl.service.getCurrentUser();
          if (user) {
            val = [user];
          }
        } else if (dvt === typings.StaffSelectorValueType.OriginatorDept) {
          const dept = StaffSelectorControl.service.getCurrentUserDept();
          if (dept) {
            val = [dept];
          }
        }
      }
    }

    return val;

    // return FormControlValueService.defaultValueOf(control.type, control.options.multi);
    // return null;
  }

  static buildOptionsOf(control: any) {
    if (control.type === FormControlType.Sheet) {
      const sheet = control as FormSheet;
      const cols = sheet.columns.map(c => {
        const col = FormBuilderHelper.buildFormControlOptionsOf(c) as any;
        col.key = c.key;
        delete col.value;
        return col;
      });

      cols.push({
        key: "id",
        type: forms.FormControlType.Radio,
        options: {
          display: false
        }
      });

      const opts: any = {
        columns: cols
      };

      if (sheet.options.visible === false) {
        opts.display = false;
      } else {
        if (sheet.options.displayFormula) {
          opts.display = sheet.options.displayFormula;
        }
      }

      return opts;
    } else {
      return FormBuilderHelper.buildFormControlOptionsOf(control);
    }
  }

  static buildFormControlOptionsOf(control: any) {
    let value: any;

    if (control.options.computeFormula) {
      value = control.options.computeFormula;
    } else {
      value = FormBuilderHelper.getControlValue(control);
    }

    const options: any = {
      value,
      validateTriggerType: forms.ValidateTriggerType.Blur,
      readonly: !control.edit
    };

    if (control.options.visible === false) {
      options.display = false;
    } else {
      if (control.options.displayFormula) {
        options.display = control.options.displayFormula;
      }
    }

    if (control.required) {
      options.required = true;
    } else if (control.options.requiredFormula) {
      if (control.options.requiredFormula === "true") {
        options.required = true;
      } else {
        options.required = control.options.requiredFormula;
      }
    }

    if (control.options.minDate) {
      options.min = control.options.minDate;
    }

    if (control.options.maxDate) {
      options.max = control.options.maxDate;
    }

    if (control.options.regexp) {
      let r = control.options.regexp;
      r = r.substr(1, r.length - 2);
      options.pattern = new RegExp(r);
    }

    if (control.options.mappings) {
      let obj: any = {};
      control.options.mappings
        .split(";")
        .filter((x: string) => x)
        .forEach((x: string) => {
          const idx = x.indexOf(":");
          const source = x.substring(0, idx);
          const target = x.substring(idx + 2, x.length - 1);
          if (obj[source]) {
            if (Array.isArray(obj[source])) {
              obj[source].push(target);
            } else {
              obj[source] = [obj[source], target];
            }
          } else {
            obj[source] = target;
          }
        });
      options.mappings = obj;
    }

    // if (control.options.sheetMappings) {
    //     let obj: any = options.mappings || {};
    //     control.options.sheetMappings.split(';')
    //         .filter((x: string) => x)
    //         .forEach((x: string) => {
    //             const idx = x.indexOf(':');
    //             obj[x.substring(0, idx)] = x.substring(idx + 2, x.length - 1);
    //         });
    //     options.mappings = obj;
    // }

    let type: forms.FormControlType;
    switch (control.type) {
      case FormControlType.Date:
        type = forms.FormControlType.Date;
        // 日期控件 如果不可填 则不做校验 因为 会设置当天校验项
        control.writable !== false &&
          FormControlVerifyService.verifyDate(
            control.options.verifyFormula,
            options,
            control.options
          );
        break;
      case FormControlType.Number:
        type = forms.FormControlType.Number;
        options.max = 999999999999;
        FormControlVerifyService.verifyNum(
          control.options.verifyFormula,
          options,
          control.options
        );
        break;
      case FormControlType.Text:
        type = forms.FormControlType.Text;
        break;
      case FormControlType.Checkbox:
        type = forms.FormControlType.Select;
        break;
      case FormControlType.Dropdown:
        if (control.options.multi) {
          type = forms.FormControlType.Select;
        } else {
          type = forms.FormControlType.Radio;
        }
        break;
      case FormControlType.Image:
        type = forms.FormControlType.Select;
        FormControlVerifyService.verifyImageNumber(
          control.options.number,
          options,
          control.options
        );
        break;
      default:
        type = forms.FormControlType.Radio;
        break;
    }
    return {
      type,
      options
    };
  }

  /**
   * 生成控件class
   * @param controlType
   */
  static getClass(controlType: typings.FormControlType): string {
    switch (controlType) {
      case typings.FormControlType.Image:
        return "input-image";
      case typings.FormControlType.Title:
        return "form-title";
      case typings.FormControlType.Sheet:
        return "form-sheet";
      case typings.FormControlType.Dropdown:
        return "form-dropdown";
      case typings.FormControlType.Radio:
        return "form-radio";
      case typings.FormControlType.Checkbox:
        return "form-checkbox";
      default:
        return "";
    }
  }
}
