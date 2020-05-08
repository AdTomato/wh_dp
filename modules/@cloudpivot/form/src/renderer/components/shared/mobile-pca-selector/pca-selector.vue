<template>
  <div class="pca-selector">
    <div class="pca-selector--row" @click="getFocus">
      <div>
        <div class="field__label" :style="labelStyle">
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
          <!-- <label class="required" v-if="required">*</label> -->
          {{ title }}
        </div>
        <div class="field__content">
          {{ valString }}
          <label
            class="placeholder"
            v-if="pcaDate.length === 0 && !readonly"
          >{{ $t('cloudpivot.form.renderer.peleseSelect') }}</label>
          <span v-if="!readonly" class="icon aufontAll">&#xe89b;</span>
        </div>
      </div>
    </div>

    <h3-modal
      :show="isFocus"
      type="popup"
      :appendToBody="true"
    >
      <div class="pca-selector--options">
        <div class="options-header">
          <span
            v-for="(p,index) in tabT"
            :key="index"
            class="options-header__tab"
            v-show="!!p.title"
            :class="{'active': p.active}"
            @click="tabClick(index)"
          >{{ p.title }}</span>

          <i @click="clear" class="clear icon aufontAll">&#xe994;</i>
        </div>
        <div class="options-content">
          <h3-swiper :showDots="false" v-model="activeTab">
            <h3-swiper-item v-if="showTab[0]">
              <ul>
                <li
                  v-if="showEmpty"
                  @click="emptyClick('p')"
                >{{ $t('cloudpivot.form.renderer.peleseSelect') }}</li>
                <li
                  v-for="(p,index) in pca"
                  :key="p.adcode"
                  @click="provincesClick(index,p.adcode)"
                  :class="{'selected': p.selected}"
                >
                  {{ p.name }}
                  <span
                    v-show="p.selected && !animating"
                    class="icon aufontAll"
                  >&#xe98f;</span>
                </li>
              </ul>
            </h3-swiper-item>

            <h3-swiper-item v-if="showTab[1]">
              <ul>
                <li
                  v-if="showEmpty"
                  @click="emptyClick('c')"
                >{{ $t('cloudpivot.form.renderer.peleseSelect') }}</li>
                <li
                  v-for="(p,index) in city"
                  :key="p.adcode"
                  :class="{'selected': p.selected}"
                  @click="cityClick(index)"
                >
                  {{ p.name }}
                  <span
                    v-show="p.selected && !animating"
                    class="icon aufontAll"
                  >&#xe98f;</span>
                </li>
              </ul>
            </h3-swiper-item>
            <h3-swiper-item v-if="showTab[2]">
              <ul>
                <li
                  v-if="showEmpty"
                  @click="emptyClick('a')"
                >{{ $t('cloudpivot.form.renderer.peleseSelect') }}</li>
                <li
                  v-for="(p,index) in area"
                  :key="p.adcode"
                  :class="{'selected': p.selected}"
                  @click="areaClick(index)"
                >
                  {{ p.name }}
                  <span
                    v-show="p.selected && !animating"
                    class="icon aufontAll"
                  >&#xe98f;</span>
                </li>
              </ul>
            </h3-swiper-item>
          </h3-swiper>
        </div>
      </div>
    </h3-modal>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";
import { H3Swiper, H3SwiperItem, H3Modal } from "h3-mobile-vue";
import { forkJoin } from "rxjs";
// import pca from './typings/pca';
@Component({
  name: "pca-selector",
  components: {
    H3Swiper,
    H3SwiperItem,
    H3Modal
  }
})
export default class PcaSelector extends Vue {
  @Model("change")
  defaultVal!: any[];

  @Prop({
    default: "pp-cc-aa"
  })
  format!: string;

  @Prop({
    default: false
  })
  showEmpty!: boolean;
  @Prop({
    default: false
  })
  readonly!: boolean;
  @Prop({
    default: ""
  })
  title!: string;

  @Prop({
    default: true
  })
  required!: boolean;

  @Prop({
    default: ""
  })
  labelStyle!: string;

  isFocus: boolean = false;

  activeTab: number = 0;

  pca: any[] = [];

  city: Array<any> = [];

  area: Array<any> = [];

  valString: string = "";

  isSelected: boolean = true;

  value: any = {};

  pcaDate: Array<any> = [];

  animating = false;

  hasArea = true;

  hasCity = true;

  // tabLength: number = 3;

  tabT: Array<any> = [
    {
      title: "请选择",
      active: false,
      code: "other"
    }
  ];

