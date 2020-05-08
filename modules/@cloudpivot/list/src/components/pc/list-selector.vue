<template>
  <div class="list-selector" :class="{ hideSearch: hideSearch }">
    <list-search
      v-if="defuaultShowSearch"
      :queryConditionSource="queryConditionSource"
      :queryConditions="queryConditions"
      :showActions="showActions"
      :isReverse="isReverse"
      :isShowFilterBox="isShowFilterBox"
      :showSearch="showSearch"
      :showSearchBox="showSearchBox"
      @toggleQueryConditions="toggleQueryConditions"
      @clearFilter="clearFilter"
    >
    
      <a-button
        @click="openForm"
        v-if="isReverse && showActions"
        type="primary"
        slot="add-btn"
      >新增</a-button>

      <query-form
        ref="queryForm"
        slot="form"
        :cols="cols"
        :showAll="true"
        :fields="queryConditions"
        @setFilterData="setFilterData"
        @toggle="val => (showMore = !val)"
      />
    </list-search>
    <list-search-default
      :showMore="showMore"
      :isShowFilterBox="isShowFilterBox"
      :showSearch="showSearch"
      :queryConditions="queryConditions"
      v-else
    >
      <query-form
        ref="queryForm"
        slot="form"
        :cols="cols"
        :fields="queryConditions"
        @setFilterData="setFilterData"
        @toggle="val => (showMore = !val)"
      />
      <div
        class="actions"
        slot="action"
        v-if="isReverse && showActions"
        :class="{ 'has-filterbox': isShowFilterBox && showSearch }"
      >
        <a-button @click="openForm" type="primary">新增</a-button>
      </div>
    </list-search-default>
    <div
      class="table"
      :class="{
        'has-filterbox': isShowFilterBox && showSearch,
        'has-action': isReverse && showActions
      }"
    >
      <list
        :checkType="checkType"
        :columns="this.data.queryColumns"
        :rows="dataSource"
        :checkedKeys="checkedKeys"
        :sheetParams="sheetParams"
        @check="onCheck"
        @rowClick="onRowClick"
      ></list>

      <div v-show="isLoading" style="text-align:center;padding:1em">
        <a-spin />
      </div>
    </div>

    <div class="pagination-box">
      <a-pagination
        :current="curPage"
        :total="total"
        :showTotal="total => $t('cloudpivot.list.pc.Total', { num: total })"
        :pageSize="pageSize"
        :pageSizeOptions="pageSizeOptions"
        showSizeChanger
        showQuickJumper
        @change="onPaginationChange"
        @showSizeChange="onSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

import {
  Button,
  Modal,
  Table,
  Pagination,
  Checkbox,
  Icon,
  Spin
} from "h3-antd-vue";

import QueryForm from "./list-query-form.vue";
import * as applicationList from "@cloudpivot/list";

import List from "./list.vue";
import ListSearch from "./components/list-selector/list-search.vue";
import ListSearchDefault from "./components/list-selector/list-search-default.vue";

import { listApi, listParams } from "@cloudpivot/api";
import filterCard from "./components/filter-card/filter-card.vue";
import * as queryConditionTypings from "./helper/query-conditions.typings";
import queryConditionHelper from "./helper/query-conditions";
import { utils } from "@cloudpivot/common";

import { schema, renderer } from "@cloudpivot/form";
const { DataItemType } = schema;

@Component({
  name: "list-selector",
  components: {
    AButton: Button,
    AModal: Modal,
    ATable: Table,
    APagination: Pagination,
    ACheckbox: Checkbox,
    AIcon: Icon,
    ASpin: Spin,
    QueryForm,
    List,
    filterCard,
    ListSearch,
    ListSearchDefault
  }
})
export default class ListSelector extends Vue {
  @Prop({
    default: ""
  })
  listCode!: string;

  @Prop({
    default: ""
  })
  schemaCode!: string;

  @Prop()
  cols!: number;

  @Prop()
  columns!: string[];

  @Prop()
  query!: any[];

  
  @Prop({
    default: false
  })
  multiple!: boolean;

  @Model("change", {
    default: () => []
  })
  value!: any[];

  @Prop({
    default: true
  })
  selectable!: boolean;

