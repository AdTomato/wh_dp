<template>
  <div class="left-attr">
    <div v-show="leftOrRight.includes('left')">
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
          <a-input @change="txtChange($event, 'left')" @focus="inputToggle('focus')" @blur="inputToggle('blur')" v-model="itemAttrs.leftKey.innerTxt"/>
        </div>
        <div v-show="whichRadio === 2" class="input-select" style="line-height:0.9">
          <a-select v-model="itemAttrs.leftKey.code" @change="(item) => { this.itemAttrs.leftKey.innerTxt = `\${ ${item.split('#_#')[2]} }`; }">
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
            :value="itemAttrs.leftKey.fillColorValue"
            @change="selectColor($event, 'fillColor')"
          ></color-dropdown>
<!-- 
          <a-popover placement="bottom">
            <template slot="content">
              <ColorSelect @clickColor="selectColor($event, 'fillColor')"/>
            </template>
            <a-button
              :style="`background: ${itemAttrs.leftKey.fillColorValue}`"
              size="small"
              title="填充色"
            >
              <i class="icon aufont icon-base-paint-bucket-s" :style="`color:${itemAttrs.leftKey.fillColorValue};`"></i>
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-popover> -->
        </div>
      </div>
      <div class="left-item">
        <p>边框</p>
        <div class="select-input">

          
          <line-size-dropdown :value="itemAttrs.borderWidthValue" @change="selectBorder($event, 'borderWidthValue')"></line-size-dropdown>
        

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
          <!-- <a-dropdown title="边框样式">
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
            :value="itemAttrs.leftKey.borderTypeValue"
            @change="selectBorder($event, 'borderTypeValue')"
          ></line-style-dropdown>

          
          <color-dropdown
            icon="h-icon-all-edit-o"
            :value="itemAttrs.leftKey.borderColorValue"
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
              <i class="icon aufont icon-base-pen-s" :style="`color:${itemAttrs.leftKey.borderColorValue};`"></i>
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-popover> -->
        </div>
      </div>
      <div class="left-item">
        <p>字体</p>
        <div class="font-setting">
          
          <size-dropdown :value="itemAttrs.leftKey.fontSizeValue" @change="(e) => { itemAttrs.leftKey.fontSizeValue = e }"></size-dropdown>
          
          <color-dropdown
            icon="h-icon-all-text-a"
            :value="itemAttrs.leftKey.fontColorValue"
            @change="selectColor($event, 'fontColor')"
          ></color-dropdown>

<!--           
          <a-dropdown title="字体大小">
            <a-menu
              style="max-height: 250px;overflow: scroll;"
              slot="overlay"
              @click="(e) => { itemAttrs.leftKey.fontSizeValue = e }"
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
              {{ itemAttrs.leftKey.fontSizeValue }}
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-dropdown> -->

          

<!-- 
          <a-popover placement="bottom">
            <template slot="content">
              <ColorSelect @clickColor="selectColor($event, 'fontColor')"/>
            </template>
            <a-button
              class="fonts-color"
              size="small"
              title="字体颜色"
            >
              <span :style="`color:${itemAttrs.leftKey.fontColorValue};`">A</span>
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-popover> -->

          <font-style-group
            :bold="itemAttrs.leftKey.fontIsWeight"
            :italic="itemAttrs.leftKey.fontIsItalic"
            :underline="itemAttrs.leftKey.fontIsUnderline"
            @change="setFontStyle"
          ></font-style-group>
