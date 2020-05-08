
<template>
  <div class="empty">
    <div class="header">
      <div>
        <img src="@/assets/images/yslogo.png">
      </div>
    </div>

    <div class="emtpy__body">
      <img src="@/assets/images/success.png">
      <p>{{ $t('languages.common.tip.operationSucceed') }}</p>
      <p>
        <a-button 
          @click="onClose()" 
          v-if="showClose" 
          type="primary">{{ $t('languages.common.closePage') }}</a-button>
      </p>
    </div>
  </div>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Button } from 'h3-antd-vue';

import * as platform from '@cloudpivot/platform';


@Component({
  name: 'empty',
  components: {
    AButton: Button
  }
})
export default class Empty extends Vue {
  onClose() {
    window.close();
    if (navigator.userAgent.indexOf("MSIE") > 0) {
        if (navigator.userAgent.indexOf("MSIE 6.0") > 0) {
            window.opener = null; window.close();
        }
        else {
            window.open('', '_top'); window.top.close();
        }
    }
    else if (navigator.userAgent.indexOf("Firefox") > 0 || navigator.userAgent.indexOf("Chrome") > 0) {
        window.location.href = 'about:blank';
        window.close();
        //window.history.go(-2);  
    }
    else if (navigator.userAgent.indexOf("DingTalk") > 0){
        window.close();
    }
    else {
        window.opener = null;
        window.open('', '_self', '');
        window.close();
    }
    // if (isDingtalk) {
    //   closeWindow();
    // } else {
      // window.opener = null;
      // window.open('', '_self');
      // window.close();
    // }
  }

  get showClose(){
    if(this.isExternalLink){
      return false;
    }

    if(this.isDingtalk){
      return false;
    }

    return true;
  }

  get isExternalLink() {
    const token = (window as any).externalLinkToken;
    return Boolean(token);

  }

  get isDingtalk(){
    return platform.IS_DINGTALK;
  }
}
</script>

<style lang="less" scoped>
@import "../../styles/themes/default.less";

.header img{
  max-height: 30px !important;
}

.emtpy__body {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
  color: @light-color-1;
  font-size: @font-size-18;

  & > p:last-child {
    margin-top: 1.25em;
  }
}
</style>