  @Prop({
    default: true
  })
  defuaultShowSearch!: boolean;
  /**
   * 目前用来区分是反向查询还是关联表单
   */
  @Prop({
    default: true
  })
  showSearch!: boolean;

  @Prop({
    default: false
  })
  showSearchBox!: boolean;
  /**
   * 反向查询自身模型编码
   */
  @Prop({
    default: ""
  })
  reverseSchemaCode!: string;

  /**
   * 反向查询自身表单编码
   */
  @Prop({
    default: ""
  })
  reverseFormCode!: string;

  /**
   * 反向查询控件编码
   */
  @Prop({
    default: ""
  })
  reverseControlCode!: string;

  /**
   *  当前表单id
   */
  @Prop({
    default: ""
  })
  currentFormId!: string;
  
  /**
   *  当前表单模板id
   */
  @Prop({
    default: ""
  })
  currentSheetId!: string;

  /**
   * 方向关联表单code
   */
  @Prop({
    default: ""
  })
  reverseFormFieldCode!: string;

  @Prop({
    default: false
  })
  isReverse!: boolean;

  /**
   * 单据状态
   */
  @Prop({
    default: ""
  })
  sequenceStatus!: string;

  @Prop({
    default: false
  })
  showActions!: boolean;

  /**
   * 默认附带的查询条件
   */
  @Prop({
    default: []
  })
  defaultQuery!: any[];
  /**
   * 关联查询 新增时刷新当前窗口
   */
  mounted() {
    window.addEventListener("message", this.reloadMessage, false);
  }
  destroyed() {
    window.removeEventListener("message", this.reloadMessage);
  }

  reloadMessage() {
    if (this.isReverse) {
      const queryForm = this.$refs.queryForm as any;
      if (queryForm) {
        queryForm.query();
      }
    }
  }

  get checkType() {
    if (!this.selectable) {
      return ''
    }
    if(this.multiple) {
      return 'checkbox';
    } else {
      return 'radio';
    }
  }

  showMore = true;

  isShowFilterBox: boolean = false;

  isLoading = false;

  data: any = {};

  displayColumns: any[] = [];

  dataSource: any[] = [];

  list?: any[];

  queryConditions: Array<listParams.QueryConditions> = [];

  queryAction: any = [];

  total: number = 0;

  pageSize: number = 20;

  curPage: number = 1;

  queryConditionSource: any = []; // 查询条件展示数组

  get checkedKeys() {
    return this.value.map(x => x.id);
  }

  get hideSearch() {
    return !this.showSearch;
  }

  get sheetParams(){
    return {
      id: this.currentFormId,
      sheetid: this.currentSheetId
    }
  }

  // 分页配置项
  pageSizeOptions: string[] = ["10", "20", "50", "100"];

  // 自定义列去除序号和摘要
  cusColumns: Array<any> = [];

  filterData: Array<listParams.Filters> = [];

  @Watch("schemaCode", {
    immediate: true
  })
  onSchemaCodeChange() {
    if (!this.schemaCode) {
      return;
    }

    this.getListConfigData();
  }

  onCheck(checkeds: any[]) {
    this.$emit("change", checkeds);
  }

  /**
   * 展示搜索条件
   */
  toggleQueryConditions() {
    this.showSearchBox = !this.showSearchBox;
  }
  /**
   * 清空
   */
  clearFilter() {
    this.queryConditionSource = [];
    this.filterData = [];
    this.$nextTick(() => {
      const queryForm: any = this.$refs.queryForm;
      queryForm.clearFilters();

      this.getQueryList();
    });
  }
  onRowClick(row: any) {
    if (row.isAuthorize) {
      const params = {
        bizObjectId: row.id,
        schemaCode: row.schemaCode
      };
      listApi.getFormUrl(params).then((res: any) => {
        window.open(res);
      });
    } else {
      if (this.multiple) {
        let val = [row];
        if(this.value) {
          val = JSON.parse(JSON.stringify(this.value));
          const curRow = val.find(res => {
            return res.id === row.id;
          });
          if (curRow) {
            val.splice(val.indexOf(curRow),1);
          } else {
            val.push(row);
          }
        }
        this.$emit("change", val);
      } else {
        this.$emit("change", [row]);
      }
    }
  }

