<template>
  <div class="todo-task">
    <div>
      <div class="search-head">
        <div class="row">
          <div>
            <label>
              <span class="red">*</span>
              <span class="title right">{{ $t('languages.TaskTransfer.Delegatee') }}</span>
            </label>
            <staff-selector
              :options="taffSelectorOpts"
              :appManagerFilter="true"
              v-model="targetUser"
              @ok="addTargetUser"
              class="user org-user"
            >
            </staff-selector>
          </div>
          <!-- <div class="transfer-org">
            <label>
              <span class="red">*</span>
              <span class="title right">{{ $t('languages.TaskTransfer.DelegateeOrg') }}</span>
            </label>
            <a-select
              placeholder="请选择"
              v-model="transferDept"
              class="input-select"
            >
              <a-select-option
                v-for="(select,index) in departmentList"
                :key="index"
                :value="select.deptId"
              >{{ select.deptName }}</a-select-option>
            </a-select>
          </div> -->
          <div></div>
        </div>
        <div class="row">
          <div>
            <span class="title">{{ $t('languages.TaskTransfer.WorkerFlow') }}</span>
            <workflow-selector
              v-model="workflowCode"
              :placeholder="'请选择流程模板'"
              class="user"
              :onlyPublished="true"
              @onWorkflowChange="onWorkflowChange"
            />
            <!-- <a-input :placeholder="$t('languages.TaskTransfer.SearchWorkerFlow')"/> -->
          </div>
          <div>
            <span class="title">{{ $t('languages.TaskTransfer.Originator') }}</span>
            <staff-selector
              :options="taffSelectorOpts"
              v-model="originator"
              @ok="addTargetUser"
              @change="onWorkflowChange"
              class="user org-user"
            >
            </staff-selector>
          </div>
          <div>
          </div>
        </div>
      </div>
      <div class="selected-count">
        <span>{{ $t('languages.TaskTransfer.Selected') }}：</span> &nbsp;<span>{{ hasSelected }}</span>/<span>{{ totalElements }}</span>
      </div>
      <div>
        <a-table
          :columns="columns"
          size="small"
          :dataSource="myTask"
          :pagination="false"
          :loading="false"
          :scroll="{ y: 300 }"
          :locale="{emptyText: $t('languages.NoRelevantData')}"
        >
          <span
            slot="indexTitle"
            class="index"
            @mouseenter="indexMouseenter"
            @mouseleave="indexMouseleave"
          >
            <a-checkbox
              v-show="showSelectAllBox || isSelectAll"
              @change.stop="selectAll"
              v-model="isSelectAll"
            ></a-checkbox>
            <span class="text" v-show="!showSelectAllBox && !isSelectAll">{{ $t('languages.NO') }}</span>
          </span>
          
          <span slot="instanceNameTitle" class="resize">{{ $t('languages.ProcessName') }}</span>
          <span slot="activityNameTitle" class="resize">{{ $t('languages.TaskNode') }}</span>
          <span slot="workflowNameTitle" class="resize">{{ $t('languages.TaskTransfer.WorkerFlow') }}</span>
          <span slot="originatorNameTitle" class="resize">{{ $t('languages.TaskTransfer.Originator') }}</span>
          <span slot="timeTitle" class="resize">{{ $t('languages.ReceiveTime') }}</span>

          <span
            slot="index"
            class="index"
            slot-scope="text,record"
            @mouseenter="record.hover = true"
            @mouseleave="record.hover = false"
          >
            <a-checkbox
              v-show="record.hover || record.checked"
              v-model="record.checked"
              @change.stop="onItemCheckboxChange"
            ></a-checkbox>
            <span class="text" v-show="!record.hover && !record.checked">{{ text }}</span>
          </span>
          <template v-for="(item,index) in tableColumns">
            <span
              :key="index"
              class="text-ellipsis"
              :slot="item.dataIndex"
              slot-scope="text,record"
            >
              <a-tooltip v-if="item.dataIndex !== 'index'" placement="top">
                <template slot="title">
                  <span>{{ text }}</span>
                </template>
                <span
                  class="cursor"
                  v-if="item.dataIndex === 'instanceName'"
                  @click="openForm(record)"
                >{{ text }}</span>
                <span v-else>{{ text }}</span>
              </a-tooltip>
            </span>
          </template>
        </a-table>
      </div>
      <div class="todo-task__page clearfix" v-if="totalElements>0">
        <div>
          <a-pagination
            @change="pageChange"
            size="small"
            :pageSizeOptions="pageSizeOptions"
            :total="totalElements"
            :showTotal="total => `共${totalElements}条`"
            showSizeChanger
            showQuickJumper
            :defaultPageSize="20"
            :current="params.page"
            @showSizeChange="showSizeChange"
          />
        </div>

      </div>
      <!-- <div class="load-more">
        <span>{{ $t('languages.NoRelevantData') }}</span>
      </div> -->
    </div>
    <div class="sub-btn">
      <div>
        <a-button
          class="btn"
          :disabled="transferSelected"
          type="primary"
          :ghost="true"
          @click="transferTask('section')"
        >{{ $t('languages.TaskTransfer.TransferSelected') }}</a-button>
        <a-button
          class="btn"
          :disabled="transferAllItems"
          type="primary"
          :ghost="true"
          @click="showTransferTips"
        >{{ $t('languages.TaskTransfer.TransferAll', { num: totalElements }) }}</a-button>
      </div>
    </div>
    <PageLoading
      v-model="isLoading"
      shadeColor="#FFF"
      text="工作正在交接中，请稍后…"
      :shadeOpacity="0.8"
      :shadeGlobal="true"
    >
    </PageLoading>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';
