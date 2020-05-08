<template>
  <a-tree-select
    allowClear
    :treeCheckable="treeCheckable"
    :multiple="multiple"
    :treeData="tree"
    :placeholder="placeholder"
    v-model="selected"
    @onExpand="onExpand"
    @change="onChange"
    style="width:100%"
    :class="{'role-tree':true,'has-selected':selected.length>0}"
   
  />
</template>


<script lang="ts">
import {
  Component, Vue, Prop, Watch, Model
} from 'vue-property-decorator';

import OrgApi from '@/apis/organization';

@Component({
  name: 'RoleTree'
})
export default class RoleTree extends Vue {
  @Model('change')
  value!: any[];

  @Prop({
    default: true
  })
  multiple!: boolean;

  //是否可选父节点
  @Prop({
    default: false
  })
  treeCheckable!: boolean;

  @Prop({
    default: ''
  })
  placeholder!: string;

  selected: any[] = [];

  tree: any[] = [];

  @Watch('value', {
    immediate: true
  })
  onValueChange(value: any[]) {
    if (!value) {
      return;
    }

    // this.selected = value;
    if (this.tree.length) {
      this.selected = value.map((v: any) => v.id);
    }
  }

  convert(x: any, isLeaf: boolean) {
    let children = null;
    if (x.children) {
      children = x.children.map((c : any) => this.convert(c, !c.children));
    }
    return {
      value: x.id,
      key: x.id,
      title: x.name,
      isLeaf: !!isLeaf,
      selectable: !!isLeaf, // || this.groupSelectable,
      children
    };
  }

  onExpand(evt: any) {
    const groupId = evt.key;
    if (!groupId) {
      return;
    }

    const node = this.tree.find((x: any) => x.key === groupId);
    if (node.children && node.children.length) {
      return;
    }

    OrgApi.getChildrenRole({
      groupId
    }).then((res: Common.Data) => {
      if (res.errcode === 0) {
        node.children = res.data.map((x: any) => this.convert(x, true));
        this.tree = this.tree.slice(0);
      }
    });
  }

  onChange() {
    const value = this.tree
      .flatMap((x: any) => x.children)
      .filter((x: any) => x && this.selected.indexOf(x.key) > -1)
      .map((s: any) => ({
        id: s.key,
        name: s.title,
        groupId: s.groupId
      }));
    this.$emit('change', value);
  }

  mounted() {
    OrgApi.getRoleLeveOneInfo(true).then(async (res: Common.Data) => {
      if (Array.isArray(res.data) && res.data.length) {
        this.tree = res.data.filter((x: any) => x.children && x.children.length)
          .map((x: any) => this.convert(x, false));

        if (this.value && this.value.length) {
          // this.value.
          this.selected = this.value.map((v: any) => v.id);
          this.roleMounted();
        }
      }
    });
  }

  roleMounted() {
    this.$nextTick(() => {
      this.$emit('onLoad');
    })
  }
}
</script>
<style lang="less" scoped>
.role-tree{
  /deep/ .ant-select-selection--multiple{
      min-height: auto;
      padding-bottom: 0;
    .ant-select-selection__rendered{
      margin-bottom: 0px!important;
    }
  }
}
.has-selected {
  /deep/ .ant-select-selection--multiple{
      
    .ant-select-selection__rendered{
      margin-bottom: 0px!important;
      line-height: 24px;
      margin-bottom: 3px!important;
    }
  }
}
</style>
