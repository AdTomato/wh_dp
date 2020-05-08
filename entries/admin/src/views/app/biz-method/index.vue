<template>
  <div class="biz-method">
    <div v-if="isLoading" class="biz-method--loading">
      <a-spin size="large" :tip="$t('languages.Apps.Loading')" />
    </div>
    <div v-else class="biz-method__main">
      <div class="biz-method__buttons">
        <span class="biz-method__describe">当前模型的系统方法在流程调用时，可以关联集成服务。</span>
        <a-button
          icon="plus"
          type="primary"
          @click="addMethod"
        >{{ $t('languages.Apps.AddNew') }}</a-button>
      </div>
      <div class="biz-method__table">
        <a-table
          size="small"
          rowKey="code"
          :columns="columns"
          :dataSource="list"
          :loading="isLoading"
          :locale="{emptyText: $t('languages.NoRelevantData')}"
          :pagination="false"
          :scroll="{ y: 500 }"
          :expandedRowRender="rowRender"
          :rowClassName="record => record.methodCount>0 ? '' : 'empty'"
          :expandedRowKeys="expandedRowKeys"
          @expand="expandRow"
        >
          <!-- 表头 -->
          <span slot="indexTitle">{{ $t('languages.NO') }}</span>
          <span slot="codeTitle" class="resize">{{ $t('languages.Apps.Code') }}</span>
          <span slot="nameTitle" class="resize">{{ $t('languages.Apps.Name') }}</span>
          <span slot="methodCountTitle" class="resize">{{ $t('languages.Apps.BindService') }}</span>
          <span slot="descriptionTitle" class="resize">{{ $t('languages.Apps.Description') }}</span>
          <span slot="actionTitle" class="resize">{{ $t('languages.Apps.Action') }}</span>
          <!-- 表体 -->
          <span
            slot="description"
            slot-scope="text"
            class="text-ellipsis">{{ text }}</span>
          <span
            slot="action"
            slot-scope="text,record"
            class="biz-method__actions">
            <i
              class="icon aufontAll h-icon-all-delete-o"
              v-if="!record.defaultMethod"
              @click="popMethod(record)"
            ></i>
            <i class="icon aufontAll h-icon-all-plus-o" @click="bindService(record)" />
            <i class="icon aufontAll h-icon-all-edit-o" @click="editMethod(record)"></i>
          </span>
        </a-table>
      </div>
    </div>
    <!-- 添加或编辑方法 -->
    <a-drawer
      :title="methodDrawerTitle"
      :visible="showMethodDrawer"
      :closable="true"
      :destroyOnClose="true"
      width="850"
      placement="right"
      @close="closeMethodDrawer"
    >
      <add-method
        :method="currentMethod"
        @close="closeMethodDrawer"
        @submit="postMethod" />
    </a-drawer>
    <!-- 绑定服务 -->
    <a-drawer
      title="绑定业务服务方法"
      :visible="showBindDrawer"
      :closable="true"
      :destroyOnClose="true"
      width="850"
      placement="right"
      @close="closeBindDrawer"
      wrapClassName="bindwrapper"
    >
      <bind-service
        :bizmethod="currentMethod"
        :service="currentBindItem"
        @close="closeBindDrawer"
        @submit="afterChangeBind"
      />
    </a-drawer>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Bus from '@/utils/bus';
import BizMethodApi from '@/apis/biz-method/index.api';

import AddMethod from './add-method.vue';
import ChildTable from './child-table.vue';
import BindService from './bind-service.vue';

@Component({
  name: 'biz-method',
  components: {
    AddMethod,
    ChildTable,
    BindService,
  }
})
export default class BizMethod extends Vue {
  @Prop() bizSchemaCode!: string;

  // 页面是否正在加载
  isLoading: boolean = true;

  expandedRowKeys: any[] = [];

  // 列表数据
  list: BizMethod.MethodItem[] = [];

