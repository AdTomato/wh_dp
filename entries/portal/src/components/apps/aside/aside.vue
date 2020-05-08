<template>
  <aside class="aside">
    <a-layout-sider
      ref="slider"
      :trigger="null"
      theme="dark"
      collapsible
      collapsedWidth="52"
      v-model="isShow"
      class="aside-menu"
      width="200"
    >
      <div :class="isShow ? 'aside-top hide-text' : 'aside-top'" v-if="curMenu === 'WorkflowCenterMenu'">{{ $t('languages.common.workflowCenter') }}</div>
      <div
        :class="isShow ? 'aside-top hide-text' : 'aside-top'"
        v-else
        :title="isChinese ? menuTitle : menuTitleI18n[$i18n.locale]"
      >{{ isChinese ? menuTitle : menuTitleI18n[$i18n.locale] }}</div>
      <component :is="curMenu"/>
      <!-- <workflow-center-menu/> -->
      <!-- <apps-menu/> -->
      <div :class="isShow ? 'hide-menu' : 'hide-menu open'" @click="isShow = !isShow"></div>
    </a-layout-sider>
  </aside>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  Layout
} from 'h3-antd-vue';

import {
  Mutation, namespace
} from 'vuex-class';

import * as FlowCenter from '@cloudpivot/flow-center';

import * as Application from '@cloudpivot/application';

// import AppsMenu from './menu/apps-menu.vue';

import common from '@cloudpivot/common';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: 'Aside',
  components: {
    ALayoutSider: Layout.Sider,
    WorkflowCenterMenu: FlowCenter.components.pc.WorkflowCenterMenu,
    AppsMenu: Application.components.pc.AppsMenu
  }
})
export default class Aside extends Vue {
  @WorkflowCenterModule.State('asideTitle') asideTitle:any;

  @WorkflowCenterModule.State('asideTitleI18n') asideTitleI18n:any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  // false 展开 true收起
  isShow: boolean = false;

  curMenu:string = 'WorkflowCenterMenu';

  menuTitle:string = '流程中心';

  menuTitleI18n:any = {};

  mounted() {
    this.switchMenu();
    const curDom:any = this.$refs.slider;
    curDom.$el.addEventListener('transitionend', (e:any) => {
      if (e.propertyName === 'max-width') {
        common.utils.Bus.$emit('resize');
      }
    }, false);
  }

  beforeDestroy() {
    const curDom:any = this.$refs.slider;
    curDom.$el.removeEventListener('transitionend', (e:any) => {
      if (e.propertyName === 'max-width') {
        common.utils.Bus.$emit('resize');
      }
    }, false);
  }

  // 切换菜单
  switchMenu() {
    if (!this.$route) return;
    const { fullPath } = this.$route;
    const isWorkflowCenterRoute = fullPath.includes('workflow-center');
    const isApplicationRoute = fullPath.includes('application');
    if (isWorkflowCenterRoute) {
      this.curMenu = 'WorkflowCenterMenu';
    } else if (isApplicationRoute) {
      this.curMenu = 'AppsMenu';
      this.menuTitle = this.asideTitle;
      this.menuTitleI18n = this.asideTitleI18n;
    }
  }

  @Watch('$route')
  onRouterChange() {
    this.switchMenu();
  }

  @Watch('asideTitle')
  onAsideTitleChange(v:any) {
    if (v) {
      this.menuTitle = v;
    }
  }

  @Watch('asideTitleI18n')
  onAsideTitleI18nChange(v:any) {
    if (v) {
      this.menuTitleI18n = v;
    }
  }
}
</script>

<style lang="less">
@import '../../../styles/themes/default.less';
.aside {
  height: 100%;
  position: relative;
  overflow-y: scroll;
  background: #001529;
  &::-webkit-scrollbar {
    width: 0;
  }
  .aside-menu {
    height: calc( 100vh - 64px );
  }
  .aside-top {
    width: 100%;
    height: 50px;
    overflow: hidden;
    padding: 0 14px 0 @base4-padding-xs;
    line-height: 50px;
    text-align: center;
    color: rgba(255, 255, 255, 0.5);
  }
  .hide-text {
    text-indent: -999px;
  }

  .hide-menu {
    width: 14px;
    height: 28px;
    line-height: 28px;
    border-radius: 2px 0px 0px 2px;
    position: absolute;
    top: 10px;
    right: 0;
    background: url('../../../assets/icons/arrow-right.png') no-repeat center;
    background-color: rgba(255, 255, 255, 0.3);
    cursor: pointer;
  }
  .open {
    background: url('../../../assets/icons/arrow-left.png') no-repeat center;
    background-color: rgba(255, 255, 255, 0.3);
  }
}
.ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
  background-color: unset;
  a {
    color: white!important;
    .icon {
      margin-right: @base4-padding-xs;
    }
  }
}
.ant-menu-item > a {
  & >.icon, & > span {
    height: 40px;
  vertical-align: top!important;
  }
  }
.ant-menu-inline-collapsed-tooltip a {
    color: white!important;
    .icon {
      margin-right: @base4-padding-xs;
    }
    .ant-badge{
      margin-bottom: 3px;
    }
}

// .ant-layout-sider-children {
//   margin-left: 4px;
// }
</style>
