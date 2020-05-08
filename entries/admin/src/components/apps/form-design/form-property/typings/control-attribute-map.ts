import Vue, { VNode } from "vue";
import { i18n } from "@/config/i18n";

import {
  ControlAttributeOptions,
  ControlAttributeType,
  DropdownAttributeType,
  ModalAttributeType
} from "./form-attribute";

import * as listApi from "@/apis/list/list.api";

import appsApi from "@/apis/apps.ts";
import { DataItemType } from "../../typings";

import {
  exportModal,
  formatterRequiredFormula,
  formatterValueToSetStatus,
  formatterUploadImgNumber
} from "./control-attribute-transaction";

import { schema } from "@cloudpivot/form";
import { utils } from "@cloudpivot/common";

const DateHandle = utils.DateHandle;

export const ControlCNNameType: any = {
  "0": "标签",
  "1": "单行文本",
  "2": "长文本",
  "3": "日期",
  "4": "数值",
  "5": "单选框",
  "6": "复选框",
  "7": "下拉框",
  "8": "逻辑",
  "9": "附件",
  "10": "图片",
  "11": "地图定位",
  "12": "日期范围",
  "13": "数值范围",
  "14": "地址",
  "15": "手写签名",
  // "16": "控件Tips",
  // '50': '人员单选',
  // '51': '人员多选',
  // '60': '部门单选',
  // '61': '部门多选',
  "50": "选人控件",
  "51": "选人控件",
  "60": "选人控件",
  "61": "选人控件",
  "70": "审批意见",
  "80": "关联表单",
  "90": "关联查询",
  "100": "单据号",
  "101": "创建人",
  "102": "创建人部门",
  "103": "修改人",
  "104": "创建时间",
  "105": "修改时间",
  "106": "拥有者",
  "200": "分组标题",
  "201": "子表",
  "202": "描述说明",
  "203": "表单标题",
  "300": "子表统计"
};

/**
 * 事件属性值的枚举
 */
export enum ScriptsType {
  onChange = 1,
  onUpload,
  onDelete,
  onAddRow,
  onDeleteRow,
  onLoadBefore,
  onLoadAfter
}

// 基础属性的扩展
export const baseAttributeMapOptionsExtend: any = {
  "1": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.ControlType
    }
  },
  "2": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      // attrType: DropdownAttributeType.ControlType
      options: {
        list: [
          {
            value: 2,
            label: "长文本"
          },
          {
            value: 7,
            label: "下拉框"
          }
        ]
      }
    }
  },
  "5": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.ControlType
    }
  },
  "6": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.ControlType
    }
  },
  "7": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.ControlType
    }
  },
  // '11': {
  //   'widgetType': {
  //     type: ControlAttributeType.Dropdown,
  //     attrType: DropdownAttributeType.ControlType
  //   }
  // },
  "9": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: 9,
            label: "附件"
          },
          {
            value: 10,
            label: "图片"
          },
          {
            value: 15,
            label: "手写签名"
          }
        ]
      }
    }
  },
  "10": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: 9,
            label: "附件"
          },
          {
            value: 10,
            label: "图片"
          },
          {
            value: 15,
            label: "手写签名"
          }
        ]
      }
    }
  },
  "11": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: 11,
            label: "地图定位"
          },
          {
            value: 14,
            label: "地址"
          }
        ]
      }
    }
  },
  "14": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: 11,
            label: "地图定位"
          },
          {
            value: 14,
            label: "地址"
          }
        ]
      }
    }
  },
  "15": {
    widgetType: {
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: 9,
            label: "附件"
          },
          {
            value: 10,
            label: "图片"
          },
          {
            value: 15,
            label: "手写签名"
          }
        ]
      }
    }
  },
  "202": {
    name: {
      dom: "a-textarea", // 方便修改描述说明控件的内容而做的一个标识，其他控件没有
      label: "描述",
      type: ControlAttributeType.String,
      value: "",
      options: {
        regexps: {
          // required: '控件名称不能为空',
          maxLength: {
            len: 2000,
            message: "长度不能超过2000"
          },
          regexps: [
            {
              regexp: /^[^ ]/,
              message: "不能以空格开始"
            }
          ]
        }
      }
    }
  }
  // 暂时不支持
  // '2': {
  //   'widgetType': {
  //     type: ControlAttributeType.Dropdown,
  //     options: {
  //       list: [
  //         {
  //           value: 'multiLineText',
  //           label: '多行文本框'
  //         },
  //         {
  //           value: 'onlineEditingText',
  //           label: '在线编辑文本框' // ******** 属于展示，未开发的功能 *******
  //         }
  //       ]
  //     }
  //   }
  // }
};

