<template>
  <div>
    <div
      v-for="(drawerElements,index) in pages"
      :key="index"
      :style="pageStyle"
      style="margin:0 ; padding-bottom: 1px; position: relative;">
      <div
        v-for="item in drawerElements"
        :key="item.id"
        :style="`
          left: ${item.left}px;
          top: ${item.top}px;
          display: inline-flex;
          position: absolute;
          height: ${item.heightValue}px;
       `"
      >
        <table :style="`border-spacing: 0; padding: 0; max-width: 100%; overflow: hidden;`" v-if="item.eleType.includes('column') || item.eleType.includes('text')" >
          <tr
            v-if="item.eleType.includes('column')" 
            :style="`
                min-height: ${item.heightValue}px;
                white-space: pre-wrap;`
            ">
            <td
              :style="`
                border: ${parseInt(item.leftKey.borderWidthValue, 10)}px ${item.leftKey.borderTypeValue} ${item.leftKey.borderColorValue};
                width: ${item.leftKey.widthValue}px;
                background: ${item.leftKey.fillColorValue};
                font-size: ${item.leftKey.fontSizeValue}px;
                color: ${item.leftKey.fontColorValue};
                font-weight: ${item.leftKey.fontIsWeight ? 'bold' : ''};
                font-style: ${item.leftKey.fontIsItalic ? 'italic' : ''};
                text-decoration: ${item.leftKey.fontIsUnderline ? 'underline' : ''};
                text-align: ${item.leftKey.fontLCRNeat};
                vertical-align: ${item.leftKey.fontTCBNeat};
                word-break: break-all;
                word-wrap: break-word;
              `"
            >{{ item.leftKey.innerTxt }}</td>
            <td
              :style="`
                border: ${parseInt(item.rightValue.borderWidthValue, 10)}px ${item.rightValue.borderTypeValue} ${item.rightValue.borderColorValue};
                width: ${item.rightValue.widthValue}px;
                background: ${item.rightValue.fillColorValue};
                font-size: ${item.rightValue.fontSizeValue}px;
                color: ${item.rightValue.fontColorValue};
                font-weight: ${item.rightValue.fontIsWeight ? 'bold' : ''};
                font-style: ${item.rightValue.fontIsItalic ? 'italic' : ''};
                text-decoration: ${item.rightValue.fontIsUnderline ? 'underline' : ''};
                text-align: ${item.rightValue.fontLCRNeat};
                vertical-align: ${item.rightValue.fontTCBNeat};
                word-break: break-all;
                word-wrap: break-word;
              `"
            >{{ item.rightValue.innerTxt }}</td>
          </tr>
          <tr v-if="item.eleType.includes('text')" style="white-space: pre-wrap;">
            <td
              :style="`
                border: ${parseInt(item.borderWidthValue, 10)}px ${item.borderTypeValue} ${item.borderColorValue};
                width: ${item.widthValue}px;
                min-height: ${item.heightValue}px;
                background: ${item.fillColorValue};
                font-size: ${item.fontSizeValue}px;
                color: ${item.fontColorValue};
                font-weight: ${item.fontIsWeight ? 'bold' : ''};
                font-style: ${item.fontIsItalic ? 'italic' : ''};
                text-decoration: ${item.fontIsUnderline ? 'underline' : ''};
                text-align: ${item.fontLCRNeat};
                vertical-align: ${item.fontTCBNeat};
                word-break: break-all;
                word-wrap: break-word;
              `"
            >{{ item.innerTxt }}</td>
          </tr>
        </table>
        <div v-if="item.eleType.includes('leftQrcodePic')">
          <img
            :style="`height: ${item.heightValue}px; width: ${item.widthValue}px;`"
            :src="item.picUrl"
            alt
          />
        </div>
        <div v-if="item.eleType.includes('leftBarcodePic')">
          <img
            :style="`height: ${item.heightValue}px; width: ${item.widthValue}px;`"
            :src="item.picUrl"
            alt
          />
        </div>
        <div v-if="item.eleType.includes('topPic')">
          <img
            :style="`height: ${item.heightValue}px; width: ${item.widthValue}px;`"
            :src="item.picUrl"
            alt
          />
        </div>
        <div
          v-if="item.eleType.includes('topDrawerRect')"
          :style="getRectStyleOf(item)"
        ></div>
        <div
          v-if="item.eleType.includes('topDrawerLine')"
          :style="`
            height: ${item.heightValue}px;
            width: ${item.widthValue}px;
            background: ${item.borderColorValue};
          `"
        ></div>

        <!-- <div
            v-if="item.eleType === 'sheet'"
            :class="[ item.eleType ]"
            :style="`
                height: ${item.heightValue}px;
                width: ${item.widthValue}px;
                background: ${item.bgColor};
                page-break-after:always;
                page-break-before:always;
              `"
          > -->
        <table
          v-if="item.eleType === 'sheet'"
          cellspacing="0"
          cellpadding="0"
          :class="[ item.eleType ]"
          :style="`width: ${item.widthValue}px;padding: 0;
                  border-collapse: collapse;
                  border-spacing: 0;
                  background-color:${item.backgroundColor};
                  `"
        >
          <tr
            :style="`
                height:${item.headHeight}px`">
            <td
              v-for="(col,index) in item.columns"
              :key="index"
              :style="getColStyle(col,item)"
            >{{ col.name }}</td>
          </tr>

          <tr
            v-for="(row,index) in item.value"
            :key="index"
            :style="`
                height:${item.bodyHeight}px`"
          >
            <td
              v-for="(col,colIndex) in item.columns"
              :key="colIndex"
              :style="getRowStyle(col.rowSettings,item)"
            >
              <template v-if="col.isSequence">{{ index + 1 }}</template>
              <template v-else-if="col.rowSettings.bindSource">{{ row[col.rowSettings.bindSource.code] }}</template>
            </td>
          </tr>
        </table>
        <!-- </div> -->
      </div>
    </div>
      
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Prop } from "vue-property-decorator";
// import { getPxFromMm } from "@cloudpivot/common/src/utils/utils";

import common from '@cloudpivot/common';

const { getPxFromMm } = common.utils.BusinessFunctions;

@Component({
  name: "pre-view"
})
export default class GenerateHtml extends Vue {
  // @ts-ignore
  @Prop() pages: any[][];

  @Prop({
    default: () => ({
      width: 595,
      height: 842,
      paddingX: 48,
      paddingY: 56
    })
  })
  setting!: {
    width: number;
    height: number;
    paddingX: number;
    paddingY: number;
  };

  get pageStyle() {
    // -1 防止计算多页时因为浮点精度多出一页的情况
    let widthPx = this.setting.width - this.setting.paddingX * 2;
    let heightPx = this.setting.height - this.setting.paddingY * 2;
    const width = widthPx + "px";
    const height = heightPx + "px";
    // const padding = `${this.this.setting.paddingY - 1}px ${this.
    //   this.setting.paddingX
    // }px`;
    return {
      width,
      height
    };
  }

  pxToMM(px: number) {
    return Math.floor((px / 72) * 2.54 * 1000) / 100;
  }

  getHtml() {
    const tempHTML = this.$el.innerHTML;
    return `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"/>
            <title>云枢打印-自定义模板打印</title>
            <style type="text/css">
              @page {
                size: ${this.setting.width + 1}px ${this.setting.height + 1}px;
                margin: ${this.setting.paddingY}px ${this.setting.paddingX}px;
                padding: 0;
              }

            </style>
          </head>
          <body style="font-family: Microsoft YaHei;padding 0; margin:0;">${tempHTML}</body>
        </html>
      `;
  }

  getColStyle(col: any, item: any) {
    const style = this.buildStyleOf(col);
    this.handleCellStyle(item, col, style);
    return style;
  }

  getRowStyle(col: any, item: any) {
    const style = this.buildStyleOf(col.rowSettings || col);
    this.handleCellStyle(item, col, style);
    return style;
  }

  
  getRectStyleOf(item : any){
    const style : any = {
      height: `${item.heightValue}px`,
      width: `${item.widthValue}px`,
      background: `${item.fillColorValue}`,
    };

    if(item.borders){

      const bs = `${item.borderWidthValue}px solid ${item.borderColorValue}`;

      if(item.borders.left){
        style['border-left'] = bs;
      }
      if(item.borders.top){
        style['border-top'] = bs;
      }
      if(item.borders.bottom){
        style['border-bottom'] = bs;
      }
      if(item.borders.right){
        style['border-right'] = bs;
      }
    }

    return style;
  }
  
    handleCellStyle(item: any,col: any, style: any) {
        style.width = `${col.widthValue}px`;
        style.width = `${col.widthValue}px`;
    style.border = `${parseInt(item.borderWidth, 10)}px solid ${item.borderColor}`;
        return style;
    }

  buildStyleOf(settings: any) {
    const style: any = {
      "font-size": `${settings.fontSize}px`,
      "text-align": settings.horizontalAlign,
      "vertical-align": settings.verticalAlign,
      "word-break": "break-all",
      "word-wrap": "break-word",
      // height
    };

    if (settings.fontItalic) {
      style["font-style"] = "italic";
    }

    if (settings.fontBold) {
      style["font-weight"] = "bold";
    }

    if (settings.fontUnderline) {
      style["text-decoration"] = "underline";
    }

    if (settings.fontColor) {
      style["color"] = settings.fontColor;
    }

    if (settings.backgroundColor) {
      style["background-color"] = settings.backgroundColor;
    }

    return style;
  }
}
</script>
