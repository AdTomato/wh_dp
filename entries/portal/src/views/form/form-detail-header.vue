
<template>
  <div class="header">
    <div>
      <div class="header-left">
        <a
          v-if="isDingTalk"
          class="aback"
          @click="back">返回</a>

        <!--<img src="@/assets/images/logo.png" @click="goHome">-->
        <img
          class="logo"
          :src="logo"
          @click="goHome" />

        <a
          v-if="isDingTalk"
          class="open-blank"
          @click="openBlank">在浏览器中打开</a>
      </div>

      <div
        @mouseover="showBigQrcode = true"
        @mouseout="showBigQrcode = false"
        @click.stop="showBigQrcode = true"
        v-if="!isEL&&showQrcode"
        class="qrcode"
      >
        <!--<img  @click.stop="showBigQrcode = !showBigQrcode" src="~@/assets/images/qrcode-icon.png"/>-->
        <img src="~@/assets/images/qrcode-icon.png" />
        <div class="qrcode-enlarge" v-show="showBigQrcode">
          <img :src="url" />
          <p v-if="isAdd">钉钉扫码查看数据</p>
          <p v-else>钉钉扫码填写数据</p>
        </div>
      </div>
    </div>

    <slot></slot>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import { Button } from "h3-antd-vue";

import { Getter } from "vuex-class";
import site from "@/config/site";

import env from "@/config/env";

import { externalLinkApi } from "@cloudpivot/api";

@Component({
  name: "form-detail-header",
  components: {
    AButton: Button
  }
})
export default class FormDetailHeader extends Vue {
  @Getter("getAntLocale") locale!: string;

  @Prop() formObj!: any;

  showBigQrcode = false;

  url = "";

  get logo() {
    return site.logo;
  }

  // 跳转到首页
  goHome() {
    const appCode = window.Environment ? window.Environment.appCode : null;
    if (appCode) {
      this.$router.push({
        name: 'singleApp',
        params: {
          appCode
        }
      })
    } else {
      this.$router.push({ name: "myUnfinishedWorkItem" });
    }
  }

  isAdd = false;

  back() {
    // const url : any = this.$route.query.return;
    // this.$router.push({
    //   path: url,
    // });
    this.$router.go(-1);
  }

  openBlank() {
    const url = `${location.href}${
      location.href.indexOf("?") > -1 ? "&" : "?"
    }access_token=${localStorage.getItem("token")}`;

    window.open(url, "_blank");
  }

  // get url() {
  //   // const config:any = this.$store.state.config;
  //   // const corpId = config.corpId;
  //   // const agentId = config.agentId;

  //   // const locHref = window.location.pathname + window.location.search;

  //   // const signinUrl = '47.107.160.206' + "/mobile/?meetingId="+"&corpId=ding6a0a954b9b413bcf35c2f4657eb6378f&agentId=235111190&mode=create&schemaCode=meeting_signin&sheetCode=signin&num=" + new Date().getTime();
  //   // debugger

  //   return src;
  // }

  get isEL() {
    return (window as any).externalLinkToken;
  }

  get showQrcode() {
    if (!this.formObj.bizSheet) {
      return false;
    }
    // 表单二维码码默认开启
    if (
      this.formObj.bizSheet.qrCodeAble === "open" ||
      !this.formObj.bizSheet.qrCodeAble
    ) {
      return true;
    }
    return false;
  }

  mounted() {
    document.addEventListener("click", this.outFocus);
  }

  destoryed() {
    document.removeEventListener("click", this.outFocus);
  }
  outFocus() {
    this.showBigQrcode = false;
  }
  @Watch("formObj", {
    immediate: true
  })
  onFormObjChange(formObj: any) {
    // debugger
    if (!formObj.bizSheet) return;

    const { workflowInstanceId, workItemId, workflowCode } = formObj;

    const { id, schemaCode, sheetCode, loadedFromDb } = formObj.bizObject;

    if (!this.$store) {
      return;
    }
    const { config } = this.$store.state;

    // if (!config) {

    // }

    const { corpId } = config;

    const { agentId } = config;

    this.isAdd = loadedFromDb;

    let signinUrl = "";
    // 数据来自数据库 生成查看表单
    if (loadedFromDb) {
      // 流程表单
      if (workflowInstanceId && workItemId) {
        // 新增
        signinUrl = `${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&corpId=${corpId}&agentId=${agentId}&mode=form`;
      } else {
        // 业务表单
        signinUrl = `${config.mobileServerUrl}/?corpId=${corpId}&agentId=${agentId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&id=${id}&mode=form`;
      }

      // signinUrl =`${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&id=${id}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&corpId=${corpId}&agentId=${agentId}`;
    } else {
      // 查看
      // 数据无数据，生成新表单或者发起流程

      if (workflowCode) {
        // 发起流程
        signinUrl = `${config.mobileServerUrl}/?workflowCode=${workflowCode}&corpId=${corpId}&agentId=${agentId}&mode=form`;
      } else {
        // 新增业务表单
        signinUrl = `${config.mobileServerUrl}/?corpId=${corpId}&agentId=${agentId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&mode=form`;
      }
      // signinUrl =`${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&corpId=${corpId}&agentId=${agentId}`;
    }

    console.log(signinUrl);

    const that = this;
    // const text: string = decodeURI(encodeURIComponent(signinUrl));
    // this.url= `${env.apiHost}/api/qrcode/generate_qrcode?text=${text}`;

    // 将图片二进制流转成base64，兼容IE11
    externalLinkApi.generateQrcode(signinUrl).then((res: any) => {
      let bytes = new Uint8Array(res);
      let data = "";
      let len = bytes.byteLength;
      for (let i = 0; i < len; i++) {
        data += String.fromCharCode(bytes[i]);
      }
      that.url = "data:image/png;base64," + window.btoa(data);
    });

    // debugger
  }
}
</script>


<style lang="less" scoped>
@import "~@/styles/themes/default.less";

.header {
  padding: 0 @base4-padding-lg!important;
  &-left {
    display: flex;
    align-items: center;
  }
  .qrcode {
    border: 1px solid rgba(221, 221, 221, 1);
    // margin-left: 33px;
    margin-right: 16px;
    position: relative;
    & > img {
      width: 26px;
      cursor: url("~@/assets/images/enlarge-o.png"), pointer;
      margin: 2px;
      // border:1px solid rgba(221,221,221,1);
    }
    .qrcode-enlarge {
      position: absolute;
      top: 28px;
      border: 1px solid rgba(221, 221, 221, 1);
      background: #fff;
      img {
        width: 250px;
        height: 250px;
        // max-height: 250px !important;
      }
      p {
        text-align: center;
        padding-bottom: 16px;
      }
      // left: 0;
      right: -1px;
    }
  }
  img.logo {
    cursor: pointer;
    max-height: 30px !important;
  }

  & > div:first-child {
    border-right: 1px solid rgba(217, 217, 217, 1);
    flex-grow: 1;
    display: flex;
    justify-content: space-between;

    a.aback {
      font-size: 18px;
      margin-right: 8px;

      &::after {
        content: "";
        height: 18px;
        width: 1px;
        background-color: #d8d8d8;
        display: inline-block;
        position: relative;
        top: 3px;
        margin-left: 8px;
      }
    }
  }
}
</style>
