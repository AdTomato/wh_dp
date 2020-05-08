<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1']">
      <!-- 一般属性 -->
      <a-collapse-panel header="一般属性" key="1">
        <common-setting type="CONNECTION"/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import commonSetting from './property/commonSetting.vue';

@Component({
  name:"ConnectionProperty",
  components: {
  commonSetting
  }
  })
export default class ConnectionProperty extends Vue {

}
</script>
<style lang="less" scoped>

</style>
