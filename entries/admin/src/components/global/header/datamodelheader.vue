<template>
  <div class="app-header">
    <div class="header-left">
      <router-link
        tag="i"
        :to="{ name: 'appitem',params: { appCode: appCode } }"
        class="icon aufontAll h-icon-all-arrow-left-o"
      ></router-link>

      <span class="text-ellipsis" :title="bizModeltitle">{{ bizModeltitle }}</span>
    </div>
    <div class="header-content flex-center">
      <ul>
        <template v-for="(module, index) in modules">
          <li
            v-if="module.code === 'FormDesign'"
            :key="index"
            class="flex-center cursor-pointer"
            :class="{'active': module.active}"
            @click.stop="clickMenu('form')"
            @mouseenter.stop="mouseEnterMenu('form')"
            @mouseleave.stop="mouseLeaveMenu('form')"
          >
            <!--  -->
            {{ $t('languages.Apps.'+ module.code) }}
          </li>

          <li
            v-else-if="module.code === 'WorkFlowDesign'"
            :key="index"
            class="flex-center cursor-pointer"
            @click.stop="clickMenu('wf')"
            @mouseenter.stop="mouseEnterMenu('wf')"
            @mouseleave.stop="mouseLeaveMenu('wf')"
            :class="{'active': module.active}"
          >{{ $t('languages.Apps.'+ module.code) }}</li>

          <li
            v-else-if="module.code === 'ListDesign'"
            :key="index"
            class="flex-center cursor-pointer"
            @click="clickMenu('list')"
            :class="{'active': module.active}"
          >{{ $t('languages.Apps.'+ module.code) }} &nbsp;</li>

          <li
            v-else
            class="flex-center cursor-pointer"
            :key="index"
            :class="{'active': module.active}"
            @click.stop="goDataModel"
          >
            <!-- {{ module.name }} -->
            {{ $t('languages.Apps.'+ module.code) }}
          </li>
        </template>
      </ul>
      <div
        class="forms"
        v-show="showForms"
        @mouseenter.stop="mouseEnterMenu('form')"
        @mouseleave.stop="mouseLeaveMenu('form')"
      >
        <!-- @mouseleave.stop="mouseLeaveMenu('form')" -->
        <div class="content">
          <Draggable
            element="div"
            :id="appCode"
            :list="forms"
            :options="dragItemOptions"
            @end="onSortEnd"
            v-if="isFormEdit"
          >
            <div
              class="cursor-pointer cursor-move"
              :class="{'edit': isFormEdit}"
              v-for="form in forms"
              :key="form.code"
              :id="form.code"
              @click.stop="goForm(form)"
            >
              <i
                class="icon aufontAll"
                :class="[ form.icon ? form.icon : 'h-icon-all-operation-log-o' ]"
              ></i>
              <div class="menu-title" :title="form.name">{{ form.name }}</div>
              <span
                v-if="isFormEdit"
                @click.stop="openDeleteConfirm(1,form.code,form.name)"
                class="close-icon"
              >&times;</span>
            </div>
          </Draggable>

          <div
            class="cursor-pointer"
            :class="{'edit': isFormEdit}"
            v-for="form in forms"
            :key="form.code"
            @click.stop="goForm(form)"
            v-else
          >
            <i
              class="icon aufontAll"
              :class="[ form.icon ? form.icon : 'h-icon-all-operation-log-o' ]"
            ></i>
            <div class="menu-title" :title="form.name">{{ form.name }}</div>
            <span
              v-if="isFormEdit"
              @click.stop="openDeleteConfirm(1,form.code,form.name)"
              class="close-icon"
            >&times;</span>
          </div>

          <div class="empty" v-if="!forms.length">暂无内容，请新建表单</div>
        </div>
        <div class="footer" v-if="!isFormEdit">
          <div
            class="btn"
            v-if="!isFormEdit"
            @click="addItem(1)">新建</div>
          <div
            class="btn"
            :class="{'disabled':!forms.length}"
            v-if="!isFormEdit"
            @click.stop="changeModel(1)"
          >编辑</div>
          <div
            class="cancel"
            v-if="isFormEdit"
            @click.stop="cancel">取消</div>
        </div>
      </div>

      <div
        class="workflow"
        v-show="showWorkflows"
        @mouseenter.stop="mouseEnterMenu('wf')"
        @mouseleave.stop="mouseLeaveMenu('wf')"
      >
        <div class="content">
          <div
            class="cursor-pointer"
            :class="{'edit': isWorkflowEdit}"
            v-for="workflow in workflows"
            :key="workflow.workflowCode"
            @click.stop="goWorkflow(workflow)"
          >
            <i
              class="icon aufontAll"
              :class="[ workflow.icon ? workflow.icon : 'h-icon-all-operation-log-o' ]"
            ></i>
            <div class="menu-title">
              <span v-if="$i18n.locale === 'zh'" :title="workflow.workflowName">{{ workflow.workflowName }}</span>
              <span v-else :title="workflow.name_i18n[$i18n.locale]">{{ workflow.name_i18n[$i18n.locale] }}</span>
            </div>
            <span
              v-if="isWorkflowEdit"
              @click.stop="openDeleteConfirm(2,workflow.workflowCode,workflow.workflowName)"
              class="close-icon"
            >&times;</span>
          </div>
          <div class="empty" v-if="!workflows.length">暂无内容，请新建流程</div>
        </div>
        <div class="footer">
          <div
            class="btn"
            v-if="!isWorkflowEdit"
            @click="addItem(2)">新建</div>
          <div
            class="btn"
            :class="{'disabled':!workflows.length}"
            v-if="!isWorkflowEdit"
            @click.stop="changeModel(2)"
          >编辑</div>
          <div
            class="cancel"
            v-if="isWorkflowEdit"
            @click.stop="cancel">取消</div>
        </div>
      </div>
    </div>
    <!-- 新建表单弹窗 -->
    <AddFormModal
      v-model="isShowAddFormModal"
      :data="curItemData"
      :schemaCode="bizSchemaCode"
      @confirm="handleConfirm"
      @cancel="handleCancel"
    />

    <!-- 新建流程弹窗 -->
    <AddWorkflowModal
      v-model="isShowAddWorkflowModal"
      :data="curWorkflowData"
      :schemaCode="bizSchemaCode"
      @confirm="handleConfirmWorkflow"
      @cancel="handleCancelWorkflow"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import {
  State, Mutation, Action, namespace
} from 'vuex-class';
import AddFormModal from '@/components/apps/modals/addForm.vue';
import AddWorkflowModal from '@/components/apps/modals/addWorkflow.vue';
import AddListModal from '@/components/apps/modals/addList.vue';

