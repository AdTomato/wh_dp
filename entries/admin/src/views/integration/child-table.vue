<template>
  <div>
    <a-table
      class="child-table"
      size="small"
      :columns="innerColumns"
      :loading="innerLoading"
      :dataSource="innerData"
      :pagination="false"
      rowKey="code"
    >
      <!-- 表头 -->
      <span class="text-ellipsis" slot="indexTitle">{{ $t('languages.NO') }}</span>
      <span class="text-ellipsis resize" slot="codeTitle">方法编码</span>
      <span class="text-ellipsis resize" slot="nameTitle">方法名称</span>
      <template v-if="service.isRestful">
        <span class="text-ellipsis resize" slot="requestTitle">HTTP连接方法</span>
        <span class="text-ellipsis resize" slot="urlTitle">URL</span>
      </template>
      <span class="text-ellipsis" slot="actionTitle">{{ $t('languages.integration.Action') }}</span>
      <!-- 表体 -->

      <span
        slot="request"
        v-if="service.isRestful"
        slot-scope="text, record">{{ getHttpType(record.configs.httpType) }}</span>
      <span
        slot="url"
        v-if="service.isRestful"
        slot-scope="text, record"
        class="text-ellipsis"
        :title="record.configs.url"
      >{{ record.configs.url ? record.configs.url: '- -' }}</span>

      <span
        slot="action"
        slot-scope="text,record"
        class="child-table__actions"
      >
        <template v-if="service.isRestful">
          <i class="icon aufontAll h-icon-all-edit-o" @click="editItem(record)"/>
          <i class="icon aufontAll h-icon-all-play-circle-o" @click="runItem(record)"/>
          <a-dropdown :trigger="['hover']">
            <i class="aufontAll h-icon-all-ellipsis-o table-operation"/>
            <a-menu slot="overlay">
              <a-menu-item key="0" @click="referenceItem(record)">
                查看引用
              </a-menu-item>
              <a-menu-item key="1" @click="popItem(record)">
                删除
              </a-menu-item>
            </a-menu>
          </a-dropdown>
          <!-- <i class="icon aufontAll h-icon-all-delete-o" @click="popItem(record)"/> -->
        </template>
        <template v-if="service.isSoap">
          <i class="icon aufontAll h-icon-all-play-circle-o" @click="runItem(record)"/>
        </template>
      </span>
    </a-table>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import {
  namespace, State, Action, Mutation,
} from 'vuex-class';
import Bus from '@/utils/bus';
import serviceApi from '@/apis/biz-service/service.api';

const MethodsModule = namespace('Integration/Methods');

@Component({
  name: 'child-table',
})
export default class ChildTable extends Vue {
  @Prop() service!: BizService.Service.Item;

  @MethodsModule.State('httpTypes') httpTypes: any;

  @MethodsModule.Action('getMethods') getMethods: any;

  @MethodsModule.Action('deleteMethod') deleteMethod: any;

  // 是否正在加载子表数据
  innerLoading: boolean = true;

  // 子表数据
  innerData: BizService.Method.Item[] = [];

  innerColumns: Array<Common.TableHead> = [];

  // 子表格表头信息
  restInnerColumns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 70,
      key: 'index',
      align: 'center',
    },
    {
      dataIndex: 'code',
      slots: { title: 'codeTitle' },
      width: 160,
      key: 'code',
      align: 'left',
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      width: 140,
      key: 'name',
      align: 'left',
    },
    {
      dataIndex: 'request',
      slots: { title: 'requestTitle' },
      scopedSlots: { customRender: 'request' },
      width: 155,
      // key: 'request',
      align: 'left',
    },
    {
      dataIndex: 'url',
      slots: { title: 'urlTitle' },
      scopedSlots: { customRender: 'url' },
      width: 220,
      // key: 'url',
      align: 'left',
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      width: 160,
      key: 'action',
      align: 'right',
    },
  ];

  // soap子表格表头信息
  soapInnerColumns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      width: 200,
      key: 'index',
      align: 'left',
    },
    {
      dataIndex: 'code',
      slots: { title: 'codeTitle' },
      width: 368,
      key: 'code',
      align: 'left',
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      width: 320,
      key: 'name',
      align: 'left',
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      width: 160,
      key: 'action',
      align: 'right',
    },
  ];

  /**
   * 删除集成方法
   * @param record 业务方法
   */
  async popItem(record: any) {
    const bindInfo: any = await serviceApi.getServiceBizBindInfo({
      serviceCode: record.serviceCode,
      serviceMethodCode: record.code,
    });
    if (bindInfo.data && bindInfo.errcode === 0) {
      this.$emit('warn',record);
      // this.$warning({
      //   title: this.$t('languages.Apps.DeletePrompt'),
      //   content: '该集成方法已关联业务方法，不能删除',
      //   okText: this.$t('languages.Apps.Ok').toString(),
      // });
      return;
    }
    const vm: any = this;
    this.$confirm({
      title: this.$t('languages.integration.ConfirmDeleteMethod'),
      okText: this.$t('languages.Apps.Ok').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        vm.deleteMethod({ id: record.id }).then((res: any) => {
          if (!res.errcode) {
            vm.$message.success('删除成功');
            vm.getMethodList();
          } else {
            vm.$message.error(res.errmsg);
          }
        });
      },
    });
  }

  /**
   * 编辑服务
   */
  editItem(record: any) {
    this.$emit('edit', record);
  }

  /**
   * 运行服务方法
   */
  runItem(record: any) {
    this.$emit('run', record);
  }

  /**
   * 获取请求类型标签
   */
  getHttpType(value: any) {
    const httpType: any = this.httpTypes.find((type: any) => type.value === value);
    return httpType ? httpType.label : value;
  }

  /**
   * 获取服务下的方法列表
   */
  getMethodList() {
    this.innerLoading = true;
    this.getMethods({ serviceCode: this.service.code }).then((res: any) => {
      if (Array.isArray(res.data)) {
        res.data.forEach((item: any, index: number) => {
          item.index = index + 1;
          item.configs = JSON.parse(item.configJson);
        });
        this.innerData = res.data;
        this.$emit('load', res.data);
      }
      this.innerLoading = false;
    });
  }

  /**
   * 初始化表格
   */
  initTable(){
    if (this.service.isSoap) {
      this.innerColumns = this.soapInnerColumns;
    } else {
      this.innerColumns = this.restInnerColumns;
    }
  }

  /**
   * 查看业务方法相关应用引用信息
   */
  referenceItem(record: any){
    this.$emit('reference', record);
  }

  mounted() {
    this.initTable();
    if (this.service.methods) {
      this.innerData = this.service.methods;
      this.innerLoading = false;
    } else {
      this.getMethodList();
    }
    Bus.$on('renewMethodList', (service: BizService.Service.Item, methods?: BizService.Method.Item[]) => {
      if (service.code === this.service.code) {
        if (this.service.isSoap && methods) {
          this.innerData = methods;
        } else {
          this.getMethodList();
        }
      }
    });
  }

  beforeDestroy() {
    Bus.$off('renewMethodList');
  }
}
</script>
<style lang="less" scoped>
.child-table {
  &,
  /deep/.ant-table-header,
  /deep/.ant-table-body {
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
    .resize {
      vertical-align: middle;
    }
  }
  // /deep/.ant-table-thead {
  //   span {
  //     display: inline-block;
  //     vertical-align: middle;
  //   }
  //   th > span {
  //     display: block;
  //   }
  // }
  &__actions {
    i {
      cursor: pointer;
      padding: 0 9px;
    }
    i:last-child {
      padding-right: 0;
    }
  }
}
</style>
