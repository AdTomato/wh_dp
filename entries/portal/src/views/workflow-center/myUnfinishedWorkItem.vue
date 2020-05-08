<template>
  <my-unfinished-work-item @openForm="openForm"/>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator';

import * as FlowCenter from '@cloudpivot/flow-center';

@Component({
  name: 'UnfinishedWorkItem',
  components: {
    MyUnfinishedWorkItem: FlowCenter.components.pc.MyUnFinishedWorkItem
  }
})

export default class UnfinishedWorkItem extends Vue {
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

<style lang="less" scoped>
</style>
