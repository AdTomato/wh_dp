<template>
  <div class="circulates" :class="{'searching': showTopbar, 'single': appCode}">
    <div class="circulates-topbar" v-show="showTopbar">
      <!-- search -->
      <search-bar
        v-show="!showCheckbox"
        @search="search"
        @cancel="cancel"
        :placeHolder="$t('languages.common.search')"
        :cancelText="$t('languages.common.cancel')"
      >
        <span @click="toggleView" class="circulates-search">{{ $t('cloudpivot.flowCenter.mobile.batch') }}</span>
      </search-bar>
      <!-- check-tool-bar -->
      <section v-show="showCheckbox">
        <div class="circulates-topbar-check">
          <p class="check-left">
            <checkbox-item
              :defaultChecked="checkAll"
              @change="toggleCheckAll"
            />
            {{ $t('cloudpivot.flowCenter.mobile.selectAll') }}
          </p>
          <p class="check-right" @click="toggleView">{{ $t('cloudpivot.flowCenter.mobile.completed') }}</p>
        </div>
        <div class="circulates-footbar">
          <p class="footbar-left">{{ $t('cloudpivot.flowCenter.mobile.haveSelected') }}: {{ checkAll ? totalItem.circulates : checkedIds.length }}</p>
          <p class="footbar-right">
            <span class="footbar-right-button" @click="markMultiRead">{{ $t('cloudpivot.flowCenter.mobile.markMultiRead') }}</span>
          </p>
        </div>
      </section>
    </div>
    <!-- 列表 -->
    <h3-scroll
      ref="scroll"
      :loadMore="loadMore"
      :pageSize="pageSize"
      :isLock="showCheckbox"
      :enableDown="!showCheckbox"
      :enableUp="!showCheckbox"
      v-show="isEmpty && circulates.length"
    >
      <div>
        <transition name="fade">
          <toptip v-show="showTip">{{ $t('cloudpivot.flowCenter.mobile.youHave') }}{{ totalNewItems }}{{ $t('cloudpivot.flowCenter.mobile.toreadItems') }}</toptip>
        </transition>
        <!-- <circulates-item
          v-for="(circulate,index) in circulates"
          :key="index"
          :workitem="circulate"
          @read="markItemRead(circulate)"
        /> -->
        <circulates-item
          :circulates="circulates"
          @read="markItemRead"
          @openForm="openForm"
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
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import { homeApi, mobileHome }  from '@cloudpivot/api';

import * as H3Form from '@cloudpivot/form';

import Common from '@cloudpivot/common';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

import CirculatesItem from './components/circulates-item.vue';

// import circulate from './store/circulate';

@Component({
  name: 'circulates',
  components: {
    H3Scroll:H3Form.renderer.components.mobile.H3Scroll,
    Toptip: Common.components.mobile.Toptip,
    Empty: Common.components.mobile.Empty,
    SearchBar: Common.components.mobile.Searchbar,
    CirculatesItem,
    checkboxItem: Common.components.mobile.Checkbox,
  }
})
export default class Circulates extends Vue {
  @Prop({
    default: () => {
      return window.Environment.appCode
    }
  }) appCode !:any;

  circulates: Array<mobileHome.Workitem> = [];

  keyWords:string = '';

  page:number = 1;

  pageSize: number = 20;

  isEmpty: boolean = true;

  /* 是否显示顶部搜索栏 */
  showTopbar: boolean = false;

  /* 是否已加载过至少一次第一页数据 */
  firstTimeLoad: boolean = false;

  // 是否有新的条数： 旧的总数减新的总数
  totalNewItems: number = 10;

  // 是否显示顶部提示条
  showTip: boolean = false;

  get totalItem(){
    return this.$store.state.circulate.totalItem;
  }

  get checkAll(){
    return this.$store.state.circulate.checkAll;
  }

  get checkedIds(){
    return this.$store.state.circulate.checkedIds;
  }

  get showCheckbox(){
    return this.$store.state.circulate.showCheckbox;
  }

  toggleCheckAll(){
    this.$store.commit('circulate/toggleCheckAll');
  }

