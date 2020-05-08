/* eslint-disable */
import { guid } from "@/utils/print-util";

export const borderDivs: object[] = [
  { key: '0px', ownStyle: '', style: 'width: 100px;', eleDom: '无边框' },
  { key: '1px', ownStyle: 'margin: 0 0 10px 0;', style: 'width: 100%;height: 1px;background: #666', eleDom: '' },
  { key: '2px', ownStyle: 'margin: 0 0 10px 0;', style: 'width: 100%;height: 2px;background: #666', eleDom: '' },
  { key: '3px', ownStyle: 'margin: 0 0 10px 0;', style: 'width: 100%;height: 3px;background: #666', eleDom: '' },
  { key: '4px', ownStyle: 'margin: 0 0 10px 0;', style: 'width: 100%;height: 4px;background: #666', eleDom: '' },
  { key: '5px', ownStyle: '', style: 'width: 100%;height: 5px;background: #666', eleDom: '' },
];

function generateFonts(num: number) {
  let tempArr: number[] = [];
  for (let i = 12; i <= num; i += 1) {
    tempArr.push(i);
  }
  return tempArr;
}

export const borderStyle: object = {
  top: 'background: rgba(118, 156, 249, 1);',
  right: 'background: rgba(118, 156, 249, 1);',
  bottom: 'background: rgba(118, 156, 249, 1);',
  left: 'background: rgba(118, 156, 249, 1);',
};

export const fontsArrays: number[] = generateFonts(50);

export const leftSide: object = {
  width: 236,
  minWidth: 234,
  maxWidth: 700,
  direction: 'left',
  collapsible: true
};

export const rightSide: object = {
  width: 361,
  minWidth: 361,
  maxWidth: 700,
  direction: 'right',
  collapsible: true
};

export const systemColumns: object[] = [
  { id: guid(), owner: '系统', propertyType: 202, name: "摘要", code: 'name', icon: "icon aufontAll h-icon-all-single-line-text" },
  { id: guid(), owner: '系统', propertyType: 100, name: "单据号", code: 'sequenceNo', icon: "icon aufontAll h-icon-all-text-multiline" },
  { id: guid(), owner: '系统', propertyType: 103, name: "创建人", code: 'creater', icon: "icon aufontAll h-icon-all-user-o" },
  { id: guid(), owner: '系统', propertyType: 102, name: "创建人部门", code: 'createdDeptId', icon: "icon aufontAll h-icon-all-creator" },
  { id: guid(), owner: '系统', propertyType: 106, name: "所有人", code: 'owner', icon: "icon aufontAll h-icon-all-user-list-o" },
  { id: guid(), owner: '系统', propertyType: 107, name: "所有人部门", code: 'ownerDeptId', icon: "icon aufontAll h-icon-all-department-single-se" },
  { id: guid(), owner: '系统', propertyType: 103, name: "修改人", code: 'modifier', icon: "icon aufontAll h-icon-all-user-modifier-o" },
  { id: guid(), owner: '系统', propertyType: 104, name: "创建时间", code: 'createdTime', icon: "icon aufontAll h-icon-all-clock-circle-o" },
  { id: guid(), owner: '系统', propertyType: 105, name: "修改时间", code: 'modifiedTime', icon: "icon aufontAll h-icon-all-clock-edit-o" }
];

export class CreateOneItem {
  // 拖拽生成每一条元素的数据结构，有利于拓展更多的属性，column和text有在用
  constructor(id: string, code: string, eleType: string, innerTxt: any, leftValue: number, topValue: number, width: number, height: number) {
    // @ts-ignore
    this.id = id; // 唯一标志
    // @ts-ignore
    this.code = code; // code值绑定数据项
    // @ts-ignore
    this.eleType = eleType; // eleType代表被拖拽的元素类型，目前支持字段column、文本text。
    // @ts-ignore
    this.innerTxt = innerTxt; // 文本，属性对应文本内容
    // @ts-ignore
    this.left = leftValue; // 鼠标距离浏览器左侧边框值，属性对应X
    // @ts-ignore
    this.top = topValue; // 鼠标距离浏览器上侧边框值，属性对应Y
    // @ts-ignore
    this.widthValue = width; // 元素宽，属性对应元素宽度W
    // @ts-ignore
    this.heightValue = height; // 元素高，属性对应元素高度H
    // @ts-ignore
    this.fillColorValue = 'transparent'; // 元素填充色，属性对应元素填充色，即背景色
    // @ts-ignore
    this.borderWidthValue = 1; // 元素边框宽值，即border-width
    // @ts-ignore
    this.borderTypeValue = 'dashed'; // 元素边框宽类型，即dashed，solid，none
    // @ts-ignore
    this.borderColorValue = '#ccc'; // 元素边框宽颜色
    // @ts-ignore
    this.fontSizeValue = 12; // 元素字体大小值
    // @ts-ignore
    this.fontColorValue = '#000'; // 元素字体颜色值
    // @ts-ignore
    this.fontIsWeight = false; // 元素字体是否加粗
    // @ts-ignore
    this.fontIsItalic = false; // 元素字体是否斜体
    // @ts-ignore
    this.fontIsUnderline = false; // 元素字体是否有下划线
    // @ts-ignore
    this.fontLCRNeat = 'center'; // 元素左中右对齐
    // @ts-ignore
    this.fontTCBNeat = 'middle'; // 元素上中下对齐
  }
}

