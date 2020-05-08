<template>
  <div class="param-setting">
    <div class="start-status" v-if="workflowData.workflowCode">
      <div class="switch">
        <span>PC端发起</span>
        <a-switch
          v-model="workflowData.pcOriginate"
          :checked="workflowData.pcOriginate"
          @change="originateChange"
          class="pc"
        />
      </div>
      <div class="switch">
        <span>移动端发起</span>
        <a-switch
          v-model="workflowData.mobileOriginate"
          :checked="workflowData.mobileOriginate"
          @change="originateChange"
          class="mobile"
        />
      </div>
    </div>
    <div class="set-permissions">
      <div class="setting-title">
        <div>
          <span>发起权限设置</span>
          <a-tooltip placement="top">
            <span slot="title">应用被停用后，发起权限设置失效，所有人都无法发起流程</span>
            <i class="icon aufontAll h-icon-all-question-circle-o"></i>
          </a-tooltip>
        </div>
        <a-button
          type="primary"
          class="add-item"
          @click="addItem"
        >
          <i class="icon aufontAll h-icon-all-plus-o"/>新增
        </a-button>
      </div>
      <a-table
        :columns="tableColums"
        :dataSource="scopeList"
        :pagination="false"
        class="scope-list"
      >
        <span
          slot="fullNameTitle"
          class="head full-name"
        >用户范围</span>
        <span
          slot="operationTitle"
          class="head operation"
        >操作</span>
        <span
          slot="fullName"
          slot-scope="text"
        >{{ text }}</span>
        <span
          slot="operation"
          slot-scope="text, record"
        >
          <i
            class="icon aufontAll h-icon-all-delete-o delete"
            @click.stop="deleteRow(record)"
          />
        </span>
      </a-table>
      <!-- <div class="add-item" @click="addItem"><i class="icon aufontAll h-icon-all-plus-o"></i> 新增</div> -->
      <staff-selector
        v-model="selectors"
        :options="taffSelectorOpts"
        @ok="onOK(arguments)"
        @cancel="onCancle"
      >
      </staff-selector>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import StaffSelector from "@cloudpivot/form/src/renderer/components/shared/staff-selector.vue";
import { getOrgTree, getUsersTree, search } from '@/apis/organization';

const WorkflowModule = namespace('Apps/Workflow');
const MenuModule = namespace('Apps/AppItem');

@Component({
  name: 'ParamSetting',
  components: {
    StaffSelector
  }
})
export default class ParamSetting extends Vue {
  @WorkflowModule.State('scopeList') scopeList: any; // 表格数据数组

  @MenuModule.Action('getWorkflowDetail') getWorkflowDetail: any;
  @MenuModule.Action('updateWorkflow') updateWorkflow: any;
  @WorkflowModule.Action('createPermission') createPermission: any;
  @WorkflowModule.Action('getPermissionList') getPermissionList: any;
  @WorkflowModule.Action('deletePermission') deletePermission: any;

  // 流程code
  workflowCode:string = '';
  // 流程模板数据
  workflowData:any = {};
  isClose:boolean = false;
  // 表格列的配置
  tableColums: any = [{
    dataIndex: 'fullName',
    align: 'left',
    slots: { title: 'fullNameTitle' },
    scopedSlots: { customRender: 'fullName' }
  }, {
    width: 60,
    dataIndex: 'operation',
    slots: { title: 'operationTitle' },
    scopedSlots: { customRender: 'operation' }
  }];
  // 选人控件配置项
  taffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    showModel: false,
    mulpitle: true,
    showSelect: false,
    placeholder: '请选择'
  }
  // 选人控件选中的数组集合
  selectors:any = [];

  beforeMount() {
    if (this.$route.params && this.$route.params.workflowCode) {
      this.workflowCode = this.$route.params.workflowCode;
      this.getPermissionList({ workflowCode: this.workflowCode });
      this.getWorkflowDetail({ workflowCode: this.workflowCode }).then((res: any) => {
        if (!res.errcode) {
          this.workflowData = res.data;
        }
      });
    }
  }
  // pc发起或移动发起权限改变
  originateChange(checked:boolean) {
    this.updateWorkflow(this.workflowData).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success('更新成功');
      }
    });
  }
  // 新增表格行数据
  addItem() {
    this.selectors = [];
    this.taffSelectorOpts.showModel = true;
  }
  // 删除表格行数据
  deleteRow(list:any) {
    if (this.isClose) {
      // 避免重复点击删除弹窗
      return;
    }
    const vm = this;
    this.isClose = true;
    this.$confirm({
      title: '确定要删除用户权限？',
      okType: 'danger',
      okText: this.$t('languages.Apps.Delete').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        vm.isClose = false;
        const permissionId:string = list.id;
        vm.deletePermission({ permissionId }).then((res: any) => {
          if (!res.errcode) {
            vm.$message.success('删除流程权限成功');
            vm.getPermissionList({ workflowCode: vm.workflowCode });
          }
        });
      },
      onCancel() {
        vm.isClose = false;
      }
    });
  }
  // 选人控件弹窗确定事件
  onOK(item:any) {
    console.log(item);
    const vm = this;
    const promiseArray:any = [];
    this.taffSelectorOpts.showModel = false;
    item[0].forEach((a: any, i: string) => {
      const params:Apps.WorkflowSetting.CreatePermissionParams = {
        unitId: a.id,
        unitType: a.unitType,
        workflowCode: vm.workflowCode
      };
      promiseArray.push(vm.createPermission(params));
    });
    Promise.all(promiseArray).then((res: any) => {
      if (Array.isArray(res)) {
        const resData = res.filter((r:Common.Data) => r.errcode !== 0);
        if (!resData.length) {
          vm.$message.success('创建流程权限成功');
        } else {
          vm.$message.error(`${resData.length}条流程权限创建失败`);
        }
        vm.selectors = [];
      }
      vm.getPermissionList({ workflowCode: vm.workflowCode });
    });
  }
  // 选人控件弹窗取消或右上角叉事件
  onCancle() {
    this.taffSelectorOpts.showModel = false;
  }
}
</script>
<style lang="less" scoped>
.param-setting{
  padding: 0 24px;
  .start-status{
    height: 116px;
    line-height: 58px;
    text-align: left;
    color: rgba(0,0,0,0.65);
    border-bottom: 1px solid #E8E8E8;
    .switch{
      padding-left: 24px;
      position: relative;
      .pc,.mobile{
        position: absolute;
        left: 122px;
        top: 24px;
      }
    }
  }
  .set-permissions{
    margin-top: 8px;
    .setting-title{
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 64px;
      color: #000;
      text-align: left;
      line-height: 64px;
      font-weight: 500;
      font-size: 14px;
      span {
        margin-right: 8px;
      }
    }
    .scope-list{
      /deep/.ant-table-thead{
        th{
          padding: 8px 16px;
        }
      }
      .head{
        font-weight: 500;
        white-space: nowrap;
      }
      /deep/.ant-table-row{
        td{
          padding: 8px 16px;
        }
        .delete{
          margin-left: 7px;
          font-size: 14px;
          cursor: pointer;
          &:hover{
            color: #ff4d4e;
          }
        }
      }
    }
    /deep/.ant-table-placeholder{
      display: none;
    }
  }
}
</style>
