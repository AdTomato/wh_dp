<template>
  <h3-panel
    v-if="control.columns.length > 0"
    v-show="display"
    :title="!canFull ? label : ''"
    :collapsible="true"
    :labelStyle="style"
    :iconRight="true"
    :tips="tips"
  >
    <a-divider v-if="(!readonly || canExport) && !canFull" />

    <slot name="settingTips" />

    <template slot="fullIcon" v-if="!canFull">
      <a-tooltip placement="top">
        <template slot="title">
          <span>{{ $t("cloudpivot.form.runtime.biz.fullScreen") }}</span>
        </template>
        <span @click="$emit('fullScreen')" class="fullscreen icon aufontAll">&#xe8e5;</span>
      </a-tooltip>
    </template>

    <div class="actions" v-if="(!readonly || canExport) && !canFull">
      <template>
        <a-button
          icon="plus"
          type="primary"
          v-if="!readonly && canEdit"
          @click="add"
        >{{ $t("cloudpivot.form.runtime.biz.add") }}</a-button>

        <a-button
          icon="download"
          @click="importRelevance"
          v-if="!readonly && importFormRelevanceForm && canEdit"
        >{{ $t("cloudpivot.form.runtime.biz.importFormRelevanceForm") }}</a-button>

        <a-button
          icon="download"
          @click="importSheet"
          v-if="!readonly && importAble && canEdit"
        >{{ $t("cloudpivot.form.runtime.biz.import") }}</a-button>

        <a-button
          icon="upload"
          @click="exportSheet"
          v-if="canExport"
        >{{ $t("cloudpivot.form.runtime.biz.export") }}</a-button>

        <a-button
          icon="delete"
          v-if="!readonly && canEdit"
          @click="removeChecked"
          :disabled="!canDelete"
        >{{ $t("cloudpivot.form.runtime.biz.delete") }}</a-button>
      </template>
    </div>

    <div class="actions heard" v-if="canFull">
      <h3>{{ label }}</h3>
      <div>
        <template v-if="!readonly || canExport">
          <a-button
            icon="plus"
            type="primary"
            v-if="!readonly && canEdit"
            @click="add"
          >{{ $t("cloudpivot.form.runtime.biz.add") }}</a-button>

          <a-button
            icon="download"
            @click="importRelevance"
            v-if="!readonly && importFormRelevanceForm && canEdit"
          >{{ $t("cloudpivot.form.runtime.biz.importFormRelevanceForm") }}</a-button>
          <a-button
            icon="download"
            @click="importSheet"
            v-if="!readonly && importAble && canEdit"
          >{{ $t("cloudpivot.form.runtime.biz.import") }}</a-button>
          <a-button
            icon="upload"
            @click="exportSheet"
            v-if="canExport"
          >{{ $t("cloudpivot.form.runtime.biz.export") }}</a-button>
          <a-button
            icon="download"
            @click="importRelevance"
            v-if="!readonly && importFormRelevanceForm && canEdit"
          >{{ $t("cloudpivot.form.runtime.biz.importFormRelevanceForm") }}</a-button>
          <a-button
            icon="delete"
            v-if="!readonly && canEdit"
            @click="removeChecked"
            :disabled="!canDelete"
          >{{ $t("cloudpivot.form.runtime.biz.delete") }}</a-button>
        </template>
        <a-tooltip placement="top">
          <template slot="title">
            <span>{{ $t("cloudpivot.form.runtime.biz.smallScreen") }}</span>
          </template>
          <span @click="$emit('fullScreen')" class="fullscreen icon aufontAll">&#xe8e7;</span>
        </a-tooltip>
      </div>
    </div>

    <import-modals
      v-if="showModal"
      :visible="showModal"
      @cancel="handleCancel"
      @importFinishe="importFinishe"
      :params="sheetParams"
      :sheet="control"
    />

    <sheet
      ref="sheet"
      :rowNumber="pageStart"
      :checkbox="(canEdit && !readonly) || canExport"
      :showAction="!readonly"
      :showTotal="controlOpts.showTotal"
      :columns="control.columns"
      :rows="pagingRows"
      :stats="statisticsMap"
      :checkeds="pagingCheckeds"
      :class="{ fullsheet: canFull }"
      :frozenKeys="frozenKeys"
      @check="onCheck"
      @checkAll="onCheckAll"
      @columnResize="onColumnResize"
      @freezeColumn="onFreezeColumn"
    >
      <template slot="action" slot-scope="{ row, index }">
        <a-popover overlayClassName="sheet-menus" v-if="canEdit">
          <template slot="content" v-if="canEdit">
            <ul class="row-menus">
              <li v-if="canEdit" @click="copy(index)">{{ $t("cloudpivot.form.renderer.copy") }}</li>
              <li
                v-if="canEdit"
                @click="clear(index)"
              >{{ $t("cloudpivot.form.renderer.sheet.clearRow") }}</li>
              <li
                v-if="canEdit"
                @click="add(index)"
              >{{ $t("cloudpivot.form.renderer.sheet.addBefore") }}</li>
              <li
                v-if="canEdit"
                @click="add(index + 1)"
              >{{ $t("cloudpivot.form.renderer.sheet.addAfter") }}</li>
            </ul>
          </template>
          <a-icon type="ellipsis" />
        </a-popover>
      </template>
    </sheet>

    <div class="pagination" v-show="total > 20">
      <a-pagination
        :current="pageIndex"
        :total="total"
        :showTotal="total => $t('cloudpivot.list.pc.Total', { num: total })"
        :pageSize="pageSize"
        :pageSizeOptions="pageSizeOptions"
        showSizeChanger
        showQuickJumper
        @change="onPageIndexChange"
        @showSizeChange="onPageSizeChange"
      />
    </div>

    <a-modal
      :title="formTitle"
      :visible="isShowRelevance"
      :width="'850px'"
      :destroyOnClose="true"
      :maskClosable="false"
      :keyboard="false"
      :class="{'relevance-form':true}"
      @ok="onModalOk"
      @cancel="onModalCancel"
    >
      <list-selector
        v-model="selected"
        :listCode="queryCode"
        :schemaCode="schemaCode"
        :cols="2"
        :columns="columns"
        :showActions="false"
        :query="query"
        :defuaultShowSearch="false"
        
        :multiple="true"
      ></list-selector>
      <!-- @change="onListChange" -->
    </a-modal>
  </h3-panel>
