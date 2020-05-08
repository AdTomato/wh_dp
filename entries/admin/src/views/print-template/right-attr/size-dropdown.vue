
<template>

    <a-dropdown :trigger="['click']">

        <a-menu slot="overlay" @click="onSelect"
            style="max-height: 250px;overflow: auto;" 
        >
            <a-menu-item v-for="size in sizes" :key="size">
                {{ size }}
            </a-menu-item>
        </a-menu>

        <a-button class="dropdown-botton" size="small">
            
            <span class="icon-left">
                {{ value }}
            </span>

            <span class="icon-right">
                <i class="anticon anticon-down"></i>
            </span>
        </a-button>

    </a-dropdown>

</template>


<script lang="ts">

import { Component, Vue, Prop, Model } from 'vue-property-decorator';


const sizes = new Array(48).fill(0).map((_,i) => 12 + i);


@Component({
    name: 'size-dropdown',
    components:{
    }
})
export default class SizeDropdown extends Vue{

    @Model('change',{
        default : 1
    })
    value !: number

    @Prop({
        default: () => sizes.slice()
    })
    sizes !: number[]

    getText(size : number){
        if(size === 0){
            return '无边框';
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

</style>