<template>
  <div class="button">
    <div>
      <h3-button @click="$emit('reset')">
        {{ $t('cloudpivot.Common.mobile.reset') }}
      </h3-button>
    </div>
    <div>
      <h3-button
        type="primary"
        @click="$emit('submit')"
      >
        {{ $t('cloudpivot.Common.mobile.OK') }}
      </h3-button>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue
} from 'vue-property-decorator';
import { H3Button } from 'h3-mobile-vue';
@Component({
  name: 'Button',
  components: {
    H3Button
  }
})

export default class BottomButton extends Vue {}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.button{
  display: flex;
  width: 100%;
  z-index: 100;
  /*position: fixed;*/
  /*bottom: 0;*/
  .px2rem(margin-bottom, 16px);
  &>div{
    flex: 1;
    /deep/.h3-button{
      .px2rem(margin-left, 37px);
      .px2rem(margin-right, 37px);
      .px2rem(height, 80px);
      .px2rem(line-height, 80px);
      .px2rem(border-radius, 50px);
      // border-radius: 0;
      &.h3-button-primary {
        background-color: @primary-color;
      }
      &.h3-button-primary, &.h3-button-primary::before {
        border: none;
      }
      &:not(.h3-button-primary){
        overflow: visible;
      }
      &:not(.h3-button-primary)::before {
        border-radius: 50px !important;
        // border-radius: 0;
      }
    }
  }
}
</style>
