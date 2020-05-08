<template>
  <div class="print-header flex-justify-between">
    <div class="header-left">
      <div class="flex-center">
        <div @click="goToBack()" v-show="$route.fullPath.includes('print-template')">
          <i class="icon aufontAll h-icon-all-arrow-left-o router-link-active"></i>
        </div>
        <div v-if="$route.fullPath.includes('print-template')">打印模板设计</div>
        <div v-if="$route.fullPath.includes('pre-view')">打印模板预览</div>
      </div>
    </div>
    <div class="header-right" v-if="$route.fullPath.includes('print-template')">
      <a-button icon="eye-o" @click="preView()">预览</a-button>
      <a-button type="primary" icon="save" @click="saveDrawerJson()">保存</a-button>
    </div>
    <div class="header-right" v-if="$route.fullPath.includes('pre-view')">
      <a-button icon="close" @click="closePreView()">关闭</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { namespace } from "vuex-class";
import { update } from "@/apis/form";
import { iconTypes } from "@/config/print/dataStructure";
// import { replaceValueData } from '@cloudpivot/common/src/utils/utils';
import common from "@cloudpivot/common";

const { replaceValueData } = common.utils.BusinessFunctions;

import env from "@/env";
import * as settingHelper from "../../../views/print-template/center-panel/settings-helper";

const PrintVuex = namespace("Print/Print");
@Component({
  name: "print-header"
})
export default class PrintHeader extends Vue {
  @PrintVuex.State("pages") pages!: object[];
  @PrintVuex.State("pageSettings") pageSettings!: any;

  goToBack() {
    // @ts-ignore
    if (history.length > 1) {
      history.go(-1);
    } else {
      this.$router.push({ path: "/" });
    }
  }

  preView() {
    // @ts-ignore
    const res: object[] = replaceValueData(env, this.pages, "fake", iconTypes);
    localStorage.setItem("print_pages", JSON.stringify(res));
    // @ts-ignore
    const href = `/admin#/apps/model/${this.$route.params.appCode}/${this.$route.params.bizSchemaCode}/pre-view`;
    window.open(href, "_blank");
  }

  async saveDrawerJson() {
    // 添加打印页面配置
    let tempData: object[] = this.pages[0] as [];
    let existIndex: number = -1;
    tempData.forEach((item: any, index: number) => {
      if (item.eleType === "pageSettings") {
        existIndex = index;
      }
    });
    if (existIndex === -1) {
      if (this.pageSettings.eleType === undefined) {
        tempData.push(settingHelper.getDefaultSettings());
      } else {
        tempData.push(this.pageSettings);
      }
    } else {
      if (this.pageSettings.eleType !== undefined) {
        tempData[existIndex] = this.pageSettings;
      }
    }

    // @ts-ignore
    const res: object[] | undefined = replaceValueData(env, this.pages, "fake");
    const params: any = {
      // @ts-ignore
      code: this.$route.params.printCode,
      // @ts-ignore
      schemaCode: this.$route.params.bizSchemaCode,
      id: localStorage.getItem(
        `upPrintTempJsonId${this.$route.params.printCode}`
      ),
      name: "打印模板",
      sheetType: "2",
      draftAttributesJson: JSON.stringify(res)
    };
    const { errcode, errmsg } = await update(params);
    if (errcode !== 0) this.$message.error(errmsg);
    if (errcode === 0) {
      this.$message.success("保存成功");
    }
  }

  closePreView() {
    if (navigator.userAgent.indexOf("MSIE") > 0) {
      if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
        window.opener = null;
        window.close();
      } else {
        window.open("", "_top");
        window.top.close();
      }
    } else if (
      navigator.userAgent.indexOf("Firefox") > 0 ||
      navigator.userAgent.indexOf("Presto") > 0
    ) {
      window.location.href = "about:blank";
      window.close();
    } else {
      window.opener = null;
      window.open("", "_self", "");
      window.close();
    }
    localStorage.removeItem("print_pages");
  }
}
</script>

<style lang="less" scoped>
.print-header {
  height: 64px;
  width: 100%;
  background: rgba(5, 37, 53, 1);
  color: #fff;
  padding: 0 25px;
  position: relative;
  z-index: 3;
  .header-left {
    i {
      margin-right: 25px;
      &:hover {
        cursor: pointer;
      }
    }
    div:nth-child(2) {
      font-size: 18px;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
  .header-right {
    .ant-btn-default {
      margin-right: @base4-padding-xs;
      background: rgba(5, 37, 53, 1);
      color: #fff;
      &:hover {
        border: 1px solid #17bc94;
        color: #17bc94;
        transition: all 0.2s;
      }
    }
  }
}
</style>
