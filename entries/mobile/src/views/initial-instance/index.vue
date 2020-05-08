<template>
  <initial-instance/>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import { components } from '@cloudpivot/flow-center';

@Component({
  name: 'initial-instances',
  components: {
    InitialInstance: components.mobile.InitialInstance
  },
})
export default class InitialInstance extends Vue {

}
</script>

<style lang="less" scoped>
</style>
