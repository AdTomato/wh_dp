import {
  FormControlOptions,
  StyleControlOptions,
  InputControlOptions,
  NumberFormatType
} from "./form-control-options";

/**
 * 选人控件可选类型
 */
export enum StaffSelectorSelectType {
  /**
   * 所有
   */
  All = "all",

  /**
   * 用户
   */
  User = "user",

  /**
   * 部门
   */
  Org = "org"
}

/**
 * 选人控件值类型
 */
export enum StaffSelectorValueType {
  /**
   * 空，取设置的固定值
   */
  None = "",

  /**
   * 创建人，前发起人
   */
  Originator = "originator",

  /**
   * 创建人部门，前发起人部门
   */
  OriginatorDept = "originatorDept",

  /**
   * 引用控件值
   */
  Ref = "ref"
}

export enum DisplayType {
  Text = "text",

  Tag = "tag"
}

/**
 * 选人控件
 */
export class StaffSelectorOptions extends InputControlOptions {
  /**
   * 是否多选
   */
  multi = false;

  /**
   * 是否可选组织
   * all组织和用户 user用户 org组织
   */
  deptVisible = StaffSelectorSelectType.All;

  // /**
  //  * 是否可选用户
  //  */
  // userVisible: Boolean = true

  /**
   * 默认值
   */
  defaultValue: any[] | null = null;

  /**
   * 默认值类型
   */
  defaultValueType = StaffSelectorValueType.None;

  /**
   * 组织根节点
   * 数组：选定的值；字符串：值表达式
   */
  orgRoot: any[] | string | null = null;

  /**
   * 组织根节点值类型
   */
  orgRootValueType = StaffSelectorValueType.None;

  /**
   * 递归的
   */
  recursive = true;

  /**
   * 角色范围
   */
  roles: string = "";

  /**
   * 映射关系
   */
  mappings: string = "";

  displayType = DisplayType.Tag;
}

/**
 * 上传限制
 */
export enum UploadLimitType {
  "1M" = "1M",

  "5M" = "5M",

  "10M" = "10M",

  "20M" = "20M",

  "50M" = "50M",

  "100M" = "100M",

  "200M" = "200M"
  // '512M' = '512M',

  // '1G' = '1G'
}

export class UploadOptions extends StyleControlOptions {
  /**
   * 显示条件
   */
  displayFormula = "";

  /**
   * 必填条件
   */
  requiredFormula = "";

  /**
   * 文件大小限制
   */
  // limit: string | null = '10M'
  limit: string = "5M";

  /**
   * 批量下载
   */
  batch: boolean = true;
}

export class BaseUploadOptions extends UploadOptions {
  /**
   * 上传附件事件
   */
  onUpload: string | null = null;

  /**
   * 删除附件事件
   */
  onDelete: string | null = null;
}

/**
 * 附件
 */
export class AttachmentOptions extends BaseUploadOptions {
  /**
   * 文件类型
   */
  fileTypes: string | null = null;
}

/**
 * 图片
 */
export class ImageUploadOptions extends BaseUploadOptions {
  /**
   * 上传数量 单张 unique 多张 batch
   */
  number: string = "batch";

  /**
   * 水印
   */
  addWatermark = false;

  /**
   * 图片质量30...100
   */
  imageQuality = 50;

  /**
   * 可压缩
   */
  compressible = false;

  /**
   * 是否只允许拍照
   */
  onlyShoot = false;
}

/**
 * 手写签名
 */
export class SignatureUploadOptions extends UploadOptions {
  displayEnd: string = "移动端";
}

/**
 * 审批意见
 */
export class ApprovalOpinionOptions extends UploadOptions {
  /**
   * 上传附件
   */
  showUpload: Boolean = true;

  /**
   * 上传文件格式
   */
  fileTypes: string | null = null;

  /**
   * 默认审批意见
   */
  defaultValue: string | null = null;

  /**
   * 手写签名
   */
  showSignature: boolean = true;

  /**
   * 手写签名是否必填
   */
  signatureIsRequired: Boolean = false;

