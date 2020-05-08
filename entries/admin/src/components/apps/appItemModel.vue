<template>
  <div class="business-model">
    <!-- 应用业务模型组件界面 -->
    <h3 class="model-header">{{ curModelData.name }}</h3>
    <div class="model-content">
      <!-- 数据模型 -->
      <div class="model-content-block">
        <p class="block-title">{{ $t('languages.Apps.DataModel') }}</p>
        <ul class="block-list">
          <li @click="openBizModel">
            <i class="icon aufontAll h-icon-all-database-o data"/>
            <p class="item-name">{{ $t('languages.Apps.DataModel') }}</p>
          </li>
        </ul>
      </div>
      <!-- 表单管理 -->
      <div class="model-content-block">
        <p class="block-title">{{ $t('languages.Apps.FormManagement') }}</p>
        <ul class="block-list">
          <li
            v-for="form in forms"
            :key="form.code"
            @click="openFormPage(form)"
          >
            <span class="item-opera">
              <i
                class="icon aufontAll h-icon-all-delete-o"
                @click.stop="openDeleteConfirm(1,form.code,form.name)"
              />
              <i class="icon aufontAll h-icon-all-form-o" @click.stop="editForm(form.code)"/>
            </span>
            <i
              class="icon aufontAll form"
              :class="[ form.icon ? form.icon : 'h-icon-all-operation-log-o' ]"
            />
            <p class="item-name">{{ form.name }}</p>
          </li>
          <li @click.stop="addItem(1)">
            <i class="icon aufontAll h-icon-all-plus-o"/>
            <p class="item-name">{{ $t('languages.Apps.Add') }}</p>
          </li>
        </ul>
      </div>

      <!-- 流程管理 -->
      <div class="model-content-block">
        <p class="block-title">{{ $t('languages.Apps.WorkflowManagement') }}</p>
        <ul class="block-list">
          <li
            v-for="(workflow, index) in workflowList"
            :key="index"
            @click="openWorkflowPage(workflow.workflowCode)"
          >
            <span class="item-opera">
              <i class="icon aufontAll h-icon-all-delete-o" @click.stop="popItem(2, workflow)"/>
              <i
                class="icon aufontAll h-icon-all-form-o"
                @click.stop="editItem(2, workflow.workflowCode)"
              />
            </span>
            <i :class="'icon aufontAll workflow ' + workflow.icon"/>
            <a-tooltip placement="top" v-if="showTootip(workflow.workflowName)">
              <span slot="title">{{ workflow.workflowName }}</span>
              <p class="item-name">{{ workflow.workflowName }}</p>
            </a-tooltip>
            <p class="item-name" v-else>{{ workflow.workflowName }}</p>
          </li>
          <li @click.stop="addItem(2)">
            <i class="icon aufontAll h-icon-all-plus-o"/>
            <p class="item-name">{{ $t('languages.Apps.Add') }}</p>
          </li>
        </ul>
      </div>

      <!-- 列表管理 -->
      <div class="model-content-block">
        <p class="block-title">{{ $t('languages.Apps.ListManagement') }}</p>
        <ul class="block-list">
          <li
            v-for="(list, index) in lists"
            :key="index"
            @click="openListPage(list.code)"
          >
            <span class="item-opera">
              <i
                v-if="lists.length>1"
                class="icon aufontAll h-icon-all-delete-o"
                @click.stop="openDeleteConfirm(3,list.code,list.name)"
              />
              <i class="icon aufontAll h-icon-all-form-o" @click.stop="editList(list.code)"/>
            </span>
            <i
              class="icon aufontAll form"
              :class="[ list.icon ? list.icon : 'h-icon-all-list-work-o' ]"
            />
            <!-- <i class="icon aufontAll h-icon-all-list-work-o list"/> -->
            <p class="item-name">{{ list.name }}</p>
          </li>
          <li @click.stop="addItem(3)">
            <i class="icon aufontAll h-icon-all-plus-o"/>
            <p class="item-name">{{ $t('languages.Apps.Add') }}</p>
          </li>
        </ul>
      </div>
    </div>
    <AddFormModal
      v-model="isShowAddFormModal"
      :data="curItemData"
      :schemaCode="code"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <AddWorkflowModal
      v-model="isShowAddWorkflowModal"
      :data="curWorkflowData"
      :schemaCode="code"
      @confirm="handleConfirmWorkflow"
      @cancel="handleCancelWorkflow"
    />

    <AddListModal
      :schemaCode="code"
      v-model="isShowListModal"
      :data="curListData"
      @confirm="handleConfirmList"
      @cancel="handleCancelList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { getRealLength } from '@/common/utils';
