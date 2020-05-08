<template>
  <div class="sider">
    <a-layout-sider
      :trigger="null"
      theme="light"
      collapsible
      collapsedWidth="46"
      v-model="isShow"
      class="sider__menu"
      width="224"
    >
      <div v-show="!isShow">
        <div
          class="sider__items"
          v-for="item in menus"
          :key="item.code"
          @click="onMouseDown(item)"
          :class="{selected: item.isSelected}"
        >
          <i class="icon aufontAll" :class="item.icon"/>
          <span>{{ $t(item.name) }}</span>
        </div>
      </div>
      <div v-show="isShow">
        <a-tooltip
          placement="right"
          v-for="item in menus"
          :key="item.code"
        >
          <template slot="title">{{ $t(item.name) }}</template>
          <div
            class="sider__items"
            @mousedown="onMouseDown(item)"
            :class="{selected: item.isSelected}"
          >
            <i class="icon aufontAll" :class="item.icon"/>
          </div>
        </a-tooltip>
      </div>
      <div id="hide-menu" @click="()=> isShow = !isShow">
        <div v-show="!isShow" class="to-left"></div>
        <div v-show="isShow" class="to-right"></div>
      </div>
    </a-layout-sider>
    <div class="sider__view">
      <router-view/>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

interface MenuItem {
  name: string,
  icon: string,
  code: string,
  isSelected: boolean
}

@Component({
  name: 'side-layout',
  components: {}
})
export default class SideLayout extends Vue {
  @Prop({ default: [] }) list!: Array<MenuItem>;

  menus: Array<MenuItem> = this.list;

  isShow: boolean = false;

  created() {
    const vm = this;
    vm.menus = vm.list;
    vm.menus.forEach((m) => {
      m.isSelected = false;
      if (vm.$route.name === m.code) {
        m.isSelected = true;
      }
    });
  }

  onMouseDown(item: MenuItem) {
    this.menus.forEach((m) => {
      m.isSelected = false;
    });
    item.isSelected = true;
    this.$emit('onRoute', item);
  }
}
</script>
<style lang="less" scoped>
.sider {
  background: #fff;
  margin-top: 0px;
  position: relative;
  &__menu {
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
        background-image: url("~@/assets/images/toleft.svg");
        &:after {
          content: "";
          display: block;
          background-image: url("~@/assets/images/tolefthover.svg");
        }
        &:hover:after {
          width: 14px;
          height: 30px;
        }
      }
      .to-right {
        width: 14px;
        height: 30px;
        background-image: url("~@/assets/images/toright.svg");
        &:after {
          content: "";
          display: block;
          background-image: url("~@/assets/images/torighthover.svg");
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
    .sider__items {
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
    .sider__items {
      width: 46px;
    }
  }
  &__view {
    overflow: hidden;
    height: calc(100vh - 64px);
  }
}
</style>
