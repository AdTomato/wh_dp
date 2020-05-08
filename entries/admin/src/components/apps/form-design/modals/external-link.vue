<template>
  <a-modal
    :title="$t('languages.Apps.FormDesignPage.ExternalLink')"
    :visible="true"
    @cancel="closeModal"
    @ok="backData"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    width="566px"
    :maskClosable="false"
    :keyboard="false"
    class="modal"
  >
    <div class="external-link-wrap">

      <!-- tips -->
      <a-row> 
        <span class="external-link__title">将表单发布为公开链接，无需登录即可填写表单</span>
      </a-row>

      <!-- switch -->
      <a-row>
        <a-col :span="4" class="left">
          <label>
            是否开启
          </label>
        </a-col>
        <a-col :span="20" class="right">
          <a-switch v-model="isOpen" />
        </a-col>
      </a-row>

      <!-- url -->
      <a-row v-show="isOpen">
        <a-col :span="4" class="left">
          <label>
            链接地址生成
          </label>
        </a-col>
        <a-col :span="20" class="right">
          <a
            target="_blank"
            :href="pcUrl"
            ref="link"
          >
            <span class="left-span">{{ pcUrl }}</span> 
            <span class="right-span">{{ pcUrl.slice(-4) }}</span>
          </a>
          <a-button @click="copy" type="primary"> 复制链接 </a-button>
        </a-col>
      </a-row>

      <!-- 二维码 -->
      <a-row v-show="isOpen">
        <a-col :span="4" class="left">
          <label>
            二维码生成
          </label>
        </a-col>
        <a-col :span="20" class="right">
          <div
            class="img-wrap"
            @click.stop="showLargeImg = !showLargeImg"
          >
            <!-- <img :src="'data:image/png;base64,'+item.content" class="content-item-icon"> -->
            <img :src="qrCode">
            <!-- <span v-show="showIcon" class="icon aufontAll">&#xe726;</span> -->
          </div>
          <div v-show="showLargeImg" class="img-wrap__large">
            <img :src="qrCode">
          </div>
        </a-col>
      </a-row>
      
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Emit, Prop } from 'vue-property-decorator';

import Options from '../typings/form-modals-map';

import * as formApi from '@/apis/form';

import { Base64 } from 'js-base64';

import env from '@/env.ts';

// import { formApi } from '@cloudpivot/api';


@Component({
  name: 'external-link'
})
export default class ExternalLink extends Vue {
  @Prop({
    type: Object,
    default: () => ({})
  }) modalData!: any;

  showIcon:boolean = false;

  showLargeImg:boolean = false;

  isOpen: boolean = false;

  pcUrl:string = '';

  qrCode:string = '';

  mobileUrl:string = '';

  shortCode = '';

  created() {
    this.getShortCode();
    // if (this.modalData.data) {
      
    // }
  }



  copy() {
    const oInput:any = document.createElement('input');
    oInput.value = this.pcUrl;
    document.body.appendChild(oInput);
    oInput.select(); // 选择对象
    document.execCommand("Copy"); // 执行浏览器复制命令
    oInput.className = 'oInput';
    oInput.style.display='none';
    oInput.remove();
    this.$message.success('已复制至系统剪切板');
  }

  getShortCode() {
    
    const { schemaCode,sheetCode,shortCode } = this.modalData.data;

    // 兼容老数据根据id生成链接
    if (this.modalData.data.value && !shortCode) {
      this.createQrCode();
      return;
    }
    if (shortCode) {
      this.shortCode = shortCode;
      this.createQrCode()
      return;
    }

    const vm:any = this;
    formApi.getShortCode(schemaCode,sheetCode).then((res:any) => {
      vm.shortCode = res.data;;
      this.createQrCode()
    });
  }

  createQrCode() {
    this.isOpen = this.modalData.data.value;
    if (this.shortCode) {
      this.pcUrl = `${window.location.protocol}//${window.location.host}/el.html?c=${this.shortCode}`;
    } else {
      this.pcUrl = `${window.location.protocol}//${window.location.host}/externalLink.html?formId=${this.modalData.data.formId}`;
    }
    
    this.mobileUrl = this.pcUrl;
    this.qrCode = `${env.apiHost}/api/qrcode/generate_qrcode?text=` + this.mobileUrl;
  }

  mounted() {
    document.addEventListener('click',this.outFocus);
  }

  destoryed() {
    document.removeEventListener('click',this.outFocus);
  }

  outFocus() {
    this.showLargeImg = false;
  }

  
  backData() {
    const backData = {
      value: this.isOpen,
      shortCode: this.shortCode
    };
    this.$emit('backData', backData);
  }
  closeModal() {
    this.$emit('closeModal');
  }
}
</script>

<style lang="less" scoped>
.external-link-wrap{
   height: 215px;
  .ant-row{
    margin-bottom: 21px;
    &:last-child{
      margin-bottom: 0;
    }
    .left {
      label {
        line-height: 32px;
      }
    }
    .right {
      padding-left: 17px;
      line-height: 32px;
      & >a{
        display: block;
        max-width: 308px;
        overflow: hidden;/*超出部分隐藏*/
        white-space: nowrap;/*不换行*/
        text-overflow:ellipsis;
        color: @primary-color;
        float: left;
        text-decoration:none;
        .left-span{
          display:block;
          float:left;
          width: 88%;
          overflow: hidden;/*超出部分隐藏*/
          white-space: nowrap;/*不换行*/
          text-overflow:ellipsis;
        }
        .right-span {
          display:block;
          float:left;
          width: 12%;
          overflow: hidden;
        }

      }
      a:hover{
        color: #38c9a0;
        // text-decoration:underline!important;
      }
      .ant-btn{
        margin-left: 18px;
      }
      .img-wrap{
        position: relative;
        border:1px solid rgba(221,221,221,1);
        // border-radius:4px;
        float: left;
        padding: 6px;
        img {
          
          // cursor: pointer;
          cursor: url("~@/assets/images/enlarge-o.png"), pointer;
          width: 54px;
          height: 54px;
        }
        .icon {
          position: absolute;
          left: 50px;
          top: 36px;
          font-size: 14px;
        }
      }
      .img-wrap__large{
        background: white;
        position: absolute;
        padding: 10px;
        border:1px solid rgba(221,221,221,1);
        top: 68px;
        img {
          width: 202px;
          height: 202px;
        }
      }
    }
  }
  .external-link__title{
    color: rgba(0, 0, 0, 0.85);
  }
}

</style>
<style lang="less">
.modal{
  .ant-modal-body {
    padding: 20px 24px;
  }
}
</style>

