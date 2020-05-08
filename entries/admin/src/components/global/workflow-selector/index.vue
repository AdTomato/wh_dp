<template>
  <a-tree-select
    v-model="result"
    class="workflow-selector"
    allowClear
    :treeData="treeData"
    :loadData="onLoadData"
    :dropdownStyle="{ maxHeight: '350px', overflow: 'auto' }"
    @change="onChange"
    :placeholder="placeholder"
  />
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import appApi from '@/apis/apps';
import workflowApi from '@/apis/workflow';

@Component({
  name:"workflow-selector"
  })
export default class workflowSelector extends Vue {
  /* NOTE: 此组件获取到的最终值，务必替换掉标志文字 `workflow_` ，此为避免code重名而做的特别标记 */
  @Prop() value!: string;
  @Prop({
    default: ''
  }) placeholder?: string;
  @Prop() onlyPublished?: boolean;

  treeData: Array<treeSelector.treeItem> = [];
  result: string[] = [];
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
      // console.log(treeNode, vm.result);
      // const code:string = treeNode.eventKey;
      const { type = null, code = '' } = treeNode.dataRef || {};
      if (type === 'app') {
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
      } else if (type === 'BizModel') {
        const ids: string[] = treeNode.dataRef.root.split('-');
        vm.getWorkflows(code).then((res: Array<treeSelector.treeItem>) => {
          vm.treeData = this.setLeafChild(ids, vm.treeData, res);
          vm.treeData = [...vm.treeData];
          resolve();
        });
      } else {
        resolve();
      }
    });
  }
  /**
   * 设置叶子节点的子节点
   * @params values: 层级分支的value路径
   * @params tree: 目标叶子节点
   * @params res: 被挂载的数据
   */
  setLeafChild(values: string[], tree: Array<treeSelector.treeItem>, res: Array<treeSelector.treeItem>) {
    const id: string = values[0];
    const newVals: string[] = values.slice(1);
    tree.some((item: treeSelector.treeItem) => {
      if (item.value === id) {
        if (newVals.length && item.children) {
          item.children = this.setLeafChild(newVals, item.children, res);
        } else {
          item.children = res;
        }
        return true;
      }
      return false;
    });
    return tree;
  }

  /**
   * 获取应用列表
   */
  getAppList() {
    appApi.getAppList().then((res: Common.Data) => {
      if (Array.isArray(res.data)) {
        const tree: Array<treeSelector.treeItem> = res.data.map((item: Apps.AppCenter.AppInfo) => ({
          title: item.name,
          value: item.code,
          key: `${item.code}_${Date.now()}`,
          isLeaf: false,
          selectable: false,
          children: [],
          dataRef: {
            type: 'app',
            code: item.code,
          }
        }));
        this.treeData = tree;
      }
    });
  }
  /**
   * 获取应用下的目录和业务模型
   */
  getBizModels(appCode: string) {
    return appApi.getAppItem({ appCode }).then((res: Common.Data) => {
      console.log('appitem', res);
      const child: Array<treeSelector.treeItem> = res.data.map((item: Apps.AppItem.AppMenu) => {
        if (item.type === 'Folder') {
          let children: Array<treeSelector.treeItem> = [];
          if (item.children) {
            children = item.children.map((biz:Apps.AppItem.AppMenu) => ({
              title: biz.name,
              value: `${biz.code}`,
              key: `${biz.code}_${Date.now()}`,
              isLeaf: false,
              selectable: false,
              children: [],
              dataRef: {
                type: biz.type,
                code: biz.code,
                root: `${appCode}-${item.id}-${biz.code}`
              }
            }));
          }
          return {
            title: item.name,
            value: item.id,
            key: item.id,
            isLeaf: false,
            selectable: false,
            children,
            dataRef: {
              root: `${appCode}-${item.id}`,
            }
          };
        }
        return {
          title: item.name,
          value: item.code,
          key: item.code,
          isLeaf: false,
          selectable: false,
          children: [],
          dataRef: {
            type: item.type,
            code: item.code,
            root: `${appCode}-${item.code}`
          }
        };
      });
      return child;
    });
  }
  /**
   * 获取业务模型下的流程
   */
  getWorkflows(schemaCode: string) {
    return workflowApi.getWorkflowList({ schemaCode }).then((res: Common.Data) => {
      const flows: any[] = this.onlyPublished ? res.data.filter((item: any) => item.published) : res.data;
      const child: Array<treeSelector.treeItem> = flows.map((workflow: any) => ({
        title: workflow.workflowName,
        value: `workflow_${workflow.workflowCode}`,
        key: `workflow_${workflow.workflowCode}`,
        isLeaf: true,
        selectable: true
      }));
      return child;
    });
  }

  onChange(val: string) {
    // console.log('选择了树节点：', val);
    this.$emit('input', val);
    this.$emit('onWorkflowChange', val);
  }

  @Watch('value')
  onValueChange(val: string) {
    this.result = [val];
  }

  beforeMount() {
    this.getAppList();
  }
}
</script>
<style lang="less" scoped>
.workflow-selector {
  width: 100%;
  max-width: 500px;
}
</style>
