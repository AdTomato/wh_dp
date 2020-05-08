
<template>
    <span>
        <a-button-group size="small">
            <a-button :class="{ active: left }" @click="onClick('horizontal','left')">
                <i class="icon aufont icon-base-left-alignment"></i>
            </a-button>
            <a-button :class="{ active: center }" @click="onClick('horizontal','center')">
                <i class="icon aufont icon-base-middle-alignment"></i>
            </a-button>
            <a-button :class="{ active: right }" @click="onClick('horizontal','right')">
                <i class="icon aufont icon-base-right-alignment"></i>
            </a-button>
        </a-button-group>
        
        <a-button-group size="small">
            <a-button :class="{ active: top }" @click="onClick('vertical','top')">
                <i class="icon aufont icon-base-align-top"></i>
            </a-button>
            <a-button :class="{ active: middle }" @click="onClick('vertical','middle')">
                <i class="icon aufont icon-base-align-vertical-cente"></i>
            </a-button>
            <a-button :class="{ active: bottom }" @click="onClick('vertical','bottom')">
                <i class="icon aufont icon-base-align-Bottom"></i>
            </a-button>
        </a-button-group>
    </span>
</template>


<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";

@Component({
  name: "text-align-group",
  components: {}
})
export default class TextAlignGroup extends Vue {

    @Prop({
        default : ''
    })
    horizontal !: string
    
    @Prop({
        default : ''
    })
    vertical !: string


    get left(){
        return this.horizontal === 'left';
    }
    
    get center(){
        return this.horizontal === 'center';
    }
    
    get right(){
        return this.horizontal === 'right';
    }

    
    get top(){
        return this.vertical === 'top';
    }

    get middle(){
        return this.vertical === 'middle';
    }

    get bottom(){
        return this.vertical === 'bottom';
    }

    onClick(key:string,value:string){
        this.$emit('change', {
        key,
        value 
        });
    }

}
</script>


<style lang="less" scoped>
.icon {
  font-size: @font-size-12;
}

.ant-btn-group:not(:last-child){
    margin-right: @base10-padding-sm;
}

.ant-btn:active, .ant-btn.active {
  color: @primary-color;
  background-color: #fff;
  border-color: @primary-color;
}
</style>