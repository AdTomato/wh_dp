<template>
  <div style="width: 1024px;margin: 0 auto;">
    <div @click="() => showModel = !showModel">人员部门多选</div> 
    <SmartOrg
      :org="org"
      :showSelect="false"
      :showModel="showModel"
      style="margin: 24px auto; width: 400px"
      :selectedData="selectValue1"
      :searchData="searchList"
      @change="onChageValue(1, arguments)"
      @onSearch="onSearch"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOK(1, arguments)"
    >
    </SmartOrg>
    <div>人员多选</div>
    <SmartOrg
      :org="org"
      :selectUser="true"
      :selectOrg="false"
      style="margin: 24px auto; width: 400px"
      :selectedData="selectValue2"
      :searchData="searchList"
      @change="onChageValue(2, arguments)"
      @onSearch="onSearch"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOK(2, arguments)"
    >
    </SmartOrg>

    <div>部门多选</div>
    <SmartOrg
      :org="org"
      :selectUser="false"
      style="margin: 24px auto; width: 400px"
      :selectedData="selectValue3"
      :searchData="searchList"
      @change="onChageValue(3, arguments)"
      @onSearch="onSearch"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOK(3, arguments)"
    >
    </SmartOrg>

    <div>人员部门单选</div>
    <SmartOrg
      :org="org"
      style="margin: 24px auto; width: 400px"
      :selectedData="selectValue4"
      :searchData="searchList"
      :isMulpitle="false"
      @change="onChageValue(4, arguments)"
      @onSearch="onSearch"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOK(4, arguments)"
    >
    </SmartOrg>
    <div>人员单选</div>
    <SmartOrg
      :org="org"
      :selectOrg="false"
      style="margin: 24px auto; width: 400px"
      :selectedData="selectValue5"
      :searchData="searchList"
      :isMulpitle="false"
      @change="onChageValue(5, arguments)"
      @onSearch="onSearch"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOK(5, arguments)"
    >
    </SmartOrg>
    <div>部门单选</div>
    <SmartOrg
      :org="org"
      :selectUser="false"
      style="margin: 24px auto; width: 400px"
      :selectedData="selectValue6"
      :searchData="searchList"
      :isMulpitle="false"
      @change="onChageValue(6, arguments)"
      @onSearch="onSearch"
      @onClickNextHierarchy="onClickNextHierarchy"
      @ok="onOK(6, arguments)"
    >
    </SmartOrg>


    <div style="margin-top: 32px; font-size: 30px;">API</div>
    <a-table
      bordered
      :dataSource="apiDataSource"
      :columns="apiCloumn"
      style="width: 1024px"
    >
    </a-table>
    <div style="margin-top: 32px; font-size: 30px;">事件</div>
    <a-table
      bordered
      :dataSource="eventDataSource"
      :columns="eventCloumn"
      style="width: 1024px"
    >
    </a-table>
  </div>

</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import SmartOrg from '../smartOrg.vue';

@Component({
  name: 'smartorg',
  components: {
  SmartOrg
  }
  })
