<template>
  <div style="display: inline-block">
    <div
      class="biz-model"
      @click="openBizModel"
      v-if="itemData.type === 'Page'"
    >
      <a-popover
        placement="rightTop"
        trigger="click"
        :visible="isShowPop"
        overlayClassName="popover"
        @visibleChange="onVisibleChange($event,itemData.code)"
      >
        <template slot="content">
          <p @click="openEditModel(itemData)">{{ $t('languages.Apps.Edit') }}</p>
          <p
            @click="handleExport(itemData)"
            v-if="itemData.type === 'BizModel'"
          >{{ $t('languages.Apps.Export') }}</p>
          <p @click.stop="popModel(itemData)">{{ $t('languages.Apps.Delete') }}</p>
        </template>
        <i
          class="icon aufontAll h-icon-all-ellipsis-o setting"
          :class="{'isshow':showIcon&&iconCode===itemData.code}"
          @click.stop="()=>{}"
        ></i>
      </a-popover>
      <i class="biz-model-icon icon aufontAll" :class="itemData.icon"></i>
      <a-tooltip placement="top" v-if="showTootip(displayName)">
        <span slot="title">{{ displayName }}</span>
        <p class="biz-model-name" v-hight-light="{'keyWords': searchKey, 'value': displayName }"></p>
      </a-tooltip>
      <p
        class="biz-model-name"
        v-else
        v-hight-light="{'keyWords': searchKey, 'value': displayName }"
      ></p>

      <!-- <div class="biz-model-unpublished">
        <a-tooltip placement="top">
          <template slot="title">
            <span>数据模型、表单设计、列表设计”未发布 请前往发布</span>
          </template>
          <img src="@/assets/images/unpublished.png">
        </a-tooltip>
      </div> -->
    </div>

    <router-link
      class="biz-model"
      v-else
      :to="to"
      target="_blank"
    >
      <a-popover
        placement="rightTop"
        trigger="click"
        :visible="isShowPop"
        overlayClassName="popover"
        @visibleChange="onVisibleChange($event,itemData.code)"
      >
        <template slot="content">
          <p @click="openEditModel(itemData)">{{ $t('languages.Apps.Edit') }}</p>
          <p
            @click="handleExport(itemData)"
            v-if="itemData.type === 'BizModel'"
          >{{ $t('languages.Apps.Export') }}</p>
          <p @click.stop="popModel(itemData)">{{ $t('languages.Apps.Delete') }}</p>
        </template>
        <i
          class="icon aufontAll h-icon-all-ellipsis-o setting"
          :class="{'isshow':showIcon&&iconCode===itemData.code}"
          @click.stop="()=>{}"
        ></i>
      </a-popover>
      <i class="biz-model-icon icon aufontAll" :class="itemData.icon"></i>
      <a-tooltip placement="top" v-if="showTootip(displayName)">
        <span slot="title">{{ displayName }}</span>
        <p class="biz-model-name" v-hight-light="{'keyWords': searchKey, 'value': displayName }"></p>
      </a-tooltip>
      <p
        class="biz-model-name"
        v-else
        v-hight-light="{'keyWords': searchKey, 'value': displayName }"
      ></p>
      <template v-if="itemData.type === 'BizModel'">
        <div class="biz-model-unpublished" v-if="!itemData.published">
          <a-tooltip placement="top">
            <template slot="title">
              <span>数据模型和列表设计未发布，请前往发布</span>
            </template>
            <img src="@/assets/images/unpublished.svg">
          </a-tooltip>
        </div>
      </template>
      
    </router-link>

    <!-- 编辑业务模型弹窗 -->
    <UpdateBizModel
      v-model="showUpdateModel"
      :updateModelData="updateModelData"
      @resetBizModel="resetBizModel"
    ></UpdateBizModel>

    <!-- 新建自定义页面 -->
    <add-define-page
      :isShowDefinePage="isShowDefinPage"
      :appCode="itemData.appCode"
      :parentId="itemData.parentId"
      :code="itemData.code"
      @cancel="closeDefinePage"
      v-if="isShowDefinPage"
    />

    <!-- 新建报表弹窗 -->
    <AddReport v-model="showAddReport" :model="model"></AddReport>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";
