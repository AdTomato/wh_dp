<template>
  <a-modal
    title="表单提交校验规则"
    :visible="true"
    width="566px"
    @cancel="closeModal"
    @ok="backData"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="verify-item">
      <div class="label">校验方式</div>
      <div class="content">
        <a-radio-group v-model="partterValue">
          <a-radio :value="1" style="width: 120px">常量</a-radio>
          <a-radio :value="2">动态值</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div class="verify-item" style="margin-top: 20px;margin-bottom: 20px;">
      <div class="label">校验规则
        <a-tooltip title="只能选择相同显示格式数据项">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </div>
      <div class="content">
        <a-select
          v-model="verifyRuleValue"
          style="width: 120px;flex-shrink:0"
        >
          <a-select-option
            v-for="item in rule"
            :key="item.value"
            :value="item.value"
          >{{ item.name }}</a-select-option>
        </a-select>
        <!-- 常量 校验方式 填值框 -->
        <div v-show="isQuantity" style="margin-left: 8px; flex: 1">
          <!--非介于-->
          <a-date-picker
            v-model="date"
            v-show="!isRangeRule"
            class="date-picker"
            style="width:100%"
            format="YYYY-MM-DD"
            :placeholder="$t('languages.PlaceHolder.Select')"
          />
          <!--介于-->
          <div
            class="content"
            v-show="isRangeRule"
            style="align-items: center">
            <a-range-picker
              v-model="rangeDate"
              format="YYYY-MM-DD"
              :placeholder="['请选择', '请选择']" />
          </div>
        </div>
        <!-- 动态值 校验方式 填值框 -->
        <div v-show="!isQuantity" style="margin-left: 8px;flex: 1 100%">
          <a-select
            placeholder="请选择数据项"
            v-model="dynamicTypeValue"
            @change="dynamicTypeValueHandleChange"
            style="width: 100%"
          >
            <a-select-option
              v-for="(item,index) in dynamicTypeSelectList"
              :key="index"
              :value="item.value"
            >{{ item.name }}</a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <!--如果是动态值-->
    <div
      class="verify-item"
      v-show="!isQuantity"
      style="margin-bottom: 20px">
      <div class="label"></div>
      <div class="content" v-show="isDynamicDay">
        <a-input-number
          v-show="!isRangeRule"
          style="width:100%"
          v-model="numInput"
          placeholder="请输入数字"
        />
        <div
          class="content"
          v-show="isRangeRule"
          style="align-items: center">
          <a-input-number
            v-model="numInput1"
            style="width:100%"
            placeholder="请输入数字" />
          <div style="margin: 0 6px;color:rgba(0,0,0,0.65);font-size: 14px;">~</div>
          <a-input-number
            v-model="numInput2"
            style="width:100%"
            placeholder="请输入数字" />
        </div>
      </div>
      <div class="content" v-show="!isDynamicDay">
        <!--非介于-->
        <a-select
          v-show="!isRangeRule"
          :value="selectDataItem"
          @change="selectDataItemHandleChange"
          placeholder="请选择数据项"
          style="width: 100%"
          allowClear
        >
          <a-select-option
            v-for="item in selectListDataItems"
            :key="item.id"
            :value="item.code"
          >{{ item.name }}</a-select-option>
        </a-select>
        <!--介于-->
        <div
          class="content"
          v-show="isRangeRule"
          style="align-items: center">
          <a-select
            placeholder="请选择数据项"
            :value="rangeSelectDataItem1"
            @change="rangeSelectDataItem1HandleChange"
            style="width: 100%"
            allowClear
          >
            <a-select-option
              v-for="item in selectListDataItems"
              :key="item.id"
              :value="item.code"
            >{{ item.name }}</a-select-option>
          </a-select>
          <div style="margin: 0 6px;color:rgba(0,0,0,0.65);font-size: 14px;">~</div>
          <a-select
            :value="rangeSelectDataItem2"
            @change="rangeSelectDataItem2HandleChange"
            placeholder="请选择数据项"
            style="width: 100%"
            allowClear
          >
            <a-select-option
              v-for="item in selectListDataItems"
              :key="item.id"
              :value="item.code"
            >{{ item.name }}</a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <div class="verify-item" style="margin-bottom: 20px;height: 84px;align-items: flex-start">
      <div class="label" style="margin-top: 5px">校验失败提示语</div>
      <div class="content">
        <a-textarea
          v-model="promptText"
          placeholder="请输入"
          :rows="4"
          maxlength="200"
          style="height: 84px" />
      </div>
    </div>
    <div class="verify-item">
      <div class="label">
        提示弹框
        <a-tooltip title="校验失败提示语字数较多时请使用长提示弹框">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </div>
      <div class="content">
        <a-radio-group v-model="errDialogboxType">
          <a-radio :value="1" style="width: 120px">短提示弹框</a-radio>
          <a-radio :value="2">长提示弹框</a-radio>
        </a-radio-group>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import moment from "moment";
