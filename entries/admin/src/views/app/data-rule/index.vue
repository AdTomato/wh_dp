<template>
  <div class="data-rule">
    <div v-if="isLoading" class="data-rule-loading">
      <a-spin size="large" :tip="$t('languages.Apps.Loading')"/>
    </div>
    <div v-else>
      <template v-if="ruleLists.length > 0">
        <div class="add-rule">
          <span class="add-rule__describe">数据新增或更新时，可同步新增、更新、删除其他表单的数据；同步运行多个规则时，根据规则创建时间顺序执行。</span>
          <a-button
            type="primary"
            icon="plus"
            @click="addDataRule"
          >{{ $t('languages.Apps.AddNew') }}</a-button>
        </div>
        <div class="table-box">
          <a-table
            :columns="columns"
            :dataSource="ruleLists"
            :pagination="false"
            size="small"
            :scroll="{ y: 500 }"
          >
            <!-- 表头 -->
            <span class="text-ellipsis" slot="indexTitle">{{ $t('languages.NO') }}</span>
            <span class="text-ellipsis resize" slot="nameTitle">规则名称</span>
            <span class="text-ellipsis resize" slot="triggerActionTypeTitle">动作类型</span>
            <span class="text-ellipsis resize" slot="targetModelTitle">目标模型</span>
            <span class="text-ellipsis resize" slot="enabledTitle">是否启用</span>
            <span class="text-ellipsis resize" slot="operationTitle">操作</span>

            <!-- 是否启用 -->
            <template slot="isActived" slot-scope="text, record">
              <div>
                <a-switch v-model="record.enabled" @change="onActivedChange(record)"/>
              </div>
            </template>

            <!-- 操作 -->
            <template slot="operation" slot-scope="text, record">
              <div class="operation-box">
                <span>
                  <i
                    class="icon aufontAll h-icon-all-edit-o"
                    @click="editRule(record)"
                  ></i>
                </span>
                <span>
                  <i
                    class="icon aufontAll h-icon-all-delete-o"
                    @click="deleteRule(record)"
                  ></i>
                </span>
              </div>
            </template>

          </a-table>
        </div>
      </template>
      <div v-else class="on-data-wrap">
        <div>
          <span class="add-rule__describe">数据新增或更新时，可同步新增、更新、删除其他表单的数据；同步运行多个规则时，根据规则创建时间顺序执行。</span>
        </div>
        <no-data
          tip="暂无数据规则，请点击新建按钮新建"
          @click="addDataRule"
        />
      </div>
      
    </div>

    <!-- 新增或编辑抽屉 -->
    <a-drawer
      :visible="isShowDrawer"
      :title="drawerTitle"
      width="850"
      placement="right"
      :destroyOnClose="true"
      @close="closeDrawer"
      :wrapClassName="'data-rule-drawer'"
    >
      <DataRuleHandler
        :isShowDataRuler="isShowDrawer"
        :data="dataRuleDetail"
        :mode="mode"
        :ruleTypes="ruleTypes"
        @submited="onSubmited"
        :drawerEl="drawerEl"
      />
    </a-drawer>

  </div>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  Button, Table, Switch, Spin, Drawer
} from 'h3-antd-vue';

import * as DataRuleApi from '@/apis/data-rule';

import NoData from '@/components/global/no-data.vue';

import * as DataRuleType from './typings/data-rule.typings';

import DataRuleHandler from './data-rule-handler.vue';


@Component({
  name: 'DataRule',
  components: {
    DataRuleHandler,
    AButton: Button,
    ATable: Table,
    ASwitch: Switch,
    ASpin: Spin,
    ADrawer: Drawer,
    NoData
  }
})
export default class DataRule extends Vue {
  @Prop() bizSchemaCode !:any;

