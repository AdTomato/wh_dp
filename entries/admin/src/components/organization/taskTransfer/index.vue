<template>
  <div class="work-handover">
    <div class="work-handover-tabs">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane :tab="'待办任务'" key="1">
          <div class="tabs__wrap">
            <TodoTask :userid="userid"/>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="'应用数据'" key="2">
          <div class="tabs__wrap">
            <AppsData :userid="userid"/>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop
} from 'vue-property-decorator';
import TodoTask from './todoTask.vue';
import AppsData from './appsData.vue';

@Component({
  name: 'TaskTransfer',
  components: {
    TodoTask,
    AppsData
  }
})
export default class TaskTransfer extends Vue {
  @Prop() userid!: string
}
</script>
<style lang="less" scoped>
  .work-handover{
    height: 100%;
    .work-handover-tabs{
      height: 100%;
    }
    /deep/.ant-tabs{
      height: 100%;
    }
    /deep/.ant-tabs-nav-wrap{
      margin: 0 24px;
    }
    .tabs__wrap{
      margin: 0 24px;
    }
    /deep/.ant-tabs-bar{
      margin-bottom: 16px !important;
    }
  }
</style>
