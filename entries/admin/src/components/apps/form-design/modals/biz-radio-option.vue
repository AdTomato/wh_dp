<template>
  <a-modal
    :title="$t('languages.Apps.FormDesignPage.OptionSetting')"
    width="536px"
    :visible="true"
    @cancel="closeModal"
    @ok="handleOk"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    class="modal"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="option-wrap">
      <a-row class="radio-row">
        <a-col :span="6">选项来源</a-col>
        <a-col :span="18" class="radio-col">
          <a-radio-group name="radioGroup" v-model="optionsType">
            <a-radio :value="1">自定义</a-radio>
            <a-radio :value="2">业务模型</a-radio>
          </a-radio-group>
        </a-col>
      </a-row>
    </div>
    <div class="add-option-wrap" v-if="optionsType ===1 ">
      <a-row>
        <a-col :span="6">选项</a-col>
        <a-col :span="18">
          <div class="radio-group" ref="condionwrap">
            <a-radio-group :defaultValue="defaultValue" @change="radioChange">
              <div
                v-for="(modulem, index) in options"
                :key="index"
                class="radio-item-wrap clearfix"
              >
                <div class="radio-wrap">
                  <a-radio class="radio-item" :value="index"></a-radio>
                </div>
                <div class="input-wrap">
                  <a-input
                    v-if="filterType === 1"
                    :placeholder="$t('languages.Apps.FormDesignPage.Placeholder.InputOptionName')"
                    class="input"
                    v-model="modulem.value"
                  />
                  <a-input
                    v-else
                    :placeholder="$t('languages.Apps.FormDesignPage.Placeholder.InputOptionName')"
                    class="input"
                    v-model="modulem.value"
                    maxlength="200"
                    @change="inputChange(index)"
                  />
                </div>
                <div class="delete-wrap">
                  <span class="delete" @click="deleteRow(index)">
                    <i class="icon aufontAll h-icon-all-delete-o"></i>
                  </span>
                </div>
              </div>
            </a-radio-group>
          </div>
        </a-col>
      </a-row>
      
      <div class="add" @click="addRow">
        <span>
          <i class="icon aufontAll h-icon-all-plus-o"></i>
        </span>
        <span>{{ $t('languages.Apps.FormDesignPage.AddOptins') }}</span>
      </div>
    </div>
    <div v-else>
      <a-row>
        <a-col :span="6">选择业务模型</a-col>
        <a-col :span="18">
          <biz-models-selector
            :appCode="appCode"
            :value="bizModel"
            :folderId="appFunctionCode"
            @change="onTreeChange"
            @select="onTreeSelect"
          />
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="6">选择数据项</a-col>
        <a-col :span="18">
          <a-select style="width: 100%" :disabled="!bizModel" v-model="sheetDataItem">
            <template
              v-for="item in targetDataItems"
            >
              <a-select-option
                :value="item.code"
                :key="item.code"
                v-if="item.propertyType === filterType"
              >{{ item.name }}</a-select-option>
            </template>
            
          </a-select>
        </a-col>
      </a-row>

      <a-row>
        <a-col :span="6">查询条件</a-col>
        <a-col :span="18" class="condition-col">
          <a-row v-show="conditionList.length>0">
            <a-col :span="8">查询数据项</a-col>
            <a-col :span="8">函数</a-col>
            <a-col :span="8">当前表单数据项</a-col>
          </a-row>
          <div
            v-for="(condition, index) in conditionList"
            :key="condition.key"
            class="select-wrap"
          >
            <!-- 绑定表单的查询条件 -->
            <a-select
              :disabled="!bizModel"
              v-model="condition.target.val"
              @change="rowChange(condition,true)"
            >
              <a-select-option
                v-for="item in condition.target.listOpt"
                :value="item.code"
                :key="item.code"
              >{{ `${item.name}[${item.code}]` }}</a-select-option>
            </a-select>
            <!-- 操作符号 -->
            <a-select v-model="condition.operator.val">
              <a-select-option
                v-for="(item,index) in condition.operator.listOpt"
                :key="index"
                value="item.type"
              >{{ item.val }}</a-select-option>
            </a-select>
            <!-- 当前表单的 -->
            <a-select :disabled="!condition.target.val" v-model="condition.current.val">
              <a-select-option
                v-for="item in condition.current.listOpt"
                :value="item.code"
                :key="item.code"
              >{{ `${item.name}[${item.code}]` }}</a-select-option>
            </a-select>
            <div class="delete-wrap">
              <span class="delete" @click="deleteCondition(index)">
                <i class="icon aufontAll h-icon-all-delete-o"></i>
              </span>
            </div>
          </div>

          <div class="add" @click="()=>{this.addCondition()}">
            <span>
              <i class="icon aufontAll h-icon-all-plus-o"></i>
            </span>
            <span>{{ $t('languages.Apps.FormDesignPage.AddOptins') }}</span>
          </div>
        </a-col>
      </a-row>
    </div>

  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit } from "vue-property-decorator";
