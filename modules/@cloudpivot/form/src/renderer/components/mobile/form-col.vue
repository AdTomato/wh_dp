
<template>
  <div class="form-col">
    <slot></slot>
  </div>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { LayoutCol } from "../../typings";

@Component({
    name : 'form-col'
})
export default class FormCol extends Vue{

    @Prop()
    control !: LayoutCol

    @Prop()
    span !: number

    get colSpan(){
        if(typeof this.span === 'number'){
            return this.span;
        }
        return this.control.span;
    }

}

</script>

<style lang="less" scoped>

.form-col{
    display: block;
    box-sizing: border-box;
    width: 100%;
}

</style>

