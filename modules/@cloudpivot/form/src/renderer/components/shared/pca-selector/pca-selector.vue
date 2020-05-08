<template>
  <div class="pca-selector">
    <div
      class="pca-selector--content"
      :class="{'focus': isFocus, 'selected': isFocus, 'disabled': disabled}"
      @mousemove="isHeight = true"
      @mouseleave="isHeight = false"
      :ref="`pca-selector-${aRandom}`"
      @click.stop="getFocus"
    >
      <label>{{ valString }}</label>
      <label
        v-if="pcaDate.length===0"
        class="placeholder"
      >{{ $t('cloudpivot.form.renderer.peleseSelect') }}</label>
      <a-icon class="down" type="down" />
      <a-icon
        @click.stop="clearValue"
        v-if="isFocus&&pcaDate.length>0"
        class="delete"
        type="close-circle"
      />
    </div>
    <div
      class="pca-selector--options"
      :ref="`pca-options-${aRandom}`"
      v-show="isFocus"
      :style="{'top': `${position.top}px`, 'left': `${position.left}px`}"
      @click.stop="isFocus = true"
    >
      <a-tabs
        @change="setPosition"
        v-model="activeTab"
      >
        <a-tab-pane
          tab="省"
          key="1"
          :disabled="tab[0].disabled"
          v-if="tab[0].isShow"
        >
          <div class="provinces">
            <label v-if="showEmpty">
              <span @click.stop="emptyClick('p')">{{ $t('cloudpivot.form.renderer.peleseSelect') }}</span>
            </label>
            <label
              v-for="(item, index) in _provinces"
              :key="item.adcode"
              :class="{'double-width': item.name.length>7}"
              @click.stop="provincesClick(index,item.adcode)"
            >
              <span :class="{'active': item.selected}">{{ item.name }}</span>
            </label>
          </div>
          <!-- <ul  class="options--content provinces">
            <li v-if="showEmpty">
              <label>
              </label>
              <span @click.stop="emptyClick('p')">
                请选择
              </span>
            </li>
            <li
              v-for="(province, index) in provinces"
              :key='province.code'
            >
              <label>{{ province.name }}:</label>
              <span
                v-for="item in province.items"
                :key="item.adcode"
                :class='{"active": item.selected}'
                @click.stop="provincesClick(index,item.adcode)"
              >
                {{ item.name }}
              </span>
            </li>
          </ul>-->
        </a-tab-pane>
        <a-tab-pane
          :tab="$t('cloudpivot.form.renderer.city')"
          key="2"
          :disabled="tab[1].disabled"
          v-if="tab[1].isShow"
        >
          <div class="city">
            <label v-if="showEmpty">
              <span @click.stop="emptyClick('c')">{{ $t('cloudpivot.form.renderer.peleseSelect') }}</span>
            </label>
            <label
              v-for="(item, index) in city"
              :key="item.adcode"
              @click.stop="cityClick(index)"
              :class="{'ouble-width': item.name.length>7}"
            >
              <span :class="{'active': item.selected}">{{ item.name }}</span>
            </label>
          </div>
        </a-tab-pane>
        <a-tab-pane
          :tab="$t('cloudpivot.form.renderer.countyArea')"
          key="3"
          :disabled="tab[2].disabled"
          v-if="tab[2].isShow"
        >
          <div class="area">
            <label v-if="showEmpty">
              <span @click.stop="emptyClick('a')">{{ $t('cloudpivot.form.renderer.peleseSelect') }}</span>
            </label>
            <label
              v-for="(item, index) in area"
              :key="item.adcode"
              @click.stop="areaClick(index)"
              :class="{'double-width': item.name.length>7}"
            >
              <span :class="{'active': item.selected}">{{ item.name }}</span>
            </label>
          </div>
        </a-tab-pane>
      </a-tabs>
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

import { Tabs, Icon } from "h3-antd-vue";

