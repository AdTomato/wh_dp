<template>
  <div class="bind-server__table">
    <a-table
      :columns="type !== 'output'? columns : outputColumns"
      :dataSource="tableData"
      :pagination="false"
      :scroll="{ y: 500 }"
      :locale="{emptyText: $t('languages.NoRelevantData')}"
      size="small"
    >
      <!-- 表头 -->
      <span class="text-ellipsis" slot="indexTitle">序号</span>
      <span class="text-ellipsis resize" slot="parameterTitle">参数</span>
      <span class="text-ellipsis resize" slot="bizPropertyTypeTitle">参数类型</span>
      <span class="text-ellipsis resize" slot="codeTypeTitle">映射方法</span>
      <span class="text-ellipsis resize" slot="bizCodeTitle">映射对象</span>
      <!-- 表体 -->
      <span slot="parameter" slot-scope="text,record">{{ record.serviceMethodParameterCode }}</span>
      <span
        slot="bizPropertyTypeName"
        slot-scope="text,record"
      >{{ record.bizPropertyTypeName || '--' }}</span>
      <div slot="codeType" slot-scope="text,record">
        <template v-if="isEdit">{{ record.codeTypeName }}</template>
        <a-select
          v-else
          v-model="record.codeType"
          :options="codeTypes"
          @change="changeCodeType(record)"
        ></a-select>
      </div>
      <div slot="bizCode" slot-scope="text,record">
        <template v-if="record.codeType === 0">
          <a-select
            v-if="isGetList"
            v-model="record.bizCode"
            mode="combobox"
            autofocus>
            <a-select-option
              v-for="(item,i) in constItems(record)"
              :key="i"
              :value="item.value"
              :title="item.title"
            >{{ item.label }}</a-select-option>
          </a-select>
          <a-input v-else v-model="record.bizCode" />
        </template>
        <a-select
          v-else
          v-model="record.bizCode"
          allowClear>
          <template v-if="type === 'output'">
            <a-select-option
              v-for="(item,i) in dataItems(record)"
              :key="i"
              :value="item.code"
            >{{ item.name }}[{{ item.code }}]</a-select-option>
          </template>
          <template v-else>
            <a-select-opt-group>
              <span slot="label" class="select-title">业务数据项</span>
              <a-select-option
                v-for="(item,i) in dataItems(record)"
                :key="i"
                :value="item.code"
              >{{ item.name }}[{{ item.code }}]</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label" class="select-title">系统数据项</span>
              <a-select-option
                v-for="(item,i) in dataItems(record, true)"
                :key="i"
                :value="item.code"
              >{{ item.name }}[{{ item.code }}]</a-select-option>
            </a-select-opt-group>
          </template>
        </a-select>
      </div>
    </a-table>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

@Component({
  name: 'bind-table'
})
export default class BindTable extends Vue {
  @Prop() value!: any[];

  @Prop() dataItemList!: any[];

  @Prop() isGetList!: boolean;

  @Prop() isEdit!: boolean;

  @Prop() type?: string;

