<template>
  <div class="pca-selector">
    <div
      class="pca-selector--content"
      :class="{'focus': isFocus || isHeight, 'selected': isFocus}"
      @mousemove="isHeight = true"
      @mouseleave="isHeight = false"
      :ref="`pca-selector-${aRandom}`"
      @click.stop="getFocus"
    >
      <label>{{ valString }}</label>
      <a-icon type="down" />
    </div>
    <div
      class="pca-selector--options"
      v-show="isFocus"
      :style="{'top': `${position.top+ position.height}px`, 'left': `${position.left}px`}"
      @click.stop="isFocus = true"
    >
      <a-tabs v-model="activeTab">
        <a-tab-pane
          tab="省"
          key="1"
          :disabled="tab[0].disabled"
          v-if="tab[0].isShow"
        >
          <ul class="options--content provinces">
            <li v-if="showEmpty">
              <label></label>
              <span @click.stop="emptyClick('p')">请选择</span>
            </li>
            <li
              v-for="(province, index) in provinces"
              :key="province.code"
            >
              <label>{{ province.name }}:</label>
              <span
                v-for="item in province.items"
                :key="item.adcode"
                :class="{'active': item.selected}"
                @click.stop="provincesClick(index,item.adcode)"
              >{{ item.name }}</span>
            </li>
          </ul>
        </a-tab-pane>
        <a-tab-pane
          tab="市"
          key="2"
          :disabled="tab[1].disabled"
          v-if="tab[1].isShow"
        >
          <div class="city">
            <label v-if="showEmpty">
              <span @click="emptyClick('c')">请选择</span>
            </label>
            <label
              v-for="(item, index) in city"
              :key="item.adcode"
              @click="cityClick(index)"
            >
              <span
                :class="{'active': item.selected}"
              >{{ item.name }}</span>
            </label>
          </div>
        </a-tab-pane>
        <a-tab-pane
          tab="区"
          key="3"
          :disabled="tab[2].disabled"
          v-if="tab[2].isShow"
        >
          <div class="area">
            <label v-if="showEmpty">
              <span @click="emptyClick('a')">请选择</span>
            </label>
            <label
              v-for="(item, index) in area"
              :key="item.adcode"
              @click.stop="areaClick(index)"
            >
              <span
                :class="{'active': item.selected}"
              >{{ item.name }}</span>
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
import pca from "./typings/pca";
import { nC, eC, sC, cC, sWC, nWC, nEC, other } from "./typings/pca-group";
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

  aRandom: number = Math.random();
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
  pca = [nC, eC, sC, cC, sWC, nWC, nEC, other];
  isFocus: boolean = false;
  isHeight: boolean = false;
  activeTab: string = "1";
  city: Array<any> = [];
  area: Array<any> = [];
  valString: string = "";
  value: Array<any> = [];
  tabLength: number = 3;
  position: any = {};

  mounted() {
    const ref: any = this.$refs[`pca-selector-${this.aRandom}`];
    this.position = ref.getBoundingClientRect();
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
  outFocus() {
    this.isFocus = false;
  }
  /**
   * 初始化数据
   */
  initData() {
    let p = "";
    let c = "";
    let a = "";
    if (this.value.length > 0) {
      this.value.forEach((res: any) => {
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
    pca.forEach((res: any) => {
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
      this.pca.forEach((r: any, index: number) => {
        if (r.includes(res.adcode)) {
          this.setGroup(pcaName[index], res);
        }
      });
    });
  }

  // 获得焦点时
  getFocus() {
    const ref: any = this.$refs[`pca-selector-${this.aRandom}`];
    this.position = ref.getBoundingClientRect();
    this.isFocus = !this.isFocus;
    this.activeTab = "1";
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
    this.value = [];
    let seletor: any = null;
    pca.forEach((res: any) => {
      res.selected = false;
      if (res.adcode === adCode) {
        seletor = res;
      }
    });
    seletor.selected = true;
    // 设置值
    this.switchTab(seletor, 1);
  }
  /**
   * 空选项选择
   */
  emptyClick(type: string) {
    switch (type) {
      case "p":
        this.value = [];
        break;
      case "c":
        this.value.filter(
          (res: any) => res.level !== "city" && res.level !== "districts"
        );
        break;
      default:
        this.value.filter((res: any) => res.level !== "districts");
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
    this.value = this.value.filter((res: any) => {
      if (res.level === "city") {
        return res.level !== level || res.level === "districts";
      } else {
        return res.level !== level;
      }
    });
    this.value.push({
      adcode,
      center,
      citycode,
      level,
      name
    });
    if (
      !items.districts ||
      items.districts.length === 0 ||
      this.tabLength === index
    ) {
      this.isFocus = false;
      //出发父级回调事件
      this.change();
      return;
    }
    items.districts.forEach((res: any) => {
      res.selected = false;
    });
    if (items.districts[0].level === "city") {
      this.city = items.districts;
      this.activeTab = "2";
    } else {
      this.area = items.districts;
      this.activeTab = "3";
    }
  }
  /**
   * 设置值显示字符串
   */
  setShowValue() {
    this.valString = this.value
      .map((res: any) => {
        return res.name;
      })
      .join("/") as string;
  }
  /**
   * 回调change事件
   */
  change() {
    this.setShowValue();
    console.log(JSON.stringify(this.value));
    this.$emit("change", this.value);
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

  @Watch("defaultVal", {
    immediate: true
  })
  onValueChange(val: any) {
    if (!val || val.length === 0) return;
    this.value = [...val];
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
    height: 32px;
    padding: 4px 11px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
    .anticon {
      color: #d9d9d9;
    }
    &.focus {
      border-color: @primary-color;
      box-shadow: 0 0 0 2px rgba(23, 188, 148, 0.2);
    }
    &.selected {
      i {
        transform: rotate(180deg);
      }
    }
    i {
      float: right;
      line-height: inherit;
    }
  }
  .pca-selector--options {
    background: #fff;
    // padding: 24px;
    z-index: 1050;
    margin-top: 4px;
    text-align: left;
    position: fixed;
    width: 520px;
    min-height: 42px;
    box-shadow: 0px 1px 4px 0px rgba(99, 99, 99, 0.5);
    border-radius: 4px;
    /deep/.ant-tabs-bar {
      margin-bottom: 0;
    }
    .city,
    .provinces,
    .area {
      margin: 15px 16px;
      margin-bottom: 0;
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
    .city,
    .area {
      margin-left: 4px;
      margin-right: 4px;
      // font-size: 12px;
      label {
        display: inline-block;
        width: 100px;
      }
      span {
        margin-top: 16px;
        max-width: 7rem;
        overflow: hidden;
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
          margin-right: 12px;
          &:hover {
            color: @primary-color;
            cursor: pointer;
            transition: all 0.3s;
          }
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
