
<template>

    <a-dropdown :trigger="['click']">

        <a-menu slot="overlay" @click="onSelect">

            <a-menu-item v-for="s in styles" :key="s">
                <div class="line" :style="`border-style:${s}`">{{ getText(s) }}</div>
            </a-menu-item>
            
        </a-menu>

        <a-button class="dropdown-botton" size="small">
            
            <span class="icon-left">
                <i class="icon aufont icon-base-align-vertical-cente"></i>
            </span>

            <span class="icon-right">
                <i class="anticon anticon-down"></i>
            </span>
        </a-button>

    </a-dropdown>

</template>


<script lang="ts">

import { Component, Vue, Prop, Model } from 'vue-property-decorator';


const styles = ['none','solid','dashed'];


@Component({
    name: 'line-style-dropdown',
    components:{
    }
})
export default class LineStyleDropdown extends Vue{

    @Model('change',{
        default : 'solid'
    })
    value !: string

    @Prop({
        default : () => styles.slice()
    })
    styles !: string[]

    getText(s : string){
        if(s === 'none'){
            return '无';
        }
        return '';
    }

    onSelect(evt:any){
        this.$emit('change',evt.key);
    }

}

</script>


<style lang="less" scoped>

/deep/.ant-dropdown-menu{
    max-height: 250px;
    overflow: auto;
}

/deep/.ant-dropdown-menu-item{
    padding-top:0;
    padding-bottom:0;
}

.line{
    width: 100%;
    height: 1px;
    // background: @text-color-secondary;
    display: inline-block;
    border-width: 1px;
    border-color: @text-color-secondary;
}

</style>