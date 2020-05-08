
<template>
  <div
    class="input-signsture"
  >
    <div
      v-if="!bs64Img"
      class="input-signsture__title"
    >
      <span>{{ $t('cloudpivot.form.renderer.tip.onlySupportMobileWrite') }}</span>
    </div>
    <div
      v-else
      class="input-signsture__img clearfix"
      @mouseover="mouseListener(1)"
      @mouseleave="mouseListener(0)"
    >
      <div>
        <img :src="bs64Img" @click.stop="isPreviewImage = true" />
      </div>
      <!-- <span v-show="hover" @click.stop="isPreviewImage = true" class="icon aufontAll">&#xe726;</span> -->
    </div>

    <a-modal
      v-model="isPreviewImage"
      :footer="null"
      :maskClosable="false"
      :keyboard="false"
    >
      <img
        style="width: 100%"
        :src="bs64Img" 
      />
    </a-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { Modal } from "h3-antd-vue";

import { RadioControl } from "h3-forms";

import {
  RendererFormControl,
  FormControlType,
  SignatureUploadOptions
} from "../../../typings";

import {
  BaseControl,
  FormLocationControl,
  UploadControl
} from "../../../controls";

import Signatrue from "../../shared/signatrue.vue";

@Component({
  name: "input-signsture",
  components: {
    Signatrue,
    AModal: Modal
  }
})
export default class InputSignsture extends BaseControl<
  SignatureUploadOptions
> {
  bs64Img: string = "";

  isPreviewImage: boolean = false;

  hover: boolean = false;

  mouseListener(type: number) {
    this.hover = Boolean(type);
  }

  setControl() {
    // PC端只能查看，所以不能设置必填
    (this.ctrl as RadioControl).required = false;

    this.handleValueChange((this.ctrl as any).value);
  }
  
  handleValueChange(files: any[]): void {
    if (files && files.length > 0) {
      this.bs64Img = UploadControl.service.getDownloadUrl(files[0]);
    } else {
      this.bs64Img = "";
    }
  }
}
</script>
<style lang="less" scoped>
.input-signsture {
  &__img {
    position: relative;
    div {
      float: left;
      img {
        width: 64px;
        height: 64px;
        border-radius: 2px;
        border: 1px solid rgba(221, 221, 221, 1);
        cursor: url("./enlarge-o.png"), pointer;
      }
    }
    .icon {
      position: absolute;
      left: 50px;
      top: 36px;
      cursor: pointer;
      font-size: 14px;
    }
  }

  &__title {
    span {
      line-height: 32px;
    }
  }
}
</style>