export default class SmartOrgDemo extends Vue {
  showModel :boolean = false;
  searchList: Array<any> = [];
  searchData: Array<any> = [
    {
      key: 's1',
      name: 'name1',
      orglist: '部门一/部门二',
      type: 'org'
    }, {
      key: 's2',
      name: 'name2',
      orglist: '部门一/部门二',
      type: 'user',
      avatar: 'https://cn.vuejs.org/images/logo.png'
    }, {
      key: 's3',
      name: 'name3',
      orglist: '部门一/部门二',
      type: 'org'
    }, {
      key: 's4',
      name: 'name4',
      orglist: '部门一/部门二',
      type: 'user'
    }, {
      key: 's5',
      name: 'name5',
      orglist: '部门一/部门二',
      type: 'user'
    }, {
      key: 's6',
      name: 'name6',
      orglist: '部门一/部门二',
      type: 'org'
    }, {
      key: 's7',
      name: 'name7',
      orglist: '部门一/部门二',
      type: 'org'
    }, {
      key: 's8',
      name: 'name8',
      orglist: '部门一/部门二',
      type: 'org'
    },
  ];
  org: any = [
    {
      key: 's1',
      name: 'name1',
      orglist: '部门一/部门二',
      type: 'org'
    }, {
      key: 's2',
      name: 'name2',
      orglist: '部门一/部门二',
      type: 'user',
      avatar: 'https://cn.vuejs.org/images/logo.png'
    }, {
      name: '组织1henchang陈很长的组织很长很长的组织很长很长的组织很长很胀的祖师',
      type: 'org',
      key: '1',
      children: [
        {
          name: '组织2',
          type: 'org',
          key: '2',
        }
      ],
    }, {
      name: '组织3',
      type: 'org',
      key: '3',
      children: [
        {
          name: '组织4',
          type: 'org',
          key: '4',
        }
      ],
    }, {
      name: '组织5',
      type: 'org',
      key: '5',
      children: [
        {
          name: '组织6',
          type: 'org',
          key: '6',
        }
      ],
    }, {
      name: '组织7',
      type: 'org',
      key: '7',
      children: [
        {
          name: '组织8',
          type: 'org',
          key: '8',
        }
      ],
    }, {
      name: '组织9',
      type: 'org',
      key: 'z9',
      children: [
        {
          name: '组织10',
          type: 'org',
          key: 'z8',
        }
      ],
    }, {
      name: '组织11',
      type: 'org',
      key: 'z11',
      children: [
        {
          name: '组织12',
          type: 'org',
          key: 'z12',
        }
      ],
    }, {
      name: '人员1',
      type: 'user',
      key: '8',
    }, {
      name: '人员2',
      type: 'user',
      key: '9',
    }, {
      name: '人员A',
      type: 'user',
      key: '10',
    }, {
      name: '人员B',
      type: 'user',
      key: '111',
    }, {
      name: '人员C',
      type: 'user',
      key: '112',
    }, {
      name: '人员D',
      type: 'user',
      key: '113',
    }, {
      name: '人员F',
      type: 'user',
      key: '114',
    }, {
      name: '人员很差很难过很长的人员很长很长的人很差Hsia还算健康大使看到擦看见啥会计师d',
      type: 'user',
      key: '115',
    }, {
      name: '人员E',
      type: 'user',
      key: '116',
    }, {
      name: '人员很差很难过很长的人员很长很长的人很差Hsia还算健康大使看到擦看见啥会计师d',
      type: 'user',
      key: '117',
    }, {
      name: '人员G',
      type: 'user',
      key: '118',
    }, {
      name: '人员H',
      type: 'user',
      key: '119',
    }, {
      name: '人员I',
      type: 'user',
      key: '120',
    }, {
      name: '人员J',
      type: 'user',
      key: '121',
    }, {
      name: '人员K',
      type: 'user',
      key: '122',
    }, {
      name: '人员L',
      type: 'user',
      key: '123',
    }, {
      name: '人员M',
      type: 'user',
      key: '124',
    }, {
      name: '人员O',
      type: 'user',
      key: '125',
    }, {
      name: '人员P',
      type: 'user',
      key: '126',
    }, {
      name: '人员Q',
      type: 'user',
      key: '127',
    }, {
      name: '人员R',
      type: 'user',
      key: '128',
    }, {
      name: '人员S',
      type: 'user',
      key: '129',
    }, {
      name: '人员T',
      type: 'user',
      key: '130',
    }, {
      name: '人员U',
      type: 'user',
      key: '131',
    }, {
      name: '人员V',
      type: 'user',
      key: '132',
    }, {
      name: '人员W',
      type: 'user',
      key: '133',
    }
  ]
  selectValue1: any = [
    {
      key: 's1',
      name: 'name1',
      orglist: '部门一/部门二',
      type: 'org'
    }, {
      name: '下级一一一',
      type: 'org',
      key: 'sss1',
    },
  ]
  selectValue2: any = [
    {
      name: '人员E',
      type: 'user',
      key: '116',
    }, {
      name: '人员很差很难过很长的人员很长很长的人很差Hsia还算健康大使看到擦看见啥会计师d',
      type: 'user',
      key: '117',
    }, {
      name: '人员G',
      type: 'user',
      key: '118',
    },
  ]
  selectValue3: any = [
    {
      name: '组织3',
      type: 'org',
      key: '3',
    }, {
      name: '组织5',
      type: 'org',
      key: '5',
    }
  ]
  selectValue4: any = [
    {
      key: 's1',
      name: 'name1',
      orglist: '部门一/部门二',
      type: 'org'
    }
  ]
  selectValue5: any = [
    {
      key: 's2',
      name: 'name2',
      orglist: '部门一/部门二',
      type: 'user',
      avatar: 'https://cn.vuejs.org/images/logo.png'
    }
  ]
  selectValue6: any = [
    {
      key: 's1',
      name: 'name1',
      orglist: '部门一/部门二',
      type: 'org'
    }
  ]
  apiCloumn: Array<any> = [
    {
      title: '参数',
      dataIndex: 'parameter',
    }, {
      title: '说明',
      dataIndex: 'desciribe',
    }, {
      title: '类型',
      dataIndex: 'type',
    }, {
      title: '默认值',
      dataIndex: 'default',
    }
  ]
  apiDataSource: Array<any> =[
    {
      key: '0',
      parameter: 'prefixCls',
      desciribe: '顶层样式class名称',
      type: 'string',
      default: ''
    }, {
      key: '1',
      parameter: 'prefixStyle',
      desciribe: '顶层样式style',
      type: 'Object',
      default: ''
    }, {
      key: '2',
      parameter: 'selectStyle',
      desciribe: '选择框样式style',
      type: 'Object',
      default: ''
    }, {
      key: '3',
      parameter: 'placeholder',
      desciribe: 'placeholder',
      type: 'string',
      default: '搜索组织、姓名'
    }, {
      key: '3-1',
      parameter: 'selectPlaceholder',
      desciribe: '选择框的Placeholder',
      type: 'string',
      default: ''
    }, {
      key: '4',
      parameter: 'org',
      desciribe: '组织树',
      type: 'Array<any> ',
      default: '',
      children: [
        {
          key: '4-1',
          parameter: 'org参数：key(必须参数)',
          desciribe: '唯一标志',
          type: 'string',
          default: '',
        }, {
          key: '4-2',
          parameter: 'org参数：name(必须参数)',
          desciribe: '名称',
          type: 'string',
          default: '',
        }, {
          key: '4-3',
          parameter: 'org参数：type(必须参数)',
          desciribe: '类型org/user两种',
          type: 'string',
          default: '',
        }, {
          key: '4-4',
          parameter: 'org参数：children(必须参数)',
          desciribe: '下级',
          type: 'array',
          default: '',
        }
      ]
    }, {
      key: '5',
      parameter: 'searchData',
      desciribe: '搜索结果列表',
      type: 'Array<any> ',
      default: '',
      children: [
        {
          key: '5-1',
          parameter: 'searchData参数：key(必须参数)',
          desciribe: '唯一标志',
          type: 'string',
          default: '',
        }, {
          key: '5-2',
          parameter: 'searchData参数：name(必须参数)',
          desciribe: '名称',
          type: 'string',
          default: '',
        }, {
          key: '5-3',
          parameter: 'searchData参数：type(必须参数)',
          desciribe: '类型org/user两种',
          type: 'string',
          default: '',
        }, {
          key: '5-4',
          parameter: 'searchData参数：children',
          desciribe: '下级',
          type: 'array',
          default: '',
        }, {
          key: '5-5',
          parameter: 'searchData参数：orglist',
          desciribe: '部门层级',
          type: 'string',
          default: '',
        }
      ]
    }, {
      key: '13',
      parameter: 'selectedData',
      desciribe: '所选值',
      type: 'Array<any> ',
      default: '',
      children: [
        {
          key: '13-1',
          parameter: 'searchData参数：key(必须参数)',
          desciribe: '唯一标志',
          type: 'string',
          default: '',
        }, {
          key: '13-2',
          parameter: 'searchData参数：name(必须参数)',
          desciribe: '名称',
          type: 'string',
          default: '',
        }, {
          key: '13-3',
          parameter: 'searchData参数：type(必须参数)',
          desciribe: '类型org/user两种',
          type: 'string',
          default: '',
        }, {
          key: '13-4',
          parameter: 'searchData参数：children',
          desciribe: '下级',
          type: 'array',
          default: '',
        }
      ]
    }, {
      key: '6',
      parameter: 'locale',
      desciribe: '语言版本',
      type: 'string',
      default: 'zh'
    }, {
      key: '7',
      parameter: 'isMulpitle',
      desciribe: '是否多选',
      type: 'boolean',
      default: 'true'
    }, {
      key: '8',
      parameter: 'selectUser',
      desciribe: '是否选择人员',
      type: 'boolean',
      default: 'true'
    }, {
      key: '9',
      parameter: 'selectOrg',
      desciribe: '是否选择部门',
      type: 'boolean',
      default: 'true'
    }, {
      key: '10',
      parameter: 'allowRecursion',
      desciribe: '是否能够递归',
      type: 'boolean',
      default: 'true'
    }
  ]
  eventCloumn: Array<any> = [
    {
      title: '事件名称',
      dataIndex: 'name',
    }, {
      title: '说明',
      dataIndex: 'desciribe',
    }, {
      title: '回调参数',
      dataIndex: 'callback',
    }
  ]
  eventDataSource: Array<any> = [
    {
      key: '0-1',
      name: 'change',
      desciribe: '在选择框中改变值（删除值）的回调',
      callback: 'function(val:event)'
    }, {
      key: '0-2',
      name: 'focus',
      desciribe: '选择框聚焦时间',
      callback: 'function(val:event)'
    }, {
      key: '0',
      name: 'searchFocus',
      desciribe: '搜索框聚焦事件',
      callback: 'function(val:event)'
    }, {
      key: '1',
      name: 'searchChange',
      desciribe: '搜索框输入change事件',
      callback: 'function(val:string)'
    }, {
      key: '2',
      name: 'onSearch',
      desciribe: '执行搜索事件',
      callback: 'function(val:string)'
    }, {
      key: '3',
      name: 'searchBlur',
      desciribe: '搜索框失焦回调',
      callback: 'function(val:event)'
    }, {
      key: '4',
      name: 'cancle',
      desciribe: '取消/X/点击关闭弹框回调',
      callback: 'function()'
    }, {
      key: '5',
      name: 'ok',
      desciribe: '确定回调',
      callback: 'function(val:Array)'
    }, {
      key: '6',
      name: 'onClickTrunBack',
      desciribe: '点击返回回调',
      callback: 'function()'
    }, {
      key: '7',
      name: 'onClickBreadcrumb',
      desciribe: '带年纪面包屑条目回调',
      callback: 'function(val:object)'
    }, {
      key: '8',
      name: 'onOrgTreeScroll',
      desciribe: '组织树滑动监听',
      callback: 'function(val:event)'
    }, {
      key: '9',
      name: 'onSearchListScroll',
      desciribe: '搜索结果滑动监听',
      callback: 'function(val:event)'
    }, {
      key: '10',
      name: 'onClickNextHierarchy',
      desciribe: '点击下级回调',
      callback: 'function(val:object)'
    },
  ]
  onSearch(val:string) {
    console.log(val);
    if (val === 'sss') {
      setTimeout(() => {
        this.searchList = this.searchData;
      }, 1000);
    }
    if (val === '') {
      this.searchList = [];
    }
  }
  onClickNextHierarchy(val:any) {
    this.org = [
      {
        name: '下级一一一',
        type: 'org',
        key: 'sss1',
      }, {
        key: 's2',
        name: 'name2',
        orglist: '部门一/部门二',
        type: 'org',
        avatar: 'https://cn.vuejs.org/images/logo.png'
      },
    ];
  }
  onChageValue(targetObj:number, val:any) {
    if (targetObj === 1) {
      this.selectValue1 = this.selectValue1.filter((item:any) => val[0].some((o:any) => o.key === item.key));
    } else if (targetObj === 2) {
      this.selectValue2 = this.selectValue2.filter((item:any) => val[0].some((o:any) => o.key === item.key));
    } else if (targetObj === 3) {
      this.selectValue2 = this.selectValue2.filter((item:any) => val[0].some((o:any) => o.key === item.key));
    } else if (targetObj === 4) {
      this.selectValue2 = this.selectValue2.filter((item:any) => val[0].some((o:any) => o.key === item.key));
    } else if (targetObj === 5) {
      this.selectValue2 = this.selectValue2.filter((item:any) => val[0].some((o:any) => o.key === item.key));
    } else if (targetObj === 6) {
      this.selectValue2 = this.selectValue2.filter((item:any) => val[0].some((o:any) => o.key === item.key));
    }
  }
  onOK(targetObj:number, val:any) {
    console.log(val);
    const selectList = val[0];
    if (targetObj === 1) {
      this.selectValue1 = selectList;
    } else if (targetObj === 2) {
      this.selectValue2 = selectList;
    } else if (targetObj === 3) {
      this.selectValue3 = selectList;
    } else if (targetObj === 4) {
      this.selectValue4 = selectList;
    } else if (targetObj === 5) {
      this.selectValue5 = selectList;
    } else if (targetObj === 6) {
      this.selectValue6 = selectList;
    }
  }
}
</script>