  columns:Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 80,
      align: 'center'
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      width: '20%',
    },
    {
      dataIndex: 'triggerActionType',
      slots: { title: 'triggerActionTypeTitle' },
      width: '20%',
    },
    {
      dataIndex: 'targetModel',
      slots: { title: 'targetModelTitle' },
      width: '20%',
    },
    {
      dataIndex: 'enabled',
      slots: { title: 'enabledTitle' },
      scopedSlots: { customRender: 'isActived' },
      width: '20%',
    },
    {
      dataIndex: 'operation',
      slots: { title: 'operationTitle' },
      align: 'right',
      scopedSlots: { customRender: 'operation' }
    }
  ];


  ruleLists:any = []

  isLoading:boolean = false; // 是否加载中

  isShowDrawer:boolean = false; // 是否显示抽屉

  drawerTitle:string = ''; // 抽屉title

  mode:string = ''; // 模式，新增或者编辑   add  edit

  dataRuleDetail:any = ''; // 数据规则详情，用作数据回写

  ruleTypes:any[] = []; // 所有数据规则

  drawerEl:any = null;


  /**
   * 启用按钮变化
   */
  async onActivedChange(row:any) {
    const { enabled, id } = row;
    const params:DataRuleApi.UpdateEnableParams = { enable: enabled, id };
    const successTipStr:string = enabled ? '启用成功' : '停用成功';
    const errorTipStr:string = enabled ? '启用失败' : '停用失败';
    const res:any = await DataRuleApi.updateEnable(params);
    if (res.errcode === 0) {
      this.$message.success(successTipStr);
    } else {
     // this.$message.error(errorTipStr);
      this.$message.error(res.errmsg);
    }
    this.getList();
  }

  /**
   * 新增数据规则
   */
  addDataRule() {
    this.drawerTitle = '新增数据规则';
    this.mode = DataRuleType.OperationMode.Add;
    this.dataRuleDetail = null;
    this.isShowDrawer = true;
  }


  /**
   * 点击编辑
   */
  async editRule(row:any) {
    const { id } = row;
    await this.getDetail(id);
    this.drawerTitle = '修改数据规则';
    this.mode = DataRuleType.OperationMode.Edit;
    this.isShowDrawer = true;
  }


  /**
   * 点击删除
   */
  deleteRule(row:any) {
    const vm = this;
    this.$confirm({
      title: '确定要删除数据规则？',
      content: '数据规则删除后不可恢复，之前产生的数据操作不受影响',
      okText: this.$t('languages.Ok').toString(),
      cancelText: this.$t('languages.Cancel').toString(),
      onOk() {
        const { id } = row;
        const params:DataRuleApi.IdParams = { id };
        DataRuleApi.deleteDataRule(params).then((res:any) => {
          if (res.errcode === 0) {
            vm.$message.success('删除成功');
            vm.getList();
          } else {
            vm.$message.error('删除失败');
          }
        });
      }
    });
  }


  /**
   * 关闭抽屉
   */
  closeDrawer() {
    this.isShowDrawer = false;
  }


  /**
   * 数据提交完成之后
   */
  onSubmited() {
    this.isShowDrawer = false;
    this.getList();
  }


  /**
   * 动作类型转文字
   */
  actionTypeTranslater(type:number) {
    if (!type) return null;
    switch (type) {
      case DataRuleType.TriggerActionType.Add:
        return '新增数据';
      case DataRuleType.TriggerActionType.Update:
        return '更新数据';
      case DataRuleType.TriggerActionType.Delete:
        return '删除数据';
      default:
        break;
    }
  }


  /**
   * 获取数据规则列表
   */
  async getList() {
    this.isLoading = true;
    const { bizSchemaCode } = this.$route.params;
    const params:DataRuleApi.ListParams = { schemaCode: bizSchemaCode };
    const res:any = await DataRuleApi.list(params);
    this.isLoading = false;
    if (res.errcode === 0) {
      const { data } = res;
      data.forEach((item:any, index:number) => {
        item.key = index;
        item.index = index + 1;
        item.targetModel = `${item.targetSchemaName || '待提供'}[${item.targetSchemaCode}]`;
        item.triggerActionType = this.actionTypeTranslater(item.triggerActionType);
      });
      this.ruleLists = data;
      console.log('--------------------');
      console.log(data);
    }
  }


  /**
   * 获取所有数据规则类型
   */
  async getAllRuleTypes() {
    const res:any = await DataRuleApi.listAllType();
    if (res.errcode === 0) {
      this.ruleTypes = res.data;
    }
  }


  /**
   * 获取单条数据规则详情
   */
  async getDetail(id:string) {
    const params:DataRuleApi.IdParams = { id };
    const res:any = await DataRuleApi.getDetail(params);
    if (res.errcode === 0) {
      this.dataRuleDetail = res.data;
    } else {
      this.$message.error('获取数据失败');
    }
  }


  mounted() {
    this.drawerEl = this.$refs.dataRuleDrawer;
    this.getList();

    this.getAllRuleTypes();
  }
}
</script>
<style lang='less' scoped>
  .data-rule {
    text-align: center;
    padding: 0 24px;
    position: relative;
    .on-data-wrap {
      overflow: hidden;
    }
    .add-rule__describe{
      float: left;
      line-height: 32px;
      color:rgba(0,0,0,0.45);
      font-size:12px;
    }
    .add-rule {
      margin-top: 16px;
      text-align: right;
    }
    &-loading {
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%,-50%);
      z-index: 9;
    }
    .table-box {
      margin-top: 16px;
      /deep/ .ant-table-body{
        color: rgba(0,0,0,0.85);
        max-height: calc(100vh - 250px)!important;
      }
      /deep/.ant-table-thead tr th span {
        font-weight: 600;
        color: rgba(0,0,0,0.65);
      }
      .operation-box {
        & > span {
          cursor: pointer;
          & :first-of-type {
            margin-left: 18px;
          }
        }
      }
    }
  }
</style>
