
<template>
  <div>
    <a
      v-for="item in data"
      :key="item.id"
      @click="onClick(item)"
    >{{ item.name }};</a>
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
  RelevanceFormSelectMode
} from "../../../typings";

import { ReverseQueryService }  from '../../../services'

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
  data: any[] = [];

  onClick(item: any) {
    this.open(item);
  }

  mounted() {
    const schemaCode = this.controlOpts.schemaCode || '';
    const listCode = this.controlOpts.listCode || '';
    const conditions = this.controlOpts.conditions;
    const formControls = this.getFormControls();
    const c =  this.control;
    const param = ReverseQueryService.getParams(conditions,formControls,c, this.findController);
    const queryParam:any[] = [];
    if (param.length > 0) {
      ReverseQueryService.getListQueryConditions(schemaCode,listCode,param).then(res => {
        const queryConditions = res.conditions || [];
        param.forEach(p => {
          const queryItem = queryConditions.find(q => q.propertyCode === p.code);
          queryParam.push({
            code: p.code,
            type: queryItem.propertyType,
            value: p.value
          })
        });
        this.getAll(queryParam).then(data => (this.data = data));
      });
    } else {
      this.getAll(queryParam).then(data => (this.data = data));
    }
    // this.getAll().then(data => (this.data = data));
  }
}
</script>

<style>
</style>
