<template>
  <div class="home">
    <ul
      class="home-nav"
    >
      <router-link
        tag="li"
        v-for="(router, index) in routerList"
        :key="index"
        :to="{ name: router.code }"
      >
        <span
          class="home-nav-router"
          :class="{'home-nav-active': router.code === CurrentTag}"
        >{{ router.name }}</span>
        <label
          v-if="totalItem[router.code]"
          class="home-nav-count"
          :class="{'radius-tip':totalItem[router.code] < 10}"
        >
          <span v-if="totalItem[router.code]>99">
            99+
          </span>
          <span v-else>
            {{ totalItem[router.code] }}
          </span>
        </label>
      </router-link>
    </ul>
    <div class="home-router">
      <router-view @toggle="toggleButtonShow"/>
    </div>
    <div
      class="home-add"
      v-show="showAddButton && !appCode"
      @click="gotoInstance"
    >
      <img src="@/assets/images/add.png">
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import Common from '@cloudpivot/common';

import {
  State, Action, Mutation, namespace
} from 'vuex-class';

const circulateModule = namespace('circulate');
@Component({
  name: 'home',
  components: {
    Empty: Common.components.mobile.Empty
  },
})
export default class Home extends Vue {
  @State('appCode') appCode!: any;

  @circulateModule.State('totalItem') totalItem!: any;

  @circulateModule.Action('getTotalCount') getTotalCount!: any;

  routerList:Array<any> = [];

  showAddButton:boolean = true;

  get CurrentTag() {
    const { name } = this.$route;
    if (name) {
      return name;
    }
    return this.routerList[0].code;
  }

  /**
   * 切换当前悬浮按钮显隐
   */
  toggleButtonShow(show: boolean) {
    this.showAddButton = !show;
  }

  /**
   * 跳转到发起流程
   */
  gotoInstance() {
    this.$router.push({ name: 'initial-instance' });
  }

  mounted() {
    this.routerList = [
      {
        name: this.$t('languages.common.todo'),
        code: 'workitems',
      },
      {
        name: this.$t('languages.common.toread'),
        code: 'circulates',
      },
      {
        name: this.$t('languages.common.done'),
        code: 'finished-workitems',
      },
      {
        name: this.$t('languages.common.read'),
        code: 'finished-circulates',
      }
    ];
    this.getTotalCount(this.appCode);
  }
}
</script>
<style lang="less" scoped>
@import '~@/styles/mixins.less';
@nav-height: 84px;
@add-btn-size: 100px;
@btn-padding-bottom: 40px;
@count-width: 44px;
@count-height: 34px;
@marign-left: 14px;
.home{
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  &-nav{
    display: flex;
    flex: none;
    background: @white-background;
    .backgroundline('bottom');
      li{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        .home-nav-router{
          display: inline-block;
          .px2rem(height,@nav-height);
          .px2rem(line-height,@nav-height);
          .px2rem(font-size,30px);
          font-weight:400;
        }
        .home-nav-active{
          position: relative;
          color: @text-color-selected;
          font-weight: 500;
          &:after{
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 0;
            border-bottom: 3px solid @primary-color;
          }
        }
        .home-nav-count{
          display:flex;
          align-items: center;
          justify-content: center;
          .px2rem(margin-left,10px);
          .px2rem(padding-left, 10px);
          .px2rem(padding-right, 10px);
          .px2rem(min-width,@count-width);
          .px2rem(height,@count-height);
          // border-radius: 42%;
          .px2rem(border-radius, 17px);
          background-color: #F4454E;
          box-sizing: border-box;
          overflow: hidden;
          span{
            display: inline-block;
            vertical-align: middle;
            color: white;
          }
        }
        .radius-tip{
          .px2rem(width,34px);
          .px2rem(height,34px);
          border-radius: 50%;
        }

      }
  }
  &-router{
    flex: 1;
    overflow-y: auto;
  }
  &-add{
    position: fixed;
    z-index: 9;
    .px2rem(right,@btn-padding-bottom);
    .px2rem(bottom,130px);
    img{
    .px2rem(height,@add-btn-size);
    .px2rem(width,@add-btn-size);
    }
  }
}
</style>