  openForm() {
    const ac = this.queryAction.find(x => x.actionCode === "add");
    if (ac) {
      this.handleAdd(ac);
    }
  }
  handleAdd(obj) {
    let sequenceStatus: any = {};
    let url: string = "";
    const code = obj.associationCode;
    if (obj.associationType === 1) {
      // 关联流程

      if (this.sequenceStatus && this.sequenceStatus !== "DRAFT") {
        url = `/form/detail?startWorkflowCode=${code}&${this.reverseFormFieldCode}=${this.currentFormId}`;
      } else {
        url = `/form/detail?startWorkflowCode=${code}`;
      }
    } else {
      // 关联表单
      const schemaCode = obj.schemaCode;
      if (this.sequenceStatus && this.sequenceStatus !== "DRAFT") {
        url = `/form/detail?schemaCode=${schemaCode}&sheetCode=${code}&${this.reverseFormFieldCode}=${this.currentFormId}`;
      } else {
        url = `/form/detail?schemaCode=${schemaCode}&sheetCode=${code}`;
      }
    }

    url += `&return=${location.pathname + encodeURIComponent(location.search)}`;
    const opens = window.open(url);
  }
  /*
   * 初始化表格表头信息
   */
  initColumns() {
    const columnsArray = this.data.queryColumns.filter(
      (a: any) => a.propertyCode
    );
    const columns: any[] = columnsArray.map((c: any) => ({
      vcTitle: c.name,
      dataIndex: c.propertyCode,
      width: c.width ? Number(c.width) : 176,
      slots: { title: `${c.propertyCode}Title` },
      propertyType: c.propertyType
    }));

    this.cusColumns = JSON.parse(JSON.stringify(columns));

    // columns.splice(0, 0, {
    //   width: 250,
    //   dataIndex: 'name',
    //   slots: { title: 'nameTitle' },
    //   scopedSlots: { customRender: 'name' }
    // });

    columns.splice(0, 0, {
      width: 100,
      dataIndex: "index",
      slots: { title: "indexTitle" },
      scopedSlots: { customRender: "index" }
    });

    this.displayColumns = columns;
  }

