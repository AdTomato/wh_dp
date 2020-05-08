
<template>
  <div>
    <h3-panel 
      title="业务数据项"
      :collapsible="true"
      :bold="true"
    >
      <div class="box">
        <template v-for="item in bizs">
          <control-block
            :key="item.code"
            :options="item"
            :isDataItem="true"
            :class="{ disabled : item.used}"
            v-h3-drag
          ></control-block>

          <div
            class="box"
            :key="item.code + '-props'"
            v-if="item.properties"
          >
            <control-block
              v-for="subItem in filter(item.properties)"
              :key="item.code + '.'+ subItem.code"
              :options="subItem"
              :isDataItem="true"
              :class="{ disabled : subItem.used}"
              v-h3-drag
            ></control-block>
          </div>
        </template>
      </div>
    </h3-panel>

    <h3-panel
      title="系统数据项"
      :collapsible="true"
      :bold="true"
    >
      <div class="box">
        <control-block
          v-for="item in systems"
          :key="item.code"
          :options="item"
          :isDataItem="true"
          :class="{ disabled : item.used}"
          v-h3-drag
        ></control-block>
      </div>
    </h3-panel>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";

import common from "@cloudpivot/common";

import ControlBlock from "./control-block.vue";

import * as dataitemStore from "../stores/data-items.store-helper";
import { DataItemState } from "../stores/data-items.store";

import * as systemCodes from "../../../shared/system-data-item-codes";

const disabledKeys = [
  systemCodes.name,
  systemCodes.sequence_status,
  systemCodes.owner_dept_Id
];

const codes = Object.keys(systemCodes)
  .map(k => (systemCodes as any)[k])
  .filter(k => disabledKeys.indexOf(k) === -1);

@Component({
  name: "data-item-panel",
  components: {
    ControlBlock,
    H3Panel: common.components.pc.Panel
  }
})
export default class DataItemPanel extends Vue {
  get items() {
    return dataitemStore.getDataItems(this);
  }

  get bizs() {
    return this.items.filter(x => x.published && !x.isSystem);
  }

  get systems() {
    return this.items.filter(x => x.isSystem && codes.indexOf(x.code) > -1);
  }

  filter(items: DataItemState[]) {
    return items.filter(x => x.published && !x.isSystem);
  }
}
</script>


<style lang="less" scoped>
.box {
  text-align: left;
  padding-left: 8px;
}

/deep/.h3-panel-header {
  display: block !important;
}
</style>