  tabTitle: Array<any> = [
    {
      title: "",
      show: true,
      active: false,
      code: "province"
    },
    {
      title: "",
      show: false,
      active: false,
      code: "city"
    },
    {
      title: "",
      show: false,
      active: false,
      code: "area"
    }
  ];

  showTab = [false, false, false];

  created() {
    // debugger
    // this.pca = pca;
    // this.initData();
  }

  get tabLength() {
    return this.format.split("-").length;
  }

  clear() {
    this.value = {};
    this.pcaDate = [];
    this.setShowValue();

    this.tabTitle.forEach((res: any, index: number) => {
      res.title = "";
      if (index > 0) {
        res.show = false;
      }
    });

    this.value = {};
    this.pcaDate = [];
    this.$emit("change", this.value);

    this.isFocus = false;
    this.pca.forEach((p: any) => {
      p.selected = false;
    });
    this.city = [];
    this.area = [];
    // this.activeTab = 0;
  }
  getFocus() {
    if (this.readonly) return;
    this.initData();
    this.isFocus = !this.isFocus;
  }

  /**
   * 初始数据
   */

  getPcaBaseData() {
    // debugger
    if (!this.pca || this.pca.length === 0) {
      const pca: any = require("./typings/pca");
      this.pca = pca.default;
    }
  }

  /**
   * 初始化数据
   */
  initData() {
    this.getPcaBaseData();
    // debugger;
    // 初始省市区
    let p = "";
    let c = "";
    let a = "";
    if (this.pcaDate.length > 0) {
      this.onPcaDatachange(this.pcaDate);
      this.pcaDate.forEach((res: any) => {
        switch (res.level) {
          case "province":
            p = res.adcode;
            break;
          case "city":
            c = res.adcode;
            break;
          case "district":
            a = res.adcode;
            break;
          default:
            break;
        }
      });
    }

    let city: any[] = [];
    let area: any[] = [];
    this.area = [];
    this.city = [];
    this.pca.forEach((res: any) => {
      res.selected = false;
      if (p === res.adcode) {
        res.selected = true;

        if ((c || a) && this.tabLength > 1) {
          city = res.districts;

          if (res.districts[0].level === "city") {
            this.city = res.districts;

            this.city.forEach((_c: any) => {
              _c.selected = false;
              if (c === _c.adcode) {
                _c.selected = true;
                area = _c.districts;
                this.area = _c.districts;
              }
            });
          } else {
            this.area = res.districts;
          }
        }
      }
      if (a) {
        area.forEach((_a: any) => {
          _a.selected = false;
          if (a === _a.adcode) {
            _a.selected = true;
          }
        });
      }
    });
    debugger;
    if (this.area.length === 0) {
      this.hasArea = false;
    }

    if (this.city.length === 0) {
      this.hasCity = false;
    }

    this.onPcaDatachange(this.pcaDate);
  }

  optionsClick(option: any) {
    this.pca.forEach((p: any) => {
      p.selected = false;
    });
    option.selected = true;
    this.pca = [...this.pca];
  }

  /**
   * tab 页签切换
   */
  switchTab(items: any, index: number) {
    this.animating = true;
    setTimeout(() => {
      this.animating = false;
    }, 300);
    const { adcode, center, citycode, level, name } = items;
    // debugger;
    const filterList = ["city", "districts"];
    this.pcaDate = this.pcaDate.filter((res: any) => {
      if (level === "city") {
        return res.level === "province";
      } else {
        return res.level !== level;
      }
    });
    this.pcaDate.push({
      adcode,
      center,
      citycode,
      level,
      name
    });
    this.setTabTitle(); // 设置页签
    if (
      !items.districts ||
      items.districts.length === 0 ||
      this.tabLength === index
    ) {
      this.isFocus = false;
      // 出发父级回调事件
      this.change();
      return;
    }
    items.districts.forEach((res: any) => {
      res.selected = false;
    });

    if (items.districts[0].level === "city") {
      this.city = items.districts;
    } else {
      this.area = items.districts;
    }

    if (this.city.length === 0) {
      this.hasCity = false;
    }

    // })
  }

  /**
   * 省选择
   */
  provincesClick(index: number, adCode: string) {
    this.hasArea = true;
    this.hasCity = true;
    this.pcaDate = [];

    this.tabTitle.forEach((t: any, i: number) => {
      if (i < 3) {
        t.title = "";
      }
    });
    let seletor: any = null;
    this.pca.forEach((res: any) => {
      res.selected = false;
      if (res.adcode === adCode) {
        seletor = res;
      }
    });
    seletor.selected = true;
    this.city = [];
    this.area = [];

    // 设置值
    this.switchTab(seletor, 1);
  }

