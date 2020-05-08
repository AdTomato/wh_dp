import { DataItem } from "./data-item";

import { schema as forms, renderer } from "@cloudpivot/form";

import * as SystemCodes from "../../../shared/system-data-item-codes";
import { FormSheetColumn } from "@cloudpivot/form/schema";

type DataItemType = forms.DataItemType;

type FormControl = forms.FormControl;

type FormSheet = forms.FormSheet;

type FormControlType = forms.FormControlType;

const { FormControlType, DataItemType } = forms;

const { FormControlOptionsService } = renderer;

/**
 * 按数据项构建控件
 * @param item
 * @param controlType
 */
export function buildControlOf(
  item: DataItem,
  controlType?: FormControlType
): FormControl {
  const type = controlType
    ? controlType
    : item.isSystem
    ? mapToSystemControlType(item.code)
    : mapToControlType(item.type);

  const options = buildControlOptions(type);

  if (!options) {
    throw Error("未知的数据项类型");
  }
  // debugger

  setOptionsName(type, options, item.name, item.name_i18n);

  if (item.defaultValue !== undefined && item.defaultValue !== null) {
    if (type === FormControlType.Date) {
      (options as any).dataItemDefault = item.defaultValue;
      if (item.defaultValue && item.defaultValue.indexOf("-") > 0) {
        (options as any).defaultValue = "dataItemDefault";
      }
    } else {
      (options as any).defaultValue = item.defaultValue;
    }
  }

  if (type === FormControlType.RelevanceForm) {
    options.schemaCode = item.relativeCode;
  }

  const control = {
    key: item.code,
    type: type,
    options: options
  };

  if (type === FormControlType.Sheet) {
    if (item.properties) {
      (control as FormSheet).columns = item.properties.map(x => {
        const c = buildControlOf(x) as FormSheetColumn;
        c.parentKey = item.code;
        c.width = getSheetColumnWidth(c.type);
        return c;
      });
    } else {
      (control as FormSheet).columns = [];
    }
  }

  return control;
}

export function getSheetColumnWidth(type: FormControlType) {
  let width = 150;

  // switch (type) {

  //   case FormControlType.Logic:
  //   case FormControlType.Number:
  //   case FormControlType.Text:
  //   case FormControlType.Dropdown:
  //     width = 150;
  //     break;

  //   case FormControlType.Textarea:
  //     width = 300;
  //     break;

  //   default:
  //     width = 200;
  //     break;
  // }

  return width;
}

function setOptionsName(
  type: FormControlType,
  options: any,
  name: string,
  name_i18n?: string
) {
  // debugger

  options.name = name;

  if (name_i18n) {
    options.name_i18n =
      typeof name_i18n === "string" ? JSON.parse(name_i18n) : name_i18n;

    if (options.name_i18n.zh) {
      // options.name = options.name_i18n.zh;
      delete options.name_i18n.zh;
    }
  }

  // if (type !== FormControlType.Group && type !== FormControlType.Title && type !== FormControlType.Description) {
  //   // 数据项项目构建
  //   // debugger
  //   options.name = name;
  //   if (name_i18n) {
  //     options.name_i18n = typeof name_i18n === 'string' ? JSON.parse(name_i18n) : name_i18n;
  //   } else {
  //     options.name_i18n = {
  //       en: name,
  //       zh: name
  //     };
  //   }
  // } else {
  //   // 分组标题类初始

  //   if (name_i18n) {
  //     options.name_i18n = typeof name_i18n === 'string' ? JSON.parse(name_i18n) : name_i18n;
  //   } else {
  //     options.name_i18n = {
  //       en: name,
  //       zh: name
  //     };
  //   }

  // }
}

/**
 * 按左边面板控件类型块构建控件
 * @param block
 */
export function buildControl(block: any): FormControl {
  // debugger

  const options = buildControlOptions(block.type);
  // options.name = block.name;

  let key = "";
  switch (block.type) {
    case FormControlType.SequenceNo:
      key = SystemCodes.sequence_no;
      break;
    case FormControlType.SequenceStatus:
      key = SystemCodes.sequence_status;
      break;
    case FormControlType.CreateBy:
      key = SystemCodes.creater;
      break;
    case FormControlType.CreateByParentId:
      key = SystemCodes.created_dept_id;
      break;
    case FormControlType.CreatedTime:
      key = SystemCodes.created_time;
      break;
    case FormControlType.OwnerId:
      key = SystemCodes.owner;
      break;
    case FormControlType.ModifyBy:
      key = SystemCodes.modifier;
      break;
    case FormControlType.ModifiedTime:
      key = SystemCodes.modified_time;
      break;

    case FormControlType.Title:
    case FormControlType.Group:
    case FormControlType.Description:
    case FormControlType.ReverseRelevance:
      key = createKey(block.type);
      break;
  }

  setOptionsName(block.type, options, block.name, block.name_i18n);

  const control: any = {
    key,
    options,
    type: block.type
  };

  if (control.type === FormControlType.Sheet) {
    control.columns = [];
  }

  return control;
}

