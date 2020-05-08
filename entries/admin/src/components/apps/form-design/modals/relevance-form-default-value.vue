
<template>
  <a-modal
    title="默认值"
    @cancel="onCancel"
    @ok="onOk"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    :visible="true"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="content">
      <dataitem-mapping 
        :editable="true" 
        v-model="query" 
        :source="querySource" 
        :target="target"
      ></dataitem-mapping>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

import DataitemMapping from "@/components/shared/data-item/dataitem-mapping2.vue";

import {
  DataitemSource,
  DataitemMappingValueItem
} from "@/components/shared/data-item/dataitem-mapping2.vue";

import * as dataitemStore from "../stores/data-items.store-helper";

import * as listApi from "@/apis/list";

import appsApi from "@/apis/apps";

import { DataItemState } from "../stores/data-items.store";

import { DataItemType } from "@cloudpivot/form/schema";

import {
  OperatorService,
  DateItemOperatorType
} from "@/components/shared/data-item/data-item4";

/**
 * 关联表单查询条件
 */
@Component({
  name: "RelevanceFormDefaultValue",
  components: {
    DataitemMapping
  }
})
export default class RelevanceFormDefaultValue extends Vue {
  @Prop({
    default: {}
  })
  modalData!: any;

  type = "query";

  /**
   * 列表数据
   */
  listData: any = {
    queryConditions: []
  };

  target: DataitemSource = {
    title: "当前表单字段",
    items: []
  };

  querySource: DataitemSource = {
    title: "查询条件",
    items: []
  };

  query: DataitemMappingValueItem[] = [];

  get onlyQuery() {
    return true;
  }

  @Watch("modalData", {
    immediate: true
  })
  onModalDataChange(modalData: any) {
    if (!modalData.data || !modalData.data.schemaCode) {
      return;
    }

    this.type = modalData.data.type;

    const hideLoader = (this.$message as any).loading();

    const schemaCode = modalData.data.schemaCode;
    const queryCode = modalData.data.queryCode;
    const dataItem = modalData.data.dataItem;
    const clientType = modalData.data.clientType || "PC";

    Promise.all([
      // listApi.getListInfo(schemaCode, queryCode, clientType),
      appsApi.getDataItemList({
        schemaCode,
        isPublish: true
      })
    ]).then(
      (resList: any[]) => {
        hideLoader();

        const res = resList[0];
        // const res2 = resList[1];

        const data = res.data.filter(item => item.propertyType === DataItemType.ShortText
          || item.propertyType === DataItemType.Number
          || item.propertyType === DataItemType.Logic
          || item.propertyType === DataItemType.RelevanceForm
          || item.propertyType === DataItemType.StaffSelector
        );

        const map = (x: any) => ({
          code: x.propertyCode || x.code,
          type: x.propertyType,
          name: x.name,
          relativeCode: x.relativeCode || x.relativeSchemaCode,
          isSystem: x.defaultProperty
        });

        const items = dataitemStore.getDataItems(this).filter(x => x.used);
        debugger;

        this.target = {
          title: this.target.title,
          items
        };

        if (dataItem.parentCode) {
          const sheet = items.find(x => x.code === dataItem.parentCode);
          if (sheet && sheet.properties) {
            const sheetItems = sheet.properties.filter(
              (x: any) => x.used && x.code !== dataItem.code
            );

            this.target = {
              title: this.target.title,
              items: this.target.items.concat(sheetItems)
            };
          }
        }

        // const filter = (x: any) => types.indexOf(x.propertyType) > -1
        //   && x.propertyType !== DataItemType.Attachment && x.propertyType !== DataItemType.ApprovalOpinion
        //   && x.propertyType !== DataItemType.Sheet;

        if (data) {
          this.querySource = {
            title: this.querySource.title,
            items: data.map(map)
          };
        }

        const value = modalData.data.value;

        // this.query = this.querySource.items.map(
        //   x =>
        //     ({
        //       source: x,
        //       operatorType: "",
        //       target: {}
        //     } as any)
        // );

        if (value && value.query) {
          this.handleQueryValue(value.query);
        }else{
          this.query = [];
        }
      },
      () => hideLoader()
    );
  }

  handleQueryValue(value: string) {
    this.query = value
      .split(" && ")
      .map((s: string) => {
        const fields = s.split(" ");
        let sourceCode = fields[0];
        let targetCode = fields[2].substring(1, fields[2].length - 1);

        const sourceItem = this.querySource.items.find(
          q => q.code === sourceCode
        );
        if (!sourceItem) {
          return null;
        }

        const index = targetCode.indexOf(".");
        if (index > -1) {
          targetCode = targetCode.substr(index + 1);
        }

        const targetItem = this.target.items.find(i => i.code === targetCode);
        if (!targetItem) {
          return null;
        }

        let operator = OperatorService.findByLabel(
          sourceItem.type,
          fields[1]
        );

        if (!operator) {
          return null;
        }

        return {
          source: sourceItem,
          operatorType: operator.value,
          target: targetItem
        };
      })
      .filter(item => item !== null) as any;
  }

  onCancel() {
    this.$emit("closeModal");
  }

  onOk() {
    const join = (items: DataitemMappingValueItem[], parentCode?: string) =>
      items
        .map(q => {
          let operator = OperatorService.findByValue(
            q.source.type,
            q.operatorType
          );

          if (!operator) {
            return null;
          }
          if (typeof q.target === "string") {
            if (q.target) {
              return `${q.source.code}:${q.target}`;
            }
          } else if (q.target.code) {
            if (!parentCode) {
              parentCode = q.target.parentCode;
            }
            if (parentCode) {
              return `${q.source.code} ${operator.label} {${parentCode}.${q.target.code}}`;
            }
            return `${q.source.code} ${operator.label} {${q.target.code}}`;
          }
          return null;
        })
        .filter(s => s)
        .join(" && ");

    const parentCode = this.modalData.data.dataItem.parentCode;
    const queryText = join(this.query);

    const backData = {
      value: queryText
    };

    this.$emit("backData", backData);
  }
}
</script>

<style lang="less" scoped>
.header {
  text-align: center;
  margin: -10px -24px 0 -24px;
  padding-bottom: 14px;
  margin-bottom: 14px;
  border-bottom: 1px solid #e8e8e8;
  // .header_title {
  //   float: left;
  // }
}
.header.header_title {
  text-align: left;
  div {
    margin-left: 24px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    font-size: 16px;
  }
}

.content {
  height: 300px;
  max-height: 300px;
  overflow: auto;
}
</style>
