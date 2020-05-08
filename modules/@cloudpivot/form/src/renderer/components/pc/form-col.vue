
<template>
  <a-col class="ant-col" :span="colSpan">
    <slot></slot>
  </a-col>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { LayoutCol } from "../../typings";

import {
  Col
} from 'h3-antd-vue';

@Component({
    name : 'form-col',
    components:{
        ACol : Col
    }
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