import AddFormModal from '@/components/apps/modals/addForm.vue';
import AddWorkflowModal from '@/components/apps/modals/addWorkflow.vue';
import AddListModal from '@/components/apps/modals/addList.vue';
import appitem from '@/store/modules/app/appitem';
import AppItem from '@/views/app/center/appitem.vue';

import * as formApi from '@/apis/form';

import * as listApi from '@/apis/list/list.api';

import * as AppErrors from '@/typings/app-error';

const AppItemModule = namespace('Apps/AppItem');

@Component({
  name: 'AppItemModel',
  components: {
    AddFormModal,
    AddWorkflowModal,
    AddListModal
  }
})
export default class AppItemModel extends Vue {
  @AppItemModule.Action('getWorkflowList') getWorkflowList: any;
  @AppItemModule.Action('getWorkflowDetail') getWorkflowDetail: any;
  @AppItemModule.Action('deleteWorkflow') deleteWorkflow: any;

  @Prop() bizModelData!: any;
  @Prop() code!: string;
  isShowAddFormModal: boolean = false;
  isShowAddWorkflowModal: boolean = false;
  isShowListModal: boolean = false;
  curItemData: any = {};
  curModelData: any = {};
  curWorkflowData: any = {};
  curListData: any = {};
  manageType: any = {
    form: 1,
    workflow: 2,
    list: 3
  };
  workflowList: Array<Apps.Workflow.workflowList> = [];
  schemaCode: string = '';

  forms = [];
  lists = [];

  appCode:string = '';

  /* methods */
  beforeMount() {
    if (this.$route.params && this.$route.params.appCode) {
      this.appCode = this.$route.params.appCode;
    }
  }

  showTootip(name: string) {
    /* 应用名称超过20个字节时显示tooltip */
    console.log(name);
    return getRealLength(name) > 20;
  }

  /*  1: 表单  2: 流程  3: 列表 */
  addItem(type: number) {
    switch (type) {
      case this.manageType.form:
        this.curItemData = {};
        this.isShowAddFormModal = true;
        break;

      case this.manageType.workflow:
        this.curWorkflowData = {};
        this.isShowAddWorkflowModal = true;
        break;

      case this.manageType.list:
        this.curListData = {};
        this.isShowListModal = true;
        break;

      default:
        break;
    }
  }

  popItem(type: number, data: any) {
    this.openDeleteConfirm(type, data.workflowCode, data.workflowName);
  }

  editItem(type: number, data: any) {
    switch (type) {
      case this.manageType.form:
        this.editForm(data.code);
        break;

      case this.manageType.workflow:
        this.isShowAddWorkflowModal = true;
        this.handleGetWorkflowDetail(data);
        break;

      case this.manageType.list:
        this.isShowListModal = true;
        this.curListData = {
          id: 1,
          listName: 'listName',
          listCode: 'listCode',
          icon: ''
        };
        break;

      default:
        break;
    }
  }

