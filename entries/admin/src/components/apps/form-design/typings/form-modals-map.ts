
const optionsMap = {
  /**
   * 必填条件标识
   */
  conditonOptions: [
    {
      text: '==',
      rule: 1
    },
    {
      text: '>',
      rule: 2
    },
    {
      text: '<',
      rule: 3
    },
    {
      text: '>=',
      rule: 4
    },
    {
      text: '<=',
      rule: 5
    },
    {
      text: '!=',
      rule: 6
    },
    {
      text: '包含',
      rule: 7
    },
    {
      text: '不包含',
      rule: 8
    }
  ],
  userAttributes: [
    {
      name: '所属机构',
      mark: 'departments',
      type: 0
    },
    {
      name: '主管',
      mark: 'manager',
      type: 0
    },
    // {
    //   name: '兼职部门',
    //   mark: '$departmentName',
    //   type: 0
    // },
    {
      name: '秘书',
      mark: 'secretary',
      type: 0
    },
    // {
    //   name: '用户账号',
    //   mark: 'accountId',
    //   type: 1
    // },
    // {
    //   name: '用户名称',
    //   mark: 'accountUsername',
    //   type: 1
    // },
    {
      name: '角色',
      mark: 'roleName',
      type: 1
    },
    {
      name: '身份证号',
      mark: 'identityNo',
      type: 1
    },
    {
      name: '办公电话',
      mark: 'officePhone',
      type: 1
    },
    {
      name: '手机号',
      mark: 'mobile',
      type: 1
    },
    {
      name: '邮箱',
      mark: 'email',
      type: 1
    },
    {
      name: '员工编号',
      mark: 'employeeNo',
      type: 1
    },
    {
      name: '职级',
      mark: 'employeeRank',
      type: 1
    },
    {
      name: '称谓',
      mark: 'appellation',
      type: 1
    },
    // {
    //   name: '钉钉',
    //   mark: 'userId',
    //   type: 1
    // },
    {
      name: '出生日期',
      mark: 'birthday',
      type: 2
    },
    {
      name: '入职日期',
      mark: 'entryDate',
      type: 2
    },
    {
      name: '离职日期',
      mark: 'departureDate',
      type: 2
    }
  ],
  /**
   * 对应选人控件数据项
   */
  attributesUserSelection: [
    {
      name: '所属机构',
      mark: 'departments'
    },
    {
      name: '主管',
      mark: 'manager'
    },
    // {
    //   name: '兼职部门',
    //   mark: '$departments'
    // },
    {
      name: '秘书',
      mark: 'secretary'
    }
  ],
  /**
   * 文本型数据项
   */
  attributesText: [
    {
      name: '用户账号',
      mark: 'accountId'
    },
    {
      name: '用户名称',
      mark: 'name'
    },
    {
      name: '角色',
      mark: 'roleName'
    },
    {
      name: '身份证号',
      mark: 'identityNo'
    },
    {
      name: '办公电话',
      mark: 'officePhone'
    },
    {
      name: '手机号',
      mark: 'mobile'
    },
    {
      name: '邮箱',
      mark: 'email'
    },
    {
      name: '员工编号',
      mark: 'employeeNo'
    },
    {
      name: '职级',
      mark: 'employeeRank'
    },
    {
      name: '称谓',
      mark: 'appellation'
    },
    {
      name: '钉钉',
      mark: 'userId'
    }
  ],
  /**
   * 日期类型属性
   */
  attributesDate: [
    {
      name: '出生日期',
      mark: 'birthday'
    },
    {
      name: '入职日期',
      mark: 'entryDate'
    },
    {
      name: '离职日期',
      mark: 'departureDate'
    }
  ],
  defaultRegularList: [
    {
      text:'无模板',
      rule:''
    },
    {
      text: '请输入一个整数',
      rule: '/^(-|\\+)?(\\d)*$/',
      en: 'Please enter an integer'
    },
    {
      text: '请输入一个数字',
      rule: '/^[\\+\\-]?\\d*?\\.?\\d*?$/',
      en: 'Please enter a number'
    },
    {
      text: '请输入一个有效邮箱地址',
      rule: '/^\\w+([-+.]\\w+)*@\\w+([-.]\\\\w+)*\\.\\w+([-.]\\w+)*$/',
      en: 'Please enter a valid email address'
    },
    {
      text: '请输入一个有效手机号码',
      rule: '/^1[3|4|5|6|7|8|9][0-9]{9}$/',
      en: 'Please enter a valid mobile phone number'
    },
    {
      text: '请输入一个有效的电话号码',
      rule: '/^0\\d{2,3}-?\\d{7,8}$/',
      en: 'Please enter a valid telephone number',
    },
    {
      text: '请输入一个有效的邮编',
      rule: '/^[1-9]\\d{5}(?!\\d)$/',
      en: 'Please enter a valid zip code'
    },
    {
      text: '请输入一个有效的身份证',
      rule: '/^(\\d{6})(\\d{4})(\\d{2})(\\d{2})(\\d{3})([0-9]|X)$/',
      en: 'Please enter a valid ID card'
    },
    {
      text: '请输入中文字符',
      rule: '/^[\\u4e00-\\u9fa5]+$/',
      en: 'Please enter Chinese characters'
    }
  ]
};
export default optionsMap;
