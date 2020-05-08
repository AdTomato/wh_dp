<template>
  <div class="data-import">
    <p class="data-import__tip">
      {{ $t('cloudpivot.list.pc.ImportTips1') }}<a href="javascript:;" @click="exportTemplate">{{ $t('cloudpivot.list.pc.ImportTips2') }}</a>
    </p>
    <section class="data-import__content">
      <div class="content--left">
        {{ $t('cloudpivot.list.pc.ChooseQueryFiled') }}
      </div>
      <div class="content--right">
        <div class="upload-select">
          <a-select
            class="upload-select-area"
            v-model="queryField"
            @change="queryFieldChange"
          >
            <a-select-option
              v-for="(field, index) in queryFieldList"
              :value="field.code"
              :key="index"
            >{{ field.name }}</a-select-option>
          </a-select>
        </div>
        <div class="upload-top">
          {{ $t('cloudpivot.list.pc.ChooseQueryFiledTips') }}
        </div>
      </div>
    </section>
    <section class="data-import__content">
      <div class="content--left">
        {{ $t('cloudpivot.list.pc.ImportLocalFaile') }}
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
              {{ $t('cloudpivot.list.pc.ClickToImport') }}
            </div>
          </a-upload-dragger>
        </div>
        <div class="upload-note">
          {{ $t('cloudpivot.list.pc.ImportTips3') }}
        </div>
      </div>
    </section>
    <section class="data-import__content">
      <div class="import-warn">{{ $t('cloudpivot.list.pc.ImportWarn') }}</div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import {
  State, namespace
} from 'vuex-class';
import {
  Button, Upload, Progress, Select
} from 'h3-antd-vue';

import DataInfo from './data-info.vue';
import { listApi as Application } from '@cloudpivot/api';

import { renderer } from '@cloudpivot/form';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

Vue.use(Upload);
@Component({
  name: 'dataimport',
  components: {
    AButton: Button,
    AProgress: Progress,
    ASelect: Select,
    ASelectOption: Select.Option,
    DataInfo,
    Upload
  }
})
export default class DataImport extends Vue {
  @WorkflowCenterModule.State('dataItemList') dataItemList: any;

  @WorkflowCenterModule.State('applicationPageTitle') applicationPageTitle: any;

  @Prop({
    type: String,
    required: true,
  }) schemaCode!: string;

  @Prop({
    type: String,
  }) queryCode!: string;

  percent: number = 0;

  hasError: boolean = false;

  isUploading:boolean = false;

  fileName: string = '';

  fileSize: number = 0;

  file: any = null;

  fileList =[];

  actionUrl:string = '';

  queryField:string = ''; // 查询字段

  get uploadUrl() {
    // return `${Application.fileUploadUrl}`;
    return renderer.UploadControl.service.getListUploadUrl();
  }

  get disabled() {
    return this.fileList.length > 0;
  }

  getSuffix(fileName:string) {
    const index = fileName.lastIndexOf('.');
    const suffix = fileName.substring(index + 1);
    return suffix;
  }

  get header() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`
    };
  }

  // 查询字段列表
  get queryFieldList() {
    const dataList = this.dataItemList.filter((data:any) => {
      if (!data.defaultProperty && data.propertyType === 0) {
        return true;
      } else if (data.defaultProperty && (data.code === 'name' || data.code === 'sequenceNo')) {
        return true;
      }
      return false;
    });
    return dataList;
  }

  async exportTemplate() {
    const params = {
      schemaCode: this.schemaCode,
      queryCode: this.queryCode
    };
    const res = await Application.exportTemplate(params);
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      this.$message.error(this.$t('cloudpivot.list.pc.DownloadFailed'));
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const date = new Date();
      const mounth = date.getMonth() > 8 ? date.getMonth() + 1:  `0${date.getMonth() + 1}`;
      const days = date.getDate() > 9 ? date.getDate():  `0${date.getDate()}`;
      const hours = date.getHours() > 9 ? date.getHours():  `0${date.getHours()}`;
      const minutes = date.getMinutes() > 9 ? date.getMinutes():  `0${date.getMinutes()}`;
      const seconds = date.getSeconds() > 9 ? date.getSeconds():  `0${date.getSeconds()}`;

      const stamp = `${date.getFullYear()}${mounth}${days}${hours}${minutes}${seconds}`;
      const fileName = `${this.applicationPageTitle}导入示例${stamp}.xlsx`;

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

  /**
   * 判断上传的文件是否excel文件
   */
  beforeUpload(file: any) {
    const suffixs = ['xlsx'];
    const suffix = this.getSuffix(file.name);
    return suffixs.indexOf(suffix) > -1;
  }

  handleChange(info:any) {
    this.file = info.file;
    this.isUploading = true;
    if (info.file.status !== 'uploading') {
      this.fileList = info.fileList;
      // console.log(info.file, info.fileList);
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

  queryFieldChange() {
     this.$emit('setQueryField', this.queryField);
  }

  remove() {
    this.fileList = [];
    this.$emit('change', false);
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
  min-height: 247px;
  max-height: 50vh;
  overflow-y: auto;
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
    display: flex;
    align-items: flex-start;
    overflow: hidden;
    margin-bottom: 10px;
    .content--left {
      flex: none;
      width: 84px;
      margin-right: 16px;
      line-height: 32px;
      // padding-top: 5px;
      color: rgba(0,0,0,0.65);
    }
    .content--right {
      flex: 1 1 410px;
      width: 410px;
      // float:left;
      // margin-left: 100px;
      // margin-top: -26px;
      .upload-area {
        width: 180px;
      }
      .upload-select {
        width: 400px;
        .upload-select-area{
          width: 100%;
        }
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
      .upload-top{
        margin-top: 0;
        line-height: @line-height-7;
        font-size: @font-size-12;
        color: rgba(0,0,0,0.45);
      }
    }
  }
  .import-warn {
    font-size: @font-size-12;
    color: @error-color;
  }
}
</style>
