<template>
  <div class="to-read" ref="toRead">
    <to-read
      :showTitle="false"
      :scrollHeight="scrollHeight"
      :appCode="appCode"
      @openForm="openForm"
    ></to-read>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { State } from 'vuex-class';

import * as FlowCenter from '@cloudpivot/flow-center';

@Component({
  name: 'app-to-read',
  components: {
    ToRead: FlowCenter.components.pc.MyUnReadWorkItem
  }
})
export default class AppToRead extends Vue {
  // @State('appCode') appCode!: string;

  scrollHeight: number = 0;

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
      const wrapper = this.$refs.toRead as HTMLElement;
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
.to-read {
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
