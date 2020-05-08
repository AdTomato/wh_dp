
<template>
  <reverse-relevance-list v-if="isTabs" :control="control"></reverse-relevance-list>
  <h3-panel 
    :title="label" 
    :collapsible="true" 
    :labelStyle="style"
    :iconRight="true"
    :tips="tips"
    v-else
  >
    <reverse-relevance-list v-if="isList" :control="control"></reverse-relevance-list>
  
    <reverse-relevance-link v-else :control="control"></reverse-relevance-link>

  </h3-panel>
</template>

<script lang="ts" src="./reverse-relevance.ts"></script>

<style lang="less" scoped>
.h3-panel {
  width: 100%;
  text-align: left;
}

.ant-divider-horizontal {
  margin: 1px 0;
}
</style>