export function createKey(type: FormControlType) {
  const name = FormControlType[type];
  const key = name[0].toLowerCase() + name.substr(1) + Date.now().toString();
  return key;
}

export function copyControlFrom(control: FormControl) {
  const copy = JSON.parse(JSON.stringify(control));

  copy.options.name += "1";

  const name_i18n = copy.options.name_i18n;

  if (name_i18n && typeof name_i18n === "object") {
    Object.keys(copy.options.name_i18n).forEach(k => {
      copy.options.name_i18n[k] += "1";
    });
  }

  // let count = 0;

  // Object.keys(this.controls).map(k => this.controls[k])
  //   .filter(c => c.type === copy.type)
  //   .forEach(()=> count++);

  copy.key = createKey(control.type);

  if (control.type === FormControlType.Sheet) {
    const sheet = copy as FormSheet;
    if (sheet.columns) {
      sheet.columns.forEach(col => {
        col.parentKey = copy.key;
        col.options.name += "1";
        if (col.options.name_i18n) {
          Object.keys(col.options.name_i18n).forEach(k => {
            col.options.name_i18n[k] += "1";
          });
        }
      });
    }
    if (sheet.statistics) {
      sheet.statistics.forEach(s => (s.parentKey = copy.key));
    }
  }

  return copy;
}

/**
 * 按控件类型构建控件选项
 * @param controlType
 * @param sourceOpts 需要合并的选项
 */
export function buildControlOptions(
  controlType: FormControlType,
  sourceOpts?: forms.FormControlOptions
): forms.FormControlOptions {
  let options = FormControlOptionsService.buildFor(controlType, sourceOpts);

  if (!options) {
    throw new Error("未知的控件类型");
  }

  if (
    (controlType === FormControlType.Radio ||
      controlType === FormControlType.Checkbox) &&
    !options.options
  ) {
    options.options = "选项1;选项2;选项3";
  }

  return options;
}

// export function mapToControlTypes(itemType: DataItemType) {
export function widgetControlTypes(itemType: any) {
  // let type = FormControlType.Label;
  const TY1 = [
    FormControlType.Text,
    FormControlType.Radio,
    FormControlType.Checkbox,
    FormControlType.Dropdown,
    FormControlType.Location
  ];
  const TY2 = [FormControlType.Attachment, FormControlType.Image];
  const TY3 = [FormControlType.Textarea];

  if (TY1.indexOf(itemType) > -1) {
    return 1;
  }
  if (TY2.indexOf(itemType) > -1) {
    return 2;
  }
  if (TY3.indexOf(itemType) > -1) {
    return 3;
  }
  return "";

  // if (itemType === DataItemType.Attachment) {
  //   return [FormControlType.Attachment, FormControlType.Image];
  // }
}

export function mapToControlType(itemType: DataItemType) {
  let type = FormControlType.Label;

  switch (itemType) {
    case DataItemType.Attachment:
      type = FormControlType.Attachment;
      break;
    case DataItemType.ApprovalOpinion:
      type = FormControlType.ApprovalOpinion;
      break;
    case DataItemType.ShortText:
      type = FormControlType.Text;
      break;
    case DataItemType.LongText:
      type = FormControlType.Textarea;
      break;
    case DataItemType.Logic:
      type = FormControlType.Logic;
      break;
    case DataItemType.Date:
      type = FormControlType.Date;
      break;
    case DataItemType.Number:
      type = FormControlType.Number;
      break;
    case DataItemType.RelevanceForm:
      type = FormControlType.RelevanceForm;
      break;
    case DataItemType.Sheet:
      type = FormControlType.Sheet;
      break;
    case DataItemType.StaffSelector:
      type = FormControlType.StaffSelector;
      break;
    case DataItemType.Address:
      type = FormControlType.Address;
      break;
  }

  return type;
}

export function mapToControlTypes(itemType: DataItemType) {
  let type = FormControlType.Label;

  if (itemType === DataItemType.ShortText) {
    return [
      FormControlType.Text,
      FormControlType.Radio,
      FormControlType.Checkbox,
      FormControlType.Dropdown,
      FormControlType.Location
    ];
  }

  if (itemType === DataItemType.Attachment) {
    return [FormControlType.Attachment, FormControlType.Image];
  }

  return null;
}

