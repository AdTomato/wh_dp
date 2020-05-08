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
      <div class="label">校验规则</div>
      <div class="content">
        <a-select
          v-model="verifyRuleValue"
          style="width: 120px;flex-shrink:0"
        >
          <a-select-option
            v-for="item in rule"
            :key="item.value"
            :value="item.value">
            {{ item.name }}
          </a-select-option>
        </a-select>
        <!-- 常量 校验方式 填值框 -->
        <div v-show="isQuantity" style="margin-left: 8px;">
          <!--非介于-->
          <a-input-number
            v-show="!isRangeRule"
            style="width:100%"
            v-model="numInput"
            placeholder="请输入"/>
          <!--介于-->
          <div
            class="content"
            v-show="isRangeRule"
            style="align-items: center">
            <a-input-number
              v-model="numInput1"
              style="width:100%"
              placeholder="请输入"/>
            <div style="margin: 0 6px;color:rgba(0,0,0,0.65);font-size: 14px;">~</div>
            <a-input-number
              v-model="numInput2"
              style="width:100%"
              placeholder="请输入"/>
          </div>
        </div>
        <!-- 动态值 校验方式 填值框 -->
        <div v-show="!isQuantity" style="margin-left: 8px;flex: 1 100%">
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
              :value="item.code">
              {{ item.name }}
            </a-select-option>
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
            >
              <a-select-option
                v-for="item in selectListDataItems"
                :key="item.id"
                :value="item.code">
                {{ item.name }}
              </a-select-option>
            </a-select>
            <div style="margin: 0 6px;color:rgba(0,0,0,0.65);font-size: 14px;">~</div>
            <a-select
              :value="rangeSelectDataItem2"
              @change="rangeSelectDataItem2HandleChange"
              placeholder="请选择数据项"
              style="width: 100%"
            >
              <a-select-option
                v-for="item in selectListDataItems"
                :key="item.id"
                :value="item.code">{{ item.name }}</a-select-option>
            </a-select>
          </div>
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
import {message} from 'h3-antd-vue'
import { FormControlType } from "@cloudpivot/form/schema";
import * as dataitemStore from "../stores/data-items.store-helper";
import { DataItemState } from "../stores/data-items.store";
const VerifyRule = [
  {name:'等于',value:'='},
  {name:'大于',value:'>'},
  {name:'小于',value:'<'},
  {name:'大于等于',value:'>='},
  {name:'小于等于',value:'<='},
  {name:'介于',value:'~'},
]
enum VerifyRuleEnum {
  '='='等于',
  '>'='大于',
  '<'='小于',
  '>='='大于等于',
  '<='='小于等于',
  '~'='介于',
}
interface IVerifyRuleItem {
  name: string
  value: Object
}
interface IVerifyFunctionReturn {
  value: Object
  status: boolean
}
@Component({
  name: "VerifyFormulaNumber",
})
export default class VerifyFormulaNumber extends Vue{
  @Prop()
  dataItem!: any
  @Prop()
  modalData!: any

  @Prop()
  getFormControls!: any

  // 校验方式值 1/常量 2/动态值
  partterValue: 1|2 = 1

  // 是否是常量模式
  get isQuantity () {
    return this.partterValue === 1
  }
  // 校验规则 数组
  rule: IVerifyRuleItem[] = VerifyRule
  // 校验规则当前值
  verifyRuleValue: string = '='

  // 判断当前校验规则是否是 介于
  get isRangeRule() {
    return this.verifyRuleValue === '~'
  }
  closeModal() {
    this.$emit("closeModal");
  }

