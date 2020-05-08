<template>
  <div class="workflow-designer">
    <!-- 节点渲染 -->
    <activity-instance
      :activities="activities"
      :flowStatus="flowStatus"
      :workflowStatus="workflowStatus"
      @click="(activity, e)=> { $emit('onActivity', activity, e) }"
    />
    <!-- 连线渲染 -->
    <line-instance :lineColor="this.lineColor" :lines="lines"/>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import WorkflowManager from '../class/workflowManager';
import Line from '../class/Line';
import { Activity, WorkflowData } from '../typings/workflow';

/* 组件 */
import ActivityInstance from './activity.vue';
import LineInstance from './line.vue';

@Component({
  name: 'WorkflowDesigner',
  components: {
    ActivityInstance,
    LineInstance
  }
})
export default class WorkflowDesigner extends Vue {
  @Prop() flowData!: WorkflowData;
  @Prop() workflowStatus?: string;
  @Prop() flowStatus!: any;
  @Prop() lineColor!: string; // 线的颜色
  @Prop({default:()=>({clickable:true})}) chartOptions:any;


  lines: Line[] = [];

  activities: Activity[] = [];

  beforeMount() {
    /* 获取流程图数据并渲染 */
    if (this.flowData) {
      this.initFlow(this.flowData);
    }
  }

  initFlow(data: any) {
    const code: string = data.workflowCode;
    const workflow: WorkflowManager = new WorkflowManager(code);
    /* 初始化节点 */
    this.activities = data.activities.map((activity: any) => {
      const _activity = workflow.addActivity(activity);
      return _activity;
    });
    /* 初始化连线 */
    const lines = data.rules.map((rule: any) => {
      const _line = workflow.addLine(this.activities, rule);
      return _line;
    }).filter((line: Line) => !!line);
    /* 绘制连接线 */
    this.$nextTick(() => {
      const len = lines.length;
      for (let i = 0; i < len; i += 1) {
        const line = lines[i];
        if (!line.points || !line.points.length) {
          line.setPoints();
        }
        line.setDirections();
        line.calcCrossPoints(lines);
        line.draw(true);
      }
      this.lines = lines;
    });
  }
}
</script>
<style lang="less" scoped>
.workflow-designer {
  position: relative;
  width: calc(100% - 60px);
  height: calc(100vh - 60px);
  margin: 30px;
  box-sizing: border-box;
}
</style>
