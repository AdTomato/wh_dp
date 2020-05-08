
<template>
  <a-row type="flex">
    <slot></slot>
  </a-row>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererLayoutControl } from "../../typings";

import {
  Row
} from 'h3-antd-vue';

@Component({
    name : 'form-row',
    components:{
        ARow : Row
    }
})
export default class FormRow extends Vue{

    @Prop()
    control !: RendererLayoutControl

}

</script>


<style lang="less" scoped>
.dashed {
    border-bottom:1px dashed @border-color;
}
</style>

