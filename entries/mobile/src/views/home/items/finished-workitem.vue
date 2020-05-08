<template>
  <div @click="goForm">
    <base-item
      class="work-item"
      :title="workitem.instanceName"
      :summary="workitem.activityName"
      :time="workitem.finishTime"
      :avatar="workitem.imgUrl"
      :username="workitem.originatorName"
      :avatarPlacehold="true"
    >
      <span
        class="item-status"
        slot="badge"
        :class="status.classname"
      >
        {{ status.name }}
      </span>
      <span slot="time">审批时间:&nbsp;&nbsp;</span>
    </base-item>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BaseItem from './base-item.vue';
import Home from '@/views/home/index.vue';

@Component({
  name: 'finishedWorkItem',
  components: {
    BaseItem
  }
})
export default class finishedWorkItem extends Vue {
  @Prop() workitem!: Index.FinishWorkitem;

  status: object = {
    name: '',
    classname: ''
  };

  classname: string = '';

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

  beforeMount() {
    const randomIdx: number = this.workitem.approval;
    switch (randomIdx) {
      case 1: // 同意
        this.status = {
          name: '同意',
          classname: 'agree'
        };
        break;
      case 2: // 驳回
        this.status = {
          name: '驳回',
          classname: 'reject'
        };
        break;
      case 3: // 转办
        this.status = {
          name: '转办',
          classname: 'forward'
        };
        break;
      case 4: // 取消
        this.status = {
          name: '取消',
          classname: 'cancelled'
        };
        break;
      default:
        this.status = {
          name: '未处理'
        };
        break;
    }
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/mixins.less';
@status-radius: 8px;
@status-margin-left: 30px;
@status-agree: #32B683;
@status-reject: #F4454E;
@status-forward: #2970FF;
@status-cancelled: rgba(0,0,0,0.45);

.work-item {
  /deep/.item-content-summary {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .item-status {
    .px2rem(margin-left, @status-margin-left);
    .px2rem(padding-left, 16px);
    .px2rem(padding-right, 16px);
    .px2rem(padding-top, 4px);
    .px2rem(padding-bottom, 4px);
    text-align: center;
    .px2rem(font-size, @font-size-xxxs);
    line-height: 1;
    border-style: solid;
    .px2rem(border-width, 2px);
    .px2rem(border-radius, @status-radius);
    border-color: currentColor;
    box-sizing: border-box;
    white-space: nowrap;
  }
  .agree{
      color: @status-agree;
    }
  .reject{
      color: @status-reject;
    }
  .forward{
      color: @status-forward;
    }
  .cancelled{
      color: @status-cancelled;
    }
}
</style>
