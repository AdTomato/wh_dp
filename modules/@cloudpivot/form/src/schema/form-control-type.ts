
/**
 * 表单控件类型
 */
export enum FormControlType {

  /**
   * 标签
   */
  Label = 0,

  /**
   * 单文本
   */
  Text = 1,

  /**
   * 长文本
   */
  Textarea = 2,

  /**
   * 日期
   */
  Date = 3,

  /**
   * 数值
   */
  Number = 4,

  /**
   * 单选
   */
  Radio = 5,

  /**
   * 复选
   */
  Checkbox = 6,

  /**
   * 下拉
   */
  Dropdown = 7,

  /**
   * 逻辑
   */
  Logic = 8,

  /**
   * 附件
   */
  Attachment = 9,

  /**
   * 图片
   */
  Image = 10,

  /**
   * 位置
   */
  Location = 11,

  /**
   * 日期范围
   */
  DateRange = 12,

  /**
   * 数值范围
   */
  NumberRange = 13,
  /**
   * 地址
   */
  Address = 14,

  /**
   * 签名
   */
  Signature = 15,
  /**
   * 基础控件times
   */
  Tips = 16,
  /**
   * 人员单选
   */
  StaffSelector = 50,

  /**
   * 人员多选
   */
  StaffMultiSelector = 51,

  /**
   * 部门单选
   */
  DepartmentSelector = 60,

  /**
   * 部门多选
   */
  DepartmentMultiSelector = 61,

  /**
   * 审批意见
   */
  ApprovalOpinion = 70,

  /**
   * 关联表单
   */
  RelevanceForm = 80,

  /**
   * 反向关联
   */
  ReverseRelevance = 90,

  /**
   * 系统-流水号
   */
  SequenceNo = 100,

  /**
   * 系统-创建人
   */
  CreateBy = 101,

  /**
   * 系统-创建人部门
   */
  CreateByParentId = 102,

  /**
   * 系统-修改人
   */
  ModifyBy = 103,

  /**
   * 系统-创建时间
   */
  CreatedTime = 104,

  /**
   * 系统-修改时间
   */
  ModifiedTime = 105,

  /**
   * 系统-拥有者
   */
  OwnerId = 106,

  /**
   * 系统-其他
   */
  SystemOther = 107,

  /**
   * 系统-单据状态
   */
  SequenceStatus = 108,

  /**
   * 布局-分组标题
   */
  Group = 200,

  /**
   * 子表
   */
  Sheet = 201,

  /**
   * 描述说明
   */
  Description = 202,

  /**
   * 表单标题
   */
  Title = 203,

  /**
   * 子表统计
   */
  SheetStatistic = 300,

  /**
   * HTML片段
   */
  Html = 400

}