/**
 * 将数据项code映射到系统控件类型
 * @param controlType
 */
export function mapToSystemControlType(itemCode: string) {
  let type = FormControlType.SystemOther;

  switch (itemCode) {
    case SystemCodes.sequence_no:
      type = FormControlType.SequenceNo;
      break;
    case SystemCodes.sequence_status:
      type = FormControlType.SequenceStatus;
      break;
    case SystemCodes.creater:
      type = FormControlType.CreateBy;
      break;
    case SystemCodes.created_dept_id:
      type = FormControlType.CreateByParentId;
      break;
    case SystemCodes.created_time:
      type = FormControlType.CreatedTime;
      break;
    case SystemCodes.modifier:
      type = FormControlType.ModifyBy;
      break;
    case SystemCodes.modified_time:
      type = FormControlType.ModifiedTime;
      break;
    case SystemCodes.owner:
      type = FormControlType.OwnerId;
      break;
  }
  return type;
}

/**
 * 将控件类型映射到非系统数据项类型
 * @param controlType
 */
export function mapToDataItemType(controlType: FormControlType) {
  let type = DataItemType.ShortText;

  switch (controlType) {
    case FormControlType.Text:
    case FormControlType.Radio:
    case FormControlType.Checkbox:
    case FormControlType.Dropdown:
      type = DataItemType.ShortText;
      break;

    case FormControlType.Textarea:
      type = DataItemType.LongText;
      break;

    case FormControlType.Date:
      type = DataItemType.Date;
      break;

    case FormControlType.Number:
      type = DataItemType.Number;
      break;

    case FormControlType.ApprovalOpinion:
      type = DataItemType.ApprovalOpinion;
      break;

    case FormControlType.Image:
    case FormControlType.Attachment:
    case FormControlType.Signature:
      type = DataItemType.Attachment;
      break;

    case FormControlType.StaffSelector:
    case FormControlType.StaffMultiSelector:
    case FormControlType.DepartmentMultiSelector:
    case FormControlType.DepartmentSelector:
      type = DataItemType.StaffSelector;
      break;

    case FormControlType.Logic:
      type = DataItemType.Logic;
      break;

    case FormControlType.Sheet:
      type = DataItemType.Sheet;
      break;

    case FormControlType.ReverseRelevance:
    case FormControlType.RelevanceForm:
      type = DataItemType.RelevanceForm;
      break;
    case FormControlType.Location:
      type = DataItemType.Address;
      break;
  }

  return type;
}

/**
 * 将控件类型映射到系统数据项类型
 * @param controlType
 */
export function mapToSystemDataItemCode(controlType: FormControlType) {
  let code = "";
  switch (controlType) {
    case FormControlType.CreateBy:
      code = SystemCodes.creater;
      break;
    case FormControlType.ModifyBy:
      code = SystemCodes.modifier;
      break;
    case FormControlType.OwnerId:
      code = SystemCodes.owner;
      break;
    case FormControlType.CreateByParentId:
      code = SystemCodes.created_dept_id;
      break;
    case FormControlType.CreatedTime:
      code = SystemCodes.created_time;
      break;
    case FormControlType.ModifiedTime:
      code = SystemCodes.modified_time;
      break;
    case FormControlType.SequenceNo:
      code = SystemCodes.sequence_no;
      break;
    case FormControlType.SequenceStatus:
      code = SystemCodes.sequence_status;
      break;
  }

  return code;
}

export function buildDataItemOf(
  block: {
    type: FormControlType;
    name: string;
    code?: string;
  },
  parentCode?: string
): DataItem {
  const type = mapToDataItemType(block.type);
  const name = block.name;

  let code = block.code;
  if (!code) {
    code = DataItemType[type] + Date.now().toString();
  }

  return {
    type,
    code,
    name,
    parentCode,
    isSystem: false,
    published: false
  };
}

export function notDataItemOf(controlType: FormControlType) {
  return (
    controlType === FormControlType.Group ||
    controlType === FormControlType.Description ||
    controlType === FormControlType.Html ||
    controlType === FormControlType.Title ||
    controlType === FormControlType.ReverseRelevance
  );
}

/**
 * 控件是否独占一行
 * @param controlType
 */
