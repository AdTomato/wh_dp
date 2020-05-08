<template>
  <div
    class="upload-control-component"
    :class="{ 'upload-image': isImage, 'upload-files': !isImage }"
  >
    <!-- batch-download-o -->

    <!-- <span class="icon aufontAll h-icon-all-aliwangwang"></span> -->
    <template v-if="showBatchDownload && !!isReadonly && fileList.length > 1">
      <span @click="downloadAll" class="all-download icon aufontAll h-icon-all-batch-download-o"></span>
      <a-button
        @click="downloadAll"
        class="download"
        icon="batch-download-o"
      >{{ $t('cloudpivot.form.renderer.downloadAll') }}</a-button>
    </template>
    <div class="message" v-if="!isReadonly && controlOpts.onlyShoot">请在手机端拍照上传</div>

    <a-upload
      :action="uploadUrl"
      :beforeUpload="beforeUpload"
      :multiple="multi"
      :defaultFileList="fileList"
      :fileList="fileList"
      :listType="listType"
      :headers="headers"
      @preview="handlePreview"
      @change="onChange"
      :uploadList="isImage"
      :class="{
        'unwritable' : isReadonly, 
        'has-no-parent': !control.parentKey, 
        'has-parent': control.parentKey
      }"
    >
      <template v-if="canUpload && !isReadonly && !controlOpts.onlyShoot">
        <div v-if="isImage && !control.parentKey">
          <a-icon type="plus" />
          <div class="ant-upload-text">{{ text }}</div>
        </div>
        <template v-else>
          <a-button>
            <a-icon type="upload" />
            <!-- 点击或拖拽{{text}}上传 -->
            {{ $t('cloudpivot.form.renderer.tip.clickAndDropUpload') }}
          </a-button>
          <!-- 
          <a-button
            v-if="showBatchDownload && fileList.length > 1 && canDounload"
            @click="downloadAll"
            class="download right-download"
            icon="download"
          >{{ $t('cloudpivot.form.renderer.downloadAll') }}</a-button>-->
          <div
            class="all-download-wrap"
            v-if="showBatchDownload && fileList.length > 1 && canDounload"
            @click.stop="downloadAll"
          >
            <span
              @click.stop="downloadAll"
              class="all-download icon aufontAll h-icon-all-batch-download-o"
            ></span>
            <span>{{ $t('cloudpivot.form.renderer.downloadAll') }}</span>
            <!-- <a-button
              @click="downloadAll"
              class="download"
            >{{ $t('cloudpivot.form.renderer.downloadAll') }}</a-button>-->
          </div>
        </template>
      </template>
      <file-list
        v-if="!isImage"
        :list="fileList"
        :eventList="eventList"
        :downUrls="ctrl.value"
        :showRm="isReadonly"
        @rm-file="rmFile"
      />
    </a-upload>

    <!-- <a-button v-if="showBatchDownload && fileList.length > 1" 
      @click="downloadAll" 
      class="download" icon="download">
      {{ $t('cloudpivot.form.renderer.downloadAll') }}
    </a-button>-->

    <a-modal
      :visible="previewVisible"
      :footer="null"
      @cancel="handleCancel"
      :maskClosable="false"
      :keyboard="false"
    >
      <img
        alt="example"
        style="width: 100%"
        :src="previewImage" 
      />
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Subscription } from "rxjs";

import { Vue, Prop, Component, Inject } from "vue-property-decorator";

import { RendererFormControl } from "../../typings";

import { UploadLimitType, FormControlType } from "../../typings";

import { FileUploadControl, UploadStatus } from "../../controls";
import FileList from './file-list.vue';

import {
  ControlPropertyChange,
  ControlCommand,
  PropertyNames,
  SelectControl
} from "h3-forms";

import { Icon, Button, Upload, Modal } from "h3-antd-vue";

@Component({
  name: "pc-upload",
  components: {
    AIcon: Icon,
    AButton: Button,
    AUpload: Upload,
    AModal: Modal,
    FileList
  }
})
export default class PcUpload extends FileUploadControl {
  previewVisible = false;

  previewImage = "";

