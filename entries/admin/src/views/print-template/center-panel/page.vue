<template>
  <div
    class="draw-container"
    :style="{width:pageSettingData._papersize.widthTopx+'px',height: pageSettingData._papersize.heightTopx+'px'}"
    :class="{ focus : selected, grid: showGrid }"
    :tabindex="index"
    @click.stop="onPageClick"
    @keyup.46="deleteTheCheck('')"
    @keyup.ctrl.86="onPaste"
    @keyup.ctrl.67="onCopy"
  >
    <div
      class="header"
      :class="headerFooter.header.align"
      :style="{top:pageSettingData._headerfooter.header.marginTopTopx+'px'}"
    >
      <div>
        <span v-if="headerFooter.header.pagenum">{{ index + 1}}</span>
        <span v-if="headerFooter.header.pagenum&&headerFooter.header.total">/</span>
        <span v-if="headerFooter.header.total">{{ pageTotal }}</span>
        <span class="pl-10" v-if="headerFooter.header.date">{{headerFooter.date}}</span>
        <span class="pl-10" v-if="headerFooter.header.time">{{headerFooter.time}}</span>
      </div>
    </div>
    <div
      class="drawer"
      :class="{ 'drag-over' : dragover }"
      :style="{
        paddingTop:pageSettingData._pagemargin.UpTopx+'px',
        paddingBottom:pageSettingData._pagemargin.DownTopx+'px',
         paddingLeft:pageSettingData._pagemargin.LeftTopx+'px',
         paddingRight:pageSettingData._pagemargin.RightTopx+'px'
        }"
    >
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
         backgroundImage:'url(' + bgImgUrl + ')'}"
        class="main-body"
        @dragover="dragMove($event, true)"
        @dragleave="dragMove($event, false)"
        @drop="dropItem($event)"
        @mousedown="onMousedown"
      >
        <main-drawer
          ref="drawer"
          :drawerElements="drawerElements"
          :page="index"
          :pageSettingData="pageSettingData"
          @innerMove="moveInnerItem"
          @keyBordDelete="deleteTheCheck"
          @select="onSelect"
        />

        <divider
          v-for="(divider,index) in dividers"
          :key="index"
          :x="divider.x"
          :y="divider.y"
          :size="divider.size"
          :vertical="divider.vertical"
        ></divider>

        <div class="rect" @mousedown="onRectDown"></div>
      </div>
      <div class="both-div flex-justify-between">
        <div class="item-div">
          <div class="bottom-left"></div>
        </div>
        <div class="item-div">
          <div class="bottom-right"></div>
        </div>
      </div>
      <!-- <div class="page-number">{{ index + 1}}/{{ pageTotal }}</div> -->
    </div>
    <div
      class="footer"
      :class="headerFooter.footer.align"
      :style="{top:-pageSettingData._headerfooter.footer.marginTopTopx-20 +'px'}"
    >
      <div>
        <span v-if="headerFooter.footer.pagenum">{{ index + 1}}</span>
        <span v-if="headerFooter.footer.pagenum&&headerFooter.footer.total">/</span>
        <span v-if="headerFooter.footer.total">{{ pageTotal }}</span>
        <span class="pl-10" v-if="headerFooter.footer.date">{{headerFooter.date}}</span>
        <span class="pl-10" v-if="headerFooter.footer.time">{{headerFooter.time}}</span>
      </div>
    </div>
    <!-- <div
      class="footer"
      :style="{top:(pageSettingData._papersize.heightTopx-pageSettingData._headerfooter.footer.marginTopTopx-20)+'px'}"
    >
      <div class="ant-col-8 left">
        <div v-if="headerFooter.footer.align==='Left'">
          <span v-if="headerFooter.footer.pagenum">{{ index + 1}}</span>
          <span v-if="headerFooter.footer.pagenum&&headerFooter.footer.total">/</span>
          <span v-if="headerFooter.footer.total">{{ pageTotal }}</span>
          <span class="pl-10" v-if="headerFooter.footer.date">{{headerFooter.date}}</span>
          <span class="pl-10" v-if="headerFooter.footer.time">{{headerFooter.time}}</span>
        </div>
      </div>
      <div class="ant-col-8 center">
        <div v-if="headerFooter.footer.align==='Center'">
          <span v-if="headerFooter.footer.pagenum">{{ index + 1}}</span>
          <span v-if="headerFooter.footer.pagenum&&headerFooter.footer.total">/</span>
          <span v-if="headerFooter.footer.total">{{ pageTotal }}</span>
          <span class="pl-10" v-if="headerFooter.footer.date">{{headerFooter.date}}</span>
          <span class="pl-10" v-if="headerFooter.footer.time">{{headerFooter.time}}</span>
        </div>
      </div>
      <div class="ant-col-8 right">
        <div v-if="headerFooter.footer.align==='Right'">
          <span v-if="headerFooter.footer.pagenum">{{ index + 1}}</span>
          <span v-if="headerFooter.footer.pagenum&&headerFooter.footer.total">/</span>
          <span v-if="headerFooter.footer.total">{{ pageTotal }}</span>
          <span class="pl-10" v-if="headerFooter.footer.date">{{headerFooter.date}}</span>
          <span class="pl-10" v-if="headerFooter.footer.time">{{headerFooter.time}}</span>
        </div>
      </div>
    </div>-->
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Watch, Prop, Inject } from "vue-property-decorator";
// eslint-disable-next-line
import { namespace } from "vuex-class";
// eslint-disable-next-line

