<template>
  <div class="section-bar">
    <span class="bar-title title-2">{{ $t('languages.Apps.ListDisplay') }}</span>
    <!-- 弹窗: 过滤条件更新提醒 -->
    <span class="bar-right">
      <span class="bar-filter">
        <a-popover
          placement="bottom"
          :visible="isShowPop"
          overlayClassName="filter-tips"
        >
          <template slot="content">
            <p class="text">点击图标可查看刚刚添加的查询条件哦~</p>
            <p class="ok" @click="hidePopover">知道了</p>
          </template>
          <i
            class="icon aufontAll  h-icon-all-filter-o"
            :class="{'high-light': isShowFilterBox}"
            @click="isShowFilterBox = !isShowFilterBox"></i>
        </a-popover>
      </span>
      <span
        v-for="(el, index) in list"
        :key="index"
      >
        <a-button type="default">{{ isChinese ? el.name : el.name_i18n[$i18n.locale] }}</a-button>
      </span>
    </span>
    <!-- 弹窗: 过滤条件预览 -->
    <div class="filter-box" v-show="isShowFilterBox">
      <QueryCrieria></QueryCrieria>
      <div class="filter-mask" @click="isShowFilterBox = false"></div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import QueryCrieria from '@/components/apps/list-design/query-criteria.vue';
const ListdesignModule = namespace('Apps/Listdesign');


@Component({
  name: 'TableBar',
  components: {
    QueryCrieria
  }
})
export default class TableBar extends Vue {
  @ListdesignModule.State('operationAarry') operationAarry: any;

  @ListdesignModule.State('isShowPop') isShowPop: any;

  @ListdesignModule.Mutation('setShowPop') setShowPop: any;

  list:any[] = [];

  isShowFilterBox:boolean = false;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  hidePopover() {
    this.setShowPop(false);
  }

  @Watch('operationAarry')
  setOperationAarry(v:any) {
    //
    this.list = v.map((pl:any) =>
      // if (pl.data && typeof pl.data.name !== 'undefined') {
      //   pl.name = pl.data.name;
      // }
      pl).filter((el:any) => el.checked === true);
  }
}
</script>

<style lang="less">
.design-wrapper{
  .bar-right{
    flex: 1;
    display: flex;
    justify-content: flex-end;
    .bar-filter{
      vertical-align: middle;
      line-height: 32px;
      margin-right: 8px;
      cursor: pointer;
      .icon:hover {
        color: @primary-color;
      }
      .high-light{
        color: @primary-color;
      }
    }
  }
  .filter-box{
    position: absolute;
    top: 56px;
    width: calc(100% + 32px);
    margin-left: -16px;
    z-index: 666;
    margin-top: -8px;
    .content-box{
      padding: 10px 16px;
      box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.15);
      border-radius: 4px;
      background: #fff;
      max-height: 510px;
      overflow-y: auto;
      z-index: 9;
    }
  }
}
.filter-tips{
  .ant-popover-inner{
    height: 106px;
    .text{
      color: rgba(0,0,0,0.65);
      margin-top: 8px;
      margin-bottom: 18px;
    }
    .ok{
      color: @primary-color;
      cursor: pointer;
      text-align: right;
    }
  }
}
.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
</style>
