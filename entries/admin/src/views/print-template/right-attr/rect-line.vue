<template>
  <div class="left-attr">
    <div class="left-item" v-if="itemAttrs.eleType.includes('topDrawerLine')">
      <p>方向</p>
      <div class="select-input">
        <a-select v-model="itemAttrs.lineDirection" title="宽高属性将重置">
          <a-select-option value="x">水平</a-select-option>
          <a-select-option value="y">垂直</a-select-option>
        </a-select>
      </div>
    </div>
    <Xywh/>
    <div class="left-item" v-if="itemAttrs.eleType.includes('topDrawerRect')">
      <p>填充色</p>
      
      <div class="color-select">
        
          <color-dropdown
            :fill="true"
            :value="itemAttrs.fillColorValue"
            @change="selectColor($event, 'fillColor')"
          ></color-dropdown>
<!-- 
        <a-popover placement="bottom">
          <template slot="content">
            <ColorSelect @clickColor="selectColor($event, 'fillColor')"/>
          </template>
          <a-button
            :style="`background: ${itemAttrs.fillColorValue}`"
            size="small"
            title="填充色"
          >
            <i class="icon aufont icon-base-paint-bucket-s" :style="`color:${itemAttrs.fillColorValue};`"></i>
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-popover> -->
      </div>
    </div>
    <div class="left-item">
      <p>边框</p>
      <div class="select-input">
        <!-- <a-dropdown title="线宽">
          <a-menu slot="overlay" @click="selectBorder($event, 'borderWidthValue')">
            <a-menu-item
              v-for="item in borders"
              :key="item.key"
              :style="item.ownStyle"
            >
              <div :style="item.style">{{ item.eleDom }}</div>
            </a-menu-item>
          </a-menu>
          <a-button size="small">
            <i class="icon aufont icon-base-onerow-twocolumn-o1 border-set-icon"></i>
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-dropdown> -->
                    
          <line-size-dropdown :value="itemAttrs.borderWidthValue" @change="selectBorder($event, 'borderWidthValue')"></line-size-dropdown>
        
          <color-dropdown
            icon="h-icon-all-edit-o"
            :value="itemAttrs.borderColorValue"
            :defaultColor="itemAttrs.eleType === 'topDrawerRect' ? '#000' : ''"
            @change="selectColor($event, 'lineColor')"
          ></color-dropdown>

        <!-- <a-popover placement="bottom">
          <template slot="content">
            <ColorSelect @clickColor="selectColor($event, 'lineColor')"/>
          </template>
          <a-button
            class="line-color"
            size="small"
            title="线段颜色"
          >
            <i class="icon aufont icon-base-pen-s" :style="`color:${itemAttrs.borderColorValue};`"></i>
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-popover> -->
        <!-- <a-popover placement="bottom" v-if="itemAttrs.eleType.includes('topDrawerRect')">
          <template slot="content">
            <div
              class="box-side"
              :class="{boxSideClass: true}"
              ref="boxSide"
            >
              <div
                class="top-div"
                :style="borderStyle.top"
                @click="borderClick('top')"
              ></div>
              <div class="flex-justify-between">
                <div
                  class="left-div"
                  :style="borderStyle.left"
                  @click="borderClick('left')"
                ></div>
                <div
                  class="right-div"
                  :style="borderStyle.right"
                  @click="borderClick('right')"
                >
                </div>
              </div>
              <div
                class="bottom-div"
                :style="borderStyle.bottom"
                @click="borderClick('bottom')"
              ></div>
            </div>
          </template>
          <a-button size="small" title="边框可见性">
            <i class="icon aufont icon-base-frame border-set-icon"></i>
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-popover> -->

        <!-- <border-dropdown v-if="itemAttrs.eleType.includes('topDrawerRect')"
          :value="positionClick"
          @borderClick="borderClick"
        ></border-dropdown> -->

        <border-dropdown v-if="itemAttrs.eleType.includes('topDrawerRect')"
          v-model="itemAttrs.borders"
        ></border-dropdown>

      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Watch } from 'vue-property-decorator';
