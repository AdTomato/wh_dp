<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1', '2']">
      <a-collapse-panel header="基础属性" key="1">
        <common-setting type="workflow"/>
      </a-collapse-panel>

      <a-collapse-panel header="流程事件" key="2">
        <workflow-event/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import {
 Component, Vue, Prop, Watch 
} from 'vue-property-decorator';

import commonSetting from './property/commonSetting.vue';
import activityEvent from './property/activityEvent.vue';
import workflowEvent from './property/workflowEvent.vue';

@Component({
  name: 'WorkflowProperty',
  components: {
    commonSetting,
    activityEvent,
    workflowEvent
  }
})

export default class WorkflowProperty extends Vue {
  @Prop() data !: any;
}
</script>

<style lang="less">
.property-container {
  .ant-collapse .ant-collapse-item {
    text-align: left;
    background: #fff;
  }
  .ant-collapse > .ant-collapse-item {
    border-bottom: 0;
  }
  .ant-collapse-content-box {
    padding: 0;
  }
}

.property-container input{
  border: 0!important;
  outline: none!important;
  &:focus {
    box-shadow: unset!important;
  }
}

.content-right {
  width: 100%;
  display: inline-block;
  white-space:nowrap;
  text-overflow:ellipsis;
  overflow:hidden;
}
</style>
