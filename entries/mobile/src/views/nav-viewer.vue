<template>
  <div class="nav-viewer">
    <div :class="['nav-viewer__box',{'normal': !showNav}]">
      <router-view class="nav-viewer__wrap"/>
    </div>

    <div class="nav-viewer__bar" v-show="showNav">
      <router-link to="/home" tag="div">
        <span>
          <i class="icon aufontAll h-icon-all-home-o"></i>
          <i class="icon active aufontAll h-icon-all-home"></i>
        </span>
        <p>{{ $t('languages.common.homePage') }}</p>
      </router-link>
      <router-link to="/apps" tag="div">
        <span>
          <i class="icon aufontAll h-icon-all-appstore-o"></i>
          <i class="icon active aufontAll h-icon-all-appstore"></i>
        </span>
        <p>{{ $t('languages.common.apps') }}</p>
      </router-link>
      <router-link to="/my-instances" tag="div">
        <span>
          <i class="icon aufontAll h-icon-all-process-o"></i>
          <i class="icon active aufontAll h-icon-all-process"></i>
        </span>
        <p>{{ $t('languages.common.workflows') }}</p>
      </router-link>

      <router-link
        to="/setting"
        tag="div"
        v-if="isShowSetting"
      >
        <span>
          <i class="icon aufontAll h-icon-all-setting-o"></i>
          <i class="icon active aufontAll h-icon-all-setting"></i>
        </span>
        <p>{{ $t('languages.common.settings') }}</p>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { utils } from '@cloudpivot/common';

@Component({
  name: 'NavViewer'
})
export default class NavViewer extends Vue {
  // 是否展示底部导航栏
  showNav: boolean = true;

  get isShowSetting() {
    return this.$store.state.config.multiLanguageSwitch;
  }

  mounted() {
    utils.Bus.$on('toggleNavbar', (val: boolean) => {
      this.showNav = val;
    });
  }

  beforeDestroy() {
    utils.Bus.$off('toggleNavbar');
  }
}
</script>

<style lang="less">
@import "~@/styles/index.less";
@foot-height: 100px;
.nav-viewer {
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  background: @main-background;
  &__box {
    flex: 1;
    height: 100%;
    .px2rem(padding-bottom, @foot-height);
    overflow: hidden;
    &.normal {
      padding-bottom: 0;
    }
  }
  &__wrap {
    height: inherit;
    overflow-y: auto;
  }
  // todo ios flex布局在iOS上点击透传兼容问题，目前用absolute避免；
  .nav-viewer__bar {
    position:absolute;
    z-index: 10;
    bottom: 0;
    display: flex;
    align-items: center;
    width: 100%;
    .px2rem(height, @foot-height);
    font-weight: 400;
    background: @white-background;
    z-index: 10;
    .backgroundline("top");
    & > div > p {
      .px2rem(font-size, 20px)!important;
    }
    div {
      // .px2rem(padding-top, @vertical-padding-md);
      // .px2rem(padding-bottom, @vertical-padding-md);
      flex: 1;
      display: block;
      text-align: center;
      font-weight: bold;
      color: #2c3e50;
    }
    span {
      display: inline-block;
      .px2rem(min-height, @line-height-xxs);
    }
    i {
      .px2rem(font-size, @line-height-xxs);
      &.active {
        display: none;
      }
    }
    .router-link-active {
      i {
        display: none;
      }
      i.active {
        display: inline-block;
      }
      color: @primary-color;
    }
  }
}
</style>
