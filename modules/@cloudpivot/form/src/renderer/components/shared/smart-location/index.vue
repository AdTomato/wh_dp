<template>
  <div
    class="h3-location"
    :class="prefixCls"
    :style="prefixStyle"
    ref="location"
  >
    <a-input
      ref="input"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="address"
      @click="focus"
      @mouseenter="onMouseenter"
      @mouseleave="onMouseleave"
      v-if="IsSelect"
    >
      <a-icon
        v-if="hover"
        slot="suffix"
        type="close-circle"
        @click="clear"
        @mouseenter="onMouseenter"
      />

      <span
        v-else
        class="aufontAll h-icon-all-get-address-o"
        slot="suffix"
        @click="focus"
      ></span>
    </a-input>
    
    <template v-else>
      <span @click="focus"><slot name="defineEl"/></span>
      
    </template>

    <map-modal
      v-if="showMap"
      :value="value"
      :vid="vid"
      :visible="showMap"
      :locale="locale"
      :showTip="showTip"
      @ok="onOk"
      @cancel="onCancel"
    ></map-modal>
    

    <!-- <a-modal
      class="h3-location-map"
      :visible="showMap"
      :bodyStyle="{padding: 0}"
      :closable="false"
      :footer="null"
      :width="590"
      :maskClosable="false"
      :keyboard="false"
    >
      <div class="h3-location-map-content" v-if="showMap">

        <div class="search-box">
          <a-input ref="searchInput" 
            v-model="searchKey"
            @focus="onSearchInputFocus" 
            @change="onSearchInputChange"
          >
            <a-icon
              v-show="searchKey.length > 0"
              slot="suffix"
              type="close-circle"
              @click="clearSearchInput"
            />

            <a-icon slot="suffix" type="search"/>

          </a-input>
          <div class="search-result-box" v-show="showSearchResult">

            <div class="search-result" ref="searchResult"></div>
            
            <div class="search-result__nodata">未找到相关地址</div>

          </div>
        </div>

        <el-amap
          :vid="vidMap"
          :center="mapCenter"
          :zoom="12"
          class="amap-demo"
          :events="events"
          @click="onClickMap"
        >
          <el-amap-marker :position="marker"></el-amap-marker>
        </el-amap>
        <div class="h3-location-map-content-tip" v-if="showTip && openTip">
          {{ $t('cloudpivot.form.renderer.tip.position') }}
          <i class="aufontAll h-icon-all-close" @click="onCloseTip"></i>
        </div>
      </div>
      <div class="h3-location-map-footer">
        <div>
          <a-button type="default" @click="onClickCancle" class="cancle">{{ $t('cloudpivot.form.renderer.cancel') }}</a-button>
          <a-button type="primary" @click="ok">{{ $t('cloudpivot.form.renderer.ok') }}</a-button>
        </div>
        <div v-show="address !== ''">
          <span class="aufontAll h-icon-all-get-address-o"></span>
          {{ address }}
        </div>
      </div>
    </a-modal> -->

  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Watch,
  Model
} from "vue-property-decorator";
import languages from "./locale/index";

import { Input, Modal, Button, Icon } from "h3-antd-vue";

// import { MapModal } from './map-modal.vue';

@Component({
  name: "SmartLocation",
  components: {
    AModal: Modal,
    AInput: Input,
    AButton: Button,
    AIcon: Icon,
    MapModal :  () => import('./map-modal.vue')
  }
})
export default class SmartLocation extends Vue {
  @Model("input") value!: {
    address: "";
    lng: 0;
    lat: 0;
  };

  @Prop() prefixCls!: string;
  @Prop() prefixStyle!: string;
  @Prop() selectStyle!: any;
  @Prop({
    type: String,
    default: 'select'
  }) type!: any;
  @Prop({
    type: String
  })
  vid!: string;
  @Prop({
    type: String,
    default: ''
  })
  placeholder!: string;

  @Prop({
    type: Boolean,
    default: false
  })
  disabled!: boolean;

  @Prop({
    type: String,
    default: "zh"
  })
  locale!: string;
  @Prop({
    type: Boolean,
    default: false
  })
  showTip!: boolean;

  @Prop()
  initMap !: () => void
  // @Prop({
  //   type: Boolean,
  //   default: false
  // })
  // visible!: boolean;

  // mounted() {
  //   this.events = {
  //     click: this.onClickMap
  //   };
  // }

  // events: any = null;
  // address: string = "";
  // lng: number = 0;
  // lat: number = 0;
  // adcode: String = "";
  showMap: boolean = false;
  // openTip: boolean = true;


  // searchKey: string = '';

  // searchOption: any = {
  //   city: "",
  //   citylimit: false
  // };

  // isInit: boolean = true;

  // loaded = false;

  // timestamp: number = 0;

  // mapCenter: Array<number> = [121.59996, 31.197646];

  // marker: number[] = this.mapCenter;

  hover = false;

  // geolocation: any;

  // showSearchResult = false;

  // get vidMap() {
  //   return `${this.vid}-${this.timestamp}`;
  // }

  focus(e: any) {
    // debugger
    if(this.disabled){
      return false;
    }

    if(this.initMap){
      this.initMap();
    }

    // this.showMap = true;

    // if (this.isInit) {
    //   this.isInit = false;
    //   this.gettimestamp();
    // }
    
    const vmap = require('vue-amap');

    vmap.lazyAMapApiLoaderInstance.load().then(()=>{
      this.showMap = true;
    });
  }

  onMouseenter() {
    this.hover = true;
  }

  onMouseleave() {
    this.hover = false;
  }

  clear() {
    const val = {};
    this.onOk(val);
  }

  address = '';

  // calculateDir() {
  //   const bodyHeight = document.body.clientHeight;
  //   const localeHeight = this.$refs.location.clientHeight + this.$refs.location.scrollHeight;
  //   const dir = bodyHeight - localeHeight;
  //   const str = dir > 340 ? '下' : '上'
  //   console.log(str)
  // }
  // gettimestamp() {
  //   this.timestamp = new Date().getTime();
  // }

  get IsSelect() {
    return this.type === 'select'
  }

  onOk(val : any){
    this.showMap = false;
    this.$emit("input", val);
    this.$emit("ok", val);
    
    this.onCancel();
  }

  onCancel(){
    this.showMap = false;
    if (this.$refs.input) {
      (this.$refs.input as any).blur();
    }
  }

  @Watch("value", {
    immediate: true
  })
  onChange(val: any) {
    // debugger
    if (val && val.lat && val.lng) {
      
      this.address = `${val.provinceName}${val.cityName}${val.districtName}${val.address}`;
    }else{
      this.address = '';
    }
  }
  
}
</script>

<style lang="less">
@import "./style/index.less";
</style>