export const baseAttributeMap: { [key: string]: ControlAttributeOptions } = {
  name: {
    label: "控件名称",
    type: ControlAttributeType.String,
    value: "",
    options: {
      regexps: {
        required: "控件名称不能为空",
        maxLength: {
          len: 50,
          message: "长度不能超过50"
        },
        regexps: [
          {
            regexp: /^[^ ]/,
            message: "不能以空格开始"
          }
        ]
      }
    }
  },
  dataItemName: {
    label: "绑定数据项名称",
    type: ControlAttributeType.String,
    value: "",
    options: {
      regexps: {
        required: "绑定数据项名称不能为空",
        maxLength: {
          len: 28,
          message: "长度不能超过28字节"
        },
        regexps: [
          {
            regexp: /^[^ ]/,
            message: "表单名称不能已空格开始，请已英文字母开始"
          },
          {
            regexp: /^[A-Za-z][A-Za-z0-9_]+$/,
            message: "请已英文字母开始，支持英文字母、数字、下划线"
          }
        ]
      },
      transaction: ({ attr, allControls, attrs }: any) => {
        // debugger;
        const { dataItem } = allControls;
        if (dataItem) {
          attr.dataItem = dataItem;
          attr.options.disabled = dataItem.published || dataItem.isSystem;
        }

        const options = attrs.find(res => {
          return res.field === "options";
        });
        // if (options) {
        //   try {
        //     JSON.parse(options.value);
        //     options.value = '选项1;选项2;选项3'
        //   } catch {

        //   }
        // }
      }
      // callback(controlkey, currentAttr, allAttrs, vm) {
      //   // 显示规格变化时,校验规则需要清空
      //  debugger;
      // }
    }
  },
  widgetType: {
    label: "控件类型",
    type: ControlAttributeType.String,
    value: "",
    options: {
      disabled: true
      // transaction: ({ attr, allControls }: any) => {
      //   debugger;
      // },
      // callback: (key: string, attr: any, attrs: any, vm: any) => {
      //   debugger;
      // }
    }
  },
  visible: {
    label: "是否可见",
    type: ControlAttributeType.Boolean,
    value: ""
  },
  style: {
    label: "控件样式",
    type: ControlAttributeType.String,
    value: "",
    options: {
      regexps: {
        maxLength: {
          len: 200,
          message: "长度不能超过200字节"
        }
      }
    }
  },
  tips: {
    label: "控件Tips",
    type: ControlAttributeType.String,
    value: "",
    options: {
      regexps: {
        maxLength: {
          len: 200,
          message: "长度不能超过200字节"
        }
      }
    }
  },
  width: {
    label: "列宽px",
    type: ControlAttributeType.String,
    value: "",
    options: {
      regexps: {
        required: "列宽不能为空",
        regexps: [
          {
            regexp: /^[1-9]\d*$/,
            message: "只能输入正整数"
          },
          {
            regexp: (value: string) => parseFloat(value) <= 885,
            message: "不能超过最大宽度885"
          }
        ]
      }
    }
  }
};
// 表单属性
export const formAttributeMap: { [key: string]: ControlAttributeOptions } = {
  code: {
    value: "",
    type: ControlAttributeType.String,
    label: "表单编码",
    options: {
      disabled: true,
      hideField: ["sheetData", "shortCode"]
      // hideField: (value: string) => {
      //   debugger
      //   if (value) {
      //     return ['id'];
      //   } else {
      //     return []
      //   }
      // }
    }
  },
  name: {
    value: "",
    type: ControlAttributeType.String,
    label: "表单名称",
    options: {
      regexps: {
        required: "表单名称不能为空",
        maxLength: {
          len: 50,
          message: "50字符以内，不以空格开头"
        },
        regexps: {
          regexp: /^[^ ]/,
          message: "50字符以内，不以空格开头"
        }
      }
      // fieldDisplay:[[],['id']],
    }
  },
  summary: {
    value: "",
    tip: {
      content: i18n.t("languages.Apps.SummaryTips"),
      icon: "question-circle-o"
    } as any,
    type: ControlAttributeType.Dropdown,
    attrType: DropdownAttributeType.Summary,
    label: "数据标题"
  },
  externalLinkAble: {
    value: "",
    type: ControlAttributeType.Modal,
    attrType: ModalAttributeType.ExternalLink,
    options: {
      type: ModalAttributeType.ExternalLink,
      // exportModal,
      importModal: (attr: any, attrs: any) => {
        const sheetData: any = attrs.find((res: any) => {
          return res.field === "sheetData";
        });

        // debugger
        return {
          schemaCode: sheetData.value.schemaCode,
          sheetCode: sheetData.value.code,
          shortCode: sheetData.value.shortCode,
          formId: sheetData.value.id,
          type: ModalAttributeType.ExternalLink,
          value: attr.value
        };
      },
      exportModal: (
        data: any,
        attr: any,
        attrs: any,
        callback: Function,
        vm: Vue
      ) => {
        const shortCode: any = attrs.find(
          (res: any) => res.field === "shortCode"
        );
        const externalLinkAble: any = attrs.find(
          (res: any) => res.field === "externalLinkAble"
        );
        externalLinkAble.value = data.value;
        shortCode.value = data.shortCode;
        vm.$emit("change", "shortCode", data.shortCode);
        return data.value;
      },
      formatter: (s: any, c: any) => {
        if (s) {
          return "已开启";
        } else {
          return "未开启";
        }
      }
    } as any,
    label: "公开外链"
  },
  sheetData: {
    value: "",
    type: ControlAttributeType.String,
    label: "通用字段",
    options: {
      // hideField:['id']
    }
  },
  shortCode: {
    value: "",
    type: ControlAttributeType.String
  },
  qrCodeAble: {
    value: "",
    type: ControlAttributeType.Dropdown,
    label: "表单二维码",
    options: {
      list: [
        {
          value: "open",
          label: "启用"
        },
        {
          value: "close",
          label: "停用"
        }
      ]
    }
  },
  pdfAble: {
    value: "",
    type: ControlAttributeType.Dropdown,
    label: "启用打印模板",
    options: {
      list: [
        {
          value: "true",
          label: "启用"
        },
        {
          value: "false",
          label: "停用"
        }
      ]
    }
  },
  print: {
    value: "",
    type: ControlAttributeType.Modal,
    attrType: ModalAttributeType.Print,
    label: "打印模板",
    options: {
      importModal: (attr: any, attrs: any) => {
        const sheetData: any = attrs.find((res: any) => {
          return res.field === "sheetData";
        });

        // debugger
        return sheetData;
      },
      exportModal,
      formatter: (s: any, c: any) => {
        if (s) {
          return "已设置";
        } else {
          return "未设置";
        }
      }
    }
  },
  layoutType: {
    value: "",
    type: ControlAttributeType.Dropdown,
    label: "控件布局方式",
    options: {
      list: [
        {
          value: "horizontal",
          label: "左右布局"
        },
        {
          value: "vertical",
          label: "上下布局"
        }
      ]
    }
  },
  borderMode: {
    value: "",
    type: ControlAttributeType.Dropdown,
    label: "边框模式",
    options: {
      list: [
        {
          value: "open",
          label: "启用"
        },
        {
          value: "close",
          label: "停用"
        }
      ]
    }
  }
};

/**
 * string type  控件类型
 * string field 控件字段
 * ControlAttributeOptions 字段属性
 *
 */
