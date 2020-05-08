<template>
  <apps-index />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import * as apps from '@cloudpivot/application';

@Component({
  name: 'apps',
  components: {
    AppsIndex: apps.components.mobile.AppsIndex
  }
})
export default class Apps extends Vue {

}
</script>

<style lang="less" scoped>
</style>