import { renderer, schema } from "@cloudpivot/form";

import {
  leftSide,
  rightSide,
  CreateOneItem,
  CreatPic,
  RectLine,
  Sheet,
  SheetColumn
} from "@/config/print/dataStructure";
import {
  guid,
  getOffsetTop,
  mouseBounds,
  calcPositon,
  getOffsetLeft,
  forRightPosition
} from "@/utils/print-util";

import mainDrawer from "./main-drawer.vue";
import Divider from "./divider.vue";
import dateFormat from "@cloudpivot/common/src/utils/date";

interface DividerLike {
  x: number;
  y: number;
  size: number;
  vertical: boolean;
}

interface RectLike {
  left: number;

  top: number;

  right: number;

  bottom: number;
}

interface Point {
  x: number;

  y: number;
}

// 默认画布大小
enum drawContainerSize {
  width = 595,
  height = 842
}

interface pageStyle {
  _drawContainerSize: {
    width: string;
    height: string;
  };
}

const PrintVuex = namespace("Print/Print");
@Component({
  name: "print-page",
  components: {
    mainDrawer,
    Divider
  }
})
export default class PrintPage extends Vue {
  @Prop({ type: String }) providerId!: string;

  @Prop({
    default: () => []
  })
  drawerElements!: any[];

  @Prop()
  index!: number;

  @Prop({
    default: 0
  })
  pageTotal!: number;

  @Prop({
    default: false
  })
  selected!: boolean;

  @Prop({
    default: false
  })
  showGrid!: boolean;
  @Prop({ type: Object }) pageSettingData!: any;
  @PrintVuex.State("pageSettings") pageSettings!: any;
  @PrintVuex.State("pages") pages!: object[];

  // @PrintVuex.State("isOver") isOver!: Boolean;

  @PrintVuex.State("leftOrRight") leftOrRight!: string;

  // @PrintVuex.Action("changeOver") changeOver!: any;

  @PrintVuex.State("itemAttrs") itemAttrs!: any;

  @PrintVuex.Mutation("changeTop") changeTop!: any;

  @PrintVuex.Mutation("delOneEle") delOneEle!: any;

  @PrintVuex.Mutation("setAttrs") setAttrs!: any;

  @PrintVuex.Mutation("changeLeft") changeLeft!: any;

  @PrintVuex.Mutation("changeKey") changeKey!: any;

  @PrintVuex.Mutation("addOneEle") addOneEle!: any;

  @PrintVuex.State("bizSysData") bizSysData!: any[];

  @PrintVuex.State("copyData") copyData!: string;

  @PrintVuex.Mutation("setCopyData") setCopyData!: Function;

