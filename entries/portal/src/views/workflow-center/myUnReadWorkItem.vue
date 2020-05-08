<template>
  <my-unread-work-item @openForm="openForm"/>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';


import {
  Action, namespace
} from 'vuex-class';

import * as FlowCenter from '@cloudpivot/flow-center';


@Component({
  name: 'UnReadWorkItem',
  components: {
    MyUnreadWorkItem: FlowCenter.components.pc.MyUnReadWorkItem
  }
})

export default class UnReadWorkItem extends Vue {
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
