
<template>
  <div>
    <h3-panel
      v-for="(group,index) in groups"
      :title="group.name"
      :collapsible="true"
      :key="index"
      :bold="true"
    >
      <div class="box">
        <control-block
          v-for="c in group.controls"
          :key="c.code"
          :options="c"
          :class="{ disabled : isUsed(c.code)}"
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

import controlBill from "../typings/control-bill";

import * as dataitemStore from "../stores/data-items.store-helper";

@Component({
  name: "control-panel",
  components: {
    ControlBlock,
    H3Panel: common.components.pc.Panel
  }
})
export default class ControlPanel extends Vue {
  groups = controlBill.group;
  mounted() {
  }
  isUsed(code: string) {
    if (!code) {
      return false;
    }
    const item = dataitemStore
      .getDataItems(this)
      .filter(x => x.isSystem)
      .find(x => x.code === code);
    if (!item) {
      return false;
    }
    return item.used;
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
