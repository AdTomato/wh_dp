<template>
  <a-modal
    :title="$t('languages.Apps.FormDesignPage.RegularRule')"
    :visible="true"
    @cancel="closeModal"
    @ok="backData"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    width="492px"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="regular-wrap">
      <div class="clearfix row">
        <div class="left">
          <span>{{ $t('languages.Apps.FormDesignPage.SelectRegularTemp') }}:</span>
        </div>
        <div class="right">
          <a-select
            class="select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            @change="changeRegularOptions"
          >
            <a-select-option
              v-for="(regular, index) in regularRules"
              :key="index"
              :value="regular.rule"
            >{{ regular.text }}</a-select-option>
          </a-select>
        </div>
      </div>
      <div class="clearfix row">
        <div class="left">
          <span>{{ $t('languages.Apps.FormDesignPage.Regular') }}:</span>
        </div>
        <div class="right">
          <a-input
            class="input"
            :placeholder="$t('languages.PlaceHolder.Select')"
            v-model="regularData.regularText"
          />
        </div>
      </div>
      <div class="clearfix row">
        <div class="left">
          <span>{{ $t('languages.Apps.FormDesignPage.ErrorTips') }}:</span>
        </div>
        <div class="right">
          <a-input
            class="input"
            :placeholder="$t('languages.PlaceHolder.Input')"
            v-model="langObj[lang]"
          />
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from "vue-property-decorator";

import Options from "../typings/form-modals-map";

@Component({
  name: "RegularModal"
})
export default class RegularModal extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  })
  modalData!: any;

  regularData: any = {
    selectOption: "",
    regularText: "",
    tips: "",
    propertyBarText: ""
  };

  lang: string = localStorage.getItem("locale") || "zh";

  langObj: any = {
    en: "",
    zh: ""
  };

  get regularRules() {
    return this.modalData.data.type && this.modalData.data.type === "number"
      ? Options.defaultRegularList.slice(0, 3)
      : Options.defaultRegularList;
  }

  created() {
    const data = this.modalData.data as any;
    if (data) {
      this.regularData = {
        tips: data.default || "",
        regularText: data.value || ""
      };

      this.langObj = JSON.parse(data.default);
    }
  }

  changeRegularOptions(val: any, arg: any) {
    const index: number = arg.data.key;
    this.regularData.selectOption = val;
    this.regularData.regularText = val;
    if (this.regularData.selectOption) {
      this.langObj = {
        en: this.regularRules[index].en,
        zh: this.regularRules[index].text
      };
      // this.regularData.tips = JSON.stringify()
    } else {
      // this.regularData.tips = '';
      this.langObj = {
        en: "",
        zh: ""
      };
    }
  }
  backData() {
    if (!this.langObj.en) {
      this.langObj.en = this.langObj.zh;
    }

    if (!this.langObj.zh) {
      this.langObj.zh = this.langObj.en;
    }

    const data = {
      value: this.regularData.regularText,
      default: JSON.stringify(this.langObj)
    };
    // 正则为空的允许提交
    if (!this.regularData.regularText) {
      this.$emit("backData", data);
      return;
    }

    const reg = new RegExp(/^(\/\^).+?(\$\/)$/);
    if (reg.test(this.regularData.regularText)) {
      try {
        new RegExp(this.regularData.regularText.regularText).test("");
        this.regularData.propertyBarText = this.regularData.regularText;

        this.$emit("backData", data);
      } catch (err) {
        this.$message.error("输入正则不合法");
      }
    } else {
      this.$message.error("输入正则不合法");
    }
  }
  closeModal() {
    this.$emit("closeModal");
  }
}
</script>

<style lang="less">
.regular-wrap {
  .row {
    margin-bottom: 16px;
    &:last-child {
      margin-bottom: 0;
    }
    .left {
      width: 138px;
      float: left;
      span {
        line-height: 32px;
      }
    }
    .right {
      float: left;
      .input,
      .select {
        width: 306px;
      }
    }
  }
}
</style>
