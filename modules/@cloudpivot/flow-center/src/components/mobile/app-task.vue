<template>
  <div class="app-task">
    <div class="app-task__nav">
      <div class="app-task__nav--left">
        <div :class="{active: curType === taskType.ToDo }" @click="changeType(taskType.ToDo)">{{
          $t('languages.common.todo') }}</div>
        <div :class="{active: curType === taskType.ToRead }" @click="changeType(taskType.ToRead)">{{ $t('languages.common.toread') }}</div>
      </div>
      <div class="app-task__nav--right">
        <div class="badge" v-if="total > 0">{{ total }}</div>
        <div class="link-more" @click="linkMore">
          {{ $t('languages.common.showAll') }}
          <i class="icon aufontAll h-icon-all-right-o"></i>
        </div>
      </div>
    </div>
    <div class="app-task__content">
      <h3-swiper
        mode="drawer"
        :showDots="false"
        :aspectRatio="300/800"
        :height="height"
        v-show="tasks.length > 0"
      >
        <h3-swiper-item
          v-for="(task, index) in tasks"
          :key="index"
          :data-index="index"
          @click.native="openDetail(task)"
        >
          <task-item
            :title="task.instanceName"
            :curActivity="task.activityName"
            :stayTime="formatStayTime(task.stayTime)"
          >
          </task-item>
        </h3-swiper-item>
      </h3-swiper>
      <div class="app-task__content--nodata" v-show="tasks.length === 0">
        <img src="./assets/images/no-data-2.png"/>
        <p>
          {{ noMessageTip }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { H3Swiper, H3SwiperItem } from 'h3-mobile-vue';
import { homeApi, mobileHome }  from '@cloudpivot/api';

import Common from '@cloudpivot/common';

import TaskItem from './components/task-item.vue';

const timeTranslate = Common.utils.timeTranslate;


@Component({
  name: 'AppTask',
  components: {
    H3Swiper,
    H3SwiperItem,
    TaskItem
  }
})
export default class AppTask extends Vue {
  @Prop() appCode!: string;

  taskType = {
    ToDo: 0,
    ToRead: 1
  }

  curType: number = this.taskType.ToDo;

  total: number = 0;

  tasks: Array<any> = [];

  swipeIndex: number = 0;

  get height() {
    return `${206 / 75}rem`;
  }

  get noMessageTip() {
    if (this.curType === this.taskType.ToDo) {
      return this.$t('languages.common.noTodoItems');
    }
    return this.$t('languages.common.noToreadItems');
  }

  indexChange(index:number) {
    this.swipeIndex = index;
  }

  formatStayTime(stayTime: number) {
    return timeTranslate(stayTime);
  }

  changeType(type: number) {
    if (this.curType === type) {
      return;
    }
    this.curType = type;
    if (type === this.taskType.ToDo) {
      this.getTodos();
    } else {
      this.getToReads();
    }
  }

  linkMore() {
    // 查看更多，是否需要app过滤
    this.$router.push('/home/workitems');
  }

  openDetail(task: any) {
    this.$router.push({
      name: 'form-detail',
      query: {
        workitemId: task.id,
        workflowInstanceId: task.instanceId,
        return: this.$route.fullPath
      }
    });
  }

  async getWorkCount() {
    const res = await homeApi.getWorkCount(this.appCode);
    if (res.errcode === 0) {
      this.total = res.data.workItemCount + res.data.circulateItemCount;
    }
  }

  async getTodos() {
    const params: mobileHome.QueryAwaitParams = {
      wd: '',
      page: 0,
      size: 5,
      appCode: this.appCode
    };
    const res = await homeApi.searchWorkitems(params);
    if (res.errcode === 0) {
      this.tasks = res.data.content;
    }
  }

  async getToReads() {
    const params: mobileHome.QueryAwaitParams = {
      wd: '',
      page: 0,
      size: 5,
      appCode: this.appCode
    };
    const res = await homeApi.searchCirculates(params);
    if (res.errcode === 0) {
      this.tasks = res.data.content;
    }
  }

  created() {
    this.getWorkCount();
    this.getTodos();
  }
}

</script>
<style lang='less' scoped>
@import "~@cloudpivot/common/styles/mixins.less";

.app-task {
  .px2rem(padding-top, 20);
  .px2rem(padding-left, 20);
  .px2rem(padding-bottom, 20);
  .px2rem(border-radius, @border-radius-lg);
  background: #fff;
  &__nav {
    .px2rem(padding-left, 20);
    .px2rem(padding-right, 20);
    .px2rem(padding-top, 10);
    .px2rem(padding-bottom, 10);
    .px2rem(margin-bottom, 6);
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--left,
    &--right {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    &--left {
      div {
        position: relative;
        &:first-child {
          .px2rem(margin-right, 46);
        }
        .px2rem(font-size, @font-size-base);
        font-weight: 400;
        color: rgba(0,0,0,0.85);
      }
      .active {
        .px2rem(font-size, @font-size-xl);
        font-weight: 500;
        &::after {
          position: absolute;
          content: '';
          bottom: 0;
          left:0;
          width: 50%;
          transform: translateX(50%);
          border-bottom: 3px solid @primary-color;
          border-radius: 3px;
        }
      }
    }
    &--right {
      .badge {
        .px2rem(min-width, 36);
        .px2rem(height, 36);
        .px2rem(line-height, 36);
        border-radius: 50%;
        color: @text-color-white;
        background: @error-color;
        .px2rem(font-size, @font-size-xxs);
      }
      .link-more {
        .px2rem(font-size, @font-size-sm);
        color: @text-color-secondary;
        i {
          .px2rem(font-size, @font-size-xxs);
          color: @text-color-describe;
        }
      }
    }
  }
  &__content {
    /deep/ .h3-swiper-item {
      padding: 0 !important;
      .px2remImp(padding-left, 20);
      // padding-left: 10px !important;
      &:first-child {
        padding-left: 0 !important;
      }
      &.active {
        padding-left: 0 !important;
      }
    }
    &--nodata {
      img {
        .px2rem(width, 190);
        .px2rem(height, 140);
      }
      p {
        .px2rem(line-height, 40);
        .px2rem(font-size, 30);
        color: #999;
      }
    }
  }
}
</style>