  fileList: any[] = [];
  eventList:any[] = [];
  commandSubscription?: Subscription;

  get listType() {
    // 上传图片为 picture-card 样式, 上传文件显示为 text 样式
    return this.isImage ? "picture-card" : "text";
  }

  get showBatchDownload() {
    return this.canBatchDownload && this.fileList.length > 0;
  }

  get canDounload() {
    // debugger
    const fileDown: any[] = this.fileList.filter((f: any) => {
      return f.status === "done";
    });
    if (fileDown.length === this.fileList.length) {
      return true;
    } else {
      return false;
    }
  }

  get isReadonly() {
    if (this.ctrl) {
      return this.readonly
    }
    return true
  }

  unsubscribe() {
    if (this.commandSubscription) {
      this.commandSubscription.unsubscribe();
    }
  }

  setControl() {
    if (this.ctrl && this.ctrl.value) {
      this.toFilelist(this.ctrl.value);
    } else {
      this.fileList = [];
    }

    this.unsubscribe();

    this.listenCommand();
  }

  handleValueChange(value: any): void {
    this.toFilelist(value);
  }

  toFilelist(val: any[] | null) {
    if (!val) {
      this.fileList = [];
      return;
    }

    this.fileList = val.map((x: any) => {
      if (x.response && x.response.data) {
        x.url = this.getDownloadUrl(x.response.data);
      }

      let status = "";

      switch (x.status) {
        case "removed":
          return;

        default:
        case UploadStatus.Done:
          status = "done";
          break;
        case UploadStatus.Error:
          status = "error";
          break;
        case UploadStatus.Uploading:
          status = "uploading";
          break;
      }

      x.status = status;

      return x;
    });
  }

  listenCommand() {
    const _this = this;
    this.commandSubscription = this.ctrl.commander.subscribe(
      (cmd: ControlCommand) => {
        switch (cmd.name) {
          case "clear":
            _this.fileList = [];
            _this.ctrl.value = null;
            break;
          default:
            break;
        }
      }
    );
  }

  showError(msg: string) {
    this.$message.error(msg);
  }

  beforeUpload(file: any) {
    if (!this.checkFileType(file.name, this.showError)) {
      return false;
    }

    if (!this.checkFileSize(file, this.showError)) {
      return false;
    }

    if(!this.checkImageNumber(this.showError)) {
      return false
    }
    file.uploadTime = new Date().getTime();
    file.uploadName = window.sessionStorage.getItem('uploadName');
    return true;
  }

  onChange(info: { file: any; fileList: any[]; event: any }): void {
    if (this.isReadonly) {
      return;
    }
    // 保存文件状态
    let { file } = info;
    // 保存文件上传进度
    this.eventList = info.fileList;
    console.log('info.fileList', info.fileList)
    this.fileList = info.fileList.filter(f => f.status);
    const files = this.fileList
      .filter(f => f.status !== "removed")
      .map(f => {
        let status = UploadStatus.Uploading;

        switch (f.status) {
          case "done":
            status = UploadStatus.Done;
            break;
          case "error":
            status = UploadStatus.Error;
            break;
          case "uploading":
            status = UploadStatus.Uploading;
            break;
        }
        return {
          uid: f.uid,
          name: f.name,
          size: f.size,
          type: f.type,
          status: status,
          response: f.response,
          uploadTime: f.uploadTime,
          uploadName: f.uploadName
        };
      });
    // debugger
    super.onFilesChange(files);
  }
  /**
   * @des 删除文件
   */
  rmFile(file: any){
    this.removedFile(file)
  }
  onRemove() {
    return !this.isReadonly;
  }

  handleCancel() {
    this.previewVisible = false;
  }

  handlePreview(file: any) {
    if (!this.isImage) {
      this.download(file.response.data);
      return;
    }
    this.previewImage = file.url || file.thumbUrl;
    this.previewVisible = true;
  }

  downloadAll() {
    this.downloadBatch();
  }

  destroyed() {
    super.destroyed();

    this.unsubscribe();
  }

  created() {
    this.init()
  }
}
</script>