</template>

<script lang="ts">
import { Vue, Prop, Component, Watch, Inject } from "vue-property-decorator";

import { FormControlValueService, ReverseQueryService } from "../../../services";

import { RendererFormControl, FormControlType } from "../../../typings";

import BaseControlAdapter from "../base-control-adapter.vue";

import * as typings from "../../../typings";

import * as schema from "../../../../schema";

import { FormBuilderHelper } from "../../../controls/form-builder-helper";

import ImportModals from "../../shared/import-data/import.vue";

import common from "@cloudpivot/common";

import { listParams } from "@cloudpivot/api";

import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControlOptions,
  FormControlErrorCodes
} from "h3-forms";

import { FormSheetControl, UploadControl,RelevanceFormControl } from "../../../controls";

import { FormRendererHelper } from "../../form-renderer-helper";

import numberFilter from "../../number-filter";

import { listApi } from "@cloudpivot/api";

import {
  Popover,
  Divider,
  Button,
  Checkbox,
  Tooltip,
  Icon,
  Modal,
  Pagination
} from "h3-antd-vue";

import Sheet from "./sheet";
import { ColumnResize } from "./sheet";

export interface SheetColumnResize extends ColumnResize {
  sheet: schema.FormSheet;
}

@Component({
  name: "form-sheet",
  components: {
    AModal: Modal,
    AIcon: Icon,
    APopover: Popover,
    ADivider: Divider,
    AButton: Button,
    ACheckbox: Checkbox,
    ATooltip: Tooltip,
    APagination: Pagination,
    BaseControlAdapter,
    ImportModals,
    H3Panel: common.components.pc.Panel,
    H3SizeSlider: common.components.pc.H3SizeSlider,
    Sheet: () => import("./sheet.vue")
  },
  filters: {
    number: numberFilter
  }
})
export default class FormSheet extends FormSheetControl {
  @Prop({
    default: false
  })
  canFull!: boolean;
  
  @Inject()
  emitSheetColumnResize!: (data: SheetColumnResize) => void;

