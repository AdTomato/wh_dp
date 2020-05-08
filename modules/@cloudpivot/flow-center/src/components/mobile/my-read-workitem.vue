<template>
  <div class="finished-circulates" :class="{'searching': showTopbar, 'single': appCode}">
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
        <circulates-item
          v-for="(circulate,index) in finishedCirculates"
          :key="index"
          :workitem="circulate"
          @openForm="openForm(circulate)"
        />
      </div>
    </h3-scroll>
    <Empty
      v-show="!isEmpty"
    ></Empty>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

import { homeApi, mobileHome }  from '@cloudpivot/api';

import * as H3Form from '@cloudpivot/form';

import Common from '@cloudpivot/common';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import CirculatesItem from './components/finished-circulates-item.vue';

@Component({
  name: 'finishedCirculates',
  components: {
    H3Scroll: H3Form.renderer.components.mobile.H3Scroll,
    Empty: Common.components.mobile.Empty,
    CirculatesItem,
    SearchBar: Common.components.mobile.Searchbar
  }
})

export default class FinishedCirculates extends Vue {
  @Prop({
    default: () => {
      return window.Environment.appCode
    }
  }) appCode!: any;

  finishedCirculates: Array<any> = [];

  keyWords:string = '';

  page:number = 1;

  pageSize: number = 20;

  isEmpty: boolean = true;

  /* 是否显示顶部搜索栏 */
  showTopbar: boolean = false;

  /* 是否已加载过至少一次第一页数据 */
  firstTimeLoad: boolean = false;

  loadMore(page:any, done:any) {
    const vm: any = this;
    vm.page = page.num;
    if (page.num === 1) {
      vm.finishedCirculates = [];
    }
    const params: mobileHome.QueryParams = {
      workflowName: vm.keyWords,
      page: page.num - 1,
      size: vm.pageSize,
      // appCode: this.appCode
      appCode: window.Environment.appCode
    };
    homeApi.getFinishedCirculates(params).then((res:any) => {
      if (!res.data || res.errcode) {
        return;
      }

      // 国际化兼容
      res.data.content.forEach((item:any) => {
        item = utils.compatible(item, 'activityName', 'sourceName_i18n');
      });

      if (done) {
        done(vm.pageSize, res.data.totalElements);
      }
      vm.finishedCirculates = vm.finishedCirculates.concat(res.data.content);
      if (!vm.finishedCirculates.length) {
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

  openForm(workitem:any){
    this.$emit('openForm', workitem);
  }
}

</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
@nav-height: 84px;
@nav-search-height: 172px;
@foot-nav: 100px;
.finished-circulates {
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