import { State, Action, Mutation, namespace } from "vuex-class";
import { getRealLength } from "@/common/utils";
import UpdateBizModel from "@/components/apps/modals/updateBizModel.vue";
import AddDefinePage from "@/components/apps/modals/add-define-page.vue";
import AddReport from "@/components/apps/modals/addReport.vue";

import AppsApi from "@/apis/apps";

import * as formApi from "@/apis/form";
import * as listApi from "@/apis/list/list.api";
import WorkflowApi from "@/apis/workflow";
import { Download, LanguageTransform } from "@/utils";

import * as ModelAction from "@/typings/model-action";

const MenuModule = namespace("Apps/AppItem");
const icon = require("@/assets/images/appicon.png");

@Component({
  name: "bizModel",
  components: {
    UpdateBizModel,
    AddDefinePage,
    AddReport
  }
})
export default class BizModel extends Vue {
  @MenuModule.State("appInfo") appInfo: any;

  @MenuModule.Action("deleteBizModel") deleteBizModel: any;

  @MenuModule.Action("validBizModel") validBizModel: any;

  @MenuModule.Action("getAppItem") getAppItem: any;

  @MenuModule.Action("deleteReport") deleteReport: any;

  @Prop() itemData!: any;

  @Prop() searchKey!: string;

  defaultAppIcon: any = icon;

  // 业务模型默认图标
  isClose: boolean = false;

  showIcon: boolean = false;

  iconCode: string = "";

  currentItemID: string = "";

  showUpdateModel: boolean = false;

  // 模型弹框
  updateModelData: any = {};

  bizModelData: any = {};

  isShowPop: boolean = false;

  isShowDefinPage: boolean = false; // 自定义页面弹框

  showAddReport = false;

  model: any = "";

  // displayName: string = ''; // 当前多语言对应展示名称

  // definePage = {
  //   code: '233',
  //   id: '2233'
  // }

  get to() {
    if (this.itemData) {
      const type = this.itemData.type;
      if (type === "BizModel") {
        return `/apps/model/${this.appCode}/${this.itemData.code}/dispatcher`;
      } else if (type === "Report") {
        return `/apps/${this.appCode}/report-design/${this.itemData.code}`;
      }
    }

    return "";
  }

  get appCode() {
    return this.$route.params.appCode;
  }

  openEditModel(item: any) {
    // 打开编辑业务模型模态窗
    item.showPop = false;
    this.isShowPop = false;
    this.showIcon = false;
    this.updateModelData = item;

    switch (item.type) {
      case ModelAction.ModelType.BizModal:
        this.showUpdateModel = true;
        break;
      case ModelAction.ModelType.Page:
        this.isShowDefinPage = true;
        break;
      case ModelAction.ModelType.Report:
        this.showAppReport(item);
        break;
      default:
        break;
    }
  }

  showAppReport(item: any) {
    const closeLoad = (this.$message as any).loading();

    AppsApi.getAppReport({
      code: item.code
    }).then(
      (res: any) => {
        closeLoad();
        if (res.errcode === 0) {
          this.showAddReport = true;
          this.model = res.data;
          this.model.parentId = item.parentId;
        } else {
          this.$message.error(res.errmsg);
        }
      },
      () => closeLoad()
    );
  }

  /**
   * 打开自定义页面弹框
   */
  openDefinePage() {
    this.isShowDefinPage = true;
  }

  /**
   * 关闭自定义页面弹框
   */
  closeDefinePage(item?: any) {
    this.isShowDefinPage = false;
    if (item) {
      this.setDisplayName(item);
    }
  }

  /* *
   * 重置传入业务模型模态窗的数据
   */
  resetBizModel(item: any) {
    // debugger
    console.log("item", item);
    this.updateModelData = {};
    // if (item && item.modelCode) {
    //   this.bizModelData = Object.assign({}, this.bizModelData, item);
    // }
    // this.setDisplayName(item);
  }

  /* *
   * 删除业务模型
   */
  popModel(item: any) {
    if (this.isClose) {
      // 避免重复点击删除弹窗
      return;
    }
    this.isShowPop = false;
    this.showIcon = false;
    item.showPop = false;
    this.isClose = true;
    if (item.type === "BizModel") {
      this.goDeleteBizmodel(item);
    } else if (item.type === "Page") {
      this.deleteDefinePage(item);
    } else if (item.type === "Report") {
      this.deleteReportConfirm(item);
    }
  }

