<template>
  <div class="toptip">
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'toptip'
})
export default class Toptip extends Vue {
  @Prop() text!: string;
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.toptip {
  width: 100%;
  .px2rem(padding, 22px);
  .px2rem(font-size, 28px);
  text-align: center;
  font-weight: 400;
  color: @primary-color;
  font-family:PingFangSC-Regular;
  background-color: #F0F7FF;
  box-sizing: border-box;
  word-break: break-all;
}
</style>
