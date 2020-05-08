<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1', '2', '3']">
      <!-- 一般属性 -->
      <a-collapse-panel header="一般属性" key="1">
        <common-setting type="CIRCULATE"/>
      </a-collapse-panel>

      <!-- 参与者设置 -->
      <a-collapse-panel header="参与者" key="2">
        <participant type="CIRCULATE"/>
      </a-collapse-panel>

      <!-- 事件处理 -->
      <a-collapse-panel header="事件处理" key="3">
        <activity-event type="CIRCULATE"/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import commonSetting from './property/commonSetting.vue';
import Participant from './property/participant.vue';
import ActivityEvent from './property/activityEvent.vue';

@Component({
  name: 'CirculateProperty',
  components: {
    commonSetting,
    Participant,
    ActivityEvent
  }
})
export default class CirculateProperty extends Vue {

}
</script>
<style lang="less" scoped>

</style>