export class CreatPic {
  // 拖拽生成每一条元素的数据结构，有利于拓展更多的属性，二维码、条形码、图片在用
  constructor(id: string, eleType: string, innerTxt: string, leftValue: number, topValue: number, width: number, height: number) {
    // @ts-ignore
    this.id = id; // 唯一标志
    // @ts-ignore
    this.eleType = eleType; // eleType代表被拖拽的元素类型，目前支持字段column、文本text。后续会支持img、line、rectangle
    // @ts-ignore
    this.innerTxt = innerTxt; // 图片、二维码、条形码
    // @ts-ignore
    this.left = leftValue; // 鼠标距离浏览器左侧边框值，属性对应X
    // @ts-ignore
    this.top = topValue; // 鼠标距离浏览器上侧边框值，属性对应Y
    // @ts-ignore
    this.widthValue = width; // 元素宽，属性对应元素宽度W
    // @ts-ignore
    this.heightValue = height; // 元素高，属性对应元素高度H
    // @ts-ignore
    this.qrCreateOrShow = 'create'; // 显示新增二维码还是查看二维码，默认新增
    // @ts-ignore
    this.barCodeKey = 'formColumn'; // 条形码查看条件,默认根据表单字段
    // @ts-ignore
    this.barCodeValue = 'sequenceNo'; // 条形码查看值，默认单据号
    // @ts-ignore
    this.picUrl = ''
  }
}

export class RectLine {
  // 拖拽生成每一条元素的数据结构，有利于拓展更多的属性，矩形和直在再用
  constructor(id: string, eleType: string, innerTxt: string, leftValue: number, topValue: number, width: number, height: number) {
    // @ts-ignore
    this.id = id; // 唯一标志
    // @ts-ignore
    this.eleType = eleType; // eleType代表被拖拽的元素类型，目前支持字段column、文本text。后续会支持img、line、rectangle
    // @ts-ignore
    this.innerTxt = innerTxt; // 矩形、直线
    // @ts-ignore
    this.left = leftValue; // 鼠标距离浏览器左侧边框值，属性对应X
    // @ts-ignore
    this.top = topValue; // 鼠标距离浏览器上侧边框值，属性对应Y
    // @ts-ignore
    this.widthValue = width; // 元素宽，属性对应元素宽度W
    // @ts-ignore
    this.heightValue = height; // 元素高，属性对应元素高度H
    // @ts-ignore
    this.borderWidthValue = 1; // 元素边框宽值，即border-width
    // @ts-ignore
    this.borderColorValue = '#000'; // 元素边框宽颜色
    // @ts-ignore
    // this.hasWhereBorders = ''; // 4边边框有无
    this.borders = {
      left : true,
      top: true,
      bottom: true,
      right: true
    };
    // @ts-ignore
    this.fillColorValue = 'transparent'; // 元素填充色，属性对应元素填充色，即背景色
    // @ts-ignore
    this.lineDirection = 'x'; // 直线的横竖方向
  }
}

