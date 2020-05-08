<template>
  <a-modal
    class="h3-location-map"
    :visible="visible"
    :bodyStyle="{padding: 0}"
    :closable="false"
    :footer="null"
    :width="590"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="h3-location-map-content">
      <!-- <el-amap-search-box
        ref="search"
        class="search-box"
        :search-option="searchOption"
        :on-search-result="onSearchResult"
      ></el-amap-search-box>-->

      <div class="search-box">
        <a-input
          ref="searchInput" 
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
        <a-button
          type="default"
          @click="onClickCancle"
          class="cancle"
        >{{ $t('cloudpivot.form.renderer.cancel') }}</a-button>
        <a-button type="primary" @click="ok">{{ $t('cloudpivot.form.renderer.ok') }}</a-button>
      </div>
      <div v-show="address !== ''">
        <span class="aufontAll h-icon-all-get-address-o"></span>
        {{ address }}
      </div>
    </div>
  </a-modal>
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

// import { lazyAMapApiLoaderInstance } from 'vue-amap';

declare var AMap: any;

declare var AMapUI: any;

@Component({
  name: "SmartLocation",
  components: {
    AModal: Modal,
    AInput: Input,
    AButton: Button,
    AIcon: Icon 
  }
})
export default class SmartLocation extends Vue {
  @Model("input") 
  value!: {
    address: "";
    lng: 0;
    lat: 0;
  };

  @Prop({
      default : false
  })
  visible !: boolean
    // visible = true

  @Prop({
    type: String,
    default: 'select'
  }) 
  type!: any;

  @Prop({
    type: String
  })
  vid!: string;

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

  // @Prop({
  //   type: Boolean,
  //   default: false
  // })
  // visible!: boolean;

  mounted() {
    this.events = {
      click: this.onClickMap
    };
    
    // this.focus();
  }

  events: any = null;
  address: string = "";
  lng: number = 0;
  lat: number = 0;
  adcode: String = "";
  province = '';
  city = '';
  district = '';
  adDetail = '';
  showMap: boolean = false;
  openTip: boolean = true;


  searchKey: string = '';

  searchOption: any = {
    city: "",
    citylimit: false
  };

  isInit: boolean = true;

  loaded = false;

  timestamp: number = 0;

  mapCenter: Array<number> = [121.59996, 31.197646];

  marker: number[] = this.mapCenter;

  hover = false;

  geolocation: any;

  showSearchResult = false;

  get vidMap() {
    return `${this.vid}-${this.timestamp}`;
  }
  
  gettimestamp() {
    this.timestamp = new Date().getTime();
  }


  @Watch("visible", {
    immediate: true
  })
  focus() {

    if(this.visible){
        if (this.isInit) {
        this.isInit = false;
        this.gettimestamp();
        }
        this.initGeolocation();
        // if(!this.value.lat && !this.value.lng){
        //     this.initGeolocation();
        // }

        this.initPoiPicker();
    }
    
  }

  onClickMap(e: any) {
    // console.log(e);
    const { lng, lat } = e.lnglat;
    this.lng = lng;
    this.lat = lat;
    this.transformLoaction(lng, lat);
    this.marker = [lng, lat];
  }

  onCloseTip() {
    this.openTip = false;
  }

  transformLoaction(lng: number, lat: number,ad?:string) {
    const self = this;
    // 这里通过高德 SDK 完成。
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress([lng, lat], (status: any, result: any) => {
      if (status === "complete" && result.info === "OK") {
        if (result && result.regeocode) {
           console.log(result,'点击位置')
          // const add = result.regeocode.formattedAddress;
          const adComponent:any = result.regeocode.addressComponent;
          const add = ad ? ad :  `${adComponent.township}${adComponent.street}${adComponent.streetNumber}`;
          self.province = adComponent.province;
          self.city = adComponent.city;
          self.district = adComponent.district;
          self.adDetail = add;
          self.adcode = result.regeocode.addressComponent.adcode;
          self.address =`${self.province}${self.city}${ self.district}${self.adDetail}`;
        }
      }
    });
  }

