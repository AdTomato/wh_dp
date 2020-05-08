<template>
  <div class="nodata">
    <div class="nodata-img-wrap">
      <!-- <img src="@/assets/images/empty@3x.png"> -->
      <p class="nodata-tips">
        {{ $t('cloudpivot.Common.mobile.noSearchResult') }}
      </p>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

@Component({
  name: 'noData'
})
export default class Nodata extends Vue {

}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

@img-margin-top: 317px;
@tips-margin-top: 15px;
@img-width: 320px;
@img-height: 218px;
  .nodata{
    overflow: hidden;
    .nodata-img-wrap {
      img{
        .px2rem(height,@img-height);
        .px2rem(width,@img-width);
      }
      .px2rem(margin-top,@img-margin-top);
      .nodata-tips {
        color: @text-color-describe;
        text-align: center;
        .px2rem(font-size,@horizontal-padding-lg);
        .px2rem(margin-top,@tips-margin-top);
      }
    }
  }
</style>
