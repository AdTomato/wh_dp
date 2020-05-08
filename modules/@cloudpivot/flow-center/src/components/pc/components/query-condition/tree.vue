<template>
  <div class="workflow-tree">
    <a-tree-select
      dropdownClassName="sub-tpl-ts"
      allowClear
      :treeData="workflowTplsTree"
      :loadData="loadTreeData"
      :placeholder="$t('cloudpivot.flowCenter.pc.plzSelect')"
      @select="onSelect"
      v-if="isShow"
      ref="tree"
    >
      <!-- 图标 -->
      <span
        slot="title"
        slot-scope="{label, label_i18n, icon}"
        class="cus-title"
      >
        <i :class="'icon aufontAll ' + icon"/>
        {{ isChinese ? label : label_i18n[lang] }}
      </span>
    </a-tree-select>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { TreeSelect } from 'h3-antd-vue';

// import * as Application from '@/apis/application';

import { listApi } from '@cloudpivot/api';

import common from '@cloudpivot/common';

const Application = listApi;


@Component({
  name: 'workflow-tree',
  components: {
    ATreeSelect: TreeSelect,
  }
})

export default class WorkflowTree extends Vue {
  @Prop() value!:any;

  workflowTplsTree:any = [];

  parentKey:string = '';

  isShow:boolean = true; // 用于重新挂载

  lang:string = 'zh';

  isChinese:boolean = true;


  mounted() {
    this.lang = this.$i18n.locale;
    this.isChinese = this.$i18n.locale === 'zh';
    this.getAppList();
  }

  /**
   * 获取所有应用
  */
  async getAppList() {
    const res = await Application.list({ isMobile: false });
    if (res.errcode === 0) {
      // 一级树
      const levelOneTree = this.SWTreeGenerator(res.data, 1, 'App');
      this.workflowTplsTree = levelOneTree;
    }
  }

  /**
   * 异步加载数据
  */
  async loadTreeData(node:any) {
    const _type = node.$vnode.data.props.type;
    const _val = node.$vnode.data.props.value;
    this.parentKey = node.$vnode.data.key;
    switch (_type) {
      case 'App': // 是应用，获取目录
        this.handleGetAppMenu(_val);
        break;
      case 'Folder':
        this.handleGetWorkflowList(_val);
        break;
      case 'BizModel':
        this.handleGetWorkflowList(_val);
        break;
      default:
        break;
    }
  }

  /**
   * 获取目录
  */
  async handleGetAppMenu(code:string) {
    const appMenuRes = await Application.getAppItem({
      appCode: code
    });
    if (appMenuRes.errcode === 0) {
      const _resData = appMenuRes.data;
      if (!_resData || _resData.length === 0) return;
      // 先生成二级树
      const levelTwoTree = this.SWTreeGenerator(_resData, 2, '', this.parentKey);

      // 再生成三级树
      _resData.forEach((rd:any, rdIndex:number) => {
        if (rd.type === 'Folder') { // 只有是目录类型才做三级目录的操作
          if (rd.children && rd.children.length !== 0) {
            const _key = `${this.parentKey}-${(rdIndex + 1).toString()}`;
            const levelThreeTree = this.SWTreeGenerator(rd.children, 3, '', _key);
            if (!levelTwoTree) return;
            levelTwoTree[rdIndex].children = levelThreeTree;
          }
        }
      });
      const _p = { key: this.parentKey, tree: levelTwoTree };
      this.setTreeDataAsync(_p);
    }
  }

  /**
   * 获取流程列表
  */
  async handleGetWorkflowList(code:string) {
    const params: any = {
      schemaCode: code
    };
    // 获取流程列表 最底层树
    const _worfklowRes = await Application.getWorkflowList(params);
    const level = this.parentKey.split('-').length === 2 ? 3 : 4;
    if (_worfklowRes.errcode === 0) {
      const workflowData = _worfklowRes.data;
      if (!workflowData && workflowData.length === 0) return;

      // 流程树
      const workflowList:Array<any> = workflowData.filter((item:any) => item.published);
      const workflowTree = this.SWTreeGenerator(workflowList, level, 'workflow', this.parentKey);
      const _p = { key: this.parentKey, tree: workflowTree };
      this.setTreeDataAsync(_p);
    }
  }

