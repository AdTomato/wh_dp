

// 列表默认状态/设置
export const listDesignCommonData = {
  // 查询条件
  choiceType: 1, // 1--下拉 2--弹出框
  defaultValue: '', // 默认值
  displayType: 0, // 控件类型 0-文本 1-单选 2-复选 3-下拉 4-范围
  endValue: '', // 结束值
  startValue: '', // 开始值
  options: '', // 选项值
  visible: true, // 是否可见
  relativeQueryCode: '', // 关联表单绑定列表
  defaultState: 1, // 逻辑形控件默认状态
  accurateSearch: false, // 位置控件 是否精确查找

  // 展示字段
  sortKey: 1,
  userOptionType: 0, // 选人控件类型 0-全部 1-人员 2-部门
  checked: false,
  hoverClass: false,
  direction: 1, // 排序 1 - 升序 和  2 - 降序


  width: 168, // 列表宽 根据字段类型取值3
  unit: 0, // 列宽单位 0-px 1-百分比
  sumType: 0, // 计算方式
  displayFormat: 1, // 展示方式
  popover: false, // 显示气泡
}

/* 列表操作 */
export const oprationCheckedMap = [
  {
    name: '新增',
    label: '新增',
    propertyName: '新增',
    actionCode: 'add',
    associationCode: '',
    associationType: 0,
    customService: false,
    queryActionType: 2,
    queryId: '',
    schemaCode: '',
    scopedSlots: '',
    serviceCode: '',
    serviceMethod: '',
    sortKey: 0,
    systemAction: false,
    icon: 'plus',
    checked: true,
    hoverClass: true,
    popover: false,
    value: 0,
    index: 0
  },
  // {
  //   name: '编辑',
  //   label: '编辑',
  //   propertyName: '编辑',
  //   actionCode: 'edit',
  //   associationCode: '',
  //   associationType: '',
  //   customService: false,
  //   queryActionType: 3,
  //   queryId: '',
  //   schemaCode: '',
  //   scopedSlots: '',
  //   serviceCode: '',
  //   serviceMethod: '',
  //   sortKey: 0,
  //   systemAction: false,
  //   icon: 'edit',
  //   checked: true,
  //   hoverClass: true,
  //   popover: false,
  //   value: 1,
  //   index: 0
  // },
  {
    name: '删除',
    label: '删除',
    propertyName: '删除',
    actionCode: 'delete',
    associationCode: '',
    associationType: '',
    customService: false,
    queryActionType: 4,
    queryId: '',
    schemaCode: '',
    scopedSlots: '',
    serviceCode: '',
    serviceMethod: '',
    sortKey: 0,
    systemAction: false,
    icon: 'delete',
    checked: true,
    hoverClass: true,
    popover: false,
    value: 2,
    index: 0
  },
  {
    name: '导入',
    label: '导入',
    propertyName: '导入',
    actionCode: 'import',
    associationCode: '',
    associationType: '',
    customService: false,
    queryActionType: 5,
    queryId: '',
    schemaCode: '',
    scopedSlots: '',
    serviceCode: '',
    serviceMethod: '',
    sortKey: 0,
    systemAction: false,
    icon: 'download',
    checked: true,
    hoverClass: true,
    popover: false,
    value: 3,
    index: 0
  },
  {
    name: '导出',
    label: '导出',
    propertyName: '导出',
    actionCode: 'export',
    associationCode: '',
    associationType: '',
    customService: false,
    queryActionType: 6,
    queryId: '',
    schemaCode: '',
    scopedSlots: '',
    serviceCode: '',
    serviceMethod: '',
    sortKey: 0,
    systemAction: false,
    icon: 'upload',
    checked: true,
    hoverClass: true,
    popover: false,
    value: 4,
    index: 0
  },
  {
    name: '打印二维码',
    label: '打印二维码',
    propertyName: '打印二维码',
    actionCode: 'qr_code',
    associationCode: '',
    associationType: '',
    customService: false,
    queryActionType: 8,
    queryId: '',
    schemaCode: '',
    scopedSlots: '',
    serviceCode: '',
    serviceMethod: '',
    sortKey: 0,
    systemAction: false,
    icon: 'qrcode',
    checked: true,
    hoverClass: true,
    popover: false,
    value: 5,
    index: 0
  },
];

//  显示字段默认值 根据字段显示
export const showFieldDefaultValByCode = {
  'id': '2155131313313',
  'name': '张三的事假申请',
  'creater': '张三',
  'modifier': '张三',
  'owner': '张三',
  'createdDeptId': '技术部',
  'createDeptId': '技术部',
  'ownerDeptId': '技术部',
  'createdTime': '2018-12-12 15:00',
  'modifiedTime': '2018-12-12 15:00',
  'sequenceNo': '20181201000001',
  'sequenceStatus': '进行中',
  'ownerDeptQueryCode': '进行中'
}

//  显示字段默认值 根据字段类型
export const showFieldDefaultValByType = {
  1: '描述详细信息',
  2: 6,
  3: '2018-12-12 15:00',
  4: '是',
  5: '张三',
  9: '年假信息'
}

// 按钮 默认title

export const btnPropertyName = {
  'add': '新增',
  'edit': '编辑',
  'delete': '删除',
  'import': '导入',
  'export': '导出'
}

// 占位符
export const queryPresentationPlaceholder = {
  htmlJson:'',
  columnsJson:'',
  actionsJson:''
}