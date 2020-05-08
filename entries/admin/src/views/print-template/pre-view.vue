<template>
  <div class="A4 main" :style="{height:hh}">
    <section
      class="shet draw-container drag-over"
      v-for="(drawerElements,index) in pages"
      :key="index"
      :style="{
        height: paperSize._papersize.heightTopx+'px',
        width:paperSize._papersize.widthTopx+'px',
        paddingTop:paperSize._pagemargin.UpTopx+'px',
        paddingBottom:(paperSize._pagemargin.DownTopx+40)+'px',
          paddingLeft:paperSize._pagemargin.LeftTopx+'px',
         paddingRight:paperSize._pagemargin.RightTopx+'px',
        }"
    >
      <div
        class="header"
        :class="headerFooter.header.align"
        :style="{width:paperSize._papersize.widthTopx+'px',
        top:headerFooter.header.marginTopTopx+17+'px',
        marginLeft:(-paperSize._pagemargin.LeftTopx)+'px'
        }"
      >
        <div>
          <span v-if="headerFooter.header.pagenum">{{ index + 1}}</span>
          <span v-if="headerFooter.header.pagenum&&headerFooter.header.total">/</span>
          <span v-if="headerFooter.header.total">{{ pageTotal }}</span>
          <span class="pl-10" v-if="headerFooter.header.date">{{headerFooter.date}}</span>
          <span class="pl-10" v-if="headerFooter.header.time">{{headerFooter.time}}</span>
        </div>
      </div>

      <!-- Write HTML just like a web page -->
      <article>
        <div class="both-div flex-justify-between">
          <div class="item-div">
            <div class="top-left"></div>
          </div>
          <div class="item-div">
            <div class="top-right"></div>
          </div>
        </div>
        <div
          :style="{
          backgroundImage:paperSize.isPrintBgImg?'url('+bgImgUrl+')':''}"
          class="main-body"
        >
          <div>
            <div
              class="div-style"
              v-for="item in drawerElements"
              :key="item.id"
              :style="`left: ${item.left}px;top: ${item.top}px;`"
            >
              <table style="padding: 0; border-spacing: 0;">
                <tr
                  v-if="item.eleType.includes('column')"
                  :style="`height: ${item.heightValue}px;`"
                >
                  <td
                    :style="`
                  border: ${item.leftKey.borderWidthValue}px ${item.leftKey.borderTypeValue} ${item.leftKey.borderColorValue};
                  width: ${item.leftKey.widthValue}px;
                  background: ${item.leftKey.fillColorValue};
                  font-size: ${item.leftKey.fontSizeValue}px;
                  color: ${item.leftKey.fontColorValue};
                  text-align: ${item.leftKey.fontLCRNeat};
                  font-weight: ${item.leftKey.fontIsWeight ? 'bold' : ''};
                  font-style: ${item.leftKey.fontIsItalic ? 'italic' : ''};
                  text-decoration: ${item.leftKey.fontIsUnderline ? 'underline' : ''};
                  vertical-align: ${item.leftKey.fontTCBNeat};
                `"
                  >{{ item.leftKey.innerTxt }}</td>
                  <td
                    :style="`
                  border: ${item.rightValue.borderWidthValue}px ${item.rightValue.borderTypeValue} ${item.rightValue.borderColorValue};
                  width: ${item.rightValue.widthValue}px;
                  background: ${item.rightValue.fillColorValue};
                  font-size: ${item.rightValue.fontSizeValue}px;
                  color: ${item.rightValue.fontColorValue};
                  text-align: ${item.rightValue.fontLCRNeat};
                  font-weight: ${item.rightValue.fontIsWeight ? 'bold' : ''};
                  font-style: ${item.rightValue.fontIsItalic ? 'italic' : ''};
                  text-decoration: ${item.rightValue.fontIsUnderline ? 'underline' : ''};
                  vertical-align: ${item.rightValue.fontTCBNeat};
                `"
                  >{{ item.rightValue.innerTxt }}</td>
                </tr>
                <tr
                  v-if="item.eleType.includes('text')"
                  :style="`
                height: ${item.heightValue}px;
                vertical-align: ${item.fontTCBNeat};
                border: ${item.borderWidthValue}px ${item.borderTypeValue} ${item.borderColorValue};
                width: ${item.widthValue}px;
                background: ${item.fillColorValue};
                font-size: ${item.fontSizeValue}px;
                color: ${item.fontColorValue};
                text-align: ${item.fontLCRNeat};
                font-weight: ${item.fontIsWeight ? 'bold' : ''};
                font-style: ${item.fontIsItalic ? 'italic' : ''};
                text-decoration: ${item.fontIsUnderline ? 'underline' : ''};
              `"
                >
                  <td
                    :style="`
                  border: ${item.borderWidthValue}px ${item.borderTypeValue} ${item.borderColorValue};
                  width: ${item.widthValue}px;
                `"
                  >{{ item.innerTxt }}</td>
                </tr>
              </table>
              <div
                class="code-and-pic"
                v-if="item.eleType.includes('leftQrcodePic')"
                :style="`height: ${item.heightValue}px; width: ${item.widthValue}px;`"
              >
                <img style="width: 100%; height: 100%;" :src="item.picUrl || imgObj.qr_code" alt />
              </div>
              <div
                class="code-and-pic"
                v-if="item.eleType.includes('leftBarcodePic')"
                :style="`height: ${item.heightValue}px; width: ${item.widthValue}px;`"
              >
                <img style="width: 100%; height: 100%;" :src="item.picUrl || imgObj.bar_code" alt />
              </div>
              <div
                class="code-and-pic"
                v-if="item.eleType.includes('topPic')"
                :style="`height: ${item.heightValue}px; width: ${item.widthValue}px;`"
              >
                <img style="width: 100%; height: 100%;" :src="item.picUrl || imgObj.pic_img" alt />
              </div>
              <div
                class="code-and-pic"
                v-if="item.eleType.includes('topDrawerRect')"
                :style="getRectStyleOf(item)"
              ></div>
              <div
                class="code-and-pic"
                v-if="item.eleType.includes('topDrawerLine')"
                :style="`
              height: ${item.heightValue}px;
              width: ${item.widthValue}px;
              background: ${item.borderColorValue};
            `"
              ></div>

              <div
                v-if="item.eleType === 'sheet'"
                :class="[ item.eleType ]"
                :style="`
                height: ${item.heightValue}px;
                 max-width: ${item.widthValue}px;
                background: ${item.bgColor};
              `"
              >
                <table>
                  <thead>
                    <tr :style="`height:${item.headHeight}px`">
                      <td
                        v-for="col in item.columns"
                        :key="col.id"
                        :style="getColStyle(col,item)"
                      >{{ col.name }}</td>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        v-for="col in item.columns"
                        :key="col.id"
                        :style="getRowStyle(col,item)"
                      >{{ col.name }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div class="both-div flex-justify-between">
          <div class="item-div">
            <div class="bottom-left"></div>
          </div>
          <div class="item-div">
            <div class="bottom-right"></div>
          </div>
        </div>
      </article>
      <div
        class="footer"
        :class="headerFooter.footer.align"
        :style="{
        width:paperSize._papersize.widthTopx+'px',
        marginTop:(paperSize._pagemargin.DownTopx+17)+'px',
         marginLeft:(-paperSize._pagemargin.LeftTopx)+'px'
        }"
      >
        <div>
          <span v-if="headerFooter.footer.pagenum">{{ index + 1}}</span>
          <span v-if="headerFooter.footer.pagenum&&headerFooter.footer.total">/</span>
          <span v-if="headerFooter.footer.total">{{ pageTotal }}</span>
          <span class="pl-10" v-if="headerFooter.footer.date">{{headerFooter.date}}</span>
          <span class="pl-10" v-if="headerFooter.footer.time">{{headerFooter.time}}</span>
        </div>
      </div>
    </section>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";

import { SheetColumn, PrintNodeSettings } from "@/config/print/dataStructure";
import * as settingHelper from "./center-panel/settings-helper";

import dateFormat from "@cloudpivot/common/src/utils/date";
import { renderer, schema } from "@cloudpivot/form";
import { State, Action, Getter, Mutation, namespace } from "vuex-class";
@Component({
  name: "pre-view"
})
export default class PreView extends Vue {
  @Getter("getPageSettingData", { namespace: "Print/Print" })
  getPageSettingData: any;
  pageTotal: number = 0;
  imgObj: object = {
    qr_code: require("@/assets/images/qrcode.png"),
    bar_code: require("@/assets/images/barcode.png"),
    pic_img: require("@/assets/images/pic.png")
  };
  pageSettingData: any;
  pages: object[] = [];

  mainHeight: string = `800px`;
  getHeight() {
    this.mainHeight = Math.abs(window.innerHeight - 100) + "px";
    return this.mainHeight;
  }
  get hh() {
    return this.getHeight();
  }
  mounted() {
    window.onresize = () => {
      this.getHeight();
    };
  }

  getPagesize() {
    const storeData: object | null = this.getPageSettingData(
      this.$route.params.bizSchemaCode
    );
    if (storeData) {
      this.pageSettingData = storeData;
    }
    return this.pageSettingData;
  }

  get paperSize() {
    return this.getPagesize();
  }

  getBgImgUrl() {
    // 处理图片
    if (this.pageSettingData.bgImg.uid !== "") {
      const file: renderer.H3File = {
        name: this.pageSettingData.bgImg.name,
        refId: this.pageSettingData.bgImg.uid,
        fileExtension: "",
        mimeType: "",
        storageMethod: ""
      };
      return renderer.UploadControl.service.getDownloadUrl(file);
    }
  }
  get bgImgUrl() {
    return this.getBgImgUrl();
  }

  getHeaderFooter() {
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
    headerFooter.header = this.fillData(
      this.pageSettingData._headerfooter.header
    );
    headerFooter.footer = this.fillData(
      this.pageSettingData._headerfooter.footer
    );

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
  get headerFooter() {
    return this.getHeaderFooter();
  }
  created() {
    // @ts-ignore
    this.pages = JSON.parse(localStorage.getItem("print_pages"));

    this.pageSettingData = settingHelper.getDefaultSettings();
    this.pageTotal = this.pages.length;
    let settingData: object[] = this.pages[0] as [];
    settingData.forEach((item: any, index: number) => {
      if (item.eleType === "pageSettings") {
        this.pageSettingData = item;
      }
    });
  }

  getColStyle(col: any, item: any) {
    const style = PrintNodeSettings.buildStyleOf(col);
    style.width = `${col.widthValue}px`;
    style.border = `${item.borderWidth}px ${item.borderColor} solid`;
    return style;
  }

  getRowStyle(col: any, item: any) {
    const style = PrintNodeSettings.buildStyleOf(col.rowSettings || col);
    style.width = `${col.widthValue}px`;
    style.border = `${item.borderWidth}px ${item.borderColor} solid`;
    return style;
  }

  getRectStyleOf(item: any) {
    const style: any = {
      height: `${item.heightValue}px`,
      width: `${item.widthValue}px`,
      background: `${item.fillColorValue}`
    };

    if (item.borders) {
      const bs = `${item.borderWidthValue}px solid ${item.borderColorValue}`;

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
}
</script>
<style lang="less" scoped>
.main {
  overflow: auto;
  width: 100%;
  position: absolute;
}
.shet {
  border: 1px solid #e5e5e5;
}
/** Padding area **/
.shet.padding-10mm {
  padding: 10mm;
}
.shet.padding-15mm {
  padding: 15mm;
}
.shet.padding-20mm {
  padding: 20mm;
}
.shet.padding-25mm {
  padding: 25mm;
}
@media screen {
  body {
    background: #e0e0e0;
  }
  .shet {
    background: white;
    box-shadow: 0 0.5mm 2mm rgba(0, 0, 0, 0.3);
    margin: 5mm auto;
  }
}
.both-div {
  .item-div {
    div {
      width: 15px;
      height: 20px;
      &.top-left {
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        border-right: 1px solid rgba(0, 0, 0, 0.25);
      }
      &.top-right {
        border-bottom: 1px solid rgba(0, 0, 0, 0.25);
        border-left: 1px solid rgba(0, 0, 0, 0.25);
      }
      &.bottom-left {
        border-top: 1px solid rgba(0, 0, 0, 0.25);
        border-right: 1px solid rgba(0, 0, 0, 0.25);
      }
      &.bottom-right {
        border-top: 1px solid rgba(0, 0, 0, 0.25);
        border-left: 1px solid rgba(0, 0, 0, 0.25);
      }
    }
  }
}
.drag-over {
  background: #c1c1c1;
  transition: all 0.3s;
  border: none;
  .main-body {
    background: #fff;
  }
}
.main-body {
  margin-left: 4mm;
  margin-right: 4mm;
  height: 100%;
}

.main-body {
  flex-grow: 1;
  margin: 0 14px;
  position: relative;
  background-repeat: no-repeat;
  background-size: cover;
  .div-style {
    display: inline-flex;
    position: absolute;
    text-wrap: normal;

    .code-and-pic,
    .text-div,
    .two-text-div-one,
    .react-and-line {
      word-break: break-word;
      cursor: move;
    }
    .line:hover {
      background: rgb(233, 193, 9) !important;
    }
    .two-text-div {
      display: inline-flex;
    }
  }
}

.header {
  padding-left: 5mm;
  padding-right: 5mm;
  position: absolute;
}

.footer {
  position: absolute;
  padding-left: 5mm;
  padding-right: 10mm;
}
.pl-10 {
  padding-left: 10px;
}
.Left {
  text-align: left;
}
.Center {
  text-align: center;
}
.Right {
  text-align: right;
}
.sheet > table {
  width: 100%;
  height: 100%;
  margin-top: -30px;
  border: 1px solid @border-color;
  border-collapse: collapse;
  border-spacing: 0;

  td {
    border: 1px solid @border-color;
  }
}
article {
  height: 100%;
}
</style>