<template>
    
  <div
    @mouseover="onMouseover"
    @mouseleave="onMouseleave"
    @click.stop=""
  >
      
    <a-radio
      v-if="radio"
      v-show="!readonly && (hover || value)" 
      @change="onCheckboxChange" 
      :checked="value"
    ></a-radio>

    <a-checkbox 
      v-else
      v-show="!readonly && (hover || value)" 
      @change="onCheckboxChange" 
      :checked="value"
    ></a-checkbox>
        
    <span v-show="readonly || (!value && !hover)">
      <slot></slot>
    </span>

  </div>
</template>




<script lang='ts'>

import { Vue, Prop, Component, Watch, Model } from "vue-property-decorator";

import {
  Checkbox,Radio
} from "h3-antd-vue";

@Component({
  name: "checkbox-text",
  components: {
    ACheckbox: Checkbox,
    ARadio: Radio
  }
})
export default class CheckboxText extends Vue {

    @Model('change')
    value !: boolean

    @Prop({
        default:false
    })
    readonly !: boolean

    @Prop({
        default:false
    })
    radio !: boolean

    hover = false

    onMouseover(){
        this.hover = true;
    }

    onMouseleave(){
        this.hover = false;
    }

    onCheckboxChange(val:boolean){
        this.$emit('change',val);
    }
}

</script>


<style lang="less" scoped>
label{
    margin:0;
}
</style>