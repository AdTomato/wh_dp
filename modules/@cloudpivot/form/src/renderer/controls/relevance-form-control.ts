import * as typings from "../typings";

import { BaseControl } from "./base-control";

import { ControlHelper } from "./control-helper";

import { DataItemType, RelevanceFormSelectMode } from "../typings";
import { FormControlValueService } from "../services";

import { ControlCommand, FormSheet, FormControl } from "h3-forms";

import { UploadStatus } from "./upload-control";

import { form } from "@cloudpivot/api";

import { Subscription } from "rxjs";

import { DateItemOperatorType } from "../../schema";

import common from "@cloudpivot/common";

export abstract class RelevanceFormControl extends BaseControl<
  typings.RelevanceFormOptions
> {
  static service: RelevanceFormService;

  static loadListSelector: () => any;

  static loadFormStatus: () => any;

  static loadQueryForm: () => any;

  static loadFormItem: () => any;

  formTitleObj: FormTitle | null = null;

  commandSubscription?: Subscription;

  setDefaultValSub?: Subscription;

  setDefaultValTimer?: any;

  get isModal() {
    return this.controlOpts.selectMode === RelevanceFormSelectMode.Popup;
  }
  get columns() {
    // debugger;
    const _ctrl = this.ctrl as any;
    const cols =
      _ctrl.options && _ctrl.options.mappings
        ? Object.keys(_ctrl.options.mappings)
        : [];
    return [...cols, this.control.options.displayField || "name"]; // 关联表单 显示字段属性
  }
  get showLink() {
    return this.controlOpts.linkMode;
  }
  // 返回 显示字段
  get getDisplayField() {
    return this.control.options.displayField || "name";
  }

  get formTitle() {
    let title = "";
    if (this.formTitleObj) {
      if (this.locale !== "zh") {
        const name_i18n = this.formTitleObj.name_i18n;
        if (name_i18n) {
          const map =
            typeof name_i18n === "string" ? JSON.parse(name_i18n) : name_i18n;
          if (map[this.locale]) {
            title = map[this.locale];
          }
        }
      }
      if (!title) {
        title = this.formTitleObj.name;
      }
    } else {
      title = "关联表单";
    }

    return title;
  }
  // 查看模式下 显示值
  get lookUpModalValue() {
    let field = this.control.options.displayField || "name";
    console.log("lookUpModalValue", field);
    return this.parseDisplayFieldValue(this.ctrl.value[field], field);
  }
  fetch(
    page: number,
    pageSize: number,
    value: string,
    queryData?: any[],
    mobile?: boolean
  ) {
    // if (!RelevanceFormControl.service) {
    //     return;
    // }

    const schemaCode = this.controlOpts.schemaCode || "";
    let queryCode = this.controlOpts.queryCode || "";

    // if (mobile) {
    //     queryCode = '';
    // }
    // if (!schemaCode || !queryCode) {
    //     return;
    // }
    const params = queryData ? [] : this.getParams(mobile);
    params.push({
      code: "name",
      type: DataItemType.ShortText,
      value
    });

    const _ctrl = this.ctrl as any;
    const cols = this.columns;

    return RelevanceFormControl.service.search(
      schemaCode,
      queryCode,
      params,
      cols,
      page,
      pageSize,
      queryData
    );
  }

  async convertForMappings(value: any) {
    const _ctrl = this.ctrl as any;
    if (
      !_ctrl.options ||
      !_ctrl.options.mappings ||
      !this.controlOpts.schemaCode
    ) {
      return value;
    }

    const dataitems = await RelevanceFormControl.service.dataitemsOf(
      this.controlOpts.schemaCode
    );

    const item = JSON.parse(JSON.stringify(value));

    const formControls = this.getFormControls();

    for (const key in _ctrl.options.mappings) {
      let target = _ctrl.options.mappings[key];
      let targetKey = Array.isArray(target) ? target[0] : target;
      const idx = targetKey.indexOf(".");
      let control;
      if (idx === -1) {
        control = formControls.find(c => c.key === targetKey);
      } else {
        const parentKey = targetKey.substring(0, idx);
        targetKey = targetKey.substr(idx + 1);
        const parent = (formControls.find(
          c => c.key === parentKey
        ) as any) as typings.FormSheet;
        if (!parent || !parent.columns) {
          continue;
        }
        control = parent.columns.find(c => c.key === targetKey);
      }
      if (!control) {
        continue;
      }

      // const targetItemType = ControlHelper.mapToDataItemType(control.type);
      const targetItem = this.getDataItem(control.key, control.parentKey);
      const dataitem = dataitems.find(
        (d: typings.DataItemLike) => d.code === key
      );
      if (
        !dataitem ||
        !targetItem ||
        targetItem.propertyType !== dataitem.propertyType
      ) {
        item[key] = FormControlValueService.defaultValueOf(control.type);
        continue;
      }

      if (control.type === typings.FormControlType.Sheet) {
        const rows = item[key];
        const columns = ((control as any) as typings.FormSheet).columns;
        if (Array.isArray(rows) && rows.length > 0 && columns.length > 0) {
          const subSchema = (dataitem as typings.SheetDataItemLike).subSchema;

          for (const col of columns) {
            const subItem = subSchema
              ? subSchema.properties.find(p => p.code === col.key)
              : null;

            const match =
              subItem &&
              subItem.propertyType ===
                ControlHelper.mapToDataItemType(col.type);

            for (const row of rows) {
              delete row.id;

              if (row[col.key] !== undefined) {
                if (match) {
                  if (key === "sequenceStatus") {
                    if (item[key] && this.$i18n.locale === "zh") {
                      const text = form.sequenceStatusZh[item[key]];
                      if (text) {
                        item[key] = text;
                      }
                    }
                  } else {
                    row[col.key] = FormControlValueService.convert(
                      col.type,
                      row[col.key],
                      col.options.multi
                    );
                  }
                } else {
                  row[col.key] = FormControlValueService.defaultValueOf(
                    col.type
                  );
                }
              }
            }
          }
        }
      } else if (
        control.type === typings.FormControlType.Attachment ||
        control.type === typings.FormControlType.Image
      ) {
        const files = item[key];
        if (files && Array.isArray(files)) {
          item[key] = files.map((f: any) => ({
            uid: f.refId,
            name: f.name,
            status: UploadStatus.Done,
            size: f.fileSize,
            response: {
              data: f
            }
          }));
        }
      } else {
        if (key === "sequenceStatus") {
          if (item[key] && this.$i18n.locale === "zh") {
            const text = form.sequenceStatusZh[item[key]];
            if (text) {
              item[key] = text;
            }
          }
        } else {
          item[key] = FormControlValueService.convert(
            control.type,
            item[key],
            control.options.multi
          );
        }
      }
    }

    return item;
  }

  getParams(isMobile?: boolean) {
    let conditions = this.controlOpts.conditions;
    if (isMobile) {
      conditions = this.controlOpts.mobileConditions;
    }

    if (!conditions) {
      return [];
    }

    const formControls = this.getFormControls();

    const params = conditions
      .split(";")
      .map(arr => {
        let [f1, f2] = arr.split(":");

        if (!f2) {
          return null;
        }

        if (f2[0] === "{") {
          f2 = f2.substr(1, f2.length - 2);

          let ctrl: any;
          let control: typings.RendererFormControl | undefined;

          const idx = f2.indexOf(".");
          if (idx > -1) {
            const sheetKey = f2.substring(0, idx);
            const controlKey = f2.substr(idx + 1);

            const sheet = (formControls.find(
              c => c.key === sheetKey
            ) as any) as typings.FormSheet;
            if (sheet) {
              control = sheet.columns.find(c => c.key === controlKey) as any;
            }

            const sheetCtrl = this.findController(
              f2.substring(0, idx)
            ) as FormSheet;
            if (
              sheetCtrl &&
              this.ctrl.options &&
              typeof this.ctrl.options.rowIndex === "number"
            ) {
              const row = sheetCtrl.rows[this.ctrl.options.rowIndex];
              ctrl = row.findChild(f2.substr(idx + 1));
            }
          } else {
            ctrl = this.findController(f2);
            control = formControls.find(c => c.key === f2);
          }

          if (!ctrl || !control) {
            return null;
          }

          const type = ControlHelper.mapToDataItemType(control.type);

          return {
            code: f1,
            value: ctrl.value,
            type
          };
        } else {
          return {
            code: f1,
            value: f2
          };
        }
      })
      .filter(x => x !== null);

    return params as RelevanceFormSearchParams[];
  }

  open() {
    if (
      !this.ctrl.value ||
      !this.ctrl.value.id ||
      !RelevanceFormControl.service
    ) {
      return;
    }
    const sheetParams: any = (this.controlOpts as any).sheetParams;
    const schemaCode = this.controlOpts.schemaCode || "";
    const queryCode = this.controlOpts.queryCode || "";
    const sheetId = sheetParams.sheetid;
    const id = sheetParams.id;
    const isAuthorize = this.controlOpts.isAuthorize;

    RelevanceFormControl.service.open(
      schemaCode,
      queryCode,
      id,
      sheetId,
      isAuthorize,
      this.id,
      this.ctrl.value
    );
  }

  async getListQueryConditions(isMobile?: boolean) {
    if (!RelevanceFormControl.service.getListQueryConditions) {
      return Promise.reject(null);
    }
    let queryCode = "";
    queryCode = this.controlOpts.queryCode || "";
    // if (isMobile) {
    //     queryCode = ''
    // } else {
    //     queryCode = this.controlOpts.queryCode || '';
    // }

    const schemaCode = this.controlOpts.schemaCode || "";
    // const
    const params = this.getParams(isMobile);

    return await RelevanceFormControl.service.getListQueryConditions(
      schemaCode,
      queryCode,
      params
    );
  }

  listenCommand() {
    this.commandSubscription = this.ctrl.commander.subscribe(
      (cmd: ControlCommand) => {
        switch (cmd.name) {
          case "init":
            const schemaCode = this.controlOpts.schemaCode || "";
            const queryCode = this.controlOpts.queryCode || "";

            if (!this.controlOpts.defaultVal || !schemaCode || !queryCode) {
              return;
            }

            this.setDefaultValue(schemaCode, queryCode).then(results => {
              for (const result of results) {
                const sub = result.controller.valueChange.subscribe(() => {
                  clearTimeout(this.setDefaultValTimer);
                  this.setDefaultValTimer = setTimeout(
                    () => this.setDefaultValue(schemaCode, queryCode),
                    1000
                  );
                });
                if (!this.setDefaultValSub) {
                  this.setDefaultValSub = sub;
                } else {
                  this.setDefaultValSub.add(sub);
                }
              }
            });

            break;
          default:
            break;
        }
      }
    );
  }

  async setDefaultValue(schemaCode: string, queryCode: string) {
    const controls = this.getFormControls();

    const conds = super.parseConditions(controls, this.controlOpts.defaultVal);

    const filters = conds
      .filter(cond => cond.controller)
      .map(cond => {
        const ctrl = cond.controller;
        const type = cond.propertyType;
        let val: any = ctrl.value;

        if (val !== null) {
          switch (type) {
            case DataItemType.RelevanceForm:
              val = ctrl.value.id || "";
              break;
            case DataItemType.StaffSelector:
              val = ctrl.value.map((v: any) => ({
                id: v.id,
                type: v.unitType || v.type
              }));
              val = JSON.stringify(val);
              break;
            case DataItemType.Number:
              if (Array.isArray(ctrl.value)) {
                val = ctrl.value.map(v => v.toString()).join(";");
              } else {
                val = ctrl.value;
              }
              break;
            default:
              if (Array.isArray(ctrl.value)) {
                val = ctrl.value.map(v => v.toString()).join(";");
              } else {
                val = ctrl.value;
              }
              break;
          }
        }

        let op = "";
        switch (cond.operatorType) {
          case DateItemOperatorType.Equal:
            op = "Eq";
            break;
          case DateItemOperatorType.NotEqual:
            op = "NotEq";
            break;
          case DateItemOperatorType.Contains:
            op = "Like";
            break;
          case DateItemOperatorType.NotContains:
            op = "NotLike";
            break;
          case DateItemOperatorType.GreaterThan:
            op = "Gt";
            break;
          case DateItemOperatorType.LessThan:
            op = "Lt";
            break;
        }

        return {
          op,
          propertyCode: cond.code,
          propertyType: type,
          propertyValue: val
        };
      });

    const _ctrl = this.ctrl as any;

    const cols =
      _ctrl.options && _ctrl.options.mappings
        ? Object.keys(_ctrl.options.mappings)
        : [];

    if (RelevanceFormControl.service.queryDefaultValue) {
      const res = await RelevanceFormControl.service.queryDefaultValue(
        schemaCode,
        queryCode,
        cols,
        filters
      );

      if (res.data.length > 0) {
        let item = await this.convertForMappings(res.data[0]);
        this.setValue(item);
      } else {
        this.setValue(null);
      }
    }

    return conds;
  }

  setControl() {
    this.listenCommand();
  }

  unsubscribe() {
    if (this.commandSubscription) {
      this.commandSubscription.unsubscribe();
    }

    if (this.setDefaultValSub) {
      this.setDefaultValSub.unsubscribe();
    }
  }

  destroyed() {
    super.destroyed();

    this.unsubscribe();

    if (this.setDefaultValTimer !== undefined) {
      clearTimeout(this.setDefaultValTimer);
    }
  }
  /**
   * @Author: Fan
   * @Description: 显示字段 控件值解析
   * @URL:http://redmine.h3bpm.com/issues/31131
   * @param {type}
   * @return:
   * @Date: 2019-12-24 10:38:05
   */
  parseDisplayFieldValue(val: any, field: string) {
    if (val === null) return "";

    if(val === '') {
      return '';
    }

    if (typeof val === "object") {
      try {
        if (val instanceof Date) {
          return common.utils.DateHandle.dateFormat(val, "YYYY-MM-DD HH:mm:ss");
        } else if (Array.isArray(val)) {
          return val[0].name;
        } else if (val.address) {
          return `${val.provinceName}${val.cityName}${val.districtName}${val.address}`;
        } else {
          return val;
        }
      } catch (e) {
        return val;
      }
    } else {
      try {
        let a = JSON.parse(val);
        if (typeof a === "object") {
          return `${a.provinceName}${a.cityName}${a.districtName}${a.address}`;
        } else {
          if (field === "sequenceStatus") {
            switch (a) {
              case "DRAFT":
                a = "草稿";
                break;
              case "PROCESSING":
                a = "进行中";
                break;
              case "COMPLETED":
                a = "已完成";
                break;
              case "CANCELED":
                a = "已作废";
                break;
              default:
                break;
            }
          }
          if (a == true) {
            return "是";
          } else if (a == false) {
            return "否";
          }
          if (field === "createdTime") {
            return common.utils.DateHandle.dateFormat(
              new Date(val),
              "YYYY-MM-DD HH:mm:ss"
            );
          }
          return a;
        }
      } catch (e) {
        if (field === "sequenceStatus") {
          switch (val) {
            case "DRAFT":
              val = "草稿";
              break;
            case "PROCESSING":
              val = "进行中";
              break;
            case "COMPLETED":
              val = "已完成";
              break;
            case "CANCELED":
              val = "已作废";
              break;
            default:
              break;
          }
        }
        if (val == true) {
          return "是";
        } else if (val == false) {
          return "否";
        }
        if (field === "createdTime") {
          return common.utils.DateHandle.dateFormat(
            new Date(val),
            "YYYY-MM-DD HH:mm:ss"
          );
        }
        return val;
      }
    }
  }
}

