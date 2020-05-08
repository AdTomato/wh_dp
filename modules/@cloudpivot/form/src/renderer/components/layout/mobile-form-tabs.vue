
<template>
  <div>
    <div class="tab-heard">
      <div 
        class="tab-heard-wrap clearfix"
        :style="{width: `${width}px`}"
      >
        <div
          class="tab-heard-item"
          v-for="(t) in tabsTitle"
          :key="t.code"
          :ref="`heardItem${t.code}`"
          :id="`heardItem${t.code}`"
          :class="{'active': t.active}"
          @click="tabClick(t.code)"
        >
          {{ t.name }}
        </div>
      </div>
      <div class="border-bottom"></div>
    </div>
    <h3-swiper
      :showDots="false" 
      v-model="activeTab" 
      class="form-rendere-swiper"
    >
      <slot></slot>
    </h3-swiper>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { RendererFormControl,StyleControlOptions } from "../../typings";

import { BaseControl } from "../../controls";

import { H3Swiper, H3SwiperItem } from "h3-mobile-vue";;

@Component({
    name : 'form-tabs',
    components: {
    H3Swiper
  }
})
export default class FormTabs extends Vue {
  @Prop() 
  itemList !: any

  tabsTitle:any = [];
  width = 0
  created() {
    this.tabsTitle = this.itemList.map(res => {
      let active = false;
      if (res.code === this.activeTab) {
        active = true;
      }
      return {
        active,
        ...res
      }
    });
  }

  mounted() {
    this.width = 0;
    this.tabsTitle.forEach( res => {
      this.width += this.$refs[`heardItem${res.code}`][0].offsetWidth as number;
    })
  }

  tabClick(code:any) {
    this.activeTab = code;
    this.tabsTitle.forEach((res) => {
      res.active = false;
      if (res.code === code) {
        res.active = true;
      }
    });

    // const ele: HTMLElement  = this.$el.querySelector('.h3-swiper') as HTMLElement;
    // ele.scrollTop = 0;
    
  }

  activeTab = 0;

  @Watch('activeTab')
  onActiveTabChange(val:number) {
    this.tabClick(val);
  }
}


</script>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.tab-heard {
   overflow-y: hidden;
   overflow-x: auto;
   margin: 0 15px;
  .tab-heard-wrap {
    // margin: 0 15px;
    // padding-right: 0;
    min-width: 100%;
   
    .tab-heard-item{
      float: left;
      padding: 0.36rem 0.4rem;
      color:rgba(102,102,102,1);
      font-size: 0.4rem;
    }
    .tab-heard-item.active{
      font-weight:500;
      color:rgba(0,0,0,0.85);
      border-bottom: 0.053rem solid @primary-color;
    }

  }
  .border-bottom{
    height: 0;
    position: relative;
    .hairline("bottom", #eee);
  }
}
.form-rendere-swiper{
  /deep/.h3-swiper{
    height: calc(100vh - 2.47rem) !important;
    overflow-x: hidden;
    overflow-y: auto;
  }
}
</style>
<style lang="less">
.form-rendere-swiper{
  .h3-swiper-item{
    height: auto!important;
    min-height: calc(100vh - 96px);
    // position: relative!important;
    float: left;
  }
}
</style>