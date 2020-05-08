
<template>
  <div class="list-preview">
    <div class="header">
      <div class="left">{{ $t('languages.Apps.ListPreview') }}</div>
      <div @click="switchView('PC')" :class="{ selected : view === 'PC' }">{{ $t('languages.Apps.PC') }}</div>
      <div @click="switchView('APP')" :class="{ selected : view === 'APP' }">移动端</div>
      <div class="right">
        <!-- <span @click="hidePreview" class="hide-preview icon aufontAll">&#xe8e7;</span> -->
        <div class="hide-preview" @click="hidePreview">
          <i class="icon aufontAll h-icon-all-close"></i>
          <span>关闭</span>
        </div>
      </div>
    </div>

    <!-- pc列表 -->
    <div class="list" v-if="view === 'PC'">
      <list-selector
        :listCode="listCode"
        :schemaCode="schemaCode"
        :isPreview="true"
        :showActions="true"
        :selectable="false"
      ></list-selector>
    </div>

    <!-- 移动端列表 -->
    <div class="mobile-list" v-else>
      <MobileList
        :listCode="listCode"
        :schemaCode="schemaCode"
        :isPreview="true"
        :propDataList="quertColumns"
      ></MobileList>
    </div>
  </div>
</template>


<script lang='ts'>
import { Component, Vue, Prop, Provide } from 'vue-property-decorator';

import ListSelector from './list-selector.vue';
import MobileList from '@/components/apps/list-design/mobile-list.vue';

import * as listApi from '@/apis/list';

@Component({
  name: 'list-preview',
  components: {
    ListSelector,
    MobileList
  },

  // beforeRouteEnter(to, from, next) {
  //   next((vm) => {
  //     (vm as ListPreview).load();
  //   });
  // },

  // beforeRouteUpdate(to, from, next) {
  //   const vm = this as ListPreview;
  //   // vm.clean();
  //   next();
  //   vm.load();
  // }
})
export default class ListPreview extends Vue {
  @Prop() curview!: any;

  view = 'PC';

  listCode = '';

  schemaCode = '';

  quertColumns:any = [];

  @Provide() getScrollEl() {
    // return this.$el
  }

  mounted() {
    this.listCode = this.$route.params.code;
    this.schemaCode = this.$route.params.bizSchemaCode;
    this.view = this.curview;
  }

  switchView(type : string) {
    this.view = type;
  }

  hidePreview() {
    this.$emit('hidePreview');
  }
}
</script>


<style lang="less" scoped>

.list-preview{
  height: 100%;
}

.container{
  top: 0 !important;
}

.list{
  height: calc(100% - 88px);
  margin: 8px 16px 16px 16px;
}

.mobile-list{
  height: calc(100% - 88px);
  margin: 8px 16px 16px 16px;
  background: #F4F6FC;
}

.actions{
    padding:8px 0;
    text-align:left;

    & > button{
        margin-left: 8px;
    }
}

.table-wrap{
  overflow: auto;
  text-align: left;
  padding: 8px 0;
  /deep/.ant-table-thead > tr > th,
  /deep/.ant-table-tbody > tr > td{
    padding: 8px 10px;
  }

  /deep/.ant-table-thead > tr > th {
    color:rgba(0,0,0,0.45);
    position: relative;
    padding-left: 10px;
    background-color:#F4F6FC;
    font-weight: 400;

    &:not(:first-child)::after{
      content:" ";
      width: 1px;
      height: 20px;
      left:0;
      position: absolute;
      background-color: #EAEDF3;
    }

  }
}

.header{
  display: flex;
  justify-content: center;
  background: #052535;
  font-weight:400;
  color:rgba(255,255,255,0.85);
  font-size: 16px;
  position: relative;

  & > div{
    min-width: 50px;
    height: 64px;
    margin: 0 12px;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &.selected{
      color:@primary-color;

      &::after{
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 0;
          border-bottom: 3px solid @primary-color;
      }

    }

  }

  & > div.left{
    position: absolute;
    left: 12px;
  }

  & > div.right{
    position: absolute;
    right: 12px;
  }

  .hide-preview{
    cursor: pointer;
    width: 82px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #D9D9D9;
    color: #fff;
    font-size: 14px;
    i{
      font-size: 14px;
      margin-right: 8px;
    }
  }

}
</style>
