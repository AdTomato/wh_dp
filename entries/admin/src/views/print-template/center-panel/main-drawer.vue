<template>
  <div :key="drawerSize">
    <template v-if="drawerElements.length > 0">
      <div
        class="div-style"
        v-for="item in drawerElements"
        :key="item.id"
        :tabindex="0"
        :style="`left: ${item.left}px;top: ${item.top}px;`"
        @mousedown="StartMoveInnerItem($event, item.id)"
        @keyup.46="onDelete"
        @click.stop
        @keyup.ctrl.67="onCopy(item)"
        @keydown.left.stop.prevent="onDirectionKey('left',item)"
        @keydown.right.stop.prevent="onDirectionKey('right',item)"
        @keydown.up.stop.prevent="onDirectionKey('top',item)"
        @keydown.down.stop.prevent="onDirectionKey('bottom',item)"
      >
        <div
          class="two-text-div"
          :class="{activeChoose : item.leftKey.active || item.rightValue.active}"
          v-if="item.eleType.includes('column')"
          :style="`min-height: ${item.heightValue}px;`"
        >
          <h3-size-rectangle
            :active="item.leftKey.active"
            @resize="e => onResize(e,item,'leftKey',item.rightValue.widthValue)"
            class="box"
          >
            <div
              class="two-text-div-one"
              :style="`
              border: ${item.leftKey.borderWidthValue}px ${item.leftKey.borderTypeValue} ${item.leftKey.borderColorValue};
              width: ${item.leftKey.widthValue}px;
              background: ${item.leftKey.fillColorValue};
              font-size: ${item.leftKey.fontSizeValue}px;
              color: ${item.leftKey.fontColorValue};
              font-weight: ${item.leftKey.fontIsWeight ? 'bold' : ''};
              font-style: ${item.leftKey.fontIsItalic ? 'italic' : ''};
              text-decoration: ${item.leftKey.fontIsUnderline ? 'underline' : ''};
              height: 100%;
            `"
              :class="[item.leftKey.fontTCBNeat,item.leftKey.fontLCRNeat]"
              @mousedown="innerClicked($event, item, 'left')"
            >{{ item.leftKey.innerTxt }}</div>
          </h3-size-rectangle>

          <h3-size-rectangle
            :active="item.rightValue.active"
            @resize="e => onResize(e,item,'rightValue',item.leftKey.widthValue)"
            class="box"
          >
            <div
              class="two-text-div-one"
              :style="`
              border: ${item.rightValue.borderWidthValue}px ${item.rightValue.borderTypeValue} ${item.rightValue.borderColorValue};
              width: ${item.rightValue.widthValue}px;
              background: ${item.rightValue.fillColorValue};
              font-size: ${item.rightValue.fontSizeValue}px;
              color: ${item.rightValue.fontColorValue};
              font-weight: ${item.rightValue.fontIsWeight ? 'bold' : ''};
              font-style: ${item.rightValue.fontIsItalic ? 'italic' : ''};
              text-decoration: ${item.rightValue.fontIsUnderline ? 'underline' : ''};
              height: 100%;
            `"
              :class="[item.rightValue.fontTCBNeat,item.rightValue.fontLCRNeat]"
              @mousedown="innerClicked($event, item, 'right')"
            >{{ item.rightValue.innerTxt }}</div>
          </h3-size-rectangle>
        </div>

        <h3-size-rectangle
          v-if="item.eleType.includes('text')"
          :active="item.active"
          @resize="e => onResize(e,item)"
          class="box"
        >
          <div
            class="text-div"
            :style="`
            min-height: ${item.heightValue}px;
            border: ${item.borderWidthValue}px ${item.borderTypeValue} ${item.borderColorValue};
            width: ${item.widthValue}px;
            background: ${item.fillColorValue};
            font-size: ${item.fontSizeValue}px;
            color: ${item.fontColorValue};
            font-weight: ${item.fontIsWeight ? 'bold' : ''};
            font-style: ${item.fontIsItalic ? 'italic' : ''};
            text-decoration: ${item.fontIsUnderline ? 'underline' : ''};
          `"
            :class="[item.fontTCBNeat,item.fontLCRNeat]"
            @mousedown="innerClicked($event, item)"
          >{{ item.innerTxt }}</div>
        </h3-size-rectangle>

        <div
          class="code-and-pic"
          v-if="item.eleType.includes('leftQrcodePic')"
          :style="`border: 1px dashed #ccc; height: ${item.heightValue}px; width: ${item.widthValue}px;`"
          :class="{ active:item.active }"
          @mousedown="innerClicked($event, item)"
        >
          <h3-size-rectangle
            :active="item.active"
            @resize="e => onResize(e,item)"
            style="padding: 5px;"
          >
            <img draggable="false" style="width: 100%; height: 100%;" :src="imgObj.qr_code" alt />
          </h3-size-rectangle>
        </div>
        <div
          class="code-and-pic"
          v-if="item.eleType.includes('leftBarcodePic')"
          :style="`border: 1px dashed #ccc; height: ${item.heightValue}px; width: ${item.widthValue}px;`"
          :class="{ active:item.active }"
          @mousedown="innerClicked($event, item)"
        >
          <h3-size-rectangle
            :active="item.active"
            @resize="e => onResize(e,item)"
            style="padding: 5px;"
          >
            <img draggable="false" style="width: 100%; height: 100%;" :src="imgObj.bar_code" alt />
          </h3-size-rectangle>
        </div>
        <div
          class="code-and-pic"
          v-if="item.eleType.includes('topPic')"
          :style="`border: 1px dashed #ccc; height: ${item.heightValue}px; width: ${item.widthValue}px;`"
          :class="{ active:item.active }"
          @mousedown="innerClicked($event, item)"
        >
          <h3-size-rectangle
            :active="item.active"
            @resize="e => onResize(e,item)"
            style="padding: 5px;"
          >
            <img
              draggable="false"
              style="width: 100%; height: 100%;"
              :src="item.picUrl || imgObj.pic_img"
              alt
            />
          </h3-size-rectangle>
        </div>

        <h3-size-rectangle
          v-if="item.eleType === 'topDrawerRect'"
          :active="item.active"
          @resize="e => onResize(e,item)"
          class="box"
        >
          <div
            class="react-and-line"
            :style="getRectStyleOf(item)"
            @mousedown="innerClicked($event, item)"
          ></div>
        </h3-size-rectangle>

        <!-- <div
          class="react-and-line"
          v-if="item.eleType.includes('topDrawerRect')"
          :style="`
          height: ${item.heightValue}px;
          width: ${item.widthValue}px;
          border: ${item.borderWidthValue}px solid ${item.borderColorValue};
          ${item.hasWhereBorders}
          background: ${item.fillColorValue};
        `"
          @mousedown="innerClicked($event, item)"
        >
          <h3-size-rectangle :active="item.active" @resize="e => onResize(e,item)" />
        </div>-->

        <div
          class="react-and-line line"
          v-if="item.eleType.includes('topDrawerLine')"
          :style="`
          height: ${item.heightValue}px;
          width: ${item.widthValue}px;
          background: ${item.borderColorValue};
        `"
          @mousedown="innerClicked($event, item)"
        >
          <h3-size-rectangle
            :active="item.active"
            @resize="e => onResize(e,item)"
            :onlyHorizontal="item.lineDirection === 'x'"
            :onlyVertical="item.lineDirection === 'y'"
          />
        </div>

        <div v-if="item.eleType === 'sheet'" @mousedown="innerClicked($event, item)">
          <h3-size-rectangle :active="item.active" @resize="e => onResize(e,item)" class="box">
            <print-sheet
              ref="sheets"
              :item="item"
              @bodyResize="e => onResize(e,item)"
              @selectCell="e => onSelectCell(e,item)"
              :style="`
                height: ${item.heightValue}px;
                max-width: ${item.widthValue}px;
              `"
            ></print-sheet>
          </h3-size-rectangle>
        </div>
      </div>
    </template>
    <div v-else></div>
  </div>
</template>


<script lang="ts">
// eslint-disable-next-line
import { Component, Vue, Watch, Prop } from "vue-property-decorator";
// eslint-disable-next-line
import { namespace } from "vuex-class";
import { guid } from "@/utils/print-util";
const PrintVuex = namespace("Print/Print");
import common from "@cloudpivot/common";

import PrintSheet from "./sheet.vue";

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

@Component({
  name: "main-drawer",
  components: {
    H3SizeRectangle: common.components.pc.H3SizeRectangle,
    PrintSheet
  }
})
export default class MainDrawer extends Vue {
  imgObj: object = {
    qr_code: require("@/assets/images/qrcode.png"),
    bar_code: require("@/assets/images/barcode.png"),
    pic_img: require("@/assets/images/pic.png")
  };
  itemAttrCopy: any;

  @Prop({ type: Object }) pageSettingData!: any;

  @Prop({
    default: () => []
  })
  drawerElements!: any[];

  @Prop()
  page!: number;

  // @PrintVuex.State("drawerElements") drawerElements!: object[];
  @PrintVuex.State("itemAttrs") itemAttrs!: object;
  @PrintVuex.State("isFocus") isFocus!: boolean;
  @PrintVuex.Mutation("changeLeftRight") changeLeftRight!: any;
  @PrintVuex.Mutation("changeXYWH") changeXYWH!: any;
  @PrintVuex.Mutation("setAttrs") setAttrs!: any;
  @PrintVuex.Mutation("addOneEle") addOneEle!: any;
  @PrintVuex.Getter("getItemAttrsById") getItemAttrsById!: any;

  @PrintVuex.Mutation("updateNode") updateNode!: Function;

  @PrintVuex.Mutation("setCopyData") setCopyData!: Function;

  activeNode: any;
  maxHeight = 728;
  maxWidth = 497;
  minHeight = 30;
  minWidth = 30;
  keyOne: any;
  keyTwo: any;

  rectPoint: Point | null = null;

  clearSheetSelected() {
    const sheets = this.$refs.sheets as any[];
    if (sheets) {
      sheets.forEach(s => s.clearSelected());
    }
  }

  onDelete() {
    this.$emit("keyBordDelete");
  }

  onCopy(item: any) {
    // this.$emit('copy',JSON.stringify(item));
    this.setCopyData(JSON.stringify(item));
  }

  StartMoveInnerItem(event: any, id: string) {
    event.stopPropagation();
    this.$emit("innerMove", { event, id });
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

  innerClicked(e: any, obj: any, str: string) {
    // if(obj.active !== true){
    //   event.stopPropagation();
    // }

    this.clearSheetSelected();

    if (this.activeNode) {
      this.activeNode.active = false;
    }
    // this.setAttrs(this.getItemAttrsById(obj.id));
    this.setAttrs(obj);
    if (str) {
      this.changeLeftRight({ obj, str });
      const key = str === "left" ? "leftKey" : "rightValue";
      this.activeNode = obj[key];
    } else {
      this.activeNode = obj;
    }
    this.$set(this.activeNode, "active", true);
    this.$emit("select", obj);
  }

  onSelectCell(evt: any, item: any) {
    if (this.activeNode) {
      this.activeNode.active = false;
    }
    this.$emit("select");
  }

  onDirectionKey(direction: string, item: any) {
    let { left, top, heightValue } = item;

    let width = 0;

    switch (direction) {
      case "left":
        if (left > 0) {
          left += -1;
        }
        break;

      case "right":
        if (item.leftKey && item.rightValue) {
          width = item.leftKey.widthValue + item.rightValue.widthValue;
        } else if (item.widthValue) {
          width = item.widthValue;
        }

        if (left + width < this.maxWidth) {
          left += 1;
        }
        break;

      case "top":
        if (top > 0) {
          top += -1;
        }
        break;

      case "bottom":
        if (top + heightValue < this.maxHeight) {
          top += 1;
        }
        break;
    }

    item.left = left;
    item.top = top;

    this.changeXYWH({
      left: item.left,
      top: item.top
    });
  }

  onResize(
    data: {
      direction: string;
      point: any;
    },
    item: any,
    key?: string,
    otherPartWidth?: number
  ) {
    const { point, direction } = data;
    const part = key ? item[key] : item;
    const widthCopy = part.widthValue;

    switch (direction) {
      case "left":
        item.left += point.x;
        part.widthValue += point.x * -1;
        break;
      case "right":
        part.widthValue += point.x;
        break;
      case "top":
        item.top += point.y;
        item.heightValue += point.y * -1;
        break;
      case "bottom":
        item.heightValue += point.y;
        break;
      case "leftTop":
        item.left += point.x;
        part.widthValue += point.x * -1;
        item.top += point.y;
        item.heightValue += point.y * -1;
        break;
      case "rightBottom":
        part.widthValue += point.x;
        item.heightValue += point.y;
        break;
      case "leftBottom":
        item.left += point.x;
        item.heightValue += point.y;
        part.widthValue += point.x * -1;
        break;
      case "rightTop":
        item.top += point.y;
        item.heightValue += point.y * -1;
        part.widthValue += point.x;
        break;
    }
    if (item.left < 0) {
      part.widthValue += item.left;
      item.left = 0;
    }
    if (item.top < 0) {
      item.heightValue += item.top;
      item.top = 0;
    }

    const minHeight =
      part.eleType === "topDrawerLine" && part.lineDirection === "x"
        ? 1
        : this.minHeight;

    if (item.heightValue < minHeight) {
      if (direction.search(/top/i) > -1) {
        item.top += item.heightValue - minHeight;
      }
      item.heightValue = minHeight;
    } else if (item.top + item.heightValue > this.maxHeight) {
      item.heightValue = this.maxHeight - item.top;
    }

    const minWidth =
      part.eleType === "topDrawerLine" && part.lineDirection === "y"
        ? 1
        : this.minWidth;

    if (part.widthValue < minWidth) {
      if (direction.search(/left/i) > -1) {
        item.left += part.widthValue - minWidth;
      }
      part.widthValue = minWidth;
    } else {
      const temp = item.left + part.widthValue + (otherPartWidth || 0);
      if (temp > this.maxWidth) {
        part.widthValue = this.maxWidth - item.left - (otherPartWidth || 0);
      }
    }

    if (item.eleType === "sheet") {
      if (part.widthValue !== widthCopy) {
        let count = 0;
        item.columns.forEach((col: any) => {
          col.widthValue = part.widthValue * (col.widthValue / widthCopy);
          count += col.widthValue;
        });
        count = part.widthValue - count;
        if (item.columns.length > 0) {
          item.columns[0].widthValue += count;
        }
        // this.setAttrs(Object.assign(item, {
        //     columns: item.columns.slice()
        // }));
      }

      item.bodyHeight = item.heightValue - item.headHeight - 31;
    }

    this.updateNode({
      id: item.id,
      page: this.page,
      node: Object.assign({}, item)
    });

    this.changeXYWH({
      left: item.left,
      top: item.top,
      widthValue: part.widthValue,
      heightValue: item.heightValue
    });
  }

  @Watch("isFocus")
  isFocusChange(nd: any, od: any) {
    if (!nd) this.itemAttrCopy = "";
  }

  getDrawerSize() {
    const paperSize: any = this.pageSettingData._papersize;
    const margin: any = this.pageSettingData._pagemargin;
    this.maxWidth = paperSize.widthTopx - margin.LeftTopx - margin.RightTopx-30;
    this.maxHeight =
      paperSize.heightTopx - margin.UpTopx - margin.DownTopx - 45;
  }
  get drawerSize() {
    return this.getDrawerSize();
  }
}
</script>

<style lang="less" scoped>
.box {
  border: 1px dashed #fff;
  margin-left: -1px;
  margin-top: -1px;
  height: auto !important;
  width: auto !important;
}

.active:not(.h3-size-rectangle),
.box.active {
  border: 1px dashed #ffcb0e !important;
}

/deep/.h3-size-rectangle,
.text-div,
.two-text-div-one {
  display: inline-flex !important;
  align-items: center;
  justify-content: center;
  text-align: left;
  &.bottom {
    align-items: flex-end;
  }
  &.top {
    align-items: flex-start;
  }
  &.middle {
    align-items: center;
  }
  &.left {
    justify-content: flex-start;
  }
  &.right {
    justify-content: flex-end;
  }
  &.center {
    justify-content: center;
  }

  & > table {
    flex-grow: 1;
    align-self: start;
  }
}
.react-and-line.line {
  line-height: 0;
  /deep/.h3-size-rectangle__cell {
    &-left,
    &-right {
      top: -6px;
    }
    &-top,
    &-bottom {
      left: -2px;
    }
  }
}
</style>
