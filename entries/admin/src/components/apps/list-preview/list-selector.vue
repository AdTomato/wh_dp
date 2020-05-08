
<template>
  <div class="list-selector">
    <div class="action-box">
      <div class="list-title">{{ listTitle }}</div>
      <div class="setting">
        <i
          class="icon aufontAll  h-icon-all-filter-o"
          :class="{'high-light': isShowFilterBox}"
          @click="isShowFilterBox = !isShowFilterBox"></i>
      </div>
      <div class="actions" v-if="showActions">
        <a-button
          v-for="(ac,index) in data.queryActions"
          :type="index === 0 ? 'primary' : 'default'"
          :key="index"
        >{{ ac.name }}</a-button>
      </div>

      <div class="filter-wrap" v-show="isShowFilterBox">
        <div class="content-box">
          <query-form
            :fields="data.queryConditions"
            :cols="cols"
            v-show="showSearch"
          ></query-form>
        </div>
        <div class="filter-mask" @click="isShowFilterBox = false"></div>
      </div>
    </div>

    <div class="table-wrap">
      <a-table
        v-if="selectable"
        :columns="columns"
        :pagination="pagination"
        :dataSource="dataSource"
        :rowSelection="rowSelection"
        rowKey="id"
        :scroll="{x: scrollX}"
      ></a-table>

      <!-- <a-table
        v-else
        :columns="columns"
        :pagination="pagination"
        :dataSource="dataSource"
        rowKey="id"
        :scroll="{x: scrollX, y: 300}"
      ></a-table> -->

      <sheet
        v-else
        :checkbox="true"
        :checkeds="checkeds"
        :columns="columns"
        :rows="rows"
        :columnSlots="columnSlots"
        :rowSlots="rowSlots"
      >
        <!-- 自定义的列 头 -->
        <span
          v-for="(item, index) in columns"
          :key="index"
          :slot="columnSlots[item.key]"
        >{{ item.title }}</span>

        <!-- 自定义的列 表体 :title="text" -->
        <span
          v-for="(item, index) in columns"
          :key="index"
          :slot="rowSlots[item.key]"
          slot-scope="{column, rowIndex}"
        >{{ getLabelContent(column, rowIndex) }}</span>
      </sheet>
    </div>
  </div>
</template>


<script lang='ts'>
import {
  Component, Vue, Prop, Watch, Model
} from 'vue-property-decorator';

import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import QueryForm from './query-form.vue';

import * as listApi from '@/apis/list';

import { DataItemType } from '../form-design/typings';

import * as SystemCodes from '../../shared/system-data-item-codes';

import sheet from '@cloudpivot/form/src/renderer/components/pc/form-sheet/sheet.vue';

const ListdesignModule = namespace('Apps/Listdesign');

@Component({
  name: 'list-selector',
  components: {
    QueryForm,
    sheet
  }
})
export default class ListSelector extends Vue {
  @ListdesignModule.State('clientType') clientType: any;
  @ListdesignModule.State('showFieldArray') queryColumns: any;
  @ListdesignModule.State('payloadOptions') queryConditions: any;
  @ListdesignModule.State('operationAarry') queryActions: any;
  @ListdesignModule.State('name') name: any;

  @Prop() isPreview !: boolean;

  @Prop({
    default: ''
  })
  listCode!: string;

  @Prop({
    default: ''
  })
  schemaCode!: string;

  @Prop({
    default: false
  })
  showActions!: boolean;

  @Prop()
  query!: any[];

  @Model('change')
  value!: any[];

  @Prop()
  cols!: number;

  @Prop({
    default: true
  })
  selectable!: boolean;

  @Prop({
    default: true
  })
  showSearch !: boolean;

  data: any = {};

  columns: any[] = [];

  dataSource: any[] = [];

  pagination = {};

  // 表头固定
  scrollX: number = 0;

  isShowFilterBox:boolean = false;