  // 表头信息
  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 130,
      key: 'index',
      align: 'center'
    },
    {
      dataIndex: 'code',
      slots: { title: 'codeTitle' },
      key: 'code',
      width: 300,
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      key: 'name',
      width: 250,
    },
    {
      dataIndex: 'methodCount',
      slots: { title: 'methodCountTitle' },
      scopedSlots: { customRender: 'methodCount' },
      key: 'methodCount',
      width: 300,
    },
    {
      dataIndex: 'description',
      slots: { title: 'descriptionTitle' },
      scopedSlots: { customRender: 'description' },
      key: 'description',
      width: 300,
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      key: 'action',
      width: 130,
      align: 'right'
    }
  ];

  // 当前操作的业务方法
  currentMethod: any = {};

  // 是否显示添加/编辑业务方法抽屉
  showMethodDrawer: boolean = false;

  // 业务方法抽屉标题
  methodDrawerTitle: string = '新建方法';

  // 是否显示绑定窗口
  showBindDrawer: boolean = false;

  // 绑定窗口传入的旧的绑定数据
  currentBindItem: any = null;

  /**
   * 展开子表格
   */
  expandRow(expanded: boolean, record: any) {
    if (expanded) {
      this.expandedRowKeys.push(record.code);
    } else {
      this.expandedRowKeys = this.expandedRowKeys.filter((key: string) => key !== record.code);
    }
  }

  /**
   * 展开时获取下属集成方法列表
   */
  rowRender(record: any, index: number, indent: any, expanded: boolean) {
    const vm: any = this;
    return this.$createElement('child-table', {
      props: {
        bizmethod: record,
      },
      on: {
        edit: (service: BizMethod.BindDetailItem) => {
          vm.bindService(record, service);
        },
        load: (list: any) => {
          record.serviceList = list;
          record.methodCount = list.length ? list.length : '- -';
          if (expanded && !list.length) {
            vm.expandRow(false, record);
          }
        }
      }
    });
  }

  /**
   * 删除业务方法
   * @param record 业务方法
   */
  popMethod(record: any) {
    if (record.defaultMethod) {
      return;
    }
    const vm: any = this;
    this.$confirm({
      title: '确定要删除当前业务方法吗？',
      okText: this.$t('languages.Apps.Ok').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        const params: BizMethod.DeleteParam = {
          schemaCode: vm.bizSchemaCode,
          methodCode: record.code
        };
        BizMethodApi.deleteBizMethod(params).then((res: any) => {
          if (!res.errcode) {
            vm.list = vm.list.filter((method: BizMethod.MethodItem) => method.code !== record.code);
          } else if (res.errcode === 500109) {
            vm.$message.error('当前方法已被流程绑定使用，请先删除绑定使用！', 2);
          }
        });
      }
    });
  }

  /**
   * 编辑业务方法
   */
  editMethod(record: any) {
    this.currentMethod = record;
    this.methodDrawerTitle = '编辑方法';
    this.showMethodDrawer = true;
  }

  /**
   * 添加业务方法
   */
  addMethod() {
    this.currentMethod = {};
    this.methodDrawerTitle = '新建方法';
    this.showMethodDrawer = true;
  }

  /**
   * 添加业务方法--请求
   */
  postMethod(params: any) {
    if (this.currentMethod.id) {
      const { methodCount } = this.currentMethod;
      BizMethodApi.updateBizMethod({
        ...this.currentMethod,
        methodCount: isNaN(methodCount) ? 0 : methodCount,
        ...params
      }).then((res: any) => {
        if (!res.errcode) {
          this.$message.success('更新业务方法成功');
          this.closeMethodDrawer();
          this.getMethodList();
        } else {
          this.$message.error(res.errmsg);
        }
      });
    } else {
      BizMethodApi.createBizMethod({
        ...params,
        schemaCode: this.bizSchemaCode
      }).then((res: any) => {
        if (!res.errcode) {
          this.$message.success('添加业务方法成功');
          this.closeMethodDrawer();
          this.getMethodList();
        } else {
          this.$message.error(res.errmsg);
        }
      });
    }
  }

  /**
   * 关闭编辑业务方法弹窗
   */
  closeMethodDrawer() {
    this.showMethodDrawer = false;
    this.$nextTick(() => {
      this.currentMethod = {};
    });
  }

  /**
   * 绑定集成服务
   */
  bindService(method: BizMethod.MethodItem, service?: any) {
    this.currentMethod = method;
    this.currentBindItem = service;
    this.showBindDrawer = true;
  }

  afterChangeBind(type?: string) {
    const target: any = { ...this.currentMethod };
    if (type === 'create') {
      if (this.currentMethod.methodCount === '- -') {
        this.currentMethod.methodCount = 0;
      }
      this.currentMethod.methodCount += 1;
    }
    Bus.$emit('renewBindList', target);
    this.closeBindDrawer();
  }

  /**
   * 关闭绑定服务窗口
   */
  closeBindDrawer() {
    this.showBindDrawer = false;
    this.$nextTick(() => {
      this.currentMethod = {};
    });
  }

  /**
   * 获取业务方法列表
   */
  getMethodList() {
    this.isLoading = true;
    const param: BizMethod.ListParam = {
      schemaCode: this.bizSchemaCode
    };
    BizMethodApi.listBizMethods(param).then((res: any) => {
      if (Array.isArray(res.data)) {
        this.list = res.data;
        this.list.forEach((item: any, index: number) => {
          item.index = index + 1;
          Object.entries(item).forEach((data: any) => {
            const [key, value] = data;
            if (typeof value !== 'boolean' && !value) {
              item[key] = '- -';
            }
          });
        });
        this.isLoading = false;
      }
    });
  }

  mounted() {
    this.getMethodList();
  }
}
</script>

<style lang="less" scoped>
.biz-method {
  text-align: center;
  margin: 0 24px 24px;
  position: relative;
  &--loading {
    // position: absolute;
    // left: 50%;
    // top: 50%;
    // transform: translate(-50%, -50%);
    // z-index: 9;
  }
  &__buttons {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
    margin-bottom: 16px;
    .biz-method__describe {
      line-height: 32px;
      color:rgba(0,0,0,0.45);
      font-size:12px;
      flex: 1;
      text-align: left;
    }
  }
  &__table {
    /deep/.ant-table-header {
      &::-webkit-scrollbar {
        width: 0;
      }
    }
    // /deep/.ant-table-thead span {
    //   color: rgba(0, 0, 0, 0.65);
    //   font-weight: 600;
    // }
    /deep/.ant-table-body {
      overflow-y: auto!important;
      max-height: calc(100vh - 220px - 20px) !important;
      table {
        padding: 0;
      }
      th,
      td {
        color: rgba(0, 0, 0, 0.85);
      }
      /deep/.empty .ant-table-row-expand-icon {
        display: none;
        pointer-events: none;
      }
      /deep/.ant-table-body {
        max-height: none !important;
      }
    }
    /deep/.ant-table-expanded-row {
      > td {
        padding: 0 !important;
        background-color: inherit;
      }
    }
    /deep/.ant-table-expand-icon-th,
    /deep/.ant-table-row-expand-icon-cell {
      padding: 0 !important;
      width: 17px;
      min-width: 17px;
    }
  }
  &__actions {
    i {
      cursor: pointer;
      padding: 0 9px;
    }
    i:last-child {
      padding-right: 0;
    }
  }
  /deep/.resize {
    margin-left: -1px;
  }
}
</style>

<style lang="less">
.bindwrapper {
  .ant-drawer-body {
    overflow-y: auto !important;
  }
}
</style>
