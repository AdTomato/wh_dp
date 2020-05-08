<template>
  <div class="qrcode-main">
    <div class="qrcode-box" id="qrcodeBox">
      <!-- 标签纸div 竖版 -->
      <div
        v-for="(item, index) in options.qrCodes"
        :key="index"
        v-if="isVertical"
        class="qrcode-content" 
        style="margin: 0; padding: 0; position: relative;"
        :style="{width: pageStyleX.width + 'mm', height: pageStyleX.height + 'mm'}"
      >
        <div 
          class="inner"
          style="position: absolute;"
          :style="{
              width: `${pageStyleX.width}mm`, 
              height: `${innerHeight}mm`,            
              textAlign: 'center',
              top: `${Math.ceil((pageStyleX.height - innerHeight) / 2)}mm`,
              }"
        >
          <img
            class="qrcode-img"
            :style="{ 
                      width: `${pageStyleX.width}mm`
                    }" 
            :src="item.url"
          >
          <div 
            class="qrcode-txt"
            :style="{
                width: `${pageStyleX.width}mm`,
                height: `${item.text ? translatePx2Mm(options.fontSize * 1.5) : 0}mm`,
                lineHeight: `${item.text ? translatePx2Mm(options.fontSize * 1.5) : 0}mm`,
                fontSize: `${translatePx2Mm(options.fontSize)}mm`, 
                marginTop: `${translatePx2Mm(options.height*4/100 + 0.5)}mm`, 
                textAlign: 'center', overflow: 'hidden', whiteSpace: 'nowrap'
                }">
            {{ item.text }}
          </div>
        </div>
      </div>

      <!-- 标签纸div 横版 -->
        <div
          v-for="(item, index) in options.qrCodes"
          :key="index"
          class="qrcode-content"
          v-if="!isVertical"
          style="margin: 0; padding: 0;position: relative;"
          :style="{width: pageStyleX.width + 'mm', height: pageStyleX.height + 'mm'}"
        >
        <div
          class="inner"
          style="display: inline-block;"
          :style="{ position: 'absolute', top: 0, 
                    left: `${((pageStyleX.width - imgHeight) / 2)}mm`
                    }"
        
        >
          <img 
            v-if="imgHeight !== 0"
            class="qrcode-img"
            :style="{ 
                      height: `${imgHeight - 1 + (item.text ? Math.floor(options.height * 0.02) : 0)}mm`,
                      left: `${(pageStyleX.width / 2)}mm`,
                      top:`${Math.ceil(pageStyleX.height * (index) * 0.032)}mm`
                    }"
            :src="item.url" 
          >
          <div class="qrcode-txt" 
            :style="{ height: `${item.text ? translatePx2Mm(options.fontSize * 1.5) + 1 : 0}mm`,
                      lineHeight: `${item.text ? translatePx2Mm(options.fontSize * 1.5) + 1 : 0}mm`,
                      width: `${(imgHeight - 1 + (item.text ? Math.floor(options.height * 0.02) : 0))}mm`,
                      fontSize: `${translatePx2Mm(options.fontSize)}mm`,
                      marginTop: `${0}mm`,
                      textAlign: 'center', overflow: 'hidden',
                      whiteSpace: 'nowrap'
                    }"
          >
            {{ item.text }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

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
  @Prop({ default: {width: 500, height: 300, fontSize: 12, qrCodes: []} }) options !: Options;

  imgHeight:number = 0;

  innerHeight:number = 0;

  marginTop:number = 0;

  // 判断是横版还是竖版
  get isVertical(){ // 是竖版
    const { width, height } = this.options
    return width < height;
  }

  // 横版
  get pageStyleX(){
    const { width, height } = this.options
    let _width = width - width * 0.05 * 2;
    let _height = height - height * 0.05 * 2;
    return {
      width: this.translatePx2Mm(_width),
      height: this.translatePx2Mm(_height)
    }
  }
  
  // mounted(){
  //   if(this.isVertical) {
  //     this.setInnerHeight();
  //   } else {
  //     this.setImgHeight();
  //   }
  // }

  calTop(index:number){
    return (this.pageStyleX.height / 2 - this.pageStyleX.width / 2) * (index + 1) + this.pageStyleX.height * index;
  }

  translatePx2Mm(px: number) {
    return Math.floor((px / 72) * 2.54 * 1000 / 100);
  }

  // 设置图片高度
  setImgHeight(){
    this.$nextTick(() => {
      const innerDomHeight:number = this.pageStyleX.height as number;
      const textDom:any = (document as any).querySelector('.qrcode-txt') as any;
      const textDomHeight:number = textDom.clientHeight as number + 1; //  +1 防止多次点击文字不显示
      let textH:number = textDomHeight;
      if (textDom && textDomHeight > 0) { // 有文字
         textH += this.options.height * 2 / 100;
         this.imgHeight = innerDomHeight - this.translatePx2Mm(textH);
         return;
      } else {
         this.imgHeight = innerDomHeight;
         return;
      }
    })
  }

  // 竖版计算盒子的高度
  setInnerHeight(){
    this.$nextTick(() => {
      setTimeout(() => {
        const imgH:any = this.pageStyleX.width;
        const textDom:any = (document as any).querySelector('.qrcode-txt') as any;
        let txtH:number = textDom.clientHeight as number;
        if(textDom && txtH > 0) {
          txtH += this.options.height*2/100;
        }
        this.innerHeight = imgH + this.translatePx2Mm(txtH);
        this.marginTop = Math.ceil(this.translatePx2Mm((this.options.height - this.innerHeight) / 2));
      }, 200);
    })
  }

  getMT(item:any){
    const textH:number = item.text ? this.options.fontSize * 1.5 : 0;
    let mt:number = 0;
    if (textH > 0) {
      mt = this.options.height*2/100;
    }
    return this.pageStyleX.width + this.translatePx2Mm(textH + mt);
  }

  @Watch('options')
  onOptionsChange(){
    if(this.isVertical) {
      this.setInnerHeight();
    } else {
      this.setImgHeight();
    }
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
        background: white;
      }
    }
  }
</style>
