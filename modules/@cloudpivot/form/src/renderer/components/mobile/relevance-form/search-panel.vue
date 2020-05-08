<template>
  <div class="search-panel">
    <div class="search-panel__header">
      <div class="search-bar">
        <!-- 单据状态 -->
        <div class="form-states">
          <div
            v-for="(searchItem, index) in searchWays"
            :key="index"
            :class="[
              'form-states-inner',
              searchItem.type === currentWay && 'selectActive'
            ]"
            @click="switchWay(searchItem)"
          >
            <span>
              {{
                (searchItem.type === 'status' && currentStatusName.length)
                  ? currentStatusName.join('/')
                  : searchItem.name
              }}
            </span>
            <i
              :class="[
                'icon aufontAll',
                searchItem.icon,
                searchItem.type === currentWay && (searchItem.activeIcon || '')
              ]"
            ></i>
          </div>
        </div>

        <!-- <div class="h3-input" :class="{ center : !searchMode }">
          <i class="icon aufontAll h-icon-all-search-o"/>
          <input
            type="text"
            :placeholder="$t('cloudpivot.form.renderer.search')"
            v-model="text"
            @input="onSearch"
            @focus="entrySearch"
          >
        </div>

        <div
          v-show="searchMode"
          class="primary search-bar__button"
          @click="quitSearch"
        >{{ $t('cloudpivot.form.renderer.cancel') }}</div>
        
        <div
          class="search-bar__button" 
          v-show="!searchMode && enableFilter"
          :class="{
            primary : showFilter
          }"
          @click="filter">{{ $t('cloudpivot.form.renderer.filter') }}</div> -->

      </div>

      <!-- <div class="search-bar" v-show="!searchMode">
        <div class="h3-input center" @click="entrySearch">
          <i class="icon aufontAll h-icon-all-search-o"/>
          {{ $t('cloudpivot.form.renderer.search') }}
        </div>
        <div class="search-bar__button" 
          v-show="enableFilter"
          :class="{
            primary : showFilter
          }"
          @click="filter">{{ $t('cloudpivot.form.renderer.filter') }}</div>
      </div> -->
    </div>

    <div class="search-panel__content" v-show="!showFilter">

      <div v-show="searchMode">

        <div v-show="fetching" class="message">
          <template v-show="searchMode">{{ $t('cloudpivot.form.renderer.searching') }}</template>
        </div>

        <div
          v-show="searchMode && total"
          class="message"
        >{{ $t('cloudpivot.form.renderer.searchResultTip',{ total }) }}</div>

      </div>

      <div v-show="fetched && total < 1" class="no-result">

        <div v-show="searchMode && value">{{ $t('cloudpivot.form.renderer.searchNoResultTip',{ text:value }) }}</div>

        <!-- <div v-show="!searchMode">{{ $t('cloudpivot.form.renderer.noData') }}</div> -->

      </div>

      <h3-scroll
        ref="scroll"
        v-show="!searchMode || (searchMode && total > 0)"
        :loadMore="loadMore"
        :pageSize="pageSize"
        :noMoreMessage="noMore"
        :wrapId="id"
      >
        <div>
          <slot :data="data"></slot>
        </div>
      </h3-scroll>

    </div>

    <div
      class="search-panel__content search-panel__condition relevance-form-condition"
      :class="{[`${fitlerWrapClass}`]: true}"
      v-show="showFilter"
      v-transfer-dom
    >
      <slot name="fitler"></slot>
    </div>
    <!-- 单据状态查询 -->
    <div class="search-content" v-show="showState">
      <div class="search-content-status">
        <ul>
          <li
            v-for="(item, index) in formStatus"
            :key="index"
            :class="{'checked': item.checked}"
            @click="formSatusChange(index)"
          >
            <span>{{ item.name }}</span>
            <check-box :defaultChecked="item.checked" @change="formSatusChange(index)" />
          </li>
        </ul>
        <div class="buttons">
          <h3-button type="primary" @click="submitStatus">{{ $t('cloudpivot.list.mobile.OK') }}</h3-button>
          <!-- @click="submitStatus" -->
        </div>
      </div>
    </div>


  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

// import { H3Scroll } from "h3-mobile-vue";

import common from '@cloudpivot/common';

import { H3Input, H3Button } from 'h3-mobile-vue';

import H3Scroll from "../../layout/h3-mescroll.vue";

import TransferDom from '../../../directives/transfer-dom';

import {
  RelevanceFormControl,
  RelevanceFormSearchParams,
  RelevanceFormSearchResult,
  Segment
} from "../../../controls";

@Component({
  name: "search-panel",
  components: {
    H3Button,
    H3Scroll,
    CheckBox: common.components.mobile.Checkbox,
  },
  directives: {
    TransferDom
  }
})
export default class SearchPanel extends Vue {

  @Prop()
  fitlerWrapClass!:string

  data: any[] = [];

  text = "";

  value = "";

  id = + new Date();

  searchTimeoutRef: any;

  fetching = false;

  fetched = false;

  page = 1;

