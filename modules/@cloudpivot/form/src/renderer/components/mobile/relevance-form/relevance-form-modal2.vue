<template>
  <div v-show="visible" class="relevance-form-modal">
    <search-panel
      v-if="visible"
      ref="searchPanel"
      :enableFilter="queryConditions && queryConditions.length > 0"
      :fetch="superFetch"
      @filter="showFilterPanel"
    >
      <template slot-scope="{ data }">
        <div v-for="(item,index) in data" :key="index" @click="change(item)" class="item">
          <div class="item__left">
            <h3-checkbox-item
                :value="item.id"
                :returnValue="select" 
                @onClick="change(item)"
            ></h3-checkbox-item>
          </div>

          <div class="item__center">
            <form-item :formData="item" :isOpenForm="false" :queryColumns="queryColumns" />
          </div>
        </div>
      </template>

      <template slot="fitler">
        <query-form
          :schemaCode="schemaCode"
          :queryConditions="queryConditions"
          @commit="onFilter"
        ></query-form>
      </template>
    </search-panel>
    <!-- <div class="relevance-form-modal_buttom">
        <h3-button @click="back">
            取消
        </h3-button>
        <h3-button>
            确定
        </h3-button>
    </div> -->
    <div class="form-actions">
        <div class="form-actions__item"  @click="back">
            <div>取消</div>
        </div>
        <div class="form-actions__item" @click="ok">
            <div>确定</div>
        </div>
    </div>
  </div>
</template>


<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Inject,
  Model
} from "vue-property-decorator";

import {
  RelevanceFormControl,
  RelevanceFormSearchParams,
  RelevanceFormSearchResult
} from "../../../controls";

import SearchPanel from "./search-panel.vue";

import { H3Checkbox, H3Avatar, H3Button } from "h3-mobile-vue";

import TransferDom from "../../../directives/transfer-dom";
import common from '@cloudpivot/common';

// import * as list from '@cloudpivot/list'

@Component({
  name: "relevance-form-modal",
  components: {
    SearchPanel,
    H3CheckboxItem: H3Checkbox.Item,
    H3Avatar,
    H3Button
    // FormItem: list.components.mobile.FormItem
  },
  directives: {
    // TransferDom
  }
})
export default class RelevanceFormModal2 extends Vue {
  @Prop({
    default: false
  })
  visible!: boolean;

  @Model("change")
  value!: any;
  
  @Prop()
  schemaCode!: string;

  @Prop()
  queryCode!: string;
  
  @Prop({
    default: []
  })
  query!: any[];

  @Prop({
    default: []
  })
  columns!: any[]
  
  

  queryConditions: any[] = [];

  queryColumns: any[] = [];

  queryFormData?: any[];

  select: any[] = [];

  selectData: any[] = [];

  @Watch("visible")
  onVisibleChange() {
    if (this.visible) {
      this.getListQueryConditions().then((res: any) => {
        if (res) {
          this.queryConditions = res.conditions as any[];
          this.queryColumns = res.queryColumns as any[];
        } else {
          this.queryConditions = [];
        }
      });

      const searchPanel = this.$refs.searchPanel as any;
      if (searchPanel) {
        searchPanel.reFetch();
      }
    }
  }

  async getListQueryConditions() {
    if (!RelevanceFormControl.service.getListQueryConditions) {
      return Promise.reject(null);
    }
    let queryCode = "";
    queryCode = this.queryCode || "";
    

    const schemaCode = this.schemaCode || "";
  
    return await RelevanceFormControl.service.getListQueryConditions(
      schemaCode,
      queryCode,
      this.query
    );
  }

  isSelected(item: any) {
    if (!this.value || !item) {
      return false;
    }
    return this.value.id === item.id;
  }

  back() {
    this.$emit("back");
    this.selectData = [];
    this.select = [];
  }

  ok() {
    const backData = this.selectData.map(res => {
        return res.data;
    });
    this.$emit("change", backData);
    this.selectData = [];
    this.select = [];
  }

  getCreater(item: any) {
    if (Array.isArray(item.creater)) {
      if (item.creater.length > 0) {
        return item.creater[0];
      }
    }

    return {};
  }

  fetch(
    page: number,
    pageSize: number,
    value: string,
    queryData?: any[],
    mobile?: boolean
  ) {
   
    const schemaCode = this.schemaCode || "";
    let queryCode = this.queryCode || "";

    
    const params:any[] = queryData ? [] : [];
    params.push({
      code: "name",
      type: 0,
      value
    });

    // const _ctrl = this.ctrl as any;
    // const cols = this.columns;
    debugger;
    return RelevanceFormControl.service.search(
      schemaCode,
      queryCode,
      params,
      this.columns,
      page,
      pageSize,
      queryData
    );
  }