  listTitle:string = '';

  rowSelection = {
    type: 'radio',
    selectedRowKeys: new Array<string>(),
    onChange: this.onSelectChange
  };

  checkeds:any[] = [];
  columnSlots:any[] = [];
  rowSlots:any[] = [];
  rows:any[] = [];

  @Watch('schemaCode', {
    immediate: true
  })
  onSchemaCodeChange() {
    if (!this.schemaCode) {
      return;
    }

    // PC端预览时取store里的值渲染
    if (this.isPreview && this.clientType === 'PC') {
      const result = {
        queryColumns: this.queryColumns,
        queryConditions: this.queryConditions,
        queryActions: this.queryActions
      };
      this.listTitle = this.name;
      this.data = result;
      this.initColumns();
      return;
    }

    const hideLoader = (this.$message as any).loading();

    const _this = this;

    const clientType = 'PC';

    listApi.getListInfo(this.schemaCode, this.listCode, clientType).then(
      (res: any) => {
        hideLoader();

        const { data } = res;

        this.listTitle = data.name;

        // if (!data.queryConditions) {
        //   _this.$message.error("没有查询条件");
        //   return;
        // }
        

        if (Array.isArray(this.query) && data.queryConditions) {
          this.query.forEach((x) => {
            const item = data.queryConditions.find(
              (q: any) => q.propertyCode === x.code
            );
            if (item) {
              switch (item.propertyType) {
                case DataItemType.Date:
                case DataItemType.Number:
                  if (x.value !== '') {
                    item.defaultValue = [x.value, x.value];
                  }
                  break;
                default:
                  item.defaultValue = x.value;
                  break;
              }
            }
          });
        }
        // 初始化单据状态的值
        if (Array.isArray(data.queryConditions)) {
          data.queryConditions.forEach((condition: any) => {
            if (condition.propertyCode === 'sequenceStatus') {
              if (!condition.defaultValue) return;
              const vals_zh: Array<string> = condition.defaultValue.split(';')
              const vals_en: Array<string> = [];
              vals_zh.forEach((val: string) => {
                switch (val) {
                  case 'DRAFT':
                    vals_en.push('草稿');
                    break;
                  case 'PROCESSING':
                    vals_en.push('进行中');
                    break
                  case 'COMPLETED':
                    vals_en.push('已完成');
                    break
                  case 'CANCELED':
                    vals_en.push('已作废');
                    break
                  default:
                    break;
                }
              });
              condition.defaultValue = vals_en.join(';');
            }
          });
        }

        this.data = data;

        this.initColumns();
      },
      () => hideLoader()
    );
  }

  @Watch('value', {
    immediate: true
  })
  onValueChange(val: any) {
    if (val) {
      this.rowSelection.selectedRowKeys = val.map((x: any) => x.id);
    } else {
      this.rowSelection.selectedRowKeys = [];
    }
  }

  initColumns() {
    if (!this.data.queryColumns) {
      return;
    }

    const columns: any[] = this.data.queryColumns.map((c: any) => ({
      title: c.name,
      dataIndex: c.propertyCode,
      key: c.propertyCode,
      width: c.width ? Number(c.width) : 176
    }));

    // 计算表格width
    this.scrollX = 0;
    columns.forEach((c: any) => {
      this.scrollX += c.width;
    });

    this.columns = columns;

    this.columns.forEach((col:any) => {
      // 添加自定义列表头slot
      this.columnSlots[col.key] = `${col.key}Title`;

      // 添加自定义表体slot
      this.rowSlots[col.key] = `${col.key}Body`;
    });

    this.dataSource = Array(10)
      .fill(0)
      .map((_, i) => {
        const item = this.createFiledsOf(this.data.queryColumns);
        item.index = i + 1;
        item.id = i.toString();
        return item;
      });

      this.rowsFormatter(this.columns);

      console.log(this.rows)
      console.log(this.columns)
  }

