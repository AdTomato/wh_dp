<template>
  <div class="app-header">
    <a-menu
      mode="horizontal"
      :defaultSelectedKeys="defaultSelectedKeys"
    >
      <a-menu-item key="appHome" @click="onClickAppRouter">
        <router-link :to="`/app-home?appCode=${appCode}`">
          首页
        </router-link>
      </a-menu-item>
      <a-menu-item key="divider">
        <a-divider type="vertical"></a-divider>
      </a-menu-item>
      <a-menu-item key="appToDo" @click="onClickAppRouter">
        <router-link :to="`/app-todo?appCode=${appCode}`">
          我的待办
          <a-badge :count="toDo" :overflowCount="99"/>
        </router-link>
      </a-menu-item>
      <a-menu-item key="appToRead" @click="onClickAppRouter">
        <router-link :to="`/app-toread?appCode=${appCode}`">
          我的待阅
          <a-badge :count="toRead" :overflowCount="99"/>
        </router-link>
      </a-menu-item>
      <a-menu-item key="appDone" @click="onClickAppRouter">
        <router-link :to="`/app-done?appCode=${appCode}`">
          我的已办
        </router-link>
      </a-menu-item>
      <a-menu-item key="appReaded" @click="onClickAppRouter">
        <router-link :to="`/app-readed?appCode=${appCode}`">
          我的已阅
        </router-link>
      </a-menu-item>
    </a-menu>
    <div
      class="slider"
      :style="{ width: `${colorBlock.width}px`, transform: `translate3d(${colorBlock.left}px, 0, 0)`}" 
    ></div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  Menu, Badge, Divider
} from 'h3-antd-vue';

import { workflowCenterApi } from '@cloudpivot/api';

// import common from '@cloudpivot/common';

// const { parseUrlParam } = common.utils;

/**
 * 高亮滑块的样式
 * */ 
interface ClockBlock {
  width: number,
  left: number
}

@Component({
  name: 'app-header',
  components: {
    AMenu: Menu,
    AMenuItem: Menu.Item,
    ABadge: Badge,
    ADivider: Divider
  }
})
export default class AppHeader extends Vue {
  toDo: number = 0;

  toRead: number = 0;

  defaultSelectedKeys: Array<string> = [];

  colorBlock:ClockBlock = {
    width: 0,
    left: 0
  }

  get appCode() {
    return window.Environment.appCode
  }

  mounted(){
    this.initSlider();
  }

    /**
   * 初始化滑块
   * */ 
  initSlider(target?:any){
    this.$nextTick(() => {
      let curRouteDom:HTMLElement;
      if (target) {
        curRouteDom = target.parentNode as HTMLElement
      } else {
        const _targetADom = document.querySelector('.app-header li a.router-link-active') as HTMLElement;
        if (_targetADom) {
          curRouteDom = _targetADom.parentNode as HTMLElement;
        } else {
          curRouteDom = document.querySelector('.app-header > ul > li.ant-menu-item.ant-menu-item-selected') as HTMLElement;
        }
        
      }
      
      if (!curRouteDom) return;
      // 1. 获取当前路由节点的宽度      
      const curRouteDomWidth:number = curRouteDom.clientWidth as number;
      
      // 2. 获取当前路由节点的偏移
      const curRouteDomOffsetLeft:number = curRouteDom.offsetLeft as number;

      this.colorBlock.width = curRouteDomWidth; // 添加宽度
      this.colorBlock.left = curRouteDomOffsetLeft; // 往左偏移以居中
    });
  }

  // 根据当前路由判断当前选中
  setDefaultSelectedKeys() {
    let { name } = this.$route;
    if (!name) return;
    if (name === 'appList') {
      name = 'appHome';
    }
    this.defaultSelectedKeys = [name];
  }

  /**
   * 获取代码待阅条数
   */
  async getTodos() {
    const res = await workflowCenterApi.getWorkCount(this.appCode);
    if (res.errcode === 0) {
      this.toDo = res.data.workItemCount;
      this.toRead = res.data.circulateItemCount;
    }
  }

  beforeMount() {
    this.setDefaultSelectedKeys();
  }

  created() {
    // 获取appCode
    // this.appCode = parseUrlParam(window.location.href, 'appCode') || this.curAppCode || '';
    // if (this.appCode && !this.curAppCode) {
    //   this.setAppCode(this.appCode);
    // }
    this.getTodos();
  }

  onClickAppRouter(e:any){
    const { target } = e.domEvent;
    this.initSlider(target)
  }
}

</script>
<style lang='less' scoped>
@import "../../styles/themes/default.less";
.app-header {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  height: 48px;
  background: @white-background;
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
  /deep/ .ant-menu {
    width: 100%;
    padding-left: @base4-padding-sm;
  }
  /deep/ .ant-menu-horizontal {
    border-bottom: none;
    box-shadow:0px 2px 8px 0px rgba(30,85,255,0.1);
  }
  /deep/ .ant-menu-item,
  /deep/ .ant-menu-item-selected {
    margin: 0 12px;
    padding: 0;
    border: none;
  }
  /deep/ .ant-menu-item {
    a {
      position: relative;
      text-align: center;
      cursor: pointer;
      // &.router-link-active {
      //   &::after {
      //     position: absolute;
      //     content:'';
      //     bottom: 0;
      //     left: 0;
      //     width: 100%;
      //     height: 0;
      //     border-bottom: 3px solid @primary-color;
      //   }
      // }
      /deep/ .ant-badge{
        margin-left: 0;
        margin-top: -2px;
        height: auto;
        vertical-align: middle!important;
      }
      /deep/ .ant-badge-count {
        height: 16px;
        line-height: 16px;
      }
    }
    &:first-child {
      font-size: 16px;
      font-weight: 600;
    }
  }
  /deep/ .ant-divider-vertical {
    margin: 0;
  }
}

</style>
