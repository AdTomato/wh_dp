import { Subscription } from "rxjs";

import { Vue, Watch, Prop, Inject } from "vue-property-decorator";

import * as typings from "../typings";

import {
  FormControl,
  Control,
  ControlValueChange,
  ControlPropertyChange,
  FormGroup,
  FormSheet,
  PropertyNames
} from "h3-forms";

import { RendererFormControl, DataItemLike } from "../typings";

import { ControlHelper } from "./control-helper";
import {
  FormControlType,
  DataItemType,
  OperatorService,
  DateItemOperatorType
} from "../../schema";

export abstract class BaseControl<
  T extends typings.FormControlOptions
> extends Vue {
  @Prop()
  readonly control!: RendererFormControl;

  styleObj: any = {};

  get id() {
    if (this.control.parentKey) {
      return `${this.control.parentKey}-${this.control.key}`;
    }
    return this.control.key;
  }

  get ctrl() {
    if (!this.control.controller) {
      if (!this.control.parentKey) {
        const _ctrl = this.findController(this.control.key);
        this.$set(this.control, "controller", _ctrl);
        // this.$set(this.control, "edit", _ctrl.readonly === false);
        // this.control.edit = _ctrl.readonly === false;
      }
    }
    return this.control.controller as Control;
  }

  get readonly() {
    // return this.control.edit === false;
    if (this.ctrl) {
      return !!this.ctrl.readonly;
    }
    return false;
  }

  get controlOpts(): T {
    return this.control.options as T;
  }

  get style(): string {
    return this.controlOpts.style || "";
  }

  get label() {
    return ControlHelper.getControlLabel(this.control, this.$i18n.locale);
  }

  get locale() {
    return this.$i18n.locale || "zh";
  }

  get placeholder() {
    // var aa = this.locale;
    if (this.controlOpts.placeholder) {
      return this.controlOpts.placeholder;
    }

    switch (this.control.type) {
      case FormControlType.Text:
      case FormControlType.Textarea:
      case FormControlType.Number:
        return this.$t("cloudpivot.form.renderer.peleseInput");

      case FormControlType.Date:
      case FormControlType.StaffSelector:
      case FormControlType.StaffMultiSelector:
      case FormControlType.DepartmentSelector:
      case FormControlType.DepartmentMultiSelector:
      case FormControlType.Dropdown:
      case FormControlType.Checkbox:
      case FormControlType.Radio:
      case FormControlType.Address:
      case FormControlType.Location:
      case FormControlType.RelevanceForm:
        return this.$t("cloudpivot.form.renderer.peleseSelect");
    }

    return "";
  }

  get readonlyFormula() {
    if (this.controlOpts.readonlyFormula) {
      return this.controlOpts.readonlyFormula;
    }
  }

  @Inject()
  findController!: (key: string) => Control;

  @Inject()
  getController!: () => FormGroup;

  @Inject()
  getFormControls!: (keys?: string[]) => RendererFormControl[];

  @Inject()
  getScrollEl!: () => HTMLDivElement;

  @Inject()
  valChange!: (key: string, fun: Function) => void;

  @Inject()
  getDataItem!: (key: string, parentKey?: string) => DataItemLike;

  setControl?(): void;

  onChangeSubscription?: Subscription;

  propChangeSubscription?: Subscription;

  valueChangeSubscription: Subscription | null = null;

  onChangeFn: Function | null = null;

  handleValueChange?(value: any): void;

  getPopupContainer() {
    return (triggerNode: any) => {
      if (this.getScrollEl) {
        const scrollEl = this.getScrollEl();
        if (scrollEl) {
          return scrollEl;
        }
      }
      return triggerNode.parentNode;
    };
  }

  getThisProxy() {
    return this.getController().children;
  }

  setValue(value: any) {
    // this.ctrl;
    // this.$set(this.control.controller, 'value', value);
    this.ctrl.value = value;
  }

  @Watch("control", {
    immediate: true
  })
  onControlChange(c: RendererFormControl, oldControl: RendererFormControl) {
    // 防止 this.$set(this.control, 'controller', _ctrl) 时再次触发change
    if (c === oldControl) {
      return;
    }

    if (this.setControl) {
      this.setControl();
    }

    if (this.style) {
      this.style
        .trim()
        .split(";")
        .forEach(s => {
          let [key, value] = s.trim().split(":");
          this.styleObj[key] = value;
        });
    } else {
      this.styleObj = {};
    }

    this.subscribeValueChange();

    // const opts = this.controlOpts as any;
    // if (opts.onChange) {
    //     const _ctrl = this.ctrl as FormControl<any>;
    //     if (!this.onChangeSubscription) {
    //         const onChange = new Function('value', 'oldValue', 'form', opts.onChange);
    //         // const _this = this;
    //         const func = (change: ControlValueChange) => {
    //             const proxy = this.getThisProxy()
    //             onChange.call(proxy, change.value, change.oldValue, proxy);
    //         };
    //         this.onChangeSubscription = _ctrl.valueChange.subscribe(func);
    //     }
    // }
  }

  subscribeValueChange() {
    const ctrl = this.ctrl as FormControl<any>;
    if (!ctrl || !ctrl.valueChange) {
      return;
    }

    this.unsubscribeValueChange();

    this.valueChangeSubscription = ctrl.propertyChange.subscribe(change => {
      switch (change.name) {
        case PropertyNames.Value:
          this.emitControlOnChange(change);

          if (this.handleValueChange) {
            this.handleValueChange(change.value);
          }
          break;

        // case PropertyNames.Readonly:
        //   this.control.edit = change.value === false;
        //   break;
      }
    });
  }

  emitControlOnChange(change: ControlValueChange) {
    const opts = this.controlOpts as any;

    if (!opts.onChange) {
      return;
    }

    if (!this.onChangeFn) {
      this.onChangeFn = new Function(
        "value",
        "oldValue",
        "form",
        opts.onChange
      );
    }

    const proxy = this.getThisProxy();

    this.onChangeFn.call(proxy, change.value, change.oldValue, proxy);
  }

  validate() {
    (this.ctrl as FormControl<any>).validate(false);
  }

  // countLengthOf(s: string) {
  //     if (!s) {
  //         return 0;
  //     }
  //     const reg = /[\u4e00-\u9fa5]+/;
  //     let result: RegExpExecArray | null;
  //     let len = 0;
  //     while (result = reg.exec(s), result !== null) {
  //         len += result[0].length * 2;
  //         s = s.replace(reg, '');
  //     }
  //     len += s.length;
  //     return len;
  // }

  parseConditions(formControls: typings.RendererFormControl[], exp: string) {
    let segs: string[] = [];
    const results: any[] = [];

    if (exp.indexOf("||") > -1) {
      segs = exp.split(" || ");
    } else {
      if (exp.indexOf("&&") > -1) {
        segs = exp.split(" && ");
      } else {
        segs = [exp];
      }
    }

    for (const seg of segs) {
      const fields = seg.split(" ");
      const code = fields[2].substring(1, fields[2].length - 1);

      let ctrl: any;
      let control: typings.RendererFormControl | undefined;

      const idx = code.indexOf(".");
      if (idx > -1) {
        const parentCode = code.substring(0, idx);
        const childCode = code.substring(idx + 1);
        const sheet = (formControls.find(
          c => c.key === parentCode
        ) as any) as typings.FormSheet;
        if (sheet) {
          control = sheet.columns.find(c => c.key === childCode) as any;
        }

        const sheetCtrl = this.findController(parentCode) as FormSheet;

        if (
          sheetCtrl &&
          this.ctrl.options &&
          typeof this.ctrl.options.rowIndex === "number"
        ) {
          const row = sheetCtrl.rows[this.ctrl.options.rowIndex];
          ctrl = row.findChild(childCode);
        }
      } else {
        ctrl = this.findController(code);
        control = formControls.find(c => c.key === code);
      }

      if (!ctrl || !control) {
        continue;
      }

      const type = ControlHelper.mapToDataItemType(control.type);

      let operator = OperatorService.findByLabel(type, fields[1]);

      if (!operator) {
        continue;
      }

      // let val: any;

      // if (
      //   !(
      //     operator.value === DateItemOperatorType.IsNull ||
      //     operator.value === DateItemOperatorType.IsNotNull
      //   )
      // ) {
      //   val = fields[2];

      //   switch (type) {
      //     case DataItemType.Number:
      //       val = Number(val);
      //       break;
      //     case DataItemType.Logic:
      //       val = val === "true" ? 1 : 0;
      //       break;
      //     case DataItemType.Date:
      //     case DataItemType.ShortText:
      //     case DataItemType.LongText:
      //       val = val.substring(1, val.length - 1);
      //       break;
      //     case DataItemType.StaffSelector:
      //       if (val) {
      //         try {
      //           val = JSON.parse(val);
      //         } catch (e) {
      //           console.log("initModel", e);
      //         }
      //       }
      //       break;
      //   }
      // }

      results.push({
        code: fields[0],
        control,
        controller: ctrl,
        propertyType: type,
        operatorType: operator.value
        // value: val
      });
    }

    return results;
  }

  countLengthOf(s: string) {
    if (!s) {
      return 0;
    }
    return s.length;
  }

  subscribePropertyChange(fn: (change: ControlPropertyChange) => void) {
    const ctrl = this.findController(this.id);

    if (!ctrl) {
      return;
    }

    if (this.propChangeSubscription) {
      this.propChangeSubscription.add(ctrl.propertyChange.subscribe(fn));
    } else {
      this.propChangeSubscription = ctrl.propertyChange.subscribe(fn);
    }
  }

  unsubscribeValueChange() {
    if (this.valueChangeSubscription) {
      this.valueChangeSubscription.unsubscribe();
    }
  }

  unsubscribe() {
    if (this.onChangeSubscription) {
      this.onChangeSubscription.unsubscribe();
    }

    if (this.propChangeSubscription) {
      this.propChangeSubscription.unsubscribe();
    }
  }

  destroyed() {
    this.unsubscribe();
    this.unsubscribeValueChange();
  }
}
