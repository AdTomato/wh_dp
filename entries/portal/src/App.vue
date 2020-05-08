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

import OAuthApi from '@/apis/oauth';

import env from '@/config/env';


@Component({
  components: {
    ALocaleProvider: LocaleProvider
  }
})
export default class App extends Vue {
  get locale() {
    switch (this.$i18n.locale) {
      case 'zh':
      default:
        return require('h3-antd-vue/lib/locale-provider/zh_CN');

      case 'en':
        return require('h3-antd-vue/lib/locale-provider/en_US');
    }
  }

  async mounted() {
    const config = await OAuthApi.getSystemConfig();
    if (config) {
      config.apiHost = env.apiHost;
      this.$store.commit('setConfig', config);
    }
  }
}
</script>
