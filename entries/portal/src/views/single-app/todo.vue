<template>
  <div class="to-do" ref="todo">
    <to-do
      :showTitle="false"
      :originate="false"
      :scrollHeight="scrollHeight"
      :appCode="appCode"
      @openForm="openForm"
    ></to-do>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { State } from 'vuex-class';
import * as FlowCenter from '@cloudpivot/flow-center';
@Component({
  name: 'app-todo',
  components: {
    ToDo: FlowCenter.components.pc.MyUnFinishedWorkItem
  }
})
export default class AppToDo extends Vue {
  scrollHeight: number = 0;

  // @State('appCode') appCode!: string;

  get appCode() {
    return window.Environment.appCode
  }
  
  mounted() {
    this.fixHeight();
    window.addEventListener('resize', this.fixHeight);
  }

  beforeDestroy(){
    window.removeEventListener('resize', this.fixHeight);
  }

  fixHeight(){
    this.$nextTick(() => {
      const wrapper = this.$refs.todo as HTMLElement;
      if (wrapper) {
        this.scrollHeight = (wrapper as any).clientHeight - 146;
      }
    });
  }

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
      window.open(url);
    }
  }
}

</script>
<style lang='less' scoped>
.to-do {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  /deep/ .content-top {
    justify-content: flex-end;
  }
  /deep/ .table-box {
    box-shadow: 0 0 0 0;
    // height: calc(100% - 0px);
    padding: 0;
  }
}
</style>