@Component({
  name: "pca-selector",
  components: {
    ATabs: Tabs,
    ATabPane: Tabs.TabPane,
    AIcon: Icon
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
  disabled!: boolean;

  aRandom: number = Math.random();
  _provinces: Array<any> = [];
  provinces: Array<any> = [
    {
      code: "nC",
      name: "华北",
      items: []
    },
    {
      code: "eC",
      name: "华东",
      items: []
    },
    {
      code: "sC",
      name: "华南",
      items: []
    },
    {
      code: "cC",
      name: "华中",
      items: []
    },
    {
      code: "sWC",
      name: "西南",
      items: []
    },
    {
      code: "nWC",
      name: "西北",
      items: []
    },
    {
      code: "nEC",
      name: "东北",
      items: []
    },
    {
      code: "other",
      name: "其他",
      items: []
    }
  ];
  levelType: any = {
    1: "province",
    2: "city",
    3: "district"
  };
  // tab 页签数据维护
  tab: Array<any> = [
    {
      disabled: true,
      isShow: false
    },
    {
      disabled: true,
      isShow: false
    },
    {
      disabled: true,
      isShow: false
    }
  ];
  // pca = [nC, eC, sC, cC, sWC, nWC, nEC, other];
  isFocus: boolean = false;
  isHeight: boolean = false;
  activeTab: string = "1";
  city: Array<any> = [];
  area: Array<any> = [];
  valString: string = "";
  value: any = {};
  pcaDate: Array<any> = [];
  tabLength: number = 3;
  position: any = {
    top: 0,
    left: 0
  };

  mounted() {
    const ref: any = this.$refs[`pca-selector-${this.aRandom}`];
    // this.position = ref.getBoundingClientRect();
    document.addEventListener("click", this.outFocus);
  }

  created() {
    this.setConfig();

    //配置基础数据
    this.initData();
  }

  destoryed() {
    document.removeEventListener("click", this.outFocus);
  }
  // 失去焦点清空数据
  outFocus() {
    this.isFocus = false;
    this.ondefaultValChange(this.defaultVal);
    // this.defaultVal = Object.assign({},this.defaultVal);
  }
  /**
   * 清空值
   */
  clearValue() {
    this.value = {};
    this.$emit("change", this.value);
    this.pcaDate = [];
    this.setShowValue();
    this.isFocus = false;

    this.provinces.forEach((res: any) => {
      res.items.forEach((p: any) => {
        p.selected = false;
      });
    });
    // this.pca.forEach((p:any) => {
    //   p.selected = false;
    // });
    this.city = [];
    this.area = [];
  }
  /**
   * 初始化数据
   */
  pcaBaseData: any = [];
  initData() {
    // debugger
    let p = "";
    let c = "";
    let a = "";
    if (this.pcaDate.length > 0) {
      this.pcaDate.forEach((res: any) => {
        switch (res.level) {
          case "province":
            this.tab[0].disabled = false;
            p = res.adcode;
            return;
          case "city":
            this.tab[1].disabled = false;
            c = res.adcode;
            return;
          case "district":
            this.tab[2].disabled = false;
            a = res.adcode;
            return;
        }
      });
    }
    const pcaName = ["nC", "eC", "sC", "cC", "sWC", "nWC", "nEC", "other"];
    let city: any[] = [];
    let area: any[] = [];
    this.getPcaBaseData();
    // const pca = require('./typings/pca');
    // this.pcaBaseData =  pca;
    this._provinces.forEach((res: any) => {
      res.selected = false;
      if (p === res.adcode) {
        res.selected = true;

        if (c && this.tabLength > 1) {
          city = res.districts;
          this.city = res.districts;
          this.city.forEach((item: any) => {
            item.selected = false;
            if (c === item.adcode) {
              item.selected = true;
              area = item.districts;
              this.area = item.districts;
            }
          });
        }
      }
      if (a) {
        area.forEach((item: any) => {
          item.selected = false;
          if (a === item.adcode) {
            item.selected = true;
          }
        });
      }
      // this.pca.forEach((r:any, index:number) => {
      //   if (r.includes(res.adcode)) {
      //     this.setGroup(pcaName[index],res);
      //   }
      // })
    });
    // this._provinces = pca;
  }

  // 获得焦点时
  getFocus() {
    if(!this.disabled) {
      const ref: any = this.$refs[`pca-selector-${this.aRandom}`];
      // this.position = ref.getBoundingClientRect();
      this.isFocus = !this.isFocus;
      this.activeTab = "1";
      this.setPosition();
      this.initData();
    }
  }

  setPosition() {
    this.$nextTick(() => {
      const inputRef: any = this.$refs[`pca-selector-${this.aRandom}`];
      const optionsRef: any = this.$refs[`pca-options-${this.aRandom}`];
      const optionsRefH = optionsRef.offsetHeight as number;
      const optionsRefW = optionsRef.offsetWidth as number;
      const inputRefP = inputRef.getBoundingClientRect() as any;
      if (window.innerHeight - inputRefP.top - inputRefP.height > optionsRefH) {
        this.position = {
          top: inputRefP.top + inputRefP.height,
          left: inputRefP.left
        };
      } else if (inputRefP.top > optionsRefH) {
        this.position = {
          top: inputRefP.top - optionsRefH,
          left: inputRefP.left
        };
      } else {
        this.position = {
          top: (window.innerHeight - optionsRefH) / 2,
          left: inputRefP.left
        };
      }
      if (window.innerWidth - inputRefP.left < optionsRefW) {
        this.position.left =
          inputRefP.left - optionsRefW + inputRef.offsetWidth;
      }
    });
  }

  setGroup(code: string, provinces: any) {
    const provincesItem = this.provinces.find((res: any) => {
      return (res.code as string) === code;
    });
    provincesItem.items.push(provinces);
  }

  /**
   * 省选择
   */
  provincesClick(index: number, adCode: string) {
    this.pcaDate = [];
    let seletor: any = null;
    this._provinces.forEach((res: any) => {
      res.selected = false;
      if (res.adcode === adCode) {
        seletor = res;
      }
    });
    seletor.selected = true;
    this.area = [];
    this.city = [];
    this.tab[2].disabled = true;
    // 设置值
    this.switchTab(seletor, 1);
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
        this.pcaDate.filter(
          (res: any) => res.level !== "city" && res.level !== "districts"
        );
        break;
      default:
        this.pcaDate.filter((res: any) => res.level !== "districts");
        break;
    }

    this.isFocus = false;
    //出发父级回调事件
    this.change();
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

  /**
   * tab 页签切换
   */
  switchTab(items: any, index: number) {
    const { adcode, center, citycode, level, name } = items;
    this.pcaDate = this.pcaDate.filter((res: any) => {
      if (res.level === "city") {
        return res.level !== level || res.level === "districts";
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
    if (
      !items.districts ||
      items.districts.length === 0 ||
      this.tabLength === index ||
      this.getBack(items.districts[0])
    ) {
      this.isFocus = false;
      //出发父级回调事件
      this.change();
      return;
    }
    items.districts.forEach((res: any) => {
      res.selected = false;
    });
    this.tab[index - 1].disabled = false;
    this.tab[index].disabled = false;
    this.setPosition();
    if (items.districts[0].level === "city") {
      this.city = items.districts;
      this.activeTab = "2";
    } else {
      this.area = items.districts;
      this.activeTab = "3";
    }
  }
  /**
   * 判断是否需要直接返回
   */
  getBack(cityInfo: any) {
    if (this.tabLength === 2 && cityInfo.level === "district") {
      return true;
    } else {
      return false;
    }
  }
  /**
   * 设置值显示字符串
   */
  setShowValue() {
    this.valString = this.pcaDate
      .map((res: any) => {
        return res.name;
      })
      .join("/") as string;
  }

  /**
   * 回调change事件
   */
  change() {
    const setConfig: any = {
      1: "province",
      2: "city",
      3: "district"
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

    // if (this.) {

    // }

    this.pcaDate.forEach((res: any) => {
      const index = 0;
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

    const detailCity: any = this.findDetailCity(this.pcaDate);

    const lngLat = detailCity.center.split(",");
    adData.lng = lngLat[0];
    adData.lat = lngLat[1];

    this.value = adData;
    this.setShowValue();
    this.$emit("change", this.value);
  }

  findDetailCity(pca: any[]) {
    let city = pca.find((res: any) => {
      return res.level === "district";
    });

    if (!city) {
      city = pca.find((res: any) => {
        return res.level === "city";
      });
    }

    if (!city) {
      city = pca.find((res: any) => {
        return res.level === "province";
      });
    }

    return city;
  }

  /**
   * 控件配置
   */
  setConfig() {
    const format: string[] = this.format.split("-");
    let length: number = format.length || 3;
    this.tabLength = length;
    this.tab.forEach((res: any) => {
      if (length !== 0) {
        res.isShow = true;
        length -= 1;
      }
    });
  }

  // 值类型兼容
  setValue(val: any) {
    let value: any[] = [];

    if (val.provinceAdcode) {
      const p = this.findCityCode(val.provinceAdcode);
      if (p) {
        value.push(this.initVal(p));
      }
    }
    if (val.cityAdcode) {
      const c = this.findCityCode(val.cityAdcode);
      if (c) {
        value.push(this.initVal(c));
      }
    }

    if (val.districtAdcode) {
      const d = this.findCityCode(val.districtAdcode);
      if (d) {
        value.push(this.initVal(d));
      }
    }

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

  /**
   * 初始数据
   */

  getPcaBaseData() {
    if (!this._provinces || this._provinces.length === 0) {
      const pca: any = require("./typings/pca");
      this._provinces = pca.default;
    }
  }

  findCityCode(adCode: string) {
    let city: any = null;
    this.getPcaBaseData();
    this._provinces.forEach((p: any) => {
      if (p.adcode === adCode) {
        city = p;
        return;
      }

      if (p.districts.length > 0) {
        p.districts.forEach((c: any) => {
          if (c.adcode === adCode) {
            city = c;
            return;
          }

          if (c.districts.length > 0) {
            c.districts.forEach((d: any) => {
              if (d.adcode === adCode) {
                city = d;
                return;
              }
            });
          }
        });
      }
    });

    return city;
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

  @Watch("defaultVal", {
    immediate: true
  })
  ondefaultValChange(val: any) {
    // debugger
    this.setConfig();
    this.pcaDate = [];
    if (val.adcode || val.districtAdcode || val.provinceAdcode) {
      this.pcaDate = this.setValue(val);
      return;
    }
    if (!val.pca || val.pca.length === 0) return;
    this.pcaDate = [...val];
  }

  @Watch("pcaDate", {
    immediate: true
  })
  onValueChange() {
    this.setShowValue();
  }
}
</script>
<style lang="less" scoped>
.pca-selector {
  width: 100%;
  text-align: left;
  display: block;
  position: relative;
  &--content {
    line-height: 32px;
    height: 32px;
    padding: 0 11px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    overflow: hidden;

    .placeholder {
      color: #ccc;
    }
    // label {
    //   line-height: 32px;
    // }
    .anticon {
      color: #d9d9d9;
    }

    &:hover {
      border-color: @primary-color;
    }

    &.focus {
      border-color: @primary-color;
      box-shadow: 0 0 0 2px @primary-light-color;
    }
    &.selected {
      i.down {
        transform: rotate(180deg);
      }
    }
    &.disabled {
      background: rgb(245, 245, 245);
      cursor: not-allowed;
    }
    &.disabled:hover {
      border-color: rgb(217, 217, 217);
    }
    i {
      float: right;
      line-height: inherit;
      margin-left: 4px;
    }
  }
  .pca-selector--options {
    background: #fff;
    // padding: 24px;
    z-index: 1050;
    margin-top: 4px;
    text-align: left;
    position: fixed;
    width: 548px;
    min-height: 42px;
    box-shadow: 0px 1px 4px 0px rgba(99, 99, 99, 0.5);
    border-radius: 4px;
    /deep/.ant-tabs-bar {
      margin-bottom: 0;
    }
    .city,
    .provinces,
    .area {
      span {
        display: inline-block;
        // width: 44px;
        height: 24px;
        line-height: 24px;
        cursor: pointer;
        color: rgba(0, 0, 0, 0.85);
        padding: 0 10px;
      }
    }
    .provinces,
    .city,
    .area {
      margin: 15px 16px;
      margin-bottom: 0;
      font-size: 12px;
      label {
        display: inline-block;
        width: 108px;
        margin-bottom: 10px;
      }
      label.double-width {
        width: 216px;
      }
      span {
        display: block;
        // margin-right: 16px;
        // max-width: 7rem;
        overflow: hidden;
        float: left;
        &:hover {
          color: @primary-color;
          cursor: pointer;
          transition: all 0.3s;
        }
      }
    }
    .options--content {
      margin: 24px;
      margin-top: 12px;
      li {
        margin-bottom: 16px;
        font-size: 12px;
        label {
          display: inline-block;
          font-size: 12px;
          color: rgba(0, 0, 0, 0.45);
          margin-right: 22px;
          width: 30px;
        }
        span {
          margin-right: 6px;
        }
      }
    }
    .active {
      color: #fff !important;
      background: @primary-color;
    }
  }
}
</style>
