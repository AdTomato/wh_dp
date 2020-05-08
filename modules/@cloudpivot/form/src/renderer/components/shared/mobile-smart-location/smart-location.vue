<template>
  <div class="smart-location">
    <div class="smart-location--row clearfix" v-if="showLabel">
      <div class="row__file" @click="getFocus">
        <div class="field__label">
          <div class="required">
            <svg
              v-if="required"
              width="8"
              height="8"
              fill="red"
              name
              viewBox="0 0 200 200"
            >
              <path
                d="M141.362 86.037L104.838 100l36.512 13.963c9.3 3.587 14.675 6.45 16.113 8.6 1.425 2.15 2.15 4.3 2.15 6.45 0 5.737-1.088 8.962-3.263 9.662a20.358 20.358 0 0 1-6.5 1.075c-2.187 0-4.35-.538-6.512-1.613-2.175-1.075-4.7-2.687-7.588-4.837l-33.587-30.075 7.6 45.112c.712 2.15 1.075 4.125 1.075 5.913v3.762c0 4.3-1.075 7.35-3.25 9.125-2.175 1.8-4.7 2.688-7.588 2.688-2.212 0-4.6-.713-7.187-2.15-2.588-1.425-3.863-4.65-3.863-9.663 0-1.425.188-2.862.55-4.3.375-1.425.55-3.225.55-5.375l8.825-45.112L64.65 133.3a121.392 121.392 0 0 1-7.187 4.3c-2.588 1.437-4.963 2.15-7.163 2.15-2.212 0-4.412-.713-6.625-2.15-2.212-1.425-3.312-4.3-3.312-8.6 0-2.863 1.075-5.375 3.225-7.525s7.15-4.65 15.037-7.525L95.175 100 58.65 86.037c-5.012-2.15-9.312-4.112-12.887-5.912-3.588-1.788-5.375-4.838-5.375-9.125 0-3.575 1.075-6.263 3.237-8.063 2.175-1.775 4.325-2.687 6.513-2.687 2.162 0 4.512.537 7.05 1.612 2.512 1.075 4.862 2.688 7.05 4.838l33.6 30.075-7.588-45.113c0-2.15-.187-3.925-.55-5.375a16.822 16.822 0 0 1-.537-4.3c0-2.862 1.075-5.537 3.25-8.062 2.175-2.488 4.712-3.75 7.587-3.75 4.425 0 7.338 1.437 8.838 4.3 1.462 2.862 2.212 5.375 2.212 7.525v4.837c0 1.8-.375 3.4-1.112 4.838l-8.825 45.1L135.325 66.7c2.938-2.863 5.5-4.65 7.725-5.375 2.213-.713 4.413-1.075 6.625-1.075 2.938 0 5.325 1.075 7.163 3.225s2.787 4.662 2.787 7.525c0 2.862-.725 5.2-2.15 6.987-1.45 1.788-6.812 4.475-16.112 8.05z"
              />
            </svg>
          </div>
          <span :style="labelStyle">{{ title }}</span>
        </div>
        <div class="field__content">
          <template v-if="!readonly &&!address">{{ $t('cloudpivot.form.renderer.addition') }}</template>
          <template v-else>
            <span>{{ address }}</span>
          </template>
          <template v-if="!readonly">
            <span v-if="!address" class="icon aufontAll">&#xe968;</span>
            <span
              v-else
              class="icon aufontAll"
              @click.stop="clear"
            >&#xe994;</span>
          </template>
        </div>
      </div>
    </div>

    <div>
      <h3-modal
        v-control-back
        :popupDirection="'left'"
        :appendToBody="true"
        :show="isFocus"
        type="popup"
        :popupScale="100"
        class="location-modal"
      >
        <div class="map-panel">
          <div class="map-panel--input">
            <template v-if="!readonly">
              <h3-search-bar
                ref="searchInput"
                class="input"
                :onChange="search"
                :onClear="onClear"
              />
            </template>

            <template v-else>
              <div class="map-panel--input__detail" v-if="address">
                <span>{{ address }}</span>
              </div>
            </template>
          </div>
          <div
            class="map-panel--map"
            :class="{'readonly': readonly,'no-data':!address}"
            v-show="!showSearchPanel"
          >
            <el-amap
              :vid="vidMap"
              :zoom="12"
              :center="mapCenter"
              class="amap"
              :events="events"
              :plugin="[{
                showCircle: true,
                enableHighAccuracy: true,
              }]"
              @click="onClickMap"
            >
              <el-amap-marker :position="mapCenter"></el-amap-marker>
            </el-amap>
            <div
              class="map-panel--map__location"
              @click="initLocation"
              v-if="!readonly"
            >
              <img src="./location.png" />
            </div>
          </div>

          <div
            class="map-panel--search"
            ref="searchResult"
            v-if="!readonly"
          >
            <template v-if="showSearchPanel">
              <p>搜索结果：共{{ areaList.length }} 条</p>
              <ul class="search-list" v-if="areaList.length > 0">
                <li
                  v-for="(area,index) in areaList"
                  :key="area.id || index"
                  @click="searchListClick(area)"
                >
                  <span
                    class="res-name"
                    v-hight-light="{'keyWords': keyWords, 'value': area.name }"
                  ></span>
                  <span class="res-district">{{ area.district || area.address }}</span>
                </li>
              </ul>
              <div v-else class="map-panel--search__nodata">
                <img src="./no-data.png" />
                <p>暂无搜索结果</p>
              </div>
            </template>
            <template v-else>
              <ul class="near-list">
                <li
                  v-for="(area,index) in nearList"
                  :key="area.id"
                  @click="nearListPanelClick(area)"
                >
                  <span class="res-name">
                    {{ area.name }}
                    <span v-if="index===0" class="current">[当前位置]</span>
                  </span>
                  <span class="res-district">{{ area.address }}</span>
                </li>
              </ul>
            </template>
          </div>
        </div>
      </h3-modal>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Emit,
  Model,
  Watch
} from "vue-property-decorator";
import { H3Modal, H3Signature, H3SearchBar } from "h3-mobile-vue";
import ControlBack from "../../../directives/control-back";

