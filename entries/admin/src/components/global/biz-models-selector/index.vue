<template>
  <a-tree-select
    ref="treeSelect"
    v-model="result"
    class="biz-models-selector"
    allowClear
    showSearch
    :treeData="treeData"
    
    @onExpand="onTreeExpand"
    :dropdownStyle="{ maxHeight: '350px',height: '350px', overflow: 'auto' }"
    @change="onChange"
    @search="onSearch"
    :disabled="disabled"
    :placeholder="placeholder"
    dropdownClassName="fixed"
    treeNodeFilterProp="title"
  >
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
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import appApi from '@/apis/apps';
import workflowApi from '@/apis/workflow';

import { listApi } from '@cloudpivot/api';


@Component({
  name:"biz-models-selector"
  })
export default class bizModelsSelector extends Vue {
  @Prop() value!: string;
  @Prop() appCode!: string;
  @Prop() folderId!: string;
  @Prop({
    default: false
  }) disabled?: boolean;
  @Prop({
    default: ''
  }) placeholder?: string;

  @Prop({
    default : ''
  })

  @Prop({
    default: false
  })
  appManagerFilter?: boolean;

  expandCode !: string;

  treeData: Array<treeSelector.treeItem> = [];

  allTreeData : Array<treeSelector.treeItem> | null = null;

  result: string[] = [];

  searchTask : any;
  
  // defaultExpandedKeys:string[] = [];

  // get treeExpandedKeys(){
  //   if(this.expandCode){
  //     return [this.expandCode];
  //   }
  //   return [];
  // }

  /**
   * 异步加载数据
   */
  onLoadData(treeNode: any) {
    const vm:any = this;
    return new Promise((resolve: any) => {
      if (treeNode.loaded || treeNode.isLeaf) {
        resolve();
        return;
      }
      const { type = null, code = '' } = treeNode.dataRef || {};
      if (type === 'app' && code) {
        vm.getBizModels(code).then((res: Array<treeSelector.treeItem>) => {
          vm.treeData.some((app: treeSelector.treeItem) => {
            if (app.value === code) {
              app.children = res;
              return true;
            }
            return false;
          });
          vm.treeData = [...vm.treeData];
          resolve();
        });
      } else {
        resolve();
      }
    });
  }

  onTreeExpand(treeNode : any){
    if (treeNode.isLeaf) {
      return;
    }

    const node = this.treeData.find((n:any) => n.key === treeNode.key);

    if(!node || node._loaded || !treeNode.dataRef){
      return;
    }

    this.getNodeChildren(treeNode.dataRef.code,node);
  }

  getNodeChildren(code:string,node:any){
    return this.getBizModels(code).then((res:any)=>{
      const showTypes: string[] = ['Folder', 'BizModel'];
      const children = res.filter(child => {
        if (child.children) {
          child.children = child.children.filter(c => showTypes.includes(c.type));
        }
        return showTypes.includes(child.type);
      });
     
      node.children = res.filter(child => showTypes.includes(child.type));

      node._loaded = true;
      this.treeData = [...this.treeData];
      this.allTreeData = this.treeData;
      return res;
    });
  }

  /**
   * 获取应用列表
   */
  getAppList(param?: Apps.AppItem.appManagerModel) {
    appApi.getAllApps(param).then((res: Common.Data) => {
      if (Array.isArray(res.data)) {
        const tree: Array<treeSelector.treeItem> = res.data.map((item: Apps.AppCenter.AppInfo) => ({
          title: item.name,
          value: item.code,
          key: `${item.code}`,
          isLeaf: false,
          selectable: false,
          children: [],
          dataRef: {
            type: 'app',
            code: item.code,
          }
        }));

        if(this.expandCode){
          const idx = tree.findIndex((n:any) => n.key === this.expandCode);
          if(idx > -1){
            const node = tree[idx];
            tree.splice(idx,1);
            tree.splice(0,0,node);
            
            this.getNodeChildren(node.key,node).then(()=>{
              // setTimeout(()=>{
              //   this.defaultExpandedKeys = [this.expandCode];
              // },100);
              
            });
          }
        }

        this.treeData = tree;
        this.allTreeData = tree;
        // 存在默认值
        if (this.value) {
          this.setDefault();
        }
      }
    });
  }
  /**
   * 获取应用下的目录和业务模型
   */
  getBizModels(appCode: string) {
    return appApi.getAppItem({ appCode }).then((res: Common.Data) => {
      if (res.errcode !== 0) {
        this.$message.error(res.errmsg);
        return;
      }
      const child: Array<treeSelector.treeItem> = res.data.map((item: Apps.AppItem.AppMenu, index: number) => {
        if (item.type === 'Folder') {
          let children: Array<treeSelector.treeItem> = [];
          if (item.children) {
            children = item.children.map((biz:Apps.AppItem.AppMenu) => ({
              title: biz.name,
              value: `${appCode}-${item.code}-${biz.code}`,
              key: `${appCode}-${item.code}-${biz.code}`,
              isLeaf: true,
              selectable: true,
              type: biz.type
            }));
          }
          return {
            title: item.name,
            // value: item.id,
            value: `${appCode}-${item.code}`,
            key: `${appCode}-${item.code}`,
            isLeaf: false,
            selectable: false,
            children,
            type: item.type
          };
        }
        return {
          title: item.name,
          // value: item.code,
          value: `${appCode}-${item.code}`,
          key: `${appCode}-${item.code}`,
          isLeaf: true,
          selectable: true,
          children: [],
          type: item.type
        };
      });
      return child;
    });
  }

