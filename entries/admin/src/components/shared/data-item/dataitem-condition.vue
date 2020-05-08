
<template>
  <div>
    <div class="row">
      满足以下
      <a-select
        v-model="type"
        @change="onChange"
        class="ml8 mr8"
      >
        <a-select-option :value="1">全部</a-select-option>
        <a-select-option :value="2">任一</a-select-option>
      </a-select>条件
    </div>

    <a-row
      type="flex"
      v-for="(cond,index) in conditions"
      :key="index"
    >
      <a-col :span="8">
        <a-select
          v-model="cond.propertyCode"
          @select="e => onItemSelect(cond)"
          @change="e => onItemChange(cond)"
        >
          <a-select-opt-group>
            <span slot="label" class="select-title">业务数据项</span>
            <template v-for="(i,index) in dataOptions">
              <a-select-option
                v-if="!i.isSystem"
                :key="index"
                :value="i.value"
              >{{ i.label }}</a-select-option>
            </template>
          </a-select-opt-group>
          <a-select-opt-group>
            <span slot="label" class="select-title">系统数据项</span>
            <template v-for="(i,index) in dataOptions">
              <a-select-option
                v-if="i.isSystem"
                :key="index"
                :value="i.value"
              >{{ i.label }}</a-select-option>
            </template>
          </a-select-opt-group>
        </a-select>
      </a-col>

      <a-col :span="6">
        <a-select
          :options="getOperators(cond.propertyType,cond.propertyCode)"
          v-model="cond.operatorType"
          @change="onChange"
        ></a-select>
      </a-col>

      <a-col :span="8" v-show="operatorAboutNull(cond.operatorType)"></a-col>

      <a-col :span="8" v-show="!operatorAboutNull(cond.operatorType)">
        <a-select v-if="isSequenceStatus(cond.propertyCode)" v-model="cond.value">
          <a-select-option :value="'PROCESSING'">进行中</a-select-option>
          <a-select-option :value="'CANCELED'">已取消</a-select-option>
          <a-select-option :value="'COMPLETED'">已完成</a-select-option>
        </a-select>
        <a-select v-else-if="showSelfInput(cond)" v-model="cond.value">
          <a-select-option value="SELF_P">本人</a-select-option>
          <a-select-option value="SELF_D">本部门</a-select-option>
        </a-select>
        <a-input
          v-else-if="isText(cond.propertyType) || isDate(cond.propertyType)"
          v-model="cond.value"
          :placeholder="isDate(cond.propertyType) ? '日期格式2019-05-10 12:00:00':''"
          @change="onChange"
        ></a-input>

        <a-input-number
          v-else-if="isNumber(cond.propertyType)"
          v-model="cond.value"
          @change="onChange"
        ></a-input-number>

        <!-- <a-date-picker
          v-else-if="isDate(cond.propertyType)"
          :defaultValue="cond.value"
          @change="(d,ds) => onDateChange(cond,ds)"
        ></a-date-picker>-->

        <a-select v-else-if="isLogic(cond.propertyType)" v-model="cond.value">
          <a-select-option value="1">true</a-select-option>
          <a-select-option value="0">false</a-select-option>
        </a-select>

        <!-- isSequenceStatus -->

        <staff-selector
          v-else-if="isStaffSelector(cond.propertyType)"
          v-model="cond.value"
          :options="getStaffSelectorOpts(cond)"
          @change="onChange"
        ></staff-selector>
      </a-col>

      <a-col :span="1">
        <a-icon type="delete" @click="remove(index)"></a-icon>
      </a-col>
    </a-row>

    <div class="actions">
      <!--<a-button icon="plus" @click="add">新增条件</a-button>-->
      <span @click="add" class="add-new">
        <i class="icon aufontAll h-icon-all-plus-o"></i>新增条件
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

import { DataItemType, NumberFormatType } from "@cloudpivot/form/schema";

import StaffSelector from "@cloudpivot/form/src/renderer/components/shared/staff-selector.vue";

import { Select, Row, Col } from "h3-antd-vue";
import {
  businessDataItemOperators,
  textDataItemOperators,
  systemTextDataItemOperators,
  numberDataItemOperators,
  logicDataItemOperators,
  DataItem,
  DateItemOperatorType,
  sequenceStatusOperators,
  staffDataItemOperators,
  bussinessStaffDataItemOperators
} from "./data-item";
export interface DataitemConditionItem {
  propertyCode: string;

