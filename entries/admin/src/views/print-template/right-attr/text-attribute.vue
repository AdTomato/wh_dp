<template>
  <div class="left-attr">
    <div class="left-item">
      <p>文本内容</p>
      <div class="left-radio-group">
        <a-radio-group
          name="radioGroup"
          @change="(e) => { whichRadio = e.target.value; }"
          v-model="whichRadio"
        >
          <a-radio :value="1">固定文本</a-radio>
          <a-radio :value="2">文本值</a-radio>
        </a-radio-group>
      </div>
      <div v-show="whichRadio === 1" class="input-text">
        <a-input @change="txtChange" @focus="inputToggle('focus')" @blur="inputToggle('blur')" v-model="itemAttrs.innerTxt"/>
      </div>
      <div v-show="whichRadio === 2" class="input-select">
        <a-select v-model="itemAttrs.code" @change="(item) => { this.itemAttrs.innerTxt = `\${ ${item.split('#_#')[2]} }`; }">
          <a-select-option
            v-for="item in bizSysData"
            :value="`${item.code}#_#${item.propertyType}#_#${item.name}`"
            :key="item.id"
          >{{ item.name }}_{{ item.owner }}</a-select-option>
        </a-select>
      </div>
    </div>
    <Xywh/>
    <div class="left-item">
      <p>填充色</p>
      <div class="color-select">
        <color-dropdown
            :fill="true"
            :value="itemAttrs.fillColorValue"
            @change="selectColor($event, 'fillColor')"
          ></color-dropdown>
        <!-- <a-popover placement="bottom">
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
                            
        <line-size-dropdown :value="itemAttrs.borderWidthValue" @change="selectBorder($event, 'borderWidthValue')"></line-size-dropdown>
<!--         
        <a-dropdown title="线宽">
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
<!-- 
        <a-dropdown title="边框样式">
          <a-menu slot="overlay" @click="selectBorder($event, 'borderTypeValue')">
            <a-menu-item key="none"><div style="width: 100px;">无</div></a-menu-item>
            <a-menu-item key="solid" style="margin: 5px 0 10px 0;"><div style="width: 100%;height: 1px;background: #666"></div></a-menu-item>
            <a-menu-item key="dashed"><div style="width: 100%;height: 1px;border: 1px dashed #666"></div></a-menu-item>
          </a-menu>
          <a-button size="small">
            <i class="icon aufont icon-base-align-vertical-cente"></i>
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-dropdown> -->

          <line-style-dropdown
            :value="itemAttrs.borderTypeValue"
            @change="selectBorder($event, 'borderTypeValue')"
          ></line-style-dropdown>

        
          <color-dropdown
            icon="h-icon-all-edit-o"
            :value="itemAttrs.borderColorValue"
            @change="selectColor($event, 'lineColor')"
          ></color-dropdown>
<!--         
        <a-popover placement="bottom">
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
      </div>
    </div>
    <div class="left-item">
      <p>字体</p>
      <div class="font-setting">

          <size-dropdown :value="itemAttrs.fontSizeValue" @change="(e) => { itemAttrs.fontSizeValue = e }"></size-dropdown>
          
          <color-dropdown
            icon="h-icon-all-text-a"
            :value="itemAttrs.fontColorValue"
            @change="selectColor($event, 'fontColor')"
          ></color-dropdown>
          
          <font-style-group
            :bold="itemAttrs.fontIsWeight"
            :italic="itemAttrs.fontIsItalic"
            :underline="itemAttrs.fontIsUnderline"
            @change="setFontStyle"
          ></font-style-group>

        <!-- <a-dropdown title="字体大小">
          <a-menu
            style="max-height: 250px;overflow: scroll;"
            slot="overlay"
            @click="(e) => { itemAttrs.fontSizeValue = e.key }"
          >
            <a-menu-item
              v-for="item in fontsArr"
              :key="item"
              :style="item"
            >
              {{ item }}
            </a-menu-item>
          </a-menu>
          <a-button size="small">
            {{ itemAttrs.fontSizeValue }}
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-dropdown>
        <a-popover placement="bottom">
          <template slot="content">
            <ColorSelect @clickColor="selectColor($event, 'fontColor')"/>
          </template>
          <a-button
            class="fonts-color"
            size="small"
            title="字体颜色"
          >
            <span :style="`color:${itemAttrs.fontColorValue};`">A</span>
            <i class="anticon anticon-down"></i>
          </a-button>
        </a-popover> -->
        <!-- <a-button-group size="small">
          <a-button @click="itemAttrs.fontIsWeight = !itemAttrs.fontIsWeight">
            <strong v-if="itemAttrs.fontIsWeight">B</strong>
            <span v-if="!itemAttrs.fontIsWeight">B</span>
          </a-button>
          <a-button @click="itemAttrs.fontIsItalic = !itemAttrs.fontIsItalic">
            <span :class="itemAttrs.fontIsItalic ? 'i' : ''">I</span>
          </a-button>
          <a-button @click="itemAttrs.fontIsUnderline = !itemAttrs.fontIsUnderline">
            <u v-if="itemAttrs.fontIsUnderline">U</u>
            <span v-if="!itemAttrs.fontIsUnderline">U</span>
          </a-button>
        </a-button-group> -->
      </div>
    </div>
    <div class="left-item">
      <p>对齐</p>
      <div class="font-neat">

          <text-align-group
            :horizontal="itemAttrs.fontLCRNeat"
            :vertical="itemAttrs.fontTCBNeat"
            @change="setTextAlign"
          ></text-align-group>

        <!-- <a-button-group size="small">
          <a-button
            @click="itemAttrs.fontLCRNeat = 'left'"
            title="左侧对齐"
            :class="itemAttrs.fontLCRNeat.includes('left') ? 'is-border' : ''"
          >
            <i class="icon aufont icon-base-left-alignment"></i>
          </a-button>
          <a-button
            @click="itemAttrs.fontLCRNeat = 'center'"
            title="水平居中"
            :class="itemAttrs.fontLCRNeat.includes('center') ? 'is-border' : ''"
          >
            <i class="icon aufont icon-base-middle-alignment"></i>
          </a-button>
          <a-button
            @click="itemAttrs.fontLCRNeat = 'right'"
            title="右侧对齐"
            :class="itemAttrs.fontLCRNeat.includes('right') ? 'is-border' : ''"
          >
            <i class="icon aufont icon-base-right-alignment"></i>
          </a-button>
        </a-button-group>
        <a-button-group size="small">
          <a-button
            @click="itemAttrs.fontTCBNeat = 'top'"
            title="顶部对齐"
            :class="itemAttrs.fontTCBNeat.includes('top') ? 'is-border' : ''"
          >
            <i class="icon aufont icon-base-align-top"></i>
          </a-button>
          <a-button
            @click="itemAttrs.fontTCBNeat = 'middle'"
            title="垂直居中"
            :class="itemAttrs.fontTCBNeat.includes('middle') ? 'is-border' : ''"
          >
            <i class="icon aufont icon-base-align-vertical-cente"></i>
          </a-button>
          <a-button
            @click="itemAttrs.fontTCBNeat = 'bottom'"
            title="底部对齐"
            :class="itemAttrs.fontTCBNeat.includes('bottom') ? 'is-border' : ''"
          >
            <i class="icon aufont icon-base-align-Bottom"></i>
          </a-button>
        </a-button-group> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue } from 'vue-property-decorator';
