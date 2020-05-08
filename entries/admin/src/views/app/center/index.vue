<template>
  <div
    class="apps"
    v-show="listLoaded"
    @scroll="contenScroll"
    ref="apps"
  >
    <div v-if="!appList || !appList.length" class="apps-empty">
      <!-- 暂无应用 -->
      <img src="~@/assets/images/nodata.png" alt="empty"/>
      <p>{{ $t('languages.Apps.AddYourAppNow') }}</p>
      <a-button
        type="primary"
        class="add-app"
        @click="onAddApp"
        v-if="!isOnlyAppAdmin"
      >
        <a-icon type="plus"/>
        {{ $t('languages.Apps.AddApp') }}
      </a-button>
    </div>
    <div
      v-else
      class="apps-list"
      :style="`width: ${wrapWidth}px;`"
    >
      <div class="apps-list-opera">
        <a-button
          type="primary"
          class="add-app"
          @click="onAddApp"
          v-if="!isOnlyAppAdmin"
        >
          <a-icon type="plus" class="app-icon-plus"/>
          {{ $t('languages.Apps.AddApp') }}
        </a-button>
        <span
          class="search-size"
          v-if="isSearchResult && searchList.length>0"
        >{{ $t('languages.Apps.SearchResult',{ count: searchList.length }) }}</span>
        <a-input
          :placeholder="$t('languages.Apps.SearchAppName')"
          class="input-search"
          v-model="searchKey"
          v-show="appList && appList.length>12"
          @pressEnter="onSearch"
        >
          <a-icon
            class="suffix-icon close-icon"
            v-if="searchKey.length > 0 "
            slot="suffix"
            type="close-circle"
            @click="clearKeyword"
          />

          <a-icon
            class="suffix-icon"
            type="search"
            slot="suffix"
            @click="onSearch"
          />
        </a-input>
      </div>
      <div class="no-data" v-show="isSearchResult && searchList.length === 0">
        <img class="user-empty" src="~@/assets/images/search.png"/>
        <div>{{ $t('languages.Apps.NoSearchResult') }}</div>
      </div>
      <ul class="apps-list-content" v-if="isSearchResult">
        <li
          class="content-item"
          v-for="item in searchList"
          :key="item.code"
          @click="onClickApp(item.code)"
        >
          <a-popover
            placement="rightTop"
            trigger="click"
            overlayClassName="popover"
            :getPopupContainer="getPopupContainer"
            @visibleChange="onVisibleChange($event,item.code)"
          >
            <template slot="content">
              <p @click.stop="editItem(item)">{{ $t('languages.Apps.Setting') }}</p>
              <p @click.stop="popItem(item)">{{ $t('languages.Apps.Delete') }}</p>
            </template>
            <i
              class="icon aufontAll h-icon-all-setting-o setting"
              :class="{'isshow':showIcon&&iconCode===item.code}"
              @click.stop="()=>{}"
            ></i>
          </a-popover>
          <img
            v-if="!item.enabled"
            src="~@/assets/images/enabled.svg"
            class="content-item-enabled"
          />
          <!-- <template v-if="item.content">
            <img/>
          </template>-->
          <template v-if="item.content">
            <img :src="'data:image/png;base64,'+item.content" class="content-item-icon"/>
          </template>
          <template v-else-if="item.logoUrl">
            <img 
              v-if="item.logoUrl.indexOf('http') > -1" 
              :src="item.logoUrl" 
              class="content-item-icon"
            />
            <img 
              v-else 
              :src="getDownloadUrl(item.logoUrl)" 
              class="content-item-icon"
            />
          </template>
          <img 
            v-else 
            :src="defaultAppIcon" 
            class="content-item-icon"
          />
          <!-- <template v-else>
            <img :src="item.logoUrl || defaultAppIcon" class="content-item-icon"/>
          </template> -->
          <!-- <img :src="item.logoUrl || defaultAppIcon" class="content-item-icon"> -->
          <a-tooltip placement="top" v-if="showTootip(item.displayName)">
            <span slot="title">{{ item.displayName }}</span>
            <p
              class="content-item-name"
              v-hight-light="{'keyWords': searchKey, 'value': item.displayName }"
            ></p>
          </a-tooltip>
          <p
            class="content-item-name"
            v-else
            v-hight-light="{'keyWords': searchKey, 'value': item.displayName }"
          ></p>
        </li>
      </ul>
      <Draggable
        v-else
        v-model="computedAppList"
        class="apps-list-content"
        element="ul"
        :options="dragOptions"
        @end="onEnd"
      >
        <!-- 有bug提及动画效果不好，故取消transition-group -->
        <!-- <transition-group type="transition" name="flip-list"> -->
        <li
          class="content-item"
          v-for="item in computedAppList"
          :key="item.code"
          :id="item.code"
          @click="onClickApp(item.code)"
        >
          <a-popover
            placement="rightTop"
            trigger="click"
            overlayClassName="popover"
            :getPopupContainer="getPopupContainer"
            @visibleChange="onVisibleChange($event,item.code)"
          >
            <template slot="content">
              <p @click.stop="editItem(item)">{{ $t('languages.Apps.Setting') }}</p>
              <p @click.stop="popItem(item)">{{ $t('languages.Apps.Delete') }}</p>
            </template>
            <i
              class="icon aufontAll h-icon-all-setting-o setting"
              :class="{'isshow':showIcon&&iconCode===item.code}"
              @click.stop="()=>{}"
            ></i>
          </a-popover>
          <img
            v-if="!item.enabled"
            src="~@/assets/images/enabled.svg"
            class="content-item-enabled"
          />
          <template v-if="item.content">
            <img :src="'data:image/png;base64,'+item.content" class="content-item-icon"/>
          </template>
          <template v-else-if="item.logoUrl">
            <img 
              v-if="item.logoUrl.indexOf('http') > -1" 
              :src="item.logoUrl" 
              class="content-item-icon"
            />
            <img 
              v-else 
              :src="getDownloadUrl(item.logoUrl)" 
              class="content-item-icon"
            />
          </template>
          <img 
            v-else 
            :src="defaultAppIcon" 
            class="content-item-icon"
          />
          <!-- <template v-if="item.content">
            <img :src="'data:image/png;base64,'+item.content" class="content-item-icon"/>
          </template>
          <template v-else>
            <img :src="item.logoUrl || defaultAppIcon" class="content-item-icon"/>
          </template> -->

          <a-tooltip placement="top" v-if="showTootip(item.displayName)">
            <span slot="title">{{ item.displayName }}</span>
            <p class="content-item-name">{{ item.displayName }}</p>
          </a-tooltip>
          <p class="content-item-name" v-else>{{ item.displayName }}</p>
        </li>
        <!-- </transition-group> -->
      </Draggable>
    </div>
    <!-- 弹窗 -->
    <AddAppModal v-model="showAddModal" @submitEvent="onClickApp"/>
    <a-drawer
      :title="$t('languages.Apps.AppSetting')"
      :visible="showEditDrawer"
      :closable="true"
      :destroyOnClose="true"
      width="850"
      placement="right"
      wrapClassName="edit-app-drawer"
      @close="closeEditDrawer"
    >
      <EditDrawer/>
    </a-drawer>
    <div
      class="back-top"
      v-show="backTop"
      @click="goBackTop"
    >
      <i class="icon aufontAll h-icon-all-circle-up"></i>
    </div>

    <!-- 用户指引  -->
    <div>
      <NewUserGuide v-model="isShowGuide" @close="closeGuide"/>
    </div>
  </div>
