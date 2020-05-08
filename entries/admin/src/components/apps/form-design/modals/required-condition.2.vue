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
    <div class="required-condition-wrap">
      <div class="condition-relation clearfix">
        <div class="h">
          <span>{{ $t('languages.Apps.FormDesignPage.NecessaryRuleText_1') }}</span>
        </div>
        <div>
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="relationshipChange"
            :defaultValue="data.relationship"
          >
            <a-select-option value="and">{{ $t('languages.Apps.FormDesignPage.All') }}</a-select-option>
            <a-select-option value="or">{{ $t('languages.Apps.FormDesignPage.Or') }}</a-select-option>
          </a-select>
        </div>
        <div class="h">
          <span>{{ tipsInfo }}</span>
        </div>
      </div>
      <div ref="condionwrap" class="conditon-wrap">
        <div
          class="row clearfix"
          v-for="(item, i) in data.ruleList"
          :key="item.key">
          <div>
            <a-select
              class="select w1"
              :placeholder="$t('languages.PlaceHolder.Select')"
              @change="dataItemChange(i, arguments)"
              :defaultValue="item.dataItemCode"
              v-if="item.dataItemCode"
            >
              <a-select-option
                v-for="(dataItem, index) in items"
                :key="index"
                :value="dataItem.code"
                :title="`${dataItem.name}[${dataItem.code}]`"
              >{{ `${dataItem.name}[${dataItem.code}]` }}</a-select-option>
            </a-select>
            <a-select
              class="select w1"
              :placeholder="$t('languages.PlaceHolder.Select')"
              @change="dataItemChange(i, arguments)"
              v-else
            >
              <a-select-option
                v-for="(dataItem, index) in items"
                :key="index"
                :value="dataItem.code"
                :title="`${dataItem.name}[${dataItem.code}]`"
              >{{ `${dataItem.name}[${dataItem.code}]` }}</a-select-option>
            </a-select>
          </div>
          <div>
            <a-select
              class="select w2"
              :placeholder="$t('languages.PlaceHolder.Select')"
              @change="changeIndex(i)"
              @select="changeRule(i,arguments)"
              v-if="!item.rule"
            >
              <a-select-option
                v-for="(conditionRule, i) in item.ruleOptions"
                :key="i"
                :value="conditionRule.rule"
              >{{ conditionRule.text }}</a-select-option>
            </a-select>
            <a-select
              class="select w2"
              :placeholder="$t('languages.PlaceHolder.Select')"
              @change="changeIndex(i)"
              @select="changeRule(i,arguments)"
              :defaultValue="item.rule"
              v-else
            >
              <a-select-option
                v-for="(conditionRule, i) in item.ruleOptions"
                :key="i"
                :value="conditionRule.rule"
              >{{ conditionRule.text }}</a-select-option>
            </a-select>
          </div>
          <div>
            <a-input
              class="input"
              v-if="item.type !== 2"
              v-model="item.text"
              :placeholder="$t('languages.PlaceHolder.Input')"
            />
            <a-input-number
              v-else
              class="input"
              v-model="item.text"
              :placeholder="$t('languages.PlaceHolder.Input')"
            />
          </div>
          <div>
            <span class="delete" @click="deleteRow(i)">
              <i class="icon aufontAll h-icon-all-delete-o"></i>
            </span>
          </div>
        </div>
      </div>
      <div class="add">
        <span>
          <i class="icon aufontAll h-icon-all-plus-o"></i>
        </span>
        <span @click="addRow">{{ $t('languages.Apps.FormDesignPage.AddOptins') }}</span>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import optionsMap from "../typings/form-modals-map";

import * as dataitemStore from "../stores/data-items.store-helper";

import {
  DataItemType,
  NumberOptions,
  DataItem
} from "@/components/apps/form-design/typings";

