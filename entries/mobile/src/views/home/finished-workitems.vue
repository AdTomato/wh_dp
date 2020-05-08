<template>
  <MyFinishedWorkItem :appCode="appCode" @openForm="openForm"/>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { State } from 'vuex-class';

import * as FlowCenter from '@cloudpivot/flow-center';

@Component({
  name: 'workitems',
  components: {
    MyFinishedWorkItem: FlowCenter.components.mobile.MyFinishedWorkItem
  }
})
export default class FinishedWorkitems extends Vue {
  @State('appCode') appCode!: any;

  openForm(workitem:any) {
    this.$router.push({
      name: 'form-detail',
      query: {
        workitemId: workitem.id,
        workflowInstanceId: workitem.instanceId,
        return: this.$route.fullPath
      }
    });
  }
}

</script>
<style lang="less" scoped>
</style>