<style lang="less" scoped>
/deep/.unwritable {
  .anticon-delete {
    display: none;
  }
  /*.ant-upload-list:before {*/
  /*display: none;*/
  /*}*/
}
/deep/.ant-upload-select-text{
  width: 100%;
}
button.download {
  border: 0;
  padding: 0;
  color: @primary-color;
}
button.download.right-download {
  margin-left: 25px;
}
.right-download {
  margin-left: 25px;
}

.message {
  margin-bottom: 0.5em;
}
.all-download {
  color: @primary-color;
  cursor: pointer;
  font-size: 14px;
}
.all-download-wrap {
  display: inline-block;
  margin-left: 25px;
  color: @primary-color;
  cursor: pointer;
}
</style>

<style lang="less" scoped>
// 图片上传样式修改
.upload-control-component.upload-image {
  // 子表外的
  .has-no-parent {
    position: relative;
    display: block;
    /deep/.ant-upload-list {
      &:before {
        width: 104px;
        height: 104px;
        float: left;
        display: block;
        margin: 0 8px 8px 0;
      }

      /deep/.ant-upload-list-item-info > span {
        display: block;
        width: 100%;
        height: 100%;
        a {
          display: block;
          width: 100%;
          height: 100%;
          position: relative;
          left: 0;
          top: 0;
          img {
            min-width: 100%;
            max-width: 200%;
            width: auto;
            height: auto;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      }
    }
    /deep/.ant-upload.ant-upload-select-picture-card {
      position: absolute;
      left: 0;
      top: 0;
    }
  }
  .unwritable {
    /deep/.ant-upload-list {
      &:before {
        display: none;
      }
    }
  }
  // 子表内的
  span.has-parent {
    width: 100% !important;
    display: flex;
    flex-direction: column-reverse;
    /deep/.ant-upload-list-picture-card /deep/.ant-upload-list-item {
      // background: red;
      width: 55px;
      height: 55px;
      border-radius: 4px;
      overflow: hidden;
      padding: 0 !important;
      margin: 8px 8px 0 0 !important;
      /deep/.ant-upload-list-item-info {
        padding-left: 0;
        & > span {
          height: 100%;
          /deep/.ant-upload-list-item-thumbnail {
            position: relative;
            left: 0;
            top: 0;
            img {
              display: block;
              min-width: 100%;
              max-width: 200%;
              height: auto;
              width: auto;
              position: absolute;
              left: 50%;
              top: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
    /deep/.ant-upload.ant-upload-select-picture-card {
      //  /deep/.ant-upload-list-item-info{
      //   padding-left: 0;
      //  }
      width: 100%;
      border: none;
      margin: 0;
      height: 32px;
      background-color: #fff;
      overflow: hidden;
      /deep/.ant-upload {
        padding: 0;
        width: 100%;
        button {
          width: 100%;
          padding: 0 10px;
        }
        // button.download {
        //     width: 50%;
        // }
        .all-download-wrap {
          margin-left: 0;
          display: block;
          margin-top: 8px;
          color: @primary-color;
          cursor: pointer;
          text-align: left;
          .all-download {
            // margin-left: 4px;
            margin-right: 4px;
          }
          button.download {
            width: 65px;
          }
        }
      }
    }
  }
}
// 附件上传样式修改
.upload-control-component.upload-files {
  /deep/.ant-upload-list{
    display: none;
  }
  /deep/.ant-upload-list-item {
    // background: red;
    /deep/.ant-upload-list-item-info {
      padding-left: 0 !important;
    }
  }
  span.has-parent {
    width: 100%;
    /deep/.ant-upload.ant-upload-select {
      width: 100%;
      button {
        width: 100%;
        padding:0 10px;
      }
      .all-download-wrap {
        margin-left: 0;
        display: block;
        margin-top: 8px;
        color: @primary-color;
        cursor: pointer;
        .all-download {
          // margin-left: 4px;
          margin-right: 4px;
        }
        button.download {
          width: 65px;
        }
      }
      // .ant-upload-list-item-info{
      //   padding-left: 0;
      // }
    }
  }
}

/deep/.ant-upload-list-item-name {
  color: @light-color-1;

  &:hover {
    color: @primary-color;
  }
}
</style>
