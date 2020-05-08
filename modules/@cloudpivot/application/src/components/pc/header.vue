<template>
  <ul class="application-menu">
    <li @click="setSliderPos">
      <router-link to="/workflow-center">{{ $t('languages.common.workflowCenter') }}</router-link>
    </li>
    <li 
      v-for="(app, index) in appList" 
      :key="index" 
      @click="onClickAppRouter(app)"
      :class="temAppList.length > 6 && index === appList.length - 1 ? 'last-menu' : ''"
    >
      <router-link :to="'/application/' + app.code">
        <span
          :title="isChinese ? app.name : app.name_i18n[$i18n.locale]"
        >{{ isChinese ? app.name : app.name_i18n[$i18n.locale] }}</span>
      </router-link>
    </li>
    <li class="more" v-if="isShowMoreApps">
      <a-dropdown :trigger="['hover']" @visibleChange="visibleChange" v-model="visible">
        <i class="icon aufontAll h-icon-all-appstore" :class="isIconActive ? 'active' : ''"></i>
        <div
          class="apps-box"
          slot="overlay"
          :style="{ minHeight: appListExtra.length <= 0 ? `${minHeight}px` : 'unset' }"
        >
          <div class="search-box">
            <a-input 
              :placeholder="$t('cloudpivot.application.pc.inputAppName')"
              v-model="keyword"
              style="width: 300px"
              allowClear
              @pressEnter="searchApp">
              <a-icon 
                v-show="keyword"
                slot="suffix"
                type="close-circle"
                @click="clear"
              />
              <a-icon
                slot="suffix"
                type="search"
                @click="searchApp"
              />
            </a-input>
          </div>

          <p class="no-result" v-if="appListExtra.length <= 0">{{ $t('cloudpivot.application.pc.noResult', { keyword: keyword })  }}</p>

          <ul class="clearfix" v-else>
            <li 
              v-for="(app, index) in appListExtra" 
              :key="index" 
              @click="closeDropdown(app)"
            >
              <router-link :to="'/application/' + app.code">
                <div class="apps-item" :title="isChinese ? app.name : app.name_i18n[$i18n.locale]">
                  <div class="app-img">
                    <!-- <img :src="app.logoUrl ? logoUrl : defaultIcon"> -->

                    <template v-if="app.content">
                      <img :src="'data:image/png;base64,'+app.content" />
                    </template>
                    <template v-else-if="app.logoUrl">
                      <img v-if="app.logoUrl.indexOf('http') > -1" :src="app.logoUrl" />
                      <img v-else :src="getDownloadUrl(app.logoUrl)" />
                    </template>
                    <img v-else :src="defaultIcon" />
                  </div>
                  <!-- <div class="app-name" v-html="app.displayName">{{ isChinese ? app.name : app.name_i18n[$i18n.locale] }}</div> -->
                  <div class="app-name" v-html="app.displayName"></div>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </a-dropdown>
    </li>

    <div
      class="slider" 
      :style="{ width: `${colorBlock.width}px`, transform: `translate3d(${colorBlock.left}px, 0, 0)`, opacity: colorBlock.opacity }"></div>
  </ul>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  Dropdown, Input, Icon
} from 'h3-antd-vue';

import {
  Mutation, namespace
} from 'vuex-class';

import common from '@cloudpivot/common';

const Bus: any = common.utils.Bus;

import { listApi, listParams } from '@cloudpivot/api';

import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

const icon = require('./assets/appicon.svg');

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');
const SystemModule = namespace('System/System');

/**
 * 高亮滑块的样式
 * */ 
interface ClockBlock {
  width: number,
  left: number,
  opacity: number
}

@Component({
  name: 'common-header',
  components: {
    ADropdown: Dropdown,
    AInput: Input,
    AIcon: Icon
  }
})

export default class CommonHeader extends Vue {
  @WorkflowCenterModule.Mutation('setAsideTitle') setAsideTitle: any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  // 更多应用图标是否高亮
  isActive: boolean = true;

  // 是否显示更多应用下拉
  isShowMoreApps: boolean = false;

  // 更多应用默认图标
  defaultIcon: string = icon;

  // 头7个应用
  appList: Array<listParams.List> = [];

  // 放在下拉列表中的应用
  appListExtra: Array<listParams.List> = [];