// eslint-disable-next-line
import { namespace } from 'vuex-class';
// eslint-disable-next-line
import { borderDivs, fontsArrays } from '@/config/print/dataStructure';
import ColorSelect from './color-component.vue';
import Xywh from './xywh.vue';

import ColorDropdown from "./color-dropdown.vue";
import LineSizeDropdown from "./line-size-dropdown.vue";
import LineStyleDropdown from "./line-style-dropdown.vue";
import SizeDropdown from "./size-dropdown.vue";
import FontStyleGroup from './font-style-group.vue';
import TextAlignGroup from './text-align-group.vue';

const PrintVuex = namespace('Print/Print');
@Component({
  name: 'text-attribute',
  components: {
    ColorSelect,
    Xywh,
    ColorDropdown,
    LineSizeDropdown,
    SizeDropdown,
    LineStyleDropdown,
    FontStyleGroup,
    TextAlignGroup
  }
})
export default class LeftAttribute extends Vue {
  @PrintVuex.State('itemAttrs') itemAttrs!: any;

  @PrintVuex.State('toLeft') toLeft!: number;

  @PrintVuex.State('bizSysData') bizSysData!: object[];

  @PrintVuex.Mutation('changeIsFocus') changeIsFocus!: any;

  @PrintVuex.Mutation('setAttrs') setAttrs!: any;

  whichRadio: number = 1;

  borders: object[] = borderDivs;

  fontsArr: number[] = fontsArrays;

  txtChange(e: any) {
    // @ts-ignore
    this.itemAttrs.code = '';
    // @ts-ignore
    if (e.target.value.length > 500) {
      // @ts-ignore
      this.itemAttrs.innerTxt = this.itemAttrs.innerTxt.substr(0, 500);
      this.$message.warning('长度不能超过500个字符！');
    }
    // @ts-ignore
    const height: number = document.querySelector('.text-div.active').getClientRects()['0'].height;
    // @ts-ignore
    const allowHeight: number = 695 - this.itemAttrs.top;
    if (height > allowHeight) {
      // @ts-ignore
      this.itemAttrs.heightValue = allowHeight;
      this.$message.warning('内容已超出元素宽高，请拉伸拉伸宽高！');
    } else {
      // @ts-ignore
      this.itemAttrs.heightValue = height;
    }
    this.setAttrs(this.itemAttrs);
  }

  inputToggle(str: string) {
    if (str.includes('focus')) { this.changeIsFocus(true); }
    if (str.includes('blur')) { this.changeIsFocus(false); }
  }

  selectBorder(e: any, border: string) {
    if (border.includes('borderWidthValue')) {
      // @ts-ignore
      this.itemAttrs.borderColorValue = '#000';
      // @ts-ignore
      this.itemAttrs.borderTypeValue = 'solid';
    }
    // @ts-ignore
    this.itemAttrs[border] = e;
  }

  selectColor(color: string, str: string) {
    // @ts-ignore
    if (str.includes('fillColor')) { this.itemAttrs.fillColorValue = color; }
    // @ts-ignore
    if (str.includes('lineColor')) { this.itemAttrs.borderColorValue = color; }
    // @ts-ignore
    if (str.includes('fontColor')) { this.itemAttrs.fontColorValue = color; }
  }
  
  
  setFontStyle(data : {
    key: string,
    value:boolean
  }){

    let key = '';

    switch(data.key){
      case 'bold':
        key = 'fontIsWeight';
        break;
      case 'italic':
        key = 'fontIsItalic';
        break;
      case 'underline':
        key = 'fontIsUnderline';
        break;
    }

    if(!key){
      return;
    }

    this.itemAttrs[key] = data.value;
  }

  
  setTextAlign(data:{
    key:string,
    value:string
  }){
    const key = data.key === 'horizontal' ? 'fontLCRNeat' : 'fontTCBNeat';
    this.itemAttrs[key] = data.value;
  }


}
</script>