import { message } from "h3-antd-vue";
import * as dataitemStore from "../stores/data-items.store-helper";
import { FormControlType } from "@cloudpivot/form/schema";
import { DataItemState } from "../stores/data-items.store";
const VerifyRule = [
  { name: "等于", value: "=" },
  { name: "大于", value: ">" },
  { name: "小于", value: "<" },
  { name: "大于等于", value: ">=" },
  { name: "小于等于", value: "<=" },
  { name: "介于", value: "~" }
];
enum VerifyRuleEnum {
  "=" = "等于",
  ">" = "大于",
  "<" = "小于",
  ">=" = "大于等于",
  "<=" = "小于等于",
  "~" = "介于"
}
interface IVerifyRuleItem {
  name: string;
  value: string;
}
interface IVerifyFunctionReturn {
  value: Object;
  status: boolean;
}
@Component({
  name: "VerifyFormulaDate"
})
export default class VerifyFormulaDate extends Vue {
  @Prop()
  dataItem!: any;
  @Prop()
  modalData!: any;

  @Prop()
  getFormControls!: any
  // 校验方式值 1/常量 2/动态值
  partterValue: 1 | 2 = 1;

  // 是否是常量模式
  get isQuantity() {
    return this.partterValue === 1;
  }

  // 校验规则 数组
  rule: IVerifyRuleItem[] = VerifyRule;

  // 校验规则当前值
  verifyRuleValue: string = "=";

  // 判断当前校验规则是否是 介于
  get isRangeRule() {
    return this.verifyRuleValue === "~";
  }

  dateFormat = "YYYY-MM-DD";
  date: any = null; // 常量下 非介于 数据
  rangeDate: any[] | any = null; // 常量下 介于 数据
  // 动态值 选择类型 数据项/当天加减
  dynamicTypeValue: number = 1;
  // 动态值 选择类型 list
  dynamicTypeSelectList = [
    {
      name: "数据项",
      value: 1
    },
    {
      name: "当天",
      value: 2
    }
  ];
  // 动态值 选择类型 值变化回掉方法
  dynamicTypeValueHandleChange() {}
  // 动态值 类型是 当天
  get isDynamicDay() {
    return this.dynamicTypeValue === 2;
  }

  // 动态值 非介于 值
  selectDataItem: any = [];
  selectDataItemHandleChange(val) {
    this.selectDataItem = val || '';
  }
  // 动态值 介于 第一个值
  rangeSelectDataItem1: any = [];
  rangeSelectDataItem1HandleChange(val) {
    this.rangeSelectDataItem1 = val || '';
  }
  // 动态值 介于 第二个值
  rangeSelectDataItem2: any = [];
  rangeSelectDataItem2HandleChange(val) {
    this.rangeSelectDataItem2 = val || '';
  }

  // 常数值 非介于 值
  numInput: number | "" = "";

  // 常数值 介于 第一个值
  numInput1: number | "" = "";

  // 常数值 介于 第二个值
  numInput2: number | "" = "";

