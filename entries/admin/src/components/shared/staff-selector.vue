
<template>
  <SmartOrg
    :org="org"
    :selectOrg="options.selectOrg"
    :selectUser="options.selectUser"
    :showModel="options.showModel"
    :showSelect="options.showSelect"
    :isMulpitle="options.mulpitle"
    :selectedData="selected"
    :searchData="searchList"
    :orgName="options.key"
    @focus="treeFocus"
    @onClickBreadcrumb="onClickBreadcrumb"
    @change="onChange"
    @onSearch="onSearch"
    @onClickTrunBack="onClickTrunBack"
    @onClickNextHierarchy="onClickNextHierarchy"
    @ok="onOk"
    @cancle="onCancle"
  ></SmartOrg>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import SmartOrg from "@/components/global/smart-org/smartOrg.vue";

// import { State, Action, Mutation, namespace } from "vuex-class";

// const RoleModule = namespace("Organization/Role");
// const UserModule = namespace("Organization/User");

import * as orgApi from "@/apis/organization";

@Component({
  name: "staff-selector",
  components: {
    SmartOrg
  },
  model: {
    event: "change",
    prop: "value"
  }
})
export default class StaffSelector extends Vue {
  // @UserModule.State("orgTree") departmentTree: any; // 组织机构树
  // // Action
  // @RoleModule.Action("getOrgRoleNode") getOrgRoleNode: any;
  // @UserModule.Action("getOrgDepartmentNodes") getOrgDepartmentNodes: any;

  @Prop()
  options!: any;

  org: any[] = [];

  searchList: any[] = [];

  @Prop()
  value!: any[];

  selected: any = [];

  currentDept?: any;

  @Watch("value", {
    immediate: true
  })
  setValue(v: any) {
    if(!v){
      return;
    }

    this.selected = v.map((x: any) => ({
      id: x.id || x.key,
      key: x.id || x.key,
      name: x.name,
      type: x.type === 3 ? "user" : "org"
    }));
  }

  treeFocus(v: any) {
    // const _ts = this;
    // // this.getOrgNodes();
    // setTimeout(() => {
    //   _ts.org = _ts.departmentTree;
    // }, 0);
    let id = "";
    if (
      this.options &&
      this.options.rootNode &&
      this.options.rootNode.length > 0
    ) {
      id = this.options.rootNode[0].id;
    }
    this.getOrgsAndUsers(id);
  }

  // 树-返回
  onClickTrunBack(val: any) {
    const id = this.currentDept ? this.currentDept.parentId : "";
    this.getOrgsAndUsers(id);
  }

  // 树-下一级
  onClickNextHierarchy(val: any) {
    // this.assignParams({ deptId: val.id });
    // this.getOrgDepartmentNodes();
    this.currentDept = val;
    if (val && val.id) {
      this.getOrgsAndUsers(val.id);
    }
  }

  onClickBreadcrumb(val: any) {
    this.currentDept = val;
    const id = val ? val.id : null;
    this.getOrgsAndUsers(id);
  }

  onChange(items: any[]) {
    let selecteds: any[] = [];
    if (items && items.length > 0) {
      const ids: string[] = items.map(x => x.key);
      selecteds = this.value.filter((item: any) => ids.indexOf(item.id) > -1);
    }
    //this.value = selecteds;
    const list = selecteds.map(x => x.source);
    this.$emit("change", selecteds);
  }

  onOk(items: any[]) {
    //this.value = items;
    const list = items.map(x => x.source);
    this.$emit("ok", list);
    this.$emit("change", list);
  }

  onCancle() {
    this.$emit("cancel");
  }

  // 获取该级的树和用户
  getOrgsAndUsers(orgId?: string) {
    return orgApi
      .getOrgTree(orgId)
      .then(res => {
        const nodes = res.data;
        const orgTree = this.resetTree(nodes, []);
        this.org = orgTree;
        return orgTree;
      })
      .then(orgTree => {
        if (this.options && this.options.selectUser && orgId) {
          // 请求用户
          return orgApi.getUsersTree(orgId).then(res2 => {
            const nodes = res2.data.content;
            const userTree = this.resetTree(nodes, []);

            this.org.push(...userTree);
          });
        }
        return Promise.resolve();
      });
  }

  // 组装接口异步数据
  resetTree(nodes: any, orgTree: Array<any>) {
    nodes.forEach((node: any) => {
      orgTree.push({
        id: node.id,
        name: node.name,
        avatar: node.imgUrl,
        type: typeof node.employees === "undefined" ? "user" : "org",
        hasChild: typeof node.employees !== "undefined" && node.employees > 0,
        orglist: `${node.name} (${node.employees || 0})`,
        title: `${node.name} (${node.employees || 0})`,
        isLeaf: node.leaf,
        key: node.id,
        sortKey: "0", // ERROR
        parentId: node.parentId,
        children: [],
        source: node
      });
    });
    return orgTree;
  }

  onSearch(name: string) {
    if (!name) {
      return;
    }
    orgApi.search(name).then(res => {
      const data = res.data;
      const list: any[] = [];
      if (data.departments) {
        this.resetTree(data.departments, list);
      }
      if (data.users) {
        this.resetTree(data.users, list);
      }
      this.searchList = list;
    });
  }
}
</script>

<style lang="less" scoped>
</style>

