<template>
  <start-workflow/>
</template>

<script lang="ts">

import { Component, Vue, Prop } from 'vue-property-decorator';

import * as FlowCenter from '@cloudpivot/flow-center';

@Component({
  name: 'StartWorkflow',
  components: {
    startWorkflow: FlowCenter.components.pc.StartWorkflow
  }
})

export default class StartWorkflow extends Vue {

}
</script>

<style lang="less" scoped>

</style>