  /**
    * @description 将异步加载的数据填入树中
    * @param key 类型为 1、1-1、1-1-1、1-1-1-1，根据key来决定赋值操作
  */
  setTreeDataAsync(params: any) {
    const { key, tree } = params;
    if (!key) return;
    const indexs: Array<any> = key.split('-'); // ['1','2','3']
    const temTree = this.workflowTplsTree.slice();
    indexs.forEach((index: any, i: number) => {
      indexs[i] = parseInt(index, 10) - 1;
    });
    switch (indexs.length) {
      case 1:
        temTree[indexs[0]].children = tree;
        break;
      case 2:
        temTree[indexs[0]].children[indexs[1]].children = tree;
        break;
      case 3:
        temTree[indexs[0]].children[indexs[1]].children[indexs[2]].children = tree;
        break;
      default: break;
    }
    this.workflowTplsTree = temTree;
  }

  /**
   * 选中树中的节点
  */
  onSelect(v:any, node:any) {
    const _workflowCode = v;
    const name = node.$vnode.data.props.name;
    const name_i18n = node.$vnode.data.props.label_i18n;
    if (!_workflowCode) return;

    this.$emit('input', _workflowCode);
    this.$emit('select', {name, name_i18n});
  }

  /**
* @description 生成自模板树形结构
* @param data 源数据
* @param level 当前是几级树
* @param type 当前树的类型 只有type为'workflow'才可以被选
* @param parentKey 父级树的key，用于生成当前树的key，第一级时不传
*/
  SWTreeGenerator(data:any, level:number, type:string, parentKey?:string) {
    if (!data || data.length === 0) return;  
    const tree:Array<any> = [];
    data.forEach((item:any, index:number) => {
      const _key = parentKey ? `${parentKey}-${(index + 1).toString()}` : `${(index + 1).toString()}`;
      const _type = type === '' ? item.type : type;
      const _code = type === 'workflow' ? `workflow-${item.workflowCode}` : item.code;
      const _label = type === 'workflow' ? item.workflowName : item.name;
      const _isDisabled = type !== 'workflow';
      const _isLeaf = type === 'workflow';
      const _schemaCode = item.schemaCode ? item.schemaCode : '';
      let _icon = '';
      const zhKey:string = type === 'workflow' ? 'workflowName' : 'name';
      item = common.utils.compatible(item, zhKey);
      if (level === 1) {
        _icon = 'h-icon-all-folder-o';
      } else {
        _icon = item.icon ? item.icon : 'h-icon-all-folder-o';
      }
      tree.push(
        {
          type: _type,
          key: _key,
          level,
          label: _label,
          label_i18n: item.name_i18n,
          value: _code,
          icon: _icon,
          schemaCode: _schemaCode,
          disabled: _isDisabled,
          isLeaf: _isLeaf,
          name: _label,
          scopedSlots: {
            title: 'title',
          },
          children: []
        }
      );
    });
    return tree;
  }

  @Watch('value')
  onValueChange(v:any) {
    if (this.value === '') {
      this.isShow = false;
      setTimeout(() => {
        this.isShow = true;
      }, 30);
    }
  }

  @Watch('$i18n.locale')
  onLanguageChange(v:string){
    this.lang = v;
    this.isChinese = v === 'zh';
    this.workflowTplsTree = [];
    this.getAppList();
  }
}
</script>

<style lang="less">
  .sub-tpl-ts{
    max-height: 45vh!important;
  /deep/ .ant-select-tree-treenode-disabled{
    span.ant-select-tree-title{
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
  .cus-title {
    color: rgba(0, 0, 0, 0.65) !important;
    i {
      margin-right: 3px;
    }
  }

  // 多出一个小方块，去除 by John 20191015
  /deep/.ant-select-tree-iconEle.ant-select-tree-icon__customize {
    display: none!important;
  }
}
</style>