  // 保存一份下拉列表中的应用的数据以供搜索使用
  appListExtraCopy: Array<listParams.List> = [];

  // 暂存所有列表
  temAppList: Array<listParams.List> = [];

  // 用户信息
  userInfo: any = {}

  // 更多图标
  isIconActive: boolean = false

  portalHost:string = '';

  visible:boolean = false

  keyword:string = '' // 搜索关键字

  minHeight:number = 0; // 下拉框高度

  singleRowHeight:number = 62; // 单行高度
  searchBoxHeight:number = 48; // 搜索部分高度
  boxPadding:number = 24; // 容器内边距

  colorBlock:ClockBlock = { width: 0, left: 0, opacity: 1 }

  get apiHost(){
    return (window as any).config.apiHost
  }

  get token(){
    return window.localStorage.getItem('token');
  }

  getDownloadUrl(refId:string){
    let url = `${this.apiHost}/api/aliyun/download?refId=${refId}`;
    if(this.token){
      url += '&access_token=' + this.token;
    }
    return url;
  }

  async created() {
    await this.init();  

    this.initSlider();

  }

  async init(){
    await this.getAppList();

    // 获取当前选中的菜单名称
    const { appCode } = this.$route.params;
    this.temAppList.forEach((app: any) => {
      if (appCode === app.code) {
        this.setAsideTitle(app);
        console.log(app.name);
      }
    });
    let config: any = {};
    if (this.$store && this.$store.state) {
      config = this.$store.state.config;
      this.portalHost = `${config.pcServerUrl}/`;
    }

    // 初次加载是否显示更多按钮高亮
    const isExistInExtraApp:number = this.appListExtra.findIndex((app:any) => app.code === appCode) as number;
    this.isIconActive = isExistInExtraApp > -1;
  }

  /**
   * 初始化滑块
   * */ 
  initSlider(){
    this.$nextTick(() => {
      this.colorBlock.opacity = 1;
      const curRouteDom:HTMLElement = document.querySelector('.application-menu li a.router-link-active') as HTMLElement;
      if (!curRouteDom) return;
      // 1. 获取当前路由节点的宽度
      const curRouteDomWidth:number = curRouteDom.clientWidth as number;
      
      // 2. 获取当前路由节点的偏移
      const curRouteDomOffsetLeft:number = curRouteDom.offsetLeft as number

      this.colorBlock.width = curRouteDomWidth + 14; // 添加宽度
      this.colorBlock.left = curRouteDomOffsetLeft - 7; // 往左偏移以居中
    });
  }

  onClickAppRouter(app){
    this.isIconActive = false;
    this.initSlider();
    this.setAsideTitle(app);
  }

  /**
   * router change 时滑块移动不够顺滑，故使用点击事件
   * 点击菜单赋值滑块位置
   * */ 
  setSliderPos(e:Event){
    this.isIconActive = false;
    this.colorBlock.opacity = 1;
    const curDom:any = e.target as any;
    this.colorBlock.width = curDom.clientWidth + 14; // 添加宽度
    this.colorBlock.left = curDom.offsetLeft - 7; // 往左偏移以居中
  }

  // 下拉展开收起状态跟踪
  visibleChange(visiable: any) {
    if (!visiable) {
      setTimeout(() => {
        this.appListExtra = this.appListExtraCopy;
        this.keyword = '';
      }, 500);
    }
  }

  clear(){
    this.keyword = '';
  }

  /*
  * 搜索下拉应用列表
  */ 
  searchApp(){
    const { keyword } = this;
    if (keyword === '') {
      this.appListExtra = this.appListExtraCopy;
    } else {
      this.appListExtra = this.appListExtraCopy.filter((list:any) => {
        const name:string = this.isChinese ? list.name : list.name_i18n[this.$i18n.locale];
        return name.toLowerCase().includes(keyword.toLowerCase());
      });
    }

    this.setSearchHighLight();
  }

  /**
   * 设置搜索高亮
  */ 
  setSearchHighLight(){
    this.appListExtra.forEach((list:any) => {
      const key:string = this.isChinese ? list.name : list.name_i18n[this.$i18n.locale]
      list.displayName = utils.searchHighLight(this.keyword, key);
    });
  }

  /*
  * 点击应用关闭
  */
  closeDropdown(app:any){
    this.colorBlock.opacity = 0;
    this.visible = false;
    this.isIconActive = true;
    this.setAsideTitle(app)
  }

