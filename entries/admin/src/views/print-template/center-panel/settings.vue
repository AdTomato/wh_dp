<template>
  <div>
    <a-modal
      v-model="visible"
      @ok="save"
      width="618px"
      okText="保存"
      title=" "
      wrapClassName="print-setting"
      :maskClosable="false"
    >
      <div class="modal-h" :style="Init">
        <div class="header-button">
          <a-radio-group v-model="tabPosition" style="margin:8px" buttonStyle="solid">
            <a-radio-button value="page">页面设置</a-radio-button>
            <!-- <a-radio-button value="header">页眉页脚设置</a-radio-button> -->
            <a-radio-button value="bgImg">添加背景图片</a-radio-button>
          </a-radio-group>
        </div>
        <div v-if="tabPosition==='page'" class="pt-25">
          <a-form-item label="纸张大小" :label-col=" { span: 3 }" :wrapper-col="{ span: 9 }">
            <a-select
              class="input-w"
              :defaultValue="activeData._papersize.scale"
              @change="paperSizeChange($event)"
              :value="activeData._papersize.scale"
            >
              <a-select-option
                v-for="item in paperSpecItem"
                :key="item.id"
                :value="item.scale"
              >{{ item.scale }}</a-select-option>
            </a-select>
          </a-form-item>

          <div class="ant-form-inline">
            <a-form-item label="宽" class="label-w">
              <a-input-number
                class="input-w"
                v-model="activeData._papersize.widthTomm"
                :disabled="isCustom!==true"
                :defaultValue="activeData._papersize.widthTomm"
                :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                :parser="value => value.replace('mm', '')"
                @change="inputNumberChange($event,1,1500,'_papersize.widthTomm')"
              ></a-input-number>
            </a-form-item>
            <a-form-item label="高" class="label-w">
              <a-input-number
                class="input-w"
                v-model="activeData._papersize.heightTomm"
                :disabled="isCustom!==true"
                :defaultValue="activeData._papersize.heightTomm"
                :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                :parser="value => value.replace('mm', '')"
                @change="inputNumberChange($event,1,1500,'_papersize.heightTomm')"
              ></a-input-number>
            </a-form-item>
          </div>
          <a-form-item
            label="设定方向"
            :label-col=" { span: 3 }"
            :wrapper-col="{ span: 9 }"
            class="mt-20"
          >
            <a-radio-group
              class="mt-5"
              name="radioGroup"
              :defaultValue="1"
              v-model="activeData.direction"
              @change="directionChange"
            >
              <a-radio :value="1">纵向</a-radio>
              <a-radio :value="2" class="pl-25">横向</a-radio>
            </a-radio-group>
          </a-form-item>
          <a-divider />
          <p>页边距</p>

          <div class="ant-form-inline pt-25">
            <a-form-item label="上" class="label-w">
              <a-input-number
                class="input-w"
                :defaultValue="activeData._pagemargin.UpTomm"
                v-model="activeData._pagemargin.UpTomm"
                :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                :parser="value => value.replace('mm', '')"
                @change="inputNumberChange($event,1,activeData._papersize.heightTomm,'_pagemargin.UpTomm')"
              ></a-input-number>
            </a-form-item>
            <a-form-item label="下" class="label-w">
              <a-input-number
                class="input-w"
                :defaultValue="activeData._pagemargin.DownTomm"
                v-model="activeData._pagemargin.DownTomm"
                :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                :parser="value => value.replace('mm', '')"
                @change="inputNumberChange($event,1,activeData._papersize.heightTomm,'_pagemargin.DownTomm')"
              ></a-input-number>
            </a-form-item>
          </div>

          <div class="ant-form-inline pt-25">
            <a-form-item label="左" class="label-w">
              <a-input-number
                class="input-w"
                :defaultValue="activeData._pagemargin.LeftTomm"
                v-model="activeData._pagemargin.LeftTomm"
                :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                :parser="value => value.replace('mm', '')"
                @change="inputNumberChange($event,1,activeData._papersize.widthTomm,'_pagemargin.LeftTomm')"
              ></a-input-number>
            </a-form-item>
            <a-form-item label="右" class="label-w">
              <a-input-number
                class="input-w"
                :defaultValue="activeData._pagemargin.RightTomm"
                v-model="activeData._pagemargin.RightTomm"
                :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                :parser="value => value.replace('mm', '')"
                @change="inputNumberChange($event,1,activeData._papersize.widthTomm,'_pagemargin.RightTomm')"
              ></a-input-number>
            </a-form-item>
          </div>
        </div>
        <div v-if="tabPosition==='header'">
          <a-tabs defaultActiveKey="1" @change="headerSwitch($event)">
            <a-tab-pane tab="页眉" key="1">
              <a-form-item label="页眉到顶部的距离" :label-col=" { span: 6 }" :wrapper-col="{ span: 6 }">
                <a-input-number
                  class="input-w"
                  v-model="activeData._headerfooter.header.marginTopTomm"
                  :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                  :parser="value => value.replace('mm', '')"
                ></a-input-number>
              </a-form-item>
              <p class="mt-20">先选中分区，再点击标签插入内容</p>
              <div class="mt-20 div-input">
                <div>左</div>
                <a-card
                  class="acard"
                  :class="{ 'active': activeDiv==='header_Left' }"
                  @click="selectCard('header_Left')"
                >
                  <span
                    v-show="activeData._headerfooter.header.align==='Left'"
                  >{{activeData._headerfooter.header.items.value.join(' ')}}</span>
                </a-card>
              </div>
              <div class="mt-20 div-input ml-15">
                <div>中</div>
                <a-card
                  class="acard"
                  :class="{ 'active': activeDiv==='header_Center' }"
                  @click="selectCard('header_Center')"
                >
                  <span
                    v-show="activeData._headerfooter.header.align==='Center'"
                  >{{activeData._headerfooter.header.items.value.join(' ')}}</span>
                </a-card>
              </div>
              <div class="mt-20 div-input ml-15">
                <div>右</div>
                <a-card
                  class="acard"
                  :class="{ 'active': activeDiv==='header_Right' }"
                  @click="selectCard('header_Right')"
                >
                  <span
                    v-show="activeData._headerfooter.header.align==='Right'"
                  >{{activeData._headerfooter.header.items.value.join(' ')}}</span>
                </a-card>
              </div>
              <div class="pt-25 clear">
                <a-button @click="Inser(1,'PageNum')">页码</a-button>
                <a-button class="ml-15" @click="Inser(1,'Total')">页数</a-button>
                <a-button class="ml-15" @click="Inser(1,'Date')">日期</a-button>
                <a-button class="ml-15" @click="Inser(1,'Time')">时间</a-button>
              </div>
            </a-tab-pane>
            <a-tab-pane tab="页脚" key="2" forceRender>
              <a-form-item label="页脚到底部的距离" :label-col=" { span: 6 }" :wrapper-col="{ span: 6 }">
                <a-input-number
                  class="input-w"
                  v-model="activeData._headerfooter.footer.marginTopTomm"
                  :formatter="value =>`${value.replace(/\D/g,'')}mm` "
                  :parser="value => value.replace('mm', '')"
                ></a-input-number>
              </a-form-item>
              <p class="mt-20">先选中分区，再点击标签插入内容</p>
              <div class="mt-20 div-input">
                <div>左</div>
                <a-card
                  class="acard"
                  :class="{ 'active': activeDiv==='footer_Left' }"
                  @click="selectCard('footer_Left')"
                >
                  <span
                    v-show="activeData._headerfooter.footer.align==='Left'"
                  >{{activeData._headerfooter.footer.items.value.join(' ')}}</span>
                </a-card>
              </div>
              <div class="mt-20 div-input ml-15">
                <div>中</div>
                <a-card
                  class="acard"
                  :class="{ 'active': activeDiv==='footer_Center' }"
                  @click="selectCard('footer_Center')"
                >
                  <span
                    v-show="activeData._headerfooter.footer.align==='Center'"
                  >{{activeData._headerfooter.footer.items.value.join(' ')}}</span>
                </a-card>
              </div>
              <div class="mt-20 div-input ml-15">
                <div>右</div>
                <a-card
                  class="acard"
                  :class="{ 'active': activeDiv==='footer_Right' }"
                  @click="selectCard('footer_Right')"
                >
                  <span
                    v-show="activeData._headerfooter.footer.align==='Right'"
                  >{{activeData._headerfooter.footer.items.value.join(' ')}}</span>
                </a-card>
              </div>
              <div class="pt-25 clear">
                <a-button @click="Inser(2,'PageNum')">页码</a-button>
                <a-button class="ml-15" @click="Inser(2,'Total')">页数</a-button>
                <a-button class="ml-15" @click="Inser(2,'Date')">日期</a-button>
                <a-button class="ml-15" @click="Inser(2,'Time')">时间</a-button>
              </div>
            </a-tab-pane>
          </a-tabs>
        </div>
        <div v-if="tabPosition==='bgImg'">
          <a-form-item style="margin-left: 40px;" class="pt-25" :wrapper-col="{ span: 10 }">
            <a-upload
              listType="picture-card"
              :defaultFileList="defaultFileList"
              :showUploadList="showUploadList"
              :multiple="false"
              :accept="acceptBgImg"
              :action="uploadUrl"
              :headers="header"
              :beforeUpload="beforeUpload"
              @change="handleChange"
            >
              <div v-if="ifShowUpload">
                <a-icon type="plus" />
                <div class="ant-upload-text">点击或拖拽上传</div>
              </div>
            </a-upload>
          </a-form-item>
          <div class="imgTips">
            <div>填充模式</div>
            <div class="tips">仅限上传1张图片，支持jpg，png，gif，jepg格式</div>
            <a-checkbox @change="onBgImgChange" :defaultChecked="activeData.isPrintBgImg">打印背景</a-checkbox>
          </div>
        </div>
        <div class="item-tool" v-if="tabPosition!='bgImg'">
          <span @click="showConfirm">
            恢复默认设置
            <i class="aufontAll h-icon-all-reload-o"></i>
          </span>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import { State, Action, Mutation, namespace } from "vuex-class";
