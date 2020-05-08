<template>
  <div class="empty">
    <div class="empty-img-wrap">
      <img src="./empty@3x.png" class="empty-img">
      <p class="empty-tips">
        {{ tip || $t('cloudpivot.Common.mobile.empty') }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

@Component({
  name: 'empty'
})
export default class Empty extends Vue {
  @Prop() tip?: string;
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

@img-margin-top: 317px;
@tips-margin-top: 15px;

  .empty{
    overflow: hidden;
    .empty-img-wrap {
      .px2rem(margin-top,@img-margin-top);
      .empty-img{
        .px2rem(width, 320px);
        .px2rem(height, 218px);
        // width: 160px;
        // height: 109px;
      }
      .empty-tips {
        color: @text-color-describe;
        text-align: center;
        .px2rem(font-size,@horizontal-padding-lg);
        .px2rem(margin-top,@tips-margin-top);
      }
    }
  }
</style>