  // 加载应用列表
  async getAppList() {

    const res = await listApi.list({ isMobile: false });

    if (res.data.length <= 0) return;

    // 初始化国际化，兼容老数据
    // 添加一个displayName
    if (Array.isArray(res.data)) {
      res.data.forEach((data: any) => {
        common.utils.compatible(data, 'name');
        data.displayName = this.isChinese ? data.name : data.name_i18n[this.$i18n.locale];
      });
    }

    this.temAppList = res.data;

    if (res.data.length <= 6) {
      this.appList = res.data;
      this.appListExtra = [];
      this.appListExtraCopy = [];
      this.isShowMoreApps = false;
    } else {
      this.appList = res.data.slice(0, 5);
      this.appListExtra = res.data.slice(5, res.data.length);
      this.appListExtraCopy = JSON.parse(JSON.stringify(this.appListExtra));
      this.isShowMoreApps = true;

      const rows:number = this.appListExtra.length <= 4  ? 1 : Math.ceil(this.appListExtra.length / 4);
      const _h:number = rows * this.singleRowHeight + this.searchBoxHeight + this.boxPadding;
      this.minHeight = _h >= 396 ? 396 : _h;
    }

  }

  @Watch('$route')
  onRouteChange() {
  }

  @Watch('keyword')
  onKeywordChange() {
    this.searchApp();
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.init();
  }
}
</script>
<style lang="less" scoped>
  .application-menu {
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    .slider {
      position: absolute;
      bottom: 0;
      left: 0px;
      width: 0;
      height: 3px;
      border-radius: 2px;
      background: @primary-color;
      transition:  all ease .3s;
    }
    li {
      margin-right: @base4-padding-lg * 2;
      &.last-menu {
        margin-right: 0px;
      }
      a {
        font-size: @font-size-14;
        color: @light-color-1;
        text-decoration: none;
        position: relative;
        display: block;
        line-height: 64px;
        span {
          max-width: 7em;
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        &:hover {
          color: @primary-color;
        }
        &.router-link-active {
          color: @primary-color;
          // &::after {
          //   content: "";
          //   display: block;
          //   position: absolute;
          //   left: -7px;
          //   bottom: 1px;
          //   width: calc(100% + 14px);
          //   height: 3px;
          //   border-radius: 2px;
          //   background: @primary-color;
          // }
        }
      }
      &.more {
        position: relative;
        height: 64px;
        width: 80px;
        text-indent: 48px;
        margin-right: 20px;
        cursor: pointer;
        .icon {
          display: block;
          height: 100%;
          line-height: 64px;
          color: @light-color-3;
          &.active,
          &:hover {
            color: @primary-color;
          }
        }
        &.active {
          color: @primary-color;
          &::after {
            content: "";
            display: block;
            position: absolute;
            left: -7px;
            width: calc(100% + 14px);
            height: 3px;
            border-radius: 2px;
            background: @primary-color;
          }
        }
      }
    }
  }

  .apps-box {
    width: 100%;
    width: 702px;
    height: 100%;
    max-height: 396px;
    overflow: auto;
    background-color: @white-background;
    box-shadow: 0px 2px 8px 0px rgba(30, 85, 255, 0.15);
    padding: @base4-padding-sm;
    border-radius: 5px;
    & > .no-result {
      text-align: center;
      margin-top: 32px;
    }
    & > .search-box {
      text-align: center;
      margin-bottom: 16px;
      /deep/.ant-input-suffix i.anticon {
        cursor: pointer;
        margin-left: 8px;
        &.anticon-close-circle {
          opacity: 0.25;
        }
      }
    }
    & > ul > li {
      float: left;
      width: 165px;
      border: 1px solid white;
      transition: all ease 0.3s;
      &:hover {
        border-color: rgba(177, 187, 197, 0.5);
      }
      & > a > .apps-item {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: @base4-padding-sm;
        .app-img > img {
          width: 36px;
          height: 36px;
          margin-right: @base4-padding-xs;
        }
        .app-name {
          max-width: 7em;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: @light-color-1;
        }
      }
      & > a.router-link-active .app-name {
        color: @primary-color;
      }
    }
  }
  /*ie11 css hack*/ 
  @media all and (-ms-high-contrast:none) { 
    .apps-box {
      padding-right: 0;
    }
  }
</style>