import { sliceString } from "@/common/utils";
import BizModelsSelector from "@/components/global/biz-models-selector/index.vue";
import { components } from "@cloudpivot/h3-list";
import * as dataitemStore from "../stores/data-items.store-helper";
import { DataItemState } from "../stores/data-items.store";

import { listApi } from "@cloudpivot/api";

@Component({
  name: "AddRadioModal",
  components: {
    BizModelsSelector
  }
})
export default class AddRadioModal extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;

  @Prop({
    default: () => ({})
  })
  dataItem!: DataItemState;

  optionsType = 1;

  filterType = 0;

  bizModel = '';

  targetDataItems:any[] = [];

  currentDataItems:any = [];

  sheetDataItem = '';

  filtersType = [6,7,8,10];


  operator = [
    {
      type: '==',
      val: '=='
    }
  ]

  conditionList:any[] = [
  ]

  onTreeChange(val) {
    this.bizModel = val;
    this.sheetDataItem = '';
    this.getTargetItem(this.bizModel).then(res => {
      this.addCondition();
    });
  }
  appCode = '';
  appFunctionCode = '';
  onTreeSelect(val) {
    this.appCode = val[0]
    if (val.length > 2) {
      this.appFunctionCode = val[1];
    }
  }
 

  mounted() {
    const _items = dataitemStore.getDataItems(this).filter(x => x.used);

    let items = JSON.parse(JSON.stringify(_items));
    
    if (this.dataItem && this.dataItem.type === 1) {
      this.filterType = 1;
    }

    if (this.dataItem.parentCode) {
      const sheet = items.find(x => x.code === this.dataItem.parentCode);
      if (sheet && sheet.properties) {
        const sheetItems = sheet.properties.filter(
          (x: any) => {
            const flag = x.used && x.code !== this.dataItem.code;
            x.code = `${this.dataItem.parentCode}.${x.code}`;
            return flag;
          }
        ) as any;
        items = items.concat(sheetItems);
      }
    }
    
    this.currentDataItems = items.filter(res => res.type !== 8);
  }

  getTargetItem(schemaCode:string) {
    return new Promise((resolve, reject) => {
      const params = {
        schemaCode,
      }
      listApi.getDataItemList(params).then((res:any) => {
        let data:any[] = [];
        if (res.status || res.data.errcode === 0) {
          data = res.data.data;
        }
        if (res.errcode === 0) {
          data = res.data;
        };
        this.targetDataItems = data.filter(item => {
          return !this.filtersType.includes(item.propertyType);
        });
        this.conditionList = [];
        resolve();
      })
    }) 
  }

  rowChange(row:any,isClear?:boolean) {
    if (!row.target.val) {
      return;
    }
    const cur = JSON.parse(JSON.stringify(this.currentDataItems));
    const tar:any = row.target.listOpt.find(res => {
      return res.code === row.target.val;
    });
    if (isClear) {
      row.current.val = "";
    }
    row.current.listOpt = cur.filter(item => {
      if (item.type === 9) {
        return (item.type === tar.propertyType && item.relativeCode === tar.relativeCode);
      } else {
        return item.type === tar.propertyType;
      }
      
    });
  }

  addCondition(val?:any) {
    const cur = this.currentDataItems;
    const tar = this.targetDataItems;
    const op = this.operator;
    const item = {
      target: {
        val: val?val.target:'',
        listOpt: this.deepCopy(tar)
      },
      operator: {
        val: val?val.operator:'==',
        listOpt: this.deepCopy(op)
      },
      current: {
        val: val?val.current:'',
        listOpt: this.deepCopy(cur)
      },
      key: +new Date()
    }
    this.rowChange(item, false);
    this.conditionList.push(item);
  }

  deleteCondition(index:number) {
    this.conditionList.splice(index,1);
  }

  deepCopy(item) {
    const str = JSON.stringify(item);
    return JSON.parse(str);
  }

  options: Array<any> = [
    {
      default: true,
      value: ''
    },
    {
      default: false,
      value: ''
    },
    {
      default: false,
      value: ''
    }
  ];
  defaultValue: number = -1;
  hasDefault = false;
  created() {
    const data = this.modalData.data;
    if (data.value) {
      try {
        const obj = JSON.parse(data.value);
        this.setBizmodel(data);
        this.optionsType = 2;
        this.hasDefault = true;
      } catch {
        this.setCustom(data);
        this.optionsType = 1;
      }
      
    }
  }

  setCustom(data:any) {
    this.options = data.value
      .split(";")
      .filter((s: string) => s.length)
      .map((s: string, index: number) => ({
        default: false,
        value: s
      }));
    if (data.default) {
      data.default
        .split(";")
        .filter((s: string) => s.length)
        .forEach((s: string) => {
          const opt = this.options.find(x => x.value === s );
          if (opt) {
            opt.default = true;
          }
        });
    }

    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].default) {
        this.defaultValue = i;
        break;
      }
    }

  }

  setBizmodel(data:any) {
    const obj:any = JSON.parse(data.value);
    this.bizModel = obj.schemaCode;
    this.sheetDataItem = obj.sheetDataItem;
    this.appCode = obj.appCode;
    this.appFunctionCode = obj.appFunctionCode;
    this.getTargetItem(this.bizModel).then(res => {
      if (obj.condition) {
        const op =  obj.condition.split('&&').forEach(condition => {
          const arr = condition.split(' ');
          const item = {
            target: arr[0],
            operator: arr[1],
            current: arr[2]
          }
          this.addCondition(item);
        });
      }
      
    })
  }
  /**
   * 弹框关闭
   */
  closeModal() {
    this.$emit("closeModal");
  }
  /**
   * 将数据传出
   */
  handleOk() {
    let backData:any = '';
    if (this.optionsType === 1) {
      backData = this.customBack();
    } else {
      backData = this.bizmodeBack();
      if (!backData) {
        return;
      }
    }

    this.$emit("backData", backData);
  }
  // 自定义数据类型
  customBack() {
    // const op = this.options.filter(
    //   x => x.value.en || x.value.zh
    // ).map(x => {
    //   if (!x.value.en) {
    //     x.value.en =  x.value.zh;
    //   } 
    //   if (!x.value.zh) {
    //     x.value.zh = x.value.en;
    //   }
    //   return x;
    // })

   

    // const zh_val = op.map(x => x.value.zh).join(';');

    // const en_val = op.map(x => x.value.en).join(';');

    const value = this.options
      .filter(x => x.value)
      .map(x => x.value)
      .join(";");

    const defaultValue = this.options
      .filter(x => x.value && x.default)
      .map(x => x.value)
      .join(";");


    // const defaultValue = op.filter(x => x.default).map(x => x.value.zh).join(';');

    const backData = {
      value: value,
      default: defaultValue
    };

    return backData;
  }
  bizmodeBack() {
    if(!this.bizModel) {
      this.$message.error("业务模型不能为空");
      return false
    }
    if(!this.sheetDataItem) {
      this.$message.error("数据项不能为空");
      return false
    }
    if (this.conditionList.length > 0) {
      const flag = this.conditionList.some(cond => {
        return !cond.target.val || !cond.operator.val || !cond.current.val;
      });
      if (flag) {
        this.$message.error("条件配置项不能为空");
        return false
      }
    }

    const condition = this.conditionList.map(res => {
      return `${res.target.val} ${res.operator.val} ${res.current.val}`;
    }).join('&&');
    let string = `schemaCode:${this.bizModel} sheetDataItem:${this.sheetDataItem} condition:${condition}`;
    const obj = {
      schemaCode: this.bizModel,
      sheetDataItem: this.sheetDataItem,
      appCode: this.appCode,
      appFunctionCode: this.appFunctionCode,
      condition,
    }
    return {
      value: JSON.stringify(obj),
      default: ''
    }
  }
  /**
   * 增加行
   */
  addRow() {
    const el: any = this.$refs.condionwrap;
    const obj = {
      default: this.options.length === 0 ? true : false,
      value: ''
    };
    this.options.push(obj);
    setTimeout(() => {
      el.scrollTop = el.scrollHeight;
    }, 10);
  }
  /**
   * 删除行
   */
  deleteRow(index: number) {
    this.options.splice(index, 1);
  }
  /**
   * 单选框改变回调
   */
  radioChange(e: any) {
    this.defaultValue = parseInt(e.target.value, 10);
    const optionsLength = this.options.length;
    for (let i = 0; i < optionsLength; i += 1) {
      this.options[i].default = false;
    }
    this.options[this.defaultValue].default = true;
  }
  inputChange(index: number) {
    this.options[index].value = sliceString(this.options[index].value, 200);
  }

  get locale() {
    return this.$i18n.locale || "zh";
  }
}
</script>
<style lang="less" scoped>
.ant-row{
  margin-bottom: 20px;
  .ant-col-6{
    line-height: 32px;
  }
  // .ant-col-18{
  //   // line-height: 32px;
  // }
  .radio-col{
    line-height: 32px;
    .ant-radio-wrapper{
      margin-right: 42px;
    }
  }
  .condition-col {
    .ant-select {
      margin-right: 8px;
      width: 106px;
    }
    .delete-wrap{
      float: right;
      line-height: 32px;
    }
    .select-wrap{
      margin-bottom: 20px;
    }
    .add {
      color: @primary-color;
      text-align: center;
      // margin-top: 20px;
      margin-right: 24px;
      cursor: pointer;
      span {
        margin-right: 8px;
      }
    }
  }
}
.add-option-wrap {
  // margin-right: -24px;
  min-height: 200px;
  overflow: hidden;
  .add {
    color: @primary-color;
    text-align: center;
    margin-right: 24px;
    cursor: pointer;
    span {
      margin-right: 8px;
    }
  }
  .radio-group {
    max-height: 254px;
    overflow: auto;
    /deep/.ant-radio-wrapper {
      margin-right: 0;
    }
    .input {
      width: 240px;
    }
    .delete {
      // float: right;
      margin-left: 8px;
    }
    .radio-item-wrap {
      margin-bottom: 16px;
      & > div {
        float: left;
      }
      .input-wrap {
        margin-left: 8px;
      }
      .radio-wrap,
      .delete-wrap {
        margin-top: 4px;
      }
    }
  }
}
</style>
