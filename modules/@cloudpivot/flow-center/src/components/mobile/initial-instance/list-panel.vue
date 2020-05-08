<template>
  <div class="instance-list" v-show="!loading">
    <empty v-if="isEmpty"/>
    <div class="instance-list__container" v-else>
      <!-- 常用流程 -->
      <instances
        class="instance-list__favorite"
        :title="$t('cloudpivot.flowCenter.mobile.commonFlow')"
        v-show="favoriteInstances.length"
        :list="favoriteInstances"
        :collapsable="true"
        :col="4"
        @onItem="goForm"
      />
      <!-- 流程列表 -->
      <div class="instance-list__wrap">
        <side-bar
          :staticStyle="true"
          :list="appList"
          :current="currentIdx"
          displayName="displayName"
          @toggle="selectSideItem"
        />
        <app-content 
          class="instance-list__content" 
          v-if="currentApp" 
          :app="currentApp"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { initialInstanceApi, initialInstanceParams } from '@cloudpivot/api';
import common from '@cloudpivot/common';
import AppContent from './app-content.vue';
import Instances from './instances.vue';
@Component({
  name: 'instance-list',
  components: {
    Empty: common.components.mobile.Empty,
    SideBar: common.components.mobile.Sidebar,
    AppContent,
    Instances,
  },
})
export default class InstanceList extends Vue {
  loading: boolean = true;

  isEmpty: boolean = false;

  appList: any[] = [];

  favoriteInstances: any[] = [];

  activeCode: string = '';

  currentApp: any = null;

  currentIdx: number = 0;

  beforeMount() {
    this.load();
    this.getList();
    this.getFavoriteInstances();
  }

  load(flag?: boolean) {
    if (flag) {
      this.loading = false;
      this.$h3.toast.hide();
    } else {
      this.loading = true;
      this.$h3.toast.show({
        text: '正在加载',
        iconType: 'loading'
      });
    }
  }

  getList() {
    const isMobile = true;
    initialInstanceApi.listMyWorkflow(isMobile).then((res: initialInstanceParams.HttpResponse<any>) => {
      console.log('应用列表： ', res);
      if (Array.isArray(res.data) && res.data.length) {
        this.appList = res.data.map((app: initialInstanceParams.AppData) => this.formatItem(app));
        console.log('hehe');
        this.$nextTick(() => {
          const appcode: any = sessionStorage.getItem('initialSourceApp');
          if (appcode && res.data.some((a: any) => a.appCode === appcode)) {
            this.activeCode = appcode;
            this.selectApp(appcode);
            sessionStorage.removeItem('initialSourceApp');
          } else {
            this.activeCode = res.data[0].appCode;
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

  getFavoriteInstances() {
    initialInstanceApi.listFavoriteWorkflows().then((res: initialInstanceParams.HttpResponse<any>) => {
      // console.log('常用流程：', res);
      if (Array.isArray(res.data) && res.data.length) {
        this.favoriteInstances = res.data.slice(0, 7);
      }
    });
  }

  /**
   * 将返回的每个应用的数据格式化为UI展示相对应的格式
   */
  formatItem(item: initialInstanceParams.AppData) {
    const folders: Array<initialInstanceParams.InstanceItem> = item.dataList.filter((ins: any) => ins.type === initialInstanceParams.AppTreeItemTypes.Folder && ins.size).map((ins: any) => {
      ins.children = [];
      return ins;
    });
    const instances: Array<initialInstanceParams.InstanceItem> = item.dataList.filter((ins: any) => ins.type === initialInstanceParams.AppTreeItemTypes.BizModel);
    let list: Array<initialInstanceParams.InstanceItem | initialInstanceParams.InstanceRootItem> = [];
    if (instances.length) {
      list = [{ children: instances }, ...folders];
    } else {
      list = folders;
    }
    return {
      ...item,
      displayName: common.utils.BusinessFunctions.getLangName(item,'appName'),
      children: list
    };
  }

  selectApp(code: string) {
    /* 选中了一个应用 */
    // console.log('currentApp:', code);
    this.currentApp = null;
    const item: any = this.appList.find((app: any, index: number) => {
      if (app.appCode === code) {
        this.currentIdx = index;
        return app;
      }
      return null;
    });
    if (!item) {
      return;
    }
    this.$nextTick(() => {
      this.currentApp = item;
    });
  }

  selectSideItem(app: any) {
    this.activeCode = app.appCode;
    this.selectApp(app.appCode);
  }

  goForm(workitem: any) {
    sessionStorage.setItem('initialSourceApp', this.currentApp.appCode);
    this.$router.push({
      name: 'form-detail',
      query: {
        startWorkflowCode: workitem.code,
        return: this.$route.fullPath
      }
    });
  }
}
</script>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";

.instance-list {
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
  &__favorite {
    flex: none;
    margin-top: 0;
    .px2rem(padding-bottom, 22px);
    border-radius: 0;
    position: relative;
    .hairline("top", #e6ebf6);
    /deep/.instances__title {
      .px2rem(font-size, 28px);
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
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
