
<template>
  <a-popover placement="bottom" trigger="click">
    <template slot="content">
      <div class="box">
        <div class="box__top" :class="{ selected : value.top }" @click="onBorderClick('top')"></div>
        <div class="flex-justify-between">
          <div class="box__left" :class="{ selected : value.left }" @click="onBorderClick('left')"></div>
          <div class="box__right" :class="{ selected : value.right }" @click="onBorderClick('right')"></div>
        </div>
        <div class="box__bottom" :class="{ selected : value.bottom }" @click="onBorderClick('bottom')"></div>

        <!-- <div class="box-border" 
        :class="{ left: value.left, top : value.top, right : value.right, bottom : value.bottom }"></div> -->

        <div class="box-border box-border__top" v-show="value.top"></div>
        <div class="box-border box-border__right" v-show="value.right"></div>
        <div class="box-border box-border__bottom" v-show="value.bottom"></div>
        <div class="box-border box-border__left" v-show="value.left"></div>

      </div>
    </template>

    <a-button class="dropdown-botton" size="small" :disabled="disabled">
      <span class="icon-left">
        <i class="icon aufont icon-base-frame border-set-icon"></i>
      </span>

      <span class="icon-right">
        <i class="anticon anticon-down"></i>
      </span>
    </a-button>
  </a-popover>
</template>


<script lang="ts">
import { Component, Vue, Prop, Model } from "vue-property-decorator";

@Component({
  name: "border-dropdown",
  components: {}
})
export default class BorderDropdown extends Vue {

  @Model("change", {
    default: () => ({})
  })
  value!: any;

  @Prop({
      default : false
  })
  disabled !: boolean

  onBorderClick(key: string) {

    const val = Object.assign({},this.value);
    val[key] = !val[key];
    this.$emit("change", val);

    this.$emit("borderClick", key);
  }
}
</script>


<style lang="less" scoped>
.box {
  width: 79px;
  height: 79px;
  display: flex;
  flex-flow: column;
  justify-content: space-between;
   position: relative;

  &-border{
    position: absolute;
    background-color:@text-color-secondary;

    &__top, &__bottom{
      height:1px;
      width: 100%;
    }
    
    &__left, &__right{
      height: 100%;
      width: 1px;
    }

    &__bottom{
      bottom: 0;
    }

    &__right{
      right:0;
    }

  }

  &__top,
  &__right,
  &__bottom,
  &__left {
    position: relative;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid @border-color;
    
    &:hover {
      cursor: pointer;
    }

    &.selected{
        background: @primary-color;
        border-color: @primary-color;
    }

  }
  &__left,
  &__right {
    width: 11px;
    height: 50px;
  }
  &__top,
  &__bottom {
    height: 11px;
    width: 50px;
    margin: 0 auto;
  }
  &__left {
    left: -5px;
  }
  &__right {
    right: -5px;
  }
  &__top {
    top: -5px;
  }
  &__bottom {
    bottom: -5px;
  }
}
</style>