  /**
   * 市选择
   */
  cityClick(index: number) {
    this.city.forEach((res: any) => {
      res.selected = false;
    });
    this.city[index].selected = true;
    this.area = this.city[index].districts;
    this.city = [...this.city];

    if (this.area.length === 0) {
      this.hasArea = false;
    } else {
      this.hasArea = true;
    }
    this.area = [];
    // 设置值
    this.switchTab(this.city[index], 2);
  }

  /**
   * 区选择
   */
  areaClick(index: number) {
    this.area.forEach((res: any) => {
      res.selected = false;
    });
    this.area[index].selected = true;
    this.area = [...this.area];
    this.switchTab(this.area[index], 3);
  }

  tabClick(index: number) {
    this.tabT.forEach((t: any) => {
      t.active = false;
    });

    this.tabT[index].active = true;
    this.activeTab = index;
  }

  /**
   * 设置值显示字符串
   */
  setShowValue() {
    this.valString = this.pcaDate
      .map((res: any) => res.name)
      .join(" ") as string;
  }

  /**
   * 回调change事件
   */
  change() {
    const setConfig: any = {
      1: "province",
      2: "city",
      3: "district",
      4: "street"
    };

    const adData: any = {
      provinceName: "",
      provinceAdcode: "",
      cityName: "",
      cityAdcode: "",
      districtName: "",
      districtAdcode: "",
      lng: 0,
      lat: 0
    };

    this.pcaDate.forEach((res: any) => {
      if (res.level === "province") {
        adData.provinceAdcode = res.adcode;
        adData.provinceName = res.name;
      }

      if (res.level === "city") {
        adData.cityAdcode = res.adcode;
        adData.cityName = res.name;
      }

      if (res.level === "district") {
        adData.districtAdcode = res.adcode;
        adData.districtName = res.name;
      }
    });

    let detailCity: any;

    detailCity = this.pcaDate.find((res: any) => res.level === "district");

    if (!detailCity) {
      detailCity = this.pcaDate.find((res: any) => res.level === "city");
    }

    if (!detailCity) {
      detailCity = this.pcaDate.find((res: any) => res.level === "province");
    }

    const lngLat = detailCity.center.split(",");
    adData.lng = lngLat[0];
    adData.lat = lngLat[1];

    this.value = adData;

    this.setShowValue();
    this.setTabTitle();

    this.$emit("change", this.value);
  }

  /**
   * 设置tab切换的title
   */
  setTabTitle() {
    let p: any = "";
    let c: any = "";
    let a: any = "";
    this.pcaDate.forEach((res: any) => {
      if (res.level === "province") {
        p = res.name;
      } else if (res.level === "city") {
        c = res.name;
      } else {
        a = res.name;
      }
    });
    this.tabTitle[0].title = p;
    this.tabTitle[1].title = c;
    this.tabTitle[2].title = a;
    this.tabTitle[1].show = Boolean(c);
    this.tabTitle[2].show = Boolean(a);
  }

  /**
   * 空选项选择
   */
  emptyClick(type: string) {
    switch (type) {
      case "p":
        this.pcaDate = [];
        break;
      case "c":
        this.pcaDate = this.pcaDate.filter(
          (res: any) => res.level !== "city" && res.level !== "districts"
        );
        break;
      default:
        this.pcaDate = this.pcaDate.filter(
          (res: any) => res.level !== "districts"
        );
        break;
    }

    this.isFocus = false;
    // 出发父级回调事件
    this.change();
  }

  // 值类型兼容
  setValue(val: any) {
    let value: any[] = [];
    this.getPcaBaseData();
    this.pca.forEach((p: any) => {
      // 找到对应是省
      if (p.adcode === val.provinceAdcode) {
        value.push(this.initVal(p));
        // return;
      }

      if (p.districts.length > 0) {
        p.districts.forEach((c: any) => {
          // 匹配到省
          if (c.adcode === val.cityAdcode || c.adcode === val.districtAdcode) {
            // value.push(this.initVal(p));
            value.push(this.initVal(c));
            // return;
          }

          if (c.districts.length > 0) {
            c.districts.forEach((a: any) => {
              // 匹配到市
              if (a.adcode === val.districtAdcode) {
                // value.push(this.initVal(p));
                // value.push(this.initVal(c));
                value.push(this.initVal(a));
                // return;
              }
            });
          }
        });
      }
    });

    if (this.tabLength === 1) {
      value = value.filter((res: any) => {
        return res.level === "province";
      });
    }
    if (this.tabLength === 2) {
      value = value.filter((res: any) => {
        return res.level === "city" || res.level === "province";
      });
    }
    return value;
  }

