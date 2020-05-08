import {
  FormControl,
  FormControlType,
  RendererControl,
  RendererLayoutControl,
  RendererFormControl,
  DesignLayoutControl,
  TemplateControl,
  FormSheet
} from "../typings";

import * as schema from "../../schema";

import Vue from "vue";
import "vue-i18n";

import { FormBuilder, FormGroup, FormControlErrorCodes } from "h3-forms";

import { FormBuilderHelper } from "../controls/form-builder-helper";

import { ControlHelper } from "../controls/control-helper";

/**
 * 表单数据权限
 */
export interface FormDataPermission {
  /**
   * 数据项code
   */
  propertyCode?: string;

  /**
   * 可写
   */
  e?: boolean;

  /**
   * 必填
   */
  r?: boolean;

  /**
   * 可见
   */
  v?: boolean;

  /**
   * 子表数据项
   */
  subDataPermission?: FormDataPermission[];
}

export abstract class FormRendererHelper {
  /**
   * 转换模板对象
   * @param tplControls
   */
  static convertTemplate(tplControls: TemplateControl[]) {
    const groupIndexs: number[] = [];

    tplControls.forEach((c, i) => {
      if (
        c.children &&
        c.children.length === 1 &&
        c.children[0].children &&
        c.children[0].children.length === 1 &&
        c.children[0].children[0].BPMType === FormControlType.Group
      ) {
        groupIndexs.push(i);
      }
    });

    if (groupIndexs.length > 0) {
      groupIndexs.push(tplControls.length);
    }

    groupIndexs.forEach((idx, i) => {
      if (i === groupIndexs.length - 1) {
        return;
      }
      const group = (tplControls[idx] as any).children[0].children[0];
      if (group) {
        const children = tplControls.slice(idx + 1, groupIndexs[i + 1]);
        if (group.children) {
          group.children = group.children.concat(children);
        } else {
          group.children = children;
        }
      }
    });

    groupIndexs.reverse().forEach((idx, i) => {
      if (i === groupIndexs.length - 1) {
        return;
      }
      const start = groupIndexs[i + 1] + 1;
      tplControls.splice(start, idx - start);
    });

    const convert = (tc: TemplateControl) => {
      const rc: any = {
        id: tc.id,
        nodeName: tc.nodeName,
        class: tc.class,
        style: tc.style,
        value: tc.value,
        edit: false
      };
      if (tc.BPMOptions) {
        rc.key = tc.BPMOptions.key;
        rc.options = tc.BPMOptions.options;
        rc.type = tc.BPMType;
        rc.value = tc.value;
        if (tc.BPMOptions.columnKey) {
          rc.columnKey = tc.BPMOptions.columnKey;
        }
        if (tc.BPMOptions.columns) {
          rc.columns = tc.BPMOptions.columns;
        }
        if (tc.BPMOptions.statistics) {
          rc.statistics = tc.BPMOptions.statistics;
        }
      }
      if (tc.children) {
        rc.children = tc.children.map(convert);
        const cols = rc.children.filter((c: any) => c.nodeName === "a-col");
        if (cols.length > 0) {
          const span = 24 / cols.length;
          cols.forEach((c: any) => (c.span = span));
        }
      }
      return rc;
    };

    const controls = tplControls.map(convert);

    return controls;
  }

