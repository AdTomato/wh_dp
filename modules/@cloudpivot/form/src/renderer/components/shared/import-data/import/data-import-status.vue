<template>
  <div class="data-import-status">

    <div class="data-import-status--success" v-if="isSuccess">
      <a-progress
        type="circle"
        :percent="100"
      ></a-progress>
      <div>{{ $t('cloudpivot.list.pc.ImportSuccess') }}</div>
    </div>

    <div class="data-import-status--error" v-else-if="systemError">
      <a-progress
        type="circle"
        :percent="70"
        status="exception"
      ></a-progress>
      <div class="error-tip">{{ $t('cloudpivot.list.pc.ImportTips5') }}</div>
    </div>

    <div class="data-import-status--halfsuccess" v-else-if="isHalfSuccess">
      <p class="data-import-status--halfsuccess__success">
        <i class="icon aufontAll h-icon-all-check-circle"/>
        <span>{{ $t('cloudpivot.list.pc.ImportTips6', {num: successNum}) }}</span>
      </p>
      <p class="data-import-status--halfsuccess__error">
        <i class="icon aufontAll h-icon-all-close-circle"/>
        <span>{{ $t('cloudpivot.list.pc.ImportTips7', {num: failNum}) }}</span>
      </p>
      <p class="data-import-status--halfsuccess__tip">
        {{ $t('cloudpivot.list.pc.ImportTips8') }}
        <a href="javascript:;" @click="exportErrorTem">{{ $t('cloudpivot.list.pc.DownloadFailedList') }}</a>
      </p>
    </div>

    <div class="data-import-status--detail" v-else-if="showFailMessage">
      <p>
        <i class="icon aufontAll h-icon-all-close-circle"/>
        <span>{{ $t('cloudpivot.list.pc.ImportFailed') }}</span>
      </p>

      <p class="data-import-status--detail__message" v-if="isUnspecified">
        {{ $t('cloudpivot.form.renderer.tip.importErrorRelation') }}
      </p>
      
      <p class="data-import-status--detail__message" v-else-if="isTemplateEmpty">
        {{ $t('cloudpivot.form.renderer.tip.importErrorEmpty') }}
      </p>
      
      <p class="data-import-status--detail__message" v-else-if="!matchError">
        {{ $t('cloudpivot.list.pc.ImportTips9') }}
      </p>

      <p class="data-import-status--detail__message" v-else>
        {{ $t('cloudpivot.form.renderer.tip.importError') }}
        <!-- {{ $t('cloudpivot.list.pc.ImportTips10') }}
        <a href="javascript:;" @click="exportTemplate">{{ $t('cloudpivot.list.pc.SampleFile') }}</a>
        {{ $t('cloudpivot.list.pc.Recheck') }} -->
      </p>
    </div>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Progress } from 'h3-antd-vue';
import { listApi, listParams, formApi }  from '@cloudpivot/api';

import { listApi as Application } from '@cloudpivot/api';

@Component({
  name: 'data-import-status',
  components: {
    AProgress: Progress
  }
})
export default class DataImportStatus extends Vue {
  @Prop({
    type: Number,
    default: 0
  }) successNum!: number;

  @Prop({
    type: Number,
    default: 0
  }) failNum!: number;

  @Prop({
    type: Number,
    default: 0
  }) status!: listParams.ImportResult;

  @Prop({
    type: String,
  }) fileName!: string;

  @Prop({
    type: String,
  }) schemaCode!: string;

  @Prop() sheetParams!:any;

  @Prop() errorFile!:string;

  get isHalfSuccess() {
    return this.status === listParams.ImportResult.PartialSuccess;
  }

  get showFailMessage() {
    return this.status === listParams.ImportResult.DataNumExceed
     || this.status === listParams.ImportResult.DataColumnError
     || this.isUnspecified
     || this.isTemplateEmpty;
  }

  get matchError() {
    return this.status === listParams.ImportResult.DataColumnError;
  }

  get systemError() {
    return this.status === listParams.ImportResult.SystemError;
  }

  get isSuccess() {
    return this.status === listParams.ImportResult.Success;
  }

  get isTemplateEmpty(){
    return this.status === listParams.ImportResult.TemplateEmpty;
  }

  get isUnspecified(){
    return this.status === listParams.ImportResult.Unspecified;
  }

  
   exportErrorTem() {
     if (!this.errorFile) {
       return
     }
    this.exportErrorResult(this.errorFile,'错误提示template.xlsx');
    
  }

  /**
   * 下载模板
   */
   exportTemplate() {
      formApi.exportTemplate(this.sheetParams).then((res:any) => {
        if (res.errcode === 0) {
          this.exportErrorResult(res.data);
        }
      });
    }

  async exportErrorResult(file:string,customName?:string) {
    // debugger
    const res = await Application.exportErrorResult(file);
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      this.$message.error(this.$t('cloudpivot.list.pc.DownloadFailed'));
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const stamp = new Date().getMilliseconds();
      let fileName = '';
      if (customName) {
        fileName = customName;
      } else {
        fileName = 'template.xlsx';
      }
     
      this.downloadFile(blob, fileName);
    }
  }
  
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
}

</script>
<style lang='less' scoped>
.data-import-status {
  height: 222px;
  text-align: center;
  .data-import-status--success,
  .data-import-status--error{
    padding-top: 12px;
    div.error-tip {
      margin-top: 16px;
      line-height: @line-height-7;
      font-size: @font-size-16;
      color: rgba(0,0,0,0.85);

    }
  }
  .data-import-status--halfsuccess {
    text-align: left;
    p {
      line-height: @line-height-11;
      span {
        margin-left: 16px;
        font-size: @font-size-16;
        color: rgba(0,0,0,0.85);
      }
      &.data-import-status--halfsuccess__tip {
        margin-top: 8px;
        padding-left: 32px;
        font-size: @font-size-14;
        color: rgba(0,0,0,0.45);
        a {
          margin-left: 10px;
          color: @primary-color;

        }
      }
      &.data-import-status--halfsuccess__success {
        i {
          color: @success-color
        }
      }
      &.data-import-status--halfsuccess__error {
        margin-top: 24px;
        i {
          color: @error-color
        }
      }
    }
  }
  .data-import-status--detail{
    text-align: left;
    p {
      i {
        color: @error-color;
      }
      span {
        margin-left: 16px;
        font-size: @font-size-16;
        color: rgba(0,0,0,0.85);
      }
      &.data-import-status--detail__message {
        margin-top: 24px;
        margin-left: 32px;
        font-size: @font-size-16;
        color: rgba(0,0,0,0.85);
        a {
          color: @primary-color;
        }
      }
    }
  }

}
</style>
