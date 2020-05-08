<template>
  <base-item
    @click="goForm"
    class="work-item"
    :title="workitem.instanceName"
    :summary="workitem.activityName"
    :time="workitem.finishTime"
    :avatar="workitem.imgUrl"
    :username="workitem.originatorName"
    :avatarPlacehold="true"
  >

    <span slot="time">已阅时间:&nbsp;&nbsp;</span>
  </base-item>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseItem from './base-item.vue';
import Home from '@/views/home/index.vue';

@Component({
  name: 'WorkItem',
  components: {
    BaseItem
  }
})
export default class WorkItem extends Vue {
  @Prop() workitem!: Index.Workitem;

  goForm() {
    this.$router.push({
      name: 'form-detail',
      query: {
        workitemId: this.workitem.id,
        workflowInstanceId: this.workitem.instanceId,
        return: this.$route.fullPath
      }
    });
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/mixins.less';
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
