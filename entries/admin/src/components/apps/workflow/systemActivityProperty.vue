<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1', '2']">
      <!-- 一般属性 -->
      <a-collapse-panel header="一般属性" key="1">
        <common-setting type="SYSTEM_ACTIVITY"/>
      </a-collapse-panel>

      <!-- 事件处理 -->
      <a-collapse-panel header="事件处理" key="2">
        <activity-event type="SYSTEM_ACTIVITY"/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import commonSetting from './property/commonSetting.vue';
import ActivityEvent from './property/activityEvent.vue';

@Component({
  name: 'SystemActivityProperty',
  components: {
  commonSetting,
  ActivityEvent
  }
  })
export default class SystemActivityProperty extends Vue {

}
</script>
<style lang="less" scoped>

</style>