</template>

<script lang="ts">
// import './Sortable';
import { Component, Vue, Watch } from 'vue-property-decorator';

import { State, Action, namespace } from 'vuex-class';

import Draggable from 'vuedraggable';

import { getRealLength } from '@/common/utils';

import { LanguageTransform } from '@/utils';

import AddAppModal from '@/components/apps/modals/addApp.vue';

import NewUserGuide from '@/components/apps/guide/new-user-guide.vue';

import UserGuideApi from '@/apis/system/system-manager.api';

import * as UserGuideNS from '@/typings/user-guide';

import EditDrawer from './edit-drawer.vue';

const icon = require('@/assets/images/appicon.png');

const AppCenterModule = namespace('Apps/AppCenter');

const UserModule = namespace('System/User');

@Component({
  name: 'AppList',
  components: {
    AddAppModal,
    EditDrawer,
    Draggable,
    NewUserGuide
  }
})

export default class AppList extends Vue {
  @UserModule.State('isOnlyAppAdmin') isOnlyAppAdmin!: boolean;

  @UserModule.State('loginedUserInfo') loginedUserInfo!: any;

  @AppCenterModule.State('appList') appList: any;

  @AppCenterModule.Mutation('setAppList') setAppList: any;

  @AppCenterModule.Mutation('setAppDetail') setAppDetail: any;

