const liveValue = [{
  name: '动态值',
  index: 1,
  disabled: false
}]

const fixedVal = [
  {
    name: '固定值',
    index: 2,
    disabled: false
  }
]

const emptyVal = [
  {
    name: '为空',
    index: 3,
    disabled: false
  } 
]

const dataConditionColumns:any = [
  {
    dataIndex: 'dataItem',
    title: '数据字段',
    scopedSlots: { customRender: 'dataItem' },
    align: 'left',
    width: 300
  },
  {
    dataIndex: 'filterCondition',
    title: '过滤条件',
    scopedSlots: { customRender: 'filterCondition' },
    align: 'left',
    width: 200
  },
  {
    dataIndex: 'value',
    title: '值',
    scopedSlots: { customRender: 'value' },
    align: 'left',
    width: 180
  },
  {
    dataIndex: 'operation',
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 54
  },
]

const filterColumns:any = [
  {
    dataIndex: 'targetField',
    title: '目标模型数据字段',
    scopedSlots: { customRender: 'targetField' },
    align: 'left',
    width: 265
  },
  {
    dataIndex: 'operator',
    slots: { title: 'operatorTitle' },
    scopedSlots: { customRender: 'operator' },
    align: 'left',
    width: 115
  },
  {
    dataIndex: 'value',
    title: '值',
    scopedSlots: { customRender: 'value' },
    align: 'left',
    width: 116
  },
  {
    dataIndex: 'currentField',
    title: '当前模型数据字段',
    scopedSlots: { customRender: 'currentField' },
    align: 'left',
    width: 267
  },
  {
    dataIndex: 'operation',
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 39
  },
]

const dataActionColumns:any = [
  {
    dataIndex: 'targetField',
    title: '目标模型数据字段',
    scopedSlots: { customRender: 'targetField' },
    align: 'left',
    width: 265
  },
  {
    dataIndex: 'operator',
    slots: { title: 'operatorTitle' },
    scopedSlots: { customRender: 'operator' },
    align: 'left',
    width: 115
  },
  {
    dataIndex: 'value',
    title: '值',
    scopedSlots: { customRender: 'value' },
    align: 'left',
    width: 116
  },
  {
    dataIndex: 'currentField',
    title: '当前模型数据字段',
    scopedSlots: { customRender: 'currentField' },
    align: 'left',
    width: 267
  },
  {
    dataIndex: 'operation',
    title: '操作',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 39
  },
]

const valGroup1 = [...liveValue, ...fixedVal, ...emptyVal];

const valGroup2 = [...liveValue, ...fixedVal];

const valGroup3 = [...liveValue, ...emptyVal];

// 数据动作操作：
const dataActionOperator = [
  {name: "等于", index: 1},
  {name: "累加", index: 2},
  {name: "扣减", index: 3},
]

export default {
  liveValue,
  fixedVal,
  emptyVal,
  valGroup1,
  valGroup2,
  valGroup3,
  dataConditionColumns,
  filterColumns,
  dataActionColumns
}
