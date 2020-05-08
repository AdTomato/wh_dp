<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1','2', '3', '4']">
      <!-- 一般属性 -->
      <a-collapse-panel header="一般属性" key="1">
        <common-setting
          type="SUB_INSTANCE"
          v-if="isShowCommonSetting"
        />
      </a-collapse-panel>

      <!-- 数据映射 -->
      <a-collapse-panel header="数据映射" key="2">
        <data-mapping/>
      </a-collapse-panel>

      <!-- 参与者设置 -->
      <a-collapse-panel header="参与者" key="3">
        <participant type="SUB_INSTANCE"/>
      </a-collapse-panel>

      <!-- 事件处理 -->
      <a-collapse-panel header="事件处理" key="4">
        <activity-event type="SUB_INSTANCE"/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import {
 Component, Vue, Prop, Watch 
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import commonSetting from './property/commonSetting.vue';
import Participant from './property/participant.vue';
import DataMapping from './property/dataMapping.vue';
import { SWTreeGenerator } from './helper/helper';
import ActivityEvent from './property/activityEvent.vue';
@Component({
  name: 'SubInstanceProperty',
  components: {
    commonSetting,
    Participant,
    DataMapping,
    ActivityEvent
  }
})
export default class SubInstanceProperty extends Vue {
  isShowCommonSetting:boolean = true;
}
</script>
<style lang="less" scoped>

</style>