  static convertDesign(
    controls: { [key: string]: FormControl },
    layout: string[][]
  ) {
    const groupIndexs: number[] = [];
    const formControls: FormControl[] = [];
    for (const c in controls) {
      formControls.push(controls[c]);
    }

    const tabsControlKeys: string[] = [];

    const tabsList = formControls.filter(c => {
      const is =
        c.type === FormControlType.ReverseRelevance &&
        c.options.listDisplayMode === schema.ListDispalyMode.Tabs;
      if (is) {
        tabsControlKeys.push(c.key);
      }
      return is;
    });

    if (tabsControlKeys.length > 0) {
      for (let i = layout.length - 1; i >= 0; i--) {
        if (
          layout[i].length === 1 &&
          tabsControlKeys.indexOf(layout[i][0]) > -1
        ) {
          layout.splice(i, 1);
        }
      }
    }

    const reverseRelevanceArr = tabsList.map((c, index) => {
      return {
        code: index + 1,
        name: c.options.name
      };
    });

    layout.forEach((row, i) => {
      if (
        Array.isArray(row) &&
        row.length === 1 &&
        controls[row[0]] &&
        controls[row[0]].type === FormControlType.Group
      ) {
        groupIndexs.push(i);
      }
    });
    const mapAndFilter = (row: string[]) => {
      const span = 24 / row.length;
      return row
        .map(k => {
          const c = controls[k];
          if (c) {
            (c as any).span = span;
          }
          return c;
        })
        .filter(c => !!c);
    };
    let rendererControls: RendererLayoutControl[] = [];
    if (groupIndexs.length > 0) {
      groupIndexs.push(layout.length);
      if (groupIndexs[0] > 0) {
        layout
          .slice(0, groupIndexs[0])
          .map(mapAndFilter)
          .forEach(row =>
            rendererControls.push(FormRendererHelper.buildRow(row))
          );
      }
      groupIndexs.forEach((idx, i) => {
        if (i === groupIndexs.length - 1) {
          return;
        }
        const designControl = controls[layout[idx][0]];

        const children = layout
          .slice(idx + 1, groupIndexs[i + 1])
          .map(mapAndFilter)
          .map(row => FormRendererHelper.buildRow(row));

        const group: DesignLayoutControl = Object.assign(
          {
            nodeName: "a-group-title",
            children
          },
          designControl
        );

        rendererControls.push(group);
      });
    } else {
      rendererControls = layout
        .map(mapAndFilter)
        .map(row => FormRendererHelper.buildRow(row));
      // return rendererControls;
    }
    if (tabsList.length > 0) {
      reverseRelevanceArr.unshift({ name: "表单详情", code: 0 });
      const tabs: any = {
        nodeName: "a-tabs",
        children: [],
        props: reverseRelevanceArr
      };

      const formDetail = {
        nodeName: "a-tabs-pane",
        children: rendererControls,
        tabsName: "表单详情",
        id: "-1"
      };
      tabs.children.push(formDetail);

      tabsList.forEach(res => {
        const pane = {
          nodeName: "a-tabs-pane",
          children: [res],
          tabsName: res.options.name,
          id: res.key
        };
        tabs.children.push(pane);
      });
      return [tabs];
    }
    return rendererControls;
  }

  /**
   * 将表单设计器数据合成渲染器控件树
   * @param controls 表单设计器控件对象
   * @param layout 表单设计器布局
   * @param value 表单数据对象
   * @param permissions 表单数据权限
   */
  static synthetize(
    // controls: { [key: string]: FormControl },
    // layout: string[][],
    controls: RendererFormControl[],
    value?: { [key: string]: any },
    permissions?: { [key: string]: FormDataPermission },
    setDefaultValue?: boolean
  ) {
    if (value) {
      FormRendererHelper.mergeValue(controls, value, setDefaultValue);
    }

    const setProperty = (c: RendererFormControl, obj: any) => {
      // if (obj.e) {
      c.writable = obj.e;
      // }

      // 表单不可见优先级最高
      if (obj.v !== undefined && c.options.visible) {
        c.options.visible = obj.v;
      }

      // if (obj.r) {
      c.required = obj.r;
      // }
    };

    if (permissions) {
      Object.keys(permissions).forEach(k => {
        const c = controls.find(x => x.key === k);
        if (!c) {
          return;
        }

        const obj = permissions[k];
        setProperty(c, obj);
        const sheet = (c as any) as FormSheet;
        if (c.type === FormControlType.Sheet && sheet.columns) {
          if (obj.subDataPermission) {
            for (const item of obj.subDataPermission) {
              const col = sheet.columns.find(x => x.key === item.propertyCode);
              if (col) {
                setProperty(col as any, item);
              }
            }
          } else {
            // for (const col of sheet.columns) {
            //     setProperty(col as any, obj);
            // }
          }
        }
      });
    }
  }

