<template>
  <div style="width: 1024px;margin: 32px auto;">
    <SmartApprove
      :supprotSelect="true"
      :supprotSetting="false"
      :headers="headers"
      v-model="value"
      :opinions="opinions"
      :fileList="fileList"
      @handle-preview="handlePreview"
      action="//jsonplaceholder.typicode.com/posts/"
    >
    </SmartApprove>
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
import SmartApprove from '../index.vue';

@Component({
  name: 'smartapproval',
  components: {
  SmartApprove
  }
  })
export default class SmartApprovalDemo extends Vue {
  value:string = '我的审批意见按是';
  headers:any = {
    authorization: 'authorization-text',
  };
  opinions: Array<any> = [
    {
      name: '常用意见一',
      key: '1'
    }, {
      name: '常用意见2',
      key: '2'
    }, {
      name: '常用意见3',
      key: '3'
    }, {
      name: '常用意见4',
      key: '4'
    }, {
      name: '常用意见5',
      key: '5'
    }, {
      name: '常用意见6',
      key: '6'
    }, {
      name: '常用意见一7',
      key: '7'
    }
  ]
  fileList: Array<any> = [
    // {
    //   lastModified: 1540536222688,
    //   lastModifiedDate: 'Fri Oct 26 2018 14:43:42 GMT+0800 (中国标准时间)',
    //   name: '1.png',
    //   size: 1998632,
    //   type: 'image/png',
    //   uid: 'vc-upload-1544246703722-2',
    // }
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
      parameter: 'locale',
      desciribe: '语言版本',
      type: 'string',
      default: 'zh'
    }, {
      key: '4',
      parameter: 'opinions',
      desciribe: '常用审批意见列表,supprotSelect为true时生效,Object[]',
      type: "[{key: '', name: ''}]",
      default: ''
    }, {
      key: '5',
      parameter: 'fileList',
      desciribe: '文件列表，当已有文件是传入,Object[]',
      type: '[]',
      default: '[]'
    }, {
      key: '6',
      parameter: 'supprotSetting',
      desciribe: '是否支持设置常用审批意见',
      type: 'boolean',
      default: 'true'
    }, {
      key: '7',
      parameter: 'supprotSelect',
      desciribe: '是否支持选择常用审批意见',
      type: 'boolean',
      default: 'true'
    }, {
      key: '8',
      parameter: 'supprotUpload',
      desciribe: '是否支持上传附件',
      type: 'boolean',
      default: 'true'
    }, {
      key: '9',
      parameter: 'headers',
      desciribe: '附件上传头部',
      type: 'boolean',
      default: 'true'
    }, {
      key: '10',
      parameter: 'action',
      desciribe: '附件上传地址',
      type: 'string',
      default: ''
    }, {
      key: '11',
      parameter: 'accept',
      desciribe: '附件可以接受的类型',
      type: 'string',
      default: ''
    }, {
      key: '12',
      parameter: 'uploadMaxSize',
      desciribe: '附件上传大小，单位以字节计算',
      type: 'Number',
      default: ''
    }, {
      key: '13',
      parameter: 'uploadMaxNum',
      desciribe: '附件上传数量限制',
      type: 'Number',
      default: ''
    }, {
      key: '14',
      parameter: 'uploadType',
      desciribe: '附件上传数量格式，与accept相同',
      type: 'string',
      default: ''
    }, {
      key: '15',
      parameter: 'remove',
      desciribe: '附件删除回调，返回false时不移除',
      type: 'Function',
      default: ''
    }, {
      key: '16',
      parameter: 'withCredentials',
      desciribe: '附件上传是否携带cookie',
      type: 'boolean',
      default: 'false'
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
      name: 'onCheckboxChange',
      desciribe: '点击设置为常用审批意见的回调',
      callback: 'function(check:boolean)'
    }, {
      key: '0-2',
      name: 'onSelectChange',
      desciribe: '选择常用审批意见的回调',
      callback: 'function(val)'
    }, {
      key: '0-3',
      name: 'uploading',
      desciribe: '上传附件过程中的回调',
      callback: 'function(info)'
    }, {
      key: '0-4',
      name: 'done',
      desciribe: '上传附件成功的回调',
      callback: 'function(info)'
    }, {
      key: '0-5',
      name: 'error',
      desciribe: '上传附件失败的回调',
      callback: 'function(info)'
    }, {
      key: '0-6',
      name: 'handle-preview',
      desciribe: '附件预览回调',
      callback: 'function(file)'
    }
  ]

  handlePreview(val:any) {
    console.log('预览');
    console.log(val);
  }
}
</script>
