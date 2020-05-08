
<template>
  <!-- <a-tree-select
    showSearch
    allowClear
    :filterTreeNode="false"
    @focus="onSearch('')"
    @search="onSearch"
    style="width:100%"
    >

    <a-icon slot="suffixIcon" type="smile" />

    <a-tree-select-node 
        v-for="opt in options" 
        :key="opt.id" 
        :value="opt.id" 
        :title="opt.name" 
    />

  </a-tree-select>-->
  <a-select
    :value="selectedId"
    showSearch
    allowClear
    :filterOption="false"
    :notFoundContent="fetching ? undefined : '无匹配结果'"
    :placeholder="placeholder"
    :getPopupContainer="getPopupContainer()"
    @focus="onFocus"
    @search="onSearch"
    @change="onChange"
    style="width:100%"
  >
    <!-- <a-icon slot="suffix" type="file"/> -->

    <a-spin
      v-if="fetching"
      slot="notFoundContent"
      size="small"
    />
    
    <a-select-option
      v-if="selectedId && list.length === 0"
      :value="selectedId"
    >{{ selectedItem }}</a-select-option>

    <a-select-option
      v-for="item in drowdownList"
      :key="item.id"
      :value="item.id"
    >{{ item[getDisplayField]}}</a-select-option>
  </a-select>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import {
  RelevanceFormControl,
  RelevanceFormSearchResult
} from "../../../controls";

import {
  // TreeSelect,
  Select,
  Tooltip,
  Icon,
  Spin
} from "h3-antd-vue";

@Component({
  name: "relevance-form-dropdown",
  components: {
    ATooltip: Tooltip,
    ASelect: Select,
    ASelectOption: Select.Option,
    // ATreeSelect: TreeSelect,
    // ATreeSelectNode: TreeSelect.TreeNode,
    AIcon: Icon,
    ASpin: Spin
  }
})
export default class RelevanceFormDropdown extends RelevanceFormControl {
  list: RelevanceFormSearchResult[] = [];

  searchTimeoutRef: any;

  fetching = false;

  get selectedId() {
    if (this.ctrl.value) {
      return this.ctrl.value.id || null;
    }
    return null;
  }

  get selectedItem () {
    if (this.selectedId && this.list.length === 0) {
      return this.parseDisplayFieldValue(this.ctrl.value[this.getDisplayField], this.getDisplayField)
    }
    return ''
  }

  get drowdownList () {
    if (this.list.length) {
        let arr:any[] = []
        for(let val of this.list) {
          if (val[this.getDisplayField] !== null) {
            console.log(111, val)
            let value = this.parseDisplayFieldValue(val[this.getDisplayField], this.getDisplayField)
            arr.push({
              id: val.id,
              [this.getDisplayField]: value
            })
          }
        }
        return arr
    } else {
      return []
    }
  }

  setControl(){
    super.setControl();
    if(this.selectedId){
      this.onFocus();
    }
  }

  onFocus() {
    this.search("");
  }

  onSearch(value: string) {
    clearTimeout(this.searchTimeoutRef);
    this.searchTimeoutRef = setTimeout(() => {
      this.search(value);
    }, 300);
  }

  search(value: string) {
    if (this.fetching) {
      return;
    }
    this.fetching = true;
    this.list = [];
    this.fetch(1,1000,value).then(
      seg => {
        this.fetching = false;
        this.list = seg.data;
      },
      () => (this.fetching = false)
    );
  }

  async onChange(selectedId: string) {
    if (selectedId) {
      let item = this.list.find(x => x.id === selectedId);
      item = await this.convertForMappings(item);
      // this.ctrl.value = item;
      this.setValue(item);
    } else {
      this.ctrl.value = null;
    }
  }
}
</script>

<style>
</style>
