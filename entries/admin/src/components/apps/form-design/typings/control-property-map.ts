
// import { default } from '../stores/data-items.store';

/**
 * 属性栏 行块信息
 */
export interface Block {

  /**
   * ID
   */
  id?: string,
  /**
   * 类型
   * 0: 不可选择框
   * 1：输入框
   * 2：选择框
   * 3：弹窗
   * 4：tree树
   * 5: textarea
   * 6：选人控件
   * 8: 布尔值的默认值
   */
  uiType: number,

  /**
   * label标题
   */
  label: string,

  /**
   * 默认值
   */
  value: any
}


/**
 * 表单属性 map
 */
export const summaryControl = [
  {
    id: 1,
    uiType: 0, // 不可编辑的文本框
    label: '表单编码',
    value: 'title'
  },
  {
    id: 2,
    uiType: 1, // 输入框
    label: '表单名称',
    value: '主题'
  },
  {
    id: 3,
    uiType: 2, // 选择框
    label: '摘要',
    value: [
      {
        index: 0,
        name: '单选框'
      },
      {
        index: 1,
        name: '复选框'
      }
    ]
  }
];
/**
 * 所有属性 map
 */
export const propertyGroup = [
  {
    title: '基础信息',
    groupOptions: {
      // type: -1, // 当前类型
      name: {
        uiType: 1,
        property: 'name',
        label: '控件名称',
        value: ''
      },
      dataItemName: {
        uiType: 0,
        property: 'dataItemName',
        label: '绑定数据项名称',
        value: ''
      },
      widgetType: {
        uiType: 0,
        widgetTypeFlag: 0,
        property: 'widgetType',
        label: '控件类型',
        value: ''
      },
      widgetType1: {
        uiType: 2,
        widgetTypeFlag: 1,
        property: 'widgetType',
        label: '控件类型',
        value: [
          {
            index: 1,
            name: '单行文本'
          },
          {
            index: 5,
            name: '单选框'
          },
          {
            index: 6,
            name: '复选框'
          },
          {
            index: 7,
            name: '下拉框'
          },
          {
            index: 11,
            name: '位置'
          }
        ]
      },
      widgetType2: {
        uiType: 2,
        widgetTypeFlag: 1,
        property: 'widgetType',
        label: '控件类型',
        value: [
          {
            index: 9,
            name: '附件'
          },
          {
            index: 10,
            name: '图片'
          }
        ]
      },
      widgetType3: {
        uiType: 2,
        widgetTypeFlag: 1,
        property: 'widgetType',
        label: '控件类型',
        value: [
          {
            index: 2,
            name: '多行文本框'
          },
          {
            index: 2000000, // 暂定2，未开发
            name: '在线编辑文本框'
          }
        ]
      },
      visible: {
        uiType: 2,
        label: '是否可见',
        property: 'visible',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      style: {
        uiType: 1,
        property: 'style',
        label: '控件样式',
        value: ''
      },
    }
  },
  {
    title: '控件属性',
    groupOptions: {
      // type: { // 当前类型，从infoCollector比较获取比较
      //   uiType: 1,
      //   property: 'type',
      //   label: '默认值',
      //   value: ''
      // },
      defaultValue: {
        uiType: 1,
        property: 'defaultValue',
        label: '默认值',
        value: ''
      },
      defaultValueBoolean: {
        uiType: 2,
        property: 'defaultValueBoolean',
        label: '默认值',
        value: [
          {
            index: 1,
            name: 'true'
          },
          {
            index: 0,
            name: 'false'
          }
        ]
      },
      defaultValueTree: {
        uiType: 6,
        property: 'defaultValueTree',
        label: '默认值',
        value: ''
      },
      valueDep: {
        uiType: 3,
        property: 'valueDep',
        label: '计算规则',
        value: ''
      },
      regexp: {
        uiType: 3,
        property: 'regexp',
        label: '正则校验',
        value: 'xxx'
      },
      placeholder: {
        uiType: 1,
        property: 'placeholder',
        label: '水印',
        value: 'xxx'
      },
      displayFormula: {
        uiType: 3,
        property: 'displayFormula',
        label: '显示条件',
        value: ''
      },
      requiredFormula: {
        uiType: 3,
        property: 'requiredFormula',
        label: '必填条件',
        value: 'xxx'
      },
      limit: {
        uiType: 2,
        property: 'limit',
        label: '文件大小限制',
        value: [
          {
            index: 0,
            name: '1M'
          },
          {
            index: 1,
            name: '10M'
          },
          {
            index: 2,
            name: '20M'
          },
          {
            index: 3,
            name: '50M'
          },
          {
            index: 4,
            name: '100M'
          },
          {
            index: 5,
            name: '512M'
          },
          {
            index: 6,
            name: '1G'
          }
        ]
      },
      number: {
        uiType: 2,
        property: 'number',
        label: '上传数量',
        value: [
          {
            index: 0,
            name: '单张'
          },
          {
            index: 1,
            name: '多张'
          }
        ]
      },
      fileTypes: {
        uiType: 1,
        property: 'fileTypes',
        label: '限定文件类型',
        value: 'xxx'
      },
      multi: {
        uiType: 2,
        property: 'multi',
        label: '选择模型',
        value: [
          {
            index: 0,
            name: '单选'
          },
          {
            index: 1,
            name: '多选'
          }
        ]
      },
      deptVisible: {
        uiType: 2,
        property: 'deptVisible',
        label: '可选组织',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      userVisible: {
        uiType: 2,
        property: 'userVisible',
        label: '可选用户',
        value: [
          {
            index: 1,
            name: 'true'
          },
          {
            index: 0,
            name: 'false'
          }
        ]
      },
      orgRoot: {
        uiType: 6,
        property: 'orgRoot',
        label: '组织根节点',
        value: ''
      },
      recursive: {
        uiType: 2,
        property: 'recursive',
        label: '是否递归展示',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      min: {
        uiType: 3,
        property: 'min',
        label: '最小值',
        value: 'xxx'
      },
      roles: {
        uiType: 4,
        property: 'roles',
        label: '角色范围',
        value: 'xxx'
      },
      mappings: {
        uiType: 3,
        property: 'mappings',
        label: '映射关系',
        value: ''
      },
      maxLength: {
        uiType: 1,
        property: 'maxLength',
        label: '最大长度',
        value: '2000'
      },
      max: {
        uiType: 3,
        property: 'max',
        label: '最大值',
        value: 'xxx'
      },
      statisticMode: {
        uiType: 2,
        property: 'statisticMode',
        label: '统计模式',
        value: [
          {
            index: 0,
            name: '不统计'
          },
          {
            index: 1,
            name: '求和'
          },
          {
            index: 2,
            name: '平均值'
          },
          {
            index: 3,
            name: '最小值'
          },
          {
            index: 4,
            name: '最大值'
          }
        ]
      },
      formatNum: { // 数值-显示格式
        uiType: 2,
        property: 'formatNum',
        label: '显示格式',
        value: [
          {
            index: 0,
            name: '空'
          },
          {
            index: 1,
            name: '2000'
          },
          {
            index: 2,
            name: '2,000.00'
          },
          {
            index: 3,
            name: '20%'
          },
          {
            index: 4,
            name: '20.0%'
          },
          {
            index: 5,
            name: '20.00%'
          },
          {
            index: 10,
            name: '￥2,000.00'
          },
          {
            index: 11,
            name: '$2,000.00'
          },
          {
            index: 12,
            name: '€2,000.00'
          },
          {
            index: 13,
            name: 'HK$2,000.00'
          }
        ]
      },
      format: {
        uiType: 2,
        property: 'format',
        label: '显示格式',
        value: [
          {
            index: 0,
            name: '2018-8-12'
          },
          {
            index: 1,
            name: '2018-8-12 13:00'
          },
          {
            index: 2,
            name: '2018-8-12 13:00:00'
          }
        ]
      },
      options: {
        uiType: 3,
        property: 'options',
        label: '选项',
        value: ''
      },
      direction: {
        uiType: 2,
        property: 'direction',
        label: '显示方向',
        value: [
          {
            index: 0,
            name: '横向'
          },
          {
            index: 1,
            name: '竖向'
          }
        ]
      },
      hasEmpty: {
        uiType: 2,
        property: 'hasEmpty',
        label: '是否显示空选项',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      empty: {
        uiType: 1,
        property: 'empty',
        label: '空选项值',
        value: 'xxx'
      },
      displayMode: {
        uiType: 2,
        property: 'displayMode',
        label: '显示模式',
        value: [
          {
            index: 0,
            name: '任意位置'
          },
          {
            index: 1,
            name: '准确定位'
          }
        ]
      },
      range: {
        uiType: 2,
        property: 'range',
        label: '精确范围',
        value: [
          {
            index: 0,
            name: '1km'
          },
          {
            index: 1,
            name: '500m'
          },
          {
            index: 2,
            name: '200m'
          }
        ]
      },
      defaultOpinion: {
        uiType: 1,
        property: 'defaultOpinion',
        label: '默认审批意见',
        value: ''
      },
      showCommon: {
        uiType: 2,
        property: 'showCommon',
        label: '显示常用意见',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      showCommonSetting: {
        uiType: 2,
        property: 'showCommonSetting',
        label: '显示设置常用意见',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      onlyShowLast: {
        uiType: 2,
        property: 'onlyShowLast',
        label: '只显示最后一条意见',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      showUpload: {
        uiType: 2,
        property: 'showUpload',
        label: '上传附件',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      batch: {
        uiType: 2,
        property: 'batch',
        label: '批量下载',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      rows: {
        uiType: 1,
        property: 'rows',
        label: '默认行数',
        value: ''
      },
      editable: {
        uiType: 2,
        property: 'editable',
        label: '编辑',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      exportable: {
        uiType: 2,
        property: 'exportable',
        label: '导出',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      showTotal: {
        uiType: 2,
        property: 'showTotal',
        label: '汇总行',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      code: {
        uiType: 1,
        property: 'code',
        label: '流水号编码',
        value: ''
      },
      description: {
        uiType: 5,
        property: 'description',
        label: '描述说明',
        value: ''
      },
      title: {
        uiType: 1,
        property: 'title',
        label: '标题',
        value: ''
      },
      align: {
        uiType: 2,
        property: 'align',
        label: '对齐',
        value: [
          {
            index: 0,
            name: '左'
          },
          {
            index: 1,
            name: '中'
          },
          {
            index: 2,
            name: '右'
          }
        ]
      },
      isAuthorize: {
        uiType: 2,
        property: 'isAuthorize',
        label: '临时授权',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      linkMode: {
        uiType: 2,
        property: 'linkMode',
        label: '显示链接模式',
        value: [
          {
            index: 0,
            name: 'false'
          },
          {
            index: 1,
            name: 'true'
          }
        ]
      },
      selectMode: {
        uiType: 2,
        property: 'selectMode',
        label: '选择方式',
        value: [
          {
            index: 0,
            name: '弹出框'
          },
          {
            index: 1,
            name: '下拉框'
          }
        ]
      },
      schemaCode: {
        uiType: 0,
        property: 'schemaCode',
        label: '选择业务模型',
        value: ''
      },
      queryCode: {
        uiType: 2,
        property: 'queryCode',
        label: '查询列表',
        value: [
          {
            index: 0,
            name: '待定'
          },
          {
            index: 1,
            name: '待定'
          },
          {
            index: 2,
            name: '待定'
          }
        ]
      },
      conditions: {
        uiType: 1,
        property: 'conditions',
        label: '查询条件',
        value: ''
      },
      mapFields: {
        uiType: 1,
        property: 'mapFields',
        label: '映射字段',
        value: ''
      },
      resetType: {
        uiType: 2,
        property: 'resetType',
        label: '流水号编码',
        value: [
          {
            index: 0,
            name: '不重置'
          },
          {
            index: 1,
            name: '每天'
          },
          {
            index: 2,
            name: '每周'
          },
          {
            index: 3,
            name: '每月'
          },
          {
            index: 4,
            name: '每年'
          }
        ]
      }
    }
  },
  {
    title: '控件事件',
    groupOptions: {
      onChange: {
        uiType: 5,
        property: 'onChange',
        label: '变更事件',
        value: ''
      },
      onDeleteRow: {
        uiType: 5,
        property: 'onDeleteRow',
        label: '删除行事件',
        value: ''
      },
      onDelete: {
        uiType: 5,
        property: 'onDelete',
        label: '删除附件事件',
        value: ''
      },
      onUpload: {
        uiType: 5,
        property: 'onUpload',
        label: '上传事件',
        value: ''
      },
      onAddRow: {
        uiType: 5,
        property: 'onAddRow',
        label: '新增后事件',
        value: ''
      },
      handlerAfterDelete: {
        uiType: 5,
        property: 'handlerAfterDelete',
        label: '删除后事件',
        value: ''
      },
      onLoadBefore: {
        uiType: 5,
        property: 'onLoadBefore',
        label: '渲染表单之前事件',
        value: ''
      },
      onRenderAfter: {
        uiType: 5,
        property: 'onRenderAfter',
        label: '渲染表单后事件',
        value: ''
      }
    }
  }
];

/**
 * tab： 表单属性
 */
export const propertySummary = {

};

/**
 * modal 类型
 */
export const modalTypes : { [k:string] : string } = {

  displayFormula: 'showRule', // 显示条件

  requiredFormula: 'requiredCondition', // 必填条件

  valueDep: 'calculateRule', // 计算规则

  regexp: 'regularModal', // 正则校验

  options: 'radioOption', // 选项

  orgRoot: '', // 组织根节点

  mappings: 'userSelectionMap', // 映射关系

  min: 'min-yyyy-mm-dd',

  max: 'max-yyyy-mm-dd',

  radioOption: 'radioOption',  // 單選

  checkboxOption: 'checkboxOption' // 多選

};

