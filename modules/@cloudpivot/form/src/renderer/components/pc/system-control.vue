
<template>
  <div class="field">
    <div class="field__label" :style="style">
      {{ label }}
      <a-tooltip
        placement="top"
        v-if="tips"
        style="margin: 5px 0 0 2px;"
      >
        <template slot="title">
          <span>{{ tips }}</span>
        </template>
        <a-icon type="anticon anticon-question-circle-o" theme="twoTone" />
      </a-tooltip>
    </div>
    <div class="field__control">{{ text }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { Icon, Tooltip } from 'h3-antd-vue';

import { SystemControl } from "../../controls";

@Component({
  name: "system-control",
  components: {
    AIcon: Icon,
    ATooltip: Tooltip,
  }
})
export default class PcSystemControl extends SystemControl {
}
</script>

<style lang="less" scoped>
.field.system > .field__label {
  // justify-content: flex-end;
  position: relative;
  flex: 0 0 104px;
}
.field__label,
.field__control {
  color: rgba(0, 0, 0, 0.45);
}

.ant-col > div.field.system.vertical .field__label{
  padding-left: 12px;
  font-size: 12px;
  font-weight:900
}

.ant-col > div.field.system.vertical .field__control{
  padding-left: 20px;
  padding-top: 5px;
}

.field__label::after {
  content: ':'
}
</style>

