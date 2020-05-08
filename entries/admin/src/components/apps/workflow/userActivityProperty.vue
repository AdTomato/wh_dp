<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1', '2', '3', '4', '5', '6', '7']">
      <!-- 一般属性 -->
      <a-collapse-panel header="一般属性" key="1">
        <common-setting type="PARTICIPANT"/>
      </a-collapse-panel>

      <!-- 参与者 -->
      <a-collapse-panel header="参与者" key="2">
        <participant type="PARTICIPANT"/>
      </a-collapse-panel>

      <!-- 数据权限 -->
      <a-collapse-panel header="数据权限" key="3">
        <data-item type="PARTICIPANT"/>
      </a-collapse-panel>

      <!-- 操作权限 -->
      <a-collapse-panel header="操作权限" key="4">
        <operation type="PARTICIPANT"/>
      </a-collapse-panel>

      <!-- 20190619 新增节点消息通知 -->
      <!-- <a-collapse-panel header="节点消息通知" key="7">
        <message-notify type="PARTICIPANT"/>
      </a-collapse-panel> -->

      <!-- 高级 -->
      <a-collapse-panel header="高级" key="5">
        <activity-senior type="PARTICIPANT"/>
      </a-collapse-panel>

      <!-- 事件处理 -->
      <a-collapse-panel header="事件处理" key="6">
        <activity-event type="PARTICIPANT"/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Participant from './property/participant.vue';
import DataItem from './property/dataItem.vue';
import ActivitySenior from './property/activitySenior.vue';
import CommonSetting from './property/commonSetting.vue';
import Operation from './property/operation.vue';
import ActivityEvent from './property/activityEvent.vue';
// import MessageNotify from './property/messageNotify.vue';

@Component({
  name: 'UserActivityProperty',
  components: {
    CommonSetting,
    Participant,
    Operation,
    DataItem,
    ActivitySenior,
    ActivityEvent,
    // MessageNotify
  }
})

export default class UserActivityProperty extends Vue {

}
</script>

<style lang="less">
.property-container .ant-collapse .ant-collapse-item {
  text-align: left;
  background: #fff;
}
.property-container .ant-collapse > .ant-collapse-item {
  border-bottom: 0;
}
</style>
