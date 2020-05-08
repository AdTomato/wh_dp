<template>
  <h3-swipeout>
    <h3-swipeout-item
      class="circulate-box"
      v-for="(workitem,index) in list"
      :key="index"
      :threshold=".5"
      :disabled="showCheckbox"
    >
      <base-item
        slot="content"
        class="work-item"
        :hasleft="showCheckbox"
        :title="workitem.instanceName"
        :summary="workitem.activityName"
        :time="workitem.startTime"
        :avatar="workitem.imgUrl"
        :username="workitem.originatorName"
        :avatarPlacehold="true"
        @click="goForm(workitem)"
      >
        <span slot="time">接收时间:&nbsp;&nbsp;</span>
        <div slot="left" class="work-item-checkbox">
          <checkbox-item
            :defaultChecked="checkedIds.includes(workitem.id) || !!checkAll"
            @change="checkItem(workitem.id)"
          />
        </div>
      </base-item>
      <div slot="right-menu" v-if="!showCheckbox">
        <h3-swipeout-button
          class="work-item-button"
          :backgroundColor="buttonColor"
          @click.native="onCirculate(workitem)"
        >标为已阅</h3-swipeout-button>
      </div>
    </h3-swipeout-item>
  </h3-swipeout>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import { H3Swipeout, H3SwipeoutItem, H3SwipeoutButton } from 'h3-mobile-vue';
import checkboxItem from '@/components/global/checkbox.vue';
import Home from '@/views/home/index.vue';
import BaseItem from './base-item.vue';

const circulateModule = namespace('circulate');

@Component({
  name: 'WorkItem',
  components: {
    H3Swipeout,
    H3SwipeoutItem,
    H3SwipeoutButton,
    checkboxItem,
    BaseItem,
  }
})
export default class WorkItem extends Vue {
  @circulateModule.State('checkedIds') checkedIds!: string[];

  @circulateModule.State('checkAll') checkAll!: boolean;

  @circulateModule.State('showCheckbox') showCheckbox!: boolean;

  @circulateModule.Action('checkItem') checkItem: any;

  // @Prop() workitem!: Index.Workitem;
  @Prop() circulates!: Array<Index.Workitem>;


  buttonColor: string = '#2970FF';

  get list() {
    return this.circulates;
  }

  goForm(workitem: Index.Workitem) {
    this.$router.push({
      name: 'form-detail',
      query: {
        workitemId: workitem.id,
        workflowInstanceId: workitem.instanceId,
        return: this.$route.fullPath
      }
    });
  }

  onCirculate(circulate: Index.Workitem) {
    this.$emit('read', circulate);
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/mixins.less";
@timeout-width: 120px;
@timeout-height: 96px;
@warning-size: 30px;
.circulate-box {
  .px2rem(border-radius, @border-radius-lg);
  .px2rem(margin, @horizontal-padding-md);
  overflow: hidden;
  /deep/.h3-swipeout-content {
    background: none;
  }
  .work-item {
    align-items: center;
    margin: 0;
    border-radius: 0;
    height: 100%;
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
    &-button {
      .px2rem(border-radius-top-right, @border-radius-lg);
      .px2rem(border-radius-bottom-right, @border-radius-lg);
    }
  }
}
/deep/.work-item-checkbox {
  .px2rem(width, 70px);
  height: 100%;
  text-align: left;
}
</style>
