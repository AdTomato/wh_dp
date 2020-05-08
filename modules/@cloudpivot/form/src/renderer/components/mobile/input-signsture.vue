
<template>
  <div class="input-signsture">

    <signatrue
      v-model="bs64Img"
      @change="upLoad"
      :readonly="readonly"
      :title="label"
      :required="ctrl.required"
      :labelStyle="style"
      @imageClick="previewImage"
    />
    
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import {
  RendererFormControl,
  FormControlType,
  SignatureUploadOptions
} from "../../typings";

import { BaseControl,FormLocationControl, UploadControl } from "../../controls";

import Signatrue from "../shared/signatrue.vue";


@Component({
  name: "input-signsture",
  components: {
    Signatrue
  }
})
export default class InputSignsture extends BaseControl<SignatureUploadOptions> {

  bs64Img:string = '';


  setControl() {
    // if (!this.ctrl.value[0]) return;
    // this.bs64Img =  UploadControl.service.getDownloadUrl(this.ctrl.value[0]);

    const val = this.ctrl.value;

    if(val && val.length > 0){
      this.bs64Img =  UploadControl.service.getDownloadUrl(this.ctrl.value[0]);
    }else{
      this.bs64Img = '';
    }

  }

   /**
   * 图片预览
   */
  previewImage(file:any) {
    
    UploadControl.service.download(this.ctrl.value[0]);

  }

  upLoad(file:any) {

    if (!file) {
      this.ctrl.value = null;
      return;
    }
    
    UploadControl.service.upFile(file).then((res:any) => {
      if (res.errcode === 0) {
        this.ctrl.value = [];
        this.ctrl.value.push(res.data);
      }
    });

  }
}
</script>
<style lang="less" scoped>
.scale-hairline-common(@color, @top, @right, @bottom, @left) {
  content: '';
  position: absolute;
  background-color: @color;
  display: block;
  z-index: 1;
  top: @top;
  right: @right;
  bottom: @bottom;
  left: @left;
}
.hairline(@direction, @color: @border-color-base) when (@direction = 'bottom') {
  border-bottom: 1PX solid @color;

  html:not([data-scale]) & {
    @media (min-resolution: 2dppx) {
      border-bottom: none;

      &::after {
        .scale-hairline-common(@color, auto, auto, 0, 0);
        width: 100%;
        height: 1PX;
        transform-origin: 50% 100%;
        transform: scaleY(0.5);

        @media (min-resolution: 3dppx) {
          transform: scaleY(0.33);
        }
      }
    }
  }
}
.hairline(@direction, @color: @border-color-base) when (@direction = 'top') {
  border-top: 1PX solid @color;

  html:not([data-scale]) & {
    @media (min-resolution: 2dppx) {
      border-top: none;

      &::before {
        .scale-hairline-common(@color, 0, auto, auto, 0);
        width: 100%;
        height: 1PX;
        transform-origin: 50% 50%;
        transform: scaleY(0.5);

        @media (min-resolution: 3dppx) {
          transform: scaleY(0.33);
        }
      }
    }
  }
}
// .address-textarea{
//   /deep/textarea::placeholder{
//     color: #999;
//   }
//   position: relative;
//   .hairline('top',#EEE);
//   &__local{
//     top: 0;
//     right: 0;
//     width: 1.26rem;
//     height: 1.2rem;
//     position: absolute;
//     display: flex;
//     justify-content: center;
//     align-items: center;
//   }
// }

</style>
<style>

.input-signsture.vertical .row__file{
  display: block;
}

.input-signsture.vertical .row__file .field__content{
  padding-top: 10px;
}
</style>