  static mergeValue(
    controls: RendererFormControl[],
    values: { [key: string]: any },
    setDefaultValue?: boolean
  ) {
    controls.forEach(control => {
      control.writable = true;

      let val = values[control.key];

      if (!control.options) {
        return;
      }

      if (val === undefined) {
        if (!setDefaultValue) {
          return;
        }

        val = FormBuilderHelper.defaultValueOf(control);
      }

      if (control.type === FormControlType.Sheet) {
        (control as any).value = val;
      } else {
        (control as any).value = val;
      }
    });
  }

  static buildRow(controls: FormControl[]): RendererLayoutControl {
    const children = controls.map(c => FormRendererHelper.buildCol(c));
    const nodeName = "a-row";
    return {
      nodeName,
      children
    };
  }

  static buildCol(control: FormControl) {
    const span = (control as any).span ? (control as any).span : 24;
    (control as any).edit = false;
    let children: FormControl[] = [];
    if (
      control.type === FormControlType.ReverseRelevance &&
      control.options.listDisplayMode === schema.ListDispalyMode.Tabs
    ) {
      children = [];
    } else {
      children = [control];
    }
    const nodeName = "a-col";
    return {
      nodeName,
      span,
      children
    };
  }
  static findFormControl(
    controls: RendererControl[],
    formControls: RendererFormControl[]
  ) {
    for (const c of controls) {
      const fc = c as RendererFormControl;

      if (
        fc.type &&
        fc.type !== FormControlType.Html
        // && fc.type !== FormControlType.Group
        // &&      fc.type !== FormControlType.Title
        // && fc.type !== FormControlType.Description
      ) {
        formControls.push(fc);
      }

      if ((fc as any).children) {
        this.findFormControl((fc as any).children, formControls);
      }
    }
  }

  static buildController(controls: RendererControl[]) {
    const formControls: RendererFormControl[] = [];

    this.findFormControl(controls, formControls);

    if (formControls.length === 0) {
      return;
    }

    const opts: any = {};

    for (const control of formControls) {
      const c = control as RendererFormControl;
      const opt = FormBuilderHelper.buildOptionsOf(c);
      opts[c.key] = opt;
    }

    const formGroup = FormBuilder.build(opts);
    return formGroup;
  }

  static render(
    h: Function,
    control: RendererControl,
    mobile: boolean,
    vm?: any
  ): any {
    let opts: any = {
      props: {
        control: control
      },
      attrs: {}
    };
    if ((control as any).type) {
      const className = FormBuilderHelper.getClass((control as any).type);
      if (className) {
        opts.class = [className];
      }
    }
    if (control.style) {
      opts.attrs.style = control.style;
    }
    // opts.attrs.class = {

    // };
    if (control.class) {
      opts.attrs.class = "eeeee";
    }

    if (control.id) {
      opts.attrs.id = control.id;
    }

    const children = (control as any).children;
    if (Array.isArray(children)) {
      const nodes = (control as RendererLayoutControl).children.map(c =>
        FormRendererHelper.render(h, c, mobile, vm)
      );
      switch (control.nodeName) {
        case "a-row":
          const allSystem = children
            .map((col: RendererLayoutControl) => col.children)
            .every(arr => {
              return arr.every(c =>
                FormRendererHelper.isSystem((c as RendererFormControl).type)
              );
            });

          // 判断是否为系统拥有者组件
          const isOwnerSys = children
            .map((col: RendererLayoutControl) => col.children)
            .every(arr => {
              return arr.every(c =>
                FormRendererHelper.isOwner(
                  (c as RendererFormControl).type,
                  (c as RendererFormControl).key
                )
              );
            });

          const type = (children.map(
            (col: RendererLayoutControl) => col.children
          )[0][0] as any).type;
          // console.log('wwwwww', children.map((col: RendererLayoutControl) => col.children));
          if (type === FormControlType.Title) {
            opts.class = ["form-title-flex"];
          }
          // .every(arr => {

          //   return arr[0].type
          // });
          if (allSystem || isOwnerSys) {
            opts.class = {
              dashed: true
            };
          }

          return h("form-row", opts, nodes);
        case "a-col":
          if (mobile) {
            (opts.props as any).span = 24;
          }
          if (children.length === 1 && children[0].options) {
            const first = children[0];
            const visible = first.options.visible;
            if (
              (visible !== undefined && Boolean(visible) === false) ||
              (first.controller && !first.controller.display)
            ) {
              (opts.props as any).span = 0;
            }
          }
          return h("form-col", opts, nodes);
        case "a-group-title":
          if (!mobile) {
            if (!opts.class) {
              opts.class = {};
            }
            opts.class.xl = true;
          }
          return h("form-group", opts, nodes);
        case "a-tabs":
          (opts.props as any).itemList = (control as any).props;
          return h("form-tabs", opts, nodes);
        case "a-tabs-pane":
          opts.attrs.tab = control.tabsName;
          opts.key = control.id;

          if (mobile) {
            return h("h3-swiper-item", opts, [
              h("div", [h("div", vm.$slots.default), ...nodes])
            ]);
          } else {
            return h("a-tab-pane", opts, nodes);
          }
        default:
          return h(control.nodeName, opts, nodes);
      }
    } else {
      //if(control.nodeName.indexOf('a-') > -1){
      const c = control as any;
      if (c.options) {
        return h("control-adapter", opts);
      } else {
        if (control.nodeName && control.nodeName !== "#text") {
          if (control.value) {
            opts.attrs.value = control.value;
          }
          return h(control.nodeName, opts, [control.value]);
        } else {
          return h("span", [control.value]);
        }
      }
    }
  }

