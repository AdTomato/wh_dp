<template>
  <div class="print-container">
    <h3-side :options="leftOps" @resize="resizeWidth">
      <LeftComponent @itemStartDrag="doDragStart" />
    </h3-side>
    <CenterPanel
      @dropEdItem="doDropItem"
      @clickedId="filterDataById"
      :providerId="addNamelyClickId"
      @itemStartDrag="doDragStart"
      @rectSelect="onRectSelect"
      ref="cneterPanel"
    />

    <a-modal
      :visible="showUnsaveConfirm"
      :closable="false"
      :maskClosable="false"
      :width="400"
      wrapClassName="unsave-confirm"
    >
      <div class="unsave-confirm--content">
        <i class="icon aufontAll h-icon-all-question-circle"></i>
        <strong>{{ $t("languages.Apps.FormDesignPage.UnsaveContent") }}</strong>
      </div>

      <template slot="footer">
        <a-button key="cancel" @click="handleConfirmCancel">{{ $t("languages.Apps.Cancel") }}</a-button>
        <a-button key="unsave" @click="handleConfirmUnsave">{{ $t("languages.Apps.Unsave") }}</a-button>
        <a-button
          key="save"
          type="primary"
          @click="handleConfirmOk"
        >{{ $t("languages.Apps.SaveAndLeave") }}</a-button>
      </template>
    </a-modal>

    <h3-side :options="rightOps" @resize="resizeWidth">
      <RightAttr :selecteds="selecteds" />
    </h3-side>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Provide } from "vue-property-decorator";
import { namespace } from "vuex-class";
import H3Side from "@/common/sider/sider.vue";
import { get, update } from "@/apis/form";
// import { replaceValueData } from "@cloudpivot/common/src/utils/utils";
import common from "@cloudpivot/common";

const { replaceValueData } = common.utils.BusinessFunctions;

import LeftComponent from "./left-component/index.vue";
import CenterPanel from "./center-panel/index.vue";
import RightAttr from "./right-attr/index.vue";
import {
  leftSide,
  rightSide,
  CreateOneItem,
  CreatPic,
  RectLine
} from "@/config/print/dataStructure";

import { guid, getOffsetLeft, forRightPosition } from "@/utils/print-util";

import env from "@/env";

const PrintVuex = namespace("Print/Print");
@Component({
  name: "print-template",
  components: {
    LeftComponent,
    CenterPanel,
    RightAttr,
    H3Side
  },
  beforeRouteEnter(to, from, next) {
    // @ts-ignore
    if (from.name && from.name.includes("form-design")) {
      next();
      location.reload();
    }
    next();
  },
  beforeRouteLeave(to, from, next) {
    // @ts-ignore
    this.validateRoute().then(
      () => {
        // vm.clean();
        next();
      },
      () => {
        next(false);
      }
    );
  }
})
export default class PrintTemplate extends Vue {
  leftOps: any = leftSide;
  rightOps: any = rightSide;
  dragItem: any = {};
  addNamelyClickId: string = "";
  @PrintVuex.State("toLeft") toLeft!: number;
  @PrintVuex.State("toTop") toTop!: number;
  @PrintVuex.Action("changeOver") changeOver!: any;
  @PrintVuex.Mutation("addOneEle") addOneEle!: any;
  @PrintVuex.Mutation("changeLeft") changeLeft!: any;
  @PrintVuex.Mutation("setAttrs") setAttrs!: any;
  @PrintVuex.Getter("getItemAttrsById") getItemAttrsById!: any;
  @PrintVuex.Mutation("changeKey") changeKey!: any;

  selecteds: any[] = [];

  showUnsaveConfirm = false;

  saveConfirmPromiseResolve: Function | null = null;

  saveConfirmPromiseReject: Function | null = null;

  doDragStart(dragItemObj: any) {
    this.dragItem = dragItemObj;
  }

  onRectSelect(selecteds: any) {
    this.selecteds = selecteds || [];
  }

  @Provide()
  getDragItem() {
    return this.dragItem;
  }

