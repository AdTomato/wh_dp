
<template>
  <H3Field
    class="input-logic"
    :showIcon="false"
    :label="label"
    :required="ctrl.required"
    :labelStyle="styleObj"
  >
    <h3-switch
      v-model="ctrl.value"
      :readonly="readonly"
      color="#2970ff"
      :class="{ disabled :readonly }"
    />
  </H3Field>

</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { H3Switch,H3Field } from 'h3-mobile-vue';
import { RendererFormControl, LogicOptions } from "../../typings";
import { BaseControl } from "../../controls";

@Component({
  name: "input-logic",
  components:{
    H3Switch,
    H3Field
  }
})
export default class InputLogic extends BaseControl<LogicOptions> {

  // onChange(evt : boolean){
  //     if(this.ctrl){
  //       this.ctrl.value = evt;
  //     }
  // }

}
</script>

<style lang="less" scoped>

.input-logic{
  /deep/.h3-field-box > .h3-FB1{
    text-align: right;
    padding-top: 7px;
    padding-bottom: 7px;
  }
}
.input-logic.vertical{
  /deep/.h3-field-box > .h3-FB1{
    text-align: left;
  }
}

/deep/.h3-switch.disabled{
  opacity: 0.5;
}
</style>

