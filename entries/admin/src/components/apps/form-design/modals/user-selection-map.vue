<template>
  <a-modal
    :title="$t('languages.Apps.FormDesignPage.UserSelectionMap')"
    :visible="true"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    @cancel="closeModal"
    @ok="backData"
    width="618px"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="user-selection-warp">
      <a-table
        :columns="columns"
        size="small"
        :pagination="false"
        :loading="false"
        :locale="{emptyText: ''}"
        :scroll="{ y: 585 }"
        :dataSource="dataSource"
      >
        <span slot="attributesTitle">{{ $t('languages.Apps.FormDesignPage.Attributes') }}</span>
        <span slot="dataItemTitle">{{ $t('languages.Apps.FormDesignPage.DataItem') }}</span>
        <span slot="actionTitle" class="delete">{{ $t('languages.Operation') }}</span>
        <!-- :dataSource="filterDataItemList" -->
        <div slot="attributes" slot-scope="text,record" class="select-wrap">
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="attributesChange(record, arguments)"
            :defaultValue="record.attributes"
            v-if="record.attributes"
          >
            <a-select-option
              v-for="(attributes, index) in record.userAttributes"
              :key="index"
              :value="attributes.mark"
            >{{ attributes.name }}</a-select-option>
          </a-select>
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="attributesChange(record, arguments)"
            v-else
          >
            <a-select-option
              v-for="(attributes, index) in record.userAttributes"
              :key="index"
              :value="attributes.mark"
            >{{ attributes.name }}</a-select-option>
          </a-select>
        </div>
        <div slot="dataItem" slot-scope="text,record" class="select-wrap">
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="dataItemChange(record, arguments)"
            :defaultValue="record.dataItem"
            v-if="record.dataItem"
          >
            <a-select-option
              v-for="(dataItem, index) in record.dataItemList"
              :key="index"
              :value="dataItem.code"
              :title="`${dataItem.name}[${dataItem.code}]`"
            >{{ `${dataItem.name}[${dataItem.code}]` }}</a-select-option>
          </a-select>
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="dataItemChange(record, arguments)"
            v-else
          >
            <a-select-option
              v-for="(dataItem, index) in record.dataItemList"
              :key="index"
              :value="dataItem.code"
              :title="`${dataItem.name}[${dataItem.code}]`"
            >{{ `${dataItem.name}[${dataItem.code}]` }}</a-select-option>
          </a-select>
        </div>
        <div slot="action" slot-scope="text,record" class="delete" @click="deleteRow(record)">
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
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import OptionsMap from "../typings/form-modals-map";

import * as dataitemStore from "../stores/data-items.store-helper";

