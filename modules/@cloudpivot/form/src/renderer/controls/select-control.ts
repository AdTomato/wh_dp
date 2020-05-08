import * as typings from "../typings";

import { BaseControl } from "./base-control";
import { RelevanceFormControl } from "./relevance-form-control";
import { ControlHelper } from "./control-helper";

export abstract class SelectControl<
  T extends typings.SelectControlOptions
> extends BaseControl<T> {
  val: any = [];

  options: string[] = [];

  isCustomOption = false;

  get text() {
    if (Array.isArray(this.val)) {
      let text = this.val.filter(x => x).join(";");
      if (text.length > 0) {
        text += ";";
      }
      return text;
    }
    return this.val;
  }

  get items() {
    return this.controlOpts.options;
  }

  initOptions(isRadio: boolean) {
    const opts = this.controlOpts;
        if (!opts || !opts.options) {
            return [];
        }

        try{
            const optSet = JSON.parse(opts.options);
            this.isCustomOption = true;
            const curFormCode:string[] = [];
            if (optSet.condition) {
                let sheetConditon:any = {};
                optSet.condition.split('&&').map(res =>{
                    const item:string[] = res.split(' ');
                    curFormCode.push(item[2]);
                    if (item[2].indexOf('.') > 0) {
                        const codes = item[2].split('.');
                        const sheetCtrl:any = this.findController(codes[0]);
                        if (sheetConditon[codes[0]]) {
                            sheetConditon[codes[0]].push(codes[1]);
                        } else {
                            sheetConditon[codes[0]] = [];
                            sheetConditon[codes[0]].push(codes[1]);
                        }
                        
                    } else {
                        this.valChange(item[2], (this as any).clearOption);
                    }
                });
                // debugger;
                if (Object.keys(sheetConditon).length > 0) {
                    const _this:any = this;
                    for (const k in sheetConditon) {
                        const sheetCtrl:any = this.findController(k);
                        if (sheetCtrl && this.ctrl.options && typeof this.ctrl.options.rowIndex === 'number') {
                            const _c = this.ctrl
                            sheetCtrl.getRowValueChange(this.ctrl.options.rowIndex).subscribe(change => {
                                sheetConditon[k].forEach(v => {
                                    if (change.oldValue[v] !== change.value[v]) {
                                        _this.options = [];
                                        _c.value = null;
                                    }
                                })
                            });
                        }
                    }
                }
            }
            return [];
        } catch {
            const items = opts.options.split(';').filter(s => s.length > 0);

            const value = this.ctrl.value || opts.defaultValue;

            if (value && value.length > 0 && typeof value === 'string') {

                const defaults = value.split(';').filter(s => s.length > 0);

                if (defaults && this.ctrl) {
                    this.ctrl.value = isRadio ? defaults[0] : defaults;
                }
            }
            return items;

        }
  }

  getOptions() {
    if (!this.isCustomOption) return;
        const opts = this.controlOpts;
        const optionsSet:any = JSON.parse(opts.options);
        const schemaCode = optionsSet.schemaCode;
        const sheetDataItem = optionsSet.sheetDataItem;
        let condition:any = [];
        if (optionsSet.condition) {
            const conditionStr:string[] = optionsSet.condition.split('&&');
            conditionStr.forEach(res => {
                const item:any = res.split(' ');
                const _ctrl:any = this.getFormControls(item[2]);
                let ctrl:any = null;
                
                if (item[2].indexOf('.') > 0) {
                    const codes = item[2].split('.');
                    const sheetCtrl:any = this.findController(codes[0]);
                    if (sheetCtrl && this.ctrl.options && typeof this.ctrl.options.rowIndex === 'number') {
                        const row = sheetCtrl.rows[this.ctrl.options.rowIndex];
                        ctrl = row.findChild(codes[1]);
                    }
                } else {
                    ctrl = this.findController(item[2]);
                }

                const type = ControlHelper.mapToDataItemType(_ctrl[0].type);
                // debugger
                if (ctrl.value !== null) {
                    const queryItem = {
                        propertyCode: item[0],
                        value: ctrl.value,
                        type: type
                    }
                    condition.push(queryItem);
                }
            });

            if (condition.length < conditionStr.length) {
                this.options = [];
                return;
            }
        }
        
        if (RelevanceFormControl.service.getOptions) {
            RelevanceFormControl.service.getOptions(schemaCode, '', condition, sheetDataItem).then(res => {
                this.options = res;
            })
        }
  }

  convertValue(multiple: boolean, value: any): string | string[] {
    if (multiple) {
      return Array.isArray(value) ? value : [];
    } else {
      if (Array.isArray(value) && value.length > 0) {
        return value[0];
      } else if (typeof value === "string") {
        return value;
      } else {
        return "";
      }
    }
  }
}
