<template>
  <div class="card-item" @click="$emit('click')">
    <slot name="left" v-if="hasleft"></slot>
    <section class="item-content">
      <h3 class="item-content-title">{{ title }}</h3>
      <p class="item-content-summary">
        <span>{{ summary }}</span>
        <slot name="badge"/>
        <slot name="activitie"/>
      </p>
      <time class="item-content-time">
        <slot name="time"/>
        {{ showTime }}
      </time>
      <div class="item-content-user clearfix" :class="{ 'place': (avatar || username) }">
        <img
          v-if="avatar || avatarPlacehold"
          :src="avatar || defaultAvatar"
          class="content-user-avatar"
        >
        <span class="content-user-name">{{ username }}</span>
      </div>
    </section>
    <slot name="right"></slot>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'CardItem'
})
export default class CardItem extends Vue {
  @Prop() title!: string;

  @Prop() summary!: string;

  @Prop() time!: string;

  @Prop() avatar!: any;

  @Prop() username!: string;

  @Prop() hasleft!: boolean;

  // 是否为头像占位，当头像空白时
  @Prop() avatarPlacehold?: boolean;

  showTime: string = '';

  defaultAvatar: any = require('@/assets/images/avatar.png');

  created() {
    if (this.time) {
      const _time = this.time;
      this.showTime = _time.substr(0, 16);
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@/styles/mixins.less";

@user-img : 56px;

.card-item {
  display: flex;
  .px2rem(margin, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  background: @white-background;
  .item-content {
    flex: 1;
    text-align: left;
    overflow: hidden;
    &-title {
      word-break: break-all;
      .px2rem(margin-bottom, @horizontal-padding-sm);
      .px2rem(font-size, @font-size-md);
      .px2rem(line-height, @line-height-base);
      .lineclamp(1);
      font-weight: 400;
      color: rgba(0, 0, 0, 0.85);
    }
    &-summary {
      .px2rem(margin-bottom, @horizontal-padding-sm);
      .px2rem(font-size, @font-size-sm);
    }
    &-time {
      display: block;
      //.px2rem(margin-bottom, @horizontal-padding-md);
      .px2rem(font-size, @font-size-xxs);
      color: @text-color-describe;
    }
    &-user {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      &.place {
        .px2rem(margin-top, 20px);
      }
    }
  }
  .content-user-avatar {
    .px2rem(width, @user-img);
    .px2rem(height, @user-img);
    border-radius: 50%;
    object-fit: cover;
  }
  .content-user-name {
    display: inline-block;
    .px2rem(margin-left, @horizontal-padding-md);
  }
}
</style>