  @AppCenterModule.Action('getAppList') getAppList: any;

  @AppCenterModule.Action('checkIfHasModel') checkIfHasModel: any;

  @AppCenterModule.Action('popAppPackage') popAppPackage: any;

  @AppCenterModule.Action('updateAppSort') updateAppSort: any;

  listLoaded: boolean = true;

  defaultAppIcon: any = icon;

  showAddModal: boolean = false;

  afterDrag: boolean = false;

  dragOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100
  };

  wrapWidth: number = 0;

  searchKey: string = '';

  // 搜索关键字
  searchList: any = [];

  // 搜索应用列表数组
  isSearchResult: boolean = false;

  // 是否为搜索结果
  showIcon: boolean = false;

  iconCode: string = '';

  backTop: boolean = false;

  // 是否展示回到顶部
  showEditDrawer: boolean = false;

  // 是否展示编辑应用弹出层
  isShowGuide: boolean = false; // 是否显示新手指引

  get apiHost(){
    return (window as any).config.apiHost
  }

  get token(){
    return window.localStorage.getItem('token');
  }

  /**
   * 计算值：当前应用列表，附加属性 displayName
   */
  get computedAppList() {
    const lang: string = this.$i18n.locale || 'zh';
    return this.appList.map((app: Apps.AppCenter.AppInfo) => {
      app.displayName = app.name_i18n ? LanguageTransform.getLang(app.name, app.name_i18n) : app.name;
      return app;
    });
  }

  getDownloadUrl(refId:string){
    let url = `${this.apiHost}/api/aliyun/download?refId=${refId}`;
    if(this.token){
      url += '&access_token=' + this.token;
    }
    return url;
  }

  /**
   * 计算应用列表变化时，更新store
   */
  set computedAppList(val: Array<Apps.AppCenter.AppInfo>) {
    this.setAppList(val);
  }

  getPopupContainer(triggerNode:any) {
    return this.$el;
  }

  /**
   * 内容区域滚动事件
   */
  contenScroll() {
    const appDom = this.$refs.apps as HTMLElement;
    if (!appDom) {
      return;
    }
    if (appDom.scrollTop > 50) {
      this.backTop = true;
    } else {
      this.backTop = false;
    }
  }

  /**
   * 回到顶部
   */
  goBackTop() {
    const appDom = this.$refs.apps as HTMLElement;
    if (!appDom) {
      return;
    }
    appDom.scrollTop = 0;
  }

  /**
   * 应用搜索
   */
  onSearch() {
    // console.log('searching...', Date.now());
    this.searchList = [];
    if (this.searchKey) {
      this.computedAppList.forEach((app: any) => {
        if (app.displayName.indexOf(this.searchKey) !== -1) {
          this.searchList.push(app);
        }
      });
      this.isSearchResult = true;
    } else {
      this.isSearchResult = false;
    }
  }

  /**
   * 清空搜索关键字
   */
  clearKeyword() {
    this.searchKey = '';
    this.isSearchResult = false;
  }

  /**
   * 切换显隐
   */
  onVisibleChange(visible: boolean, code: string) {
    this.showIcon = visible;
    this.iconCode = code;
  }

  /**
   * 新建应用
   */
  onAddApp() {
    this.showAddModal = true;
  }

  /**
   * 删除应用
   */
  popItem(item: Apps.AppCenter.AppInfo) {
    const vm: any = this;
    const params: Apps.AppCenter.AppInfoParams = {
      appCode: item.code
    };
    this.checkIfHasModel(params).then((res: Common.Data) => {
      /* TODO: 接口响应未定义具体内容，暂时判断res.data是否有值，如果有就认为应用下有模型 */
      if (res.errcode) {
        /* 删除应用 —— 应用下有模型 */
        this.$warning({
          title: this.$t('languages.Apps.DeletePrompt'),
          okText: this.$t('languages.Apps.Ok').toString(),
          cancelText: this.$t('languages.Apps.Cancel').toString(),
          content: this.$t('languages.Apps.AppHasModelCannotBeDelete')
        });
      } else {
        /* 删除应用 —— 应用下无模型 */
        this.$confirm({
          title: this.$t('languages.Apps.ConfirmDelete', { name: item.displayName }), // `确定要删除“${item.name}”吗？`
          okType: 'danger',
          okText: this.$t('languages.Apps.Delete').toString(),
          cancelText: this.$t('languages.Apps.Cancel').toString(),
          onOk() {
            vm.popAppPackage(params);
            vm.searchList.forEach((app: any, index: number) => {
              if (app.code === item.code) {
                vm.searchList.splice(index, 1);
              }
            });
          }
        });
      }
    });
  }

  /**
   * 编辑应用
   */
  editItem(item: Apps.AppCenter.AppInfo) {
    this.setAppDetail(item);
    this.$nextTick(() => {
      this.showEditDrawer = true;
    });
  }

  /**
   * 关闭编辑应用弹出
   */
  closeEditDrawer() {
    this.setAppDetail({
      code: '',
      name: '',
    });
    this.showEditDrawer = false;
  }

  /**
   * 结束拖拽
   */
  onEnd(evt: any) {
    // if (evt.newIndex === evt.oldIndex) {
    //   this.afterDrag = true;
    //   return;
    // }
    const appCode = this.appList[evt.newIndex].code;
    const sortKey = parseInt(evt.newIndex, 10) + 1;
    const params = {
      appCode,
      sortKey
    };
    this.updateAppSort(params);
  }

  /**
   * 点击应用
   */
  onClickApp(code: string) {
    this.$router.push({
      name: 'appitem',
      params: {
        appCode: code
      }
    });
  }

  /**
   * 计算应用列表的最大宽度
   */
  calcWidth() {
    const winWidth: number = Math.max(1024, document.body.clientWidth);
    let n: number = 0;
    if (winWidth < 1001) {
      /* eslint-disable-next-line */
      n = Math.floor((winWidth - 160 + 24) / 196);
    } else {
      /* eslint-disable-next-line */
      n = Math.floor((winWidth - 200 + 24) / 196);
    }
    // console.log('可放置多少个应用：', n);
    this.wrapWidth = Math.round((196 * n) - 24);
  }

  /**
   * 应用名称超过20个字节时显示tooltip
   */
  showTootip(name: string) {
    return getRealLength(name) > 20;
  }

  /**
   * 关闭新手指引
   */
  closeGuide() {
    this.isShowGuide = false;
    this.updateUserGuide();
  }

  /**
   * 获取新用户状态
   */
  async getUserGuide() {
    const userId: string = this.loginedUserInfo.id;
    const params: BPM.System.UserGuide = {
      userId,
      pageType: UserGuideNS.PageType.AppManage
    };
    const res: any = await UserGuideApi.getUserGuide(params);
    if (res.errcode === 0) {
      this.isShowGuide = res.data.display;
    }
  }

  /**
   * 更新新用户状态
   */
  async updateUserGuide() {
    const userId: string = this.loginedUserInfo.id;
    const params: BPM.System.UserGuide = {
      userId,
      pageType: UserGuideNS.PageType.AppManage
    };
    const res: any = await UserGuideApi.updateUserGuide(params);
  }

  /**
   * 切换语种时更新搜索列表
   */
  @Watch('$i18n.locale')
  onLangChange() {
    if (this.searchKey) {
      this.onSearch();
    }
  }

  created() {
    // 获取应用列表
    this.getAppList().then(() => {
      this.listLoaded = true;
    });

    document.body.ondrop = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };

    this.calcWidth();

    window.onresize = () => {
      this.calcWidth();
    };

    this.getUserGuide();
  }
}
</script>