import * as formApiOld from '@/apis/form';

import * as listApi from '@/apis/list/list.api';

import * as AppErrors from '@/typings/app-error';

import * as ModelAction from '@/typings/model-action';

import { formApi } from '@cloudpivot/api';

import Draggable from 'vuedraggable';

const DataModelModule = namespace('Apps/DataModel');
const AppItemModule = namespace('Apps/AppItem');

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'Datamodel',
  components: {
    AddFormModal,
    AddWorkflowModal,
    AddListModal,
    Draggable
  }
})
export default class Datamodel extends Vue {
  @DataModelModule.Action('getBizmodeltitle') getBizmodeltitle: any;

  @DataModelModule.Mutation('setBizSchemaCode') setBizSchemaCode: any;

  @AppItemModule.Action('deleteWorkflow') deleteWorkflow: any;

  @WorkflowModule.State('workflowMenus') workflows: any;

  @WorkflowModule.Action('getWorkflowList') getWorkflowList: any;

  modules: Array<Common.AppModule> = [];

  bizSchemaCode: string = '';

  bizModeltitle: string = '';

  forms: any[] = [];

  showForms = false;

  showWorkflows = false;

  isShowAddFormModal: boolean = false;

  isShowAddWorkflowModal: boolean = false;

  curItemData: any = {};

  curWorkflowData: any = {};

  curListData: any = {};

  manageType: any = {
    form: 1,
    workflow: 2,
    list: 3
  };

  isFormEdit: boolean = false;

  isWorkflowEdit: boolean = false;

  dragItemOptions: any = {
    animation: 150,
    ghostClass: 'ghostClass',
    forceFallback: true,
    fallbackClass: 'dragClass',
    touchStartThreshold: 20,
    delay: 100
  }

  onSortEnd(evt: any) {
    const sheetCode = evt.item.id as string;
    const sortKey: number = parseInt(evt.newIndex, 10) + 1;
    const params = {
      sheetCode,
      sortKey,
      schemaCode: this.bizSchemaCode
    }

    formApi.updateSortkey(params).then(res => {
      if (res.errcode === 0) {
        this.getForms();
      }

    })

  }


  get appCode() {
    return this.$route.params.appCode;
  }

