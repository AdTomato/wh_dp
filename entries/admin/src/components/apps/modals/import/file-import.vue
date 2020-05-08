<template>
  <div class="file-import">
    <div class="import-progress">
      <a-progress
        type="circle"
        :percent="percent"
        :width="100"
        :status="progressStatus"
        :strokeColor="'#17BC94'"
      ></a-progress>

      <div class="note">
        {{ importStatusTxt }}
      </div>

      <div class="import-hint">{{ importHint }}</div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Prop, Vue, Watch
} from 'vue-property-decorator';

import { Progress } from 'h3-antd-vue';

import * as FileValidateNS from '@/typings/app-error';

@Component({
  name: 'FileImport',
  components: {
    AProgress: Progress
  }
})

export default class FileImport extends Vue {
  @Prop() percent !:number; // 进度

  @Prop() isImportEnd !:boolean; // 是否导入完成

  @Prop() importStatus !:string; // 导入状态


  importStatusTxt:string = this.$t('languages.Apps.Importing') as string;

  importHint:string = this.$t('languages.Apps.NoCloseWindowUntillImportFinished') as string; // 导入提醒

  progressStatus:string = 'active'; // 导入状态

  @Watch('importStatus')
  onImportStatusChange(v:string) {
    switch (v) {
      case FileValidateNS.ImportStatus.Importing:
        this.importStatusTxt = this.$t('languages.Apps.Importing') as string;
        this.importHint = this.$t('languages.Apps.NoCloseWindowUntillImportFinished') as string;
        break;
      case FileValidateNS.ImportStatus.ImportSuccess:
        this.importStatusTxt = this.$t('languages.Apps.ImportSuccess') as string;
        this.importHint = this.$t('languages.Apps.PlzRepublishDataModelAndProcess') as string;
        break;
      case FileValidateNS.ImportStatus.ImportError:
        this.importStatusTxt = this.$t('languages.Apps.ImportError') as string;
        this.importHint = this.$t('languages.Apps.PlzReimportCauseNetworkError') as string;
        this.progressStatus = 'exception';
        break;
      default: break;
    }
  }
}
</script>

<style lang="less" scoped>
  .file-import {
    & .import-progress {
      margin-top: 36px;
      text-align: center;
      & .note {
        margin-top: 12px;
        color: rgba(0, 0, 0, .85);
        font-size: 16px;
      }
      & .import-hint {
        margin-top: 8px;
        color: rgba(0, 0, 0, .65);
        font-size: 14px;
      }
    }
  }
</style>