  // 失败提示语
  promptText: string = "";
  // 校验常量模式下
  verifyQuantity(
    date: any,
    rangeDate: any[],
    rValue: Object
  ): IVerifyFunctionReturn {
    let value = '',
      status = true;
    if (!this.isRangeRule) {
      // 非介于!~ 规则
      if (date) {
        let t = moment(date).format(this.dateFormat);
        return { value: {...rValue, date:t}, status };
      }
    } else {
      // 介于~ 规则
      if (rangeDate && rangeDate.length) {
        let [l, r] = rangeDate;
        l = moment(l).format(this.dateFormat);
        r = moment(r).format(this.dateFormat);
        return { value: {...rValue,lDate:l, rDate:r}, status };
      }
    }
    return { value, status };
  }
  // 校验动态值 模式
  verifyDynamic(
    selectDataItem: string | [],
    rangeSelectDataItem1: string | [],
    rangeSelectDataItem2: string | [],
    numInput: number | "",
    numInput1: number | "",
    numInput2: number | "",
    rValue: Object
  ): IVerifyFunctionReturn {
    let value = '',
      status = true;
    if (this.isDynamicDay) {
      // 选择当天作为判断值
      if (!this.isRangeRule) {
        // 非介于!~ 规则
        if (
          ("" + numInput).length > 0 &&
          !/^[\+\-]?\d*?\.?\d*?$/.test("" + numInput)
        ) {
          message.error("校验规则不合法!");
          return { value, status: false };
        } else if (("" + numInput).length > 0) {
          return { value: {...rValue, day:1, input:numInput}, status };
        }
      } else {
        //  介于~ 规则
        if (("" + numInput1).length > 0 && ("" + numInput2).length == 0) {
          // 只填写左侧边界值
          message.error("请输入右侧边界值!");
          return { value, status: false };
        } else if (
          ("" + numInput1).length == 0 &&
          ("" + numInput2).length > 0
        ) {
          // 只填写右侧边界值
          message.error("请输入左侧边界值!");
          return { value, status: false };
        } else if (("" + numInput1).length > 0 && ("" + numInput2).length > 0) {
          // 左右边界值 都有填写
          if (!/^[\+\-]?\d*?\.?\d*?$/.test("" + numInput1)) {
            // 左侧边界值 格式不对
            message.error("校验规则,左侧边界值不合法!");
            return { value, status: false };
          } else if (!/^[\+\-]?\d*?\.?\d*?$/.test("" + numInput2)) {
            // 右侧边界值 格式不对
            message.error("校验规则,右侧边界值不合法!");
            return { value, status: false };
          }
          return {
            value: {...rValue, day:1, lInput:numInput1, rInput:numInput2},
            status
          };
        }
      }
    } else {
      // 选择数据项
      if (!this.isRangeRule) {
        // 非介于判断
        if (selectDataItem.length > 0) {
          // 如果大于0说明选择了值
          return { value: {...rValue,day:0,select:selectDataItem}, status };
        }
      } else {
        // 介于判断
        if (
          rangeSelectDataItem1.length > 0 &&
          rangeSelectDataItem2.length === 0
        ) {
          // 左侧边界有值 右边界没有
          message.error("请选择右侧边界值!");
          return { value, status: false };
        } else if (
          rangeSelectDataItem1.length === 0 &&
          rangeSelectDataItem2.length > 0
        ) {
          // 左侧边界没值, 右边界有值
          message.error("请选择左侧边界值!");
          return { value, status: false };
        } else if (
          rangeSelectDataItem1.length > 0 &&
          rangeSelectDataItem2.length > 0
        ) {
          return {
            value: {...rValue,day:0,lSelect:rangeSelectDataItem1,rSelect:rangeSelectDataItem2},
            status
          };
        }
      }
    }
    return { value, status };
  }
  // 失败提示语
  verifyPrompt(
    promptText: string,
    partterValue: number,
    verifyRuleValue: string,
    rValue: Object
  ): IVerifyFunctionReturn {
    if (promptText.length === 0) {
      // 没有填写 失败提示语,使用默认的提示语
      // 数据项名称+必须+等于/大于/小于/大于等于/小于等于/介于+校验规则
      if (partterValue === 1) {
        // 常量
        let v = "";
        if (this.isRangeRule) {
          let [l, r] = this.rangeDate;
          l = moment(l).format(this.dateFormat);
          r = moment(r).format(this.dateFormat);
          v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${l}~${r}`;
        } else {
          let t = moment(this.date).format(this.dateFormat);
          v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${t}`;
        }
        return { value: {...rValue,defaultPrompt:v}, status: true };
      } else {
        if (this.isDynamicDay) {
          //动态值 当天模式
          let v = "";
          if (this.isRangeRule) {
            // 介于 规则
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}`;
          } else {
            // 非介于 规则
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}`;
          }
          return { value: {...rValue,defaultPrompt:v}, status: true };
        } else {
          let v = "";
          if (this.isRangeRule) {
            // 介于 规则
            let [cname1] = this.dateControlOptions.filter(
              val => val.code === this.rangeSelectDataItem1
            );
            let [cname2] = this.dateControlOptions.filter(
              val => val.code === this.rangeSelectDataItem2
            );
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${cname1.name}~${cname2.name}`;
          } else {
            // 非介于 规则
            let [cname] = this.dateControlOptions.filter(
              val => val.code === this.selectDataItem
            );
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${cname.name}`;
          }
          return { value: {...rValue,defaultPrompt:v}, status: true };
        }
      }
    } else {
      let encodeText = encodeURIComponent(promptText)
      return { value: {...rValue,prompt:encodeText}, status: true };
    }
  }
  backData() {
    // let rValue = `type:${this.partterValue}_rule:${this.verifyRuleValue}_dialogBox:${this.errDialogboxType}`;
    let rValue:any = {type:this.partterValue,rule:this.verifyRuleValue,dialogBox:this.errDialogboxType};
    if (this.partterValue === 1) {
      let { value, status } = this.verifyQuantity(
        this.date,
        this.rangeDate,
        rValue
      );
      if (!status) return;
      rValue = value;
    } else {
      let { value, status } = this.verifyDynamic(
        this.selectDataItem,
        this.rangeSelectDataItem1,
        this.rangeSelectDataItem2,
        this.numInput,
        this.numInput1,
        this.numInput2,
        rValue
      );
      if (!status) return;
      rValue = value;
    }
    // 如果 校验规则 输入框或下拉框没有填写 则默认为 校验组件为空
    if (rValue) {
      let { value } = this.verifyPrompt(
        this.promptText,
        this.partterValue,
        this.verifyRuleValue,
        rValue
      );
      rValue = value;
      this.$emit("backData", { value: JSON.stringify(rValue) });
    } else {
      this.$emit("backData", { value: '' });
    }
  }
  closeModal() {
    this.$emit("closeModal");
  }
  isChild: boolean = false;
  // 下拉框选择的数据项
  selectListDataItems: any[] = [];
  // 反解析 值
  parseModalData(val: string) {
    if (this.isJSONString(val)) {
      let obj = JSON.parse(val)
      for(let key of Object.keys(obj)) {
        let v = obj[key]
        switch (key) {
          case "type":
            this.partterValue = +v as 1 | 2;
            break;
          case "rule":
            this.verifyRuleValue = v;
            break;
          case "lInput":
            this.numInput1 = +v as number;
            break;
          case "rInput":
            this.numInput2 = +v as number;
            break;
          case "input":
            this.numInput = +v as number;
            break;
          case "select":
            var st = (this.selectListDataItems.filter((item:any) => item.code === v).length)
            if (st) this.selectDataItem = v;
            break;
          case "lSelect":
            var st = (this.selectListDataItems.filter((item:any) => item.code === v).length)
            if (st) this.selectDataItem = v;
            this.rangeSelectDataItem1 = v;
            break;
          case "rSelect":
            var st = (this.selectListDataItems.filter((item:any) => item.code === v).length)
            if (st) this.selectDataItem = v;
            this.rangeSelectDataItem2 = v;
            break;
          case "prompt":
            this.promptText = decodeURIComponent(v);
            break;
          case "day":
            this.dynamicTypeValue = +v === 1 ? 2 : 1;
            break;
          case "date":
            this.date = moment(v);
            break;
          case "lDate":
            if (!this.rangeDate) this.rangeDate = [];
            this.rangeDate[0] = moment(v);
            break;
          case "rDate":
            if (!this.rangeDate) this.rangeDate = [];
            this.rangeDate[1] = moment(v);
            break;
          case 'dialogBox':
            this.errDialogboxType = (+v as 1|2)
            break
        }
      }
    } else {
      let arr = val.split("_");
      for (let value of arr) {
        let [key, v] = value.split(":");
        switch (key) {
          case "type":
            this.partterValue = +v as 1 | 2;
            break;
          case "rule":
            this.verifyRuleValue = v;
            break;
          case "lInput":
            this.numInput1 = +v as number;
            break;
          case "rInput":
            this.numInput2 = +v as number;
            break;
          case "input":
            this.numInput = +v as number;
            break;
          case "select":
            var st = (this.selectListDataItems.filter((item:any) => item.code === v).length)
            if (st) this.selectDataItem = v;
            break;
          case "lSelect":
            var st = (this.selectListDataItems.filter((item:any) => item.code === v).length)
            if (st) this.selectDataItem = v;
            this.rangeSelectDataItem1 = v;
            break;
          case "rSelect":
            var st = (this.selectListDataItems.filter((item:any) => item.code === v).length)
            if (st) this.selectDataItem = v;
            this.rangeSelectDataItem2 = v;
            break;
          case "prompt":
            this.promptText = decodeURIComponent(v);
            break;
          case "day":
            this.dynamicTypeValue = +v === 1 ? 2 : 1;
            break;
          case "date":
            this.date = moment(v);
            break;
          case "lDate":
            if (!this.rangeDate) this.rangeDate = [];
            this.rangeDate[0] = moment(v);
            break;
          case "rDate":
            if (!this.rangeDate) this.rangeDate = [];
            this.rangeDate[1] = moment(v);
            break;
          case 'dialogBox':
            this.errDialogboxType = (+v as 1|2)
            break
        }
      }
    }
  }
  isJSONString(str: string) {
    try {
      if (typeof JSON.parse(str) == "object") {
        return true;
      }
    } catch (e) {}
    return false;
  }
  currControlOptions:any = null
  dateControlOptions:any[] = []
    // 错误提示框 类型 1/短 2/对话框
  errDialogboxType: 1|2 = 1
  created() {
    this.isChild = !!this.dataItem.parentCode;
    let allControls = this.getFormControls();
    for(let key of Object.keys(allControls)) {
      let ctl = allControls[key]
      if (ctl.type === FormControlType.Date && key !== this.dataItem.code ) {
        this.dateControlOptions.push(Object.assign({},ctl.options,{code:key}))
      } else if (!this.currControlOptions && key === this.dataItem.code) {
        this.currControlOptions = ctl.options
      } else if (this.isChild && ctl.type === FormControlType.Sheet && this.dataItem.parentCode === key) {
        ctl.columns.forEach((subItem) => {
          if (subItem.type === FormControlType.Date) {
            if (subItem.key !==  this.dataItem.code) {
              this.dateControlOptions.push(Object.assign({},subItem.options,{code:key+'.'+subItem.key}))
            } else if (!this.currControlOptions && subItem.key === this.dataItem.code) {
              this.currControlOptions = subItem.options
            }
          }
        })
      }
    }
    this.selectListDataItems = this.dateControlOptions.filter((val) => val.format === (this.currControlOptions as any).format)
    this.modalData.data.value && this.parseModalData(this.modalData.data.value);
  }
}
</script>
<style lang="less">
.verify-item {
  display: flex;
  width: 100%;
  height: 32px;
  align-items: center;
  .label {
    width: 100px;
    flex-shrink: 0;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
  .content {
    display: flex;
    flex: 1;
  }
}
</style>