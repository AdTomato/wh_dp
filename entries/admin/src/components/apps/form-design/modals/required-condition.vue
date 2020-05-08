<template>
  <a-modal
    :title="title"
    :visible="true"
    width="536px"
    @cancel="closeModal"
    @ok="backData"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-row class="required-type" v-if="isRequireConditon">
      <a-col :span="4"><span>控件必填</span></a-col>
      <a-col :span="20">
        <a-radio-group name="radioGroup" v-model="requiredType">
          <a-radio :value="'false'">非必填</a-radio>
          <a-radio :value="'true'">必填</a-radio>
          <a-radio :value="'condition'">满足条件必填</a-radio>
        </a-radio-group>
      </a-col>
    </a-row>
   
    <template v-if="isRequireConditon">
      <dataitem-condition
        v-show="requiredType === 'condition'"
        v-model="model"
        :items="dataItems"
      ></dataitem-condition>
    </template>
    <template v-else>
      <dataitem-condition v-model="model" :items="dataItems"></dataitem-condition>
    </template>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import optionsMap from "../typings/form-modals-map";

import * as dataitemStore from "../stores/data-items.store-helper";

import { DataItemState } from "../stores/data-items.store";

import DataitemCondition from "@/components/shared/data-item/dataitem-condition2.vue";

import { DataitemConditionValue } from "@/components/shared/data-item/dataitem-condition2.vue";

import {
  DataItemType,
  NumberOptions,
  DataItem
} from "@/components/apps/form-design/typings";

import {
  OperatorService,
  DateItemOperatorType
} from "@/components/shared/data-item/data-item2";