<!-- 
          <a-button-group size="small">
            <a-button @click="itemAttrs.leftKey.fontIsWeight = !itemAttrs.leftKey.fontIsWeight">
              <strong v-if="itemAttrs.leftKey.fontIsWeight">B</strong>
              <span v-if="!itemAttrs.leftKey.fontIsWeight">B</span>
            </a-button>
            <a-button @click="itemAttrs.leftKey.fontIsItalic = !itemAttrs.leftKey.fontIsItalic">
              <span :class="itemAttrs.leftKey.fontIsItalic ? 'i' : ''">I</span>
            </a-button>
            <a-button @click="itemAttrs.leftKey.fontIsUnderline = !itemAttrs.leftKey.fontIsUnderline">
              <u v-if="itemAttrs.leftKey.fontIsUnderline">U</u>
              <span v-if="!itemAttrs.leftKey.fontIsUnderline">U</span>
            </a-button>
          </a-button-group> -->
        </div>
      </div>
      <div class="left-item">
        <p>对齐</p>
        <div class="font-neat">

          
          <text-align-group
            :horizontal="itemAttrs.leftKey.fontLCRNeat"
            :vertical="itemAttrs.leftKey.fontTCBNeat"
            @change="setTextAlign"
          ></text-align-group>

          <!-- <a-button-group size="small">
            <a-button
              @click="itemAttrs.leftKey.fontLCRNeat = 'left'"
              title="左侧对齐"
              :class="itemAttrs.leftKey.fontLCRNeat.includes('left') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-left-alignment"></i>
            </a-button>
            <a-button
              @click="itemAttrs.leftKey.fontLCRNeat = 'center'"
              title="水平居中"
              :class="itemAttrs.leftKey.fontLCRNeat.includes('center') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-middle-alignment"></i>
            </a-button>
            <a-button
              @click="itemAttrs.leftKey.fontLCRNeat = 'right'"
              title="右侧对齐"
              :class="itemAttrs.leftKey.fontLCRNeat.includes('right') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-right-alignment"></i>
            </a-button>
          </a-button-group>
          <a-button-group size="small">
            <a-button
              @click="itemAttrs.leftKey.fontTCBNeat = 'top'"
              title="顶部对齐"
              :class="itemAttrs.leftKey.fontTCBNeat.includes('top') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-align-top"></i>
            </a-button>
            <a-button
              @click="itemAttrs.leftKey.fontTCBNeat = 'middle'"
              title="垂直居中"
              :class="itemAttrs.leftKey.fontTCBNeat.includes('middle') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-align-vertical-cente"></i>
            </a-button>
            <a-button
              @click="itemAttrs.leftKey.fontTCBNeat = 'bottom'"
              title="底部对齐"
              :class="itemAttrs.leftKey.fontTCBNeat.includes('bottom') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-align-Bottom"></i>
            </a-button>
          </a-button-group> -->
        </div>
      </div>
    </div>
    <div v-show="leftOrRight.includes('right')">
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
          <a-input @change="txtChange($event, 'right')" v-model="itemAttrs.rightValue.innerTxt"/>
        </div>
        <div v-show="whichRadio === 2" class="input-select">
          <a-select :value="rightCode" @change="onRightChange">
            <a-select-option
              v-for="item in bizSysData"
              :value="item.code"
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
            :value="itemAttrs.rightValue.fillColorValue"
            @change="selectColor($event, 'fillColor')"
          ></color-dropdown>