  async change(item: any) {
      const idx = this.select.indexOf(item.id);
      if (idx > -1) {
        this.select.splice(idx, 1);
        this.selectData.slice(idx, 1);
      } else {
        this.select.push(item.id);
        this.selectData.push(item);
      }
    // item = await this.convertForMappings(item.data);
    
  }

  superFetch(page: number, pageSize: number, value: string, formState: any) {
    let query: any = [];
    if (formState) {
      query = [formState];
    } else {
      query = this.queryFormData;
    }
    return this.fetch(page, pageSize, value, query, true);
  }

  getStatus(status: string) {
    const txt = this.$t(
      `cloudpivot.form.renderer.formStatus.${status.toLowerCase()}`
    );
    return txt;
    // switch (status) {
    //   case "DRAFT":
    //     return "草稿";
    //   case "PROCESSING":
    //     return "进行中";
    //   case "COMPLETED":
    //     return "已完成";
    //   case "CANCELED":
    //     return "已作废";
    //   default:
    //     return "";
    // }
  }

  showFilterPanel(show: boolean) {
    //   if(show){
    //     this.getListQueryConditions().then(res => {
    //       this.queryConditions = res || [];
    //     });
    //   }
  }

  onFilter(query: any[]) {
    // this.queryFormData = query.map(x => ({
    //   code : x.propertyCode,
    //   type : x.propertyType,
    //   value : x.propertyValue
    // }));
    this.queryFormData = query;
    const searchPanel = this.$refs.searchPanel as any;
    if (searchPanel) {
      searchPanel.reFetch();
    }
  }

  beforeCreate() {
    (this
      .$options as any).components.FormStatus = RelevanceFormControl.loadFormStatus();

    (this
      .$options as any).components.QueryForm = RelevanceFormControl.loadQueryForm();

    (this
      .$options as any).components.FormItem = RelevanceFormControl.loadFormItem();
  }

}
</script>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";

.relevance-form-modal{
    &_buttom {
        position: relative;
        bottom: 0;
        position: fixed;
        width: 100%;
        z-index: 100;
        .h3-button{
            float: left;
            width: 50%;
            border-radius: 0;
            &:before {
                border: 0;
            }
        }
    }
    .form-actions {
        text-align: center;
        bottom: 0;
        position: fixed;
        width: 100%;
        z-index: 100;
        display: flex;
        justify-content: space-around;
        color: @primary-color;
        background-color: #fff;
        .px2rem(font-size, @font-size-base);
        height: 44px;
        &__item {
            flex-grow: 1;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            
            &:not(:last-child) > div{
            width: 100%;
            position:relative;

            &::after {
                content:'';
                height:@font-size-20;
                width:1px;
                background:#EEEEEE;
                position:absolute;
                right:0;
            }
            }
            
            i {
            margin-right: 8px;
            }
        }
    }

}

.item {
  background-color: #fff;
  position: relative;
  // font-size: 15px;
  display: flex;
  margin: 0.26666667rem;
  // .px2rem(margin, @horizontal-padding-md);
  .px2rem(border-radius, @border-radius-lg);

  &__title {
    color: #333333;
  }

  &__desc {
    color: #999999;
    .px2rem(margin-top, @horizontal-padding-sm);
  }

  &__left {
    display: inline-flex;
    align-items: center;
  }

  &__center {
    flex-grow: 1;
    position: relative;
    // .px2rem(margin, @horizontal-padding-lg);
    margin-left: 0;
    /deep/.work-item {
      margin: 0;
      padding-left: 0;
      // padding: 0;
    }
  }

  &__status {
    display: inline-block;
    position: absolute;
    right: 0;
    top: 0;

    /deep/img {
      width: 1.6rem !important;
      height: 1.28rem !important;
    }
  }

  & > i.icon {
    color: @primary-color;
    position: absolute;
    right: 1.5em;
    top: 40%;
  }
}

/deep/.common-search {
  &_buttom {
    background: #fff;
    .px2rem(padding-top, 16px);
  }

  & > .empty {
    text-align: center;
  }
}

.status {
  font-size: 10px;
  border-radius: 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 18px;
  padding: 0 0.5em;

  &.DRAFT {
    color: rgba(250, 173, 20, 1);
    border: 1px solid rgba(250, 173, 20, 1);
    background-color: rgba(250, 173, 20, 0.1);
  }

  &.PROCESSING {
    color: rgba(24, 144, 255, 1);
    border: 1px solid rgba(24, 144, 255, 1);
    background-color: rgba(24, 144, 255, 0.1);
  }

  &.COMPLETED {
    color: rgba(82, 196, 26, 1);
    border: 1px solid rgba(82, 196, 26, 1);
    background-color: rgba(82, 196, 26, 0.1);
  }

  &.CANCELED {
    color: rgba(190, 190, 190, 1);
    border: 1px solid rgba(190, 190, 190, 1);
    background-color: rgba(244, 244, 244, 1);
  }
}
</style>