  initGeolocation() {
    
    if (!this.geolocation) {
      this.geolocation = new AMap.Geolocation({
        // 是否使用高精度定位，默认：true
        enableHighAccuracy: true,
        // 设置定位超时时间，默认：无穷大
        timeout: 10000,
        // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
        buttonOffset: new AMap.Pixel(10, 20),
        //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
        zoomToAccuracy: true,
        //  定位按钮的排放位置,  RB表示右下
        buttonPosition: "RB"
      });
    }

    const self = this;

    // 由于IP定位不稳定，经常出现失败，故先定位到城市
    this.geolocation.getCityInfo((status: any, result: any) => {
      
      if (status === "complete" && result.info === "SUCCESS") {
        
        console.log(result);
        self.mapCenter = result.center;
        self.marker = self.mapCenter;
        self.address = result.province + result.city;
        self.lng = result.center[0];
        self.lat = result.center[1];
        self.adcode = result.adcode;
      }
    });

    this.geolocation.getCurrentPosition((status: any, result: any) => {
      if (status === "complete" && result.info === "SUCCESS") {
         console.log(result,'当前位置')
        // 如果没有传入的值那么将定位传入address/lan
        // if (!self.value.address) {
          const adComponent:any = result.addressComponent;
          const add = `${adComponent.township}${adComponent.street}${adComponent.streetNumber}`;
          self.province = adComponent.province;
          self.city = adComponent.city;
          self.district = adComponent.district;
          self.adDetail = add;
          self.adcode = result.addressComponent.adcode;

          // self.address = result.formattedAddress;
          self.lng = result.position.lng;
          self.lat = result.position.lat;
          // self.adcode = result.addressComponent.adcode;
          
          self.mapCenter = [result.position.lng, result.position.lat];
          self.marker = self.mapCenter;
          self.address =`${self.province}${self.city}${ self.district}${self.adDetail}`;
        // }
      }
    });
  }

  initPoiPicker() {
    if (this.loaded) {
      return;
    }

    this.loaded = true;

    const self = this;

    AMapUI.loadUI(["misc/PoiPicker"], function(PoiPicker: any) {
      
      self.showMap = true;

      const searchResultEl = self.$refs.searchResult;
      const searchInputEl = (self.$refs.searchInput as Vue).$el.firstChild;

      const poiPicker = new PoiPicker({
        input: searchInputEl, //输入框id
        autocompleteOptions: {
          pageSize: 8
        }, //地点搜索配置
        suggestContainer: searchResultEl //输入提示显示DOM
        // searchResultsContainer:searchResultEl//搜索结果显示DOM
      });

      poiPicker.on("poiPicked", function(poiResult: any) {
        self.showSearchResult = false;

        let source = poiResult.source;
        let poi = poiResult.item;
        // if (source !== 'search') {
        //     poiPicker.searchByKeyword(poi.name);
        // } else {
        // poiPicker.clearSearchResults();
        // debugger
        self.mapCenter = [poi.location.lng, poi.location.lat];
        const ad = poi.address + poi.name;
        self.transformLoaction(poi.location.lng, poi.location.lat, ad);
        self.marker = self.mapCenter;
        self.lng = poi.location.lng;
        self.lat = poi.location.lat;
        // self.address = poi.district + poi.address + poi.name;
        // }
      });
    });
  }

  onSearchInputFocus() {
    if (this.searchKey) {
      this.showSearchResult = true;
    }
  }

  onSearchInputChange() {
    this.showSearchResult = true;
  }

  onClickCancle() {
    // this.visible = false;
    this.clearSearchInput();
    this.$emit("cancel");
  }

  clearSearchInput(){
    this.searchKey = '';
    this.showSearchResult = false;
  }

  ok() {
    this.clearSearchInput();
    // self.province = adComponent.province;
    //       self.city = adComponent.city;
    //       self.district = adComponent.district;
    //       self.adDetail = add;
    const val = {
      provinceName: this.province,
      cityName: this.city,
      districtName: this.district,
      address: this.adDetail,
      lng: this.lng,
      lat: this.lat,
      adcode: this.adcode
    };
    // this.visible = false;

    // (this.$refs.input as any).blur();
    // this.$refs.search.clear();
    this.$emit("input", val);
    this.$emit("ok", val);
  }

  get IsSelect() {
    return this.type === 'select'
  }

  @Watch("value", {
    immediate: true
  })
  onChange(val: any) {
    if (val) {
      this.address = val.address || '';
    }
  }

}
</script>

<style lang="less">
@import "./style/index.less";
</style>