  openDeleteConfirm(type: number, code: string, name: string) {
    const vm = this;
    /* 删除单项 */
    this.$confirm({
      title: this.$t('languages.Apps.ConfirmDelete', {
        name
      }), // `确定要删除“${'默认表单'}”吗？`,
      okType: 'danger',
      okText: this.$t('languages.Apps.Delete').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        switch (type) {
          case 1:
            vm.deleteForm(code);
            break;
          case 2:
            vm.handleDeleteWorkflow(code);
            break;
          case 3:
            vm.deleteList(code);
            break;
          default:
            break;
        }
      }
    });
  }

  openBizModel() {
    // 打开数据模型页面
    if (!this.appCode) {
      return;
    }
    const { href } = this.$router.resolve({
      name: 'bizmodel',
      params: {
        appCode: this.appCode,
        bizSchemaCode: this.curModelData.code
      }
    });
    window.open(href, '_blank');
  }

  openFormPage(form: any) {
    const _this = this;
    formApi.get(this.schemaCode, form.code).then((res: any) => {
      if (res.data.sheetType === 1) {
        _this.curItemData = res.data;
        _this.isShowAddFormModal = true;
      } else {
        if (!this.appCode) {
          return;
        }
        const { href } = this.$router.resolve({
          name: 'form-design',
          params: {
            appCode: this.appCode,
            bizSchemaCode: this.curModelData.code,
            sheetCode: form.code
          }
        });
        window.open(href, '_blank');
      }
    });
  }

  openListPage(code:any) {
    // 打开数据模型页面
    if (!this.appCode) {
      return;
    }
    const { href } = this.$router.resolve({
      name: 'list-design',
      params: {
        appCode: this.appCode,
        bizSchemaCode: this.curModelData.code,
        code
      }
    });
    window.open(href, '_blank');
  }

  getForms() {
    const _this = this;
    formApi.list(this.schemaCode).then((res: any) => {
      _this.forms = res.data;
    });
  }
  getLists() {
    const _this = this;
    listApi.getList(this.schemaCode).then((res: any) => {
      _this.lists = res.data;
    });
  }

  editForm(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    formApi.get(this.schemaCode, code).then((res: any) => {
      _this.curItemData = res.data;
      _this.isShowAddFormModal = true;
      hideLoader();
    });
  }
  editList(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    listApi.get(this.schemaCode, code).then((res: any) => {
      _this.curListData = res.data;
      _this.isShowListModal = true;
      hideLoader();
    });
  }

  deleteForm(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    formApi
      .remove(this.schemaCode, code)
      .then((res: any) => {
        hideLoader();
        _this.$message.success(_this.$t('languages.DeleteSuccess'));
        _this.getForms();
      })
      .catch((e:any) => {
        if (e.errcode === 50000) return;
        // 不可删除逻辑
        if (e.errcode && e.errcode > 0 && e.data.length > 0) {
          const errMsg:any = e.data[0];
          const errorCode:number = errMsg.errCode;
          const errorContent:string = errMsg.errContent;
          this.handleDisplayError(errorCode, errorContent);
        }
      })
      .finally(() => hideLoader());
  }

  // 删除列表
  deleteList(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    listApi
      .remove(this.schemaCode, code)
      .then((res: any) => {
        hideLoader();
        _this.$message.success(_this.$t('languages.DeleteSuccess'));
        _this.getLists();
      })
      .catch((e:any) => {
        // 不可删除逻辑
        if (e.errcode === 50000) return;
        if (e.errcode && e.errcode > 0 && e.data.length > 0) {
          const errMsg:any = e.data[0];
          const errorCode:number = errMsg.errCode;
          const errorContent:string = errMsg.errContent;
          this.handleDisplayError(errorCode, errorContent);
        }
      })
      .finally(() => hideLoader());
  }

  openWorkflowPage(code: string) {
    if (!this.appCode) {
      return;
    }
    const { href } = this.$router.resolve({
      name: 'workflowDesign',
      params: {
        appCode: this.appCode,
        bizSchemaCode: this.curModelData.code,
        workflowCode: code
      }
    });
    window.open(href);
  }

  handleConfirm() {
    this.getForms();
    this.isShowAddFormModal = false;
  }
  handleCancel() {
    this.isShowAddFormModal = false;
  }
  handleConfirmWorkflow() {
    this.handleGetWorkflowList();
    this.isShowAddWorkflowModal = false;
  }
  handleCancelWorkflow() {
    this.isShowAddWorkflowModal = false;
  }
  handleConfirmList() {
    this.getLists();
    this.isShowListModal = false;
  }
  handleCancelList() {
    this.isShowListModal = false;
  }

  // 创建流程
  // hanleCreateWorkflow(data:Apps.AppCenter.CreateWorkflowParams) {
  //   this.createWorkflow(data).then((res:Common.Data) => {
  //       if (res.errcode === 0) { // 添加完成
  //         this.handleGetWorkflowList();
  //       }
  //     });
  // }

  // 获取流程列表
  handleGetWorkflowList() {
    const params: Apps.Workflow.WorkflowSchemaCode = {
      schemaCode: this.schemaCode
    };
    this.getWorkflowList(params).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        this.workflowList = res.data;
      } else {
        this.workflowList = [];
      }
    });
  }

  // 获取流程明细
  handleGetWorkflowDetail(code: string) {
    const params: Apps.Workflow.WorkflowCode = { workflowCode: code };
    this.getWorkflowDetail(params).then((res: any) => {
      if (res.errcode === 0) {
        this.curWorkflowData = res.data;
      }
    });
  }

  // 删除流程
  handleDeleteWorkflow(code: any) {
    const params: any = { workflowCode: code };
    this.deleteWorkflow(params).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success(res.errmsg);
        this.handleGetWorkflowList();
      } else if (res.errcode && res.errcode > 0 && res.data.length > 0) {
        // 不可删除逻辑
        const errMsg:any = res.data[0];
        const errorCode:number = errMsg.errCode;
        const errorContent:string = errMsg.errContent ? errMsg.errContent : '';
        this.handleDisplayError(errorCode, errorContent);
      }
    });
  }


  /**
   * 处理错误提示
   * @param errcode 错误代码
   * @param errContent 错误信息
   */
  handleDisplayError(errcode:number, errContent:string) {
    let _errString:any;
    if (errContent.indexOf(':') > -1) {
      _errString = errContent.split(':');
    } else {
      _errString = errContent;
    }
    switch (errcode) {
      // 表单删除
      case AppErrors.ErrorCodes.FormBindByActivity:
        this.displayError(this.$t('languages.Apps.FormBindByActivity', { workflow: _errString[0], activity: _errString[1] }));
        break;
      case AppErrors.ErrorCodes.FormBindByDraftWorkflow:
        this.displayError(this.$t('languages.Apps.FormBindByDraftWorkflow', { workflow: _errString[0], activity: _errString[1] }));
        break;
      case AppErrors.ErrorCodes.FormBindByList:
        this.displayError(this.$t('languages.Apps.FormBindByList', { list: _errString, }));
        break;
      case AppErrors.ErrorCodes.DefaultForm:
        this.displayError(this.$t('languages.Apps.DefaultForm'));
        break;

      // 流程删除
      case AppErrors.ErrorCodes.WorkflowBindByList:
        this.displayError(this.$t('languages.Apps.WorkflowBindByList', { list: _errString }));
        break;
      case AppErrors.ErrorCodes.WorkflowBindAsSubWorkflowDraft:
        this.displayError(this.$t('languages.Apps.WorkflowBindAsSubWorkflowDraft', { list: _errString }));
        break;
      case AppErrors.ErrorCodes.WorkflowBindAsSubWorkflow:
        this.displayError(this.$t('languages.Apps.WorkflowBindAsSubWorkflow', { list: _errString }));
        break;
      case AppErrors.ErrorCodes.WorkflowInstanceExist:
        this.displayError(this.$t('languages.Apps.WorkflowInstanceExist'));
        break;

      // 列表删除
      case AppErrors.ErrorCodes.DefaultList:
        this.displayError(this.$t('languages.Apps.DefaultList'));
        break;

      default:
        break;
    }
  }


  /**
   * 展示错误提示
   * @param content 错误信息
   */
  displayError(content:any) {
    if (!content) return;
    this.$warning({
      title: content,
      okText: this.$t('languages.Apps.DeleteOk').toString()
    });
  }

  @Watch('bizModelData', { deep: true })
  onBizModelDataChange(v: any) {
    if (v.catalogues) {
      this.curModelData.name = v.modelName;
      this.curModelData.code = v.modelCode;
    } else {
      this.curModelData = v;
    }
  }

  @Watch('code', { deep: true })
  OnCodeChange(code: string) {
    this.schemaCode = code;
    this.handleGetWorkflowList();
    this.getForms();
    this.getLists();
  }
}
</script>

