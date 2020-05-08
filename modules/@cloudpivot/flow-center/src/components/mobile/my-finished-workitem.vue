<template>
  <div class="finished-workitems" :class="{'searching': showTopbar, 'single': appCode}">
    <search-bar
      v-show="showTopbar"
      class="finished-circulates-search"
      @search="search"
      @cancel="cancel"
      :placeHolder="$t('languages.common.search')"
      :cancelText="$t('languages.common.cancel')"
    />
    <h3-scroll
      ref="scroll"
      :loadMore="loadMore"
      :pageSize="pageSize"
      v-show="isEmpty"
    >
      <div>
        <finished-work-item
          v-for="(workitem,index) in finishedWorkitems"
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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State } from 'vuex-class';

import { homeApi, mobileHome } from '@cloudpivot/api';

import * as H3Form from '@cloudpivot/form';

import * as utils from '@cloudpivot/common/src/utils/pc/utils';

import Common from '@cloudpivot/common';

import FinishedWorkItem from './components/finished-workitem.vue';

@Component({
  name: 'workitems',
  components: {
    H3Scroll: H3Form.renderer.components.mobile.H3Scroll,
    Empty: Common.components.mobile.Empty,
    FinishedWorkItem,
    SearchBar: Common.components.mobile.Searchbar
  }
})
export default class FinishedWorkitems extends Vue {
  @Prop({
    default: () => {
      return window.Environment.appCode
    }
  }) appCode!: any;

  finishedWorkitems: Array<any> = [];

  page: number = 1;

  pageSize: number = 20;

  keyWords: string = '';

  isEmpty: boolean = true;

  /* 是否显示顶部搜索栏 */
  showTopbar: boolean = false;

  /* 是否已加载过至少一次第一页数据 */
  firstTimeLoad: boolean = false;

  loadMore(page: any, done: any) {
    const vm: any = this;
    vm.page = page.num;
    if (page.num === 1) {
      vm.finishedWorkitems = [];
    }
    const params: mobileHome.QueryParams = {
      workflowName: vm.keyWords,
      page: page.num - 1,
      size: vm.pageSize,
      // appCode: this.appCode,
      appCode: window.Environment.appCode
    };
    homeApi.getFinishedWorkitems(params).then((res: any) => {
      if (!res.data || res.errcode) {
        return;
      }

      // 国际化兼容
      res.data.content.forEach((item: any) => {
        item = utils.compatible(item, 'activityName');
      });

      if (done) {
        done(vm.pageSize, res.data.totalElements);
      }
      vm.finishedWorkitems = vm.finishedWorkitems.concat(res.data.content);
      if (!vm.finishedWorkitems.length) {
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

  search(keyWords: string) {
    if (keyWords === this.keyWords) {
      return;
    }
    this.keyWords = keyWords;
    // const scroll = this.$refs.scroll as any;
    // scroll.mescroll.resetUpScroll();
    this.isEmpty = true;
    this.loadMore({ num: 1 }, null);
  }

  cancel() {
    // 取消搜索
    this.search('');
  }

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
.finished-workitems {
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