declare var AMap: any;

declare var AMapUI: any;

@Component({
  name: "smart-location",
  components: {
    H3Modal,
    H3Signature,
    H3SearchBar
  },
  directives: {
    ControlBack
  }
})
export default class SmartLocation extends Vue {
  @Model("change") value!: {
    address: "";
    lng: 0;
    lat: 0;
  };
  @Prop({
    default: false
  })
  readonly!: boolean;

  @Prop({
    default: false
  })
  required!: boolean;

  @Prop({
    default: "地图"
  })
  title!: string;

  @Prop({
    default: () => ({})
  })
  labelStyle!: any;

  @Prop({
    default: undefined
  })
  visibel!: undefined | boolean;

  // @Prop({ default: 10 }) zoom!: number;

  // @Prop({ default: () => [121.59996, 31.197646] }) center!: Array<number>;

  @Prop({
    type: String
  })
  vid!: string;

  @Prop({
    default: 500
  })
  range!: number;

  /**
   * 是否精确定位，
   * true：根据单点节点 根据range 范围搜索
   * false： 全国搜索
   */
  @Prop({
    default: false
  })
  isAccurate!: boolean;

  @Prop({
    default: true
  })
  showLabel!: boolean;

  isFocus: boolean = false;

  aMap: any = {};

  geolocation: any;

  keyWords: string = "";

  events: any = null;

  showSearchPanel: boolean = false;

  mounted() {
    this.events = {
      click: this.onClickMap
    };
  }

  onClickMap(e: any) {
    if (this.readonly) {
      return;
    }
    // debugger
    // console.log(e);
    const { lng, lat } = e.lnglat;
    this.lng = lng;
    this.lat = lat;
    this.mapCenter = [this.lng, this.lat];
    this.transformLoaction(lng, lat);
  }
  /**
   * 搜索列表点击
   */
  searchListClick(val: any) {
    if (val.location) {
      val.location;
      const { lng, lat } = val.location;
      this.lng = lng;
      this.lat = lat;
      this.mapCenter = [this.lng, this.lat];
      this.adcode = val.adcode;
      this.address = `${val.district || val.address}${val.name}`;
      const currentAdress = {
        name: this.address,
        location: {
          lng,
          lat
        },
        selected: true
      };

      this.nearList = [];

      this.nearList.push(currentAdress);

      this.getNear(this.mapCenter);

      this.listPanelSet();
    } else {
      this.getLocationByAdcode(val.district);
    }
  }