  deleteReportConfirm(item: any) {
    const vm: any = this;
    this.$confirm({
      title: this.$t("languages.Apps.ConfirmDelete", { name: item.name }),
      okText: this.$t("languages.Apps.Ok").toString(),
      cancelText: this.$t("languages.Apps.Cancel").toString(),
      onOk() {
        vm.isClose = false;
        const params = {
          code: item.code
        };
        AppsApi.deleteAppReport(params).then((res: any) => {
          if (res.errcode === 0) {
            vm.$message.success("删除成功!");
            // 刷新数据项
            vm.getAppItem({ appCode: item.appCode });
          } else {
            vm.$message.error(res.errmsg);
          }
        });
      },
      onCancel() {
        vm.isClose = false;
      }
    });
  }

  /**
   * 删除自定义页面
   */
  deleteDefinePage(item: any) {
    const vm: any = this;
    this.$confirm({
      title: this.$t("languages.Apps.ConfirmDelete", { name: item.name }),
      okText: this.$t("languages.Apps.Ok").toString(),
      cancelText: this.$t("languages.Apps.Cancel").toString(),
      onOk() {
        vm.isClose = false;
        const params = {
          code: item.code
        };
        AppsApi.deleteDefinePage(params).then((res: any) => {
          if (res.errcode === 0) {
            vm.$message.success("删除成功!");
            // 刷新数据项
            vm.getAppItem({ appCode: item.appCode });
          } else {
            vm.$message.error(res.errmsg);
          }
        });
      },
      onCancel() {}
    });
  }

  /**
   * 删除业务模型
   */
  goDeleteBizmodel(item: any) {
    const vm: any = this;
    const validModelParams: Apps.AppItem.ValidBizModel = {
      bizModelId: item.id,
      appCode: this.appInfo.appCode
    };
    const deleteModelParams: Apps.AppItem.DeleteBizModel = {
      bizModelId: item.id
    };
    this.validBizModel(validModelParams).then((res: Common.Data) => {
      if (res.errcode) {
        /* 删除模型 —— 模型下有业务数据 */
        const errorTips = {
            1: '该模型下已经创建了业务数据，不能被删除，请先删除业务数据！',
            2: '当前模型与以下模型存在关联关系，请先解除关联关系后再删除模型:'
          }
        function renderTips(h) {
          const tips:any = []
          const errTypes:number[] = res.data.errTypes;
          errTypes.forEach((tip,index) => {
            if (tip === 1) {
              tips.push(h('p', `${index + 1}、${errorTips[tip]}`));
            } else {
              const schemaMessageList:any[] = [];
              res.data.schemaMessageList.forEach(s => {
                schemaMessageList.push(h('p', `${s.appPackage.name}-${s.appFunction.name}`));
              });
              tips.push(h('p', `${index + 1}、${errorTips[tip]}`), schemaMessageList);
            }
            
          });
          return h('div',{
            'class': {
              warningtips: true
            },
          }, tips
          )
        }
        this.$error({
          title: '检查出以下错误，全部修正才可以删除！', //this.$t("languages.Apps.DeletePrompt")
          okText: this.$t("languages.Apps.Ok").toString(),
          cancelText: this.$t("languages.Apps.Cancel").toString(),
          content: renderTips,
          // content: this.$t("languages.Apps.ModelHasBizDataCannotBeDelete"), // 该模型下已经创建了业务数据，不能被删除，请先删除业务数据!
          onOk() {
            vm.isClose = false;
          },
          onCancel() {
            vm.isClose = false;
          }
        });
      } else {
        /* 删除模型 —— 模型下无业务数据 */
        this.$confirm({
          title: this.$t("languages.Apps.ConfirmDelete", {
            name: vm.displayName
          }),
          okType: "danger",
          okText: this.$t("languages.Apps.Delete").toString(),
          cancelText: this.$t("languages.Apps.Cancel").toString(),
          onOk() {
            vm.isClose = false;
            vm.deleteBizModel(deleteModelParams).catch((e: any) => {
              if (e.errcode === 402508) {
                vm.$message.error(
                  vm.$t("languages.Apps.DataModelDeleteErrorTip1")
                );
              } else if (e.errcode === 304004) {
                vm.$message.error(
                  vm.$t("languages.Apps.DataModelDeleteErrorTip2")
                );
              } else if (e.errcode > 0) {
                vm.$message.error(vm.$t("languages.Apps.DataModelDeleteError"));
              }
            });
            vm.currentItemID = item.parentId;
            // vm.openMenuContent(item.parentId);
          },
          onCancel() {
            vm.isClose = false;
          }
        });
      }
    });
  }