  getLeftAndTop() {
    const Odrawer: any = document.querySelector(".main-body");
    if (!Odrawer) return;
    this.changeLeft(getOffsetLeft(Odrawer));
  }
  mounted() {
    this.getLeftAndTop();
    window.onresize = () => {
      this.getLeftAndTop();
    };
  }
  resizeWidth() {
    this.getLeftAndTop();
    (this.$refs.cneterPanel as any).getPagesWidth();
  }
  doDropItem(e: any) {
    e.preventDefault();
    this.changeOver(false);
    this.resizeWidth();
    // @ts-ignore
    const { left, top } = forRightPosition(
      // @ts-ignore
      e.clientX - this.toLeft - this.dragItem.offsetX,
      // @ts-ignore
      e.clientY - this.toTop - this.dragItem.offsetY,
      this.dragItem
    ) as object;
    let tempObj: object = {};
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
    // @ts-ignore
    this.addOneEle(tempObj);
    this.setAttrs(tempObj);
    // @ts-ignore
    this.addNamelyClickId = tempObj.id;
    this.changeKey("1");
  }
  filterDataById(id: string) {
    this.setAttrs(this.getItemAttrsById(id));
    this.changeKey("1");
  }
  async judgeDataIsSame() {
    // @ts-ignore
    const { data, errcode, errmsg } = await get(
      this.$route.params.bizSchemaCode,
      this.$route.params.printCode
    );
    if (errcode !== 0) {
      this.$message.error(errmsg);
      return true;
    }
    const set = new Set();
    if (data && data.draftAttributesJson) {
      set.add(data.draftAttributesJson);
    }

    let json = JSON.stringify(this.$store.state.Print.Print.pages);
    const pages = JSON.parse(json);

    for (const page of pages) {
      for (const item of page) {
        if (item.leftKey && item.leftKey.active) {
          item.leftKey.active = true;
        }
        if (item.rightValue && item.rightValue.active) {
          item.rightValue.active = true;
        }
        // @ts-ignore
        if (item.active) {
          // @ts-ignore
          item.active = false;
        }
      }
    }

    json = JSON.stringify(pages);

    if (!set.has(json)) {
      return true;
    }

    return false;
  }
  async saveDrawerJsons() {
    // @ts-ignore
    const res: object[] = replaceValueData(
      env,
      this.$store.state.Print.Print.pages,
      "fake"
    );
    const params: any = {
      // @ts-ignore
      code: this.$route.params.printCode,
      // @ts-ignore
      schemaCode: this.$route.params.bizSchemaCode,
      id: localStorage.getItem(
        `upPrintTempJsonId${this.$route.params.printCode}`
      ),
      name: "打印模板",
      sheetType: "2",
      draftAttributesJson: JSON.stringify(res)
    };
    const { errcode, errmsg } = await update(params);
    if (errcode !== 0) this.$message.error(errmsg);
    if (errcode === 0) this.$message.success(errmsg);
  }
  async validateRoute(func: any) {
    const _this = this;

    const edited = await this.judgeDataIsSame();

    if (!edited) {
      return Promise.resolve();
    }

    this.showUnsaveConfirm = true;

    return new Promise((resolve, reject) => {
      this.saveConfirmPromiseResolve = resolve;
      this.saveConfirmPromiseReject = reject;
    });

    // if (!(await this.judgeDataIsSame())) {
    //   this.$confirm({
    //     title: "您刚对模板设计进行了修改，是否保存后再离开？",
    //     okText: "保存并离开",
    //     cancelText: "不保存",
    //     async onOk() {
    //       await _this.saveDrawerJsons();
    //       func();
    //     },
    //     onCancel() {
    //       func();
    //     }
    //   });
    // } else {
    //   func();
    // }
  }

  handleConfirmCancel() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseReject) {
      this.saveConfirmPromiseReject();
      this.saveConfirmPromiseReject = null;
    }
  }

  handleConfirmUnsave() {
    this.showUnsaveConfirm = false;
    if (this.saveConfirmPromiseResolve) {
      this.saveConfirmPromiseResolve();
      this.saveConfirmPromiseResolve = null;
    }
  }

  handleConfirmOk() {
    this.saveDrawerJsons().then(
      () => {
        this.handleConfirmUnsave();
      },
      () => {
        this.handleConfirmCancel();
      }
    );
  }
}
</script>

<style lang="less" scoped>
.print-container {
  display: flex;
  justify-content: space-between;
  
  position: absolute;
  overflow-x: auto;
}
</style>