  nearListPanelClick(val: any) {
    // debugger
    const vm: any = this;

    const { lng, lat } = val.location;

    vm.address = `${val.address ? val.address : ""}${val.name}`;

    const ad = `${val.address ? val.address : ""}${val.name}`;

    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress([lng, lat], (status: any, result: any) => {
      if (status === "complete" && result.info === "OK") {
        if (result && result.regeocode) {
          // debugger
          vm.adcode = result.regeocode.addressComponent.adcode;

          const addressComponent = result.regeocode.addressComponent;

          const {
            province,
            city,
            district,
            township,
            street
          } = addressComponent;

          const backData = {
            lng: vm.lng,
            lat: vm.lat,
            provinceName: province,
            cityName: city,
            districtName: district,
            adcode: vm.adcode,
            address: ad
          };
          debugger;

          vm.address = `${province}${city}${district}${ad}`;

          vm.$emit("change", backData);
          vm.close();
          vm.keyWords = "";
        }
      }
    });
  }

  onClear() {
    this.listPanelSet();
  }

  /**
   * 返回监听
   */
  show() {
    this.isFocus = true;
  }
  /**
   * 返回监听
   */
  close() {
    // debugger
    this.isFocus = false;
    this.$emit("cancel");
  }

  /**
   * 获得焦点
   */
  getFocus() {
    if (this.address && !this.readonly) {
      return;
    }
    this.show();
    if (!this.readonly) {
      this.initLocation();
    }
  }

  listPanelSet() {
    // debugger
    this.showSearchPanel = false;
  }

  clear() {
    this.address = "";
    this.adcode = "";
    this.lng = 0;
    this.lat = 0;
    this.$emit("change", {});
  }

  /**
   * 初始数据
   */
  // created() {

  // }

  get vidMap() {
    const timestamp = new Date().getTime();
    return `${this.vid}-${timestamp}`;
  }

  /**
   * 挂载地图面板
   */
  // initMap() {
  //   const vm = this;
  //   // eslint-disable-next-line global-require
  //   const VueAMap = require('vue-amap');

  //   VueAMap.lazyAMapApiLoaderInstance.load().then(() => {
  //     vm.aMap = new AMap.Map('map', {
  //       resizeEnable: true,
  //       center: vm.mapCenter,
  //       zoom: 10
  //     });
  //   });
  // }

  initLocation() {
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

    const vm: any = this;

    // this.geolocation.getCityInfo((status: any, result: any) => {

    //   if (status === "complete" && result.info === "SUCCESS") {

    //     console.log(result);
    //     vm.mapCenter = result.center;
    //     // vm.marker = self.mapCenter;
    //     vm.address = result.province + result.city;
    //     vm.lng = result.center[0];
    //     vm.lat = result.center[1];
    //     vm.adcode = result.adcode;
    //   }
    // });

    this.geolocation.getCurrentPosition((status: any, result: any) => {
      // debugger
      if (status === "complete" && result.info === "SUCCESS") {
        // console.log('当前位置00000',result)
        // vm.address = result.formattedAddress;
        vm.lng = result.position.lng;
        vm.lat = result.position.lat;
        vm.adcode = result.addressComponent.adcode;
        vm.mapCenter = [vm.lng, vm.lat];

        const adComponent: any = result.addressComponent;
        const add = `${adComponent.township}${adComponent.street}${adComponent.streetNumber}`;

        const currentAdress = {
          name: add,
          location: {
            lng: vm.lng,
            lat: vm.lat
          },
          selected: true
        };

        vm.nearList = [];

        vm.nearList.push(currentAdress);

        vm.getNear(vm.mapCenter);
      }
    });
  }

  address: any = "";
  adcode: any = "";
  provinceName = "";
  cityName = "";
  districtName = "";
  lng: number = 0;
  lat: number = 0;
  mapCenter = [116.397428, 39.90923];

  // initPoiPicker() {
  //   const self = this;

  //   AMapUI.loadUI(["misc/PoiPicker"], function(PoiPicker: any) {
  //     const searchResultEl = self.$refs.searchResult;
  //     const searchInputEl = (self.$refs.searchInput as Vue).$el.children[0].children[1];
  //     //
  //     // .$el.firstChild;

