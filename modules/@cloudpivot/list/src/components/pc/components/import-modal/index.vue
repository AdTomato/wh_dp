<template>
  <a-modal
    v-model="showModal"
    :title="$t('cloudpivot.list.pc.ImportData')"
    :width="1120"
    :cancelText="$t('cloudpivot.list.pc.Skip')"
    :okText="$t('cloudpivot.list.pc.SureImport')"
    @ok="sureImport"
    @cancel="cancel"
    wrapClassName="import-err-modal"
    :maskClosable="false"
  >
    <div class="data-import-status--halfsuccess" v-if="isHalfSuccess">
      <p class="data-import-status--halfsuccess__success">
        <i class="icon aufontAll h-icon-all-check-circle"/>
        <span>{{ $t('cloudpivot.list.pc.ImportTips6', {num: successNum}) }}</span>
      </p>
      <p class="data-import-status--halfsuccess__error">
        <i class="icon aufontAll h-icon-all-close-circle"/>
        <span>{{ $t('cloudpivot.list.pc.ImportTips7', {num: failNum}) }}</span>
        <span class="data-import-status--halfsuccess__tip">
          {{ $t('cloudpivot.list.pc.ImportTips8') }}
          <a href="javascript:;" @click="exportErrorResult">{{ $t('cloudpivot.list.pc.DownloadFailedList') }}</a>
        </span>
      </p>
    </div>
    <div class="title-tips">{{ $t('cloudpivot.list.pc.importTitleTips') }}</div>
    <sheet v-if="showModal" :columns="columns" :dataSource="dataSource"></sheet>
    <div
      class="pagination-box"
      ref="paginationBox"
    >
      <a-pagination
        :current="curPage"
        :total="total"
        :showTotal="total => $t('cloudpivot.list.pc.Total', { num: total })"
        :pageSize="pageSize"
        :pageSizeOptions="pageSizeOptions"
        showSizeChanger
        showQuickJumper
        @change="onPaginationChange"
        @showSizeChange="onSizeChange"
      />
    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import {
  State, namespace
} from 'vuex-class';
import sheet from './sheet.vue';
import { listApi, listParams } from '@cloudpivot/api';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: "import-err-modal",
  components: {
    sheet
  }
})

export default class ImportErrModal extends Vue {
  @WorkflowCenterModule.State('applicationPageTitle') applicationPageTitle: any;

  @Prop() value!: boolean;

  @Prop({
    type: Number,
    default: 0
  }) successNum!: number;

  @Prop({
    type: Number,
    default: 0
  }) failNum!: number;

  @Prop({
    type: Number,
    default: 8
  }) status!: any;

  @Prop({
    type: String,
  }) fileName!: string;

  @Prop() importData!: any;

  get isHalfSuccess() {
    return this.status === listParams.ImportResult.PartialSuccess;
  }

  showModal: boolean = false;

  total: number = 0;

  pageSize: number = 20;

  curPage: number = 1;

  columns: any = [];

  dataSource: any = [];

  // 分页配置项
  pageSizeOptions: string[] = ['10', '20', '50', '100'];

  /* 
  * 初始化表头
  */
  initColumns() {
    const _columns = this.importData.headColumns.map((col:any, idx:number) => {
      let colWidth: number = this.caculateColWidth(col);
      let childColumns = null;

      // 子表初始化其子数据项
      if (col.propertyType === 8) {
        if (!col.childColumns || !col.childColumns.length) {
          return;
        }
        let childSheetWidth:number = 0;
        childColumns = col.childColumns.map((child:any) => {
          const childWidth:number = this.caculateColWidth(child);
          childSheetWidth += childWidth;
          return {
            title: child.name,
            dataIndex: child.propertyCode,
            propertyType: child.propertyType,
            width: childWidth,
            key: child.propertyCode,
          }
        });
        colWidth = childSheetWidth;
      }
      
      const back = {
        title: col.name,
        dataIndex: col.propertyCode,
        propertyType: col.propertyType,
        displayFormat: col.displayFormat,
        width: colWidth,
        key: col.propertyCode,
        childColumns
      };

      return back;
    }).filter(Boolean);

    // 增加序号列
    if (_columns.length) {
      const indexColumn = {
        dataIndex: 'index',
        propertyType: 0,
        width: 46,
        key: 'index',
        childColumns: null
      };
      _columns.unshift(indexColumn);
    }

    this.columns = _columns;
  }