@Component({
  name: "UserSelectionMap"
})
export default class UserSelectionMap extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;
  dataSource: Array<any> = [
    {
      attributes: "",
      dataItem: "",
      key: Math.random(),
      userAttributes: OptionsMap.userAttributes,
      dataItemList: []
    }
  ];
  columns: Array<Common.TableHead> = [
    {
      dataIndex: "attributes",
      slots: { title: "attributesTitle" },
      scopedSlots: { customRender: "attributes" },
      key: "attributes",
      align: "left",
      width: 248
    },
    {
      dataIndex: "dataItem",
      slots: { title: "dataItemTitle" },
      scopedSlots: { customRender: "dataItem" },
      key: "dataItem",
      align: "left"
    },
    {
      dataIndex: "action",
      slots: { title: "actionTitle" },
      scopedSlots: { customRender: "action" },
      key: "action",
      width: 60,
      align: "right"
    }
  ];
  userAttributes: Array<any> = [];
  created() {
    this.userAttributes = OptionsMap.userAttributes;
    const exp = this.modalData.data;
    if (exp.value) {
      const arr = exp.value.split(";");
      arr.pop();
      this.dataSource = [];
      const length: number = arr.length | 0;
      for (let i = 0; i < length; i += 1) {
        const chars = arr[i].split(":");
        const code = chars[1].substr(1, chars[1].length - 2);
        const obj = {
          attributes: chars[0],
          dataItem: code,
          key: Math.random(),
          userAttributes: OptionsMap.userAttributes,
          dataItemList: this.items
        };
        this.dataSource.push(obj);
      }
    } else {
      // this.dataSource[0].dataItemList = this.items;
      this.dataSource[0].dataItemList = this.items.filter(
        (m: any) => m.used === true
      );
    }
  }
  get items() {
    const initiallyArr = dataitemStore
      .getDataItems(this)
      .filter((res: any) => res.published);
    const dataArr = JSON.parse(JSON.stringify(initiallyArr));
    const targetArr: any[] = [];
    const length: number = dataArr.length | 0;
    for (let i = 0; i < length; i += 1) {
      targetArr.push(dataArr[i]);
      if (dataArr[i].type === 8 && dataArr[i].properties) {
        const parentCode: string = dataArr[i].code;
        const subDataItem = dataArr[i].properties as any;
        const subLength: number = subDataItem.length | 0;
        for (let j = 0; j < subLength; j += 1) {
          subDataItem[j].code = `${parentCode}.${subDataItem[j].code}`;
          targetArr.push(subDataItem[j]);
        }
      }
    }
    return targetArr.filter(
      (res: any) =>
        res.type !== 2 &&
        res.type !== 4 &&
        res.type !== 6 &&
        res.type !== 7 &&
        res.type !== 8 &&
        res.type !== 9 &&
        !res.isSystem
    );
  }
  attributesChange(item: any, arg: any) {
    const selectOption: string = arg[0];
    const itemIndex: number = this.dataSource.indexOf(item);
    this.dataSource[itemIndex].attributes = selectOption;
    const selectAttri: any = OptionsMap.userAttributes.filter(
      (res: any) => res.mark === selectOption
    );
    const dataItemList = [...this.items.filter((m: any) => m.used === true)];
    if (selectAttri[0].type === 0) {
      this.dataSource[itemIndex].dataItemList = dataItemList.filter(
        (res: any) => res.type === 5
      );
    } else if (selectAttri[0].type === 1) {
      this.dataSource[itemIndex].dataItemList = dataItemList.filter(
        (res: any) => res.type === 0 || res.type === 1
      );
    } else if (selectAttri[0].type === 2) {
      this.dataSource[itemIndex].dataItemList = dataItemList.filter(
        (res: any) => res.type === 3
      );
    }
  }
  dataItemChange(item: any, arg: any) {
    const selectOption: string = arg[0];
    const itemIndex: number = this.dataSource.indexOf(item);
    this.dataSource[itemIndex].dataItem = selectOption;
    console.log(this.dataSource[itemIndex], arg);
    const selectDataItem: any[] = this.items.filter(
      (res: any) => res.code === item.dataItem
    );
    const type = selectDataItem[0].type;
    if (type === 5) {
      this.dataSource[itemIndex].userAttributes =
        OptionsMap.attributesUserSelection;
    } else if (type === 0 || type === 1) {
      this.dataSource[itemIndex].userAttributes = OptionsMap.attributesText;
    } else if (type === 3) {
      this.dataSource[itemIndex].userAttributes = OptionsMap.attributesDate;
    }
  }
  addRow() {
    const item = {
      attributes: "",
      dataItem: "",
      key: Math.random(),
      userAttributes: OptionsMap.userAttributes,
      dataItemList: this.items
    };
    this.dataSource.push(item);
  }
  deleteRow(item: any) {
    const itemIndex: number = this.dataSource.indexOf(item);
    const newData = [...this.dataSource];
    console.log(newData.filter((el: any) => el !== item));
    this.dataSource = newData.filter((el: any) => el !== item);
  }
  backData() {
    let propertyBarText = "";
    const length = this.dataSource.length | 0;
    for (let i = 0; i < length; i += 1) {
      propertyBarText = `${propertyBarText}${this.dataSource[i].attributes}:{${this.dataSource[i].dataItem}};`;
    }
    const backData = {
      value: propertyBarText
    };
    this.$emit("backData", backData);
  }
  closeModal() {
    this.$emit("closeModal");
  }
}
</script>
<style lang="less" scoped>
.user-selection-warp {
  /deep/ .ant-table-header {
    &::-webkit-scrollbar {
      width: 0;
    }
    .delete {
      cursor: pointer;
    }
  }
  /deep/ .ant-table-body {
    max-height: 279px !important;
    // &::-webkit-scrollbar{
    //   width: 0;
    // }
    td {
      padding: 4px 16px !important;
      .delete {
        cursor: pointer;
        span {
          color: rgba(0, 0, 0, 0.65);
        }
      }
    }
    .select-wrap {
      .select {
        width: 216px;
      }
    }
  }
  .add {
    /*border-top: 1px solid #e8e8e8;*/
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
