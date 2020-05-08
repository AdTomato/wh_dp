import {
  EditableControlOptions,
  InputControlOptions,
  StyleControlOptions,
  NumberFormatType,
  DateValueType,
  LocationType,
  TextAreaType
} from "./form-control-options";

/**
 * 逻辑
 */
export class LogicOptions extends EditableControlOptions {
  /**
   * 默认值
   */
  defaultValue: Boolean = true;
}

/**
 * 位置
 */
export class LocationOptions extends InputControlOptions {
  /**
   * 精确范围
   */
  range: string = "500m";

  /**
   * 显示模式 accurate准确定位 arbitrary任意的
   */
  displayMode: string = "accurate";

  /**
   * 变更事件
   */
  onChange: string | null = null;
}

/**
 * 地址
 */

export class AddressOptions extends InputControlOptions {
  /**
   * 位置类型
   */
  locationType = LocationType.Area;

  /**
   * 是否显示详细地址
   */
  addressDetail: string = "true";
  /**
   * 是否显示空选项
   */
  showEmpty: string = "false";
  /**
   * 空值
   */
  emptyValue: string = "请选择";

  /**
   * 变更事件
   */
  onChange: string | null = null;
}

/**
 * 单文本
 */
export class TextOptions extends InputControlOptions {
  /**
   * 默认值
   */
  defaultValue: string | null = null;

  /**
   * 正则校验
   */
  regexp: string | null = null;
  /**
   * 正则错误提示
   */
  regexpText: string = "";

  /**
   * 水印
   */
  placeholder = "请输入";
  /**
   * 最大长度
   */
  maxLength = 128;
  /**
   * 去重校验
   */
  noRepeat = false;
}

/**
 * 数值
 */
export class NumberOptions extends InputControlOptions {
  /**
   * 默认值
   */
  defaultValue: string | null = null;

  /**
   * 水印
   */
  placeholder = "请输入";

  /**
   * 计算规则-值依赖
   */
  computeFormula: string = "";

  /**
   * 显示格式
   */
  format: NumberFormatType = NumberFormatType.Int;

  verifyFormula: string = "";
}

/**
 * 长文本
 */
export class TextareaOptions extends InputControlOptions {

  /**
   * 默认值
   */
  defaultValue: string | null = null;

  /**
   * 输入框样式
   */

  textAreaType: string = TextAreaType.LongText;

  /**
   *  最大长度
   */
  maxLength = 2000;

  /**
   * 水印
   */
  placeholder = "请输入";
}

/**
 * 日期
 */
export class DateOptions extends InputControlOptions {
  /**
   * 默认值
   */
  defaultValue: string = DateValueType.None;

  /**
   * 数据项默认值
   */
  dataItemDefault: string = "";

  /**
   * 显示模式
   * 0 YYYY-MM-DD
   * 1 YYYY-MM-DD hh:mm
   * 2 YYYY-MM-DD hh:mm:ss
   */
  format: string = "YYYY-MM-DD";

  // 最小值

  // min: Date | null = null
  minDate: string = ""; // 校验规则通过 verifyFormula配置

  /**
   * 最大值
   */
  // max: Date | null = null
  maxDate: string = ""; //校验规则通过 verifyFormula配置
  // 提交校验规则
  verifyFormula: string = "";
}

export class SelectControlOptions extends InputControlOptions {
  /**
   * 默认值
   */
  defaultValue: string = "";

  /**
   * 选项
   */
  options: string = "";
}

/**
 * 单选 & 复选
 */
export class CheckboxOptions extends SelectControlOptions {
  /**
   * 方向 horizontal 水平 vertical 垂直
   */
  direction: string = "horizontal";
}

/**
 * 下拉
 */
export class DropdownOptions extends SelectControlOptions {
  /**
   * 是否显示空选项
   */
  displayEmpty: boolean = true;

  /**
   * 空选项
   */
  emptyValue: string = "请选择";

  /**
   * 是否多选
   */
  multi: boolean = false;
}
