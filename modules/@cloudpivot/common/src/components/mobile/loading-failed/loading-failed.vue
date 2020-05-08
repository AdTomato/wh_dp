<template>
  <div class="failed">
    <div class="failed-wrap">
      <img src="./images/loaging-failed.png">
      <p class="failed-wrap-tips">
        加载失败
      </p>
      <!-- <h3-button type="primary">发送邀填链接</h3-button> -->
      <a @click="reload">重新加载</a>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';

@Component({
  name: 'failed'
})
export default class LoadingFailed extends Vue {
  reload() {
    this.$emit('reload');
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

@img-margin-top: 267px;
@tips-margin-top: 15px;
@img-width: 320px;
@img-height: 218px;
  .failed{
    overflow: hidden;
    &-wrap {
      .px2rem(margin-top,@img-margin-top);
      img{
        .px2rem(width,@img-width);
        .px2rem(height,@img-height);
      }
      &-tips {
        color: @text-color-describe;
        text-align: center;
        .px2rem(font-size,@horizontal-padding-lg);
        .px2rem(margin-top,@tips-margin-top);
      }
    }
  }
</style>