export const iconTypes = [
  { propertyType: 0, name: '短文本', value: '测试文本', icon: 'icon aufont icon-base-text-singleline-o' },
  { propertyType: 1, name: '长文本', value: '测试文本', icon: 'icon aufont icon-base-text-multiline-o' },
  { propertyType: 2, name: '数值', value: '123', icon: 'icon aufontAll h-icon-all-number' },
  { propertyType: 3, name: '日期', value: new Date().toLocaleDateString(), icon: 'icon aufontAll h-icon-all-calendar-o' },
  { propertyType: 4, name: '逻辑', value: '是', icon: 'icon aufontAll h-icon-all-logic-switch-o' },
  { propertyType: 5, name: '选人控件', value: '选人控件', icon: 'icon aufont icon-base-adduser' },
  { propertyType: 6, name: '附件', value: '测试附件', icon: 'icon aufontAll h-icon-all-paperclip-o' },
  { propertyType: 7, name: '审批意见', value: '测试文本', icon: 'icon aufont icon-base-team-singlechoice-o' },
  { propertyType: 8, name: '子表', value: '表格测试文本', icon: 'icon aufont icon-base-profile' },
  { propertyType: 9, name: '关联表单', value: '关联表单标题', icon: 'icon aufont icon-base-form-related-o' },
  { propertyType: 10, name: '地理位置', value: 'XX省 XX市XX县 XX街道', icon: 'icon aufont icon-base-enviroment-o' },
  { propertyType: 100, name: "单据号", code: 'sequenceNo', type: "", value: '测试文本' },
  { propertyType: 101, name: "创建人", code: 'creater', type: "", value: '赵六' },
  { propertyType: 102, name: "创建人部门", code: 'createdDeptId', type: "", value: '测试部门' },
  { propertyType: 103, name: "修改人", code: 'modifier', type: "", value: '张三' },
  { propertyType: 104, name: "创建时间", code: 'createdTime', type: "", value: new Date().toLocaleDateString() },
  { propertyType: 105, name: "修改时间", code: 'modifiedTime', type: "", value: new Date().toLocaleDateString() },
  { propertyType: 106, name: "所有人", code: 'owner', type: "", value: '李老四' },
  { propertyType: 107, name: "所有人部门", code: 'ownerDeptId', type: "", value: '测试部门' },
  { propertyType: 202, name: "摘要", code: 'name', type: "", value: `admin ${new Date().toLocaleDateString()}` },
];


export class PrintNodeSettings {

  fontSize = 12

  horizontalAlign = HorizontalAlign.Center

  verticalAlign = VerticalAlign.Middle

  fontItalic = false

  fontBold = false

  fontUnderline = false

  fontColor = ''

  backgroundColor = ''


  static buildStyleOf(settings: PrintNodeSettings) {
    const style: any = {
      'font-size': `${settings.fontSize}px`,
      'text-align': settings.horizontalAlign,
      'vertical-align': settings.verticalAlign
      // height
    };

    if (settings.fontItalic) {
      style['font-style'] = 'italic';
    }

    if (settings.fontBold) {
      style['font-weight'] = 'bold';
    }

    if (settings.fontUnderline) {
      style['text-decoration'] = 'underline';
    }

    if (settings.fontColor) {
      style['color'] = settings.fontColor;
    }

    if (settings.backgroundColor) {
      style['background-color'] = settings.backgroundColor;
    }

    return style;
  }

}

export enum HorizontalAlign {

  Left = 'left',

  Center = 'center',

  Right = 'right'

}

export enum VerticalAlign {

  Top = 'top',

  Middle = 'middle',

  Bottom = 'bottom'

}

export abstract class PrintBlock extends PrintNodeSettings {

  borderWidth = 1; // 元素边框宽值，即border-width

  // @ts-ignore
  borderColor = '#d9d9d9'; // 元素边框宽颜色

  // @ts-ignore
  hasWhereBorders = ''; // 4边边框有无

}


export class SheetCell extends PrintNodeSettings {

  constructor(
    public parentId: string
  ) {
    super();
  }

}


export class SheetRowCell extends SheetCell {

  /**
   * 绑定数据源
   */
  bindSource: {
    code: string
    name: string
  } | null = null

}


export class SheetColumn extends SheetCell {

  rowSettings: SheetRowCell

  /**
   * 序号列
   */
  isSequence = false

  constructor(
    public parentId: string,
    public name: string,
    public widthValue: number
  ) {
    super(parentId);
    this.fontColor = 'rgba(0,0,0,0.85)';
    this.backgroundColor = '#fafafa';

    this.rowSettings = new SheetRowCell(parentId);
    this.rowSettings.fontColor = 'rgba(0,0,0,0.65)';
  }

}


export class Sheet extends PrintBlock {

  headHeight = 30

  bodyHeight = 30

  constructor(
    public id: string,
    public code : string,
    public eleType: string,
    public left: number,
    public top: number,
    public widthValue: number,
    public heightValue: number,
    public columns: SheetColumn[]
  ) {
    super();
  }

}