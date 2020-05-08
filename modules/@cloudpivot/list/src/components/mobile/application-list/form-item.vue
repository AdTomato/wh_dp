<template>
  <div @click="goForm" class="work-item">
    <div class="card-item" @click="$emit('click')">
      <section class="item-content">
        <h3 class="item-content-title">{{ formData.name }}</h3>
        <div
          v-if="columns.length"
          class="item-content-summary item-main"
          :class="{'has-status': showStatus}"
        >
          <p v-for="(col,idx) in columns" :key="idx">{{ col.name }}：{{ col.value }}</p>
        </div>
      </section>
      <div class="item-status" v-if="showStatus">
        <img
          :class="classname"
          :src="status ? require(`@/assets/images/${status}${ lang === 'zh' ? '' : '-en' }.png`):''"
        />
      </div>
    </div>
    <div
      v-if="showCreater || showTime"
      class="content-user clearfix"
      :class="{ 'place': (avatar || username) }"
    >
      <img
        v-show="showCreater"
        :src="avatar || defaultAvatar"
        class="content-user-avatar"
      />
      <span v-show="showCreater" class="content-user-name">{{ username }}</span>
      <span v-show="showTime" class="content-user-time">{{ formData.data.createdTime }}</span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import common from '@cloudpivot/common';

import { listApi, listParams } from '@cloudpivot/api';

const { getRealValue } = common.utils.BusinessFunctions;

@Component({
  name: 'formItem'
})
export default class formItem extends Vue {
  @Prop() formData!: any;

  @Prop() queryColumns!: any;

  @Prop({
    default: true
  })
  isOpenForm!: Boolean

  defaultAvatar: any = require('./avatar.png');

  status: string = '';

  classname: string = '';

  stayTime: string = '';

  // 展示字段集合，包括其对应的值
  columns: Array<any> = [];

  get lang() {
    return localStorage.getItem('locale') || 'zh';
  }

  get showStatus() {
    return this.queryColumns.some((col: listParams.QueryColumns) => col.propertyCode === 'sequenceStatus');
  }

  get showTime() {
    return this.queryColumns.some((col: listParams.QueryColumns) => col.propertyCode === 'createdTime');
  }

  get showCreater() {
    return this.queryColumns.some((col: listParams.QueryColumns) => col.propertyCode === 'creater');
  }

  get avatar() {
    return this.formData ? this.formData.data.imgUrl : '';
  }

  get username() {
    return this.formData ? this.formData.data.originator : '';
  }

  /**
   * 跳转到表单
   */
  goForm() {
    if (!this.isOpenForm) {
      return;
    }
    const params = {
      bizObjectId: this.formData.id,
      schemaCode: this.formData.schemaCode
    }
    listApi.getFormUrl(params).then((res: any) => {
      if (typeof res === 'string') {
        res += `&return=${this.$route.fullPath}`;
        this.$router.push({
          path: res
        });
      } else if (typeof res === 'object' && res.errmsg) {
        console.error(res.errmsg);
      }
    });
  }

  /**
   * 设置卡片展示字段内容
   */
  generateColumns() {
    this.columns = this.queryColumns.map((col: listParams.QueryColumns) => {
      if (['name', 'createdTime', 'creater', 'originator', 'sequenceStatus'].indexOf(col.propertyCode) > -1) {
        return null;
      }
      const {
        displayFormat,
        name,
        name_i18n,
        propertyCode,
        propertyType,
        sortKey
      } = col;
      return {
        displayFormat,
        name,
        name_i18n,
        propertyCode,
        propertyType,
        sortKey,
        value: getRealValue(col, this.formData.data[propertyCode])
      }
    }).filter(Boolean).filter((item: any) => item.value || item.value === 0);
  }

  /**
   * 设置单据状态对应的图标
   */
  generateStatusIcon() {
    let randomIdx: number = 3;
    const sequenceStatus: any = this.formData ? this.formData.sequenceStatus : '';
    switch (sequenceStatus) {
      // 本地缓存
      case 'CACHE':
        randomIdx = 4;
        break;
      // 草稿
      case 'DRAFT':
        randomIdx = 0;
        break;
      // 进行中
      case 'PROCESSING':
      case 'null':
      case '':
        // TODO 进行中状态需要调整
        randomIdx = 1;
        break;
      // 完成
      case 'COMPLETED':
        randomIdx = 2;
        break;
      // 作废
      default:
        randomIdx = 3;
        break;
    }
    this.status = [
      'draft',
      'pending',
      'complete',
      'closure',
      'cache'
    ][randomIdx];
    this.classname = 'status';
  }

  beforeMount() {
    this.generateStatusIcon();
    this.generateColumns();
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
@timeout-width: 120px;
@timeout-height: 96px;
@warning-size: 30px;
@user-img : 56px;

.work-item {
  .px2rem(margin, @horizontal-padding-md);
  .px2rem(padding, @horizontal-padding-lg);
  .px2rem(border-radius, @border-radius-lg);
  background: @white-background;

  .card-item {
    display: flex;
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
    }
  }

  .content-user {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    &.place {
      .px2rem(margin-top, 20px);
    }
    &-avatar {
      .px2rem(width, @user-img);
      .px2rem(height, @user-img);
      border-radius: 50%;
      object-fit: cover;
    }
    &-name {
      display: inline-block;
      .px2rem(margin-left, @horizontal-padding-md);
    }
    &-time {
      text-align: right;
      flex: 1;
    }
  }

  .item-main {
    &.has-status {
      .px2rem(min-height, 20px);
    }
  }
  .item-status {
    position: relative;
    span {
      position: absolute;
      width: 200%;
      .px2rem(bottom, 14px);
      right: 0;
      text-align: right;
      color: #999999;
    }
    .px2rem(margin-left, @horizontal-padding-sm);
    .px2rem(width, @timeout-width);
    .status {
      .px2rem(width, @timeout-width);
      .px2rem(height, @timeout-height);
      .px2rem(padding-bottom, 40px);
    }
    .warning {
      .px2rem(height, @warning-size);
      .px2rem(width, @warning-size);
    }
  }
}
</style>