// eslint-disable-next-line
import { namespace } from 'vuex-class';
// eslint-disable-next-line
import { borderDivs, fontsArrays, borderStyle } from '@/config/print/dataStructure';
// eslint-disable-next-line
import { onChange } from '@/utils/print-util';
import ColorSelect from './color-component.vue';
import Xywh from './xywh.vue';

import ColorDropdown from "./color-dropdown.vue";
import LineSizeDropdown from "./line-size-dropdown.vue";
import SizeDropdown from "./size-dropdown.vue";
import BorderDropdown from "./border-dropdown.vue";

const PrintVuex = namespace('Print/Print');


@Component({
  name: 'rect-line',
  components: {
    ColorSelect,
    Xywh,
    ColorDropdown,
    LineSizeDropdown,
    SizeDropdown,
    BorderDropdown
  }
})
export default class LeftAttribute extends Vue {
  @PrintVuex.State('itemAttrs') itemAttrs!: object;

  @PrintVuex.Mutation('changeXYWH') changeXYWH!: any;

  positionClick: any = {
    top: true,
    right: true,
    bottom: true,
    left: true,
  };

  borderStyle: object = borderStyle;

  borders: object[] = borderDivs;

  fontsArr: number[] = fontsArrays;

  selectBorder(e: any, border: string) {
    // @ts-ignore
    if (this.itemAttrs.eleType.includes('topDrawerRect')) {
      // @ts-ignore
      this.itemAttrs[border] = e;
    }
    // @ts-ignore
    if (this.itemAttrs.eleType.includes('topDrawerLine')) {
      // @ts-ignore
      if (this.itemAttrs.lineDirection.includes('x')) {
        // @ts-ignore
        this.itemAttrs.heightValue = parseInt(e, 10);
      } else {
        // @ts-ignore
        this.itemAttrs.widthValue = parseInt(e, 10);
      }
    }
  }

  selectColor(color: string, str: string) {
    // @ts-ignore
    if (str.includes('fillColor')) { this.itemAttrs.fillColorValue = color; }
    // @ts-ignore
    if (str.includes('lineColor')) { this.itemAttrs.borderColorValue = color; }
    // @ts-ignore
    if (str.includes('fontColor')) { this.itemAttrs.fontColorValue = color; }
  }

  fourBorder(): any {
    let rectStr:string = '';
    let borStr: string = '';
    Object.keys(this.positionClick).forEach((key:string) => {
      // @ts-ignore
      if (this.positionClick[key]) {
        rectStr += `border-${key}: 1px solid #ccc;`;
        // @ts-ignore
        borStr += `border-${key}: ${this.itemAttrs.borderWidthValue} solid ${this.itemAttrs.borderColorValue};`;
      } else {
        rectStr += `border-${key}: 1px solid #fff;`;
        // @ts-ignore
        borStr += `border-${key}: 1px solid #fff;`;
      }
    });
    return { rectStr, borStr };
  }

  borderClick(position: string) {
    // @ts-ignore
    this.positionClick[position] = !this.positionClick[position];
    // @ts-ignore
    if (this.positionClick[position]) {
      // @ts-ignore
      this.borderStyle[position] = 'background: rgba(118, 156, 249, 1)';
    } else {
      // @ts-ignore
      this.borderStyle[position] = 'background: #ccc';
    }

    const style = this.fourBorder().borStr;

    // @ts-ignore
    this.itemAttrs.hasWhereBorders = style;
    
    // @ts-ignore
    // this.$refs.boxSide.style = this.fourBorder().rectStr;
  }

  @Watch('itemAttrs.lineDirection')
  xyChange(n: string, o: string) {
    // @ts-ignore
    this.itemAttrs.active = false;
    if (n.includes('x')) {
      // @ts-ignore
      this.itemAttrs.heightValue = this.itemAttrs.widthValue || 1;
      // @ts-ignore
      this.itemAttrs.widthValue = 85;
    } else {
      // @ts-ignore
      this.itemAttrs.widthValue = this.itemAttrs.heightValue || 1;
      // @ts-ignore
      this.itemAttrs.heightValue = 85;
    }
    // @ts-ignore
    this.changeXYWH({ heightValue: this.itemAttrs.heightValue, widthValue: this.itemAttrs.widthValue });
  }
}
</script>

<style lang="less" scoped>

</style>
