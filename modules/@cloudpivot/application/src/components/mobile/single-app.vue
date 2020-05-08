<template>
  <div class="single-app">
    <search-bar
      :placeHolder="$t('cloudpivot.application.mobile.SearchFormName')"
      @search="search"
      @cancel="cancel"
      @clear="clear"
      @change="change"
      @focus="focus"
      @blur="blur"
    ></search-bar>
    <div class="single-app__main">
      <div class="single-app__tasks" v-if="!isFocus && !searchKey">
        <app-task :appCode="appCode"></app-task>
      </div>
      <div class="single-app__groups" v-if="app">
        <div v-show="!searchKey && !isFocus">
          <biz-models
            v-for="(child,index) in app.list"
            :col="4"
            :key="index"
            :title="child.type === 'Folder' ? `${ app.title }-${getName(child)}` : ''"
            :list="child.children"
            @onItem="goFormList"
          />
        </div>
        <template v-if="searchKey">
          <biz-models
            v-for="(child,index) in searchResult.list"
            :col="4"
            :key="`search${index}`"
            :title="child.type === 'Folder' ? `${ searchResult.title }-${getName(child)}` : ''"
            :list="child.children"
            @onItem="goFormList"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Mixins
} from 'vue-property-decorator';
// import OpenFormMixin from '@/mixins/open-form';

import OpenFormMixin from './open-form';

import { Mutation } from 'vuex-class';

// import SearchBar from './searchbar.vue';

import BizModels from './biz-models.vue';

// import AppTask from './app-tasks.vue';

// import appApi from '@/apis/apps.api';

import { listApi } from '@cloudpivot/api';

import * as FlowCenter from '@cloudpivot/flow-center';

import * as platform from '@cloudpivot/platform';

import common from '@cloudpivot/common';

const Utils = common.utils;
// import Utils from '@/utils';

@Component({
  name: 'single-app',
  components: {
    SearchBar: common.components.mobile.Searchbar,
    BizModels,
    AppTask: FlowCenter.components.mobile.AppTask
  }
})
export default class SingleApp extends Mixins(OpenFormMixin) {
  @Mutation('setAppCode') setAppCode!: any;

  app: any = null;

  searchKey: string = '';

  searchResult = {
    title: '',
    list: []
  };

  isFocus: boolean = false;

  Mode = {
    Normal: 0,
    Search: 1
  };

  get appCode(){
    return window.Environment.appCode;
  }

  get appName() {
    return window.Environment.appName;
  }

  search() {

  }

  cancel() {
    this.searchKey = '';
    this.isFocus = false;
    this.initSearchResult();
  }

  clear() {
    this.searchKey = '';
    this.initSearchResult();
  }

  change(val: string) {
    this.searchKey = val;
    this.searchBizModels(val);
  }

  focus() {
    this.isFocus = true;
  }

  blur() {
    console.log('blur');
  }

  initSearchResult() {
    this.searchResult = {
      title: '',
      list: []
    };
  }

  formatData(data: any, mode: number) {
    // 目录数据
    const folders: Array<any> = data.filter((biz: any) => biz.type === 'Folder' && biz.children && biz.children.length);
    // 应用下直接挂载的业务模型
    const bizModels: Array<any> = data.filter((biz: any) => ['BizModel', 'Page', 'Report'].includes(biz.type));

    const appData: any = {
      title: '',
      code: this.appCode,
      list: []
    };
    if (bizModels.length) {
      appData.list = [
        {
          children: bizModels,
          type: null
        },
        ...folders
      ];
    } else {
      appData.list = folders;
    }
    if (mode === this.Mode.Normal) {
      this.app = appData;
    } else {
      this.searchResult = appData;
    }
  }

  async getApp(code: string) {
    const params = {
      appCode: code,
      isMobile: true
    }
    const res = await listApi.getFolder(params);
    if (res.errcode === 0) {
      if (!Array.isArray(res.data)) {
        return;
      }
      this.formatData(res.data, this.Mode.Normal);
    }
  }

  async searchBizModels(searchKey: string) {
    const params = {
      appCode: this.appCode,
      searchKey,
    }
    const res = await listApi.searchBizModels(params);
    if (res.errcode === 0) {
      if (!Array.isArray(res.data)) {
        this.initSearchResult();
        return;
      }
      this.formatData(res.data, this.Mode.Search);
    }
  }

  /**
   * 获取多语言下对应展示名称
   */
  getName(block:any){
    return common.utils.BusinessFunctions.getLangName(block);
  }

  /**
   * 获取单应用的名称信息
   */
  getSingleAppInfo() {
    listApi.getSingleAppInfo(this.appCode).then((res:any) => {
      if (res.errcode === 0) {
        window.Environment.appName = res.data.name;
        platform.service.setTitle(res.data.name);
      }
    })
  }

  created() {
    if (this.appCode) {
      this.setAppCode(this.appCode);
      if (this.appName) {
        platform.service.setTitle(this.appName);
      } else {
        this.getSingleAppInfo();
      }
    }
    this.getApp(this.appCode);
  }
}

</script>
<style lang='less' scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.single-app {
  .search-bar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
  }
  &__main {
    position: absolute;
    .px2rem(top, 88);
    left: 0;
    width: 100%;
    bottom: 0;
    overflow-y: auto;
  }
  &__tasks,
  &__groups {
    .px2rem(padding-left, 20);
    .px2rem(padding-right, 20);
  }
  &__groups {
    .px2rem(margin-top, 20);
  }
  &__tasks {
    .px2rem(margin-top, 20);
  }
}
</style>
