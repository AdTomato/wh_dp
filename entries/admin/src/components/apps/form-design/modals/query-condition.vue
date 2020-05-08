
<template>
  <a-modal
    title
    @cancel="onCancel"
    @ok="onOk"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    :visible="true"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="header" :class="{'header_title': type === 'onlyQuery'}">
      <div v-if="type === 'onlyQuery'">
        mobile查询条件
      </div>
      <a-radio-group
        v-else
        v-model="type"
        buttonStyle="solid"
      >
        <a-radio-button value="query">查询条件</a-radio-button>
        <a-radio-button value="mapping">映射字段</a-radio-button>
      </a-radio-group>
    </div>

    <div class="content">
      <dataitem-mapping
        v-if="type === 'query' || type === 'onlyQuery'"
        v-model="query"
        :source="querySource"
        :target="target"
      ></dataitem-mapping>

      <dataitem-mapping
        v-else
        v-model="mapping"
        :editable="true"
        :source="mappingSource"
        :target="mappingTarget"
      ></dataitem-mapping>
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

import DataitemMapping from "@/components/shared/data-item/dataitem-mapping.vue";

import {
  DataitemSource,
  DataitemMappingValueItem
} from "@/components/shared/data-item/dataitem-mapping.vue";

import * as dataitemStore from "../stores/data-items.store-helper";

import * as listApi from "@/apis/list";

import appsApi from "@/apis/apps";

import { DataItemState } from "../stores/data-items.store";

import { DataItemType } from "@cloudpivot/form/schema";

/**
 * 关联表单查询条件
 */
@Component({
  name: "query-condition",
  components: {
    DataitemMapping
  }
})
export default class QueryCondition extends Vue {
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

  mappingSource: DataitemSource = {
    title: "展示字段",
    items: []
  };

  mappingTarget: DataitemSource = {
    title: "当前表单字段",
    items: []
  };

  query: DataitemMappingValueItem[] = [];

  mapping: DataitemMappingValueItem[] = [];

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
    const clientType = modalData.data.clientType || 'PC';

    Promise.all([
      listApi.getListInfo(schemaCode, queryCode,clientType),
      appsApi.getDataItemList({
        schemaCode,
        isPublish: true
      })
    ]).then(
      (resList: any[]) => {
        hideLoader();

        const res = resList[0];
        const res2 = resList[1];

        const data = res.data;

        const map = (x: any) => ({
          code: x.propertyCode || x.code,
          type: x.propertyType,
          name: x.name,
          relativeCode: x.relativeCode || x.relativeSchemaCode,
          isSystem: x.defaultProperty
        });

        const items = dataitemStore.getDataItems(this).filter(x => x.used);

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

            this.mappingTarget = {
              title: this.target.title,
              items: sheetItems
            };

            this.target = {
              title: this.target.title,
              items: this.target.items.concat(sheetItems)
            };
          }
        } else {
          this.mappingTarget = {
            title: this.target.title,
            items: items.filter(x => x.code !== dataItem.code)
          };
        }

        const types = this.mappingTarget.items.map(x => x.type);

        // const filter = (x: any) => types.indexOf(x.propertyType) > -1
        //   && x.propertyType !== DataItemType.Attachment && x.propertyType !== DataItemType.ApprovalOpinion
        //   && x.propertyType !== DataItemType.Sheet;

        if (data.queryConditions) {
          this.querySource = {
            title: this.querySource.title,
            items: data.queryConditions.map(map)
          };
        }

        const msItems = res2.data
          .filter(
            (x: any) =>
              types.indexOf(x.propertyType) > -1 &&
              // && x.propertyType !== DataItemType.Attachment
              x.propertyType !== DataItemType.ApprovalOpinion
          )
          .map(map);

        // if (data.queryColumns) {
        //   // console.log('items',items);
        //   // console.log('queryColumns',data.queryColumns);
        //   data.queryColumns.filter(filter)
        //     .forEach((x:any) => {
        //       msItems.push(map(x));
        //     });
        // }

        this.mappingSource = {
          title: this.mappingSource.title,
          items: msItems.filter((x: any) => {
            return x.code !== 'workflowInstanceId'
              && x.code !== 'ownerDeptQueryCode'
          })
        };

        const value = modalData.data.value;

        this.query = this.querySource.items.map(
          x =>
            ({
              source: x,
              isConst: false,
              target: {}
            } as any)
        );

        if (value && value.query) {
          this.handleQueryValue(value.query);
        }

        if (value && value.mapping) {
          this.handleMappingValue(value.mapping);
        }
      },
      () => hideLoader()
    );
  }

  handleMappingValue(value: string) {
    this.mapping = value
      .split(";")
      .map((s: string) => {
        let [sourceCode, targetCode] = s.split(":");
        const sourceItem = this.mappingSource.items.find(
          m => m.code === sourceCode
        );
        if (!sourceItem) {
          return;
        }

        targetCode = targetCode.substring(1, targetCode.length - 1);
        const idx = targetCode.indexOf(".");
        if (idx > -1) {
          targetCode = targetCode.substr(idx + 1);
        }
        const targetItem = this.mappingTarget.items.find(
          i => i.code === targetCode
        );
        if (!targetItem) {
          return;
        }

        return {
          source: sourceItem,
          target: targetItem
        };
      })
      .filter(x => x !== undefined) as any;
  }

  handleQueryValue(value: string) {
    value.split(";").forEach((s: string) => {
      const idx = s.indexOf(':');
      let sourceCode = s.substring(0, idx);
      let targetCode = s.substr(idx + 1);
      const sourceItem = this.query.find(q => q.source.code === sourceCode);
      if (!sourceItem) {
        return;
      }

      if (targetCode[0] === "{") {
        targetCode = targetCode.substring(1, targetCode.length - 1);
        const index = targetCode.indexOf(".");
        if (index > -1) {
          targetCode = targetCode.substr(index + 1);
        }
        const targetItem = this.target.items.find(i => i.code === targetCode);
        if (!targetItem) {
          return;
        }
        sourceItem.target = targetItem;
      } else {
        sourceItem.isConst = true;
        (sourceItem as any).target = targetCode;
      }
    });
  }

  onCancel() {
    this.$emit("closeModal");
  }

  onOk() {
    const join = (items: DataitemMappingValueItem[], parentCode?: string) =>
      items
        .map(q => {
          if (typeof q.target === "string") {
            if (q.target) {
              return `${q.source.code}:${q.target}`;
            }
          } else if (q.target.code) {
            if (!parentCode) {
              parentCode = q.target.parentCode;
            }
            if (parentCode) {
              return `${q.source.code}:{${parentCode}.${q.target.code}}`;
            }
            return `${q.source.code}:{${q.target.code}}`;
          }
          return null;
        })
        .filter(s => s)
        .join(";");

    const parentCode = this.modalData.data.dataItem.parentCode;
    const queryText = join(this.query);
    const mappingText = join(this.mapping, parentCode);

    const backData = {
      value: {
        query: queryText,
        mapping: mappingText
      }
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
  div{
    margin-left: 24px;
    color:rgba(0,0,0,0.85);
    font-weight: 600;
    font-size:16px;
  }
 
}

.content {
  height: 300px;
  max-height: 300px;
  overflow: auto;
}
</style>