  initVal(pcaItem: any) {
    const { adcode, center, level, name } = pcaItem;
    return {
      adcode,
      center,
      level,
      name
    };
  }
  /**
   * 默认值变化时
   */
  @Watch("defaultVal", {
    immediate: true
  })
  onValueChange(val: any) {
    this.pcaDate = [];
    this.setShowValue();
    if (val.provinceAdcode || val.cityAdcode || val.provinceAdcode) {
      this.pcaDate = this.setValue(val);
      this.setShowValue();
      return;
    }
    if (!val.pca || val.pca.length === 0) return;
    this.pcaDate = [...val];
    this.setShowValue();
  }

  @Watch("activeTab")
  onActiveTabChange(index: number) {
    // debugger
    this.tabT.forEach((res: any) => {
      res.active = false;
    });
    this.tabT[index].active = true;
  }

  @Watch("pcaDate", {
    immediate: true
  })
  onPcaDatachange(val: any) {
    // debugger;
    this.tabT = [];
    val.forEach((res: any) => {
      const obj: any = {
        title: res.name,
        active: false,
        code: res.level
      };
      this.tabT.push(obj);
    });

    const other: any = {
      title: "请选择",
      active: false,
      code: "other"
    };
    if (
      this.tabLength === 1 &&
      !val.some((res: any) => res.level === "province")
    ) {
      this.tabT.push(other);
    }

    if (this.tabLength === 2 && !val.some((res: any) => res.level === "city")) {
      this.tabT.push(other);
    }

    if (
      this.tabLength === 3 &&
      !val.some((res: any) => res.level === "district") &&
      (this.hasArea && this.hasCity)
    ) {
      this.tabT.push(other);
    }

    if (val.length === 0 && this.tabT.length === 0) {
      this.tabT.push(other);
    }

    this.showTab.forEach((res: any, index: number) => {
      this.showTab[index] = false;

      // if (index < this.tabT.length) {
      //   this.showTab[index] = true;
      // }
    });
    this.showTab[0] = true;
    if (this.hasCity) {
      this.showTab[1] = true;
    }
    if (this.hasArea) {
      this.showTab[2] = true;
    }

    if (this.tabLength === val.length || !this.hasArea || !this.hasCity) {
      this.activeTab = val.length - 1;
    } else {
      this.activeTab = val.length;
    }

    if (val.length === 0) {
      this.activeTab = 0;
    }

    this.tabT[this.activeTab].active = true;

    // 香港澳门特别行政区处理
    if (!this.hasCity && this.hasArea) {
      this.activeTab = 1;
    }
  }
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
.pca-selector {
  overflow: hidden;
  text-align: left;
  background: #fff;
  &--row {
    & > div {
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
        flex: 1;
        color: #333;
        .icon {
          font-size: 12px;
          float: right;
          line-height: 15px;
          color: #999;
        }
        .placeholder {
          color: #999;
        }
      }
    }
  }

  &--mask {
    // transform:translateZ(1px);
    overflow: hidden;
    z-index: 500;
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    // width: 100%;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    // transform: translateZ(1px);
  }
  &--show {
    transform: translateY(0);
  }

  &--options-show {
    transform: translateY(0);
  }
}
</style>
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
.pca-selector--options {
  font-size: 0.4rem;
  text-align: left;
  overflow: hidden;
  .options-header {
    height: 1.3333rem;
    line-height: 1.3333rem;
    margin: 0 15px;
    .hairline("bottom", #eee);
    position: relative;
    span {
      display: inline-block;
      margin-right: 20px;
    }
    span {
      color: #333333;
      max-width: 7em;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    span.active {
      color: @primary-color;
      border-bottom: 0.053rem solid @primary-color;
    }
    .clear {
      float: right;
      color: #ccc;
    }
  }
  .options-content {
    height: 11.733333rem;
    /deep/.h3-slider {
      height: 100% !important;
      .h3-swiper {
        height: 100% !important;
      }
    }
  }

  ul {
    height: 11.733333rem;
    overflow: scroll;
    color: #333;
    li {
      position: relative;
      line-height: 1.2rem;
      height: 1.2rem;
      // padding: 13px 0;
      margin: 0 15px;
      .hairline("bottom", #eee);
      .icon {
        float: right;
      }
    }
    li.selected {
      color: @primary-color;
    }
  }
}
</style>

