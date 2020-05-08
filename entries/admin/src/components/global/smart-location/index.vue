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
      :value="value.address"
      @click="focus"
    >
      <span class="aufontAll h-icon-all-get-address-o" slot="suffix"></span>
    </a-input>

    <a-modal
      :visible="showMap"
      class="h3-location-map"
      :bodyStyle="{padding: 0}"
      :closable="false"
      :footer="null"
      :width="590"
      :maskClosable="false"
      :keyboard="false"
    >
      <div class="h3-location-map-content">
        <el-amap-search-box
          :onSearchResult="onSearchResult"
          :searchOption="searchOption"
          ref="search"
          class="search-box"
        ></el-amap-search-box>
        <el-amap
          :vid="vidMap"
          :center="mapCenter"
          :zoom="12"
          class="amap-demo"
          :events="events"
          @click="onClickMap"
        >
          <el-amap-marker
            v-for="(marker,index) in markers"
            :key="index"
            :position="marker"
          ></el-amap-marker>
        </el-amap>
      </div>
      <div class="h3-location-map-footer">
        <div>
          <a-button
            type="default"
            @click="onClickCancle"
            class="cancle"
          >取消</a-button>
          <a-button type="primary" @click="ok">确定</a-button>
        </div>
        <div v-show="address !== ''">
          <span class="aufontAll h-icon-all-get-address-o"></span>
          {{ address }}
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch, Model } from 'vue-property-decorator';
import languages from './locale/index';

@Component({
  name: 'SmartLocation',
  components: {
  }
  })
export default class SmartLocation extends Vue {
  @Model('input') value!: {
    address: '',
    lng: 0,
    lat: 0,
  };

  @Prop() prefixCls!: string;
  @Prop() prefixStyle!: string;
  @Prop() selectStyle!: any;

  @Prop({
    type: String,
  }) vid!: string;
  @Prop({
    type: String,
    default: '点击选择位置',
  }) placeholder!: string;
  @Prop({
    type: String,
    default: 'zh',
  }) locale!: string;

  mounted() {
    this.events = {
      click: this.onClickMap
    };
  }

  events: any = null;
  address: string = '';
  lng: number = 0;
  lat: number = 0;
  showMap: boolean = false;

  // searchKey: string = '';
  markers: Array<any> = [];
  searchOption: any = {
    city: '深圳',
    citylimit: false
  };
  isInit: boolean = true;
  timestamp: number = 0;
  mapCenter: Array<number> = [121.59996, 31.197646];

  get vidMap() {
    return `${this.vid}-${this.timestamp}`
  }
  focus(e:any) {
    if (this.isInit) {
      this.isInit = false;
      this.gettimestamp();
    }
    this.initGeolocation();
    this.showMap = true;
  }
  // calculateDir() {
  //   const bodyHeight = document.body.clientHeight;
  //   const localeHeight = this.$refs.location.clientHeight + this.$refs.location.scrollHeight;
  //   const dir = bodyHeight - localeHeight;
  //   const str = dir > 340 ? '下' : '上'
  //   console.log(str)
  // }
  gettimestamp() {
    this.timestamp = new  Date().getTime();
  }
  onClickMap(e:any) {
    console.log(e);
    const { lng, lat } = e.lnglat;
    this.lng = lng;
    this.lat = lat;
    this.transformLoaction(lng, lat);
  }
  transformLoaction(lng: number, lat: number) {
    const self = this;
    // 这里通过高德 SDK 完成。
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: 'all',
    });
    geocoder.getAddress([lng, lat], (status:any, result:any) => {
      if (status === 'complete' && result.info === 'OK') {
        if (result && result.regeocode) {
          const add = result.regeocode.formattedAddress;
          self.address = add;
        }
      }
    })
  }

  initGeolocation() {
    const self = this;
    let geolocation = new AMap.Geolocation({
      // 是否使用高精度定位，默认：true
      enableHighAccuracy: true,
      // 设置定位超时时间，默认：无穷大
      timeout: 10000,
      // 定位按钮的停靠位置的偏移量，默认：Pixel(10, 20)
      buttonOffset: new AMap.Pixel(10, 20),
      //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
      zoomToAccuracy: true,
      //  定位按钮的排放位置,  RB表示右下
      buttonPosition: 'RB'
    });
    geolocation.getCurrentPosition((status:any,result:any) => {
      if (status === 'complete' && result.info === 'SUCCESS') {
        // 如果没有传入的值那么将定位传入address/lan
        if (!self.value.address) {
          self.address = result.formattedAddress;
          self.lng = result.position.lng;
          self.lat = result.position.lat;
          self.markers.push([result.position.lng, result.position.lat]);
          self.mapCenter = [result.position.lng, result.position.lat];
        }
      }
    });
  }

  onSearchResult(pois:Array<any>) {
    let latSum = 0;
    let lngSum = 0;
    if (pois.length > 0) {
      pois.forEach((poi:any) => {
        let { lng, lat } = poi;
        lngSum += lng;
        latSum += lat;
        this.markers.push([poi.lng, poi.lat]);
      });
      let center = {
        lng: lngSum / pois.length,
        lat: latSum / pois.length
      };
      this.mapCenter = [center.lng, center.lat];
    }
  }

  onClickCancle() {
    this.showMap = false;
    (this.$refs.input as any).blur();
    this.$emit('cancel');
  }
  ok() {
    const val = {
      address: this.address,
      lng: this.lng,
      lat: this.lat,
    };
    this.showMap = false;
    (this.$refs.input as any).blur();
    // this.$refs.search.clear();
    this.$emit('input', val);
    this.$emit('ok', val);
  }

  @Watch('value', {
    immediate: true
  })
  onChange(val: any) {
    // this.$emit('input', val);
    if(val && val.lat && val.lng){
      this.mapCenter = [val.lng, val.lat];
      this.markers = [this.mapCenter];
    }
  }
}
</script>

<style lang="less">
@import './style/index.less';
</style>
