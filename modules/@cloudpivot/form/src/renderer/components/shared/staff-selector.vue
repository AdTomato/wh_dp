
<template>

  <SmartOrg
    :org="org"
    :selectOrg="options.selectOrg"
    :selectUser="options.selectUser"
    :showModel="options.showModel"
    :showSelect="options.showSelect"
    :isMulpitle="options.mulpitle"
    :title="options.title"
    :selectedData="selected"
    :searchData="searchList"
    :orgName="options.key"
    :selectPlaceholder="options.placeholder || placeholder"
    :showPart="onlyForm"
    :allowRecursion="false"
    :locale="locale"
    :disabled="disabled"
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

import SmartOrg from "./smart-org/smartOrg.vue";

import { StaffSelectorBase } from './staff-selector-base';

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
export default class StaffSelector extends StaffSelectorBase {
  

  treeFocus() {
    super.treeFocus();
  }

  // 树-返回
  onClickTrunBack() {
    super.onClickTrunBack();
  }

  // 树-下一级
  onClickNextHierarchy(val: any) {
    super.onClickNextHierarchy(val);
  }

  onClickBreadcrumb(val: any) {
    super.onClickBreadcrumb(val);
  }

  onChange(items: any[]) {
    super.onChange(items);
  }

  onOk(items: any[]) {
    super.onOk(items);
  }

  onCancle() {
    super.onCancle();
  }

  onSearch(name: string) {
    super.onSearch(name);
  }
}
</script>

<style lang="less" scoped>
</style>

