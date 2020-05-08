
<template>

  <div class="report-design">

    <div class="report-design__header">
      <router-link
        tag="i"
        :to="{ name: 'appitem',params: { appCode: appCode } }"
        class="icon aufontAll h-icon-all-arrow-left-o"
      >
      </router-link>
      <span>{{ title }}</span>
    </div>

    <div class="report-design__body">
      <h3-report-design
        v-if="loaded"
        v-model="title"
        :class="['report-design__designer']"
        :reportId="objectId"
        :corpId="corpId"
        :config="config"
      ></h3-report-design>
    </div>
    
  </div>

</template>

<script lang="ts">

// import './report-service';

import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { Dashboard } from '@h3/report';

import appsApi from '@/apis/apps';

@Component({
  name: "report-design",
  components: {
    H3ReportDesign: Dashboard.Designer
  },
})
export default class ReportDesign extends Vue{

    
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

    reportLoaded(){

    }

    load(){
      this.loaded = false;
      const closeLoad = (this.$message as any).loading();

      appsApi.getAppReport({
        code: this.reportCode
      }).then((res:any) => {
        closeLoad();
        if (res.errcode === 0) {
          this.title = res.data.name;
          this.objectId = res.data.reportObjectId || '';
        } else {
          this.$message.error(res.errmsg);
        }
      },()=> closeLoad()).finally(()=> this.loaded = true);
    }

    mounted(){
      this.load();
    } 

}
</script>


<style lang="less" scoped>

.report-design{
  top: 0 !important;
  display: flex;
  flex-direction: column;

  &__header{
    min-height: 64px;
    background: #052535;
    color: #fff;
    padding-left: 24px;
    font-size: 18px;
    display: flex;
    align-items: center;

    .h-icon-all-arrow-left-o {
      cursor: pointer;
    }

    span{
      margin-left: 25px;
    }

  }

  &__body{
    flex-grow: 1;
    overflow: auto;
  }

}

/deep/.h3-report-header{
  box-shadow: none;
}
</style>