  pageSize = 20;

  total = 0;

  searchMode = false;
  
  showFilter = false;

  backup?: {
    data: any[];
    total: number;
    page: number;
  };

  @Prop({
    default: 500
  })
  delay!: number;

  @Prop({
    type: Function
  })
  fetch!: (
    page: number,
    pageSize: number,
    value: string,
    formStatus: any
  ) => Promise<Segment<any>>;

  @Prop({
    default : false
  })
  enableFilter !: boolean

  el:any

  get noMore() {
    return this.$t("cloudpivot.form.renderer.noMore");
  }

  mounted() {
    this.el = document.querySelector('.tab-heard');
    if (this.el) {
      this.el.addEventListener('click',this.hideFilter)
    };
  }

  hideFilter(){
    this.showFilter = false;
  }
  
  beforeDestroy(){
    if (this.el) {
      this.el.removeEventListener('click', this.hideFilter)
    }
  }

  back() {
    this.$emit("back");
  }

  filter() {
    this.showFilter = !this.showFilter;
    this.$emit("filter",this.showFilter);
  }

  quitSearch() {
    if (this.backup) {
      this.data = this.backup.data;
      this.total = this.backup.total;
      this.page = this.backup.page;
    }

    this.searchMode = false;
    this.text = this.value = "";
  }

  entrySearch() {
    this.showFilter = false;

    this.backup = {
      data: this.data,
      total: this.total,
      page: this.page
    };

    this.searchMode = true;
    this.data = [];
    this.total = 0;
  }

  onSearch() {
    if (!this.fetch) {
      return;
    }

    clearTimeout(this.searchTimeoutRef);

    if(!this.text){
      this.value = '';
      return;
    }

    this.searchTimeoutRef = setTimeout(() => {
      this.search();
    }, this.delay);
  }

  async search() {
    this.showFilter = false;
    this.page = 1;
    this.data = [];
    await this.doFetch();
  }

  async reFetch(){
    this.showFilter = false;
    this.page = 1;
    this.data = [];
    await this.doFetch();
  }

  async loadMore(page: any, done: any) {
    this.page = page.num;
    const seg = await this.doFetch();
    if (done) {
      done(this.pageSize, seg.total);
    }
  }

  async doFetch() {
    debugger;
    this.fetching = true;
    this.value = this.text;
    this.fetched = false;
    try {
      const seg = await this.fetch(this.page, this.pageSize, this.value, this.queryFormState);
      this.total = seg.total;
      this.data = this.page === 1 ? seg.data : this.data.concat(seg.data);
      return seg;
    } finally {
      this.fetching = false;
      this.fetched = true;
    }
  }

  /**
   * 单据状态筛选
   */

  formStatus: Array<any> = [];

  beforeMount() {
    this.formStatus = [
      {
        name: `${this.$t('cloudpivot.list.mobile.Processing')}`,
        checked: false,
        status: 'PROCESSING'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Completed')}`,
        checked: false,
        status: 'COMPLETED'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Cancled')}`,
        checked: false,
        status: 'CANCELED'
      },
      {
        name: `${this.$t('cloudpivot.list.mobile.Draft')}`,
        checked: false,
        status: 'DRAFT'
      }
    ];
  }

  searchWays: Array<any> = [
    {
      name: '单据状态',
      type: 'status',
      icon: 'h-icon-all-down-o',
      activeIcon: 'h-icon-all-up-o'
    },
    {
      name: '筛选',
      type: 'filter',
      icon: 'h-icon-all-filter-o'
    }
  ]
  currentWay = '';
  urrentStatusName: string[] = [];
  currentStatusName: string[] = [];
  showState = false
  switchWay(item: any) {
    if (item.type === 'filter' && !this.enableFilter) {
      this.currentWay = '';
      this.$h3.toast.show({
        text: `${this.$t('cloudpivot.list.mobile.NoFilterTip')}`,
        iconType: 'close'
      });
      return;
    }
    if (item.type === 'filter') {
      this.showFilter = !this.showFilter;
      this.showState = false;
    } else {
      this.showState = !this.showState;
      this.showFilter = false;
    }
    if (this.showFilter || this.showState) {
      this.$emit("filter", true);
    }
    if (!this.showFilter && !this.showState) {
      this.$emit("filter", false);
    }
  }

  /**
   * 勾选单据状态状态选项
   */
  formSatusChange(index: number) {
    this.formStatus[index].checked = !this.formStatus[index].checked;
    this.logStatusNames();
  }
  logStatusNames() {
    this.currentStatusName = this.formStatus.map((item: any) => item.checked && item.name).filter(Boolean);
  }

   /**
   * 根据表单状态筛选列表
   */
  queryFormState:any = '';
  submitStatus() {
    this.currentWay = '';
    const formStatus = {
      propertyCode: 'sequenceStatus',
      propertyType: 0,
      propertyValue: ''
    };
    const targetArr = this.formStatus.filter((res: any) => res.checked);
    formStatus.propertyValue = targetArr.map((res: any) => res.status).join(';');
    this.showState = false;
    this.queryFormState = formStatus;
    this.search();
    this.$emit("filter", false);
  }
}
</script>

