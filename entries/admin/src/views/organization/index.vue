<template>
  <div class="organization">
    <a-layout-sider
      :trigger="null"
      theme="light"
      collapsible
      collapsedWidth="46"
      v-model="isShow"
      class="org-menu"
      width="224"
    >
      <div v-show="!isShow">
        <div
          class="org"
          v-for="item in menus"
          :key="item.code"
          @click="onMouseDown(item)"
          :class="{selected: item.isSelected}"
        >
          <i class="icon aufontAll " :class="item.icon"/>
          <span>{{ $t(item.name) }}</span>
        </div>
      </div>
      <div v-show="isShow">
        <a-tooltip
          placement="right"
          v-for="item in menus"
          :key="item.code"
        >
          <template slot="title">
            {{ $t(item.name) }}
          </template>
          <div
            class="org"
            @mousedown="onMouseDown(item)"
            :class="{selected: item.isSelected}"
          >
            <i class="icon aufontAll " :class="item.icon"/>
          </div>
        </a-tooltip>
      </div>
      <div id="hide-menu" @click="()=> isShow = !isShow">
        <div v-show="!isShow" class="to-left"></div>
        <div v-show="isShow" class="to-right"></div>
      </div>
    </a-layout-sider>
    <div class="router-wrap">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import { State, namespace, Action } from 'vuex-class';

const UserModule = namespace('System/User');

interface MenuItem {
  name: string,
  icon: string,
  code: string,
  isSelected: boolean
}

@Component({
  name: 'organization'
})
export default class organization extends Vue {
  @UserModule.State('isOnlyAppAdmin') isOnlyAppAdmin!: boolean;

  isShow: boolean = false;

  created() {
    const _this = this;
    this.menus.forEach((m) => {
      m.isSelected = false;
      if (_this.$route.name === m.code) {
        m.isSelected = true;
      }
    });
    if(this.isOnlyAppAdmin){
       this.menus = this.menus.slice(0,2)
    }
  }
  menus: Array<MenuItem> = [
    {
      name: 'languages.Organization',
      code: 'orguser',
      icon: 'h-icon-all-department-o',
      isSelected: true
    },
    {
      name: 'languages.OrganizationRole',
      code: 'orgrole',
      icon: 'h-icon-all-team-singlechoice-o',
      isSelected: false
    },
    {
      name: 'languages.OrganizationSync',
      code: 'orgsync',
      icon: 'h-icon-all-sync-o',
      isSelected: false
    }
  ];
  onMouseDown(item: MenuItem) {
    this.menus.forEach((m) => {
      m.isSelected = false;
    });
    item.isSelected = true;
    this.goRouter(item);
  }
  goRouter(item: MenuItem) {
    if (item.code === 'orguser') {
      this.$router.push('orguser');
    } else if (item.code === 'orgrole') {
      this.$router.push('orgrole');
    } else if (item.code === 'orgsync') {
      this.$router.push('orgsync');
    }
  }
}
</script>

<style lang="less" scoped>
.organization{
  background: #fff;
  margin-top: 0px;
  min-width: 1024px;
  position: relative;
  .org-menu {
    width: 224px;
    height: calc(100vh - 64px);
    float: left;
    box-shadow: 1px 0px 0px 0px #e8e8e8;
    position: relative;
    padding-top: 8px;
    z-index: 2;
    #hide-menu {
      position: absolute;
      top: 0px;
      right: -14px;
      width: 14px;
      height: 30px;
      z-index: 9;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      .to-left {
        width: 14px;
        height: 30px;
        background-image: url("../../assets/images/toleft.svg");
        &:after {
          content: "";
          display: block;
          background-image: url("../../assets/images/tolefthover.svg");
        }
        &:hover:after {
          width: 14px;
          height: 30px;
        }
      }
      .to-right {
        width: 14px;
        height: 30px;
        background-image: url("../../assets/images/toright.svg");
        &:after {
          content: "";
          display: block;
          background-image: url("../../assets/images/torighthover.svg");
        }
        &:hover:after {
          width: 14px;
          height: 30px;
        }
      }
      &:hover {
        border-left-color: #c6c6c6;
      }
    }
    .org {
      position: relative;
      height: 40px;
      width: 224px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-left: 16px;
      margin-bottom: 8px;
      cursor: pointer;
      &.selected {
        background: #E8FCF4;
        color: @primary-color;
        transition: none;
        transform: none;
        &::before {
          content: "";
          position: absolute;
          height: 100%;
          width: 0;
          top: 0;
          left: 0;
          border-left: 4px solid @primary-color;
        }
      }
      i {
        margin-right: 9px;
        font-size: 14px;
        height: 14px;
        line-height: 14px;
      }
      &:hover {
        background: #E8FCF4;
      }
    }
  }
  .ant-layout-sider-collapsed {
    .org {
      width: 46px;
    }
  }
  .router-wrap {
    overflow: hidden;
    height: calc(100vh - 64px);
  }
}
</style>