  onChange(val: string) {
    let code = '';
    if (!val) {
      this.$emit('change', '');
      this.$emit('select', []);
    }else{
      const appsArr = val.split('-');
      
      this.$emit('change', appsArr[appsArr.length-1]);
      this.$emit('select', appsArr);

      code = appsArr[0];

      const $treeSelect = this.$refs.treeSelect as Vue;

      if($treeSelect){
        const $vcTreeSelect = $treeSelect.$refs.vcTreeSelect as any;
        if($vcTreeSelect){
          $vcTreeSelect.sInputValue = '';
        }
      }
      
      this.treeData = this.allTreeData || [];

       const node = this.treeData.find((n:any) => n.key === code);

        if(!node || node._loaded){
          return;
        }

        this.getNodeChildren(code, node).then(()=>{
          this.$emit('change', appsArr[appsArr.length-1]);
          this.$emit('select', appsArr);
        });
    
    }
  }

  onSearch(text : string){
    clearTimeout(this.searchTask);
    this.searchTask = setTimeout(()=>{ this.doSearch(text) },500);
  }

  doSearch(text : string){
    if(text){
      listApi.appSearch({
        name : text
      }).then((res:any)=>{
        if(res.errcode !== 0){
          this.treeData = [];
          return;
        }

        const treeData = res.data.map((x:any) => this.convert(x));
        this.treeData = treeData;
      });
    }else{
      this.treeData = this.allTreeData || [];
    }
  }

  convert(item : any,parentKey ?: string){
    const key = parentKey ? `${parentKey}-${item.code}` : item.code;

    const isLeaf = item.type === 'BizModel';

    const node : any = {
      title: item.name,
      value: key,
      key: key,
      isLeaf,
      selectable: isLeaf,
      scopedSlots: {
        title: 'title',
      }
    }

    if(!isLeaf && Array.isArray(item.children)){
      node.children = item.children.map((c:any) => this.convert(c,key));
    }

    return node;
  }

  filter(inputValue: string, treeNode: any){
    // console.log(inputValue,treeNode);
    return false;
  }

  // @Watch('value')
  // onValueChange(val: string) {
  //   debugger;
  //   this.result = [val];

  // }

  /**
   * 设置默认值
   */
  setDefault() {
    if (!this.appCode) {
      return;
    }
    const treeNode = {
      loaded: false,
      isLeaf: false,
      dataRef: {
        type: 'app',
        code: this.appCode,
      }
    };
    this.onLoadData(treeNode);
    if (this.folderId) {
      this.result = [`${this.appCode}-${this.folderId}-${this.value}`];
    } else {
      this.result = [`${this.appCode}-${this.value}`];
    }
  }


  created() {
    if(this.appManagerFilter){
       const param: Apps.AppItem.appManagerModel = {
        filterType :"admin"
      };
      this.getAppList(param);
    }else{
      this.getAppList();
    }
   
  }
  mounted() {
    this.onValueChange();
  }
  /**
   * 关联表单改变时候 初始默认值
   */
  @Watch('value')
  onValueChange() {
    if(!this.value){
      this.result = [];
      return;
    }
    // if ( !this.folderId || !this.appCode) {
      
    //   return;
    // }
   this.setDefault();
  }
}
</script>
<style lang="less" scoped>
.biz-models-selector {
  width: 100%;
  max-width: 500px;
}

</style>
<style lang="less">
.fixed{
  .ant-select-tree {
    padding-top: 36px;
  }

}

</style>