export function isFullRow(controlType: FormControlType) {
  return (
    controlType === FormControlType.Title ||
    controlType === FormControlType.ApprovalOpinion ||
    controlType === FormControlType.Attachment ||
    controlType === FormControlType.Image ||
    controlType === FormControlType.Group ||
    controlType === FormControlType.Description ||
    controlType === FormControlType.Sheet ||
    controlType === FormControlType.Textarea ||
    controlType === FormControlType.Address ||
    controlType === FormControlType.ReverseRelevance
  );
}

/**
 * 根据数据项产生自动布局
 * @param name 表单数据
 * @param items 数据项列表
 */
export function autoLayout(
  formData: any,
  items: DataItem[]
): [
  {
    [key: string]: FormControl;
  },
  string[][]
] {
  const titleControl = buildControl({
    type: FormControlType.Title,
    name: formData.name,
    name_i18n: formData.name_i18n
  });

  const groupTitleControl = buildControl({
    type: FormControlType.Group,
    name: "业务标题"
  });

  const map: {
    [key: string]: FormControl;
  } = {
    [titleControl.key]: titleControl,
    [groupTitleControl.key]: groupTitleControl
  };

  for (const item of items) {
    if (item.code === SystemCodes.creater) {
      map[SystemCodes.creater] = buildControlOf(item);
    } else if (item.code === SystemCodes.created_time) {
      map[SystemCodes.created_time] = buildControlOf(item);
    } else if (item.code === SystemCodes.sequence_no) {
      map[SystemCodes.sequence_no] = buildControlOf(item);
    }
  }

  const layout = [
    [titleControl.key],
    [SystemCodes.creater, SystemCodes.created_time, SystemCodes.sequence_no],
    [groupTitleControl.key]
  ];

  items = items.filter(x => x.published && !x.isSystem);

  for (const item of items) {
    const control = buildControlOf(item);
    map[item.code] = control;

    if (isFullRow(control.type) || layout.length === 0) {
      layout.push([control.key]);
    } else {
      const idx = layout.length - 1;
      if (layout[idx].length === 2 || isFullRow(map[layout[idx][0]].type)) {
        layout.push([control.key]);
      } else {
        layout[layout.length - 1].push(control.key);
      }
    }
  }

  return [map, layout];
}

/**
 * 清理控件的空选项
 * @param map
 */
export function clearEmptyOptions(map: { [k: string]: FormControl }) {
  if (!map) {
    return;
  }

  const clear = (obj: any) => {
    Object.keys(obj)
      .filter(k => obj[k] === undefined)
      .forEach(k => delete obj[k]);
  };

  for (const k in map) {
    const c = map[k];
    if (!c.options) {
      return;
    }

    clear(c.options);

    if (c.type === FormControlType.Sheet && (c as FormSheet).columns) {
      (c as FormSheet).columns
        .filter(col => col.options)
        .forEach(col => clear(col.options));
    }
  }
}

/**
 * 修剪控件属性
 * @param map
 */
export function trimOptions(map: { [k: string]: FormControl }) {
  const clone = JSON.parse(JSON.stringify(map));

  for (const key in clone) {
    const control = clone[key];
    control.options = FormControlOptionsService.trimFor(
      control.type,
      control.options
    );

    if (control.type === forms.FormControlType.Sheet) {
      const sheet = control as FormSheet;
      if (sheet.columns) {
        for (const col of sheet.columns) {
          const opts = FormControlOptionsService.trimFor(col.type, col.options);
          if (opts) {
            col.options = opts;
          }
        }
      }
    }
  }

  return clone;
}

/**
 * 还原控件属性
 * @param map
 */
export function restoreOptions(map: { [k: string]: FormControl }) {
  const clone = JSON.parse(JSON.stringify(map));

  for (const key in clone) {
    const control = clone[key];

    let name_i18n = control.options.name_i18n;
    if (name_i18n && typeof name_i18n === "string") {
      control.options.name_i18n = JSON.parse(name_i18n);
      delete control.options.name_i18n.zh;
    }

    control.options = FormControlOptionsService.buildFor(
      control.type,
      control.options
    );

    if (control.type === forms.FormControlType.Sheet) {
      const sheet = control as FormSheet;
      if (sheet.columns) {
        for (const col of sheet.columns) {
          name_i18n = col.options.name_i18n;
          if (name_i18n && typeof name_i18n === "string") {
            col.options.name_i18n = JSON.parse(name_i18n);
            delete col.options.name_i18n.zh;
          }

          const opts = FormControlOptionsService.buildFor(
            col.type,
            col.options
          );
          if (opts) {
            col.options = opts;
            if (!col.width) {
              col.width = getSheetColumnWidth(col.type);
            }
          }
        }
      }
    }
  }

  return clone;
}