<style lang="less" scoped>
.business-model {
  height: 100%;
  overflow-y: auto;
  background-color: #f6f7f9;
}
.model-header {
  padding: 19px 23px;
  font-size: 18px;
  text-align: left;
  background-color: #fff;
  font-family: PingFang-SC-Medium;
  font-weight: 500;
  line-height: 26px;
}

.model-content {
  padding: 24px;
  text-align: left;
}
.model-content-block {
  margin-bottom: 24px;
  .block-title {
    margin-bottom: 8px;
    font-family: PingFang-SC-Medium;
    line-height: 22px;
  }
  .block-list {
    margin-left: -8px;
    margin-right: -8px;
    li {
      position: relative;
      display: inline-block;
      vertical-align: top;
      width: 124px;
      height: 124px;
      padding-top: 36px;
      margin: 8px;
      border-radius: 4px;
      text-align: center;
      background-color: rgba(255, 255, 255, 1);
      cursor: pointer;
      &:hover {
        box-shadow: inset 0 0 0 1px @primary-color;
        .item-opera {
          visibility: visible;
        }
      }
      > i {
        display: inline-block;
        font-size: 28px;
        margin-bottom: 20px;
        line-height: 1;
      }
      .data {
        color: #1890ff;
      }
      .form {
        color: #fdaa3f;
      }
      .workflow {
        color: #74d03d;
      }
      .list {
        color: #f0624c;
      }
      .h-icon-all-plus-o {
        color: #d9d9d9;
      }
      .item-name {
        width: 90%;
        margin: auto;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 20px;
      }
    }
    .item-opera {
      visibility: hidden;
      position: absolute;
      z-index: 9;
      top: 9px;
      right: 9px;
      i {
        margin-left: 10px;
        font-size: 14px;
        color: rgba(0,0,0,0.45);
      }
      .h-icon-all-delete-o:hover {
        color: #ff4d4e;
      }
      .h-icon-all-form-o:hover {
        color: #1890ff;
      }
    }
  }
}
</style>