  loadMore(page:any, done:any) {
    const vm: any = this;
    vm.page = page.num;
    if (vm.page === 1) {
      vm.circulates = [];
    }
    const params: mobileHome.QueryAwaitParams = {
      wd: vm.keyWords,
      page: page.num - 1,
      size: vm.pageSize,
      // appCode: this.appCode,
      appCode: window.Environment.appCode
    };
    homeApi.searchCirculates(params).then((res:any) => {
      if (!res.data || res.errcode) {
        return;
      }

      // 国际化兼容
      res.data.content.forEach((item:any) => {
        item = utils.compatible(item, 'activityName');
      });

      if (done) {
        this.toastTip(res.data.totalElements);
        done(vm.pageSize, res.data.totalElements);
      }
      vm.circulates = vm.circulates.concat(res.data.content);
      const totalElements = {
        circulate: res.data.totalElements
      };
      vm.$store.commit('circulate/setTotalItem', totalElements)
      if (!vm.circulates.length) {
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
    if (total && this.totalItem) {
      this.totalNewItems = total - this.totalItem.circulates;
      if (this.totalNewItems > 0) {
        this.showTip = true;
        setTimeout(() => {
          this.showTip = false;
        }, 1500);
      }
    }
  }

  markItemRead(circulate:any) {
    if (!circulate || !circulate.id) {
      return;
    }
    homeApi.updateCirculateReaded([circulate.id]).then(() => {
      /* 从待阅列表中清除当前条目：截取当前页之前的数据保留，替换当前页的所有条目 */
      const resultList:Array<mobileHome.Workitem> = this.circulates.filter((item: mobileHome.Workitem) => item.id !== circulate.id);
      const count: number = this.circulates.length;
      const params: mobileHome.QueryAwaitParams = {
        wd: this.keyWords,
        page: count,
        size: 1
      };
      homeApi.searchCirculates(params).then((res:any) => {
        if (Array.isArray(res.data)) {
          resultList.push(res.data[0]);
        }
      }).then(() => {
        this.$store.dispatch('circulate/getTotalCount', this.appCode);
        this.circulates = [];
        this.$nextTick(() => {
          this.circulates = [...resultList];
        });
      });
    });
  }

  markMultiRead() {
    /* 标记多条为已阅 */
    if ((!this.checkedIds || !this.checkedIds.length) && !this.checkAll) {
      /* TODO: 此处的toast未成功调用 */
      this.$h3.toast.show({ text: this.$t('cloudpivot.flowCenter.mobile.notSelectUnread') });
      return;
    }
    const params: string[] = this.checkAll ? [] : this.checkedIds;
    homeApi.updateCirculateReaded(params).then(() => {
      if (this.checkAll) {
        /* 标记所有为已阅，列表清空，并重置页码为1——第一页 */
        this.page = 1;
        this.circulates = [];
        this.isEmpty = false;
        this.$store.commit('circulate/setTotalItem', { circulates: 0 })
      } else {
        /* 标记已选为已阅，重新获取第一页 */
        this.isEmpty = true;
        this.$store.commit('circulate/setTotalItem', {
          circulates: Math.max(0, this.totalItem.circulates - this.checkedIds.length)
        });
      }
      this.loadMore({ num: 1 }, null);
    }).then(() => {
      this.$store.commit('circulate/resetCheckState')
      // this.getTotalCount(this.appCode);
    });
  }

  toggleView() {
    /* 切换当前 */
    this.$store.commit('circulate/toggleShowCheckbox')
    this.$emit('toggle', this.showCheckbox);
    Common.utils.Bus.$emit('toggleNavbar', !this.showCheckbox);
  }

  search(wd: string) {
    if (wd === this.keyWords) {
      return;
    }
    this.keyWords = wd;
    this.isEmpty = true;
    this.loadMore({ num: 1 }, null);
  }

  cancel() {
    // 取消搜索
    this.search('');
  }

  beforeMount() {
    this.isEmpty = true;
    this.showTopbar = false;
  }

  beforeDestroy() {
    this.$store.commit('circulate/resetCheckState')
    this.$emit('toggle', false);
    Common.utils.Bus.$emit('toggleNavbar', true);
  }

  // created () {
  //   // 动态注册模块
  //   this.$store.registerModule('circulate', circulate);
  // }

  // destroyed () {
  //   this.$store.unregisterModule('circulate');
  // }

  openForm(workitem:any){
    this.$emit('openForm', workitem)
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
@nav-height: 84px;
@nav-search-height: 172px;
@foot-nav: 100px;
.circulates{
  overflow: hidden;
  height: 100%;
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
  &-topbar {
    width: 100%;
    .px2rem(font-size, 32px);
    background-color: #fff;
    &-check {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .px2rem(height, 88px);
      .px2rem(padding-left, 30px);
      .px2rem(padding-right, 30px);
    }
  }
  &-search {
    color: @text-color-main;
    display: block;
    min-width: 1em;
    .px2rem(margin-right, 30px);
  }
  &-footbar {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1001;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: @text-color-main;
    background-color: #fff;
    // box-shadow: 0 0 3px red;
    .px2rem(font-size, 32px);
    .px2rem(padding-top, 20px);
    .px2rem(padding-bottom, 20px);
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    .backgroundline('top');
  }
  .footbar-right-button {
    display: inline-block;
    .px2rem(width, 320px);
    .px2rem(height, 72px);
    .px2rem(line-height, 72px);
    .px2rem(border-radius, 40px);
    color: #fff;
    background-color: @primary-color;
    &:active {
      opacity: 0.65;
    }
  }
}

</style>