import * as settingHelper from "./settings-helper";
// import AppsApi from "@/apis/apps";
import { Base64 } from "js-base64";
import { schema, renderer, runtime } from "@cloudpivot/form";

const PrintVuex = namespace("Print/Print");
@Component
export default class SettingModal extends Vue {
  @Prop({ type: Array, default: () => [] })
  paperSpecItem!: settingHelper.PaperSpecSize[];

  @Prop({ type: Object }) printMargin!: settingHelper.PageMargin;
  @Action("updatePageSettingData", { namespace: "Print/Print" })
  updatePageSettingData: any;

  @PrintVuex.State("pages") pages!: object[];
  // 是否显示弹出窗paperSpecItem
  visible: boolean = false;
  // 标签页激活，page页面设置，header页眉页脚设置，bgImg添加背景图片
  tabPosition: string = "page";
  // 纸张大小是否为自定义
  isCustom: boolean = false;
  activeDiv: string = "header_Center";
  imageUrl: settingHelper.bgImageUrl = {
    uid: "",
    name: "",
    status: "",
    url: ""
  };
  // 文件上传列表
  fileList: Array<any> = [];
  defaultFileList: object[] = [];
  ifShowUpload: boolean = true;
  isPrintBgimg: boolean = false;
  // 允许上传到的图片类型
  acceptBgImg: string = settingHelper.acceptBgImg;
  activeData: settingHelper.SettingData = settingHelper.getDefaultSettings();
  historyPageSize: settingHelper.PaperSpecSize | null = null;