  rowsFormatter(columns: any) { 
    const data: Array<any> = JSON.parse(JSON.stringify(this.dataSource));
    const newRows: any = [];
    data.forEach(() => {
      const _row: Array<any> = [];
      columns.forEach((col:any) => {
        _row.push({ key: col.key });
      });
      newRows.push(_row);
    });

    this.rows = newRows;
    this.checkeds = this.rows.map(() => false);
    return newRows; // 初次加载默认设置
  }

  getLabelContent(column: any, rowIndex: number) {
    if (!column) return;
    const { dataIndex } = column;
    return this.dataSource[rowIndex][dataIndex];
  }

  createFiledsOf(columns: any[]) {
    const field: any = {};
    columns.forEach((col: any) => {
      field[col.propertyCode] = this.createTextOf(col);
    });
    // field.name = field.sequence_no;
    return field;
  }

  createTextOf(column: any) {
    switch (column.propertyCode) {
      case SystemCodes.sequence_no:
        return '20181201000001';

      case SystemCodes.sequence_status:
        return '进行中';

      case SystemCodes.name:
        return '张三的事假申请';

      case SystemCodes.creater:
      case SystemCodes.owner:
        return '张三';

      case SystemCodes.modifier:
        return '李四';

      case SystemCodes.created_dept_id:
      case SystemCodes.owner_dept_Id:
        return '技术部';

      case SystemCodes.created_time:
      case SystemCodes.modified_time:
        return '2018-12-12 15:00';
    }

    switch (column.propertyType) {
      case DataItemType.Number:
        return 1;
      case DataItemType.Date:
        return '2018-12-12 15:00';
      case DataItemType.Logic:
        return true;
      case DataItemType.ShortText:
      case DataItemType.LongText:
      case DataItemType.ApprovalOpinion:
        return column.name;
    }
  }

  onSelectChange(selectedRowKeys: string[], selectedRows: any[]) {
    this.$emit('change', selectedRows);
  }
}
</script>


<style lang="less" scoped>
.list-selector{
  height: 100%;
}

.actions {
  padding: 8px 0;
  text-align: right;

  & > button {
    margin-left: 8px;
  }
}

.action-box{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  .list-title{
    font-size: 16px;
    font-weight: 600;
    flex: 1;
    color: rgba(0,0,0,0.85);
  }
  .setting{
    margin-right: 16px;
    font-size: 18px;
    color: #000;
    cursor: pointer;
    .icon:hover {
      color: @primary-color;
    }
    .high-light{
      color: @primary-color;
    }
  }
}

.filter-wrap{
  position: absolute;
  top: 56px;
  width: 100%;
  z-index: 666;
  margin-top: -8px;
  .content-box{
    padding: 10px 16px 0 16px;
    box-shadow: 0px 2px 8px 0px rgba(0,0,0,0.15);
    border-radius: 4px;
    background: #fff;
    max-height: 510px;
    overflow-y: auto;
    z-index: 9;
    position: relative;
  }
}

.table-wrap {
  overflow: auto;
  text-align: left;
  margin: 8px 0;
  background: #FFF;
  height: calc(100% - 64px);
}

/deep/.ant-table-thead > tr > th,
/deep/.ant-table-tbody > tr > td {
  padding: 8px 10px;
  color: rgba(0, 0, 0, 0.85);
}

/deep/.ant-table-thead > tr > th {
  color: rgba(0, 0, 0, 0.65);
  position: relative;
  padding-left: 10px;
  background-color: #F8FBFF;
  font-weight: 600;

  &:not(:first-child)::after {
    content: " ";
    width: 1px;
    height: 20px;
    left: 0;
    position: absolute;
    background-color: #eaedf3;
  }
}

/deep/.ant-pagination{
  margin-bottom: 0;
  margin-right: 8px;
}

.filter-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0);
  z-index: 1;
}
</style>