  static getErrorMessage(
    control: RendererFormControl,
    errCode: FormControlErrorCodes,
    locale: string
  ) {
    const label = ControlHelper.getControlLabel(control, locale);
    let { status, errMsg } = getVerifyError(control); // 数值类型 控件 错误检测
    if (status) return errMsg;
    switch (errCode) {
      case FormControlErrorCodes.Required:
        const selectTypeControl = [
          FormControlType.Radio,
          FormControlType.Checkbox,
          FormControlType.Dropdown,
          FormControlType.RelevanceForm,
          FormControlType.Address,
          FormControlType.Date,
          FormControlType.StaffSelector,
          FormControlType.StaffMultiSelector,
          FormControlType.DepartmentSelector,
          FormControlType.DepartmentMultiSelector
        ];
        if (selectTypeControl.includes(control.type)) {
          return `请选择${label}`;
        }
        return `请输入${label}`;

      case FormControlErrorCodes.Pattern:
        const lang: string = localStorage.getItem("locale") || "zh";

        let msg = "";
        const regexpText = (control.options as any).regexpText;
        if (regexpText) {
          try {
            const langObj: any = JSON.parse(regexpText);
            msg = langObj[lang];
          } catch {
            msg = regexpText;
          }
        }
        return msg;

      case FormControlErrorCodes.Min:
        return (window as any)["globalI18n"].t(
          "cloudpivot.form.renderer.errorCode.min",
          {
            label
          }
        );
      case FormControlErrorCodes.Max:
        return (window as any)["globalI18n"].t(
          "cloudpivot.form.renderer.errorCode.max",
          {
            label
          }
        );
      case FormControlErrorCodes.MinCount:
        return (window as any)["globalI18n"].t(
          "cloudpivot.form.renderer.errorCode.minCount",
          {
            label,
            num: (control.controller as any).minCount
          }
        );
      case FormControlErrorCodes.MaxCount:
        return (window as any)["globalI18n"].t(
          "cloudpivot.form.renderer.errorCode.maxCount",
          {
            label,
            num: (control.controller as any).maxCount
          }
        );
    }
  }

  static isSystem(type: FormControlType) {
    return (
      type >= FormControlType.SequenceNo && type <= FormControlType.SystemOther
    );
  }

  static isOwner(type: FormControlType, key: string) {
    return (
      (type >= FormControlType.SequenceNo &&
        type <= FormControlType.SystemOther) ||
      key === "owner"
    );
  }
}