  // 初始化页面状态
  InitData(): void {
    this.activeData._headerfooter.header.align !== ""
      ? (this.activeDiv = `header_${this.activeData._headerfooter.header.align}`)
      : (this.activeDiv = "header_Center");
  }
  get Init() {
    return this.InitData();
  }

  get uploadUrl() {
    return renderer.UploadControl.service.getUploadUrl();
  }
  get header() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`
    };
  }
  get showUploadList() {
    return { showPreviewIcon: false, showRemoveIcon: true };
  }

  showModal(): void {
    this.visible = true;
  }
  hideModal(): void {
    this.visible = false;
  }
  paperSizeChange(e): void {
    // 当为自定义纸张时候可编辑宽高
    // e === settingHelper.PaperSpecName.Custom;
    if (e === settingHelper.PaperSpecName.Custom) {
      this.isCustom = true;
    } else {
      this.isCustom = false;
    }
    let selectItem: settingHelper.PaperSpecSize[];
    selectItem = this.paperSpecItem.filter(
      (item: settingHelper.PaperSpecSize) => item.scale === e
    );
    if (
      selectItem[0].scale === settingHelper.PaperSpecName.Custom &&
      this.historyPageSize !== null &&
      this.historyPageSize.scale === settingHelper.PaperSpecName.Custom
    ) {
      this.activeData._papersize = this.historyPageSize;
    } else {
      this.activeData._papersize = selectItem[0];
    }

    this.directionChange();
  }
  // 保存事件
  save(): void {
    this.hideModal();
    // 毫米转换成像素
    this.activeData._papersize = settingHelper.paperSizeToPX(
      this.activeData._papersize
    );
    this.activeData._pagemargin = settingHelper.paperMarginToPX(
      this.activeData._pagemargin
    );
    this.activeData._headerfooter.header.marginTopTopx = settingHelper.mmToPX(
      this.activeData._headerfooter.header.marginTopTomm
    );
    this.activeData._headerfooter.footer.marginTopTopx = settingHelper.mmToPX(
      this.activeData._headerfooter.footer.marginTopTomm
    );
    this.activeData.bgImg = this.imageUrl;
    this.activeData.isPrintBgImg = this.isPrintBgimg;
    this.setPrintSettingData(Object.assign({}, this.activeData));
    // localStorage.setItem("print_pages", JSON.stringify(this.activeData));
    window.sessionStorage.setItem(
      `printSettings${this.$route.params.printCode}`,
      JSON.stringify(this.activeData)
    );
    this.updatePageSettingData(Object.assign(this.activeData,{code:this.$route.params.bizSchemaCode}));
    this.$message.success("设置成功");
  }
  // 恢复默认
  rest(): void {
    // 页面设置重置
    if (this.tabPosition === "page") {
      // 重置非自定义表单
      this.isCustom = false;
      this.activeData.direction = 1;
      this.activeData._papersize = Object.assign(
        {},
        this.paperSpecItem.filter(
          (item: settingHelper.PaperSpecSize) =>
            item.scale === settingHelper.PaperSpecName.A4
        )[0]
      );
      this.activeData._pagemargin = Object.assign({}, this.printMargin);
    } else if (this.tabPosition === "header") {
      let active: string = this.activeDiv.split("_")[0];
      active === "header"
        ? (this.activeDiv = "header_Center")
        : (this.activeDiv = "footer_Center");
      this.activeData._headerfooter.header = settingHelper.getDefaultHeaderFooter();
      this.activeData._headerfooter.footer = settingHelper.getDefaultHeaderFooter();
    }
  }

  showConfirm(): void {
    let that = this;
    this.$confirm({
      title: "确定恢复默认设置吗?",
      content: "页面将还原为默认设置",
      onOk() {
        that.rest();
      }
    });
  }
  // 方向切换
  directionChange(): void {
    let {
      widthTomm,
      heightTomm
    }: {
      widthTomm: number;
      heightTomm: number;
    } = this.activeData._papersize;

    // 根据纸张方向改变宽高
    if (widthTomm > heightTomm) {
      if (this.activeData.direction === 1) {
        this.activeData._papersize.widthTomm = heightTomm;
        this.activeData._papersize.heightTomm = widthTomm;
      }
    } else {
      if (this.activeData.direction === 2) {
        this.activeData._papersize.widthTomm = heightTomm;
        this.activeData._papersize.heightTomm = widthTomm;
      }
    }
  }
  headerSwitch(e): void {
    let data: settingHelper.HeaderFooter = this.activeData._headerfooter;
    // 获取历史操作状态
    switch (e) {
      case "1":
        if (data.header.align !== "") {
          this.activeDiv = `header_${data.header.align}`;
        } else {
          this.activeDiv = `header_Center`;
        }
        break;
      case "2":
        if (data.footer.align !== "") {
          this.activeDiv = `footer_${data.footer.align}`;
        } else {
          this.activeDiv = "footer_Center";
        }
        break;
    }
  }
  selectCard(value): void {
    this.activeDiv = value;
    let active: string[] = value.split("_");
    this.activeData._headerfooter[active[0]].align = active[1];
  }
  // 选择插入内容
  Inser(value: number, key: string): void {
    if (value === 1) {
    }

    value === 1
      ? this.fillData(value, key, this.activeData._headerfooter.header)
      : this.fillData(value, key, this.activeData._headerfooter.footer);
  }

  fillData(value: number, key: string, model: settingHelper.areaInsert): void {
    let align: string = this.activeDiv.split("_")[1];
    model.align = align;
    // 判断是否添加了内容
    let tempContent: string[] = model.items.key.filter(
      (item: string) => item === key
    );
    if (tempContent.length === 0) {
      model.items.key.push(key);
      model.items.value.push(`[${settingHelper.InserContent[key]}]`);
    }
  }

  /**
   * 文件上传前校验文件类型
   */
  beforeUpload(file: any) {
    const types = this.acceptBgImg.split(",");
    const fileType = file.name.substring(file.name.lastIndexOf("."));
    if (types.indexOf(fileType) === -1) {
      this.$message.error(`图片格式不正确`);
    }
    return types.indexOf(fileType) > -1;
  }

  handleChange(info) {
    if (info.file.status !== "uploading") {
      this.fileList = info.fileList;
    }
    if (info.file.status === "done") {
      // const url = renderer.UploadControl.service.getDownloadUrl(
      //   info.file.response.data
      // );
      this.imageUrl = {
        uid: info.file.response.data.refId,
        name: info.file.response.data.name,
        status: info.file.response.data.deleted,
        url: info.file.response.data.fileSize
      };
      this.ifShowUpload = false;
      this.defaultFileList[0] = info.file;
    }
    if (info.file.status === "removed") {
      this.defaultFileList = [];
      this.imageUrl = {
        uid: "",
        name: "",
        status: "",
        url: ""
      };
      this.ifShowUpload = true;
    }
  }

  @Emit("setPrintSettingData")
  setPrintSettingData(data: settingHelper.SettingData) {
    data = Object.assign({}, this.activeData);
  }
  @Watch("pages")
  setPageData() {
    let pageData: object[] = this.pages[0] as [];
    pageData.forEach((item: any, index) => {
      if (item.eleType === "pageSettings") {
        this.historyPageSize = Object.assign({}, item._papersize);
        this.activeData = Object.assign({}, item);
        // 图片url转换
        if (this.activeData.bgImg.uid !== "") {
          const file: renderer.H3File = {
            name: this.activeData.bgImg.name,
            refId: this.activeData.bgImg.uid,
            fileExtension: "",
            mimeType: "",
            storageMethod: ""
          };
          this.activeData.bgImg.url = renderer.UploadControl.service.getDownloadUrl(
            file
          );
          this.defaultFileList.push(this.activeData.bgImg);
          this.imageUrl = this.activeData.bgImg;
          this.ifShowUpload = false;
        }
        if (
          this.activeData._papersize.scale !==
          settingHelper.PaperSpecName.Custom
        ) {
          this.isCustom = false;
        } else {
          this.isCustom = true;
        }
      }
    });
  }

  onBgImgChange(e) {
    this.isPrintBgimg = e.target.checked;
  }

  inputNumberChange(value, min, max, model) {
    const keyArry: string[] = model.split(".");
    if (value < 1) {
      this.activeData[keyArry[0]][keyArry[1]] = min;
    }
    if (value > max) {
      this.activeData[keyArry[0]][keyArry[1]] = max;
    }
  }
}
</script>

<style lang="less">
.print-setting {
  .header-button {
    text-align: center;
    margin-top: -70px;
  }
  .modal-h {
    height: 420px;
  }
  .ant-radio-button-wrapper {
    height: 28px;
    line-height: 28px;
  }
  .ant-modal-header {
    padding-bottom: 35px;
  }
  .pt-25 {
    padding-top: 25px;
  }
  .mt-5 {
    margin-top: 6px;
  }
  .mt-20 {
    margin-top: 20px;
  }
  .ml-15 {
    margin-left: 15px;
  }
  .pl-25 {
    padding-left: 25px;
  }
  .input-w {
    width: 200px;
  }
  .ant-form-inline .ant-form-item-label {
    width: 72px;
  }
  p {
    font-weight: bold;
    color: #000;
    opacity: 0.85;
  }
  .item-tool {
    padding-top: 25px;
    color: #000;
    opacity: 0.85;
    span {
      cursor: pointer;
      &:hover {
        color: #17bc94;
      }
    }
  }
  .acard {
    width: 179px;
    height: 100px;
    margin-top: 8px;
  }
  .div-input {
    float: left;
    cursor: pointer;
    :hover {
      border-color: #38c9a0;
    }
  }
  .active {
    border-color: #38c9a0;
    outline: 0;
    box-shadow: 0 0 0 0.1rem rgba(23, 188, 148, 0.25);
  }
  .clear {
    clear: both;
  }
  .imgTips {
    margin-left: 40px;
    div {
      color: #000;
      opacity: 0.7;
      font-weight: 100;
    }
    .tips {
      margin-top: 10px;
      margin-bottom: 25px;
    }

    .ant-upload-drag {
      width: 110px;
      height: 110px;
    }
  }
  .ant-upload-list-item-info > span {
    width: 100%;
    height: 100%;
  }
}
</style>