@Component({
  name: "RequiredConditon",
  components: {
    DataitemCondition
  }
})
export default class RequiredConditon extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;

  @Prop({
    default: () => ({})
  })
  dataItem!: DataItemState;

  dataItems: DataItemState[] = [];

  model: DataitemConditionValue = {
    type: 1,
    conditions: []
  };

  requiredType = 'false';

  type = '';

  get title():string {
    if (this.type === 'showRule') {
      return this.$t("languages.Apps.FormDesignPage.IsShowRule") as string
    } else {
      return this.$t("languages.Apps.FormDesignPage.NecessaryRule") as string;
    }
  }

  get tipsInfo(): string {
    if (this.type === 'showRule') {
      return this.$t(
        "languages.Apps.FormDesignPage.NecessaryRuleText_3"
      ) as string
    } else {
      return this.$t(
        "languages.Apps.FormDesignPage.NecessaryRuleText_2"
      ) as string
    }
  }

  get isRequireConditon():boolean {
    return this.type !== 'showRule';
  }

  // radioChange() {
  //   console.log(this.requiredType,'eeeeeeeeee');
  // }

  @Watch("modalData", {
    immediate: true
  })
  onModalDataChange(modalData: any) {
    if (!modalData.data) {
      return;
    }

    const data = modalData.data;
    const type = modalData.type;
    this.type = modalData.type;   

    let items = dataitemStore.getDataItems(this).filter(x => x.used);

    if (this.dataItem.parentCode) {
      const sheet = items.find(x => x.code === this.dataItem.parentCode);
      if (sheet && sheet.properties) {
        const sheetItems = sheet.properties.filter(
          (x: any) => x.used && x.code !== this.dataItem.code
        ) as any;
        items = items.concat(sheetItems);
      }
    }

    this.dataItems = items;

    if (data.value) {
      this.initModel(data.value);
    }
  }

  initModel(exp: string) {
    let segs: string[] = [];
    let type = 1;
    if (exp === 'true') {
      this.requiredType = 'true';
    }
    if (exp && exp !=='true') {
      this.requiredType = 'condition';
    }
    if (exp.indexOf("||") > -1) {
      type = 2;
      segs = exp.split(" || ");
    } else {
      if (exp.indexOf("&&") > -1) {
        segs = exp.split(" && ");
      } else {
        segs = [exp];
      }
    }

    const conditions: any[] = [];

    for (const seg of segs) {
      const fields = seg.split(" ");
      const code = fields[0].substring(1, fields[0].length - 1);

      let item: DataItemState | undefined;

      const idx = code.indexOf(".");
      if (idx > -1) {
        const parentCode = code.substring(0, idx);
        const childCode = code.substring(idx + 1);
        const sheet = this.dataItems.find(x => x.code === parentCode);
        if (sheet && sheet.properties) {
          item = sheet.properties.find(x => x.code === childCode) as any;
        }
      } else {
        item = this.dataItems.find(x => x.code === code);
      }

      if (!item) {
        continue;
      }

      let operator = OperatorService.findByLabel(item.type, fields[1]);

      if (!operator) {
        continue;
      }

      let val: any;

      if (
        !(
          operator.value === DateItemOperatorType.IsNull ||
          operator.value === DateItemOperatorType.IsNotNull
        )
      ) {
        val = fields[2];

        switch (item.type) {
          case DataItemType.Number:
            val = Number(val);
            break;
          case DataItemType.Logic:
            val = val === "true" ? 1 : 0;
            break;
          case DataItemType.Date:
          case DataItemType.ShortText:
          case DataItemType.LongText:
            val = val.substring(1, val.length - 1);
            break;
          case DataItemType.StaffSelector:
            if (val) {
              try {
                val = JSON.parse(val);
              } catch (e) {
                console.log("initModel", e);
              }
            }
            break;
        }
      }

      conditions.push({
        propertyCode: code,
        propertyType: item.type,
        operatorType: operator.value,
        value: val
      });
    }

    this.model = {
      type,
      conditions
    };
  }

  backData() {
    let symbol = this.model.type === 1 ? "&&" : "||";

    let exp = this.model.conditions
      .map(cond => {
        let operator = OperatorService.findByValue(
          cond.propertyType,
          cond.operatorType
        );

        if (!operator) {
          return null;
        }

        let text = "";

        let val = cond.value;

        if (cond.propertyType === DataItemType.Number) {
          if(cond.operatorType === DateItemOperatorType.IsNull || cond.operatorType === DateItemOperatorType.IsNotNull){
            text = '';
          }else{
            val = Number(val);
            if (Number.isNaN(val)) {
              return null;
            }
            text = val.toString();
          }
        } else if (cond.propertyType === DataItemType.Logic) {
          val = val === "true" || val === 1;
          text = `${val}`;
        } else if (cond.propertyType === DataItemType.StaffSelector) {
          if (val && Array.isArray(val)) {
            const arr = val.map((x: any) => {
              return {
                id: x.id,
                name: x.name,
                type: x.type,
                parentId: x.parentId
              };
            });

            text = JSON.stringify(arr);
          }
        } else {
          text = `'${val}'`;
        }

        let code = `{${cond.propertyCode}}`;
        // if(this.dataItem.parentCode){
        //   code = `{${this.dataItem.parentCode}.${cond.propertyCode}}`;
        // }else{
        //   code = `{${cond.propertyCode}}`;
        // }

        if (
          operator.value === DateItemOperatorType.IsNull ||
          operator.value === DateItemOperatorType.IsNotNull
        ) {
          return `${code} ${operator.label}`;
        }

        return `${code} ${operator.label} ${text}`;
      })
      .filter(x => x !== null)
      .join(` ${symbol} `);

    
    if (this.isRequireConditon) {
      if (this.requiredType === 'false') {
        exp = '';
      } else if (this.requiredType === 'true') {
        exp = 'true';
      }
    }
    const data = {
      value: exp
    };

    this.$emit("backData", data);
  }

  closeModal() {
    this.$emit("closeModal");
  }
}
</script>

<style lang="less">
.required-type {
  margin-bottom: 16px;
}
</style>
