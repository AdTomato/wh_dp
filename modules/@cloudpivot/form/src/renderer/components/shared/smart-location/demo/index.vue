<template>
  <div style="width: 1024px;margin: 0 auto;">
    <div>位置控件</div>
    <SmartLocation v-model="location"></SmartLocation>

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
import SmartLocation from '../index.vue';

@Component({
  name: 'SmartLocaleDemo',
  components: {
  SmartLocation
  }
  })
export default class SmartLocaleDemo extends Vue {
  location: any = {
    address: '',
    lng: 0,
    lat: 0,
  }
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
}
</script>