  //     const poiPicker = new PoiPicker({
  //       input: searchInputEl, //输入框id
  //       autocompleteOptions: {
  //         pageSize: 8
  //       }, //地点搜索配置
  //       suggestContainer: searchResultEl //输入提示显示DOM
  //       // searchResultsContainer:searchResultEl//搜索结果显示DOM
  //     });

  //     poiPicker.on("poiPicked", function(poiResult: any) {
  //       // self.showSearchResult = false;

  //       // let source = poiResult.source;
  //       // let poi = poiResult.item;

  //       // self.mapCenter = [poi.location.lng, poi.location.lat];
  //       // // self.marker = self.mapCenter;
  //       // self.address = poi.district + poi.address + poi.name;
  //       // self.lng = poi.location.lng;
  //       // self.lat = poi.location.lat;
  //       // }
  //     });
  //   });
  // }

  areaList = [];

  search(val: string) {
    // debugger
    if (this.isAccurate) {
      this.accurateSearch(val);
    } else {
      this.allSearch(val);
    }
  }

  allSearch(val: string) {
    this.keyWords = val;
    if (!val) return;
    this.showSearchPanel = true;
    const vm: any = this;
    AMap.plugin("AMap.PlaceSearch", function() {
      var autoOptions = {
        city: "全国",
        pageSize: 10
      };
      var placeSearch = new AMap.Autocomplete(autoOptions);
      placeSearch.search(val, function(status: any, result: any) {
        // debugger
        vm.areaList = result.tips;
      });
    });
  }

