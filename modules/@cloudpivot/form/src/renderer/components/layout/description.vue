
<template>
  <div class="description">
    <mutil-text
      v-show="ctrl.display"
      :text="label"
      :align="align"
      :labelStyle="style"
      class="desc"
    ></mutil-text>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl } from "../../typings";

import { Control } from "h3-forms";

import MutilText from "../shared/mutil-text.vue";

import { FormControlType, LayoutControlOptions } from "../../typings";

import { BaseControl } from "../../controls";

@Component({
  name: "description",
  components: {
    MutilText
  }
})
export default class Description extends BaseControl<LayoutControlOptions> {
  get align() {
    return this.controlOpts.align;
  }
}
</script>

<style lang="less" scoped>
/deep/.mutil-text {
  font-size: 12px;

  & > span {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>

