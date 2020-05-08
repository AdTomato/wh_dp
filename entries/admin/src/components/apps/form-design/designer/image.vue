
<template> 
  <div>
    <i class="icon aufontAll h-icon-all-upload-o"></i>{{ text }}
  </div>
</template>

<script lang="ts">
import { Vue, Prop, Component } from "vue-property-decorator";

@Component({
    name: 'h-image'
})
export default class HImage extends Vue {
    
    @Prop({
        default: ''
    })
    text !: string
 
}
</script>

<style lang="less" scoped>

div{
    display: inline-block;
    font-weight: 400;
    text-align: center;
    border: 1px solid @border-color;
    color: @light-color-2;
    padding: 0 15px;
    border-radius: @border-radius-base;
    height:32px;
    line-height:30px;
    background:#fff;

    i{
        font-size: @font-size-base;
        margin-right: @base4-padding-xs;
    }
}

</style>