  beforeMount() {
    this.modules = [
      {
        name: 'datamodel',
        code: 'DataModel',
        active: true,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/data`
      },
      {
        name: 'form-design',
        code: 'FormDesign',
        active: false,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/form-design`
      },
      {
        name: 'workflowDesign',
        code: 'WorkFlowDesign',
        active: false,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/workflowDesign`
      },
      {
        name: 'list-design',
        code: 'ListDesign',
        active: false,
        url: `/apps/model/${this.appCode}/${this.bizSchemaCode}/list-design`
      }
    ];
    this.changeHeightLight(this.$route.name as string);
  }

  created() {
    this.bizSchemaCode = this.$route.params.bizSchemaCode;
    this.setBizSchemaCode(this.bizSchemaCode);
    this.getBizmodeltitle().then((res: any) => {
      this.bizModeltitle = res.data;
      document.title = res.data;
    });

    this.getForms();

    this.getWorkflows();
  }

  // 点击其他区域取消弹出显示
  mounted() {
    const that = this;
    document.addEventListener('click', (e) => {
      if (that.showWorkflows) {
        that.showWorkflows = false;
      }
      if (that.showForms) {
        that.showForms = false;
      }
    });
  }

  // 获取表单列表
  getForms() {
    formApiOld.list(this.bizSchemaCode).then((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        this.forms = res.data.filter((f: any) => f.name);
      }
    });
  }

  // 获取流程列表
  getWorkflows() {
    const params = {
      schemaCode: this.bizSchemaCode
    };
    this.getWorkflowList(params);
  }

  clickMenu(type: string) {
    console.log('type----------', type);
    switch (type) {
      case 'form':
        this.showWorkflows = false;
        this.showForms = true;
        this.isFormEdit = false;
        if (this.forms.length === 1) {
          this.goForm(this.forms[0]);
        }
        break;

      case 'wf':
        this.showForms = false;
        this.showWorkflows = true;
        this.isWorkflowEdit = false;
        if (this.workflows.length === 1) {
          this.goWorkflow(this.workflows[0]);
        }
        break;

      case 'list':
        this.showWorkflows = false;
        this.showForms = false;
        this.goList();
        break;
      default: break;
    }
  }

  mouseEnterMenu(type: string) {
    switch (type) {
      case 'form':
        this.showForms = true;
        break;

      case 'wf':
        this.showWorkflows = true;
        break;

      default: break;
    }
  }

  mouseLeaveMenu(type: string) {
    switch (type) {
      case 'form':
        this.showWorkflows = false;
        this.showForms = false;
        this.isFormEdit = false;
        break;

      case 'wf':
        this.showForms = false;
        this.showWorkflows = false;
        this.isWorkflowEdit = false;
        break;

      case 'list':
        this.showWorkflows = false;
        this.showForms = false;
        break;
      default: break;
    }
  }

  // 编辑自定义表单
  editForm(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    formApiOld.get(this.bizSchemaCode, code).then((res: any) => {
      _this.curItemData = res.data;
      _this.isShowAddFormModal = true;
      hideLoader();
    });
  }

  goForm(form: any) {
    // return
    if (this.isFormEdit) {
      this.openDeleteConfirm(1, form.code, form.name);
    } else if (form.sheetType === 1) {
      this.editForm(form.code);
    } else {
      this.$router.push({
        name: 'form-design',
        params: {
          bizSchemaCode: this.bizSchemaCode,
          sheetCode: form.code
        }
      });
      this.showForms = false;
      this.saveModelAction(ModelAction.ModalActionTypes.Form, form.code);
    }
    document.title = this.bizModeltitle;
  }

  goList() {
    listApi.getList(this.bizSchemaCode).then((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        const lists = res.data.filter((l: any) => l.name)[0];
        const code = lists ? lists.code : '';
        this.$router.push({
          name: 'list-design',
          params: {
            bizSchemaCode: this.bizSchemaCode,
            code
          }
        });
        this.saveModelAction(ModelAction.ModalActionTypes.List, code);
        document.title = this.bizModeltitle;
      }
    });
  }

  goWorkflow(workflow: any) {
    if (this.isWorkflowEdit) {
      this.openDeleteConfirm(2, workflow.workflowCode, workflow.workflowName);
    } else {
      this.$router.push({
        name: 'workflowDesign',
        params: {
          workflowCode: workflow.workflowCode
        }
      });
      this.showWorkflows = false;
    }
    document.title = this.bizModeltitle;
    this.saveModelAction(ModelAction.ModalActionTypes.Workflow, workflow.workflowCode);
  }

  goDataModel() {
    this.$router.push({
      name: 'datamodel',
      params: {
        appCode: this.appCode,
        bizSchemaCode: this.bizSchemaCode
      }
    });
    document.title = this.bizModeltitle;
    this.saveModelAction(ModelAction.ModalActionTypes.DataModel, '');
  }

  /**
   * @desc 存储操作痕迹
   * @params type 当前操作类型
   * @params code 当前操作项的code
   */
  saveModelAction(type: number, code: string) {
    if (!type) return;
    const modelActions = window.localStorage.getItem('ModelAction') as string;
    const { bizSchemaCode } = this.$route.params;
    const obj: ModelAction.ModelActionItem = {
      type,
      code,
      bizSchemaCode
    };
    if (!modelActions) {
      window.localStorage.setItem('ModelAction', JSON.stringify([obj]));
    } else {
      const modelActionsArray = JSON.parse(modelActions);
      const newReords: any = modelActionsArray.filter((item: any) => (item.bizSchemaCode !== bizSchemaCode) && (item.code !== code));
      newReords.push(obj);
      window.localStorage.setItem('ModelAction', JSON.stringify(newReords));
    }
  }

  /*  新建：1: 表单  2: 流程  3: 列表 */
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

      default:
        break;
    }
  }

  handleConfirm(formData: any) {
    this.getForms();
    this.isShowAddFormModal = false;
    // 新增表单跳转到新增的表单页面
    if (formData.sheetType !== '1') {
      this.goForm(formData);
    }
  }

  handleCancel() {
    this.isShowAddFormModal = false;
  }

  handleConfirmWorkflow(workflowData: any) {
    this.getWorkflows();
    this.isShowAddWorkflowModal = false;
    this.goWorkflow(workflowData);
  }

  handleCancelWorkflow() {
    this.isShowAddWorkflowModal = false;
  }

  // 改变模式：是否为编辑模式 1: 表单  2: 流程  3: 列表
  changeModel(type: number) {
    switch (type) {
      case this.manageType.form:
        if (this.forms.length) {
          this.isFormEdit = true;
        }
        break;

      case this.manageType.workflow:
        if (this.workflows.length) {
          this.isWorkflowEdit = true;
        }
        break;

      default:
        break;
    }
  }

  // 取消
  cancel() {
    this.isFormEdit = false;
    this.isWorkflowEdit = false;
  }

  // 打开删除弹窗
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
          default:
            break;
        }
      }
    });
  }

  // 删除表单
  deleteForm(code: string) {
    const _this = this;
    const hideLoader = (_this.$message as any).loading();
    formApiOld
      .remove(this.bizSchemaCode, code)
      .then((res: any) => {
        hideLoader();
        _this.$message.success(_this.$t('languages.DeleteSuccess').toString());
        _this.getForms();

        if (_this.$route.name === 'form-design' && code === _this.$route.params.sheetCode) {
          _this.$router.push(`/apps/model/${this.appCode}/${this.bizSchemaCode}/data?del_form_code=${code}`);
        }

      })
      .catch((e: any) => {
        if (e.errcode === 50000) return;
        // 不可删除逻辑
        if (e.errcode && e.errcode > 0 && e.data.length > 0) {
          const errMsg: any = e.data[0];
          const errorCode: number = errMsg.errCode;
          const errorContent: string = errMsg.errContent;
          this.handleDisplayError(errorCode, errorContent);
        }
      })
      .finally(() => hideLoader());
  }

  // 删除流程
  handleDeleteWorkflow(code: any) {
    const params: any = { workflowCode: code };
    this.deleteWorkflow(params).then((res: any) => {
      if (res.errcode === 0) {
        if (this.$route.name === 'workflowDesign' && code === this.$route.params.workflowCode) {
          this.$router.push(`/apps/model/${this.appCode}/${this.bizSchemaCode}/data`);
        }
        this.$message.success(res.errmsg);
        this.getWorkflows();
      } else if (res.errcode && res.errcode > 0 && res.data.length > 0) {
        // 不可删除逻辑
        const errMsg: any = res.data[0];
        const errorCode: number = errMsg.errCode;
        const errorContent: string = errMsg.errContent ? errMsg.errContent : '';
        this.handleDisplayError(errorCode, errorContent);
      }
    });
  }

  /**
   * 处理错误提示
   * @param errcode 错误代码
   * @param errContent 错误信息
   */
  handleDisplayError(errcode: number, errContent: string) {
    let _errString: any;
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

      default:
        break;
    }
  }


  /**
   * 展示错误提示
   * @param content 错误信息
   */
  displayError(content: any) {
    if (!content) return;
    this.$warning({
      title: content,
      okText: this.$t('languages.Apps.DeleteOk').toString()
    });
  }

  changeHeightLight(val: string) {
    //
    for (let i = 0; i < this.modules.length; i += 1) {
      if (this.modules[i].name === val) {
        this.modules[i].active = true;
      } else {
        this.modules[i].active = false;
      }
    }
  }

  @Watch('$route')
  onRouteChange() {
    switch (this.$route.name) {
      case 'datamodel':
        this.changeHeightLight('datamodel');
        break;
      case 'form-design':
        this.changeHeightLight('form-design');
        break;
      case 'list-design':
        this.changeHeightLight('list-design');
        break;
      default:
        this.changeHeightLight('workflowDesign');
        break;
    }
  }
}
</script>

<style lang="less" scoped>
@import "~styles/themes/index.less";
.app-header {
  .header-left {
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    font-size: 18px;
    color: #fff;
    min-width: 170px;
    span {
      // display: inline-block;
      margin-left: 25px;
      min-width: 180px;
      width: 20%;
      text-align: left;
    }
    .h-icon-all-arrow-left-o {
      cursor: pointer;
    }
  }
  .header-content {
    width: 100%;
    height: 100%;
    ul > li {
      & > .aufontAll {
        margin-left: 8px;
      }
    }
    // background: #052535;
    @media screen and (min-width: 850px) {
      ul {
        height: 100%;
        margin: 0;
        li {
          position: relative;
          height: 100%;
          float: left;
          margin: 0 12px;
          padding: 0 8px;
          color: #fff;
          font-size: 16px;
          cursor: default;
          &:hover {
            color: @header-active-color;
          }
          &.active {
            cursor: default !important;
            color: @header-active-color;
            // border-bottom: 2px solid @primary-color;
            &::after {
              content: "";
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              height: 0;
              border-bottom: 3px solid @header-active-color;
            }
          }
        }
      }
    }
    @media screen and (max-width: 850px) {
      ul {
        display: none;
      }
    }
  }
}

.forms,
.workflow,
.lists {
  position: absolute;
  z-index: 19999;
  margin: auto;
  background-color: #fff;
  min-width: 161px;
  max-width: 644px;
  // min-height: 105px;
  max-height: 304px;
  top: 64px;
  text-align: left;
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;

  .content {
    overflow: auto;
    max-height: 267px;
    font-size: 0;

    /deep/ .cursor-pointer {
      width: 161px;
      height: 67px;
      position: relative;
      display: inline-block;
      font-size: 14px;
      font-weight: 400;

      & > i {
        color: #fdaa3f;
        font-size: 28px;
        float: left;
        line-height: 67px;
        margin: 0 10px 0 16px;
      }

      & > div {
        line-height: 67px;
        color: rgba(0, 0, 0, 0.65);
      }
      .close-icon {
        position: absolute;
        right: 6px;
        width: 12px;
        height: 12px;
        top: 6px;
        color: rgba(0, 0, 0, 0.45);
        cursor: pointer;
      }
    }
    /deep/ .cursor-move {
      cursor: move !important;
    }

    .cursor-pointer.edit {
      border-right: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
    }
    .empty {
      font-size: 12px;
      text-align: center;
      height: 100%;
      min-height: 67px;
      line-height: 67px;
      color: rgba(0, 0, 0, 0.45);
    }

    /deep/.ghostClass {
      opacity: 1;
      background-color: #fff;
      // border: 1px dashed red;
      &.cursor-pointer.edit {
        border: 1px dashed @primary-color;
      }

      * {
        opacity: 0;
      }
    }
    /deep/.dragClass {
      opacity: 1 !important;
      background: rgba(255, 255, 255, 0.8);
      box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0.1);
    }
  }

  .footer {
    background: #fafafa;
    overflow: hidden;
    width: 100%;
    .btn:first-child {
      border-right: 1px solid #e8e8e8;
    }
    .btn {
      width: 50%;
      float: left;
      text-align: center;
      margin: 8px 0;
      color: @primary-color;
      cursor: pointer;
    }
    .disabled {
      color: rgba(0, 0, 0, 0.45);
      cursor: not-allowed;
    }
    .cancel {
      text-align: center;
      margin: 8px 0;
      color: @primary-color;
      cursor: pointer;
    }
  }

  .menu-title {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 12px;
  }
}
.forms {
  margin-left: -54px;
}
.workflow {
  margin-left: 50px;
}
.lists {
  margin-left: 150px;
}
</style>
