<template>
  <div class="workitems" :class="{'searching': showTopbar, 'single': appCode}">
    <search-bar
      v-show="showTopbar"
      class="workitems-search"
      @search="search"
      @cancel="cancel"
      :placeHolder="$t('languages.common.search')"
      :cancelText="$t('languages.common.cancel')"
    />
    <h3-scroll
      ref="scroll"
      :loadMore="loadMore"
      :pageSize="pageSize"
      v-show="isEmpty">
      <div>
        <transition name="fade">
          <toptip
            v-show="showTip"
          >{{ $t('cloudpivot.flowCenter.mobile.youHave') }}{{ totalNewItems }}{{ $t('cloudpivot.flowCenter.mobile.todoItems') }}</toptip>
        </transition>
        <work-item
          v-for="(workitem,index) in workitems"
          :key="index"
          :workitem="workitem"
          @openForm="openForm(workitem)"
        />
      </div>
    </h3-scroll>
    <Empty v-show="!isEmpty"></Empty>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch, Prop } from 'vue-property-decorator';

import { homeApi, mobileHome } from '@cloudpivot/api';

import * as H3Form from '@cloudpivot/form';

import WorkItem from './components/workitem.vue';

import Common from '@cloudpivot/common';

import * as utils from '@cloudpivot/common/src/utils/pc/utils';

@Component({
  name: 'workitems',
  components: {
    Toptip: Common.components.mobile.Toptip,
    H3Scroll: H3Form.renderer.components.mobile.H3Scroll,
    WorkItem,
    Empty: Common.components.mobile.Empty,
    SearchBar: Common.components.mobile.Searchbar
  }
})
export default class Workitems extends Vue {
  @Prop({
    default: () => {
      return window.Environment.appCode
    }
  }) appCode !: any;

  workitems: Array<mobileHome.Workitem> = [];

  page: number = 1;

  pageSize: number = 20;

  keyWords: string = '';

  isEmpty: boolean = true;

  // 是否显示顶部搜索框
  showTopbar: boolean = false;

  // 是否已加载过至少一次第一页数据
  firstTimeLoad: boolean = false;

  // 是否有新的条数： 旧的总数减新的总数
  totalNewItems: number = 10;

  // 是否显示顶部提示条
  showTip: boolean = false;

  get totalItem() {
    return this.$store.state.circulate.totalItem;
  }

  loadMore(page: any, done: any) {
    const vm: any = this;
    vm.page = page.num;
    if (page.num === 1) {
      vm.workitems = [];
    }
    const params: mobileHome.QueryAwaitParams = {
      wd: vm.keyWords,
      page: page.num - 1,
      size: vm.pageSize,
      //appCode: this.appCode,
      appCode: window.Environment.appCode
    };
    homeApi.searchWorkitems(params).then((res: any) => {
      if (!res.data || res.errcode) {
        return;
      }

      // 国际化兼容
      res.data.content.forEach((item: any) => {
        item = utils.compatible(item, 'activityName');
      });

      if (done) {
        this.toastTip(res.data.totalElements);
        done(vm.pageSize, res.data.totalElements);
      }
      vm.workitems = vm.workitems.concat(res.data.content);
      const totalElements = {
        workitem: res.data.totalElements
      };
      vm.$store.commit('circulate/setTotalItem', totalElements)
      if (!vm.workitems.length) {
        vm.isEmpty = false;
      }
    }).then(() => {
      if (vm.page === 1 && vm.isEmpty && !vm.showTopbar) {
        if (vm.firstTimeLoad) {
          vm.showTopbar = true;
        } else {
          vm.firstTimeLoad = true;
        }
      }
    });
  }

  toastTip(total: number) {
    if (total) {
      this.totalNewItems = total - this.totalItem.workitems;
      if (this.totalNewItems > 0) {
        this.showTip = true;
        setTimeout(() => {
          this.showTip = false;
        }, 1500);
      }
    }
  }

  search(keyWords: string) {
    if (keyWords === this.keyWords) {
      return;
    }
    this.keyWords = keyWords;
    this.isEmpty = true;
    this.loadMore({ num: 1 }, null);
  }

  cancel() {
    // 取消搜索
    this.search('');
  }

  // created () {
  //   // 动态注册模块
  //   this.$store.registerModule('circulate', circulate);
  // }

  // destroyed () {
  //   this.$store.unregisterModule('circulate');
  // }

  /**
   * 抛出事件
   */
  openForm(workitem: any) {
    this.$emit('openForm', workitem)
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
@nav-height: 84px;
@nav-search-height: 172px;
@foot-nav: 100px;
.workitems {
  /deep/.mescroll {
    height: auto;
    .px2rem(top, @nav-height);
    .px2rem(bottom, @foot-nav);
  }
  &.searching {
    /deep/.mescroll {
      .px2rem(top, @nav-search-height);
    }
  }
  &.single {
    /deep/.mescroll {
      bottom: 0;
    }
  }
}
</style>