<style lang="less" scoped>
.apps {
  background-color: #f6f7f9 !important;
  overflow-y: auto;
  .ghostClass {
    opacity: 1;
    background-color: rgba(245, 245, 245, 1);
    border: 1px dashed #d9d9d9;
    * {
      opacity: 0;
    }
  }
  .dragClass {
    background-color: #fff;
    box-shadow: inset 0 0 0 1px @primary-color,
      0px 4px 12px 0px rgba(7, 98, 23, 0.15);
  }
  .back-top {
    position: fixed;
    right: 24px;
    bottom: 24px;
    i {
      font-size: 44px;
      color: rgba(0, 0, 0, 0.25);
    }
  }
}
.apps-empty {
  height: 100%;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  img {
    width: 402px;
    height: 195px;
    object-fit: contain;
  }
  p {
    margin: 8px 0 16px;
    color: rgba(0, 0, 0, 0.65);
  }
  i {
    margin-right: 9px;
  }
}

.apps-list {
  margin: 24px auto 15px;
  text-align: left;
}
/* 两侧空白限制 */
// @media screen and (min-width: 1366px) {
//   .apps-list {
//     margin-left: 234px;
//     margin-right: 234px;
//   }
// }
// @media screen and (max-width: 600px) {
//   .apps-list {
//     margin-left: 24px;
//     margin-right: 24px;
//   }
// }