  // 校验 常量的 input 输入是否正确
  verifyNumInput(numInput: any, numInput1:any, numInput2:any, rValue:Object):IVerifyFunctionReturn {
    let value = '', status = true;
    if (!this.isRangeRule) { // 非介于 规则
      if ((''+numInput).length > 0&&!/^[\+\-]?\d*?\.?\d*?$/.test(numInput)) {
        message.error('校验规则不合法!')
        return{value,status:false}
      } else if ((''+numInput).length > 0) {
        return {value:{...rValue,input:numInput}, status}
      }
    } else { // 介于 规则
      if ((''+numInput1).length > 0 && (''+numInput2).length == 0) {
        // 只填写左侧边界值
        message.error('请输入右侧边界值!')
        return{value,status:false}
      } else if ((''+numInput1).length == 0 && (''+numInput2).length > 0) {
        // 只填写右侧边界值
        message.error('请输入左侧边界值!')
        return{value,status:false}
      } else if((''+numInput1).length > 0 && (''+numInput2).length > 0) { // 左右边界值 都有填写
        if (!/^[\+\-]?\d*?\.?\d*?$/.test(numInput1)) {
          // 左侧边界值 格式不对
          message.error('校验规则,左侧边界值不合法!')
          return{value,status:false}
        } else if(!/^[\+\-]?\d*?\.?\d*?$/.test(numInput2)) {
          // 右侧边界值 格式不对
          message.error('校验规则,右侧边界值不合法!')
          return{value,status:false}
        }
        return {value: {...rValue,lInput:numInput1,rInput:numInput2},status}
      }
    }
    return{value,status}
  }

