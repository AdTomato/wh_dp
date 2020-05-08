<template>
  <div>
    <a-table
      class="child-table"
      size="small"
      rowKey="index"
      :columns="innerColumns"
      :loading="innerLoading"
      :dataSource="innerData"
      :pagination="false"
    >
      <!-- 表头 -->
      <span class="text-ellipsis" slot="indexTitle">{{ $t('languages.NO') }}</span>
      <span class="text-ellipsis resize" slot="serviceNameTitle">集成服务</span>
      <span class="text-ellipsis resize" slot="serviceMethodNameTitle">集成方法</span>
      <span class="text-ellipsis resize" slot="actionTitle">{{ $t('languages.integration.Action') }}</span>
      <!-- 表体 -->
      <span
        slot="action"
        slot-scope="text,record"
        class="child-table__actions"
      >
        <i class="icon aufontAll h-icon-all-delete-o" @click="popItem(record)"/>
        <i class="icon aufontAll h-icon-all-edit-o" @click="editItem(record)"/>
      </span>
    </a-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import BizMethodApi from '@/apis/biz-method/index.api';

import Bus from '@/utils/bus';

@Component({
  name: 'child-table'
})
export default class ChildTable extends Vue {
  @Prop() bizmethod!: BizMethod.MethodItem;

  // 是否正在加载子表数据
  innerLoading: boolean = true;

  // 子表数据
  innerData: any[] = [];

  // 子表格表头信息
  innerColumns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 210,
      key: 'index',
    },
    {
      dataIndex: 'serviceName',
      slots: { title: 'serviceNameTitle' },
      width: 400,
      key: 'serviceName',
    },
    {
      dataIndex: 'serviceMethodName',
      slots: { title: 'serviceMethodNameTitle' },
      key: 'serviceMethodName',
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      width: 108,
      key: 'action',
      align: 'right'
    }
  ];

  /**
   * 删除服务
   * @param record 业务方法
   */
  popItem(record: any) {
    const vm: any = this;
    this.$confirm({
      title: '确认删除当前映射吗？',
      okText: this.$t('languages.Apps.Ok').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        BizMethodApi.deleteBindService({
          id: record.id
        }).then((res: any) => {
          if (!res.errcode) {
            vm.getBindList();
          } else {
            vm.$message.error(res.errmsg);
          }
        });
      }
    });
  }

  /**
   * 编辑服务
   */
  editItem(record: any) {
    // console.log('编辑', record);
    this.$emit('edit', record);
  }

  /**
   * 初始化，获取绑定的服务列表
   */
  getBindList() {
    this.innerLoading = true;
    BizMethodApi.listBindServices({
      schemaCode: this.bizmethod.schemaCode,
      // bizMethodId: this.bizmethod.id,
      methodCode: this.bizmethod.code
    }).then((res: any) => {
      if (!res.errcode && Array.isArray(res.data)) {
        res.data.forEach((item: any, index: number) => {
          item.index = index + 1;
        });
        this.innerData = res.data;
        this.$emit('load', res.data);
      } else {
        this.$message.error(res.errmsg);
      }
      this.innerLoading = false;
    });
  }

  mounted() {
    this.innerLoading = true;
    if (this.bizmethod.serviceList) {
      this.innerData = this.bizmethod.serviceList;
      this.innerLoading = false;
    } else {
      this.getBindList();
    }
    Bus.$on('renewBindList', (bizmethod: BizMethod.MethodItem) => {
      if (bizmethod.code === this.bizmethod.code) {
        this.getBindList();
      }
    });
  }

  beforeDestroy() {
    Bus.$off('renewBindList');
  }
}
</script>
<style lang="less" scoped>
.child-table {
  margin-left: 90px;
  &__actions {
    i {
      cursor: pointer;
      padding: 0 9px;
    }
    i:last-child {
      padding-right: 0;
    }
  }
  // /deep/.ant-table-thead span {
  //   font-weight: 600;
  //   color: rgba(0,0,0,0.65);
  // }
  /deep/.ant-table-body {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
