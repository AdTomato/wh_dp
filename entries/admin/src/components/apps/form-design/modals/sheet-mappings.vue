
<template>
  <a-modal
    :title="title"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    :visible="true"
    @cancel="onCancel"
    @ok="onOk"
    :maskClosable="false"
    :keyboard="false"
    :width="618"
    class="sheet-mapping"
  >
    <div>
      <a-table
        :columns="columns"
        size="small"
        :pagination="false"
        :loading="false"
        :locale="{emptyText: ''}"
        :scroll="{ y: 585 }"
        :dataSource="dataSource"
      >
        <span slot="showDataItemTitle" class="resize">展示子表</span>
        <span slot="currentDataItemTitle" class="resize">当前子表</span>
        <span slot="actionTitle" class="resize">操作</span>
        <div
          slot="showDataItem"
          slot-scope="text,record"
          class="select-wrap"
        >
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            v-model="record.showDataItem"
          >
            <a-select-option
              v-for="(dateItem, index) in record.showDataItemOpns"
              :key="index"
              :value="dateItem.code"
            >{{ `${dateItem.name}[${dateItem.code}]` }}</a-select-option>
          </a-select>
        </div>
        <div
          slot="currentDataItem"
          slot-scope="text,record"
          class="select-wrap"
        >
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            v-model="record.currentDataItem"
          >
            <a-select-option
              v-for="(dateItem, index) in record.currentDataItemOpns"
              :key="index"
              :value="dateItem.code"
            >{{ `${dateItem.name}[${dateItem.code}]` }}</a-select-option>
          </a-select>
        </div>

        <div
          slot="action"
          slot-scope="text,record"
          class="select-wrap"
          @click="deleteRow(record)"
        >
          <span>
            <i class="icon aufontAll h-icon-all-delete-o"></i>
          </span>
        </div>
      </a-table>
      <div class="add">
        <span>
          <i class="icon aufontAll h-icon-all-plus-o"></i>
        </span>
        <span @click="addRow">{{ $t('languages.Apps.FormDesignPage.AddDataItem') }}</span>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";
import * as dataitemStore from "../stores/data-items.store-helper";
import appsApi from "@/apis/apps";

@Component({
  name: "sheet-mappings",
  components: {}
})
export default class SheetMappings extends Vue {
  @Prop({
    default: {}
  })
  modalData!: any;

  title: string = "映射子表";

  columns: Array<Common.TableHead> = [
    {
      dataIndex: "showDataItem",
      slots: { title: "showDataItemTitle" },
      scopedSlots: { customRender: "showDataItem" },
      key: "showDataItem",
      align: "left",
      width: 248
    },
    {
      dataIndex: "currentDataItem",
      slots: { title: "currentDataItemTitle" },
      scopedSlots: { customRender: "currentDataItem" },
      key: "currentDataItem",
      align: "left"
    },
    {
      dataIndex: "action",
      slots: { title: "actionTitle" },
      scopedSlots: { customRender: "action" },
      key: "action",
      width: 60,
      align: "center"
    }
  ];
  dataSource: Array<any> = [];

  sheetList = [];
  items: any[] = [];

  created() {
    // 获取关联模型数据项
    this.getSheetList();
    this.items = dataitemStore.getDataItems(this).filter(x => x.type === 8);
    if (this.modalData.data.value) {
      const a = this.modalData.data.value.split(";");

      this.dataSource = [];
      a.forEach((res: any, index: number) => {
        const chars = res.split(":");
        const code = chars[1].substr(1, chars[1].length - 2);
        const o = {
          showDataItem: chars[0],
          showDataItemOpns: this.sheetList,
          key: +new Date() + index,
          currentDataItem: chars[0],
          currentDataItemOpns: this.items
        };
        this.dataSource.push(o);
      });
    } else {
      this.dataSource[0].dataItemList = this.items;
    }
  }

  onCancel() {
    this.$emit("closeModal");
  }

  onOk() {
    const targetItem = this.dataSource.map((res: any) => {
      return `${res.showDataItem}:{${res.currentDataItem}}`;
    });
    this.$emit("backData", {
      value: targetItem.join(";")
    });
  }

  getSheetList() {
    const vm: any = this;
    const params = {
      schemaCode: this.schemaCode
    };
    appsApi.getDataItemList(params).then(res => {
      vm.sheetList = res.data.filter(
        (dataItem: any) => dataItem.propertyType === 8
      );

      if (vm.dataSource.length === 0) {
        const o = {
          showDataItem: "",
          showDataItemOpns: vm.sheetList,
          currentDataItem: "",
          currentDataItemOpns: vm.items
        };
        vm.dataSource.push(o);
      }
    });
  }

  addRow() {
    const o = {
      showDataItem: "",
      showDataItemOpns: this.sheetList,
      currentDataItem: "",
      currentDataItemOpns: this.items,
      key: +new Date()
    };
    this.dataSource.push(o);
  }

  deleteRow(item: any) {
    const itemIndex: number = this.dataSource.indexOf(item);
    this.dataSource.splice(itemIndex, 1);
  }

  get schemaCode() {
    return this.modalData.data.schemaCode;
  }
}
</script>

<style lang="less" scoped>
.sheet-mapping {
  .select-wrap {
    .select {
      width: 100%;
    }
  }
  .add {
    color: @primary-color;
    text-align: center;
    cursor: pointer;
    span {
      margin-top: 16px;
      margin-right: 8px;
    }
    padding-top: 16px;
  }
}
</style>