  /* 
  * 初始化表格数据（本地分页）
  */
  initTableData() {
    if (this.importData && this.importData.secondImportData) {
      this.dataSource = this.importData.secondImportData.slice(0, this.pageSize);
      this.total = this.importData.secondImportData.length;
    };
  }

  /*
  * 分页改变
  */
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.dataSource = this.importData.secondImportData.slice((page-1)*this.pageSize, page*this.pageSize);
  }

  /*
  * 分页pageSize改变
  */
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.dataSource = this.importData.secondImportData.slice(0, size);
  }

  /*
   * 计算记录中列的宽度
  */
  caculateColWidth(col:any) {
    const longInput = [1, 5, 8, 9, 10];
    if (longInput.includes(col.propertyType)) {
      return 252;
    }
    return 162;
  }

  /* 
  * 确定导入
  */
  async sureImport() {
    this.importData.secondImportData.forEach((data:any) => {
      delete data.index;
      delete data.key;
    });
    const params = {
      headColumns: this.importData.headColumns,
      secondImportData: this.importData.secondImportData,
      queryField: this.importData.queryField,
    };
    const res = await listApi.secondImportData(params);
    if (res.errcode === 0) {
      this.$message.success(this.$t('cloudpivot.list.pc.ImportSuccess'));
      this.$emit('reloadList', 'reload');
      this.cancel();
    } else {
      if (res.errcode === 303030 && res.data) {
        this.$message.error(res.errmsg);
        this.importData = {
          headColumns: res.data.headColumns,
          secondImportData: res.data.secondImportData,
          queryField: res.data.queryField
        }
        this.initColumns();
        this.initTableData();
        return;
      }
      this.$message.error(res.errmsg);
    }
  } 

  cancel() {
    this.$emit('input', false);
  }

  /**
   * 下载错误信息文档
   */
  async exportErrorResult() {
    const res = await listApi.exportErrorResult(this.fileName);
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      this.$message.error(this.$t('cloudpivot.list.pc.DownloadFailed'));
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const stamp = new Date().getMilliseconds();
      const fileName = `${this.applicationPageTitle}错误信息${this.getTime()}.xlsx`;

      this.downloadFile(blob, fileName);
    }
  }

  getTime() {
    const date = new Date();
    const mounth = date.getMonth() > 8 ? date.getMonth() + 1:  `0${date.getMonth() + 1}`;
    const days = date.getDate() > 9 ? date.getDate():  `0${date.getDate()}`;
    const hours = date.getHours() > 9 ? date.getHours():  `0${date.getHours()}`;
    const minutes = date.getMinutes() > 9 ? date.getMinutes():  `0${date.getMinutes()}`;
    const seconds = date.getSeconds() > 9 ? date.getSeconds():  `0${date.getSeconds()}`;

    const stamp = `${date.getFullYear()}${mounth}${days}${hours}${minutes}${seconds}`;
    return stamp;
  }

  downloadFile(blob: any, fileName: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = fileName;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  /* 
  * 重置分页器参数
  */
  resetPagination() {
    this.total = 0;
    this.curPage = 1;
    this.pageSize = 20;
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showModal = v;
    if (v) {
      this.initColumns();
      this.initTableData();
    } else {
      this.resetPagination();
    }
  }
}
</script>

<style lang="less">
.import-err-modal{
  .title-tips{
    font-size: 14px;
    color: rgba(0,0,0,0.45);
    line-height: 24px;
  }
  .pagination-box{
    margin-top: 8px !important;
    text-align: right;
    padding: 8px 16px;
  }
  /deep/.ant-pagination-total-text{
    margin-right: @base4-padding-md;
  }
  /deep/.ant-pagination-options {
    height: 32px;
  }
  /deep/.ant-modal-header{
    border-bottom: none;
  }
  /deep/.ant-modal-body{
    padding-bottom: 8px;
  }
  /deep/.ant-modal-footer{
    border-top: none;
  }
  .data-import-status--halfsuccess {
    text-align: left;
    margin-bottom: 16px;
    p {
      line-height: @line-height-11;
      span {
        margin-left: 16px;
        font-size: @font-size-16;
        color: rgba(0,0,0,0.85);
      }
      .data-import-status--halfsuccess__tip {
        margin-top: 8px;
        padding-left: 32px;
        font-size: @font-size-14;
        color: rgba(0,0,0,0.45);
        a {
          margin-left: 10px;
          color: @primary-color;

        }
      }
      &.data-import-status--halfsuccess__success {
        i {
          color: @success-color
        }
      }
      &.data-import-status--halfsuccess__error {
        margin-top: 24px;
        i {
          color: @error-color
        }
      }
    }
  }
}
</style>
