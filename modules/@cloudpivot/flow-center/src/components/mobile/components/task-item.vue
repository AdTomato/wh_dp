<template>
  <div class="task-item">
    <div class="task-item__title">{{ title }}</div>
    <div class="task-item__activity">{{ $t('cloudpivot.flowCenter.mobile.curActivity') }}：{{ curActivity }}</div>
    <div class="task-item__stay">{{ $t('cloudpivot.flowCenter.mobile.stayTime') }}：{{ stayTime }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
@Component({
  name: 'task-item'
})
export default class TaskItem extends Vue {
  @Prop() title!: string;

  @Prop() curActivity!: string;

  @Prop() stayTime!: string;
}

</script>
<style lang='less' scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.task-item {
  box-sizing: border-box;
  .px2rem(width, 560);
  .px2rem(height, 206);
  .px2rem(padding-top, @horizontal-padding-lg);
  .px2rem(padding-left, @horizontal-padding-lg);
  .px2rem(padding-bottom, @horizontal-padding-lg);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  background: #f7f8fc;
  .px2rem(border-radius, @border-radius-lg);
  div {
    .px2rem(max-width, 434);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &__title {
    .px2rem(line-height, 46);
    .px2rem(font-size, @font-size-md);
    color: rgba(0,0,0,0.85);
  }
  &__activity,
  &__stay {
    .px2rem(margin-top, 10);
    .px2rem(line-height, 40);
    .px2rem(font-size, @font-size-sm);
    color: @text-color-secondary;
  }
}
</style>
