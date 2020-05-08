import { nameValidator } from '@/common/utils';
export const rules = {
  name: [
    {
      required: true,
      message: '请填写数据项名称'
    },
    {
      validator: nameValidator,
      message: '请输入不以空格开头长度不超过50个字符'
    }
  ],
  code: [
    {
      required: true,
      message: '请填写数据项编码'
    },
    {
      pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,27}$/,
      message: '以字母开头,包括字母或下划线或数字,不超过28个字符'
    }
  ]
}

export const storageOptions = [
  {
    label: '创建索引',
    value: 'propertyIndex',
    disabled: false
  },
  {
    label: '不允许空',
    value: 'propertyEmpty',
    disabled: false
  }
];

export const relationBIzOptions = [
  {
    label: '创建索引',
    value: 'propertyIndex',
    disabled: true
  },
  {
    label: '不允许空',
    value: 'propertyEmpty',
    disabled: false
  }
];

// 数据项类型
export const dataItemTypeList: any[] = [
  {
    name: '短文本',
    disabled: false,
    index: '0'
  }, {
    name: '长文本',
    disabled: false,
    index: '1'
  }, {
    name: '数值型',
    disabled: false,
    index: '2'
  }, {
    name: '日期型',
    disabled: false,
    index: '3'
  }, {
    name: '逻辑型',
    disabled: false,
    index: '4'
  }, {
    name: '选人控件',
    disabled: false,
    index: '5'
  }, {
    name: '附件',
    disabled: false,
    index: '6'
  },
  //  {
  //   name: '审批意见',
  //   disabled: false,
  //   index: '7'
  // }, 
  {
    name: '关联表单',
    disabled: false,
    index: '9'
  },
  {
    name: '地址',
    disabled: false,
    index: '10'
  }
]

// 数据项类型
export const dataItemTypeSchema: any[] = [
  // {
  //   name: '审批意见',
  //   index: '7'
  // },
  {
    name: '子表',
    index: '8',
    disabled: false,
  }
]

// 子表表格
export const dataItemColumns: any[] = [
  {
    dataIndex: 'id',
    slots: { title: 'idTitle' },
    width: 60,
    align: 'center',
    scopedSlots: { customRender: 'id' }
  },
  {
    required: true,
    dataIndex: 'code',
    slots: { title: 'codeTitle' },
    scopedSlots: { customRender: 'code' },
    width: 110,
    align: 'left'
  },
  {
    required: true,
    dataIndex: 'name',
    slots: { title: 'nameTitle' },
    scopedSlots: { customRender: 'name' },
    width: 110,
    align: 'left'
  },
  {
    required: true,
    dataIndex: 'type',
    slots: { title: 'typeTitle' },
    scopedSlots: { customRender: 'type' },
    width: 138,
    align: 'left'
  },
  {
    dataIndex: 'defaultValue',
    slots: { title: 'defaultValueTitle' },
    scopedSlots: { customRender: 'defaultValue' },
    align: 'left'
  },
  {
    dataIndex: 'propertyIndex',
    slots: { title: 'propertyIndexTitle' },
    scopedSlots: { customRender: 'propertyIndex' },
    width: 60,
    align: 'center'
  },
  {
    dataIndex: 'propertyEmpty',
    slots: { title: 'propertyEmptyTitle' },
    scopedSlots: { customRender: 'propertyEmpty' },
    width: 100,
    align: 'center'
  },
  {
    dataIndex: 'operation',
    slots: { title: 'operationTitle' },
    // fixed: 'right',
    width: 60,
    align: 'right',
    scopedSlots: { customRender: 'operation' }
  }
]