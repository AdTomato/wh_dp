<template>
  <div class="app-content">
    <!-- 应用内容 -->
    <div class="app-content-list">
      <h3 class="app-content-list-title">
        <span>{{ app.title }}</span>
        <span
          class="count"
          v-if="size"
        >{{ size + ' ' + $t('cloudpivot.flowCenter.pc.flowItems') }}</span>
      </h3>
      <biz-models
        v-for="(child,index) in app.list"
        :key="index"
        :title="child.type === 'Folder' ? `${ app.title }-${getName(child)}` : ''"
        :list="child.children"
        @onItem="goFormList"
      />
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Mixins
} from 'vue-property-decorator';

import common from '@cloudpivot/common';

import OpenFormMixin from './open-form';
import BizModels from './biz-models.vue';

@Component({
  name: 'AppContent',
  components: {
    BizModels
  }
})
export default class AppContent extends Mixins(OpenFormMixin) {
  @Prop() app!: any;

  get size(){
    return this.app.list.reduce((p:any,n:any) => n.children.length + p, 0);
  }

  getName(block:any){
    return common.utils.BusinessFunctions.getLangName(block);
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.app-content {
  .px2rem(padding-left, 20px);
  .px2rem(padding-right, 20px);
  &-list {
    .px2rem(margin-top, @horizontal-padding-md);
    .px2rem(margin-bottom, 30px);
    &-title {
      text-align: left;
      span {
        display: inline-block;
        vertical-align: middle;
        .px2rem(font-size, 32px);
        color: rgba(0,0,0,0.85);
        font-weight: 500;
      }
      &:before {
        content: "";
        display: inline-block;
        vertical-align: middle;
        .px2rem(width, 6px);
        .px2rem(height, 30px);
        .px2rem(margin-right, 16px);
        background-color: @primary-color;
      }
    }
  }
  .count {
    .px2rem(margin-left, 30px);
    .px2rem(font-size, 26px);
    color: #666;
  }
}
</style>
