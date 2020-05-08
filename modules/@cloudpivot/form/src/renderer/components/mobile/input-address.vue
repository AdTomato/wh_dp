
<template>
  <div class="address">
    <template>
      <div>
        <pca-selector
          v-if="!readonly"
          v-model="pca"
          :format="controlOpts.locationType"
          :showEmpty="showEmpty"
          :readonly="readonlyFormula || !!readonly"
          :title="label"
          :required="ctrl.required"
          :labelStyle="style"
          @change="valueChange"
        />
      </div>
      <div class="address-textarea" :class="{addressVertical: layoutType}" v-if="controlOpts.addressDetail === 'true'">
        <template v-if="!readonly">
          <h3-textarea
            v-model="val.address"
            :readonly="readonlyFormula || !!readonly"
            :isCNChart="true"
            :error="ctrl.hasError"
            :placeholder="$t('cloudpivot.form.renderer.inputAddress')"
            @onChange="textAreaChange"
            :clear="true"
            @onFocus="isShowPosition = false"
            @onBlur="isShowPosition = true"
          ></h3-textarea>
          <template v-if="isShowPosition">
            <div
              class="address-textarea__local"
              @click="getPosition"
              v-if="!readonly"
            >
              <span v-if="!(readonlyFormula || readonly)" class="icon aufontAll">&#xe959;</span>
            </div>
          </template>
        </template>
        <smart-location
          @change="mapChange"
          :showLabel="false"
          :visibel="showLocation"
          @cancel="close"
        />
      </div>

      <template v-if="!!readonly">
        <div class="field">
          <!-- deewewre -->
          <div class="field__label top">{{ label }}</div>
          <div class="field__control">
            <mutil-text :text="addressString"></mutil-text>
          </div>
        </div>
      </template>
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";
import { H3Textarea } from "h3-mobile-vue";
import {
  RendererFormControl,
  FormControlType,
  AddressOptions
} from "../../typings";

import {
  BaseControl,
  FormLocationControl,
  AddressControl
} from "../../controls";

// import  pca  from '../shared/pca-selector/typings/pca';

import PcaSelector from "../shared/mobile-pca-selector/pca-selector.vue";

import { FromAddressValueService } from "../../services";

import MutilText from "../shared/mutil-text.vue";

import { Subscription } from "rxjs";

import SmartLocation from "../shared/mobile-smart-location/smart-location.vue";

@Component({
  name: "input-text",
  components: {
    PcaSelector,
    H3Textarea,
    MutilText,
    SmartLocation
  }
})
export default class Address extends AddressControl {
  isShowPosition: boolean = true;

  showLocation = false;

  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType(){
    if(this.layoutTypeFn){
      return this.layoutTypeFn();
    }
  }

  // pca:any = {}

  // setControl() {

  //   if (this.ctrl.value) {
  //     this.setPcaDate();
  //   }

  //   // this.unsubscribe();

  //   // this.subscription = (this.ctrl as any).valueChange.subscribe((change:any) => {
  //   //   this.setPcaDate();
  //   // });

  // }

  // handleValueChange(){
  //   this.setPcaDate();
  // }

  valueChange(val: any) {
    super.valueChange(val);
  }

  textAreaChange() {
    if (this.ctrl.value) {
      this.ctrl.value = JSON.parse(JSON.stringify(this.ctrl.value));
    }
  }

  // created() {
  //     debugger
  //     this
  // }

  // get showEmpty() {
  //   return this.controlOpts.showEmpty === 'true';
  // }

  getPosition() {
    if (this.readonly || this.readonlyFormula) return;
    
    this.showLocation = true;
    // FormLocationControl.service.position(200, true).then(result => {
    //   const val:any =  FromAddressValueService.setAddressVal(result.adcode,this.controlOpts.locationType);
    //   this.ctrl.value = Object.assign(result,val);
    //   this.setPcaDate();
    // })
  }

  mapChange(val: any) {
    if (val.adcode) {
      const location: any = FromAddressValueService.setAddressVal(
        val.adcode,
        this.controlOpts.locationType
      );
      const type = this.controlOpts.locationType.split("-").length;

      if (type === 3) {
        location.address = val.address;
      } else if (type === 2) {
        location.address = `${val.districtName}${val.address}`;
      } else {
        location.address = `${val.cityName}${val.districtName}${val.address}`;
      }
      this.ctrl.value = Object.assign(val, location);
      this.setPcaDate();
    } else {
      this.ctrl.value = null;
    }
  }

  close() {
    this.showLocation = false;
  }

  // setPcaDate() {
  //   let data:any = JSON.parse(JSON.stringify(this.ctrl.value));
  //   delete data.address;
  //   this.pca = data;
  // }

  // get addressString() {
  //   const { provinceName, cityName, districtName, address} = this.ctrl.value;
  //   const addressList:Array<any> = [];
  //   addressList.push(provinceName, cityName, districtName, address);
  //   const str = addressList.reduce((str:string,current:string)=> {
  //     let currentStr:string = '';
  //     let beforeStr:String = '';
  //     if(current) {
  //       currentStr = current;
  //     }
  //     if (str) {
  //       beforeStr = str;
  //     }
  //      return `${beforeStr} ${currentStr}`
  //   });
  //   return str
  // }

  // unsubscribe() {
  //   if (this.subscription) {
  //     this.subscription.unsubscribe();
  //     this.subscription = undefined;
  //   }
  // }

  // destroyed() {
  //   super.destroyed();

  //   this.unsubscribe();
  // }
}
</script>
<style lang="less" scoped>
.scale-hairline-common(@color, @top, @right, @bottom, @left) {
  content: "";
  position: absolute;
  background-color: @color;
  display: block;
  z-index: 1;
  top: @top;
  right: @right;
  bottom: @bottom;
  left: @left;
}
.hairline(@direction, @color: @border-color-base) when (@direction = "bottom") {
  border-bottom: 1px solid @color;

  html:not([data-scale]) & {
    @media (min-resolution: 2dppx) {
      border-bottom: none;

      &::after {
        .scale-hairline-common(@color, auto, auto, 0, 0);
        width: 100%;
        height: 1px;
        transform-origin: 50% 100%;
        transform: scaleY(0.5);

        @media (min-resolution: 3dppx) {
          transform: scaleY(0.33);
        }
      }
    }
  }
}
.hairline(@direction, @color: @border-color-base) when (@direction = "top") {
  border-top: 1px solid @color;

  html:not([data-scale]) & {
    @media (min-resolution: 2dppx) {
      border-top: none;

      &::before {
        .scale-hairline-common(@color, 0, auto, auto, 0);
        width: 100%;
        height: 1px;
        transform-origin: 50% 50%;
        transform: scaleY(0.5);

        @media (min-resolution: 3dppx) {
          transform: scaleY(0.33);
        }
      }
    }
  }
}
.address-textarea {
  /deep/textarea::placeholder {
    color: #999;
  }
  position: relative;
  .hairline("top", #eee);
  &__local {
    top: 0;
    right: 0;
    width: 1.26rem;
    height: 1.2rem;
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
<style>
.addressVertical .address-textarea__local{
  top: 25px;
  right: 14px;
}
.address.vertical .pca-selector--row>div{
  display: block;
}
.address.vertical .pca-selector--row>div .field__content{
  padding-top: 10px;
}
.address.vertical .field{
  display: block;
}
.address.vertical .field .collapsed{
  display: block;
  padding: 10px 0;
}
</style> 