// 数值类型 校验规则 错误提示
function getNumberVerifyError(control: any) {
  let status = false,
    errMsg = "";
  // 只检测数值类型
  // if (control.type !== schema.FormControlType.Number) {
  //   return { status, errMsg };
  // }
  let verifyFormula = control.options.verifyFormula; // 获取校验规则 字段
  if (!verifyFormula) return { status, errMsg };
  let verifyObj: any = {};
  if (isJSONString(verifyFormula)) {
    verifyObj = JSON.parse(verifyFormula);
  } else {
    let arr = verifyFormula.split("_");
    for (let item of arr) {
      let [key, val] = item.split(":");
      verifyObj[key] = val;
    }
  }
  if (+verifyObj.type === 1) {
    if (verifyObj.rule === "~") {
      if (("" + verifyObj.lInput).length && ("" + verifyObj.rInput).length) {
        return _getVerifyPrompt(verifyObj);
      }
    } else {
      if (("" + verifyObj.input).length) {
        return _getVerifyPrompt(verifyObj);
      }
    }
  } else {
    if (verifyObj.rule === "~") {
      if (verifyObj.rSelect && verifyObj.lSelect) {
        return _getVerifyPrompt(verifyObj);
      }
    } else {
      if (verifyObj.select) {
        return _getVerifyPrompt(verifyObj);
      }
    }
  }
  return { status, errMsg };
}
function isJSONString(str: string) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
}
// 日期类型 校验规则 错误提示
function getDateVerifyError(control: any) {
  let status = false,
    errMsg = "";
  let verifyFormula = control.options.verifyFormula; // 获取校验规则 字段
  if (!verifyFormula) return { status, errMsg };
  let format = control.options.format;
  let verifyObj: any = {};
  if (isJSONString(verifyFormula)) {
    verifyObj = JSON.parse(verifyFormula);
  } else {
    let arr = verifyFormula.split("_");
    for (let item of arr) {
      if (/defaultPrompt/.test(item)) {
        verifyObj["defaultPrompt"] = item.slice("defaultPrompt:".length);
      } else if (/prompt/.test(item)) {
        verifyObj["prompt"] = item.slice("prompt:".length);
      } else {
        let [key, val] = item.split(":");
        verifyObj[key] = val;
      }
    }
  }
  if (+verifyObj.type === 1) {
    if (verifyObj.rule === "~") {
      if (verifyObj.lDate && verifyObj.rDate) {
        return _getVerifyPrompt(verifyObj);
      }
    } else {
      if (verifyObj.date) {
        return _getVerifyPrompt(verifyObj);
      }
    }
  } else {
    if (+verifyObj.day === 1) {
      if (verifyObj.rule === "~") {
        if (("" + verifyObj.lInput).length && ("" + verifyObj.rInput).length) {
          return _getVerifyPrompt(verifyObj);
        }
      } else {
        if (("" + verifyObj.input).length) {
          return _getVerifyPrompt(verifyObj);
        }
      }
    } else {
      if (verifyObj.rule === "~") {
        if (verifyObj.lSelect && verifyObj.rSelect) {
          return _getVerifyPrompt(verifyObj);
        }
      } else {
        if (verifyObj.select) {
          return _getVerifyPrompt(verifyObj);
        }
      }
    }
  }
  return { status, errMsg };
}
// 获取提示信息
function _getVerifyPrompt(verifyObj: any) {
  return {
    status: true,
    errMsg: verifyObj.prompt
      ? decodeURIComponent(verifyObj.prompt)
      : verifyObj.defaultPrompt
  };
}

// 24迭代 校验规则 错误提示
const getVerifyErrorFn = {
  [schema.FormControlType.Number](control: any) {
    console.error("数值校验错误", control);
    return getNumberVerifyError(control);
  },
  [schema.FormControlType.Date](control: any) {
    console.error("日期校验错误", control);
    return getDateVerifyError(control);
  }
};

function getVerifyError(control: any) {
  if (
    control.type !== schema.FormControlType.Number &&
    control.type !== schema.FormControlType.Date
  ) {
    return { status: false, errMsg: "" };
  }
  return getVerifyErrorFn[
    control.type as schema.FormControlType.Number | schema.FormControlType.Date
  ](control);
}
