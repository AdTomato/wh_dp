<template>
  <my-workflow @openForm="openForm"/>
</template>

<script lang="ts">

// 初始化表单组件配置
import "@/config/h3-form";


import { Component, Prop, Vue } from 'vue-property-decorator';

import * as FlowCenter from '@cloudpivot/flow-center';

@Component({
  name: 'Workflow',
  components: {
    myWorkflow: FlowCenter.components.pc.MyWorkflow
  }
})
export default class Workflow extends Vue {
  /**
   * 查看表单详情
   */
  openForm(obj:any) {
    const url = `/form/detail?workitemId=${obj.id}&workflowInstanceId=${obj.instanceId}&return=${location.pathname + location.search}`;
    if (this.isDingTalk) {
      this.$router.push({
        path: url
      });
    } else {
      const newWindow: any = window.open();
      newWindow.location.href = url;
    }
  }
}
</script>

<style lang='less' scoped>

</style>