<!-- 
          <a-popover placement="bottom">
            <template slot="content">
              <ColorSelect @clickColor="selectColor($event, 'fillColor')"/>
            </template>
            <a-button
              :style="`background: ${itemAttrs.rightValue.fillColorValue}`"
              size="small"
              title="填充色"
            >
              <i class="icon aufont icon-base-paint-bucket-s" :style="`color:${itemAttrs.rightValue.fillColorValue};`"></i>
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-popover> -->
        </div>
      </div>
      <div class="left-item">
        <p>边框</p>
        <div class="select-input">

               
          <line-size-dropdown :value="itemAttrs.borderWidthValue" @change="selectBorder($event, 'borderWidthValue')"></line-size-dropdown>
        

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
          <!-- <a-dropdown title="边框样式">
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
            :value="itemAttrs.rightValue.borderTypeValue"
            @change="selectBorder($event, 'borderTypeValue')"
          ></line-style-dropdown>
          
          <color-dropdown
            icon="h-icon-all-edit-o"
            :value="itemAttrs.rightValue.borderColorValue"
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
              <i class="icon aufont icon-base-pen-s" :style="`color:${itemAttrs.rightValue.borderColorValue};`"></i>
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-popover> -->
        </div>
      </div>
      <div class="left-item">
        <p>字体</p>
        <div class="font-setting">
          
          <size-dropdown :value="itemAttrs.rightValue.fontSizeValue" @change="(e) => { itemAttrs.rightValue.fontSizeValue = e }"></size-dropdown>
          
          <color-dropdown
            icon="h-icon-all-text-a"
            :value="itemAttrs.rightValue.fontColorValue"
            @change="selectColor($event, 'fontColor')"
          ></color-dropdown>
          
          <font-style-group
            :bold="itemAttrs.rightValue.fontIsWeight"
            :italic="itemAttrs.rightValue.fontIsItalic"
            :underline="itemAttrs.rightValue.fontIsUnderline"
            @change="setFontStyle"
          ></font-style-group>


          <!-- <a-dropdown title="字体大小">
            <a-menu
              style="max-height: 250px;overflow: scroll;"
              slot="overlay"
              @click="(e) => { itemAttrs.rightValue.fontSizeValue = e }"
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
              {{ itemAttrs.rightValue.fontSizeValue }}
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
              <span :style="`color:${itemAttrs.rightValue.fontColorValue};`">A</span>
              <i class="anticon anticon-down"></i>
            </a-button>
          </a-popover> -->
          <!-- <a-button-group size="small">
            <a-button @click="itemAttrs.rightValue.fontIsWeight = !itemAttrs.rightValue.fontIsWeight">
              <strong v-if="itemAttrs.rightValue.fontIsWeight">B</strong>
              <span v-if="!itemAttrs.rightValue.fontIsWeight">B</span>
            </a-button>
            <a-button @click="itemAttrs.rightValue.fontIsItalic = !itemAttrs.rightValue.fontIsItalic">
              <span :class="itemAttrs.rightValue.fontIsItalic ? 'i' : ''">I</span>
            </a-button>
            <a-button @click="itemAttrs.rightValue.fontIsUnderline = !itemAttrs.rightValue.fontIsUnderline">
              <u v-if="itemAttrs.rightValue.fontIsUnderline">U</u>
              <span v-if="!itemAttrs.rightValue.fontIsUnderline">U</span>
            </a-button>
          </a-button-group> -->
        </div>
      </div>
      <div class="left-item">
        <p>对齐</p>
        <div class="font-neat">
          
          <text-align-group
            :horizontal="itemAttrs.rightValue.fontLCRNeat"
            :vertical="itemAttrs.rightValue.fontTCBNeat"
            @change="setTextAlign"
          ></text-align-group>

          <!-- <a-button-group size="small">
            <a-button
              @click="itemAttrs.rightValue.fontLCRNeat = 'left'"
              title="左侧对齐"
              :class="itemAttrs.rightValue.fontLCRNeat.includes('left') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-left-alignment"></i>
            </a-button>
            <a-button
              @click="itemAttrs.rightValue.fontLCRNeat = 'center'"
              title="水平居中"
              :class="itemAttrs.rightValue.fontLCRNeat.includes('center') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-middle-alignment"></i>
            </a-button>
            <a-button
              @click="itemAttrs.rightValue.fontLCRNeat = 'right'"
              title="右侧对齐"
              :class="itemAttrs.rightValue.fontLCRNeat.includes('right') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-right-alignment"></i>
            </a-button>
          </a-button-group>
          <a-button-group size="small">
            <a-button
              @click="itemAttrs.rightValue.fontTCBNeat = 'top'"
              title="顶部对齐"
              :class="itemAttrs.rightValue.fontTCBNeat.includes('top') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-align-top"></i>
            </a-button>
            <a-button
              @click="itemAttrs.rightValue.fontTCBNeat = 'middle'"
              title="垂直居中"
              :class="itemAttrs.rightValue.fontTCBNeat.includes('middle') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-align-vertical-cente"></i>
            </a-button>
            <a-button
              @click="itemAttrs.rightValue.fontTCBNeat = 'bottom'"
              title="底部对齐"
              :class="itemAttrs.rightValue.fontTCBNeat.includes('bottom') ? 'is-border' : ''"
            >
              <i class="icon aufont icon-base-align-Bottom"></i>
            </a-button>
          </a-button-group> -->
        </div>
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
import { borderDivs, fontsArrays } from '@/config/print/dataStructure';
import ColorSelect from './color-component.vue';
import Xywh from './xywh.vue';

