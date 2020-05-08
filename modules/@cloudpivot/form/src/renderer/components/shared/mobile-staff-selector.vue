
<template>

  <h3-org
    v-control-back
    :org="org"
    :title="title"
    :selectOrg="options.selectOrg"
    :selectUser="options.selectUser"
    :isMulpitle="options.mulpitle"
    :selectedData="selected"
    :searchData="searchList"
    :orgName="options.key"
    :selectPlaceholder="options.placeholder"
    :required="required"
    :readonly="readonlyFormula || readonly"
    :allowRecursion="false"
    :showModal="showModal"
    :labelStyle="labelStyle"
    :disabled="disabled"
    :locale="locale"
    :realTimeSearch="true"
    @updateShow="updateShow"
    @add="treeFocus"
    @onClickBreadcrumb="onClickBreadcrumb"
    @change="onChange"
    @onSearch="onSearch"
    @onClickTrunBack="onClickTrunBack"
    @onClickNextHierarchy="onClickNextHierarchy"
    @ok="onOk"
    @cancle="onCancle"
    @delect="delect"
  ></h3-org>

</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

import { H3Org } from "h3-mobile-vue";

import { StaffSelectorBase } from './staff-selector-base';

import ControlBack from '../../directives/control-back'

@Component({
  name: "mobile-staff-selector",
  components: {
    H3Org
  },
  directives: {
    ControlBack,
  },
  model: {
    event: "change",
    prop: "value"
  }
})
export default class MobileStaffSelector extends StaffSelectorBase {

  @Prop({
    default:''
  })
  title!:string

  @Prop({
    default: false
  })
  required!: boolean

  @Prop({
    default: false
  })
  readonlyFormula!: boolean

  @Prop({
    default: false
  })
  readonly!: boolean

  @Prop({
    default : () => ({})
  })
  labelStyle !: any

  showModal: boolean = false;

  searchTaskRef : any;

  updateShow(val:  boolean) {
    if ( val ) {
      this.show();
    } else {
      this.close();
    }
  }

  show() {
    this.showModal = true;
  }
  close() {
    this.showModal = false;
  }

  created() {
    // super.treeFocus();
  }

  treeFocus() {
    super.treeFocus();
  }

  // 删除选中
  delect(val: any) {
    this.selected = this.selected.filter((i:any) => i.key !== val.key);
    super.onChange(this.selected);
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
    clearTimeout(this.searchTaskRef);

    this.searchTaskRef = setTimeout(()=>{
      super.onSearch(name);
    },500);
  }
}
</script>

<style lang="less" scoped>
</style>