import OrgApi from '@/apis/organization';
import workflowSelector from '@/components/global/workflow-selector/index.vue';
import PageLoading from '@/components/shared/loading/page-loading/page-loading.vue';
import { locale } from 'moment';

const TaskTransferModule = namespace('Organization/taskTransfer');
@Component({
  name: 'TodoTask',
  components: {
    StaffSelector,
    workflowSelector,
    PageLoading
  }
})
export default class TodoTask extends Vue {
  @Prop() userid!: string

  get tableColumns() {
    return this.columns.filter((c:any) => c.dataIndex !== 'index');
  }

  get transferSelected() {
    return !this.hasSelected || !this.targetUser.length;
  }

  get transferAllItems() {
    return !this.myTask.length || !this.targetUser.length;
  }

  columns: Array<Organization.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      align: 'center',
      width: 60
    }, {
      dataIndex: 'instanceName',
      slots: { title: 'instanceNameTitle' },
      scopedSlots: { customRender: 'instanceName' },
      width: 186
    }, {
      dataIndex: 'activityName',
      slots: { title: 'activityNameTitle' },
      scopedSlots: { customRender: 'activityName' },
      width: 145
    }, {
      dataIndex: 'workflowName',
      slots: { title: 'workflowNameTitle' },
      scopedSlots: { customRender: 'workflowName' },
      width: 145
    }, {
      dataIndex: 'originatorName',
      slots: { title: 'originatorNameTitle' },
      scopedSlots: { customRender: 'originatorName' },
      width: 96
    }, {
      dataIndex: 'receiveTime',
      slots: { title: 'timeTitle' },
      scopedSlots: { customRender: 'receiveTime' },
    }
  ]

  isDisable: boolean = false;

  targetUser = [];

  originator = [];

  myTask = [];

  workflowCode = '';

  isLoading:boolean = false;

  isSelectAll:boolean = false;

  showSelectAllBox:boolean = false;

  params = {
    userId: this.userid as string,
    workflowCode: '',
    originator: '',
    page: 1,
    size: 20
  }

  totalElements: number = 0;

  hasSelected: number = 0;

  taffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    showModel: true,
    mulpitle: false,
    showSelect: true,
    placeholder: '请选择'
  }


  /**
   * 分页参数
   */
  pageSizeOptions: Array<string> = [
    '10',
    '20',
    '50',
    '100'
  ]

  created() {
    // console.log('tash');
    this.getTasks();
  }

  /**
   * 加载代办任务
   */
  getTasks() {
    const vm:any = this;
    const params = { ...vm.params };
    params.page -= 1;
    params.workflowCode = vm.workflowCode ? vm.workflowCode.replace('workflow_', '') : '';
    params.originator = vm.originator.length > 0 ? vm.originator[0].id : '';
    vm.hasSelected = 0;
    vm.isSelectAll = false;
    OrgApi.getTaskByUser(params).then((res:any) => {
      if (res.data && res.data.content) {
        vm.totalElements = res.data.totalElements;
        const pageStart: number = (vm.params.page - 1) * vm.params.size;
        res.data.content.forEach((t:any, index:number) => {
          t.index = pageStart + index + 1;
          t.key = t.id;
          t.checked = false;
          t.hover = false;
          Object.entries(t).forEach((data:any) => {
            const [key, value] = data;
            if (typeof value !== 'boolean' && !value) {
              t[key] = '- -';
            }
          });
        });
        vm.myTask = res.data.content;
      } else {
        vm.totalElements = 0;
        vm.myTask = [];
      }
    });
  }

  addTargetUser() {

  }

  /* 
  * 交接全部任务提示窗
  */
  showTransferTips() { 
    const vm:any = this;
    vm.$confirm({
      title: vm.$t('languages.TaskTransfer.TranferTips', { num: vm.totalElements }),
      okText: vm.$t('languages.Ok'),
      cancelText: vm.$t('languages.Cancel'),
      content: vm.$t('languages.TaskTransfer.TranferTips3'), // 交接完成后不可撤回，请谨慎操作
      onOk() {
        vm.transferTask('all');
      },
    });
  }

  /**
   * 交接任务
   */
  transferTask(type: string) {
    const vm:any = this;
    const params = {
      transferAll: type === 'all',
      transferUserId: vm.targetUser[0].id,
      userId: vm.userid,
      workItemIds: [],
      workflowCode: '',
      originator: '',
    };

    params.workflowCode = vm.workflowCode ? vm.workflowCode.replace('workflow_', '') : '';
    params.originator = vm.originator.length > 0 ? vm.originator[0].id : '';

    if (type !== 'all') {
      const _ids: any = [];
      vm.myTask.forEach((data: any) => {
        if (data.checked) {
          _ids.push(data.id);
        }
      });
      params.workItemIds = _ids;
    }

    this.isLoading = true;
    OrgApi.taskTransfer(params).then((res:any) => {
      if (!res.errcode) {
        if (res.data && res.data.fails) {
          vm.$message.warning(`交接完成！有${res.data.fails}条待办交接失败，可能的原因有：1. 流程异常了  2. 当前接收人已经是该流程的处理人，不允许交接给他`, 3);
        } else {
          vm.$message.success('交接成功！', 2);
        }
        vm.getTasks();
      } else {
        this.$message.error(res.errmsg, 2);
      }
      this.isLoading = false;
    });
  }

  /**
    * 全选 
    */
  selectAll(e: Event) {
    const isChecked = (e.target as any).checked;

    if (isChecked) {
      this.myTask.forEach((item: any) => {
        item.checked = true;
      });
      this.hasSelected = this.myTask.length;
    } else {
      this.myTask.forEach((item: any) => {
        item.checked = false;
      });
      this.hasSelected = 0;
    }
  }

  /*
  * 当checkbox选择change时事件
  */
  onItemCheckboxChange() {
    const isCheckedItems = this.myTask.filter((d: any) => d.checked);
    this.hasSelected = isCheckedItems.length;
    if (isCheckedItems.length < this.myTask.length) {
      this.isSelectAll = false;
    } else {
      this.isSelectAll = true;
    }
  }

  indexMouseenter() {
    this.showSelectAllBox = true;
  }

  indexMouseleave() {
    this.showSelectAllBox = false;
  }

  /* 
  * 流程模板、发起人change事件
  */
  onWorkflowChange(value:any) {
    // console.log('流程模板、发起人change', value);
    this.getTasks();
  }

  // 分页 page change 回调
  pageChange(page: number, pageSize: number) {
    this.params.page = page;
    this.params.size = pageSize;
    this.getTasks();
  }

  showSizeChange(current:number, size: number) {
    this.params.page = 1;
    this.params.size = size;
    this.getTasks();
  }

  /**
  * 打开表单
  */
  openForm(item:any) {
    const token = localStorage.getItem('token');
    if (token) {
      const url = `/form/detail?workitemId=${item.id}&workflowInstanceId=${item.instanceId}`;
      window.open(url);
    }
  } 
}
</script>
<style lang="less" scoped>
  .todo-task{
    &__page {
      padding-top: 10px;
      padding-bottom: 10px;
      &>div{
        float: right;
      }
      // 分页器高度调整
      /deep/.ant-pagination-options{
        height: 26px;
        .ant-pagination-options-size-changer{
          margin-top: 1px;
        }
      }
    }
    .row{
      padding: 0 0 20px 0;
      position: relative;
      &:after{
        content: "";
        display: block;
        clear: both;
      }
      &:last-child{
        padding-bottom: 16px;
      }
      div{
        line-height: 32px;
        float: left;
        &:first-child{
          margin-right: 24px;
        }
        &:last-child{
         float: right;
        }
        input{
          border-radius:4px;
          padding: 5px 12px;
          width: 245px;
        }
        .user{
          width: 314px;
          vertical-align: middle;
        }
        .org-user{
          font-size: 0;
        }
        span.title{
          // margin-right: 22px;
          display: inline-block;
          width: 72px;
        };
        span.ant-input-affix-wrapper{
          width: auto;
        }
        .red{
          color: #f00;
          margin-right: 0px;
          position: absolute;
          top: 2px;
          left: -7px;
        }
        .btn{
          vertical-align: top;
          padding: 0 12px;
          text-align: center;
          span{
            margin: 0 0 0 4px;
          }
        }
      }
      .transfer-org{
        float: left !important;
        position: relative;
        .input-select{
          width: 314px;
        }
        .red{
          color: #f00;
          margin-right: 0px;
          position: absolute;
          top: 2px;
          left: -7px;
        }
      }
    }
    .load-more{
      text-align: center;
      padding: 11px 0;
      span{
        padding: 11px 0;
        color:rgba(0,0,0,0.45);
        font-weight:400;
        font-size:12px;
        cursor: pointer;
      }
    }
    /deep/.ant-table-placeholder{
     color: rgba(0,0,0,0.45);
    }
    /deep/.ant-table-thead>tr>th{
      color: rgba(0, 0, 0, 0.65);
    }
    /deep/.ant-table-body{
      max-height: calc(100vh - 387px) !important;
      overflow-x: hidden!important;
      color: rgba(0, 0, 0, 0.85);
      .ant-table-thead > tr > th, .ant-table-tbody > tr > td{
        padding: 0 10px;
      }
      table{
        padding: 0 !important;
      }
    }
    .index{
      width: 100%;
      height: 100%;
      display: inline-block;
      .text{
        padding: 0;
      }
    }
    .selected-count{
      padding: 6px 0;
      font-size:12px;
      color:rgba(0,0,0,0.45);
    }
    /deep/.ant-btn-background-ghost.ant-btn-primary[disabled]{
      background: #F5F5F5 !important;
    }
    .sub-btn{
      width: 100%;
      text-align: center;
      padding: 10px 0;
      position: absolute;
      bottom: 0;
      z-index: 100;
      margin-left: -24px;
      background: #fff;
      border-top: 1px solid rgba(232,232,232,1);
      &>div{
        width: 400px;
        margin: 0 auto;
      }
      .btn{
        &:last-child{
          margin-left: 6px;
        }
        span{
          font-weight:400;
        }
      }
    }
  }
  .cursor{
    cursor: pointer;
  }
</style>
