
<template>
  <td :tabindex="10" @click="onClick">
    <base-control :control="control"></base-control>
  </td>
</template>


<script lang='ts'>

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

// import { FormControl, FormControlType, ControlOptions, InputOptions } from '@/components/apps/form-design/typings';
import {
  FormControl,
  FormControlType,
  DataItem
} from "../typings";

import * as ControlFactory from "../typings/control-factory";
import BaseControl from "./base-control.vue";

const prefix = "dataitem-parent-";

@Component({
  name: "sheet-statistic",
  components: {
    BaseControl
  }
})
export default class SheetStatistic extends Vue{

  @Prop()
  readonly control!: FormControl;

  @Inject()
  emitControlSelect?: Function;

  onClick(evt: Event) {
    evt.stopPropagation();
    if (this.emitControlSelect) {
      this.emitControlSelect(this.control);
    }
  }
  
}
</script>
