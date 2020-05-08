
<template>
  <div :style="styleObj">{{ label }}</div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl,StyleControlOptions } from "../../typings";

import { BaseControl } from "../../controls";


@Component({
    name : 'form-title'
})
export default class FormTitle extends BaseControl<StyleControlOptions>{

}

</script>

<style lang="less" scoped>
div{
    width: 100%;
    font-size: 28px;
    /*font-family: PingFang-SC-Regular;*/
    font-weight: 400;
    color: rgba(0, 0, 0, 0.85);
    line-height: 36px;
    padding: 16px;
    text-align: center;
    outline: none;
}
</style>