const controlAttributeMap: {
  [key: string]: { [key: string]: ControlAttributeOptions };
} = {
  // 单文本
  "1": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 正则校验
    regexp: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RegexpFormula,
      label: "正则校验",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    //正则错误提示
    regexpText: {
      value: "",
      type: ControlAttributeType.String,
      label: "正则错误提示",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    }, // 新增****************************************************
    // 提示文字
    placeholder: {
      value: "",
      type: ControlAttributeType.String,
      label: "提示文字",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 文本最大长度
    maxLength: {
      value: "",
      type: ControlAttributeType.String,
      label: "最大长度",
      options: {
        regexps: {
          required: "最大长度不能为空",
          regexps: [
            {
              regexp: /^[1-9]\d*$/,
              message: "只能输入正整数"
            },
            {
              regexp: (value: string) => parseFloat(value) <= 200,
              message: "最大长度不能超过200"
            }
          ]
        }
      }
    }, // 新增****************************************************
    // 去重规则
    noRepeat: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "去重校验"
    }
  },
  // 长文本
  "2": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 输入框样式
    textAreaType: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "longText",
            label: "多行文本"
          },
          {
            value: "current",
            label: "富文本"
          }
        ],
        hideField: (attr: any) => {
          if (!attr || attr === "longText") {
            return [];
          } else {
            return ["placeholder", "maxLength"];
          }

          // (attr ? [] : ["imageQuality"])
        }
      },
      label: "输入框样式"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        regexps: {
          maxLength: {
            len: 4000,
            message: "长度不能超过4000"
          }
        }
      }
    },
    // 提示文字
    placeholder: {
      value: "",
      type: ControlAttributeType.String,
      label: "提示文字",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200"
          }
        }
      }
    },
    // 文本最大长度
    maxLength: {
      value: "",
      type: ControlAttributeType.String,
      label: "最大长度",
      options: {
        regexps: {
          required: "最大长度不能为空",
          regexps: [
            {
              regexp: /^[1-9]\d*$/,
              message: "只能输入正整数"
            },
            {
              regexp: (value: string) => parseFloat(value) <= 4000,
              message: "最大长度不能超过4000"
            }
          ]
        }
      }
    }
  },
  // 日期类型
  "3": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        // dateFormat: 'YYYY-MM-DD'
        list: [
          {
            value: "none",
            label: "空"
          },
          {
            value: "current",
            label: "当前时间"
          },
          {
            value: "dataItemDefault",
            label: "数据项默认值"
          }
        ]
        // transaction: ({ attr, attrs }: any) => {
        //   if (!['none', 'current'].includes(attr.value)) {
        //     attr.value = 'dataItemDefault';
        //   }
        // },
        // formatter: (attrs:any) =>{
        //   debugger
        //   const defaultValueAttr = attrs.find((_attr: any) => {
        //     return _attr.field == 'defaultValue';
        //   });
        //   if (!['none', 'current', ''].includes(defaultValueAttr.value)) {
        //     defaultValueAttr.value = 'dataItemDefault';
        //   }
        //   return defaultValueAttr.value;

        // }
      },
      label: "默认值"
    },
    // 显示格式
    format: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "YYYY-MM",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM")
          },
          {
            value: "YYYY-MM-DD",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD")
          },
          {
            value: "YYYY-MM-DD HH:mm",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD HH:mm")
          },
          {
            value: "YYYY-MM-DD HH:mm:ss",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss")
          }
        ],
        transaction: ({ attr, attrs }: any) => {
          const defaultValueAttr = attrs.find((_attr: any) => {
            return _attr.field == "defaultValue";
          });
          defaultValueAttr.options.dateFormat = attr.value;
          if (attr.value.indexOf("HH") > -1) {
            defaultValueAttr.options.showTime = true;
          } else {
            defaultValueAttr.options.showTime = false;
          }
        },
        callback(controlkey, currentAttr, allAttrs, vm) {
          // 显示规格变化时,校验规则需要清空
          vm.allControls.control.options.verifyFormula = "";
        }
      },
      label: "显示格式"
    },
    // 提交校验规则
    verifyFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.VerifyFormulaDate,
      label: "提交校验规则",
      options: {
        formatter: formatterValueToSetStatus
      }
    }
    // 最小日期
    // minDate: {
    //   value: "",
    //   type: ControlAttributeType.Modal,
    //   attrType: ModalAttributeType.MinDate,
    //   label: "最小日期",
    //   options: {
    //     importModal: (attr: any, attrs: any) => {
    //       const maxDateAttr = attrs.find((a: any) => a.field === "maxDate");
    //       const maxDate = maxDateAttr.value;

    //       return {
    //         value: attr.value,
    //         maxDate
    //       };
    //     }
    //   }
    // },
    // maxDate: {
    //   value: "",
    //   type: ControlAttributeType.Modal,
    //   attrType: ModalAttributeType.MaxDate,
    //   label: "最大日期",
    //   options: {
    //     importModal: (attr: any, attrs: any) => {
    //       const minDateAttr = attrs.find((a: any) => a.field === "minDate");
    //       const minDate = minDateAttr.value;

    //       return {
    //         value: attr.value,
    //         minDate
    //       };
    //     }
    //   }
    // }
  },
  // 数值
  "4": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        regexps: {
          regexps: [
            {
              regexp: /^-?(\.|(0|(\d){0,19}))?(\.\d{0,3})?$/,
              message: "只能输入数值类型，最大长度19位数，精度3位数"
            }
          ]
        }
      }
    },
    // 计算规则
    computeFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ComputeFormula,
      label: "计算规则",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // // 正则校验
    // 'regexp': {
    //   value: '',
    //   type: ControlAttributeType.Modal,
    //   attrType: ModalAttributeType.RegexpFormula,
    //   label: '正则校验',
    //   options: {
    //     modalType: 'number',
    //     transaction: ({ attr, attrs }: any) => {
    //       if (!!attr.value) {
    //         const defaultValue = attrs.find((item: any) => item.field === 'defaultValue');
    //         const regexp = defaultValue.options.regexps.regexps[1] || { regexp: null, message: null };
    //         regexp.regexp = new RegExp(attr.value.substring(1, attr.value.length - 1));
    //         defaultValue.options.regexps.regexps[1] = regexp;
    //       }
    //     }
    //   }
    // },
    // 'regexpText': {
    //   value: '',
    //   type: ControlAttributeType.String,
    //   label: '正则错误提示',
    //   options: {
    //     transaction: ({ attr, attrs }: any) => {
    //       const regexp = attrs.find((item: any) => item.field === 'regexp');
    //       if (!!regexp) {
    //         const defaultValue = attrs.find((item: any) => item.field === 'defaultValue');
    //         const regexp = defaultValue.options.regexps.regexps[1] || { regexp: null, message: null };
    //         regexp.message = attr.value;
    //         defaultValue.options.regexps.regexps[1] = regexp;
    //       }
    //     }
    //   }
    // },
    // 提示文字
    // 提示文字
    placeholder: {
      value: "",
      type: ControlAttributeType.String,
      label: "提示文字",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 数值格式
    format: {
      value: "",
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.Number,
      label: "数值格式"
    },
    // 提交校验规则
    verifyFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.VerifyFormulaNumber,
      label: "提交校验规则",
      options: {
        formatter: formatterValueToSetStatus
      }
    }
  },
  // 单选框
  "5": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 选项
    options: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RadioOption,
      label: "选项",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 方向 0水平 1垂直
    direction: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "horizontal",
            label: "横向"
          },
          {
            value: "vertical",
            label: "纵向"
          }
        ]
      },
      label: "方向"
    }
  },
  // 多选框
  "6": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 选项
    options: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.CheckboxOption,
      label: "选项",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 方向 0水平 1垂直
    direction: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "horizontal",
            label: "横向"
          },
          {
            value: "vertical",
            label: "纵向"
          }
        ]
      },
      label: "方向"
    }
  },
  // 下拉框
  "7": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        transaction({ attr, attrs, displayFields }: any) {
          // const type = 0;
          if (attr.dataItem && attr.dataItem.type === 1) {
            delete attr.options.regexps;
          }
          // debugger;
        },
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 选项
    options: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.CheckboxOption,
      label: "选项",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否显示空选项
    displayEmpty: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否显示空选项",
      options: {
        hideField: (value: string) => {
          if (!value) {
            return ["emptyValue"];
          } else {
            return [];
          }
        }
      }
    },
    // 空选项显示值
    emptyValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "空选项显示值",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 是否多选
    multi: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否多选",
      options: {
        transaction: ({ attr, attrs }: any) => {
          // debugger;
          const optionsAttr = attrs.find((_attr: any) => {
            return _attr.field == "options";
          });
          if (attr.value) {
            try {
              JSON.parse(optionsAttr.value);
              optionsAttr.value = "";
            } catch {}
          }
          optionsAttr.attrType = attr.value
            ? ModalAttributeType.CheckboxOption
            : ModalAttributeType.BizRadioOption;
        }
      }
    }
  },
  // 逻辑控件
  "8": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "默认值"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    }
  },
  // 附件
  "9": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.String,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 文件大小限制
    limit: {
      value: "",
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.UploadSize,
      label: "文件大小限制"
    },
    // 批量下载
    batch: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "批量下载"
    },
    // 限定文件类型
    fileTypes: {
      value: "",
      tip: {
        content:
          "设置附件上传的文件名格式，限定类型为office、图片、压缩包等，示例:.jpg,.gif.<br>以下类型不支持:<br>.php.php5.php4.php3.php2.php1&nbsp;.html.htm.phtml.pHp.pHp5.pHp4.pHp3.pHp2.pHp1&nbsp;.Html.Htm.pHtml.jsp.jspa.jspx.jsw.jsv.jspf.jtml.jSp&nbsp;.jSpx.jSpa.jSw.jSv.jSpf.jHtml.asp.aspx.asa.asax&nbsp;.ascx.ashx.asmx.cer.aSp.aSpx.aSa.aSax.aScx.aShx.aSmx.cEr.sWf.swf",
        icon: "question-circle-o"
      } as any,
      type: ControlAttributeType.String,
      label: "限定文件类型",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 上传事件
    onUpload: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "上传事件"
    },
    // 删除事件
    onDelete: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "删除事件"
    }
  },
  // 图片上传
  "10": {
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 文件大小限制
    limit: {
      value: "",
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.UploadSize,
      // options: {
      //   list: [
      //     {
      //       value: '1M',
      //       label: '1M'
      //     },
      //     {
      //       value: '10M',
      //       label: '10M'
      //     },
      //     {
      //       value: '20M',
      //       label: '20M'
      //     },
      //     {
      //       value: '50M',
      //       label: '50M'
      //     },
      //     {
      //       value: '100M',
      //       label: '100M'
      //     },
      //     {
      //       value: '512M',
      //       label: '512M'
      //     },
      //     {
      //       value: '1G',
      //       label: '1G'
      //     }
      //   ]
      // },
      label: "文件大小限制"
    },
    // 批量下载
    batch: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "批量下载"
    },
    // 上传数量
    number: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.UpdateImgNum,
      label: "上传数量",
      options: {
        formatter: formatterUploadImgNumber
      }
    },
    // 提示文字
    addWatermark: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "提示文字"
    },
    // 可压缩
    compressible: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "压缩",
      options: {
        hideField: (attr: any) => (attr ? [] : ["imageQuality"])
      }
    },
    // 图片质量30...100
    imageQuality: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: 30,
            label: "30%"
          },
          {
            value: 40,
            label: "40%"
          },
          {
            value: 50,
            label: "50%"
          },
          {
            value: 60,
            label: "60%"
          },
          {
            value: 70,
            label: "70%"
          },
          {
            value: 80,
            label: "80%"
          },
          {
            value: 90,
            label: "90%"
          }
        ]
      },
      label: "图片质量"
    },
    // 是否只允许拍照
    onlyShoot: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "只允许拍照"
    },
    // 上传事件
    onUpload: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "上传事件"
    },
    // 删除事件
    onDelete: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "删除事件"
    }
  },
  // 位置
  "11": {
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 精确范围
    range: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "1km",
            label: "1km"
          },
          {
            value: "500m",
            label: "500m"
          },
          {
            value: "200m",
            label: "200m"
          }
        ]
      },
      label: "精确范围"
    }, // 默认值****************************************************
    // 显示模式
    displayMode: {
      value: "",
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.Location,
      options: {
        list: [
          {
            value: "accurate",
            label: "准确定位"
          },
          {
            value: "arbitrary",
            label: "任意位置"
          }
        ],
        hideField: (value: string) => {
          if (value != "accurate") {
            return ["range"];
          } else {
            return [];
          }
        }
      },
      label: "显示模式"
    },
    //选项值 ****************************************************
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    }
  }, // 地址
  "14": {
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 位置类型
    locationType: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "pp-cc-aa",
            label: "省/市/县区"
          },
          {
            value: "pp-cc",
            label: "省/市"
          },
          {
            value: "pp",
            label: "省"
          }
        ]
      },
      label: "地址格式"
    },
    // 是否显示详细地址
    addressDetail: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "true",
            label: "true"
          },
          {
            value: "false",
            label: "false"
          }
        ]
      },
      label: "显示详细地址"
    },
    /**
     * 是否显示空值
     */
    showEmpty: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "true",
            label: "true"
          },
          {
            value: "false",
            label: "false"
          }
        ],
        transaction: ({ attr, attrs, displayFields }: any) => {
          if (attr.value === "false") {
            displayFields.push("emptyValue");
          } else {
            displayFields = displayFields.map((res: any) => {
              return res.field !== "emptyValue";
            });
          }
        }
      },
      label: "显示空选项"
    },
    /**
     * 空值
     */
    emptyValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "空值选项",
      options: {
        disabled: true
      }
    },
    //选项值 ****************************************************
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    }
  }, // 手写签名
  "15": {
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    displayEnd: {
      value: "",
      type: ControlAttributeType.String,
      label: "显示端",
      options: {
        disabled: true
      }
    }
  },
  // 人员单选
  "50": {
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 是否只读
    readonlyFormula: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否只读"
    },
    // 是否多选
    multi: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否多选",
      options: {
        list: [
          {
            value: "false",
            label: "单选"
          },
          {
            value: "true",
            label: "多选"
          }
        ],
        fieldDisplay: [["mappings"], []]
      }
    },
    deptVisible: {
      value: "",
      type: ControlAttributeType.Dropdown,
      label: "可选类型",
      options: {
        list: [
          {
            value: "all",
            label: "全部"
          },
          {
            value: "user",
            label: "用户"
          },
          {
            value: "org",
            label: "组织"
          }
        ],
        transaction: ({ attr, attrs, displayFields }: any) => {
          const defaultValueType = attrs.find(
            (attrItem: any) => attrItem.field === "defaultValueType"
          );
          if (attr.value == "user") {
            // displayFields.push(...['orgRoot', 'recursive']);
            defaultValueType.options.list = [
              {
                value: "",
                label: "空"
              },
              {
                value: "originator",
                label: "发起人"
              }
            ];
          } else if (attr.value == "org") {
            displayFields.push(...["roles", "mappings"]);
            defaultValueType.options.list = [
              {
                value: "",
                label: "空"
              },
              {
                value: "originatorDept",
                label: "发起人部门"
              }
            ];
          }
        },
        callback: (key: string, attr: any, attrs: any, vm: any) => {
          vm.updateAttribute(key, "defaultValueType", "");
        }
      }
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值"
    },
    defaultValueType: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.UserSelectValueSetting,
      label: "默认值",
      options: {
        hideField: ["defaultValue"],
        importModal: (attr: any, attrs: any) => {
          const opts: any = {};

          attrs.forEach((attrItem: any) => {
            opts[attrItem.field] = attrItem.value;
          });

          return opts;
        },
        callback: (key: string, attr: any, attrs: any, vm: any) => {
          const val =
            attr.value === schema.StaffSelectorValueType.None
              ? attrs.find((a: any) => a.field === "defaultValue").value
              : null;
          vm.updateAttribute(key, "defaultValue", val);
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          const val =
            data.type === schema.StaffSelectorValueType.None
              ? data.value
              : null;
          vm.$emit("change", "defaultValue", val);
          return data.type;
        },
        formatter: (valueType: string, attrs: any) => {
          let text = "";

          switch (valueType) {
            case schema.StaffSelectorValueType.None:
              let staff = attrs.find((a: any) => a.field === "defaultValue")
                .value;
              if (staff) {
                if (typeof staff === "string") {
                  staff = JSON.parse(staff);
                }
                text = staff.map((x: any) => x.name).join(";");
              }
              break;
            case schema.StaffSelectorValueType.Originator:
              text = "创建人";
              break;
            case schema.StaffSelectorValueType.OriginatorDept:
              text = "创建人部门";
              break;
          }

          return text;
        }
      }
    },
    // 组织根节点
    orgRoot: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值"
    },
    // 组织根节点
    orgRootValueType: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.UserSelectOrgValueSetting,
      label: "组织根节点",
      options: {
        hideField: ["orgRoot"],
        importModal: (attr: any, attrs: any) => {
          const opts: any = {};

          attrs.forEach((attrItem: any) => {
            opts[attrItem.field] = attrItem.value;
          });

          return opts;
        },
        callback: (key: string, attr: any, attrs: any, vm: any) => {
          let val = attrs.find((a: any) => a.field === "orgRoot").value;
          vm.updateAttribute(key, "orgRoot", val);
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          let val = data.value;
          vm.$emit("change", "orgRoot", val);
          return data.type;
        },
        formatter: (valueType: string, attrs: any) => {
          let orgRoot = attrs.find((a: any) => a.field === "orgRoot").value;

          let text = "";

          switch (valueType) {
            case schema.StaffSelectorValueType.None:
              if (orgRoot) {
                if (typeof orgRoot === "string") {
                  orgRoot = JSON.parse(orgRoot);
                }
                text = orgRoot.map((x: any) => x.name).join(";");
              }
              break;
            case schema.StaffSelectorValueType.OriginatorDept:
              text = "创建人部门";
              break;
            case schema.StaffSelectorValueType.Ref:
              if (typeof orgRoot === "string") {
                text = orgRoot;
              }
              break;
          }

          return text;
        }
      }
    },
    // // 组织根节点
    // 'orgRoot': {
    //   value: '',
    //   type: ControlAttributeType.Userpicker,
    //   label: '组织根节点',
    //   options: {
    //     pickerOptions: {
    //       key: 'orgRoot',
    //       selectOrg: true,
    //       selectUser: false,
    //       mulpitle: false,
    //       rootNode: true,
    //       showModel: true,
    //       showSelect: false,
    //       placeholder: '点击选择'
    //     },
    //     hideField: (val: string) => {
    //       return !!val ? [] : ['recursive'];
    //     }
    //   }
    // },
    // 是否递归展示
    recursive: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否递归展示"
    },
    // 角色范围
    roles: {
      value: "",
      type: ControlAttributeType.SelectTree,
      label: "角色范围"
    }, // 存储角色编码 ****************************************************
    // 映射关系
    mappings: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.UserSelectionMap,
      label: "映射关系"
    }
  },
  // 审批意见
  "70": {
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填"
    },
    // 默认值
    defaultValue: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认值",
      options: {
        regexps: {
          maxLength: {
            len: 2000,
            message: "长度不能超过2000字节"
          }
        }
      }
    },
    // 批量下载
    batch: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "批量下载"
    },
    // 上传附件
    showUpload: {
      value: "",
      type: ControlAttributeType.Boolean,
      options: {
        fieldDisplay: [[], ["batch", "fileTypes", "limit"]] // 0 true 要隐藏的字段 1 false 要隐藏的字段
      },
      label: "上传附件"
    },
    // 限定文件类型
    fileTypes: {
      value: "",
      tip: {
        content:
          "设置附件上传的文件名格式，限定类型为office、图片、压缩包等，示例:.jpg,.gif.<br>以下类型不支持:<br>.php.php5.php4.php3.php2.php1&nbsp;.html.htm.phtml.pHp.pHp5.pHp4.pHp3.pHp2.pHp1&nbsp;.Html.Htm.pHtml.jsp.jspa.jspx.jsw.jsv.jspf.jtml.jSp&nbsp;.jSpx.jSpa.jSw.jSv.jSpf.jHtml.asp.aspx.asa.asax&nbsp;.ascx.ashx.asmx.cer.aSp.aSpx.aSa.aSax.aScx.aShx.aSmx.cEr.sWf.swf",
        icon: "question-circle-o"
      } as any,
      type: ControlAttributeType.String,
      label: "限定文件类型",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    limit: {
      value: "",
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.UploadSize,
      label: "文件大小限制"
    },
    showSignature: {
      value: "",
      tip: {
        content: "仅移动端展示",
        icon: "question-circle-o"
      } as any,
      type: ControlAttributeType.Boolean,
      options: {
        fieldDisplay: [[], ["signatureIsRequired"]] // 0 true 要隐藏的字段 1 false 要隐藏的字段
      },
      label: "手写签名"
    },
    signatureIsRequired: {
      value: "",
      type: ControlAttributeType.Boolean,
      // options: {
      //   fieldDisplay: [[], ['signatureIsRequired']]  // 0 true 要隐藏的字段 1 false 要隐藏的字段
      // },
      label: "是否必填"
    }
  },
  // 关联表单
  "80": {
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 是否必填
    requiredFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RequiredFormula,
      label: "是否必填",
      options: {
        formatter: formatterRequiredFormula
      }
    },
    // 选择业务模型
    schemaCode: {
      value: "",
      type: ControlAttributeType.Tree,
      options: {
        // disabled: true
        hideField: (value: string) => {
          return !value ? ["queryCode"] : [];
        },
        callback: (key: string, attr: any, attrs: any, vm: any) => {
          vm.updateAttribute(key, "queryCode", "");
          vm.updateAttribute(key, "displayField", "name");
          vm.updateAttribute(key, "conditions", "");
          vm.updateAttribute(key, "mappings", "");
        }
      },
      label: "选择业务模型"
    },
    // 查询列表
    queryCode: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        dataList: (attr: any, attrs: any) => {
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          return listApi.getList(schemaCode).then(
            res => {
              if (res.errcode === 0) {
                // debugger;
                // if (res.data.length > 0) {
                //   attr.value = res.data[0].code;
                // }
                return res.data
                  .filter((l: any) => l.publish)
                  .map((x: any) => ({
                    value: x.code,
                    label: x.name
                  }));
              }
              return [];
            },
            () => Promise.resolve([])
          );
        },
        hideField: (value: string) => {
          return !value ? ["conditions"] : [];
        },
        callback: (key: string, attr: any, attrs: any, vm: any) => {
          vm.updateAttribute(key, "conditions", "");
        }
      },
      label: "查询列表"
    },
    // 显示字段
    displayField: {
      value: "",
      type: ControlAttributeType.Dropdown,
      label: "显示字段",
      options: {
        dataList(attr: any, attrs: any) {
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          if (schemaCode) {
            return listApi.getDataItems(schemaCode, true).then(
              res => {
                if (res.errcode === 0) {
                  let d: any[] = [];
                  let ignoreDateItem = [
                    DataItemType.Attachment,
                    DataItemType.Sheet,
                    DataItemType.RelevanceForm
                  ];
                  for (let item of res.data) {
                    if (!~ignoreDateItem.indexOf(item.propertyType)) {
                      d.push({
                        value: item.code,
                        label: item.name
                      });
                    }
                  }
                  if (!attr.value) attr.value = "name";
                  return d;
                }
                return [];
              },
              () => {
                attr.value = "";
                return Promise.resolve([]);
              }
            );
          } else {
            attr.value = "";
            return Promise.resolve([]);
          }
        }
      }
    },
    // PC查询条件
    conditions: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.QueryFormula,
      label: "pc查询条件",
      options: {
        importModal: (attr: any, attrs: any) => {
          const queryCodeAttr = attrs.find((a: any) => a.field === "queryCode");
          const queryCode = queryCodeAttr.value;
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          const mapping = attrs.find((a: any) => a.field === "mappings").value;

          return {
            schemaCode,
            queryCode,
            dataItem: queryCodeAttr.dataItem,
            type: "query",
            value: {
              query: attr.value,
              mapping: mapping
            }
          };
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          vm.$emit("change", "mappings", data.value.mapping); //改变属性需要提交
          //
          return data.value.query;
        },
        formatter: formatterValueToSetStatus
      }
    },
    // 移动端查询条件
    mobileConditions: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.QueryFormula,
      label: "mobile查询条件",
      options: {
        importModal: (attr: any, attrs: any) => {
          const queryCodeAttr = attrs.find((a: any) => a.field === "queryCode");
          const queryCode = queryCodeAttr.value;
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          // const mapping = attrs.find((a: any) => a.field === 'mappings').value;

          return {
            schemaCode,
            queryCode,
            dataItem: queryCodeAttr.dataItem,
            type: "onlyQuery",
            clientType: "APP",
            value: {
              query: attr.value
              // mapping: mapping
            }
          };
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          return data.value.query;
        },
        formatter: formatterValueToSetStatus
      }
    },
    // 映射字段
    mappings: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.QueryFormula,
      label: "映射字段",
      options: {
        importModal: (attr: any, attrs: any) => {
          const queryCodeAttr = attrs.find((a: any) => a.field === "queryCode");
          const queryCode = queryCodeAttr.value;
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          const query = attrs.find((a: any) => a.field === "conditions").value;

          return {
            schemaCode,
            queryCode,
            dataItem: queryCodeAttr.dataItem,
            type: "mapping",
            value: {
              query: query,
              mapping: attr.value
            }
          };
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          vm.$emit("change", "conditions", data.value.query); //改变属性需要提交
          //
          return data.value.mapping;
        },
        formatter: formatterValueToSetStatus
      }
    },
    // // 子表映射
    // 'sheetMappings': {
    //   value: '',
    //   type: ControlAttributeType.Modal,
    //   attrType: ModalAttributeType.SheetMappings,
    //   label: '映射子表',
    //   options: {
    //     importModal: (attr: any, attrs: any, displayFields: any) => {
    //       const schemaCode = attrs.find((a: any) => a.field === 'schemaCode').value;
    //       const value = attrs.find((a: any) => a.field === "sheetMappings").value;

    //       return {
    //         schemaCode,
    //         value
    //       };
    //     },
    //     transaction({ attrs, displayFields }: any) {
    //       const value = attrs.find((a: any) => a.field === "sheetMappings");
    //       if (value.dataItem.parentCode) {
    //         displayFields.push(value.field)
    //       }
    //     },
    //     exportModal: (data: any, attr: any, attrs: any, callback: Function, vm: Vue) => {
    //       vm.$emit('change', "conditions", data.value.query); //改变属性需要提交
    //       //
    //       return data.value;
    //     }
    //   }
    // },

    // 显示链接模式
    linkMode: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "显示链接模式"
      // options: {
      //   hideField: (value: string) => {
      //     return value ? [] : ['isAuthorize'];
      //   },
      // }
    },
    // 选择方式
    selectMode: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        // hideField: (value: string) => {
        //   return value === 'dropdown' ? ['isAuthorize'] : [];
        // },
        list: [
          {
            value: "popup",
            label: "弹出框"
          },
          {
            value: "dropdown",
            label: "下拉框"
          }
        ]
      },
      label: "选择方式"
    }, //显示为枚举类型 ******************************
    //临时授权
    isAuthorize: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "临时授权"
    },
    defaultVal: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.RelevanceFormDefaultVal,
      label: "默认值",
      options: {
        importModal: (attr: any, attrs: any) => {
          const queryCodeAttr = attrs.find((a: any) => a.field === "queryCode");
          const queryCode = queryCodeAttr.value;
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          // const query = attrs.find((a: any) => a.field === "conditions").value;

          return {
            schemaCode,
            queryCode,
            dataItem: queryCodeAttr.dataItem,
            type: "mapping",
            value: {
              query: attr.value
              // mapping: attr.value
            }
          };
        }
      }
    },
    // change事件
    onChange: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "change事件"
    }
  }, // 关联查询
  "90": {
    appPackageCode: {
      value: "",
      type: ControlAttributeType.String,
      options: {}
    },
    appFunctionCode: {
      value: "",
      type: ControlAttributeType.String,
      options: {}
    },
    // 选择业务模型
    schemaCode: {
      label: "业务模型",
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        dataList: (attr: any, attrs: any, vm: any) => {
          const selfSchemaCode = vm.$route.params.bizSchemaCode;
          return appsApi.listRelatives(selfSchemaCode).then(
            (res: any) => {
              if (res.errcode === 0) {
                return res.data.map((x: any) => ({
                  value: x.code,
                  label: x.name
                }));
              }
              return [];
            },
            () => Promise.resolve([])
          );
        },
        // disabled: true
        hideField: (value: string) => {
          return !value
            ? ["listCode", "fieldCode", "appPackageCode", "appFunctionCode"]
            : ["appPackageCode", "appFunctionCode"];
        },
        callback: (key: string, attr: any, attrs: any, vm: any) => {
          vm.updateAttribute(key, "listCode", "");
          vm.updateAttribute(key, "fieldCode", "");
        }
      }
    },
    // 'schemaCode': {
    //   label: '业务模型',
    //   value: '',
    //   type: ControlAttributeType.Tree,
    //   options: {
    //     // disabled: true
    //     hideField: (value: string) => {
    //       return !value ? ['listCode', 'fieldCode', 'appPackageCode', 'appFunctionCode'] : ['appPackageCode', 'appFunctionCode'];
    //     },
    //     callback: (key: string, attr: any, attrs: any, vm: any) => {
    //       vm.updateAttribute(key, 'listCode', '');
    //       vm.updateAttribute(key, 'fieldCode', '');
    //       const value = attr.value as string[];
    //       if (Array.isArray(value)) {
    //         if (value.length > 0) {
    //           vm.updateAttribute(key, 'schemaCode', value[value.length - 1]);
    //           if (value.length > 1) {
    //             vm.updateAttribute(key, 'appPackageCode', value[0]);
    //           }
    //           if (value.length > 2) {
    //             vm.updateAttribute(key, 'appFunctionCode', value[1]);
    //           }

    //           // const listCodeAttr = attrs.find((a: any) => a.field === 'listCode');

    //           // if (listCodeAttr && listCodeAttr.options.dataList) {
    //           //   vm.$nextTick(() => {
    //           //     listCodeAttr.options.dataList(listCodeAttr, attrs, vm).then((list: any) => {
    //           //       if (list.length > 0) {
    //           //         listCodeAttr.value = list[0].value;
    //           //       }
    //           //       listCodeAttr.options = Object.assign({}, listCodeAttr.options, {
    //           //         list: list
    //           //       });
    //           //       vm.$emit(
    //           //         "change",
    //           //         listCodeAttr.field,
    //           //         list[0].value
    //           //       );
    //           //     });
    //           //   });
    //           // }

    //         } else {
    //           vm.updateAttribute(key, 'schemaCode', '');
    //           vm.updateAttribute(key, 'appPackageCode', '');
    //           vm.updateAttribute(key, 'appFunctionCode', '');
    //         }
    //       }
    //     }
    //   },
    // },
    fieldCode: {
      label: "关联字段",
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        dataList: (attr: any, attrs: any, vm: any) => {
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;

          return appsApi
            .getDataItemList({
              schemaCode,
              isPublish: true
            })
            .then(
              res => {
                if (res.errcode === 0) {
                  // if (res.data.length > 0) {
                  //   attr.value = res.data[0].code;
                  // }
                  return res.data
                    .filter((x: any) => {
                      return (
                        x.propertyType === DataItemType.RelevanceForm &&
                        x.relativeCode === vm.$route.params.bizSchemaCode
                      );
                    })
                    .map((x: any) => ({
                      value: x.code,
                      label: `${x.name}[${x.code}]`
                    }));
                }
                return [];
              },
              () => Promise.resolve([])
            );
        }
      }
    },
    displayMode: {
      label: "显示模式",
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "list",
            label: "列表"
          },
          {
            value: "link",
            label: "链接"
          }
        ],
        hideField: (value: string) => {
          return value === "link"
            ? ["listCode", "conditions", "listDisplayMode"]
            : [];
        }
      }
    },
    // 查询列表
    listCode: {
      label: "查询列表",
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        dataList: (attr: any, attrs: any) => {
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;

          return listApi.getList(schemaCode).then(
            res => {
              if (res.errcode === 0) {
                // if (res.data.length > 0) {
                //   attr.value = res.data[0].code;
                // }
                return res.data
                  .filter((l: any) => l.publish)
                  .map((x: any) => ({
                    value: x.code,
                    label: x.name
                  }));
              }
              return [];
            },
            () => Promise.resolve([])
          );
        },
        // hideField: (value: string) => {
        //   return !value ? ['conditions', 'mappings'] : [];
        // },
        // callback: (key: string, attr: any, attrs: any, vm: any) => {

        // }
        hideField: (value: string) => {
          return !value ? ["conditions", "mobileConditions"] : [];
        }
      }
    },
    //临时授权
    isAuthorize: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "临时授权"
    },
    //展示方式
    listDisplayMode: {
      label: "展示方式",
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "tabs",
            label: "页签形式"
          },
          {
            value: "table",
            label: "详情列表"
          }
        ]
      }
    },
    // PC查询条件
    conditions: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.QueryFormula,
      label: "pc查询条件",
      options: {
        importModal: (attr: any, attrs: any) => {
          const queryCodeAttr = attrs.find((a: any) => a.field === "listCode");
          const queryCode = queryCodeAttr.value;
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          // const mapping = attrs.find((a: any) => a.field === 'mappings').value;

          return {
            schemaCode,
            queryCode,
            dataItem: queryCodeAttr.options.dataList,
            type: "onlyQuery",
            value: {
              query: attr.value
              // mapping: mapping
            }
          };
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          return data.value.query;
        },
        formatter: formatterValueToSetStatus
      }
    },
    // 移动端查询条件
    mobileConditions: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.QueryFormula,
      label: "mobile查询条件",
      options: {
        importModal: (attr: any, attrs: any) => {
          const queryCodeAttr = attrs.find((a: any) => a.field === "listCode");
          const queryCode = queryCodeAttr.value;
          const schemaCode = attrs.find((a: any) => a.field === "schemaCode")
            .value;
          // const mapping = attrs.find((a: any) => a.field === 'mappings').value;

          return {
            schemaCode,
            queryCode,
            dataItem: queryCodeAttr.options.dataList,
            type: "onlyQuery",
            clientType: "APP",
            value: {
              query: attr.value
              // mapping: mapping
            }
          };
        },
        exportModal: (
          data: any,
          attr: any,
          attrs: any,
          callback: Function,
          vm: Vue
        ) => {
          return data.value.query;
        },
        formatter: formatterValueToSetStatus
      }
    }
  },
  // 系统-流水号
  "100": {
    // 流水号编码
    prefix: {
      value: "",
      type: ControlAttributeType.String,
      label: "流水号编码",
      options: {
        regexps: {
          maxLength: {
            len: 200,
            message: "长度不能超过200字节"
          }
        }
      }
    },
    // 最大长度
    maxLength: {
      value: "",
      type: ControlAttributeType.Dropdown,
      label: "最大长度",
      options: {
        list: [
          {
            value: "4",
            label: "4"
          },
          {
            value: "5",
            label: "5"
          },
          {
            value: "6",
            label: "6"
          },
          {
            value: "7",
            label: "7"
          },
          {
            value: "8",
            label: "8"
          },
          {
            value: "9",
            label: "9"
          },
          {
            value: "10",
            label: "10"
          }
        ]
      }
    },
    // 重置策略时间
    resetDate: {
      // Year 使用有意义的枚举类型 ************************************
      // 'resetDate': 'Year' #############################3
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "none",
            label: "不重置"
          },
          {
            value: "DAY",
            label: "每天"
          },
          {
            value: "MONTH",
            label: "每月"
          },
          {
            value: "YEAR",
            label: "每年"
          }
        ]
      },
      label: "重置策略时间"
    },

    // 连接符
    delimiter: {
      value: "",
      type: ControlAttributeType.Dropdown,
      label: "连接符",
      options: {
        allowClear: true,
        list: [
          {
            value: "mark1",
            label: "-"
          },
          {
            value: "mark2",
            label: "#"
          },
          {
            value: "mark3",
            label: "_"
          }
        ],
        callback: (key: boolean, attr: any, attrs: any, vm: any) => {
          let val = attr.value || "";
          vm.updateAttribute(key, "delimiter", val);
        }
      }
    }
  },
  // 系统-创建人
  "101": {
    // a-label key="创建人姓名"
    // // 文本名称
    // 'name': '',
    // // 是否显示
    // 'visible': true,
    // // 样式
    // 'style': null
  },
  // 系统-创建人部门
  "102": {
    // // 文本名称
    // 'name': '',
    // // 是否显示
    // 'visible': true,
    // // 样式
    // 'style': null
  },
  // 系统-修改人
  "103": {},
  // 系统-修改时间
  "104": {
    // 显示格式
    format: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "YYYY-MM-DD",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD")
          },
          {
            value: "YYYY-MM-DD HH:mm",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD HH:mm")
          },
          {
            value: "YYYY-MM-DD HH:mm:ss",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss")
          }
        ]
      },
      label: "显示格式"
    }
  },
  // 系统-修改时间
  "105": {
    // 显示格式
    format: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "YYYY-MM-DD",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD")
          },
          {
            value: "YYYY-MM-DD HH:mm",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD HH:mm")
          },
          {
            value: "YYYY-MM-DD HH:mm:ss",
            label: DateHandle.dateFormat(new Date(), "YYYY-MM-DD HH:mm:ss")
          }
        ]
      },
      label: "显示格式"
    }
  },
  // 系统-拥有者
  "106": {
    // // 文本名称
    // 'name': '',
    // // 是否显示
    // 'visible': true,
    // // 样式
    // 'style': null
  },
  // 布局-分组标题
  "200": {
    // // 描述说明
    // 'description': {
    //   type: ControlAttributeType.String,
    //   label: '描述说明',
    //   value: '',
    //   options: {
    //     regexps: {
    //       maxLength: {
    //         len: 200,
    //         message: '长度不能超过200字节'
    //       }
    //     }
    //   }
    // },
    // // 标题
    // 'title': {
    //   type: ControlAttributeType.String,
    //   label: '标题',
    //   value: '',
    //   options: {
    //     regexps: {
    //       maxLength: {
    //         len: 200,
    //         message: '长度不能超过200字节'
    //       }
    //     }
    //   }
    // },
    // 对齐
    align: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "left",
            label: "左"
          },
          {
            value: "center",
            label: "中"
          },
          {
            value: "right",
            label: "右"
          }
        ]
      },
      label: "对齐"
    },
    // 默认展开
    expand: {
      type: ControlAttributeType.Boolean,
      label: "默认展开"
    }
    // // 显示条件
    // 'displayFormula': {
    //   value: '',
    //   type: ControlAttributeType.Modal,
    //   attrType: ModalAttributeType.DisplayFormula,
    //   label: '显示条件'
    // },
  },
  // 子表
  "201": {
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    },
    // 默认行数
    rows: {
      value: "",
      type: ControlAttributeType.String,
      label: "默认行数",
      options: {
        regexps: {
          required: "默认行数不能为空",
          regexps: [
            {
              regexp: /^[0-9]\d*$/,
              message: "只能输入正整数"
            },
            {
              regexp: (value: string) => parseFloat(value) <= 100,
              message: "默认行数不能超过100"
            }
          ]
        }
      }
    }, // ***************************
    // 是否编辑
    editable: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否编辑",
      options: {
        // disabled: true
        hideField: (value: boolean) => {
          return !value ? ["importable"] : [];
        },
        callback: (key: boolean, attr: any, attrs: any, vm: any) => {
          let { value } = attr;
          vm.updateAttribute(key, "importable", value);
        }
      }
    },
    // 是否编辑
    importable: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否导入"
    },
    // 是否能导出
    exportable: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否能导出"
    },
    importFormRelevanceForm: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        dataList: (attr: any, attrs: any) => {
          const list = [
            {
              value: "",
              label: "请选择"
            }
          ];
          if (attr.dataItem && attr.dataItem.properties) {
            attr.dataItem.properties.forEach(res => {
              if (res.type === 9) {
                const listItme = {
                  value: res.code,
                  label: res.name
                };
                list.push(listItme);
              }
            });
          }
          return new Promise((resolve, reject) => {
            resolve(list);
          });
        }
      },
      label: "从关联表单导入"
    },
    // 是否显示汇总行
    showTotal: {
      value: "",
      type: ControlAttributeType.Boolean,
      label: "是否显示汇总行"
    },
    // 是否显示汇总行
    mobileDisplayMode: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "waterfall",
            label: "瀑布样式"
          },
          {
            value: "table",
            label: "二维表"
          },
          {
            value: "page",
            label: "分页样式"
          }
        ]
      },
      label: "移动端样式"
    },
    // 新增行事件
    onAddRow: {
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "新增行事件",
      value: "true"
    },
    // 删除行事件
    onDeleteRow: {
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.ScriptInput,
      label: "删除行事件",
      value: ""
    }
  },
  // 描述说明
  "202": {
    // // 描述说明
    // 'description': {
    //   type: ControlAttributeType.String,
    //   label: '描述说明',
    //   value: '',
    //   options: {
    //     regexps: {
    //       maxLength: {
    //         len: 200,
    //         message: '长度不能超过200字节'
    //       }
    //     }
    //   }
    // },
    // // 标题
    // 'title': {
    //   type: ControlAttributeType.String,
    //   label: '标题',
    //   value: '',
    //   options: {
    //     regexps: {
    //       maxLength: {
    //         len: 200,
    //         message: '长度不能超过200字节'
    //       }
    //     }
    //   }
    // },
    // 对齐
    align: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "left",
            label: "左"
          },
          {
            value: "center",
            label: "中"
          },
          {
            value: "right",
            label: "右"
          }
        ]
      },
      label: "对齐"
    },
    // 显示条件
    displayFormula: {
      value: "",
      type: ControlAttributeType.Modal,
      attrType: ModalAttributeType.DisplayFormula,
      label: "显示条件",
      options: {
        formatter: formatterValueToSetStatus
      }
    }
  },
  // 表单标题
  "203": {
    // // 文本名称
    // 'name': '',
    // // 是否显示
    // 'visible': true,
    // // 样式
    // 'style': null
  },
  // 子表统计
  "300": {
    // 统计模式
    statisticMode: {
      value: "",
      type: ControlAttributeType.Dropdown,
      options: {
        list: [
          {
            value: "none",
            label: "不统计"
          },
          {
            value: "sum",
            label: "求和"
          },
          {
            value: "avg",
            label: "平均值"
          },
          {
            value: "min",
            label: "最小值"
          },
          {
            value: "max",
            label: "最大值"
          }
        ]
      },
      label: "统计模式"
    }, // 使用枚举值 *********************************************
    // 显示格式
    format: {
      value: "",
      type: ControlAttributeType.Dropdown,
      attrType: DropdownAttributeType.Number,
      label: "显示格式"
    } // 使用枚举值 *********************************************
  }
};
export default {
  BaseMap: baseAttributeMap,
  Map: controlAttributeMap
};
