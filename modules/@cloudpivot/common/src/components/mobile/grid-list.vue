<template>
  <ul class="grid-list">
    <li
      v-for="(block,index) in list"
      :key="index"
      :class="['grid-list__item',`grid-list__item--${grid}`]"
      @click="$emit('onItem',block)"
    >
      <span :class="['grid-list__icon',`grid-list__icon--${randomColor(block)}`]">
        <i :class="['icon','aufontAll', block.icon]"/>
      </span>
      <span
        class="grid-list__name"
        v-if="searchWord"
        v-html="splitKeyword(block)"
      ></span>
      <span class="grid-list__name" v-else>{{ getName(block) }}</span>
    </li>
  </ul>
</template>
<script lang="ts">
// 每行固定4个，可多行栅格列表
import { Component, Vue, Prop } from 'vue-property-decorator';
import { utils } from '@cloudpivot/common';

@Component({
  name: 'GridList'
})
export default class GridList extends Vue {
  @Prop() list!: Array<any>

  @Prop() searchWord?: string

  @Prop({ default: 4 }) grid?: number

  @Prop() colorKey?: string

  getName(block:any){
    return utils.BusinessFunctions.getLangName(block);
  }

  /**
   * 高亮匹配文字
   */
  splitKeyword(block: any) {
    // 提取当前应用的国际化语言对应显示名
    let str:string = utils.BusinessFunctions.getLangName(block);
    if (this.searchWord && str) {
      const reg:RegExp = new RegExp(`${this.searchWord}`, 'g');
      const arr: any = str.replace(reg, `<span class="highlight">${this.searchWord}</span>`);
      return arr;
    }
    return str;
  }

  /**
   * 随机应用图标背景色
   */
  randomColor(block: any) {
    if (this.colorKey && block[this.colorKey]) {
      const letter: string = block[this.colorKey].replace(/^([a-zA-Z]).+?$/, '$1');
      const index:number = 'abcdefghijklmnopqrstuvwxyz'.indexOf(letter.toLowerCase()) + 1;
      const position:number = index % 4 + 1;
      return `${position}`;
    }
    return 'default';
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.grid-list {
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  min-width: 100%;
  .px2rem(margin-left, -15px);
  .px2rem(margin-right, -15px);
  &__item {
    display: block;
    .px2rem(margin-top, 30px);
    text-align: center;
    &--5 {
      flex-basis: 20%;
    }
    &--4 {
      flex-basis: 25%;
    }
    &--3 {
      flex-basis: 33.33%;
    }
    &--2 {
      flex-basis: 50%;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: auto;
    margin-right: auto;
    .px2rem(width, 96px);
    .px2rem(height, 96px);
    .px2rem(margin-bottom, 16px);
    .px2rem(border-radius, 16px);
    .icon {
      .px2rem(font-size, 48px);
      color: #fff;
    }
    &--default {
      background: linear-gradient( 137deg, rgba(83, 75, 255, 1) 0%, rgba(97, 132, 255, 1) 100% );
    }
    &--1 {
      background-color: @random-color-1;
    }
    &--2 {
      background-color: @random-color-2;
    }
    &--3 {
      background-color: @random-color-3;
    }
    &--4 {
      background-color: @random-color-4;
    }
  }
  &__name {
    display: block;
    margin: 0 auto;
    max-width: 5em;
    .px2rem(font-size, 24px);
    .px2rem(line-height, 33px);
    text-align: center;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0,0,0,0.85);
  }
  /deep/.highlight {
    color: @primary-color;
  }
}
</style>
