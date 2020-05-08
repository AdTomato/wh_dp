<template>
  <a-cascader
    placeholder="角色"
    class="role-tree"
    :value="role"
    :options="treeData"
    :loadData="loadData"
    @change="onChange"
  />
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import OrgApi from '@/apis/organization';
import Bus from '@/utils/bus';

@Component({
  name: 'RoleTree'
})
export default class RoleTree extends Vue {
  @Prop() selected: any;

  treeData: any = null;

  role: string[] = [];

  // 已选角色组的id
  selectedGroup: string = '';

  mounted() {
    Bus.$on('changeFormulaRole', (roleId: string) => {
      this.treeData = null;
      this.InitTree(roleId);
    });
  }

  beforeDestroy() {
    Bus.$off('changeFormulaRole');
  }

  async InitTree(roleId: string) {
    if (roleId) {
      const _group = await this.getRoleGroup(roleId);
      if (_group) {
        this.selectedGroup = _group.id;
        this.role = [_group.id, roleId];
      }
    }
    await this.initList();
  }

  getRoleGroup(code: string) {
    /* 根据角色获取角色组 */
    return OrgApi.getRoleGroupByCode({
      roleCode: code
    }).then((res: Common.Data) => {
      if (res.errcode === 0) {
        return res.data;
      }
    });
  }

  initList() {
    OrgApi.getRoleLeveOneInfo().then(async (res: Common.Data) => {
      if (Array.isArray(res.data) && res.data.length) {
        this.treeData = await this.formatTree(res.data);
      }
    });
  }

  formatTree(arr: Array<Organization.OrgNode>) {
    const tree: any[] = [];
    arr.forEach(async (node: Organization.OrgNode) => {
      const n:any = {
        value: node.id,
        name: node.name,
        label: `${node.name}`,
        isLeaf: false,
      };
      if (Array.isArray(node.children) && node.children.length) {
        n.children = this.formatChild(node.children);
      } else if (this.selectedGroup && node.id === this.selectedGroup) {
        await this.getChildNode(node.id).then((child: Array<Organization.OrgNode>) => {
          n.children = this.formatChild(child);
        });
      }
      tree.push(n);
    });
    return tree;
  }

  formatChild(arr: Array<Organization.OrgNode>) {
    const children = arr.map((child: Organization.OrgNode) => ({
      value: child.code,
      name: child.name,
      label: `${child.name}`
    }));
    return children;
  }

  loadData(options: any[]) {
    const target = options[options.length - 1];
    target.loading = true;
    this.getChildNode(target.value).then((arr: Array<any>) => {
      target.children = this.formatChild(arr);
      setTimeout(() => {
        target.loading = false;
        this.treeData = [...this.treeData];
      }, 200);
    });
  }

  getChildNode(groupId: string) {
    return OrgApi.getChildrenRole({ groupId }).then((res: Common.Data) => {
      if (Array.isArray(res.data) && res.data.length) {
        return res.data;
      }
      return [];
    });
  }

  onChange(value: any[]) {
    // console.log('value:', value);
    this.role = value;
    if (!value.includes(this.selected)) {
      this.$emit('select', value);
    }
    if (value.length === 1) {
      this.$message.info('该角色组下无角色，无法选中');
    }
  }
}
</script>
<style lang="less" scoped>
.role-tree {
  margin: 0 8px;
  width: 200px;
}
</style>
