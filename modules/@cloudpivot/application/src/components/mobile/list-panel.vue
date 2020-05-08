<template>
  <div class="app-list" v-show="!loading">
    <empty v-if="isEmpty"/>
    <div class="app-list__container" v-else>
      <!-- 最近使用 -->
      <biz-models
        class="app-list__recent"
        :title="$t('cloudpivot.application.mobile.RecentlyUsed')"
        v-show="recentBizModel.length"
        :list="recentBizModel"
        :collapsable="true"
        :col="4"
        @onItem="goFormList"
      />
      <div class="app-list__wrap">
        <side-bar
          :staticStyle="true"
          :list="appList"
          :current="currentIdx"
          displayName="displayName"
          @toggle="selectSideItem"
        />
        <app-content
          class="app-list__content"
          v-if="currentApp"
          :app="currentApp"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Mixins } from 'vue-property-decorator';

import OpenFormMixin from './open-form';

import { listApi } from '@cloudpivot/api';

import common from '@cloudpivot/common';

import AppContent from './app-content.vue';

import BizModels from './biz-models.vue';

@Component({
  name: 'app-list',
  components: {
    Empty: common.components.mobile.Empty,
    SideBar: common.components.mobile.Sidebar,
    AppContent,
    BizModels,
  },
})
export default class AppList extends Mixins(OpenFormMixin) {
  loading: boolean = true;

  isEmpty: boolean = false;

  appList: any[] = [];

  recentBizModel: any[] = [];

  activeCode: string = '';

  currentApp: any = null;

  currentIdx: number = 0;

  beforeMount() {
    
    this.getList();
    this.getRecentBizModel();
  }
  mounted() {
    this.load();
  }

  load(flag?: boolean) {
    // if (flag) {
    //   this.loading = false;
    //   this.$h3.toast.hide();
    // } else {
    //   this.loading = true;
    //   this.$h3.toast.show({
    //     text: '正在加载',
    //     iconType: 'loading'
    //   });
    // }
  }

  getList() {
    listApi.list({isMobile:true}).then((res: any) => {
      // console.log('应用列表： ', res);
      if (Array.isArray(res.data) && res.data.length) {
        this.appList = res.data.map((item:any) => {
          item.displayName = common.utils.BusinessFunctions.getLangName(item);
          return item
        });
        this.$nextTick(() => {
          const appcode: any = sessionStorage.getItem('modelSouceApp');
          if (appcode && res.data.some((app: any) => app.code === appcode)) {
            this.activeCode = appcode;
            this.selectApp(appcode);
            sessionStorage.removeItem('modelSouceApp');
          } else {
            this.activeCode = res.data[0].code;
            this.selectApp(this.activeCode);
          }
          this.load(true);
        });
      } else {
        this.isEmpty = true;
        this.load(true);
      }
    });
  }

  getRecentBizModel() {

    listApi.listRecentBizModel().then((res: any) => {
      // console.log('最近使用的模型', res);
      if (Array.isArray(res.data) && res.data.length) {
        /* NOTE: 最多展示4个模型 */
        this.recentBizModel = res.data.filter(Boolean).slice(0, 4);
      }
    });
  }

  selectApp(code: string) {
    /* 选中了一个应用 */
    // console.log('currentApp:', code);
    /* 获取应用的详情 */
    // listApi.getAppF
    const params = {
      appCode: code,
      isMobile: true
    }
    listApi.getFolder(params).then((res: any) => {
      // console.log('应用的信息', res);
      if (!Array.isArray(res.data)) {
        return;
      }
      const item: any = this.appList.find((app: any, idx: number) => {
        if (app.code === code) {
          this.currentIdx = idx;
          return app;
        }
      });
      // 目录数据
      const folders: Array<any> = res.data.filter((biz: any) => biz.type === 'Folder' && biz.children && biz.children.length);
      // 应用下直接挂载的业务模型
      const bizModels: Array<any> = res.data.filter((biz: any) => ['BizModel', 'Page', 'Report'].includes(biz.type));

      const appData: any = {
        title: item ? common.utils.BusinessFunctions.getLangName(item) : '',
        code: item ? item.code : '',
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
      this.currentApp = appData;
    });
  }

  selectSideItem(app: any) {
    this.activeCode = app.code;
    this.selectApp(app.code);
  }
}
</script>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.app-list {
  display: flex;
  align-items: flex-start;
  width: 100%;
  height: 100%;
  overflow: hidden;
  /deep/.empty {
    width: 100%;
    text-align: center;
  }
  &__container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__recent {
      flex: none;
      margin-top: 0;
      .px2rem(padding-bottom, 22px);
      border-radius: 0;
      position: relative;
      .hairline("top", #e6ebf6);
    }
  &__wrap {
    flex: 1;
    display: flex;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  &__content {
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}
</style>