  checkeds: boolean[] = [];

  isFullScreen = false;

  // 分页配置项
  pageSizeOptions = ["10", "20", "50", "100", "200", "300"];

  pageSize = 20;

  pageIndex = 1;

  get canDelete() {
    return this.checkeds.some(c => c);
  }

  get total() {
    return this.rows.length;
  }

  get pageStart() {
    const start = (this.pageIndex - 1) * this.pageSize;
    return start;
  }

  get pageEnd() {
    let end = this.pageIndex * this.pageSize;
    if (end > this.total) {
      end = this.total;
    }
    return end;
  }

  get pagingRows() {
    return this.rows.slice(this.pageStart, this.pageEnd);
  }

  get pagingCheckeds() {
    return this.checkeds.slice(this.pageStart, this.pageEnd);
  }

  @Prop({
    default: () => []
  })
  frozenKeys!: string[];

  @Watch("isEdit")
  onIsEditChange() {
    // this.$set(this.control,'edit',!this.readonly);
    super.edit();
  }

  setControl() {
    const ctrl = this.getCtrl();
    if (!ctrl) {
      return;
    }

    this.reset();

    super.listenPropertyChange();

    this.initRows();

    super.initStat();

    this.checkeds = this.rows.map(() => false);

    super.listenRowChange();

    if (this.canFull && this.control.edit) {
      super.edit();
    }
  }

  onCheck(checkeds: boolean[]) {
    this.checkeds.splice(
      this.pageStart,
      this.pageEnd - this.pageStart,
      ...checkeds
    );
  }

  onCheckAll(check : boolean){
    this.checkeds = this.checkeds.map(() => check);
  }

  onColumnResize(data: SheetColumnResize) {
    if (this.emitSheetColumnResize) {
      data.sheet = this.sheet;
      this.emitSheetColumnResize(data);
    }
  }

  onFreezeColumn(columnKey: string, freeze: boolean) {
    this.$emit("freezeColumn", columnKey, freeze);
  }

  onPageIndexChange(page: number, size: number) {
    this.pageIndex = page;
  }

  onPageSizeChange(page: number, size: number) {
    this.pageIndex = 1;
    this.pageSize = size;
  }

  removeChecked() {
    // debugger
    this.checkeds
      .map((c, i) => (c ? i : -1))
      .filter(i => i > -1)
      .reverse()
      .forEach(i => this.splice(i));
    
    if(this.pagingRows.length === 0){
      this.pageIndex = 1;
    }
  }

  copy(idx: number) {
    super.copy(idx);
  }

  add(idx?: number, vals?: any) {
    const row =
      typeof idx === "number" ? this.addRow(vals, idx) : this.addRow(vals);
  }

  splice(idx: number) {
    this.removeRow(idx);
  }

  rowInserted(index: number, row: RendererFormControl[]): void {
    this.checkeds.splice(index, 0, false);
    if (this.control.edit) {
      super.edit();
    }
    this.syncScroll();
  }

  rowRemoved(index: number, row: RendererFormControl[]) {
    this.checkeds.splice(index, 1);
  }

  rowsInserted(index: number, rows: RendererFormControl[][]): void {
    const news = rows.map(() => false);
    this.checkeds.splice(index, 0, ...news);
    if (this.control.edit) {
      super.edit();
    }
    this.syncScroll();
  }

  rowsRemoved(indexs: number[]) {
    for (const index of indexs) {
      this.checkeds.splice(index, 1);
    }
  }

  syncScroll() {
    this.$nextTick(() => {
      const $sheet = this.$refs.sheet as Sheet;
      if ($sheet) {
        $sheet.syncScrollLeft();
        $sheet.handleRootScroll();
      }
    });
  }

  /**
   * 子表导入,导出代码
   *
   */
  showModal = false;
  // sheetParams:any = {}

  importSheet() {
    this.showModal = true;
  }

  /**
   * reset
   */
  handleCancel() {
    this.showModal = false;
  }

  /**
   * 导出
   */

