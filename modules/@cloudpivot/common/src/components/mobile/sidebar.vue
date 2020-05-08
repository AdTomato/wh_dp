<template>
  <div :class="['sidebar', staticStyle && 'static']">
    <h3 class="sidebar__title item-cell" v-if="title">
      {{ title }}
      <span>{{ tip }}</span>
    </h3>
    <ul class="sidebar__list">
      <li
        :class="['item-cell','sidebar__item', {'sidebar__item--active': index === current} ]"
        v-for="(app,index) in list"
        :key="index"
        @click="onItem(app,index)"
      >
        <span>{{ app[displayName] }}</span>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
// 侧滑呼出列表
import { Component, Vue, Prop } from 'vue-property-decorator';

import common from '@cloudpivot/common';

@Component({
  name: 'AppSideBar'
})
export default class AppSideBar extends Vue {
  @Prop() list!: Array<any>;

  @Prop() title!: string;

  @Prop() tip!: string;

  @Prop({ default: 0 }) current?: number;

  @Prop({ default: 'name' }) displayName?: string;

  // 是否为静态布局
  @Prop({ default: false }) staticStyle?: boolean;

  onItem(app: any, index: number) {
    if (index === this.current) {
      return;
    }
    this.$emit('toggle', app);
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  color: #333;
  &__title {
    flex: none;
    .px2rem(font-size, 32px);
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    span {
      display: inline-block;
      .px2rem(font-size, 24px);
      font-weight: 400;
      color: rgba(0, 0, 0, 0.45);
    }
  }
  &__list {
    flex: 1;
    overflow-y: auto;
    .noscrollbar();
  }
  &__item--active {
    background-color: #F7F8FC;
  }
  .item-cell {
    text-align: left;
    .px2rem(height, 88px);
    .px2rem(line-height, 88px);
    .px2rem(padding-left, 30px);
    .px2rem(font-size, 28px)!important;
  }
}
.static {
  flex: none;
  height: 100%;
  overflow-y: auto;
  background-color: #fff;
  .sidebar__item {
    height: auto;
    .px2rem(padding-top, 25px);
    .px2rem(padding-bottom, 25px);
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    span {
      width: 4em;
      word-break: break-all;
      .px2rem(line-height, 40px);
      .lineclamp(2);
    }
  }
  .sidebar__item--active {
    background: @main-background;
    position: relative;
    font-weight: 600;
    &::after {
      content: "";
      display: block;
      .px2rem(width, 6px);
      .px2rem(height, 50px);
      position: absolute;
      z-index: 8;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      background-color: @primary-color;
    }
  }
}
</style>
