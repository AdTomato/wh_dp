<template>
  <div class="modal-wrap">
    <component
      :is="currentModal"
      @backData="backData"
      @closeModal="closeModal"
      :modalData="modalMsg"
      :getFormControls="getFormControls"
      :dataItem="dataItem"
    ></component>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";
import AddSelectOpiton from "./add-checkbox-opiton.vue";
import AddRadioOption from "./add-radio-option.vue";
import Date from "./date.vue";
import RegularModal from "./regular-modal.vue";
import RequiredCondition from "./required-condition.vue";
import CalculateRule from "./calculate-rule.vue";
import UserSelectionMap from "./user-selection-map.vue";
import QueryCondition from "./query-condition.vue";
import ScriptInput from "./script-input.vue";
import SheetMappings from "./sheet-mappings.vue";

import ExternalLink from "./external-link.vue";
import BizRadioOption from "./biz-radio-option.vue";

import UserSelectValueSetting from "./user-select-value-setting.vue";

import VerifyFormulaDate from "./verify-formula-date.vue" // 日期类型 提交校验
import VerifyFormulaNumber from "./verify-formula-number.vue" // 数值类型 提交校验
import UpdateImgNum from "./update-img-num.vue" // 上传图片数量 弹出框

// import RelevanceFormDefaultVal from './relevance-form-default-val.vue'
import RelevanceFormDefaultValue from './relevance-form-default-value.vue'

import {
  ControlAttributeType,
  ModalAttributeType
} from "../form-property/typings/form-attribute";
import * as formApi from "@/apis/form";

@Component({
  name: "FormDesignModal",
  components: {
    AddSelectOpiton,
    AddRadioOption,
    Date,
    RegularModal,
    RequiredCondition,
    CalculateRule,
    UserSelectionMap,
    QueryCondition,
    ScriptInput,
    SheetMappings,
    ExternalLink,
    UserSelectValueSetting,
    VerifyFormulaDate,
    VerifyFormulaNumber,
    UpdateImgNum,
    RelevanceFormDefaultValue,
    BizRadioOption
  }
})
export default class FormDesignModel extends Vue {
  @Prop({
    type: Object
  })
  modalData!: any;

  @Prop()
  dataItem!: any;

  @Prop()
  getFormControls!: Function;

  currentModal: string = "";
  modalMsg: any = [];

  async created() {
    this.modalMsg = this.modalData;
    switch (this.modalData.type) {
      /* 单选选项框 */
      case "radioOption":
        this.currentModal = "AddRadioOption";
        break;
      case "bizRadioOption":
        this.currentModal = "BizRadioOption";
        break;
      /* 多选选项框 */
      case "checkboxOption":
        this.currentModal = "AddSelectOpiton";
        break;

      /**
       * 最小日期
       */
      case "min-yyyy-mm-dd":
        this.currentModal = "Date";
        break;

      /**
       * 最大日期
       */
      case "max-yyyy-mm-dd":
        this.currentModal = "Date";
        break;
      /**
       *正则弹框
       */
      case "regularModal":
        this.currentModal = "RegularModal";
        break;

      /**
       * 必填条件
       */
      case "requiredCondition":
      case "showRule":
        this.currentModal = "RequiredCondition";
        break;

      /**
       * 计算规则
       */
      case "calculateRule":
        this.currentModal = "CalculateRule";
        break;
      /**
       * 选人控件映射关系
       */
      case "userSelectionMap":
        this.currentModal = "UserSelectionMap";
        break;

      case "queryCondition":
        this.currentModal = "QueryCondition";
        break;

      case ModalAttributeType.ScriptInput:
        this.currentModal = ModalAttributeType.ScriptInput;
        break;
      case ModalAttributeType.VerifyFormulaDate:
        this.currentModal = ModalAttributeType.VerifyFormulaDate;
        break;
      case ModalAttributeType.VerifyFormulaNumber:
        this.currentModal = ModalAttributeType.VerifyFormulaNumber;
        break;
      case ModalAttributeType.UpdateImgNum:
        this.currentModal = ModalAttributeType.UpdateImgNum;
        break;
      case ModalAttributeType.SheetMappings:
        this.currentModal = ModalAttributeType.SheetMappings;
        break;
      case ModalAttributeType.ExternalLink:
        this.currentModal = ModalAttributeType.ExternalLink;
        break;

      case ModalAttributeType.UserSelectValueSetting:
      case ModalAttributeType.UserSelectOrgValueSetting:
        this.currentModal = ModalAttributeType.UserSelectValueSetting;
        break;

      case ModalAttributeType.Print:
        this.$router.push({
          name: "print-template",
          params: { printCode: await this.judgePrintCode() }
        } as any);
        break;
      case ModalAttributeType.RelevanceFormDefaultVal:
        this.currentModal = ModalAttributeType.RelevanceFormDefaultVal;
        break

      default:
        this.currentModal = "AddRadioOption";
        break;
    }
  }

  async judgePrintCode() {
    const sheet = this.modalData.data.value;
    let printCode = "";
    const params: any = {
      name: "打印模板",
      code: `${sheet.code}_print`,
      icon: "h-icon-all-operation-log-o",
      sheetType: "2",
      printIsPc: true,
      schemaCode: sheet.schemaCode
    };
    if (sheet.printTemplateJson) {
      const createPrints = JSON.parse(sheet.printTemplateJson);
      if (Array.isArray(createPrints)) {
        printCode = createPrints[0].sheetCode;
      }
    }
    if (!printCode) {
      // 创建打印记录
      await formApi.create(params);
      // 更新与表单的关联关系
      const updatePrints = [
        {
          name: params.name,
          sheetCode: params.code
        }
      ];
      const json = JSON.stringify(updatePrints);
      sheet.printTemplateJson = json;
      await formApi.update({
        id: sheet.id,
        code: sheet.code,
        name: sheet.name,
        sheetType: sheet.sheetType,
        schemaCode: sheet.schemaCode,
        printTemplateJson: json
      } as any);
      printCode = sheet.code;
    }
    return printCode;
  }

  backData(val: any) {
    this.$emit("confirm", val);
  }
  closeModal() {
    this.$emit("cancel");
  }
}
</script>
<style lang="less">
</style>
