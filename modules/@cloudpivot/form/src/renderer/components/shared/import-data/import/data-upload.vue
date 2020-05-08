<template>
  <div class="data-import">
    <p class="data-import__tip">
      {{ $t('cloudpivot.form.runtime.biz.importTips1') }}<a href="javascript:;" @click="exportTemplate">{{ $t('cloudpivot.form.runtime.biz.importTips2') }}</a>
    </p>
    <section class="data-import__content">
      <div class="content--left">
        {{ $t('cloudpivot.form.runtime.biz.importLocalFaile') }}
      </div>
      <div class="content--right">
        <div class="upload-area">
          <a-upload-dragger
            ref="fileUpload"
            name="file"
            :multiple="false"
            :disabled="disabled"
            :action="uploadUrl"
            accept=".xlsx"
            :headers="header"
            :beforeUpload="beforeUpload"
            @change="handleChange"
            @remove="remove"
          >
            <div>
              {{ $t('cloudpivot.form.runtime.biz.selectLocalFaile') }}
            </div>
          </a-upload-dragger>
        </div>
        <div class="upload-note">
          {{ $t('cloudpivot.form.runtime.biz.importTips3') }}
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  Button, Upload, Progress
} from 'h3-antd-vue';

import DataInfo from './data-info.vue';
import { listApi as Application } from '@cloudpivot/api';

import { formApi } from '@cloudpivot/api';

import { FormSheet } from '../../../../../schema';
import { UploadControl } from "../../../../controls";

import { utils } from '@cloudpivot/common';

Vue.use(Upload);
@Component({
  name: 'dataimport',
  components: {
    AButton: Button,
    AProgress: Progress,
    DataInfo,
    Upload
  }
})
export default class DataImport extends Vue {

  @Prop() sheetParams!:any

  @Prop()
  sheet !: FormSheet

  fileList =[];

  file: any = null;


  isUploading:boolean = false;

  hasError: boolean = false;

  /**
   * 判断上传的文件是否excel文件
   */
  beforeUpload(file: any) {
    const suffixs = ['xlsx'];
    const suffix = this.getSuffix(file.name);
    return suffixs.indexOf(suffix) > -1;
  }

  getSuffix(fileName:string) {
    const index = fileName.lastIndexOf('.');
    const suffix = fileName.substring(index + 1);
    return suffix;
  }

  handleChange(info:any) {
    this.file = info.file;
    this.isUploading = true;
    if (info.file.status !== 'uploading') {
      this.fileList = info.fileList;
    }
    if (info.file.status === 'done') {
      this.isUploading = false;
      this.$emit('change', true);
      this.$emit('setFileName', info.file.response);
    } else if (info.file.status === 'error') {
      this.isUploading = false;
      this.hasError = true;
    }
  }

  remove() {
    this.fileList = [];
    this.$emit('change', false);
  }

  get disabled() {
    return this.fileList.length > 0;
  }

  get header() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  get uploadUrl() {
    return UploadControl.service.getListUploadUrl();
  }

  exportTemplate() {
    formApi.exportTemplate(this.sheetParams).then((res:any) => {
      if (res.errcode === 0) {
        this.exportErrorResult(res.data);
      }
    });
  }

  async exportErrorResult(file:string) {
    const res = await Application.exportErrorResult(file);
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      this.$message.error(this.$t('cloudpivot.list.pc.DownloadFailed'));
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });

      let sheetName = this.sheet.options.name_i18n ? this.sheet.options.name_i18n[this.$i18n.locale] : '';
      if(!sheetName){
        sheetName = this.sheet.options.name;
      }
      const fileName = sheetName + this.$t('cloudpivot.form.renderer.importFile').toString()
       +  utils.DateHandle.dateFormat(new Date(),'YYYYMMDDHHmmss') +'.xlsx';

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

.ant-modal-header {
  border-bottom: none;
}

.ant-modal-footer {
  border-top: none;
}
.data-import {
  height: 222px;
  .data-import__tip {
    margin-bottom: 20px;
    line-height: @line-height-7;
    font-size: @font-size-14;
    color: rgba(0,0,0,0.45);
    a {
      color: @primary-color;
    }
  }
  .data-import__content {
    overflow: hidden;
    .content--left {
      padding-top: 5px;
      width: 84px;
      color: rgba(0,0,0,0.65);
    }
    .content--right {
      padding-top:2px;
      width: 410px;
      float:left;
      margin-left: 100px;
      margin-top: -26px;
      .upload-area {
        width: 180px;
      }
      /deep/ .ant-upload-btn {
        padding: 5px 0;
      }
      /deep/ .ant-upload-list {
        width: 410px;
      }
      .upload-note {
        margin-top: 4px;
        line-height: @line-height-7;
        font-size: @font-size-12;
        color: rgba(0,0,0,0.45);
      }
    }
  }
}
</style>
