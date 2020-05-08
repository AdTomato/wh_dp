<template>
  <div class="reverse-relevance-list">
    <list-selector
      :listCode="controlOpts.listCode"
      :schemaCode="controlOpts.schemaCode"
      :cols="3"
      :showActions="isTabs"
      :showSearch="isTabs"
      :isReverse="true"
      :selectable="false"
      :query="queryCondition"
      :defaultQuery="defaultQuery"
      :reverseControlCode="id"
      :sequenceStatus="sequenceStatus"
      :reverseSchemaCode="selfSchemaCode"
      :reverseFormCode="selfFormCode"
      :currentFormId="currentFormId"
      :currentSheetId="currentSheetId"
      :reverseFormFieldCode="controlOpts.fieldCode"
    ></list-selector>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import {
  RelevanceFormControl,
  ReverseRelevanceControl
} from "../../../controls";

import {
  RendererFormControl,
  RelevanceFormOptions,
  RelevanceFormSelectMode,
  ListDispalyMode
} from "../../../typings";

import { ReverseQueryService } from "../../../services";

import {
  // TreeSelect,
  Select,
  Tooltip,
  Icon,
  Spin
} from "h3-antd-vue";

@Component({
  name: "reverse-relevance-list",
  components: {}
})
export default class ReverseRelevanceList extends ReverseRelevanceControl {
  created() {
    const comp = RelevanceFormControl.loadListSelector();
    (this.$options as any).components.ListSelector = comp;
    const conditions = this.controlOpts.conditions;
    const formControls = this.getFormControls();
    const c = this.control;
    this.queryCondition = ReverseQueryService.getParams(
      conditions,
      formControls,
      c,
      this.findController
    );
    this.queryCondition.push(this.field);
  }
  queryCondition: any = {};

  // get query() {
  //   const conditions = this.controlOpts.conditions;
  //   const formControls = this.getFormControls();
  //   const c =  this.control;
  //   const param = ReverseQueryService.getParams(conditions,formControls,c, this.findController);
  //   return {}
  // }
  get defaultQuery() {
    const val: any[] = [];
    if (this.field) {
      const { code, type, value } = this.field;
      val.push({
        propertyCode: code,
        propertyType: type,
        propertyValue: value
      });
    }
    return val;
  }
}
</script>

<style scoped lang="less">
.reverse-relevance-list {
  position: relative;
  /deep/.noAction {
    .sheet__row {
      cursor: pointer;
    }
  }
}
</style>