  tableData: any[] = [];

  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      key: 'index',
      width: 90,
      align: 'left',
    },
    {
      dataIndex: 'parameter',
      slots: { title: 'parameterTitle' },
      scopedSlots: { customRender: 'parameter' },
      key: 'serviceMethodParameterCode',
      width: 142,
      align: 'left',
    },
    {
      dataIndex: 'bizPropertyTypeName',
      slots: { title: 'bizPropertyTypeTitle' },
      key: 'bizPropertyTypeName',
      width: 160,
      align: 'left'
    },
    {
      dataIndex: 'codeType',
      slots: { title: 'codeTypeTitle' },
      scopedSlots: { customRender: 'codeType' },
      key: 'codeType',
      width: 160,
      align: 'left',
    },
    {
      dataIndex: 'bizCode',
      slots: { title: 'bizCodeTitle' },
      scopedSlots: { customRender: 'bizCode' },
      key: 'bizCode',
      // width: 300,
      align: 'left',
    },
  ];

  outputColumns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      key: 'index',
      width: 90,
      align: 'left',
    },
    {
      dataIndex: 'parameter',
      slots: { title: 'parameterTitle' },
      scopedSlots: { customRender: 'parameter' },
      key: 'serviceMethodParameterCode',
      width: 142,
      align: 'left',
    },
    {
      dataIndex: 'bizPropertyTypeName',
      slots: { title: 'bizPropertyTypeTitle' },
      key: 'bizPropertyTypeName',
      width: 160,
      align: 'left'
    },
    {
      dataIndex: 'bizCode',
      slots: { title: 'bizCodeTitle' },
      scopedSlots: { customRender: 'bizCode' },
      key: 'bizCode',
      // width: 300,
      align: 'left',
    },
  ];

  constList: any[] = [];

  inputConstList: any[] = [
    {
      label: 'offset',
      value: 'offset',
      title: '查询起始位置（从0开始）',
    },
    {
      label: 'offset0',
      value: 'offset0',
      title: '查询起始位置（从0开始）',
    },
    {
      label: 'offset1',
      value: 'offset1',
      title: '查询起始位置（从1开始）',
    },
    {
      label: 'limit',
      value: 'limit',
      title: '查询数量（分页大小）',
    },
    {
      label: 'page',
      value: 'page',
      title: '查询页号（从0开始）',
    },
    {
      label: 'page0',
      value: 'page0',
      title: '查询页号（从0开始）',
    },
    {
      label: 'page1',
      value: 'page1',
      title: ' 查询页号（从1开始）',
    },
  ];

  outputConstList: any[] = [
    {
      label: 'total',
      value: 'total',
      title: '记录总数'
    },
    {
      label: 'list',
      value: 'list',
      title: '当前页记录列表'
    }
  ];

  codeTypes: any[] = [
    {
      label: 'Property',
      value: 1
    },
    {
      label: 'Const',
      value: 0
    }
  ];

  /**
   * 切换映射方式
   */
  changeCodeType(record: any) {
    // record.bizCode = '';
    this.$set(record, 'bizCode', '');
  }

  /**
   * 过滤得出可选列表
   * @param filterDefault 是否仅筛选出系统数据项，否则筛选出表单数据项
   */
  dataItems(record: any, filterDefault: boolean = false) {
    const selected: string[] = [];
    this.tableData.forEach((item: any) => {
      if (item.codeType === 1 && item.index !== record.index) {
        selected.push(item.bizCode);
      }
    });
    if (filterDefault) {
      return this.dataItemList.filter((item: any) => !selected.includes(item.code) && item.defaultProperty);
    }
    return this.dataItemList.filter((item: any) => !selected.includes(item.code) && !item.defaultProperty);
  }

  /**
   * 过滤得出可选常量列表
   */
  constItems(record: any) {
    const selected: string[] = [];
    this.tableData.forEach((item: any) => {
      if (item.codeType === 0 && item.index !== record.index) {
        selected.push(item.bizCode);
      }
    });
    return this.constList.filter((item: any) => !selected.includes(item.value));
  }

  @Watch('value')
  onValueChange(v: any) {
    this.tableData = v;
  }

  mounted() {
    if (this.type === 'output') {
      this.constList = this.outputConstList;
    } else {
      this.constList = this.inputConstList;
    }
  }
}
</script>
<style lang="less" scoped>
.bind-server {
  &__table {
    margin-top: 16px;
    // /deep/.ant-table-thead span {
    //   display: inline-block;
    //   vertical-align: middle;
    //   line-height: 22px;
    //   height: 22px;
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    /deep/.ant-table-body {
      color: rgba(0, 0, 0, 0.85);
    }
    /deep/.ant-select {
      width: 100%;
      max-width: 180px;
    }
  }
}
.select-title {
  font-weight: 400;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px !important;
}
</style>
