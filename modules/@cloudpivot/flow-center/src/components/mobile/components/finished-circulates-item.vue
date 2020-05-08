<template>
  <base-item
    @click="goForm"
    class="work-item"
    :title="workitem.instanceName"
    :summary="summary"
    :time="workitem.finishTime"
    :avatar="workitem.imgUrl"
    :username="workitem.originatorName"
    :avatarPlacehold="true"
  >

    <span slot="time">{{ $t('cloudpivot.flowCenter.mobile.readTime') }}:&nbsp;&nbsp;</span>
  </base-item>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseItem from './base-item.vue';


import { mobileHome }  from '@cloudpivot/api';

@Component({
  name: 'WorkItem',
  components: {
    BaseItem
  }
})
export default class WorkItem extends Vue {
  @Prop() workitem!: mobileHome.Workitem;

  get summary(){
    if(this.$i18n) {
      const locale:string = this.$i18n.locale as string;
      return this.$i18n.locale === 'zh' ?  this.workitem.activityName : this.workitem.sourceName_i18n[locale];
    }
    return '';
  }

  goForm() {
    this.$emit('openForm');
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
@timeout-width: 120px;
@timeout-height: 96px;
@warning-size: 30px;
.work-item {
  .item-status {
    .px2rem(margin-left, @horizontal-padding-sm);
    .px2rem(width, @timeout-width);
    .status {
      .px2rem(width, @timeout-width);
      .px2rem(height, @timeout-height);
    }
    .warning {
      .px2rem(height, @warning-size);
      .px2rem(width, @warning-size);
    }
  }
}
</style>
