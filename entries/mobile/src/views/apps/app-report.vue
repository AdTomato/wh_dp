<template>
  <div :class="prefixCls">
    <h3-report-mobile 
      v-if="loaded" 
      :corpId="corpId" 
      :reportId="objectId" 
      :config="config"
    ></h3-report-mobile>
  </div>
</template>

<script lang='ts'>

// import './report-service';

import { Component, Prop, Vue, Watch } from "vue-property-decorator";

import ReportOptions from '@h3/report/dist/options';

import { MDashboard } from "@h3/report";

import { listApi } from '@cloudpivot/api';


@Component({
  name: "AppReport",
  components: {
    H3ReportMobile: MDashboard
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      (vm as AppReport).load();
    });
  },
  beforeRouteUpdate(to, from, next) {
    next();
    
    const vm = this as AppReport;
    vm.load();
  }
})
export default class AppReport extends Vue {
  prefixCls = "app-report"

  corpId = "a"

  objectId = ""

  loaded = false

  get reportCode() {
    return this.$route.params.reportCode;
  }

  get appCode() {
    return this.$route.params.appCode;
  }

  get token() {
    return localStorage.getItem("token");
  }

  get config() {
    return {
      token: this.token,
      reportCode: this.reportCode,
      appCode: this.appCode
    };
  }
    
  load(){
    this.loaded = false;

    listApi.getReport({
      code: this.reportCode
    }).then((res:any) => {
      if (res.errcode === 0) {
        this.objectId = res.data.reportObjectId || '';
      } else {
        this.$h3.toast.show({
          text: res.errmsg,
          autoHide: true,
          iconType: 'close'
        });
      }
    }).finally(()=> this.loaded = true);
  }

  mounted() {
    const self = this;
    ReportOptions.message = {
      success: function(text: string) {
        self.$h3.toast.show({
          text,
          autoHide: true,
          iconType: "check",
          duration: 3000
        });
      },
      error: function(text: string) {
        self.$h3.toast.show({
          text,
          autoHide: true,
          iconType: "close",
          duration: 3000
        });
      },
      info: function(text: string) {
        self.$h3.toast.show({
          text,
          autoHide: true,
          duration: 3000
        });
      },
      warning: function(text: string) {
        self.$h3.toast.show({
          text,
          autoHide: true,
          iconType: "check",
          duration: 3000
        });
      }
    };
    // options.message.success('test');
  }
}
</script>

<style lang="less">
.app-report {
  height: 100%;
  width: 100%;
}
</style>