  exportSheet() {
    // debugger
    const exportRows: string[] = [];

    // const ctrl:any = JSON.parse(JSON.stringify(this.ctrl));

    this.checkeds.forEach((r, index) => {
      // debugger
      if (r) {
        const value: any = (this.ctrl as any).rows[index].value;
        if (value.id) {
          exportRows.push(value.id as string);
        }
      }
    });

    const params = Object.assign({}, this.sheetParams);

    params.name =
      this.control.options.name +
      this.$t("cloudpivot.form.renderer.exportFile").toString();

    if (exportRows.length > 0) {
      params.objectIds = exportRows;
    }

    UploadControl.service.exportSheet(params);
  }

  isShowRelevance = false;

  selected = [];

  // onListChange(val) {
  //   debugger;
  // };

  beforeCreate() {
    const comp = RelevanceFormControl.loadListSelector();
    
    (this.$options as any).components.ListSelector = comp;
  }

  async onModalOk() {
    const formControls = this.getFormControls();
    const dataitems = await RelevanceFormControl.service.dataitemsOf(
      this.schemaCode
    );
    this.selected.forEach(res => {
      const obj:any = {};
      (this.control as any).columns.forEach(c => {
        if (c.key === this.controlOpts.importFormRelevanceForm) {
          let formData:any = res;
          if (this.mappings) {
            formData = ReverseQueryService.convertForMappings(res, dataitems, this.mappings, formControls);
          }
          obj[c.key] = formData;
        } else {
          obj[c.key] = null;
        }
      });
      const backRow:any = this.addRow();
      
      backRow.value = obj;
    });
    this.selected = [];
    this.onModalCancel();
  }

  
  onModalCancel() {
    this.isShowRelevance = false;
  }
  async importRelevance() {
    this.isShowRelevance = true;
    this.query = this.getParams(false);
    this.columns = this.relavanceColumns();
    this.formTitleObj = await RelevanceFormControl.service.getBizmodelTitle(this.schemaCode || '');
  }

  importFinishe(val: any) {
    // debugger;
    if (!val) return;
    for (const col of (this.control as any).columns) {
      val.forEach((row: any) => {
        if (row[col.key] !== undefined && row[col.key] !== null) {
          row[col.key] = FormControlValueService.convert(
            col.type,
            row[col.key]
          );
        } else {
          row[col.key] = FormBuilderHelper.getControlValue(col as any);
        }
      });
    }
    for (const row of val) {
      this.addRow(row);
    }
  }

  get sheetParams() {
    const formStatus: any = {
      DRAFT: 0,
      PROCESSING: 1,
      CANCELLED: 2,
      COMPLETED: 3
    };

    const params: any = Object.assign({}, this.control.options.sheetParams);
    params.sequenceStatus = formStatus[params.sequenceStatus];
    return params;
  }
}
</script>

<style lang="less" scoped>
.h3-panel {
  width: 100%;
  text-align: left;
}

.h3-panel.vertical{
  padding: 0 12px;
}

.ant-divider-horizontal {
  margin: 1px 0;
}

.actions {
  margin: 16px 0;
  text-align: left;

  .fullscreen {
    float: right;
    margin-top: 4.5px;
    cursor: pointer;
  }
  /*ie11 css hack*/
  @media all and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .fullsheet {
      margin-right: 8px;
    }
  }

  & > button {
    margin-right: 8px;
  }
}

.actions.heard {
  box-shadow: 0px -1px 0px 0px rgba(232, 232, 232, 1);
  margin: 0;
  padding: 16px;
  display: flex;
  justify-content: space-between;

  & > h3 {
    line-height: 32px;
    font-weight: 600;
  }

  & > div {
    text-align: right;
    & > button {
      margin-left: 8px;
    }
    .fullscreen {
      margin-left: 17px;
      // margin-right: 25px;
    }
  }
}

/deep/.fullsheet > .sheet {
  margin: 0 10px;
  .sheet__body {
    max-height: calc(100vh - 115px);
    overflow-y: scroll;
    margin-right: -6px;
  }

  /*ie11 css hack*/
  @media all and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .sheet__body {
      margin-right: -17px;
    }
  }

  .sheet__body.show-total {
    max-height: calc(100vh - 160px);
  }

  & + .sheet__row.scrollbar {
    margin: 0 10px;
  }
}

.pagination{
  text-align: right;
}
</style>

<style lang="less">
.modal-footer {
  text-align: right;
  button {
    margin-left: 8px;
  }
}
</style>
