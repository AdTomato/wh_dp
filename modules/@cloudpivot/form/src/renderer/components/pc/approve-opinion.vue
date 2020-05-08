
<template>
  <div>
    <SmartApprove
      :value="content"
      :opinions="opinions"
      :fileList="fileList"
      :headers="headers"
      :accept="accept"
      :locale="locale"
      @input="onInput"
    ></SmartApprove>

    <a-upload
      v-if="supprotUpload"
      :action="uploadUrl"
      :beforeUpload="beforeUpload"
      :multiple="true"
      listType="text"
      :fileList="fileList"
      :headers="headers"
      @preview="handlePreview"
      @change="onChange"
      class="upload"
    >
      <a-button>
        <a-icon type="upload"/>{{ $t('cloudpivot.form.renderer.tip.clickAndDropUpload') }}
      </a-button>
    </a-upload>

    <div v-if="controlOpts.showSignature">
      <div class="title">
        <span>{{ $t('cloudpivot.form.renderer.sign') }} {{ $t('cloudpivot.form.renderer.tip.onlySupportMobileWrite') }}</span>
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import SmartApprove from "../shared/smart-approve/index.vue";

import { RendererFormControl } from "../../typings";

import { Icon, Button, Upload, Modal } from "h3-antd-vue";

import { ApproveOpinionControl } from "../../controls";

@Component({
  name: "approve-opinion",
  components: {
    AIcon: Icon,
    AButton: Button,
    AUpload: Upload,
    AModal: Modal,
    SmartApprove
  }
})
export default class ApproveOpinion extends ApproveOpinionControl {

  get val(){
    return this.ctrl.value || {};
  }
  uploading = false;

  handlePreview() {}
  
  setControl() {
    this.handleValueChange(this.ctrl.value);
  }

  handleValueChange(value : any){
    if(this.uploading){
      this.uploading = false;
      return;
    }
    if (value && value.resources) {
      this.fileList = value.resources.map((x: any) => this.map(x));
    }
  }

  showError(msg: string) {
    this.$message.error(msg);
  }

  beforeUpload(file: File) {
    return this.checkFile(file, this.showError);
  }

  checkFile(file: File, showError?: (msg: string) => void) {
    if (!this.checkFileType(file.name, showError)) {
      return false;
    }

    if (!this.checkFileSize(file, showError)) {
      return false;
    }

    return true;
  }

  onChange(info: { file: any; fileList: any[]; event: any }): void {
    if (!this.checkFile(info.file)) {
      return;
    }
    
    this.fileList = info.fileList;
    this.uploading = true;
    const resources = info.fileList
      .filter(f => f.status === "done")
      .map(f => f.response.data);

    (this.ctrl as any).value = Object.assign(this.val,{
      resources
    });
  }

  onInput(val: string) {
    // this.ctrl.value.content = val;
    
    (this.ctrl as any).value = Object.assign(this.val,{
      content : val
    });
  }

  // onCheckboxChange(checked: boolean) {
  //   this.ctrl.value.saveCommon = checked;
  // }

  onSelectFocus() {
    super.search("");
  }
}
</script>

<style lang="less" scoped>
/deep/.ant-upload-select-text {
  margin-top: 8px;
}
.title{
  line-height: 32px;
}
</style>


