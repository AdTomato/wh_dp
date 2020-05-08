<template>
  <div class="workflow-tree">
    <!-- :getPopupContainer="getPopupContainer" -->
    <a-tree-select
      showSearch
      ref="treeSelect"
      dropdownClassName="fixed"
      :treeData="workflowTplsTree"
      placeholder="请选择"
      v-model="val"
      @change="onChange"
      @onExpand="onTreeExpand"
      @search="onSearch"
      :style="`width:${width}px`"
      :getPopupContainer="getPopupContainer"
      :filterTreeNode="false"
    >
      <span
        slot="title"
        slot-scope="{label, icon}"
        class="cus-title"
        style="font-size: 14px!important"
      >
        <i :class="'icon aufontAll ' + icon" />
        {{ label }}
      </span>
    </a-tree-select>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { TreeSelect } from "h3-antd-vue";

import * as Tree from "./tree.api";

import { listApi } from "@cloudpivot/api";

@Component({
  name: "workflow-tree",
  components: {
    ATreeSelect: TreeSelect
  }
})
export default class WorkflowTree extends Vue {
  @Prop() width!: number;

  @Prop() treeValue!: any;

  @Prop() appCode!: string;

  @Prop({
    default: ""
  })
  expandCode!: string;

  @Prop()
  getPopupContainer!:Function

  workflowTplsTree: any = [];

  searchTask: any;

  allTreeData: Array<treeSelector.treeItem> | null = null;

  val: string[] = [];

  mounted() {
    this.getAppList().then(() => {
      this.loadApp(this.appCode);
    });
  }

  // getPopupContainer(triggerNode:any) {
  //   return triggerNode;
  // }

  clearVal() {
    this.val = [];
  }
  
  @Watch("appCode", {
    immediate: true
  })
  onAppCodeChange(appCode: string) {
    if (this.treeValue && this.appCode) {
      const key = `${this.appCode}-${this.treeValue}`;
      this.val = [key];
    } else {
      this.val = [];
    }
  }

  loadApp(appCode: string) {
    if (!appCode) {
      return;
    }

    const idx = appCode.indexOf("-");
    let code = appCode;
    if (idx > -1) {
      code = code.substring(0, idx);
    }

    if (code) {
      this.loadAppChildren(code);
    }
  }

  onChange(val: string) {
    const appsArr = val.split("-");
    let currentData:any = this.workflowTplsTree.find((res:any) => {
      return res.value === appsArr[0];
    });

    if (appsArr.length > 1) {
      currentData = currentData.children.find((res:any) => {
        return res.value === `${appsArr[0]}-${appsArr[1]}`;
      })
    }

    if (appsArr.length > 2) {
      currentData = currentData.children.find((res:any) => {
        return res.value === `${appsArr[0]}-${appsArr[1]}-${appsArr[2]}`;
      })
    }

    
    if (!val) {
      this.$emit("select", {
        code: "",
        selectTrace: "",
        title: ""
      });
      return;
    }
    const code = appsArr.pop();

    this.$emit("select", {
      code,
      selectTrace: appsArr.join("-"),
      title: currentData.title
    });

    this.$nextTick(()=>{
      this.clearSearchKey(appsArr[0]);
    });
  }

  /**
   * 获取所有应用
   */
  async getAppList() {
    const res = await Tree.list({ isMobile: false });
    if (res.errcode === 0) {
      const tree = res.data.map((x: any) => this.convert(x));
      this.allTreeData = this.workflowTplsTree = tree;
    }
  }

  /**
   * 异步加载数据
   */
  async onTreeExpand(treeNode: any) {
    if (treeNode.isLeaf || treeNode.key.indexOf("-") > -1) {
      return;
    }

    await this.loadAppChildren(treeNode.key);
  }

  clearSearchKey(appCode : string) {
    let searchKey = "";
    const $treeSelect = this.$refs.treeSelect as Vue;

    if ($treeSelect) {
      const $vcTreeSelect = $treeSelect.$refs.vcTreeSelect as any;
      if ($vcTreeSelect) {
        searchKey = $vcTreeSelect.sInputValue;
        $vcTreeSelect.sInputValue = "";
      }
    }

    if (!searchKey) {
      return;
    }

    this.workflowTplsTree = this.allTreeData || [];

    this.loadApp(appCode);
  }

  async loadAppChildren(code: string) {
    const node = this.workflowTplsTree.find((n: any) => n.key === code);

    if (!node || node._loaded) {
      return;
    }

    const res = await Tree.getAppItem({
      appCode: node.value
    });

    if (res.errcode !== 0) {
      return;
    }

    node.children = res.data.map((c: any) => this.convert(c, node.key));
    node._loaded = true;

    this.allTreeData = this.workflowTplsTree = this.workflowTplsTree.slice();

    return node;
  }

  onSearch(text: string) {
    clearTimeout(this.searchTask);
    this.searchTask = setTimeout(() => {
      this.doSearch(text);
    }, 500);
  }

  doSearch(text: string) {
    if (text) {
      listApi
        .appSearch({
          name: text
        })
        .then((res: any) => {
          if (res.errcode !== 0) {
            this.workflowTplsTree = [];
            return;
          }

          const treeData = res.data.map((x: any) => this.convert(x));

          this.workflowTplsTree = treeData;
        });
    } else {
      this.workflowTplsTree = this.allTreeData || [];
    }
  }

  convert(item: any, parentKey?: string) {
    const key = parentKey ? `${parentKey}-${item.code}` : item.code;

    const isLeaf = item.type === "BizModel";
    const icon = item.icon || "h-icon-all-folder-o";
    const type = item.type || "app";

    const node: any = {
      key,
      icon,
      isLeaf,
      type,
      title: item.name,
      value: key,
      selectable: isLeaf,
      disabled: !isLeaf,
      scopedSlots: {
        title: 'title',
      },
      children: []
    };

    if (!isLeaf && Array.isArray(item.children)) {
      node.children = item.children.map((c: any) => this.convert(c, key));
      node._loaded = true;
    }

    return node;
  }
}
</script>

<style lang="less">
.workflow-tree {
  width: 100%;
}
.fixed.ant-select-tree-dropdown {
  width: 100%;
  max-height: 45vh !important;
  height: 400px;

  /deep/ .ant-select-tree-treenode-disabled {
    span.ant-select-tree-title {
      color: rgba(0, 0, 0, 0.65) !important;
    }
  }
  /deep/ .ant-select-tree-iconEle{
    display: none;
  }
  .cus-title {
    color: rgba(0, 0, 0, 0.65) !important;
    font-size: 14px !important;
    i {
      margin-right: 3px;
    }
  }
  .show-placeholder {
    /deep/.ant-select-selection__placeholder {
      display: block !important;
    }
  }
}
</style>
