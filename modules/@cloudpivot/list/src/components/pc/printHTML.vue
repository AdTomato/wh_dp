<template>
  <div class="qrcode-main">
    <div class="qrcode-box" id="qrcodeBox">
      
      <div
        class="qrcode-content"
        v-for="(item, index) in options.qrCodes"
        :key="index"
        :style="{
          width: pageStyle.width + 'px', 
          height: pageStyle.height + 'px'
        }"
      >
        <!-- 标签纸div 竖版 -->
        <div 
          v-if="isVertical"
          class="inner" 
          style="display: inline-block"
          :style="{
            width: pageStyle.width + 'px', 
            marginTop: `${getMT(item)}px`
          }">
          <img
            class="qrcode-img"
            :src="item.url"
            :style="{
              width: pageStyle.width + 'px'
            }"
          />
          <div
            class="qrcode-txt"
            v-if="item.text"
            :style="{ 
              width: pageStyle.width + 'px',
              height: `${(options.fontSize >= 12 ? options.fontSize : 12) * 1.5}px`,
              fontSize: `${translatePx2Mm(options.fontSize >= 12 ? options.fontSize : 12)}px`,
              textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap'
            }">{{ item.text }}</div>
        </div>

        <!-- 标签纸div 横板 -->
        <!-- marginLeft: `${(pageStyle.width - getImgHeight(item.text)) / 2}px` -->
        <div 
          v-else
          class="inner" 
          style="text-align: center"
          :style="{width: pageStyle.width + 'px', height: pageStyle.height + 'px'}"
        >
          <!-- 横板 图片计算 -->
          <img 
            class="qrcode-img"
            :src="item.url"
            :style="{ 
              height: getImgHeight(item.text) + 'px'
            }"
          />
          <div
            class="qrcode-txt"
            v-if="item.text"
            :style="{ 
              width: pageStyle.width + 'px',
              height: `${(options.fontSize >= 12 ? options.fontSize : 12) * 1.5}px`,
              fontSize: `${translatePx2Mm(options.fontSize >= 12 ? options.fontSize : 12)}px`,
              textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap'
            }">{{ item.text }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

// import { getPxFromMm } from '@cloudpivot/common/src/utils/utils'

import common from '@cloudpivot/common';

const { getPxFromMm } = common.utils.BusinessFunctions;

interface Options {
  width: number,
  height: number,
  fontSize: number,
  qrCodes: Array<QrCode>
}

interface QrCode {
  text: string,
  url: string
}

@Component({
name: 'PrintHtml'
})
export default class PrintHtml extends Vue {
  @Prop({ default: {width: 300, height: 700, fontSize: 12,  qrCodes: []} }) options !: Options;

  imgHeight:number = 0;

  // 判断是横版还是竖版
  get isVertical(){
    const { width, height } = this.options
    return width < height;
  }

  get pageStyle(){
    const { width, height } = this.options
    const _width = width - width * 0.05 * 2;
    const _height = height - height * 0.05 * 2;
    return {
      width: this.translatePx2Mm(_width),
      height: this.translatePx2Mm(_height)
    }
  }


  /** 
   * 计算图片高度
  */
  getImgHeight(text:string){
    const innerDomHeight:number = this.pageStyle.height;
    const fs:number = this.options.fontSize >= 12 ? this.options.fontSize : 12;
    let textHeight:number = Math.ceil((fs + 1) * 1.5);
    let h:number = 0
    if (!text) {
      textHeight = 0;
      // return innerDomHeight;
    } 
    h = innerDomHeight - textHeight - 1;
    return h;
  }

  getMT(item:any) {
    const outterH:number = this.pageStyle.height;
    const imgH:number = this.pageStyle.width;
    const txtH:number = item.text ? ((this.options.fontSize >= 12 ? this.options.fontSize : 12) * 1.5) : 0
    return ( outterH - ( imgH + txtH)) / 2;
  }

  translatePx2Mm(px: number) {
    return Math.floor(px);
    // return Math.floor((px / 72) * 2.54 * 1000 / 100);
  }
}
</script>
<style lang='less' scoped>
  .qrcode-main {
    height: 100%;
    .qrcode-box {
      height: 100%;
      background: wheat;
      position: relative;
      .qrcode-content {
        background: yellow;
        .inner {
          display: inline-block;
          background: red;
        }
      }
    }
  }
</style>
