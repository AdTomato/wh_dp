<template>
  <!-- <a-config-provider :getPopupContainer="getPopupContainer"> -->
  <a-locale-provider :locale="locale">

    <div id="app">
      <div v-show="!switchHeader" class="head-wrap">
        <Header/>
      </div>
      <div v-show="switchHeader">
        <PrintHeader/>
      </div>
      <router-view :class="{ 'container' : !this.$route.fullPath.includes('pre-view') }"/>
    </div>

  </a-locale-provider>
  <!-- </a-config-provider> -->

</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Watch } from 'vue-property-decorator';
// eslint-disable-next-line
import { Getter } from 'vuex-class';
// eslint-disable-next-line
import { Route } from 'vue-router';
// eslint-disable-next-line
// import { ConfigProvider } from 'h3-antd-vue';

import Header from './components/global/header/index.vue';
import PrintHeader from './components/global/header/printHeader.vue';

import OAuthApi from '@/apis/oauth';
@Component({
  name: 'apps',
  components: {
    Header,
    // AConfigProvider: ConfigProvider,
    PrintHeader
  }
})
export default class Apps extends Vue {
   @Getter('getAntLocale') locale!: string;

   switchHeader:boolean = false;

   async mounted() { // 获取配置文件
     const config = await OAuthApi.getSystemConfig();
     if (config) {
       this.$store.commit('setConfig', config);
     }
   }

   @Watch('$route')
   routeChange(n: Route, o: Route) {
     // eslint-disable-next-line
     n.fullPath.includes('print-template') || n.fullPath.includes('pre-view') ? this.switchHeader = true : this.switchHeader = false;
   }
}
</script>