  // /**
  //  * 显示常用意见
  //  */
  // showCommon: Boolean = true;

  // /**
  //  * 显示设置常用意见
  //  */
  // showCommonSetting: Boolean = true;

  // /**
  //  * 只显示最后一条意见
  //  */
  // onlyShowLast: Boolean = false;
}

/**
 * 子表显示模式
 */
export enum SheetDisplayMode {
  /**
   * 瀑布
   */
  Waterfall = "waterfall",

  /**
   * 分页
   */
  Page = "page",

  /**
   * 二维
   */
  Table = "table"
}

/**
 * 子表子表
 */
export class SheetOptions extends StyleControlOptions {
  /**
   * 默认行数
   */
  rows: number = 2;

  /**
   * 能否编辑
   */
  editable: boolean = true;
  /**
   * 能否导入
   */
  importable: boolean = true;

  /**
   * 能否导出
   */
  exportable: boolean = true;

  importFormRelevanceForm: string = '';

  /**
   * 显示合计
   */
  showTotal: boolean = false;

  /**
   * 显示条件
   */
  displayFormula = "";

  /**
   * 行新增事件
   */
  onAddRow: string | null = null;

  /**
   * 行删除事件
   */
  onDeleteRow: string | null = null;

  /**
   * 移动端显示模式
   */
  mobileDisplayMode = SheetDisplayMode.Page;

  // /**
  //  * 渲染前事件
  //  */
  // onLoadBefore: string | null = null

  // /**
  //  * 渲染后事件
  //  */
  // onLoadAfter: string | null = null
}

/**
 * 计算模式
 */
export enum AggregateType {
  /**
   * 不计算、不统计
   */
  None = "none",

  /**
   * 求和
   */
  Sum = "sum",

  /**
   * 平均
   */
  Avg = "avg",

  /**
   * 最小值
   */
  Min = "min",

  /**
   * 最大值
   */
  Max = "max"
}

/**
 * 子表统计选项
 */
export class SheetStatisticOptions implements FormControlOptions {
  /**
   * 统计模式
   */
  statisticMode = AggregateType.Sum;

  /**
   * 显示格式
   */
  format: NumberFormatType = NumberFormatType.Int;
}

export enum RelevanceFormSelectMode {
  Popup = "popup",

  Dropdown = "dropdown"
}

/**
 * 关联表单
 */
export class RelevanceFormOptions extends InputControlOptions {
  /**
   * 业务模型
   */
  schemaCode = "";

  /**
   * 查询列表编码
   */
  queryCode = "";
  /**
   * 显示字段
   * @URL http://redmine.h3bpm.com/issues/31131
   */
  displayField: string = "name";
  /**
   * 查询条件
   */
  conditions: string = "";

  /**
   * 移动端查询条件
   */
  mobileConditions: string = "";

  /**
   * 映射字段
   */
  mappings: string = "";

  /**
   * 显示链接模式
   */
  linkMode: boolean = true;

  /**
   * 选择数据方式
   * popup弹出框 | dropdown下拉框
   */
  selectMode = RelevanceFormSelectMode.Popup;

  /**
   * 临时授权
   */
  isAuthorize: boolean = true;
  // 默认值
  defaultVal: string = "";
}

export enum DispalyMode {
  Link = "link",

  List = "list"
}

export enum ListDispalyMode {
  Table = "table",

  Tabs = "tabs"
}

/**
 * 反向关联 关联查询
 */
export class ReverseRelevanceOptions extends StyleControlOptions {
  /**
   * 业务模型
   */
  schemaCode = "";

  /**
   * 关联字段
   */
  fieldCode = "";

  /**
   * 显示模式
   */
  displayMode = DispalyMode.List;

  /**
   * 列表编码
   */
  listCode = "";

  /**
   * 临时授权
   */
  // isAuthorize: boolean = true

  /**
   * 展示方式
   */
  listDisplayMode = ListDispalyMode.Table;

  /**
   * 查询条件
   */
  conditions: string = "";

  /**
   * 移动端查询条件
   */
  mobileConditions: string = "";

  // appPackageCode = ''

  // appFunctionCode = ''
}