  // 打开数据模型页面
  /**
   * 20190305 新增业务模型页面定位功能
   */
  async openBizModel() {
    if (!this.appInfo.appCode) {
      return;
    }

    if (this.itemData.type === "Page") {
      this.openDefinePage();
      return;
    }

    const modelActions = this.getModelActions();
    const bizSchemaCode = this.itemData.code;
    let isExist: boolean = true; // 当前项的code是否存在数据库中
    let data: any; // 请求到的数据库最新记录
    let href: string = ""; // 跳转链接
    const hashPrefix = "/admin#";
    if (modelActions) {
      // 根据本地的code判断当前项是否在数据库中
      // todo: 默认表单目前取的第一个，完成默认表单功能需改正
      const record: ModelAction.ModelActionItem = modelActions.find(
        (item: ModelAction.ModelActionItem) =>
          item.bizSchemaCode === bizSchemaCode
      );
      if (record) {
        const { type, code } = record;
        switch (type) {
          case ModelAction.ModalActionTypes.DataModel:
            data = [];
            isExist = true;
            href = `${hashPrefix}/apps/model/${this.appInfo.appCode}/${bizSchemaCode}/data`;
            break;
          case ModelAction.ModalActionTypes.Form:
            data = await this.getFormList(bizSchemaCode);
            isExist = data.some((item: any) => item.code === code);
            href = `${hashPrefix}/apps/model/${
              this.appInfo.appCode
            }/${bizSchemaCode}/form-design/${isExist ? code : data[0].code}`;
            break;
          case ModelAction.ModalActionTypes.Workflow:
            data = await this.getWorkflowList(bizSchemaCode);
            isExist = data.some((item: any) => item.workflowCode === code);
            if (!isExist && !data.length) {
              const formData = await this.getFormList(bizSchemaCode);
              href = `${hashPrefix}/apps/model/${this.appInfo.appCode}/${bizSchemaCode}/form-design/${formData[0].code}`;
            } else {
              href = `${hashPrefix}/apps/model/${
                this.appInfo.appCode
              }/${bizSchemaCode}/workflowDesign/${
                isExist ? code : data[0].workflowCode
              }`;
            }
            break;
          case ModelAction.ModalActionTypes.List:
            data = await this.getLists(bizSchemaCode);
            isExist = data.some((item: any) => item.code === code);
            href = `${hashPrefix}/apps/model/${
              this.appInfo.appCode
            }/${bizSchemaCode}/list-design/${isExist ? code : data[0].code}`;
            break;
          default:
            break;
        }
        if (!isExist) {
          // 删除这条记录
          const newAction: Array<
            ModelAction.ModelActionItem
          > = modelActions.filter((item: any) => item.code === code);
          this.updateModelAction(newAction);
        }
      } else {
        data = await this.getFormList(bizSchemaCode);
        href = `${hashPrefix}/apps/model/${this.appInfo.appCode}/${bizSchemaCode}/form-design/${data[0].code}`;
      }
    } else {
      // 没有记录，直接跳默认表单
      data = await this.getFormList(bizSchemaCode);
      href = `${hashPrefix}/apps/model/${this.appInfo.appCode}/${bizSchemaCode}/form-design/${data[0].code}`;
    }
    // debugger
    const newWindow: any = window.open();
    newWindow.location.href = href;
    // window.open(href, '_blank');
  }

  /**
   * @desc 获取最新表单列表
   * @params bizSchemaCode 业务模型编码
   */
  async getFormList(schemaCode: string) {
    const res = await formApi.list(schemaCode);
    if (res.errcode === 0) {
      return res.data;
    }
    return null;
  }

