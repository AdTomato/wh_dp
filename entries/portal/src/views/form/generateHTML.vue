<template>
  <div>
    <section class="content padding-20mm" v-for="(drawerElements,index) in pages" :key="index">
      <div class="header" :class="headerFooter.header.align">
        <!-- <span v-if="headerFooter.header.pagenum">{{ index + 1}}</span>
        <span v-if="headerFooter.header.pagenum&&headerFooter.header.total ">/</span>
        <span v-if="headerFooter.header.total ">{{ pages.length }}</span>
        <span style="padding-left:15px" v-if="headerFooter.header.date">{{headerFooter.date}}</span>
        <span style="padding-left:15px" v-if="headerFooter.header.time">{{headerFooter.time}}</span> -->
      </div>
      <div
        style="position: absolute;"
        :style="{marginLeft:(pageSettings._pagemargin.LeftTomm+3)+'mm',marginRight:(pageSettings._pagemargin.RightTomm)+'mm', marginTop:(pageSettings._pagemargin.UpTomm)+'mm', marginBottom:(pageSettings._pagemargin.DownTomm)+'mm'}"
      >
        <div
          v-for="item in drawerElements"
          :key="item.id"
          :style="`
        left: ${pxToMM(item.left)}mm;
        top: ${pxToMM(item.top)}mm;
        display: inline-flex;
        position: absolute;
        height: ${pxToMM(item.heightValue)}mm;
      `"
        >
          <table
            :style="`border-spacing: 0; padding: 0; max-width: 100%; overflow: hidden;height: ${pxToMM(item.heightValue)}mm;`"
          >
            <tr
              v-if="item.eleType.includes('column')"
              :style="`
            min-height: ${pxToMM(item.heightValue)}mm;
            white-space: pre-wrap;
            `"
            >
              <td
                :style="`
              border: ${pxToMM(parseInt(item.leftKey.borderWidthValue, 10))}mm ${item.leftKey.borderTypeValue} ${item.leftKey.borderColorValue};
              background: ${item.leftKey.fillColorValue};
              font-size: ${pxToMM(item.leftKey.fontSizeValue)}mm;
              color: ${item.leftKey.fontColorValue};
              font-weight: ${item.leftKey.fontIsWeight ? 'bold' : ''};
              font-style: ${item.leftKey.fontIsItalic ? 'italic' : ''};
              text-decoration: ${item.leftKey.fontIsUnderline ? 'underline' : ''};
              text-align: ${item.leftKey.fontLCRNeat};
              vertical-align: ${item.leftKey.fontTCBNeat};
              word-break: break-all;
              word-wrap: break-word;
            `"
              >
                <!-- 解决换行没对齐问题 td中加div,把td中的width移至div中 -->
                <div
                  :style="`
                width: ${pxToMM(item.leftKey.widthValue)}mm;
              `"
                >{{ item.leftKey.innerTxt }}</div>
              </td>
              <td
                :style="`
              border: ${pxToMM(parseInt(item.rightValue.borderWidthValue, 10))}mm ${item.rightValue.borderTypeValue} ${item.rightValue.borderColorValue};
              background: ${item.rightValue.fillColorValue};
              font-size: ${pxToMM(item.rightValue.fontSizeValue)}mm;
              color: ${item.rightValue.fontColorValue};
              font-weight: ${item.rightValue.fontIsWeight ? 'bold' : ''};
              font-style: ${item.rightValue.fontIsItalic ? 'italic' : ''};
              text-decoration: ${item.rightValue.fontIsUnderline ? 'underline' : ''};
              text-align: ${item.rightValue.fontLCRNeat};
              vertical-align: ${item.rightValue.fontTCBNeat};
              word-break: break-all;
              word-wrap: break-word;
            `"
              >
                <div
                  :style="`
                width: ${pxToMM(item.rightValue.widthValue)}mm;
              `"
                >
                  <img
                    v-if="item.picUrl"
                    :style="`height: ${pxToMM(item.heightValue)}mm; width: ${pxToMM(item.rightValue.widthValue)}mm;`"
                    :src="item.picUrl"
                    alt
                  />
                  <template
                    v-else
                  >{{ item.rightValue.innerTxt.includes('${')?'':item.rightValue.innerTxt }}</template>
                </div>
              </td>
            </tr>
            <tr v-if="item.eleType.includes('text')" style="white-space: pre-wrap;">
              <td
                :style="`
              border: ${parseInt(item.borderWidthValue, 10)}mm ${item.borderTypeValue} ${item.borderColorValue};
              min-height: ${pxToMM(item.heightValue)}mm;
              background: ${item.fillColorValue};
              font-size: ${pxToMM(item.fontSizeValue)}mm;
              color: ${item.fontColorValue};
              font-weight: ${item.fontIsWeight ? 'bold' : ''};
              font-style: ${item.fontIsItalic ? 'italic' : ''};
              text-decoration: ${item.fontIsUnderline ? 'underline' : ''};
              text-align: ${item.fontLCRNeat};
              vertical-align: ${item.fontTCBNeat};
              word-break: break-all;
              word-wrap: break-word;
            `"
              >
                <div
                  :style="`
                width: ${pxToMM(item.widthValue)}mm;
              `"
                >
                  <img
                    v-if="item.picUrl"
                    :style="`height: ${pxToMM(item.heightValue)}mm; width: ${pxToMM(item.widthValue)}mm;`"
                    :src="item.picUrl"
                    alt
                  />
                  <template v-else>{{ item.innerTxt }}</template>
                </div>
              </td>
            </tr>
          </table>
          <div v-if="item.eleType.includes('leftQrcodePic')">
            <img
              :style="`height: ${pxToMM(item.heightValue)}mm; width: ${pxToMM(item.widthValue)}mm;`"
              :src="item.picUrl"
              alt
            />
          </div>
          <div v-if="item.eleType.includes('leftBarcodePic')">
            <img
              :style="`height: ${pxToMM(item.heightValue)}mm; width: ${pxToMM(item.widthValue)}mm;`"
              :src="item.picUrl"
              alt
            />
          </div>
          <div v-if="item.eleType.includes('topPic')">
            <img
              :style="`height: ${pxToMM(item.heightValue)}mm; width: ${pxToMM(item.widthValue)}mm;`"
              :src="item.picUrl"
              alt
            />
          </div>
          <div v-if="item.eleType.includes('topDrawerRect')" :style="getRectStyleOf(item)"></div>
          <div
            v-if="item.eleType.includes('topDrawerLine')"
            :style="`
          height: ${pxToMM(item.heightValue)}mm;
          width: ${pxToMM(item.widthValue)}mm;
          background: ${item.borderColorValue};
        `"
          ></div>
          <table
            v-if="item.eleType === 'sheet'"
            cellspacing="0"
            cellpadding="0"
            :class="[ item.eleType ]"
            :style="`width: ${pxToMM(item.widthValue)}mm;padding: 0;
              border-collapse: collapse;
              border-spacing: 0;
              background-color:${item.backgroundColor};
              `"
          >
            <tr :style="`
            height:${pxToMM(item.headHeight)}mm`">
              <td
                v-for="(col,index) in item.columns"
                :key="index"
                :style="getColStyle(col,item)"
              >{{ col.name }}</td>
            </tr>

            <tr
              v-for="(row,index) in item.value"
              :key="index"
            >
              <td
                v-for="(col,colIndex) in item.columns"
                :key="colIndex"
                :style="getRowStyle(col.rowSettings,item)"
                :class="{'picleft':col.name==='图片'}"
              >
                <template v-if="col.isSequence">{{ index + 1 }}</template>
                <template
                  v-else-if="col.rowSettings.bindSource&&col.rowSettings.bindSource.code.indexOf('Attachment')===-1"
                >{{ row[col.rowSettings.bindSource.code] }}</template>

                <template
                  v-else-if="col.rowSettings.bindSource&&col.rowSettings.bindSource.code.indexOf('Attachment')!==-1"
                >
                  <img
                    v-for="(pic,index) in row.sheetImgs"
                    :key="index"
                    :src="pic.url"
                    class="sheetImg"
                    :style="{width:`${(pxToMM(item.columns[colIndex].widthValue)-10)/2}mm`
                  }"
                  />
                </template>
              </td>
            </tr>
          </table>
        </div>
      </div>

      <div class="footer" :class="headerFooter.footer.align">
        <!-- <span v-if="headerFooter.footer.pagenum">{{ index + 1}}</span>
        <span v-if="headerFooter.footer.pagenum&&headerFooter.footer.total">/</span>
        <span v-if="headerFooter.footer.total">{{ pages.length }}</span>
        <span style="padding-left:15px" v-if="headerFooter.footer.date">{{headerFooter.date}}</span>
        <span style="padding-left:15px" v-if="headerFooter.footer.time">{{headerFooter.time}}</span> -->
      </div>
    </section>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Prop } from "vue-property-decorator";
// import { getPxFromMm } from "@cloudpivot/common/src/utils/utils";
import common from "@cloudpivot/common";
import dateFormat from "@cloudpivot/common/src/utils/date";
import { renderer, schema } from "@cloudpivot/form";

const { getPxFromMm } = common.utils.BusinessFunctions;

@Component({
  name: "pre-view"
})
export default class GenerateHtml extends Vue {
  // @ts-ignore
  @Prop() pages: any[][];
  @Prop() formdata: any;

  @Prop({
    default: () => ({
      width: 210,
      height: 296,
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
  pageSettings: any = {
    eleType: "pageSettings",
    direction: 1,
    _papersize: {
      id: 1,
      scale: "A4",
      widthTomm: 210,
      heightTomm: 297,
      widthTopx: "595",
      heightTopx: "842"
    },
    _pagemargin: {
      UpTomm: 20,
      DownTomm: 20,
      LeftTomm: 17,
      RightTomm: 17,
      UpTopx: 57,
      DownTopx: 57,
      LeftTopx: 48,
      RightTopx: 48
    },
    _headerfooter: {
      header: {
        marginTopTomm: 10,
        marginTopTopx: 28,
        align: "",
        items: { key: [], value: [] }
      },
      footer: {
        marginTopTomm: 10,
        marginTopTopx: 28,
        align: "",
        items: { key: [], value: [] }
      }
    },
    bgImg: {
      uid: "",
      name: "",
      status: "",
      url: ""
    },
    isPrintBgImg: false
  };
  sheetImgs: any[] = [];
  sheetRows: Number = 0;

  pageStyle() {
    let width: string = 210 + `mm`;
    let height: string = 296 + `mm`;
    this.pages.map((item: any) => {
      item.forEach((m: any) => {
        if (m.eleType === "pageSettings") {
          this.setting.width = m._papersize.widthTomm;
          this.setting.height = m._papersize.heightTomm - 16;
          this.setting.paddingX =
            m._pagemargin.LeftTomm + m._pagemargin.RightTomm;
          this.setting.paddingY = m._pagemargin.UpTomm + m._pagemargin.DownTomm;
          width = m._papersize.widthTomm + `mm`;
          height = m._papersize.heightTomm + `mm`;
          this.pageSettings = m;
          // 拼接背景图片url
          if (m.bgImg.uid !== "") {
            const file: renderer.H3File = {
              name: m.bgImg.name,
              refId: m.bgImg.uid,
              fileExtension: "",
              mimeType: "",
              storageMethod: ""
            };
            this.pageSettings.bgImg.url = renderer.UploadControl.service.getDownloadUrl(
              file
            );
          }
          m.isPrintBgImg === false
            ? (this.pageSettings.bgImg.url = "")
            : (this.pageSettings.bgImg.url = m.bgImg.url);
        }
        // 获取子表图片详细信息
        else if (m.eleType === "sheet") {
          const sheetKey: string = m.code;
          const sheetData: [] = this.formdata.bizObject.data[sheetKey];
          if (m.value) {
            m.value.map((cel: any, index: number) => {
              this.sheetImgs = [];
              let tempArry: [] = [];
              const tempItem: object = sheetData[index];
              for (let key in tempItem) {
                if (Array.isArray(tempItem[key])) {
                  tempArry = tempItem[key];
                  tempArry.map((data: any) => {
                    if (data.response) {
                      data.response.data.url = renderer.UploadControl.service.getDownloadUrl(
                        data.response.data
                      );
                      this.sheetImgs.push(data.response.data);
                    }
                  });
                }
              }
              this.sheetRows = Math.ceil(this.sheetImgs.length / 2);

              cel.sheetImgs = this.sheetImgs;
              cel.sheetRows = this.sheetRows;
            });
          }
        }
      });
    });
    return {
      width,
      height
    };
  }

  get headerFooter() {
    return this.getHeaderFooter();
  }

  getHeaderFooter() {
    this.pageStyle();
    const Dates = new Date();
    const headerFooter = {
      date: "",
      time: "",
      header: {},
      footer: {}
    };
    const ss = dateFormat.dateFormat(Dates, "YYYY-MM-DD HH:mm:ss");
    headerFooter.date = ss.split(" ")[0];
    headerFooter.time = ss.split(" ")[1];
    if (this.pageSettings !== null) {
      headerFooter.header = this.fillData(
        this.pageSettings._headerfooter.header
      );
      headerFooter.footer = this.fillData(
        this.pageSettings._headerfooter.footer
      );
    }
    return headerFooter;
  }
  fillData(data: any) {
    let temp = {
      align: "",
      marginTopTopx: 0,
      pagenum: false,
      total: false,
      date: false,
      time: false
    };

    temp.marginTopTopx = data.marginTopTopx;
    temp.align = data.align;
    data.items.key.forEach((m: any) => {
      switch (m) {
        case "PageNum":
          temp.pagenum = true;
          break;
        case "Total":
          temp.total = true;
          break;
        case "Date":
          temp.date = true;
          break;
        case "Time":
          temp.time = true;
          break;
      }
    });
    return temp;
  }

  pxToMM(px: number) {
    return Math.floor((px / 72) * 2.54 * 1000000) / 100000;
  }

  getHtml() {
    const tempHTML = this.$el.innerHTML;
    const htmlStr = `
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html lang="en" xmlns="http://www.w3.org/1999/xhtml">
          <head>
            <meta charset="UTF-8"/>
            <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no, width=device-width"/>
            <title>云枢打印-自定义模板打印</title>
            <style type="text/css">
             @page { margin: 0 ;size: ${this.setting.width}mm ${this.setting.height}mm;}
             @media print {
                 body { 
                    width: ${this.setting.width}mm;
                    height:${this.setting.height}mm;
                    background-size: cover;
                    background-repeat: no-repeat;
                    background-image:url(${this.pageSettings.bgImg.url})
                 }
                }

              @media screen {
              body { background: #e0e0e0 }
              .content {
                  background: white;
                  box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
                  margin: 5mm auto;
                }
              }
                .picleft{
                   text-align: left !important;
                }
                section{
                  width: ${this.setting.width}mm;
                  height:${this.setting.height}mm;
                  page-break-before: auto;          
                  page-break-after: always; 
                  background-size: cover;
                  background-repeat: no-repeat;
                  background-image:url(${this.pageSettings.bgImg.url}) !important;
                }
            </style>
          </head>
          <body class="A4" style="font-family: Microsoft YaHei">${tempHTML}</body>
        </html>
      `;
    return htmlStr;
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

  getRectStyleOf(item: any) {
    const style: any = {
      height: `${this.pxToMM(item.heightValue)}mm`,
      width: `${this.pxToMM(item.widthValue)}mm`,
      background: `${item.fillColorValue}`
    };

    if (item.borders) {
      const bs = `${this.pxToMM(item.borderWidthValue)}mm solid ${
        item.borderColorValue
      }`;

      if (item.borders.left) {
        style["border-left"] = bs;
      }
      if (item.borders.top) {
        style["border-top"] = bs;
      }
      if (item.borders.bottom) {
        style["border-bottom"] = bs;
      }
      if (item.borders.right) {
        style["border-right"] = bs;
      }
    }

    return style;
  }

  handleCellStyle(item: any, col: any, style: any) {
    style.width = `${col.widthValue}px`;
    style.width = `${this.pxToMM(col.widthValue)}mm`;
    style.border = `${this.pxToMM(parseInt(item.borderWidth, 10))}mm solid ${
      item.borderColor
    }`;
    return style;
  }

  buildStyleOf(settings: any) {
    const style: any = {
      "font-size": `${this.pxToMM(settings.fontSize)}mm`,
      "text-align": settings.horizontalAlign,
      "vertical-align": settings.verticalAlign,
      "word-break": "break-all",
      "word-wrap": "break-word"
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