const PrintVuex = namespace('Print/Print');


import ColorDropdown from "./color-dropdown.vue";
import LineSizeDropdown from "./line-size-dropdown.vue";
import LineStyleDropdown from "./line-style-dropdown.vue";
import SizeDropdown from "./size-dropdown.vue";
import FontStyleGroup from './font-style-group.vue';
import TextAlignGroup from './text-align-group.vue';


@Component({
  name: 'column-attribute',
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

  @PrintVuex.State('bizSysData') bizSysData!: any[];

  @PrintVuex.State('leftOrRight') leftOrRight!: string;

  @PrintVuex.Mutation('changeIsFocus') changeIsFocus!: any;

  @PrintVuex.Mutation('setAttrs') setAttrs!: any;

  whichRadio: number = 1;

  borders: object[] = borderDivs;

  fontsArr: number[] = fontsArrays;

  get rightCode(){
    const idx = this.itemAttrs.rightValue.code.indexOf('#');
    if(idx === -1){
      return '';
    }
    const code = this.itemAttrs.rightValue.code.substring(0,idx);
    return code;
  }

  txtChange(e: any, pos: string) {
    // @ts-ignore
    pos.includes('left') ? this.itemAttrs.leftKey.code = '' : this.itemAttrs.rightValue.code = '';
    const str: string = e.target.value;
    // @ts-ignore
    if (str.length > 500) {
      // @ts-ignore
      pos.includes('left') ? this.itemAttrs.leftKey.innerTxt = str.substr(0, 500) : this.itemAttrs.rightValue.innerTxt = str.substr(0, 500);
      this.$message.warning('长度不能超过500个字符！');
    }
    // @ts-ignore
    const height: number = document.querySelector('.two-text-div.activeChoose').getClientRects()['0'].height;
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
    const part = this.itemAttrs[this.leftOrRight === 'left' ? 'leftKey' : 'rightValue'];

    if(!part){
      return;
    }

    if (border === 'borderWidthValue') {
      if(!part.borderColorValue || part.borderColorValue === '#ccc'){
          part.borderColorValue = '#000';
        }

        if(!part.borderTypeValue){
          part.borderTypeValue = 'solid';
        }
    }
    
    part[border]= e;
  }

  selectColor(color: string, str: string) {
    const bool: boolean = this.leftOrRight.includes('left');
    // @ts-ignore
    if (str.includes('fillColor')) {
      // @ts-ignore
      this.itemAttrs[bool ? 'leftKey' : 'rightValue'].fillColorValue = color;
    }
    // @ts-ignore
    if (str.includes('lineColor')) {
      // @ts-ignore
      this.itemAttrs[bool ? 'leftKey' : 'rightValue'].borderColorValue = color;
    }
    // @ts-ignore
    if (str.includes('fontColor')) {
      // @ts-ignore
      this.itemAttrs[bool ? 'leftKey' : 'rightValue'].fontColorValue = color;
    }
  }
  
  setFontStyle(data : {
    key: string,
    value:boolean
  }){
    const part = this.itemAttrs[this.leftOrRight === 'left' ? 'leftKey' : 'rightValue'];

    if(!part){
      return;
    }

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

    part[key] = data.value;
  }

  
  setTextAlign(data:{
    key:string,
    value:string
  }){
    const part = this.itemAttrs[this.leftOrRight === 'left' ? 'leftKey' : 'rightValue'];

    if(!part){
      return;
    }

    const key = data.key === 'horizontal' ? 'fontLCRNeat' : 'fontTCBNeat';
    part[key] = data.value;
  }

  @Watch('leftOrRight')
  leftOrRightChange(nd: any, od: any) {
    if (nd.includes('left')) { this.whichRadio = 1; }
    if (nd.includes('right')) { this.whichRadio = 2; }
  }

  onRightChange(code: string){
    const item = this.bizSysData.find(x => x.code === code);
    if(!item){
      return;
    }
    this.itemAttrs.rightValue.innerTxt = `\${ ${item.name} }`;
    this.itemAttrs.rightValue.code = `${item.code}#_#${item.propertyType}#_#${item.name}`;
  }
}
</script>