  accurateSearch(val: string) {
    this.keyWords = val;
    if (!val) return;
    this.showSearchPanel = true;
    const vm: any = this;
    // AMap.service(["AMap.PlaceSearch"], function() {
    //   const placeSearch = new AMap.placeSearch({
    //     pageSize: 10
    //   })

    //   placeSearch.searchNearBy(val,vm.mapCenter,vm.range,function(status:any, result:any) {
    //     debugger
    //   });
    // });
    AMap.service(["AMap.PlaceSearch"], function() {
      var placeSearch = new AMap.PlaceSearch({
        pageSize: 10, // 每页10条
        pageIndex: 1 // 获取第一页
      });
      placeSearch.searchNearBy(val, vm.mapCenter, vm.range, function(
        status: any,
        result: any
      ) {
        // debugger
        if (result.info === "OK") {
          // result.poiList.pois.forEach((res:any) => {
          //   res.selected = false;
          // });
          vm.areaList = result.poiList.pois; // 周边地标建筑列表
          console.log("周边2333333", vm.nearList);
        } else {
          console.log("获取位置信息失败!");
        }
      });
    });
  }
  nearList: any[] = [];
  getNear(centerPoint: any) {
    const vm: any = this;
    AMap.service(["AMap.PlaceSearch"], function() {
      var placeSearch = new AMap.PlaceSearch({
        pageSize: 10, // 每页10条
        pageIndex: 1 // 获取第一页
        // city: city       // 指定城市名(如果你获取不到城市名称，这个参数也可以不传，注释掉)
      });
      placeSearch.searchNearBy("", centerPoint, 500, function(
        status: any,
        result: any
      ) {
        if (result.info === "OK") {
          result.poiList.pois.forEach((res: any) => {
            res.selected = false;
          });
          vm.nearList = vm.nearList.concat(result.poiList.pois); // 周边地标建筑列表
          console.log("周边2333333", vm.nearList);
        } else {
          console.log("获取位置信息失败!");
        }
      });
    });
  }
  /**
   * 经纬度转换成详细地址
   */
  transformLoaction(lng: number, lat: number) {
    const vm: any = this;
    // 这里通过高德 SDK 完成。
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });
    geocoder.getAddress([lng, lat], (status: any, result: any) => {
      if (status === "complete" && result.info === "OK") {
        if (result && result.regeocode) {
          // debugger
          // const add = result.regeocode.formattedAddress;
          // vm.address = add;
          vm.adcode = result.regeocode.addressComponent.adcode;

          const adComponent: any = result.regeocode.addressComponent;
          const add = `${adComponent.township}${adComponent.street}${adComponent.streetNumber}`;

          vm.address = add;

          const currentAdress = {
            name: add,
            location: {
              lng,
              lat
            },
            selected: true
          };

          vm.nearList = [];

          vm.nearList.push(currentAdress);

          vm.getNear(vm.mapCenter);
        }
      }
    });
  }

  /**
   * 获取详细地址通过 adcode
   */
  getLocationByAdcode(adress: string) {
    const vm: any = this;
    let geocoder = new AMap.Geocoder({
      radius: 1000,
      extensions: "all"
    });

    geocoder.getLocation(adress, (status: any, result: any) => {
      if (status === "complete" && result.info === "OK") {
        // if (result && result.regeocode) {
        // debugger
        const city: any = result.geocodes[0];

        const add = city.formattedAddress;
        vm.address = add;
        vm.adcode = city.adcode;

        const { lng, lat } = city.location;

        vm.mapCenter = [lng, lat];

        const currentAdress = {
          name: add,
          location: {
            lng,
            lat
          },
          selected: true
        };

        vm.nearList = [];

        vm.nearList.push(currentAdress);

        vm.getNear(vm.mapCenter);

        vm.listPanelSet();
        // }
      }
    });
  }

  @Watch("value", {
    immediate: true
  })
  onChange(val: any) {
    // debugger
    if (val && val.lat && val.lng) {
      this.mapCenter = [val.lng, val.lat];
      // debugger
      this.address = `${val.provinceName}${val.cityName}${val.districtName}${val.address}`;
      // this.marker = this.mapCenter;
    }
  }

  @Watch("visibel")
  onVisibelChange(val: any) {
    // debugger
    if (val === undefined) {
      return;
    }

    if (val) {
      this.show();
      this.initLocation();
    }
  }
}
</script>
<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.location-modal {
  /deep/.h3-modal-body {
    overflow: hidden;
  }
}
.smart-location {
  position: relative;
  .hairline("bottom", #eee);
  text-align: left;
  background: #fff;
  &--row {
    .row__file {
      font-size: 15px;
      padding: 10px 15px;
      display: flex;
      text-align: left;
      .field__label {
        width: 106px;
        flex: none;
        position: relative;
        .required {
          left: -8px;
          top: 0;
          position: absolute;
          //  color:red;
        }
      }
      .field__content {
        color: #999;
        flex: 1;
        .icon {
          font-size: 12px;
          float: right;
          line-height: 15px;
          color: #888;
          font-size: 15px;
        }
        & > span {
          color: rgba(51, 51, 51, 1);
        }
      }
    }
  }
}
.map-panel {
  &--map {
    &.readonly {
      height: calc(100vh - 0.8rem);
    }
    &.readonly.no-data {
      height: 100vh;
    }
    height: 6.4rem;
    position: relative;
    &__location {
      right: 0.4rem;
      bottom: 0.4rem;
      position: absolute;
      img {
        width: 1.2rem;
        height: 1.2rem;
      }
    }
  }
  &--input {
    &__detail {
      text-align: left;
      color: rgba(51, 51, 51, 1);
      padding: 0.26rem 0.4rem 0.15rem 0.4rem;
    }
    .input {
      /deep/.h3-search-input {
        background-color: #f2f4f8;
        border-radius: 0.37rem;
      }
    }
  }
  &--search {
    &__nodata {
      padding-top: 2.35rem;
      height: calc(100vh - 4.6rem);
      background: #f7f8fc;
      img {
        width: 4.27rem;
        height: 2.91rem;
      }
      text-align: center;
      p {
        font-size: @font-size-14;
        color: @light-color-3;
      }
    }
    ul {
      overflow-y: scroll;
    }
    .near-list {
      height: calc(100vh - 7.6rem);
    }
    .search-list {
      height: calc(100vh - 2.4rem);
    }
    text-align: left;
    & > p {
      background: rgba(247, 248, 252, 1);
      line-height: 1.07rem;
      padding: 0 0.4rem;
    }
    ul {
      li {
        position: relative;
        padding: 0.26rem 0.4rem 0.15rem 0.4rem;
        & > span {
          display: block;
          font-size: 0.4rem;
          line-break: 0.61rem;
          &.res-name {
            color: rgba(51, 51, 51, 1);
            /deep/.highlight {
              color: @primary-color;
            }
            .current {
              color: rgba(153, 153, 153, 1);
            }
          }
          &.res-district {
            color: rgba(153, 153, 153, 1);
          }
        }
        .hairline("bottom", #eee);
      }
    }
  }
}
</style>