.no-data {
  margin-top: 120px;
  text-align: center;
  div {
    color: rgba(0, 0, 0, 0.65);
  }
}

.apps-list-opera {
  margin-bottom: 12px;
  min-height: 40px;
  .input-search {
    width: 240px;
    float: right;
    .close-icon {
      color: rgba(0, 0, 0, 0.25);
      margin-right: 12px;
    }
  }
  .search-size {
    margin-left: 24px;
    vertical-align: bottom;
    display: inline-block;
    color: rgba(0, 0, 0, 0.45);
  }
}
.apps-list-content {
  margin-left: -12px;
  margin-right: -12px;
}
.apps-list .apps-list-opera  .app-icon-plus{
    margin-right: 0 !important;
}
.content-item {
  position: relative;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  width: 172px;
  height: 122px;
  margin: 12px;
  padding-top: 28px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 1);
  // border:1px solid @primary-color;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
  not supported by any browser */
  cursor: pointer;
  &:hover {
    //box-shadow: inset 0 0 0 1px @primary-color, 0px 4px 12px 0px rgba(7, 98, 23, 0.15);
    box-shadow: inset 0 0 0 1px @primary-color;
    .setting {
      visibility: visible;
    }
  }
  &-icon {
    display: inline-block;
    width: 42px;
    height: 42px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
  &-enabled {
    position: absolute;
    width: 54px;
    height: 54px;
    top: -4px;
    left: -4px;
  }
  &-name {
    width: 90%;
    margin: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
  }
  .setting {
    position: absolute;
    z-index: 9;
    top: 8px;
    right: 8px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
    visibility: hidden;
    cursor: pointer;
    &:hover {
      color: @primary-color;
    }
  }
  .isshow {
    visibility: visible !important;
  }
}
</style>
<style lang="less">
.ant-popover.popover {
  z-index: 999;
}
.flip-list-move {
  transition: transform 0.5s;
}
.flip-list-leave {
  opacity: 0;
}
.add-app {
  width: 112px;
  height: 40px;
}
.add-app i {
  margin-right: 8px;
}
.popover {
  cursor: pointer;
}
.popover p:first-child {
  border-top: none;
  border-radius: 4px 4px 0 0;
  &:hover {
    &:before {
      content: "";
      display: block;
      width: 8.5px;
      height: 8.5px;
      transform: rotate(45deg);
      background-color: #e8fcf4;
      position: absolute;
      left: 6px;
      top: 12px;
    }
  }
}
.popover p:last-child {
  border-radius: 0 0 4px 4px;
}
.popover .ant-popover-inner-content {
  padding: 0px;
}
.popover p {
  border-top: 1px solid rgba(0, 0, 0, 0.09);
  padding: 5px 16px;
}
.popover p:hover {
  background-color: #e8fcf4;
}
.red {
  color: #f5222d;
}
.edit-app-drawer {
  .ant-drawer-body {
    position: relative;
    padding: 0;
  }
}

.ant-carousel .slick-track {
  background: white;
}
.ant-carousel .slick-list {
  border-radius: 20px;
}
</style>
