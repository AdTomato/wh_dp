<template>
  <div class="workflow-track">
    <h3-tab
      :lineWidth="2"
      :customBarWidth="'24px'"
      v-model="index"
    >
      <h3-tab-item :selected="index===0">{{ $t('languages.common.approval') }}</h3-tab-item>
      <h3-tab-item :selected="index===1">{{ $t('languages.common.workflowChart') }}</h3-tab-item>
    </h3-tab>
    <div class="tab-content">
      <div class="scroll">
        <Approvals
          :approvals="approvals"
          :creater="creater"
          :workflowInfo="workflowInfo"
          :participants="participants"
          v-show="!index"
          @goSubInstance="goSubInstance"
          @preview="onPreview"
          @detail="onDetail"
        ></Approvals>
        <!-- 流程图 -->
        <Chart
          v-if="index"
          :chart="chart"
          :show="!!index"
          :workflowStatus="workflowInfo.status"
        >1 Container
        </Chart>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Watch, Prop
} from 'vue-property-decorator';

import {
  H3Tab,
  H3TabItem,
  H3Swiper,
  H3SwiperItem,
} from 'h3-mobile-vue';

import * as flow from '@cloudpivot/flow';

import { renderer } from '@cloudpivot/form';

import common from '@cloudpivot/common';

import { workflowApi, workflow } from '@cloudpivot/api';



@Component({
  name: 'workflow-track',
  components: {
    H3Tab,
    H3TabItem,
    H3Swiper,
    H3SwiperItem,
    Approvals: flow.components.mobile.Approval,
    Chart: flow.components.mobile.WorkflowChart
  },
})
export default class WorkflowTrack extends Vue {
  index = 0;

  approvals: workflow.ApprovalInstance[] = [];

  creater = {} as any;

  chart = [];

  chartSize = {width:0,height:0};

  workflowInfo: any = {};

  participants = [];

  workflowInstanceId = '';

  created() {
    // this.load();
    this.loadAsync();
  }

  /**
   * #23812-临时修复流程图表不居中的问题;
   * 现有方案使用scale方式进行缩放, 会有损清晰度. 建议后期使用svg的无损放大, 因此这个修复仅作为临时解决办法
   */
  // @Watch('index', {immediate: true})
  // @Watch('chart', {immediate: true})
  // onTabChange() {
  //   if ( this.index!==1 || !this.chart.length ) return;

  //   this.$nextTick(()=>{
  //     console.log('_______ next')
  //     console.log( !!document.body );
  //     console.log( document.querySelector('.flow-track-chart__drawer') )
  //     let body            = document.body;
  //     let drawerWrapper   = body.querySelector('.flow-track-chart__drawer') as any;
  //     let designerWrapper = drawerWrapper.querySelector('.workflow-designer') as any;
  //     drawerWrapper.scrollTop = drawerWrapper.scrollHeight/2 - designerWrapper.clientHeight*(body.clientWidth/designerWrapper.clientWidth);
  //   })
  // }

  loadAsync() {
    let workflowInstanceId = this.workflowInstanceId = this.$route.params.workflowInstanceId;

    // 获取审批日志
    workflowApi.getApproval({ workflowInstanceId })
    .then((resp:any)=>{
      if ( resp.errcode!==0 ) throw resp.errmsg;
      resp.data = (!!resp.data && Array.isArray(resp.data)? resp.data: [])
        .map((item:any)=>common.utils.compatible(item, 'activityName'));
      // 赋值
      this.approvals = resp.data;
      try { this.creater = resp.data[0].nodes[0].approvaler; } catch { }
    })
    // 报错
    .catch(err=>this.$h3.toast.show({text:err.toString()}));

    // 获取流程实例信息
    workflowApi.getWorkflowBaseInfo({ workflowInstanceId })
    .then(resp=>{
      if ( resp.errcode!==0 ) throw resp.errmsg;
      this.workflowInfo = resp.data || {};
      this.participants = this.workflowInfo.participants;
    })
    .catch(err=>this.$h3.toast.show({text:err.toString()}));

  }

  onPreview(file:any) {
    if (!file) {
      return;
    }
    renderer.UploadControl.service.preview(file, [file]);
  }

  onDetail(params : any) {
    this.$router.push({
      name: 'FormApprovalDetails',
      params
    });
  }

  /*
  * 点击审批记录子流程
  */
  goSubInstance(log:any) {
    this.$router.push({
      name: 'form-detail',
      query: {
        workflowInstanceId: log.workflowInstanceId,
        workitemId: log.workItemId,
        return: `${location.pathname + location.search}`
      }
    });
  }
}

</script>


<style lang="less">
@import "~@/styles/mixins.less";

.workflow-track{
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #F7F8FC;
  overflow: hidden;
  .h3-tab{
    flex: 0 0;
    .px2rem(flex-basis, 88px);
    z-index: 2;
    &-item{
      color: #999;
    }
    &-selected{
      .px2rem(font-size,@font-size-base);
      font-weight:600;
      color:rgba(0,0,0,0.85);
    }
    &-ink-bar{
      .px2rem(height,6px);
    }
    &-bar-inner{
      .px2rem(margin-top,-2px);
      .px2rem(height,6px);
      .px2rem(border-radius,3px);
    }
  }
  .tab-content{
    flex: 1 1;
    height: 100%;
    overflow: hidden;
    .scroll{
      height: 100%;
      overflow-x: hidden;
      overflow-y: auto;
    }
  }
}


</style>
