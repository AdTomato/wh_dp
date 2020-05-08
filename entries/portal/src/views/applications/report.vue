
<template>
  <div :class="prefixCls">

    <h3-report
      v-if="loaded"
      :class="[`${prefixCls}`]"
      :reportId="objectId"
      :corpId="corpId"
      :config="config"
    ></h3-report>

  </div>

</template>

<script lang="ts">

// import './report-service';

import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Dashboard } from '@h3/report';

import { listApi } from '@cloudpivot/api';


@Component({
  name: "app-report",
  components: {
    H3Report: Dashboard
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     (vm as AppReport).load();
  //   });
  // },
  // beforeRouteUpdate(to, from, next) {
  //   next();
    
  //   const vm = this as AppReport;
  //   vm.load();
  // }
})
export default class AppReport extends Vue{

    prefixCls = 'report'
    
    title = ''

    corpId = 'a'

    objectId = ''

    loaded = false
    
    get reportCode(){
      return this.$route.params.reportCode;
    }

    get appCode(){
      return this.$route.params.appCode;
    }
    
    get token(){
      return localStorage.getItem('token')
    }
    
    get config(){
      return {
        token: this.token,
        reportCode: this.reportCode,
        appCode: this.appCode
      }
    }

    
    load(){
      this.loaded = false;
      const closeLoad = (this.$message as any).loading();

      listApi.getReport({
        code: this.reportCode
      }).then((res:any) => {
        closeLoad();
        if (res.errcode === 0) {
          this.objectId = res.data.reportObjectId || '';
        } else {
          this.$message.error(res.errmsg);
        }
      },()=> closeLoad()).finally(()=> this.loaded = true);
    }

    @Watch('reportCode',{
      immediate: true
    })
    onReportCodeChange(){
      if(this.reportCode){
        this.load();
      }
    }

}
</script>


<style lang="less" scoped>

  .report{
    height: 100%;
  }

</style>