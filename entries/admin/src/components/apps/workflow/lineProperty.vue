<template>
  <div class="property-container">
    <a-collapse :bordered="false" :activeKey="['1']">
      <a-collapse-panel header="基础属性" key="1">
        <common-setting type="line"/>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import commonSetting from './property/commonSetting.vue';

@Component({
  name: 'LineProperty',
  components: {
  commonSetting,
  }
  })

export default class LineProperty extends Vue {
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
</style>

