<template>
  <div class="workflow-tree">
    <!-- 由于v-model绑定一个空字符串的时候，placeholder不展示，故用两种显示模式 -->
    <a-tree-select
      dropdownClassName="sub-tpl-ts"
      :treeData="workflowTplsTree"
      :loadData="loadTreeData"
      placeholder="请选择"
      v-model="curTreeCode"
      @select="onSelect"
      v-if="isWriteBack"
      :style="`width:${width}px`"
    >
      <!-- 图标 -->
      <span
        slot="title"
        slot-scope="{label, icon}"
        class="cus-title"
        style="font-size: 14px!important"
      >
        <i :class="'icon aufontAll ' + icon"/>
        {{ label }}
      </span>
    </a-tree-select>

    <a-tree-select
      v-else
      dropdownClassName="sub-tpl-ts"
      :treeData="workflowTplsTree"
      :loadData="loadTreeData"
      placeholder="请选择"
      @select="onSelect"
      :style="`width:${width}px`"
    >
      <!-- 图标 -->
      <span
        slot="title"
        slot-scope="{label, icon}"
        class="cus-title"
        style="font-size: 14px!important"
      >
        <i :class="'icon aufontAll ' + icon"/>
        {{ label }}
      </span>
    </a-tree-select>

  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { TreeSelect } from 'h3-antd-vue';

import * as Tree from './tree.api';


@Component({
  name: 'workflow-tree',
  components: {
    ATreeSelect: TreeSelect,
  }
})

export default class WorkflowTree extends Vue {
  @Prop() width!:number;

  @Prop() treeValue!:any;

  @Prop() isWriteBack!:boolean; // 是否需要回写

  @Prop() appCode!:string;

  workflowTplsTree:any = [];

  parentKey:string = '';

  isShow:boolean = true; // 用于重新挂载

  curTreeCode:any = ''; // 当前树的值

  selectTrace:any = '';

  async mounted() {
    await this.getAppList();
    this.handleInitTree();
  }

  /**
   * 初始化树，主要用于回写数据
   */
  async handleInitTree() {
    const { appCode, treeValue } = this;
    if (appCode.indexOf('-') <= -1) {
      this.parentKey = this.workflowTplsTree.findIndex((item:any) => item.value === appCode).toString();
      await this.handleGetAppMenu(appCode);
      this.curTreeCode = treeValue;
    } else {
      const codes = appCode.split('-');
      const temTree = this.workflowTplsTree.slice(); // 复制出一棵树，用于最后更新整棵树(treeData)
      const fKey = temTree.findIndex((item:any) => item.value === codes[0]);
      let sKey:number = -1;
      // note: 此时并没有渲染出二级树
      const appMenuRes = await Tree.getAppItem({
        appCode: codes[0]
      });


      if (appMenuRes.errcode === 0) {
        const { data } = appMenuRes;

        // 生成二级树
        this.parentKey = `${fKey + 1}`;
        const levelTwoTree = this.SWTreeGenerator(data, 2, '', this.parentKey) as any;

        // 生成三级树
        sKey = data.findIndex((item:any) => item.code === codes[1]);
        this.parentKey = `${fKey + 1}-${sKey + 1}`;
        const levelThreeTree = this.SWTreeGenerator(data[sKey].children, 3, '', this.parentKey) as any;
        levelTwoTree[sKey].children = levelThreeTree;

        temTree[fKey].children = levelTwoTree;

        this.workflowTplsTree = temTree; // 更新整棵树

        this.$nextTick(() => {
          this.curTreeCode = treeValue;
        });
      }
    }
  }


  /**
   * 获取所有应用
  */
  async getAppList() {
    const res = await Tree.list({ isMobile: false });
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
      default:
        break;
    }
  }

  /**
   * 获取目录
  */
  async handleGetAppMenu(code:string) {
    const appMenuRes = await Tree.getAppItem({
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
            const levelThreeTree = this.SWTreeGenerator(rd.children, 3, 'BizModel', _key);
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
    const curKey = node.$vnode.data.key;

    const keys = curKey.split('-'); // length = 1/2/3 最小等于2
    let firstIndex:number = -1;
    let secondIndex:number = -1;

    firstIndex = parseInt(keys[0], 10) - 1;

    if (keys.length === 3) {
      secondIndex = parseInt(keys[1], 10) - 1;
    }

    this.saveSelectTrace(firstIndex, secondIndex);
    const code = v;
    const { selectTrace } = this;
    if (!code) return;
    this.$emit('select', { code, selectTrace });
  }

  /**
   * 保存一级目录的code，做回写时用
   */
  saveSelectTrace(firstIndex:number, secondIndex:number) {
    if (secondIndex === -1) { // 只有两级目录
      this.selectTrace = this.workflowTplsTree[firstIndex].value;
    } else { // 有三级目录
      this.selectTrace = `${this.workflowTplsTree[firstIndex].value}-${this.workflowTplsTree[firstIndex].children[secondIndex].value}`;
    }
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
      const _isDisabled = _type !== 'BizModel';
      const _isLeaf = _type === 'BizModel';
      const _schemaCode = item.schemaCode ? item.schemaCode : '';
      let _icon = '';
      if (level === 1) {
        _icon = 'h-icon-all-folder-o';
      } else {
        _icon = item.icon ? item.icon : 'h-icon-all-folder-o';
      }
      tree.push({
        type: _type,
        key: _key,
        level,
        label: _label,
        value: _code,
        icon: _icon,
        schemaCode: _schemaCode,
        disabled: _isDisabled,
        isLeaf: _isLeaf,
        scopedSlots: {
          title: 'title',
        },
        children: []
      });
    });
    return tree;
  }
}
</script>

<style lang="less">
  .workflow-tree{
  width: 100%;
  }
  .sub-tpl-ts{
    width: 100%;
    max-height: 45vh!important;
  /deep/ .ant-select-tree-treenode-disabled{
    span.ant-select-tree-title{
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
  .cus-title {
    color: rgba(0, 0, 0, 0.65) !important;
    font-size: 14px!important;
    i {
      margin-right: 3px;
    }
  }
  .show-placeholder{
   /deep/.ant-select-selection__placeholder {
    display: block!important;
  }
 }
}
</style>