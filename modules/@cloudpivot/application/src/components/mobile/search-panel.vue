<template>
  <div class="search-panel">
    <div class="search-panel__wrap" v-show="showResult">
      <p class="search-panel__tip search-panel__title">
        {{ $t('cloudpivot.application.mobile.QueryTips1') }}
        <span>{{ total }}</span>
        {{ $t('cloudpivot.application.mobile.QueryTips2') }}
      </p>
      <div class="search-panel__list">
        <grid-list 
          v-if="list.length" 
          :list="list" 
          :searchWord="wd" 
          @onItem="goFormList"
        />
        <no-data v-else/>
      </div>
    </div>
    <div class="search-panel__wrap search-panel__history" v-show="!showResult">
      <p class="search-panel__title">{{ $t('cloudpivot.application.mobile.HistorySearch') }}</p>
      <ul>
        <li 
          v-for="(key,i) in history" 
          :key="i" 
          @click="selectWord(key)"
        >{{ key }}</li>
      </ul>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Mixins
} from 'vue-property-decorator';
import OpenFormMixin from './open-form';

import common from '@cloudpivot/common';

import { listApi, initialInstanceParams } from '@cloudpivot/api';

@Component({
  name: 'SearchPanel',
  components: {
    GridList: common.components.mobile.GridList,
    NoData: common.components.mobile.NoSearchData
  }
})
export default class SearchPanel extends Mixins(OpenFormMixin) {
  @Prop({ default: '' }) value!: string;

  list: Array<initialInstanceParams.InstanceItem> = [];

  history: Array<string> = [];

  total: number = 0;

  wd: string = '';

  /* 是否展示搜索结果列表 */
  showResult: boolean = false;

  @Watch('value')
  onKeywordChange(val: string) {
    if (val) {
      this.search(val);
    } else {
      this.wd = '';
      this.showResult = false;
    }
  }

  /**
   * 选中搜索词
   */
  selectWord(wd: string) {
    // this.search(wd);
    this.$emit('input', wd);
  }

  /**
   * 搜索应用
   */
  search(wd: string) {
    // console.log('search1', wd);
    if (!wd) {
      this.$h3.toast.show({
        text: `${this.$t('cloudpivot.application.mobile.PleaseInputKeys')}`
      });
      return;
    }
    if (wd === this.wd) {
      // 避免重复搜索
      return;
    }
    this.wd = wd;
    this.list = [];

    listApi.searchBizModels({ searchKey: wd, appCode: '' }).then((res: any) => {
      if (Array.isArray(res.data)) {
        this.total = res.data.length;
        this.list = res.data;
      } else {
        this.total = 0;
      }
      this.showResult = true;
      this.recordKeyword(wd);
    });
  }

  /**
   * 记录搜索历史
   */
  recordKeyword(key: string) {
    this.history = Array.from(new Set([key, ...this.history]));
  }

  /**
   * 取消搜索
   */
  cancel() {
    this.showResult = false;
    this.list = [];
    this.total = 0;
    if (this.history.length) {
      localStorage.setItem('app-search-history', JSON.stringify(this.history));
    }
  }

  mounted() {
    const history = localStorage.getItem('app-search-history');
    if (history) {
      try {
        const list = JSON.parse(history);
        if (Array.isArray(list)) {
          this.history = list;
        }
      } catch (error) {
        this.history = [];
      }
    }
  }

  beforeDestroy() {
    this.cancel();
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.search-panel {
  width: 100%;
  height: 100%;
  background: @main-background;
  overflow: hidden;
  &__wrap {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
  }
  &__title {
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    .px2rem(padding-top, 20px);
    .px2rem(padding-bottom, 20px);
    .px2rem(font-size, 24px);
    text-align: left;
    color: #999;
  }
  &__tip {
    flex: none;
    span {
      color: @primary-color;
    }
  }
  &__list {
    flex: 1;
    width: 100%;
    .px2rem(padding-left, 50px);
    .px2rem(padding-right, 50px);
    .px2rem(padding-bottom, 30px);
    box-sizing: border-box;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__history {
    ul {
      flex: 1;
      width: 100%;
      .px2rem(padding, 30px);
      padding-top: 0;
      text-align: left;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
    }
    li {
      display: inline-block;
      width: auto;
      max-width: 100%;
      .px2rem(padding-left, 20px);
      .px2rem(padding-right, 20px);
      .px2rem(margin-right, 30px);
      .px2rem(margin-bottom, 20px);
      .px2rem(height, 60px);
      .px2rem(line-height, 60px);
      .px2rem(border-radius, 30px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      box-sizing: border-box;
      background-color: #eceff4;
    }
  }
}
</style>