  // @PrintVuex.State("drawerElements") drawerElements!: any[];
  @Inject()
  getDragItem!: () => any;

  checkId: string = "";

  drawerTop: number = 0;

  dividers: DividerLike[] = [];

  rectPoint: Point | null = null;

  selecteds: any[] | null = null;

  rect: RectLike | null = null;

  dragover = false;

  // focused = false;
  get dragItem() {
    return this.getDragItem();
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
    } else {
      return "#";
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

  onPaste() {
    if (!this.copyData) {
      return;
    }

    const add = (node: any) => {
      node.left += 10;
      node.top += 10;
      node.id = guid();

      this.addOneEle({
        oneEle: node,
        page: this.index
      });
    };

    const obj = JSON.parse(this.copyData);

    if (Array.isArray(obj)) {
      obj.forEach(node => add(node));

      this.cleanRectSelecteds();

      this.selecteds = obj;

      const rects = obj.map(node => this.getItemRect(node));
      this.rect = this.getBoundsByRects(rects);
      this.displayRect(this.rect, false);

      this.$emit("rectSelect", this.selecteds);
    } else {
      add(obj);

      if (this.itemAttrs) {
        this.clearActive(this.itemAttrs);
      }

      // node.active = true;
      this.setAttrs(obj);
    }

    this.setCopyData(null);
  }

  onCopy() {
    if (this.selecteds && this.selecteds.length > 0) {
      this.setCopyData(JSON.stringify(this.selecteds));
    }
  }

  clearActive(item: any) {
    item.active = false;

    if (item.leftKey && item.leftKey.active) {
      item.leftKey.active = false;
    }

    if (item.rightValue && item.rightValue.active) {
      item.rightValue.active = false;
    }
  }

  clearActiveAttr() {
    this.drawerElements.forEach((item: any, index: number) => {
      // @ts-ignore
      if (item.active) item.active = false;
      // @ts-ignore
      if (item.leftKey && item.leftKey.active) item.leftKey.active = false;
      // @ts-ignore
      if (item.rightValue && item.rightValue.active)
        item.rightValue.active = false;
    });
  }

  dragMove(e: any, bool: boolean) {
    e.preventDefault();
    // this.changeOver(bool);
    this.dragover = bool;
  }

  moveInnerItem(res: any) {
    // if(this.selected){
    // this.$emit('select', this.index);
    // }

    // @ts-ignore
    const { event, id } = res;
    this.checkClick(id);
    // // @ts-ignore
    // const childRect: any = event.target.getClientRects()["0"];
    // // @ts-ignore
    // const parentRect: any = this.$el
    //   .querySelector(".main-body")
    //   .getClientRects()[0];
    // // @ts-ignore
    // const mBounds: any = mouseBounds(
    //   event,
    //   childRect,
    //   parentRect,
    //   this.itemAttrs,
    //   this.leftOrRight
    // );

    const bodyRect = this.getBodyRect();

    let point = {
      x: event.screenX,
      y: event.screenY
    };

    document.onmousemove = ev => {
      // let { left, top } = calcPositon(ev, mBounds);

      const rect = this.getItemRect(this.itemAttrs);

      let left = ev.screenX - point.x;
      let top = ev.screenY - point.y;

      point = {
        x: ev.screenX,
        y: ev.screenY
      };

      rect.left += left;
      rect.top += top;
      rect.right += left;
      rect.bottom += top;

      if (
        rect.left < 0 ||
        rect.top < 0 ||
        rect.right > bodyRect.width ||
        rect.bottom > bodyRect.height
      ) {
        return;
      }

      left = rect.left;
      top = rect.top;

      this.setAttrs(Object.assign(this.itemAttrs, { left, top }));
      this.drawDividers();
    };
    document.onmouseup = () => {
      document.onmousemove = null;
      document.onmouseup = null;
      this.dividers = [];
    };
  }

  onSelect() {
    this.cleanRectSelecteds();
    this.$emit("nodeSelect", {
      page: this.index
    });
    if (this.selected) {
      this.$emit("select", this.index);
    }
  }

  getItemRect(item: any) {
    const { left, top, heightValue } = item;

    let width = 0;

    if (item.leftKey && item.rightValue) {
      width = item.leftKey.widthValue + item.rightValue.widthValue;
    } else if (item.widthValue) {
      width = item.widthValue;
    }

    // 边框-1
    const bottom = top + heightValue;
    const right = left + width;

    return {
      left,
      top,
      bottom,
      right
    };
  }

  drawDividers() {
    const { id } = this.itemAttrs;
    let { left, top, bottom, right } = this.getItemRect(this.itemAttrs);
    const width = right - left;
    const height = bottom - top;

    // if(this.itemAttrs.borderWidthValue){
    //   bottom -= this.itemAttrs.borderWidthValue;
    //   right -= this.itemAttrs.borderWidthValue;
    // }

    const dividers: DividerLike[] = [];

    // this.drawerElements
    //   .map(el => {
    //     const rect = this.getItemRect(el);

    //     return {
    //       top: Math.abs(rect.top - top),
    //       left: Math.abs(rect.left - left),
    //       bottom: Math.abs(rect.bottom - bottom),
    //       right: Math.abs(rect.right - right)
    //     };
    //   })
    //   .filter(rect => {
    //     return (
    //       rect.top < 3 || rect.left < 3 || rect.bottom < 3 || rect.right < 3
    //     );
    //   });

    for (const el of this.drawerElements) {
      if (el.id === id) {
        continue;
      }

      const rect = this.getItemRect(el);

      if (
        rect.top === top &&
        rect.left === left &&
        rect.bottom === bottom &&
        rect.right === right
      ) {
        continue;
      }

      const pushHorizontal = (y: number) => {
        dividers.push({
          x: Math.min(left, el.left),
          y,
          size: Math.abs(left - el.left) + width,
          vertical: false
        });
      };

      const pushVertical = (x: number) => {
        dividers.push({
          x,
          y: Math.min(top, el.top),
          size: Math.abs(top - el.top) + height,
          vertical: true
        });
      };

      let moveLeft = left;
      let moveTop = top;

      if (Math.abs(rect.top - top) < 3) {
        moveTop = rect.top;
        pushHorizontal(rect.top);
      }

      if (Math.abs(rect.left - left) < 3) {
        moveLeft = rect.left;
        pushVertical(rect.left);
      }

      if (Math.abs(rect.bottom - bottom) < 3) {
        if (moveTop === top) {
          moveTop += rect.bottom - bottom;
        }
        let b = rect.bottom;
        if (this.itemAttrs.borderWidthValue) {
          b -= this.itemAttrs.borderWidthValue;
        }
        pushHorizontal(b);
      }

      if (Math.abs(rect.right - right) < 3) {
        if (moveLeft === left) {
          moveLeft += rect.right - right;
        }
        let r = rect.right;
        if (this.itemAttrs.borderWidthValue) {
          r -= this.itemAttrs.borderWidthValue;
        }
        pushVertical(r);
      }

      if (moveLeft !== left || moveTop !== top) {
        this.setAttrs(
          Object.assign(this.itemAttrs, {
            top: moveTop,
            left: moveLeft
          })
        );
        break;
      }
    }

    this.dividers = dividers;

    this.$forceUpdate();
  }

  checkClick(id: string) {
    this.$nextTick(() => {
      this.checkId = id;
    });
    this.$emit("clickedId", id);
    this.$emit("nodeSelect", {
      id,
      page: this.index
    });
  }

  getLeftAndTop() {
    const Odrawer: any = this.$el.querySelector(".main-body");
    if (!Odrawer) return;
    this.changeLeft(getOffsetLeft(Odrawer));
  }

  resizeWidth() {
    this.getLeftAndTop();
  }
  dropItem(e: any) {
    this.$emit("dropEdItem", e);
    e.preventDefault();
    // this.changeOver(false);
    this.dragover = false;
    this.resizeWidth();
    // @ts-ignore
    // const { left, top } = forRightPosition(
    //     // @ts-ignore
    //   e.clientX - this.toLeft - this.dragItem.offsetX,
    //     // @ts-ignore
    //   e.clientY - this.toTop - this.dragItem.offsetY,
    //   this.dragItem,
    // ) as object;

    let left = e.offsetX - this.dragItem.offsetX;
    let top = e.offsetY - this.dragItem.offsetY;

    if (left < 0) {
      left = 0;
    }

    if (top < 0) {
      top = 0;
    }

    let $target = e.target as HTMLElement;

    while ($target.classList.contains("main-body") === false) {
      left += $target.offsetLeft;
      top += $target.offsetTop;
      $target = $target.offsetParent as HTMLElement;
    }

    let tempObj: any = {};

    if (this.dragItem.propertyType === schema.DataItemType.Sheet) {
      const dataitem = this.bizSysData.find(
        (x: any) => x.code === this.dragItem.code
      );

      if (!dataitem) {
        throw new Error("");
      }

      const items = dataitem.subSchema.properties.filter(
        (item: any) => !item.defaultProperty && item.published
      );

      // const w = Math.floor(1 / items.length * 1000) / 10;

      const columns = items.map((item: any) => {
        const col = new SheetColumn(dataitem.code, item.name, 50);

        col.rowSettings.bindSource = {
          code: item.code,
          name: item.name
        };

        return col;
      });

      const widthValue = columns.length * 50;
      const heightValue = 30 * 3 + 1;

      tempObj = new Sheet(
        guid(),
        dataitem.code,
        "sheet",
        left,
        top,
        widthValue,
        heightValue,
        columns
      );
    } else {
      // @ts-ignore
      if (this.dragItem.owner.includes("left")) {
        // @ts-ignore
        if (this.dragItem.kind.includes("leftColumn")) {
          // @ts-ignore
          tempObj = {
            id: guid(),
            eleType: "column",
            left,
            top,
            widthValue: 85,
            heightValue: 30,
            // @ts-ignore
            leftKey: new CreateOneItem(
              guid(),
              "",
              "column",
              this.dragItem.str.trim(),
              left,
              top,
              85,
              30
            ),
            // @ts-ignore
            rightValue: new CreateOneItem(
              guid(),
              `${this.dragItem.code}#_#${
                this.dragItem.propertyType
              }#_#${this.dragItem.str.trim()}`,
              "column",
              `\${ ${this.dragItem.str.trim()} }`,
              left,
              top,
              85,
              30
            )
          };
        }
        // @ts-ignore
        if (this.dragItem.kind.includes("leftQrcodePic"))
          tempObj = new CreatPic(
            guid(),
            "leftQrcodePic",
            "二维码",
            left,
            top,
            84,
            84
          );
        // @ts-ignore
        if (this.dragItem.kind.includes("leftBarcodePic"))
          tempObj = new CreatPic(
            guid(),
            "leftBarcodePic",
            "条形码",
            left,
            top,
            98,
            74
          );
        // @ts-ignore
        if (this.dragItem.kind.includes("flowLog")) {
          this.$message.warning("todo");
          return false;
        }
      }
      // @ts-ignore
      if (this.dragItem.owner.includes("top")) {
        // @ts-ignore
        if (this.dragItem.kind.includes("topText"))
          tempObj = new CreateOneItem(
            guid(),
            "",
            "text",
            this.dragItem.str.trim(),
            left,
            top,
            85,
            30
          );
        // @ts-ignore
        if (this.dragItem.kind.includes("topDrawerRect"))
          tempObj = new RectLine(
            guid(),
            "topDrawerRect",
            "矩形",
            left,
            top,
            85,
            30
          );
        // @ts-ignore
        if (this.dragItem.kind.includes("topDrawerLine"))
          tempObj = new RectLine(
            guid(),
            "topDrawerLine",
            "直线",
            left,
            top,
            85,
            1
          );
        // @ts-ignore
        if (this.dragItem.kind.includes("topPic"))
          tempObj = new CreatPic(guid(), "topPic", "图片", left, top, 134, 74);
      }
    }

    let width =
      tempObj.leftKey && tempObj.rightValue
        ? tempObj.widthValue * 2
        : tempObj.widthValue;
    const x = left + width - $target.offsetWidth;
    if (x > 0) {
      left -= x;
      if (left < 0) {
        width += left;
        left = 0;
        if (!tempObj.leftKey) {
          tempObj.widthValue = width;
        }
      }
    }

    const y = top + tempObj.heightValue - $target.offsetHeight;
    if (y > 0) {
      top -= y;
    }

    tempObj.left = left;
    tempObj.top = top;

    if (tempObj.leftKey) {
      tempObj.leftKey.active = true;
    } else {
      tempObj.active = true;
    }

    // @ts-ignore
    this.addOneEle({
      oneEle: tempObj,
      page: this.index
    });
    this.setAttrs(tempObj);
    // @ts-ignore
    this.addNamelyClickId = tempObj.id;
    this.changeKey("1");
    this.$emit("select", tempObj);
    this.checkClick(tempObj.id);

    (this.$el as HTMLElement).focus();
  }

  deleteTheCheck(id: string) {
    // @ts-ignore
    if (this.selecteds) {
      for (const item of this.selecteds) {
        this.delOneEle({
          id: item.id,
          page: this.index
        });
      }
      this.cleanRectSelecteds();
    } else {
      if (!id) {
        id = this.itemAttrs.id;
      }
      if (id) {
        this.delOneEle({
          id,
          page: this.index
        });
        this.checkId = "";
        this.setAttrs({});
      }
    }
  }

  mainBodyScroll() {
    if (!this.$refs.mainContainer) return;
    // @ts-ignore
    this.drawerTop = this.$refs.mainContainer.scrollTop;
  }
  mounted() {
    if (this.pageSettings._papersize !== undefined) {
      this.pageSettingData = Object.assign(this.pageSettings);
    }
  }

  // mounted() {
  //   window.addEventListener("scroll", this.mainBodyScroll, true);
  //   // @ts-ignore
  //   this.drawerTop = this.$refs.mainContainer.scrollTop;
  //   this.changeTop(getOffsetTop(this.$el.querySelector(".main-body")));
  // }

  // destroyed() {
  //   window.removeEventListener("scroll", this.mainBodyScroll);
  // }

  onPageClick() {
    if (this.rect === null) {
      this.$emit("select", this.index);
      this.setAttrs({});

      this.clearSelecteds();
    }
  }

  clearSelecteds() {
    this.clearActiveAttr();

    const drawer = this.$refs.drawer as any;
    if (drawer) {
      drawer.clearSheetSelected();
    }
  }

  // onPageFocus(){
  //   this.focused = true;
  // }

  // onPageBlur(){
  //   this.focused = false;
  // }

  @Watch("providerId")
  idChange(n: string, o: string) {
    this.checkId = n;
  }

  @Watch("drawerTop")
  drawerTopChange(n: number, o: number) {
    // 画布距离top的值
    this.changeTop(0 - (n - o));
  }
  getBodyRect() {
    // @ts-ignore
    const $main = this.$el.querySelector(".main-body") as HTMLDivElement;
    if (!$main) {
      return null;
    }
    const bodyRect: any = $main.getClientRects()[0];
    return bodyRect;
  }

  onMousedown(evt: MouseEvent) {
    if (this.rect) {
      this.cleanRectSelecteds();
    } else {
      this.rectPoint = {
        x: evt.screenX,
        y: evt.screenY
      };

      const offset = {
        x: evt.offsetX,
        y: evt.offsetY
      };

      document.onmousemove = ev => {
        this.onMousemove(ev, offset);
      };

      document.onmouseup = ev => {
        if (ev.screenX !== evt.screenX || ev.screenY !== evt.screenY) {
          this.onMouseup(ev, offset);
        }
        document.onmousemove = null;
        document.onmouseup = null;
      };
    }
  }

  onMouseup(evt: MouseEvent, offset: Point) {
    if (this.rect) {
      return;
    }

    if (this.rectPoint) {
      evt.preventDefault();

      let rect = this.drawRect(evt, offset);

      if (!rect) {
        return;
      }

      this.rectPoint = null;

      let { left, top, right, bottom } = rect;

      const selecteds: any[] = [];
      const rects: RectLike[] = [];

      for (const item of this.drawerElements) {
        const rect = this.getItemRect(item);

        if (
          rect.top >= top &&
          rect.left >= left &&
          rect.top <= bottom &&
          rect.left <= right
        ) {
          this.$set(item.leftKey ? item.leftKey : item, "active", true);
          selecteds.push(item);
          rects.push(rect);
        }
      }

      this.cleanRect();

      this.selecteds = selecteds.length > 0 ? selecteds : null;

      this.$emit("rectSelect", this.selecteds);
      if (this.selected) {
        this.$emit("select", this.index);
      }

      if (!this.selecteds) {
        return;
      }

      const item = this.itemAttrs as any;
      if (item && this.selecteds.every((x: any) => x.id !== item.id)) {
        if (item.active) {
          item.active = false;
        } else if (item.leftKey && item.leftKey.active) {
          item.leftKey.active = false;
        } else if (item.rightValue && item.rightValue.active) {
          item.rightValue.active = false;
        }
      }

      this.rect = this.getBoundsByRects(rects);

      this.displayRect(this.rect, false);
    }
  }

  getBoundsByRects(rects: RectLike[]) {
    const sort = (a: number, b: number) => a - b;

    const left = rects
      .map(r => r.left)
      .sort(sort)
      .shift() as any;

    const top = rects
      .map(r => r.top)
      .sort(sort)
      .shift() as any;

    const right = rects
      .map(r => r.right)
      .sort(sort)
      .pop() as any;

    const bottom = rects
      .map(r => r.bottom)
      .sort(sort)
      .pop() as any;

    return {
      left,
      top,
      right,
      bottom
    };
  }

  cleanRectSelecteds() {
    if (this.selecteds) {
      for (const item of this.selecteds) {
        if (item.leftKey) {
          item.leftKey.active = false;
        } else {
          item.active = false;
        }
      }

      this.selecteds = null;

      this.$emit("rectSelect", null);
    }

    this.cleanRect();
  }

  drawRect(evt: MouseEvent, offset: Point) {
    if (!this.rectPoint) {
      return null;
    }

    // console.log(evt);

    let right = evt.screenX;
    let bottom = evt.screenY;

    let width = Math.abs(right - this.rectPoint.x);
    let height = Math.abs(bottom - this.rectPoint.y);

    let left = 0;
    let top = 0;

    if (this.rectPoint.x < right) {
      left = offset.x;
    } else {
      left = offset.x - width;
    }

    if (this.rectPoint.y < bottom) {
      top = offset.y;
    } else {
      top = offset.y - height;
    }

    const bodyRect = this.getBodyRect();

    if (left < 0) {
      left = 0;
    }

    if (top < 0) {
      top = 0;
    }

    right = left + width;
    if (right > bodyRect.width) {
      right += bodyRect.width - right;
    }

    bottom = top + height;
    if (bottom > bodyRect.height) {
      bottom += bodyRect.height - bottom;
    }

    const rect = {
      left,
      top,
      right,
      bottom
    };

    // console.log(rect);

    this.displayRect(rect);

    return rect;
  }

  displayRect(rect: RectLike, showBorder = true) {
    const $rect = this.$el.querySelector(".rect") as HTMLDivElement;
    if (!$rect) {
      return null;
    }

    const width = rect.right - rect.left;
    const height = rect.bottom - rect.top;

    $rect.style.display = "block";
    $rect.style.left = rect.left + "px";
    $rect.style.top = rect.top + "px";
    $rect.style.width = width + "px";
    $rect.style.height = height + "px";
    $rect.style.borderStyle = showBorder ? "solid" : "none";
    $rect.style.background = showBorder ? "rgba(216, 216, 216, 0.1)" : "none";
  }

  cleanRect() {
    this.rect = null;

    if (this.$el) {
      const $rect = this.$el.querySelector(".rect") as HTMLDivElement;
      if ($rect) {
        $rect.style.display = "none";
      }
    }
  }

  onMousemove(evt: MouseEvent, offset: Point) {
    if (this.rect) {
      return;
    }

    if (this.rectPoint) {
      this.drawRect(evt, offset);
    }
  }

  onRectDown(evt: MouseEvent) {
    if (!this.rect) {
      return;
    }

    evt.stopPropagation();

    this.rectPoint = {
      x: evt.screenX,
      y: evt.screenY
    };

    const bodyRect = this.getBodyRect();

    const $rect = this.$el.querySelector(".rect") as HTMLDivElement;
    if (!$rect) {
      return;
    }

    document.onmousemove = ev => {
      this.onRectMove(ev, bodyRect, $rect);
    };

    document.onmouseup = () => {
      this.rectPoint = null;
      document.onmousemove = null;
      document.onmouseup = null;
    };
  }
  onRectMove(evt: MouseEvent, bodyRect: any, $rect: HTMLDivElement) {
    if (!this.rect) {
      return;
    }

    if (!this.selecteds || !this.rect || !this.rectPoint) {
      return;
    }

    const left = evt.screenX - this.rectPoint.x;
    const top = evt.screenY - this.rectPoint.y;

    this.rectPoint = {
      x: evt.screenX,
      y: evt.screenY
    };

    const rect = Object.assign({}, this.rect);
    rect.left += left;
    rect.top += top;
    rect.right += left;
    rect.bottom += top;

    if (
      rect.left < 0 ||
      rect.top < 0 ||
      rect.right > bodyRect.width ||
      rect.bottom > bodyRect.height
    ) {
      return;
    }

    this.rect = rect;

    $rect.style.left = rect.left + "px";
    $rect.style.top = rect.top + "px";

    for (const item of this.selecteds) {
      this.setAttrs(
        Object.assign(item, {
          left: item.left + left,
          top: item.top + top
        })
      );
    }

    // this.$forceUpdate();
  }
}
</script>

<style lang="less">
.draw-container {
  margin: 0 auto 15px auto;
  background: #fff;
  border: 1px solid #e5e5e5;
  position: relative;

  .drawer {
    // padding: 36px 34px;
    clear: both;
    height: 100%;
    display: flex;
    flex-direction: column;

    .main-body {
      // height: 695px;
      // width: 492px;
      flex-grow: 1;
      margin: 0 14px;
      position: relative;
      background-repeat: no-repeat;
      background-size: cover;
      .div-style {
        display: inline-flex;
        position: absolute;
        text-wrap: normal;
        // transition: all 1ms linear;

        .code-and-pic,
        .text-div,
        .two-text-div-one,
        .react-and-line {
          word-break: break-word;
          cursor: move;
          // &:hover {
          //   border-color: rgb(233, 193, 9) !important;
          // }
        }
        .line:hover {
          background: rgb(233, 193, 9) !important;
        }
        .two-text-div {
          display: inline-flex;
        }
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
  }
  .drag-over {
    background: #c1c1c1;
    transition: all 0.3s;
    border: none;
    .main-body {
      background: #fff;
    }
  }

  &.focus {
    border-color: @primary-color;
  }

  &.grid {
    background: url("~@/assets/images/5_5mm.png") repeat;
  }

  .header {
    font-weight: 600;
    position: absolute;
    padding-left: 5mm;
    padding-right: 5mm;
    width: 100%;
  }
  .pl-10 {
    padding-left: 10px;
  }
  .footer {
    position: relative;
    width: 100%;
    padding-left: 5mm;
    padding-right: 5mm;
    font-weight: 600;
  }
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

// .page-number {
//   width: 36px;
//   height: 26px;
//   line-height: 26px;
//   border-radius: 4px;
//   border: 1px solid @border-color;
//   position: absolute;
//   top: 50%;
//   right: -68px;
//   color: @light-color-3;
//   background: #fff;
//   text-align: center;
// }

.rect {
  border: 1px solid @text-color-describe;
  position: absolute;
  z-index: 10;
  cursor: move;
  display: none;
}
</style>
