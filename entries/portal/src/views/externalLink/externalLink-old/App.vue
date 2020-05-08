<template>
  <a-locale-provider :locale="locale">
    <div id="app">
      <router-view class="bpm-container"/>
    </div>
  </a-locale-provider>
</template>

<script lang="ts">

import {
  Component, Vue
} from 'vue-property-decorator';

import { LocaleProvider } from 'h3-antd-vue';

import { externalLinkApi, listApi } from '@cloudpivot/api';


@Component({
  components: {
    ALocaleProvider: LocaleProvider
  }
})
export default class App extends Vue {
  created() {

   
    
  }

  get params () {

    const url = location.search;
    const theRequest:any = new Object();
    if (url.indexOf("?") != -1) {
      const str:string = url.substr(1);
      const strs:string[] = str.split("&");
      strs.forEach((res:string) => {
        theRequest[res.split("=")[0]] = decodeURI(res.split("=")[1]);
      })
    }
    // debugger
    return theRequest;

  }
  get locale() {
    switch (this.$i18n.locale) {
      case 'zh':
      default:
        return require('h3-antd-vue/lib/locale-provider/zh_CN');

      case 'en':
        return require('h3-antd-vue/lib/locale-provider/en_US');
    }
  }
}
</script>