  /**
   * @desc 获取最新流程列表
   * @params bizSchemaCode 业务模型编码
   */
  async getWorkflowList(schemaCode: string) {
    const params = {
      schemaCode
    };
    const res = await WorkflowApi.getWorkflowList(params);
    if (res.errcode === 0) {
      return res.data;
    }
    return null;
  }

  /**
   * @desc 获取最新表单列表
   * @params bizSchemaCode 业务模型编码
   */
  async getLists(schemaCode: string) {
    const res = await listApi.getList(schemaCode);
    if (res.errcode === 0) {
      return res.data;
    }
    return null;
  }

  /**
   * 获取本地存储中的记录
   */
  getModelActions() {
    const modelActions = window.localStorage.getItem("ModelAction") as string;
    if (!modelActions) return null;
    return JSON.parse(modelActions);
  }

  /**
   * 更新记录
   */
  updateModelAction(newAction: Array<ModelAction.ModelActionItem>) {
    window.localStorage.setItem("ModelAction", JSON.stringify(newAction));
  }

  onVisibleChange(visible: boolean, code: string) {
    this.isShowPop = visible;
    this.showIcon = visible;
    this.iconCode = code;
  }

  // 应用名称超过20个字节时显示tooltip
  showTootip(name: string) {
    return getRealLength(name) > 20;
  }

  /**
   * 导出操作
   */
  async handleExport(item: any) {
    this.isShowPop = false;
    this.showIcon = false;
    if (!item) return;
    item.showPop = false;
    const schemaCode = item.code;
    const res: any = await AppsApi.export_package({ schemaCode });
    if (res.errcode && res.errcode !== 0) {
      this.$message.error(this.$t("languages.Apps.ExportError"));
    } else {
      const fileStream: any = res;
      const fileType: string = "application/xml";
      const fileName: string = `${item.name}.xml`;
      Download.downloadByPost(fileStream, fileType, fileName);
    }
  }

  get displayName() {
    if (!this.itemData) {
      return "";
    }
    const target: any = this.itemData;
    const name = LanguageTransform.getLang(target.name, target.name_i18n);
    return name;
  }

  setDisplayName(item?: any) {
    // if (!this.itemData && !item) {
    //   this.displayName = '';
    // }
    // const target:any = item || this.itemData;
    // this.displayName = LanguageTransform.getLang(target.name, target.name_i18n);
  }

  @Watch("$i18n.locale")
  onLangChange() {
    this.setDisplayName();
  }

  mounted() {
    this.bizModelData = this.itemData;
    this.setDisplayName();
  }
}
</script>

<style lang="less" scoped>
.biz-model {
  position: relative;
  display: inline-block;
  vertical-align: top;
  text-align: center;
  width: 172px;
  height: 122px;
  margin: 12px 24px 12px 0;
  padding-top: 28px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 1);
  // border:1px solid @primary-color;
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Chrome/Safari/Opera */
  -khtml-user-select: none; /* Konqueror */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently
  not supported by any browser */
  cursor: pointer;
  &:hover {
    //box-shadow: inset 0 0 0 1px @primary-color, 0px 4px 12px 0px rgba(7, 98, 23, 0.15);
    box-shadow: inset 0 0 0 1px @primary-color;
    .setting {
      visibility: visible;
    }
  }
  &-icon {
    display: inline-block;
    font-size: 28px;
    margin-bottom: 16px;
    border-radius: 8px;
  }
  &-name {
    width: 90%;
    margin: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 20px;
    color: @text-color-secondary;
  }
  &-unpublished {
    position: absolute;
    top: -4px;
    left:-4px;
    img {
      width: 54px;
      height: 54px;
    }
  }
  .setting {
    position: absolute;
    z-index: 9;
    top: 8px;
    right: 8px;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
    visibility: hidden;
    cursor: pointer;
    &:hover {
      color: @primary-color;
    }
  }
  .isshow {
    visibility: visible !important;
  }
}
</style>
<style lang="less">
.ant-modal-confirm-content {
  .warningtips{
    background:rgba(245,34,45,0.06);
    border-radius:4px;
    border:1px solid rgba(245,34,45,0.08);
    padding: 8px 12px;
  }
}
</style>