<template>
  <single-app/>
</template>

<script lang="ts">
import {
  Component, Prop, Vue
} from 'vue-property-decorator';

import * as application from '@cloudpivot/application';
// import * as FlowCenter from '@cloudpivot/flow-center';

@Component({
  name: 'single-app-index',
  components: {
    SingleApp: application.components.mobile.SingleApp
  }
})
export default class SingleAppIndex extends Vue {

}

</script>
<style lang='less' scoped>

</style>