@Component({
  name: "RequiredConditon"
})
export default class RequiredConditon extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;
  textConditonRule: any = optionsMap.conditonOptions;
  title: any = "";
  tipsInfo: any = '';
  data: any = {
    relationship: "and",
    ruleList: [
      {
        dataItemCode: "id",
        rule: 1,
        text: "",
        ruleOptions: this.otherConditonRule,
        type: 0
      }
    ],
    propertyBarText: ""
  };
  index: number = 0;
  created() {
    this.title = this.$t("languages.Apps.FormDesignPage.NecessaryRule");
    this.tipsInfo = this.$t('languages.Apps.FormDesignPage.NecessaryRuleText_2');
    if (this.modalData.type === "showRule") {
      this.title = this.$t("languages.Apps.FormDesignPage.IsShowRule");
      this.tipsInfo = this.$t('languages.Apps.FormDesignPage.NecessaryRuleText_3');
    }

    const data = this.modalData.data;
    if (data && data.value) {
      //this.data = this.modalData.data.expressionObject;
      let arr: string[] = [];
      const exp = data.value;
      if (exp.indexOf("||") > -1) {
        this.data.relationship = "or";
        arr = exp.split("||");
      } else {
        if (exp.indexOf("&&") > -1) {
          arr = exp.split("&&");
        } else {
          arr = [exp];
        }
      }

      const dataItems = dataitemStore.getDataItems(this);

      this.data.ruleList = arr.map((x, index) => {
        const chars = x.split(" ");
        const idx =
          optionsMap.conditonOptions.findIndex(c => c.text === chars[1]) + 1;
        const code = chars[0].substr(1, chars[0].length - 2);

        const item = this.findDataItem(code, dataItems);
        if (!item) {
          return null;
        }

        const options =
          item.type === DataItemType.ShortText ||
          item.type === DataItemType.LongText
            ? [...this.textConditonRule]
            : this.otherConditonRule;

        return {
          dataItemCode: code,
          rule: idx,
          text: chars[2].replace(/'/g, ""),
          ruleOptions: options,
          key: ((new Date()).getTime() + index).toString(),
          type: item.type
        };
      });
    }
  }

  findDataItem(code: string, dataItems: DataItem[]) {
    if (code.indexOf(".") > -1) {
      const arr = code.split(".");
      let item = dataItems.find(x => x.code === arr[0]);
      if (item && item.properties) {
        item = item.properties.find(x => x.code === arr[1]);
      }
      return item;
    } else {
      return dataItems.find(x => x.code === code);
    }
  }

  get otherConditonRule() {
    const arr = [...this.textConditonRule];
    arr.splice(arr.length - 2, 2);
    return arr;
  }
  get items() : any[] {
    const initiallyArr = dataitemStore
      .getDataItems(this)
      .filter((res: any) => res.published);
    const dataArr : any[] = JSON.parse(JSON.stringify(initiallyArr));
    const defaultDataItems: any[] = [];
    const newDataItems: any[] = [];
    const length: number = dataArr.length | 0;
    for (let i = 0; i < length; i += 1) {
      if (dataArr[i].isSystem) {
        defaultDataItems.push(dataArr[i]);
      } else {
        newDataItems.push(dataArr[i]);
      }
    }
    const targetArr = newDataItems.concat(defaultDataItems);
    return targetArr.filter(
      (res: any) =>
        res.type !== 5 &&
        res.type !== 6 &&
        res.type !== 7 &&
        res.type !== 8 &&
        res.type !== 9
    );
  }
  /**
   * 获取计算列表
   */
  dataItemChange(index: number, arg: any) {
    const dataItemIndex: number = arg[1].data.key;
    const type = this.items[dataItemIndex].type as Number;
    const code: string = arg[0];
    this.data.ruleList[index].dataItemCode = code;
    this.data.ruleList[index].type = type;
    this.data.ruleList[index].text = '';
    if (type === 0 || type === 1) {
      this.data.ruleList[index].ruleOptions = this.textConditonRule;
    } else {
      this.data.ruleList[index].ruleOptions = this.otherConditonRule;
    }
  }
  relationshipChange(val: any) {
    this.data.relationship = val;
  }
  changeIndex(index: number) {
    this.index = index;
  }
  changeRule(index: number, val: any) {
    this.data.ruleList[index].rule = val[0];
  }
  backData() {
    this.data.propertyBarText = "";
    let relationship = "";
    if (this.data.relationship === "and") {
      relationship = "&&";
    } else {
      relationship = "||";
    }
    const length = this.data.ruleList.length | 0;

    const dataItems = dataitemStore.getDataItems(this);

    for (let i = 0; i < length; i += 1) {
      const rule = this.data.ruleList[i];

      let item: DataItem | undefined;
      if (rule.dataItemCode.indexOf(".") > 0) {
        const arr = rule.dataItemCode.split(".");
        item = dataItems.find(x => x.code === arr[0]);
        if (item && item.properties) {
          item = item.properties.find(x => x.code === arr[1]);
        }
      } else {
        item = dataItems.find(x => x.code === rule.dataItemCode);
      }

      if (item) {
        if (item.type === DataItemType.Number) {
          rule.text = Number(rule.text);
        } else if (item.type === DataItemType.Logic) {
          rule.text = rule.text === 'true';
        }
      }

      const text = typeof rule.text === "string" ? `'${rule.text}'` : rule.text;

      const conditon = optionsMap.conditonOptions[rule.rule - 1].text;

      if (i > 0 && i < length) {
        this.data.propertyBarText = `${
          this.data.propertyBarText
        }${relationship}{${
          this.data.ruleList[i].dataItemCode
        }} ${conditon} ${text}`;
      } else {
        this.data.propertyBarText = `{${
          this.data.ruleList[i].dataItemCode
        }} ${conditon} ${text}`;
      }
    }

    const data = {
      value : this.data.propertyBarText
    };

    this.$emit("backData", data);
  }
  closeModal() {
    this.$emit("closeModal");
  }
  /**
   * 增加条件的时候,页面滚动到底部
   */
  addRow() {
    const el: any = this.$refs.condionwrap;
    const obj = {
      dataItemCode: "id",
      rule: 1,
      text: "",
      ruleOptions: this.otherConditonRule,
      type: 0,
      key: ((new Date()).getTime()).toString()
    };
    this.data.ruleList.push(obj);
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 10);
  }
  deleteRow(index: number) {
    this.data.ruleList.splice(index, 1);
    // this.data.ruleList = arr.filter((x, idx) => {
    //   return index !== idx;
    // })
  }
}
</script>

<style lang="less">
.required-condition-wrap {
  .condition-relation {
    margin-bottom: 16px;
    .select {
      width: 78px;
      margin: 0 4px;
    }
    .h {
      span {
        line-height: 32px;
      }
    }
    & > div {
      float: left;
    }
  }
  .add {
    color: @primary-color;
    text-align: center;
    cursor: pointer;
    span {
      margin-right: 8px;
    }
    margin-top: 16px;
  }
  .conditon-wrap {
    max-height: 264px;
    overflow: auto;
    .row {
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      & > div {
        float: left;
        .select {
          width: 136px;
          margin-right: 16px;
        }
        .w2{
           width: 106px;
        }
        .w1{
          width: 166px;
        }
        .input {
          width: 136px;
          margin-right: 10px;
        }
        .delete {
          line-height: 32px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