export interface RelevanceFormSearchParams {
  code: string;
  type: DataItemType;
  value: any;
}

export interface RelevanceFormSearchResult {
  id: string;
  name: string;
  [key: string]: any;
}

export interface Segment<T> {
  total: number;

  data: T[];
}

export interface FormTitle {
  name: string;

  name_i18n: string | null;
}

export interface RelevanceFormService {
  search(
    schemaCode: string,
    queryCode: string,
    params: RelevanceFormSearchParams[],
    columns: string[],
    page?: number,
    pageSize?: number,
    query?: any[]
  ): Promise<Segment<RelevanceFormSearchResult>>;
  /**
   *
   * @param schemaCode
   * @param queryCode
   * @param id 表单 bizObject id
   * @param sheetId 表单 shestId
   * @param isAuthorize 控件属性 是否临时授权
   * @param code 当前控件 key
   * @param value  控件值
   */
  open(
    schemaCode: string,
    queryCode: string,
    id: string,
    sheetId: string,
    isAuthorize: boolean,
    code: string,
    value: any
  ): void;

  dataitemsOf(schemaCode: string): Promise<typings.DataItemLike[]>;

  getBizmodelTitle(schemaCode: string): Promise<any | null>;

  getListQueryConditions?(
    schemaCode: string,
    listCode: string,
    params: RelevanceFormSearchParams[]
  ): Promise<any | null>;

  getOptions?(
    schemaCode: string,
    listCode: string,
    params: any,
    sheetDataItem: string
  ): Promise<any | []>;

  queryDefaultValue?(
    schemaCode: string,
    queryCode: string,
    columns: string[],
    filters: any[]
  ): Promise<Segment<RelevanceFormSearchResult>>;
}
