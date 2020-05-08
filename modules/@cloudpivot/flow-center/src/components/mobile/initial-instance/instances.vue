<template>
  <div class="instances">
    <p
      class="instances__title"
      v-if="title"
      @click="collapse"
    >
      {{ title }}
      <i
        v-if="collapsable"
        class="icon aufontAll h-icon-all-up-o"
        :class="!opened && 'closed'"
      />
    </p>
    <transition name="collapse">
      <grid-list
        v-show="opened"
        class="collapse-item"
        colorKey="code"
        :list="list"
        :grid="col"
        @onItem="$emit('onItem',$event)"
      />
    </transition>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import common from '@cloudpivot/common';

@Component({
  name: 'instances',
  components: {
    GridList: common.components.mobile.GridList
  }
})
export default class Instances extends Vue {
  @Prop() title!: string;

  @Prop() collapsable?: boolean;

  @Prop({
    default: 3
  }) col!: number;

  @Prop() list!: Array<any>;

  opened: boolean = true;

  collapse() {
    if (!this.collapsable) {
      return;
    }
    this.opened = !this.opened;
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.instances {
  .px2rem(margin-top, @horizontal-padding-md);
  .px2rem(margin-bottom, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  padding-top: 0;
  text-align: left;
  background: @white-background;
  &__title {
    .px2rem(padding-top, 24px);
    .px2rem(line-height, 40px);
    color: rgba(0,0,0,0.85);
    font-weight: 500;
    i {
      float: right;
      transition: all .3s;
      &.closed {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