  // 校验 动态值 select下拉选择状态
  verifySelect(selectDataItem:string|[],rangeSelectDataItem1:string|[],rangeSelectDataItem2:string|[], rValue):IVerifyFunctionReturn {
    let value = '', status = true
    if (!this.isRangeRule) { // 非介于判断
      if (selectDataItem.length > 0) { // 如果大于0说明选择了值
        let item = this.selectListDataItems.find((val) => val.code === selectDataItem)
        if (item.parentCode) {
          return {value:{...rValue,select:selectDataItem}, status}
        } else {
          return {value:{...rValue,select:selectDataItem}, status}
        }
      }
    } else { // 介于判断
        if (rangeSelectDataItem1.length > 0 && rangeSelectDataItem2.length === 0) {
          // 左侧边界有值 右边界没有
          message.error('请选择右侧边界值!')
          return {value, status: false}
        } else if (rangeSelectDataItem1.length === 0 && rangeSelectDataItem2.length > 0) {
          // 左侧边界没值, 右边界有值
          message.error('请选择左侧边界值!')
          return {value, status: false}
        } else if (rangeSelectDataItem1.length > 0 && rangeSelectDataItem2.length > 0) {
          return{value:{...rValue,lSelect:rangeSelectDataItem1,rSelect:rangeSelectDataItem2}, status}
        }
    }
    return{value,status}
  }
  // 校验失败提示语
  verifyPrompt(promptText: string,partterValue: number, verifyRuleValue:string, rValue:Object):IVerifyFunctionReturn {
    if(promptText.length === 0) {
      // 没有填写 失败提示语,使用默认的提示语
      // 数据项名称+必须+等于/大于/小于/大于等于/小于等于/介于+校验规则
      if (partterValue === 1) { // 常量
        let v = ''
          if (this.isRangeRule) { // 介于 规则
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${this.numInput1}~${this.numInput2}`
          } else { // 非介于 规则
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${this.numInput}`
          }
          return {value:{...rValue,defaultPrompt:v}, status: true}
      } else { // 动态值
        let v = ''
          if (this.isRangeRule) { // 介于 规则
            let [cname1] = this.selectListDataItems.filter((val) => val.code === this.rangeSelectDataItem1)
            let [cname2] = this.selectListDataItems.filter((val) => val.code === this.rangeSelectDataItem2)
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${cname1.name}~${cname2.name}`
          } else { // 非介于 规则
          let [cname] = this.selectListDataItems.filter((val) => val.code === this.selectDataItem)
            v = `${this.currControlOptions.name as any}必须${VerifyRuleEnum[verifyRuleValue]}${cname.name}`
          }
          return {value:{...rValue,defaultPrompt:v}, status: true}
      }
    } else {
      let encodeText = encodeURIComponent(promptText)
      return {value:{...rValue,prompt:encodeText}, status: true}
    }
  }
  backData() {
    let rValue:any = {type:this.partterValue,rule:this.verifyRuleValue,dialogBox:this.errDialogboxType}
    if (this.partterValue === 1) {
      let {value, status} = this.verifyNumInput(this.numInput,this.numInput1,this.numInput2,rValue)
      if (!status) return
      rValue = value
    } else {
      let {value, status} = this.verifySelect(this.selectDataItem,this.rangeSelectDataItem1,this.rangeSelectDataItem2,rValue)
      if (!status) return
      rValue = value
    }
    // 如果校验规则 选择框或输入框没有内容,默认值为 空
    if (rValue) {
      let {value} = this.verifyPrompt(this.promptText, this.partterValue,this.verifyRuleValue, rValue)
      rValue = value
      this.$emit("backData", {value: JSON.stringify(rValue)});
    } else {
      this.$emit("backData", {value: ''});
    }
  }
  // 是否是 子表的 数值类型输入框
  isChild:boolean = false
  // 下拉框选择的数据项
  selectListDataItems:any[] = []

  // 动态值 非介于 值
  selectDataItem:any = []
  selectDataItemHandleChange(val) {
    this.selectDataItem = val || ''
  }
  // 动态值 介于 第一个值
  rangeSelectDataItem1:any = []
  rangeSelectDataItem1HandleChange (val) {
    this.rangeSelectDataItem1 = val || ''
  }
  // 动态值 介于 第二个值
  rangeSelectDataItem2:any = []
  rangeSelectDataItem2HandleChange (val) {
    this.rangeSelectDataItem2 = val || ''
  }
  // 常数值 非介于 值
  numInput:number|'' = ''

  // 常数值 介于 第一个值
  numInput1:number|'' = ''

  // 常数值 介于 第二个值
  numInput2:number|'' = ''
  // 失败提示语
  promptText: string = ''
  // 错误提示框 类型 1/短 2/对话框
  errDialogboxType: 1|2 = 1

  // 反解析 校验规则
  parseModalData (val: string) {
    if (this.isJSONString(val)) {
      let obj = JSON.parse(val)
      for(let key of Object.keys(obj)) {
        let v = obj[key]
        switch(key){
          case 'type':
            this.partterValue = (+v as 1|2);
            break;
          case 'rule':
            this.verifyRuleValue = v
            break
          case 'lInput':
            this.numInput1 = (+v as number)
            break
          case 'rInput':
            this.numInput2 = (+v as number)
            break
          case 'input':
            this.numInput = (+v as number)
            break
          case 'select':
            this.selectDataItem = v
            break
          case 'lSelect':
            this.rangeSelectDataItem1 = v
            break
          case 'rSelect':
            this.rangeSelectDataItem2 = v
            break
          case 'prompt':
            this.promptText = decodeURIComponent(v)
            break
          case 'dialogBox':
            this.errDialogboxType = (+v as 1|2)
            break
        }
      }
    } else {
      let arr = val.split('_')
      for(let value of arr) {
        let [key, v] = value.split(':')
        switch(key){
          case 'type':
            this.partterValue = (+v as 1|2);
            break;
          case 'rule':
            this.verifyRuleValue = v
            break
          case 'lInput':
            this.numInput1 = (+v as number)
            break
          case 'rInput':
            this.numInput2 = (+v as number)
            break
          case 'input':
            this.numInput = (+v as number)
            break
          case 'select':
            this.selectDataItem = v
            break
          case 'lSelect':
            this.rangeSelectDataItem1 = v
            break
          case 'rSelect':
            this.rangeSelectDataItem2 = v
            break
          case 'prompt':
            this.promptText = decodeURIComponent(v)
            break
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
  created() {
    this.isChild = !!this.dataItem.parentCode
    let allControls = this.getFormControls();
    for(let key of Object.keys(allControls)) {
      let ctl = allControls[key]
      if (ctl.type === FormControlType.Number && key !== this.dataItem.code ) {
        this.selectListDataItems.push(Object.assign({},ctl.options,{code:key}))
      } else if (!this.currControlOptions && key === this.dataItem.code) {
        this.currControlOptions = ctl.options
      } else if (this.isChild && ctl.type === FormControlType.Sheet && this.dataItem.parentCode === key) {
        ctl.columns.forEach((subItem) => {
          if (subItem.type === FormControlType.Number) {
            if (subItem.key !==  this.dataItem.code) {
              this.selectListDataItems.push(Object.assign({},subItem.options,{code:`${key}.${subItem.key}`}))
            } else if (!this.currControlOptions && subItem.key === this.dataItem.code) {
              this.currControlOptions = subItem.options
            }
          }
        })
      }
    }
    this.modalData.data.value && this.parseModalData(this.modalData.data.value)
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
    color: rgba(0,0,0,0.65);
    font-size: 14px;
  }
  .content {
    display: flex;
    flex: 1;
  }
}
</style>