  propertyType: DataItemType;

  operatorType: DateItemOperatorType;

  value: any;
}

export interface DataitemConditionValue {
  type: number;

  conditions: DataitemConditionItem[];
}

@Component({
  name: "dataitem-condition",
  components: {
    ASelect: Select,
    ARow: Row,
    ACol: Col,
    ASelectOption: Select.Option,
    StaffSelector
  }
})
export default class DataitemCondition extends Vue {
  @Prop()
  items!: Array<DataItem>;

  @Model("change")
  value!: DataitemConditionValue;

  type = 1;

  conditions: DataitemConditionItem[] = [];

  dataOptions: {
    label: string;
    value: string;
    type: DataItemType;
    disabled: boolean;
  }[] = [];

  staffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: "请选择组织"
  };
  showSelfInput(cond: DataitemConditionItem){
    const item: any = this.dataOptions.find(x => x.value === cond.propertyCode);
    if (!item) return false;
    let res = item.type === DataItemType.StaffSelector && !item.isSystem;
    // 设置默认值
    // if (res) {
    //   cond.value = 'SELF_P'
    // }
    return res;
    // return !item.isSystem && item.
  }
  getStaffSelectorOpts(cond: DataitemConditionItem) {
    const opts = Object.assign({}, this.staffSelectorOpts);
    if (
      cond.operatorType === DateItemOperatorType.Of ||
      cond.operatorType === DateItemOperatorType.NotOf
    ) {
      opts.selectUser = false;
      // opts.mulpitle = false;
    }
    // else if(cond.operatorType === DateItemOperatorType.Have || cond.operatorType === DateItemOperatorType.NotHave){
    //   // opts.selectOrg = false;
    //   opts.mulpitle = true;
    // }
    return opts;
  }

  getOperators(type: DataItemType, code: string) {
    let dataItemOperators: any[] = [];

    const item = this.items.find(x => x.code === code);
    if (!item) {
      return;
    }

    const isSystem = item.isSystem;

    switch (type) {
      case DataItemType.Number:
      case DataItemType.Date:
        dataItemOperators = numberDataItemOperators;
        break;

      case DataItemType.Logic:
        dataItemOperators = logicDataItemOperators;
        break;

      case DataItemType.ShortText:
      case DataItemType.LongText:
        if (code === "sequenceStatus") {
          dataItemOperators = sequenceStatusOperators;
        } else {
          dataItemOperators = textDataItemOperators;
        }
        break;

      case DataItemType.StaffSelector:
        dataItemOperators = staffDataItemOperators;
        break;
    }

    if (isSystem) {
      dataItemOperators = dataItemOperators.filter(
        (op: any) => !this.operatorAboutNull(op.value)
      );
    }
    // 迭代26 业务数据新增选人控件
    if (type === DataItemType.StaffSelector && !isSystem) {
      dataItemOperators = bussinessStaffDataItemOperators;
    }
    // const arr = ["id","name","creater","createdDeptId","owner","ownerDeptId","createdTime","modifier","modifiedTime","workflowInstanceId","sequenceNo","sequenceStatus","ownerDeptQueryCode"];
    // if(arr.indexOf(code)=== -1){
    //   dataItemOperators = businessDataItemOperators.concat(dataItemOperators);
    // }
    return dataItemOperators;
  }

  getOperatorsByCode(code: string) {
    switch (code) {
      case "sequenceStatus":
        return sequenceStatusOperators;
    }
  }

  isText(type: DataItemType) {
    return (
      type === DataItemType.ShortText || type === DataItemType.LongText
      //  || type === DataItemType.StaffSelector
    );
  }

  isNumber(type: DataItemType) {
    return type === DataItemType.Number;
  }

  isDate(type: DataItemType) {
    return type === DataItemType.Date;
  }

  isLogic(type: DataItemType) {
    return type === DataItemType.Logic;
  }

  isStaffSelector(type: DataItemType) {
    return type === DataItemType.StaffSelector;
  }

  isSequenceStatus(code: string) {
    // debugger
    return code === "sequenceStatus";
  }

  operatorAboutNull(type: DateItemOperatorType) {
    return (
      type === DateItemOperatorType.IsNull ||
      type === DateItemOperatorType.IsNotNull
    );
  }

  @Watch("items", {
    immediate: true
  })
  onItemsChange(items: DataItem[]) {
    if (items) {
      setTimeout(() => {
        // console.log('items::',items);
        this.dataOptions = items
          .filter(
            item =>
              item.type !== DataItemType.Attachment &&
              item.type !== DataItemType.ApprovalOpinion &&
              item.type !== DataItemType.Sheet &&
              item.type !== DataItemType.RelevanceForm &&
              // && item.type !== DataItemType.StaffSelector
              item.type !== DataItemType.Address
          )
          .map(item => {
            let disabled = false;

            if (this.conditions) {
              this.conditions
                .filter((co: any) => co.propertyCode === item.code)
                .forEach((co: any) => {
                  co.propertyType = item.type;
                  disabled = true;
                });
            }

            return {
              value: item.code,
              label: `${item.name}[${item.code}]`,
              type: item.type,
              isSystem: item.isSystem,
              disabled
            };
          });
        // console.log('data::',JSON.stringify(this.dataOptions));
        // this.add();
      }, 10);
    }
  }

  @Watch("value", {
    immediate: true
  })
  onValueChange(val: DataitemConditionValue) {
    if (!val) {
      return;
    }

    if (val.type) {
      this.type = val.type;
    }

    if (val.conditions) {
      this.conditions = val.conditions.slice(0);
    } else {
      this.conditions = [];
    }
  }

  add() {
    const item = this.dataOptions.find(op => !op.disabled);
    if (!item) {
      return;
    }

    const operators = this.getOperators(item.type, item.value);
    if (!operators) {
      return;
    }

    item.disabled = true;

    this.conditions.push({
      propertyCode: item.value,
      propertyType: item.type,
      operatorType: operators[0].value,
      value: ""
    });

    this.onChange();
  }

  remove(index: number) {
    const item = this.dataOptions.find(
      op => op.value === this.conditions[index].propertyCode
    );
    if (item) {
      item.disabled = true;
    }

    this.conditions.splice(index, 1);
    this.onChange();
  }

  onItemSelect(cond: DataitemConditionItem) {
    const item = this.dataOptions.find(x => x.value === cond.propertyCode);
    if (item) {
      item.disabled = false;
    }
  }

  onItemChange(cond: DataitemConditionItem) {
    const item = this.dataOptions.find(x => x.value === cond.propertyCode);
    if (item) {
      if (cond.propertyType !== item.type) {
        cond.value = item.type === DataItemType.StaffSelector ? [] : "";
      }
      cond.propertyType = item.type;

      const operators = this.getOperators(item.type, item.value);
      if (operators) {
        cond.operatorType = operators[0].value;
      }

      item.disabled = true;
    }
    this.onChange();
  }

  onDateChange(cond: DataitemConditionItem, dateText: string) {
    cond.value = dateText;
    this.onChange();
  }

  onChange() {
    const value = {
      type: this.type,
      conditions: this.conditions
    };

    this.$emit("change", value);
  }

  /**
   * 选人控件placeholder多语言
   */
  placeHolderLang() {
    this.staffSelectorOpts.placeholder = this.$t(
      "Languages.Apps.PlzSetOrgOrUser"
    ) as string;
  }

  @Watch("$i18n.locale")
  onLanguageChange(l: string) {
    this.placeHolderLang();
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-row-flex {
  margin: 20px 0;

  & > div > *:not(i) {
    width: 100%;
  }
}

/deep/.ant-col-6,
/deep/.ant-col-8 {
  display: flex;
  // align-items: center;
  padding-right: 10px;
}

/deep/.ant-col-1 {
  display: flex;
  padding-top: 0.5em;
  // align-items: center;
  // justify-content: center;

  & > i {
    cursor: pointer;
  }
}

.row {
  display: flex;
  align-items: center;
}

.actions {
  text-align: center;
  .add-new {
    font-size: 14px;
    color: @primary-color;
    cursor: pointer;
    i {
      padding-right: 5px;
      font-size: 14px;
    }
  }
  & > button {
    border: 0;
  }
}
.ml8 {
  margin-left: 8px;
}

.mr8 {
  margin-right: 8px;
}
</style>
