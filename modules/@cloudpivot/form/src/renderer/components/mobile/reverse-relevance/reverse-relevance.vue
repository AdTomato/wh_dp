
<template>
  <reverse-relevance-tabs v-if="isTabs" :control="control"></reverse-relevance-tabs>
  <reverse-relevance-list v-else :control="control"></reverse-relevance-list>
</template>

<script lang="ts">

import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import ReverseRelevanceList from "./reverse-relevance-list.vue";

import ReverseRelevanceTabs from "./reverse-relevance-tabs.vue";

import { ReverseRelevanceControl } from "../../../controls";

import common from '@cloudpivot/common';


@Component({
  name: "reverse-relevance",
  components: {
    ReverseRelevanceList,
    ReverseRelevanceTabs,
    H3Panel: common.components.pc.Panel,
  }
})
export default class ReverseRelevance extends ReverseRelevanceControl {
  
}
</script>

<style lang="less" scoped>

</style>