<style lang="less" scoped>
.search-panel {
  height: 100%;
  width: 100%;
  // position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  z-index: 98;
  position: absolute;
  display: flex;
  background-color: #fff;
  flex-direction: column;
  text-align: left;

  &__header {
    flex-shrink: 0;
  }

  .search-bar {
    display: flex;
    // padding: 0.5em 1em;
    border-bottom: 1px solid #e4e4e4;
    font-size:15px;

    & > .icon {
      margin-right: 1em;
      color: @light-color-1;
    }

    &__button {
      margin-left: 1.5em;
      color: #666666;
      display: inline-flex;
      align-items: center;

      &.primary {
        color: @primary-color;
      }
    }
  }

  .message {
    background-color: #f4f4f4;
    padding: 0.8em 1.5em;
  }

  .h3-input {
    height: 28px;
    flex-grow: 1;
    display: inline-flex;
    background-color: #f4f4f4;
    border-radius: 3px;
    align-items: center;
    position : relative;

    &.center {
      // justify-content: center;
      
      color:@text-color-describe;

      & > input{
        text-align:center;
      }

      & > i.icon{
        position: absolute;
        left : 28%;
        margin:0;

        @media screen and (min-width: 370px) {
          left : 37.5%;
        }

        @media screen and (min-width: 410px) {
          left : 39%;
        }

      }

    }

    & > i.icon {
      color: @text-color-describe;
      // height: 15px;
      width: 15px;
      font-size: 13px;
      margin: 0 3px 0 12px;
    }

    & > input {
      flex-grow: 1;
      color: #333333;
      background-color: #f4f4f4;
      font-size: 15px;
      line-height: 20px;
    }
  }

  &__content {
    flex-grow: 1;
    overflow: auto;
    display: flex;
    color: #999999;
    background-color: #f4f4f4;
    flex-direction: column;

    .no-result {
      display: flex;
      flex-grow: 1;
      align-items: center;
      justify-content: center;
    }

    & > .mescroll {
      position: static;
      height: auto;
    }
  }
}
</style>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
@search-head: 87px;
@search-has-border: 89px;
@li-line-height: 90px;
.form-states {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .px2rem(height, @search-head);
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    // border-bottom: 1px solid @base-border-color;
    span {
      .px2rem(font-size, @font-size-base);
    }
    &-inner {
      // flex: 1;
      display: flex;
      justify-content: flex-start;
      line-height: 0.7rem;
      &:last-child {
        justify-content: flex-end;
      }
      span {
        .px2rem(padding-right, 10px);
      }
      .icon {
        font-size: 10px;
      }
    }
    .selectActive {
      font-weight: 500;
      color: @primary-color;
      i {
        color: @primary-color;
      }
    }
  }

  .search-content {
    display: flex;
    flex-direction: column;
    /*position: absolute;*/
    position: fixed;
    width: 100%;
    
    // background: @white-background;
    background: @light-color-3;
    bottom: 0;
    /*overflow: hidden;*/
    justify-content: space-between;
    .px2rem(top, @search-has-border);
    z-index: 100;
    &-button {
      flex: none;
      display: flex;
      & > div {
        flex: 1;
      }
    }
    &-wrap {
      /*flex: 1;*/
      flex: 1 0 auto;
      position: relative;
      overflow-y: auto;
    }
    &-status {
      position: absolute;
      top: 0;
      left: 0;
      // height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      background: @white-background;
      .buttons {
        .px2rem(height, 90px);
        .px2rem(padding-top, 30px);
        .px2rem(padding-right, 30px);
        .px2rem(padding-left, 30px);
        text-align: right;
        /deep/.h3-button {
          display: inline-block;
          .px2rem(width, 112);
          .px2rem(height, 60px);
          .px2rem(line-height, 60px);
          .px2rem(border-radius, 50px);
          .px2rem(font-size, 26px);
          background-color: @primary-color;
          &::before {
            border: none;
          }
        }
      }
    }
    ul {
      width: 100%;
      li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        text-align: left;
        // width: 50%;
        // padding: 5px 10px;
        // box-sizing: border-box;
        .px2rem(padding-left, @horizontal-padding-lg);
        .px2rem(padding-right, @horizontal-padding-lg);
        .px2rem(line-height, @li-line-height);

        &.checked {
          span:first-child {
            font-weight: 500;
            color: @text-color-main;
          }
        }
        span:first-child {
          .px2rem(font-size, @font-size-base);
        }

        /deep/.home-checkbox-item {
          float: right;
          .px2rem(width, 36px);
          .px2rem(height, 36px);
          .px2rem(line-height, 36px);
        }
      }
    }
    .search-content-status-input {
      height: 100%;
    }
  }
</style>
<style lang="less">
  .relevance-form-condition {
    position: fixed;
    z-index: 100;
    top: 1.16rem;
    bottom: 0;
    width: 100%;
  }
</style>