  /*
   * 分页改变
   */
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.getQueryList("pageChange");
  }

  /*
   * 分页pageSize改变
   */
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getQueryList("pageChange");
  }

  /*
   * 重新加载
   */
  reload() {
    this.getListConfigData();
  }

  /*
   * 获取模型的配置信息
   */
  async getListConfigData() {
    const params = {
      code: this.listCode,
      schemaCode: this.schemaCode,
      source: 1
    }; // test datang01
    this.isLoading = true;
    const res = await listApi.getListConfigData(params);
    this.isLoading = false;
    if (res.errcode === 0) {
      this.queryConditions = res.data.queryConditions;
      this.queryAction = res.data.queryActions;

      if (Array.isArray(this.query) && this.queryConditions) {
        this.query.forEach(x => {
          const item = this.queryConditions.find(
            (q: any) => q.propertyCode === x.code
          );
          if (item) {
            switch (item.propertyType) {
              case DataItemType.Date:
              case DataItemType.Number:
                if (x.value !== "") {
                  item.defaultValue = [x.value, x.value];
                }
                break;
              case DataItemType.Logic:
                if (typeof x.value === "string") {
                  if (x.value === "false") {
                    item.defaultValue = false;
                  } else {
                    item.defaultValue = true;
                  }
                } else {
                  item.defaultValue = x.value;
                }
                break;
              default:
                if (x.value !== undefined && x.value !== null) {
                  item.defaultValue = x.value;
                }
                break;
            }
          }
        });
      }

      // debugger;
      if (!this.queryConditions || this.queryConditions.length <= 0) {
        this.isShowFilterBox = false;
        this.getQueryList();
      } else {
        this.isShowFilterBox = true;
      }
      this.data = res.data;
      if (res.data.queryColumns) {
        this.initColumns();
      }

      // this.getQueryList();
    } else {
      // this.isShowTableBox = false;
      // this.isShowLoadFailBox = true;
    }
  }

  /*
   * 获取查询条件
   */
  setFilterData(data: any) {
    const filterArray: any = [];
    const dataArray = Object.entries(data);
    dataArray.forEach((a: any) => {
      if (!a && !a[0]) {
        return;
      }
      const [key, value] = a;
      this.queryConditions.forEach((query: listParams.QueryConditions) => {
        if (key === query.propertyCode) {
          let propertyValue = value;

          if (value === null) {
            return;
          }

          if (Array.isArray(propertyValue)) {
            if (key === "sequenceStatus") {
              const sequenceStatus: any = [];
              propertyValue.forEach((pop: any) => {
                switch (pop) {
                  case "草稿":
                    return sequenceStatus.push("DRAFT");
                  case "进行中":
                    return sequenceStatus.push("PROCESSING");
                  case "已完成":
                    return sequenceStatus.push("COMPLETED");
                  case "已作废":
                    return sequenceStatus.push("CANCELED");
                  default:
                    break;
                }
              });
              propertyValue = sequenceStatus.join(";");
            } else if (propertyValue.length === 1 && query.propertyType === 2) {
              propertyValue = `${propertyValue};`;
            } else if (query.propertyType === DataItemType.StaffSelector) {
              propertyValue = JSON.stringify(
                propertyValue.map(p => ({
                  id: p.id,
                  type: p.unitType
                }))
              );
            } else if (query.propertyType === DataItemType.Date) {
              propertyValue = propertyValue
                .map(x => {
                  if (typeof x === "string") {
                    return x;
                  } else if (x instanceof Date) {
                    return utils.DateHandle.dateFormat(x, "YYYY-MM-DD");
                  }
                  return "";
                })
                .join(";");
            } else {
              propertyValue = propertyValue.filter(x => x).join(";");
            }
          } else {
            switch (query.propertyType) {
              case DataItemType.Date:
                propertyValue =
                  value instanceof Date
                    ? utils.DateHandle.dateFormat(value, "YYYY-MM-DD")
                    : value;
                break;
              case DataItemType.RelevanceForm:
                propertyValue = value ? value.id : "";
                break;
              case DataItemType.Address:
                if (value && Object.keys(value).length > 0) {
                  propertyValue = JSON.stringify(propertyValue);
                } else {
                  propertyValue = null;
                }
                break;
              default:
                break;
            }
          }
          // propertyValue = `${propertyValue}`;
          filterArray.push({
            propertyCode: query.propertyCode,
            propertyType: query.propertyType,
            propertyValue
          });
        }
      });
    });
    this.filterData = filterArray;
    let filterData = this.filterData;

    const qcArr = queryConditionHelper.getValue(
      queryConditionTypings.CheckTypes.FromFilterData,
      this.queryConditions as any,
      filterData as any
    );

    this.queryConditionSource = qcArr;
    this.curPage = 1;
    this.getQueryList("search");
    this.showSearchBox = false;
  }

  /*
   * 查询列表数据参数
   */
  queryParamsFormater() {
    // debugger;
    let filters = JSON.parse(JSON.stringify(this.filterData));
    if (this.defaultQuery.length > 0) {
      const defaultQuery: any[] = [];
      this.defaultQuery.forEach(q => {
        const curFilter = filters.find(f => f.propertyCode === q.code);
        if (curFilter) {
          curFilter.propertyValue = q.value;
        } else {
          defaultQuery.push(q);
        }
      });
      filters = filters.concat(defaultQuery);
    }
    const params: listParams.QueryListParams = {
      filters,
      mobile: false,
      page: this.curPage - 1,
      queryCode: this.listCode,
      schemaCode: this.schemaCode,
      size: this.pageSize
    };

    if (this.reverseSchemaCode) {
      params.reverseSchemaCode = this.reverseSchemaCode;
      params.reverseCode = this.reverseControlCode;
      params.formCode = this.reverseFormCode;
    }

    return params;
  }

  /*
   * 获取查询列表数据
   */
  async getQueryList(type?: string) {
    // debugger;
    const vm: any = this;
    // this.dataSource = [];
    this.list = [];
    this.isLoading = true;
    const params = this.queryParamsFormater();

    if (this.columns && this.columns.length > 0) {
      params.options = {
        customDisplayColumns: this.columns,
        queryDisplayType: listParams.QueryDisplayType.Append
      };
    }

    if (!this.showSearch && this.query && this.query.length > 0) {
      // const items = this.query.map((x: any) => ({
      //   propertyCode: x.code,
      //   propertyType: x.type,
      //   propertyValue: x.value
      // }));
      // params.filters = params.filters.concat(items);
      for (const item of this.query) {
        if (params.filters.find(x => x.propertyCode === item.code)) {
          break;
        }

        let val = item.value;

        if (
          item.type === schema.DataItemType.Number ||
          item.type === schema.DataItemType.Date
        ) {
          val = val + ";";
        }

        params.filters.push({
          propertyCode: item.code,
          propertyType: item.type,
          propertyValue: val
        });
      }
    }

    const res = !this.isReverse
      ? await listApi.getQueryList(params)
      : await listApi.queryReverse(params);

    this.isLoading = false;
    if (res.errcode === 0) {
      this.dataSource = [];
      this.list = res.data.content.map((x: any) => {
        x.data.schemaCode = x.schemaCode;
        return x.data;
      });

      res.data.content.forEach((item: any, index: number) => {
        item.data.index = index + 1;
        item.data.key = index;
        item.data.isChecked = false;

        // const obj: any = {};
        // Object.entries(item.data).forEach((data: any, i: number) => {
        //   const [key, value] = data;
        //   if (value && typeof value === 'object') {
        //     if (Array.isArray(value)) {
        //       obj[key] = value.map(x => x.name || '').join();
        //     } else {
        //       obj[key] = value.name || value.address || '';
        //     }
        //   } else if (value === 'null') {
        //     obj[key] = null;
        //   } else if (typeof value === 'boolean') {
        //     obj[key] = value ? '是' : '否';
        //   } else {
        //     obj[key] = value;
        //   }
        //   const column: any = this.data.queryColumns.find((c: any) => c.propertyCode === key);
        //   if (value && column) {
        //     if(column.propertyType === schema.DataItemType.Address){
        //       try {
        //         let address: any = JSON.parse(value);
        //         if (typeof address === 'string') {
        //           address = JSON.parse(address);
        //         }
        //         if (address.pca === undefined) {
        //           obj[key] = address.address;
        //         } else {
        //           const pcaStr: string = address.pca.map((p: any) => p.name).join('');
        //           obj[key] = `${pcaStr}${address.detailAd}`;
        //         }
        //       } catch {
        //         console.log('位置控件格式正确！');
        //       }
        //     }else if(column.propertyType === schema.DataItemType.Date){
        //       let format = '';
        //       switch(column.displayFormat){
        //         default:
        //         case 2:
        //           format = 'YYYY-MM-DD hh:mm:ss';
        //         break;

        //         case 1:
        //           format = 'YYYY-MM-DD';
        //         break;

        //         case 3:
        //           format = 'YYYY-MM-DD hh:mm';
        //         break;
        //       }
        //       obj[key] = renderer.dateFormatter(value,format);
        //     }
        //   }
        //   if (key === 'sequenceStatus') {
        //     switch (value) {
        //       case 'DRAFT':
        //         obj[key] = '草稿';
        //         break;
        //       case 'PROCESSING':
        //         obj[key] = '进行中';
        //         break;
        //       case 'COMPLETED':
        //         obj[key] = '已完成';
        //         break;
        //       case 'CANCELED':
        //         obj[key] = '已作废';
        //         break;
        //       default:
        //         break;
        //     }
        //   }
        // });
        this.dataSource.push(item.data);
      });

      this.total = res.data.totalElements;
    } else {
      // this.isShowTableBox = false;
      // this.isShowLoadFailBox = true;
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-table-thead > tr > th,
/deep/.ant-table-tbody > tr > td {
  padding: 8px 10px;
}

.list-selector {
  position: relative;
  // overflow: hidden;
  .filters-box {
    position: absolute;
    width: 100%;
    z-index: 666;
    background: #fff;

    /deep/.collapsed {
      // height: 100%;
      // overflow: auto;
    }
    &.show-more {
      height: 100%;
      overflow: auto;
    }
  }

  .table.has-filterbox {
    // padding-top: 64px;
    // padding-top: 4px;
    margin-top: 48px;
  }
  .table.has-filterbox.has-action {
    margin-top: 4px;
  }
  .actions {
    // text-align: right;

    // margin-bottom: 8px;
  }
  .actions.has-filterbox {
    margin-top: 48x;
  }
  &.hideSearch > .table {
    padding-top: 0;
  }

  .pagination-box {
    margin-top: @base4-padding-md;
    text-align: right;
  }

  /deep/.ant-pagination-total-text {
    margin-right: @base4-padding-md;
  }
}
</style>
