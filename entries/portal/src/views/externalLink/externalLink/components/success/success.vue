<template>
  <div class="empty-page">
    <EmptyHeader></EmptyHeader>
    <div class="main">
      <!-- <img src="@/components/global/empty.png"> -->
      <div class="main-qrcode">
        <img :src="qrCode" />
      </div>
      <p class="main--success">
        提交数据成功
      </p>

      <p class="main__tip">
        您可以保存上方二维码，随时扫描查看数据信息！此数据所有人可查看，请您谨慎保存，切勿传给其它人员，以免信息泄露！
      </p>

      <div class="main__btn">
        <a :href="downloadUrl" target="_blank">
          <a-button type="primary" >下载二维码</a-button>
        </a>
       
        
        
      
        <!-- <a-button @click="close" type="primary">关闭当前页面</a-button> -->
      </div>

      <!-- <a-button @click="close" v-if="showClose">{{ $t('languages.common.close') }}</a-button> -->
    </div>
  </div>

</template>

<script lang="ts">

import {
  Component, Vue
} from 'vue-property-decorator';
import {
  Button
} from 'h3-antd-vue';
import EmptyHeader from '@/components/shared/header/empty-header.vue';

import env from '@/config/env';

import { externalLinkApi } from '@cloudpivot/api';
import { Getter } from 'vuex-class';

import OAuthApi from '@/apis/oauth';



@Component({
  name: 'empty-page',
  components: {
    EmptyHeader,
    AButton: Button
  }
})
export default class EmptyPage extends Vue {
  @Getter('getAntLocale') locale!: string;

  qrCode = '';

  downloadUrl = '';

  created() {
    OAuthApi.getSystemConfig().then((res:any) => {
      if (res) {
        let url = `${res.mobileServerUrl}/el.html?c=${this.shortCode}`;
    
        this.qrCode = `${env.apiHost}/api/qrcode/generate_qrcode?text=` + url;

        this.downloadUrl = `${env.apiHost}/api/qrcode/download_qrcode?text=` + url;
      }
    });
  }

  close() {
    window.opener = null;
    window.open('', '_self');
    window.close();
  }

  get shortCode() {
    return this.$route.params.shortCode;
  }

  // download() {
    
  // }

  downloadFile(blob: any, fileName: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = fileName;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  
  
  // get showClose(){
  //   if(this.isExternalLink){
  //     return false;
  //   }

  //   if(this.isDingtalk){
  //     return false;
  //   }

  //   return true;
  // }

  // get isExternalLink() {
  //   const token = (window as any).externalLinkToken;
  //   return Boolean(token);

  // }

  // get isDingtalk(){
  //   return isDingtalk;
  // }
}
</script>
<style lang="less">
  .empty-page{
    .main{
      margin-top: 91px;
      // display: flex;
      // flex-direction: column;
      // justify-content: center;
      // align-items: center;
      text-align: center;

      &__tip{
        margin: 0 auto;
        width: 340px;
        font-size:12px;
        font-weight:400;
        color:rgba(0,0,0,0.45);
        line-height:17px;
        margin-top: 8px;
        margin-bottom: 14px;
      }

      &__btn {
        button{
          margin-right: 8px;
        }
      }
    }
    .main-qrcode{
      margin: 0 auto;
      width: 340px;
      height: 248px;
      background: url('./el-success.png');
      background-size: 100%;
      img{
        width: 200px;
        height: 200px;
        margin: 20px auto;
        border-radius:10px;
        border:1px solid rgba(221,221,221,1);
      }
    }
    .main--success {
      font-size:18px;
      font-weight:400;
      color:rgba(0,0,0,0.85);
      line-height:25px;
    }
   
  }
</style>
