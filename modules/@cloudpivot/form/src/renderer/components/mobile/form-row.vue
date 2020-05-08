
<template>
  <div class="form-row">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererLayoutControl } from "../../typings";

@Component({
    name : 'form-row'
})
export default class FormRow extends Vue{

    @Prop()
    control !: RendererLayoutControl

}

</script>


<style lang="less" scoped>

.form-row{
    display: flex;
    flex-flow: row wrap;

    &.dotted{
        border-bottom:1px dotted @base-border-color;
    }

}

</style>


