
<template>
  <div class="h3-form-sheet"
    @touchmove.stop
    @touchstart.stop
    @touchend.stop
    :class="{vertical: layoutType}"
    v-show="display">
    <div
      class="h3-form-sheet-head sheet-row"
      :class="{'h3-form-sheet-head_sticky' : !isHorizontal}"
    >
      <span :style="style">{{ label }}</span>
      <div class="sheet-row__actions">
        <div
          v-if="editModal"
          @click="removeChecked"
          v-show="isTable && canDelete"
          class="sheet-row__actions__item"
        >
          <span class="aufontAll h-icon-all-delete-o"></span>
        </div>

        <div
          v-if="editModal"
          @click="addSheetRow"
          v-show="!isHorizontal"
          class="sheet-row__actions__item"
        >
          <span class="aufontAll h-icon-all-plus-o"></span>
        </div>

        <div @click="changeMode" class="sheet-row__actions__item">
          <span
            class="aufontAll"
            :class="[isHorizontal? 'h-icon-all-list-o' : 'h-icon-all-same-size']"
          ></span>
        </div>
      </div>
    </div>

    <template v-if="isTable">
      <div class="sheet" v-if="control.columns.length">
        <div class="sheet-center">
          <table>
            <thead>
              <tr>
                <th class="col50">
                  <input
                    type="checkbox"
                    :checked="checkedAll"
                    @click="checkAll"
                  />
                </th>
                <th class="col50">{{ $t('cloudpivot.form.renderer.number') }}</th>
                <th
                  v-for="(col,colIdx) in control.columns"
                  :key="col.key"
                  v-show="showColumn(colIdx)"
                >{{ getColumnLabel(col) }}</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(row,rowIdx) in rows" :key="rowIdx">
                <td class="col50">
                  <input
                    type="checkbox"
                    :checked="checkeds[rowIdx]"
                    @click="check(rowIdx)"
                  />
                </td>
                <td class="col50">{{ rowIdx + 1 }}</td>
                <td
                  v-for="(col,colIdx) in row"
                  :key="col.key"
                  @resize="setHeights(rowIdx)"
                  v-show="showColumn(colIdx)"
                >
                  <div>
                    <base-control-adapter
                      v-show="col.controller.display"
                      :control="col"
                      :class="{ error : col.controller.hasError }"
                    ></base-control-adapter>
                  </div>
                </td>
              </tr>

              <tr v-if="showTotal">
                <td class="col50" colspan="2">{{ $t('cloudpivot.form.renderer.total') }}</td>
                <td
                  v-for="(col,colIdx) in control.columns"
                  :key="colIdx"
                  style="text-align:center;"
                  v-show="showColumn(colIdx)"
                >
                  <template
                    v-if="showStat(col.key)"
                  >{{ getStatText(col.key) }}{{ statisticsMap[col.key] | number }}</template>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="h3-form-sheet-action sheet-row" v-show="isHorizontal">
        <div class="h3-form-sheet-action-tab" ref="selectedTab">
          <span
            class="sheet-row__actions__item"
            :class="[currentIndex + 1 === key ? 'h3-form-sheet-action-tab-selected' : '']"
            v-for="key in sheetTab"
            :key="key"
            @click="changeTab(key - 1)"
          >{{ key }}</span>
        </div>

        <div class="sheet-row__actions">
          <!--交互： 超过30条时展示可以搜索的便捷操作-->
          <div
            class="sheet-row__actions__item"
            v-if="rows.length > 29"
            @click="search"
          >
            <span class="aufontAll h-icon-all-matrix"></span>
          </div>

          <div
            v-if="editModal"
            @click="addSheetRow"
            class="sheet-row__actions__item"
          >
            <span class="aufontAll h-icon-all-plus-o"></span>
          </div>
        </div>
      </div>

      <div
        class="h3-rows"
        :class="{ horizontal : isHorizontal }"
        :style="`margin-left:${isHorizontal ? currentIndex * -100 : 0}%`"
      >
        <div
          class="h3-form-sheet-component"
          v-for="(row, rowIndex) in rows"
          :key="`row-${rowIndex + 1}`"
          :class="{ active: (!isHorizontal || ( isHorizontal && currentIndex === rowIndex)) }"
          :id="id + rowIndex"
        >
          <div
            class="h3-form-sheet-col-title sheet-row"
            v-show="!isHorizontal"
          >{{ $t('cloudpivot.form.renderer.indexOf',{ index : rowIndex + 1 }) }}</div>

          <div>
            <base-control-adapter
              v-for="(col, colIndex) in row"
              :key="`col-${colIndex + 1}`"
              :control="col"
              v-show="col.options.visible && col.controller.display"
              :class="{ error : col.controller.hasError }"
            ></base-control-adapter>
          </div>

          <div class="h3-form-sheet-footer sheet-row" v-if="editModal">
            <span @click="copy(rowIndex)">
              <i class="aufontAll h-icon-all-copy-o"></i>
              {{ $t('cloudpivot.form.renderer.copy') }}
            </span>

            <span @click="splice(rowIndex)">
              <i class="aufontAll h-icon-all-delete-o"></i>
              {{ $t('cloudpivot.form.renderer.delete') }}
            </span>
          </div>

          <p class="h3-form-sheet-col-margin"></p>
        </div>
      </div>

      <h3-modal
        :show.sync="showModel"
        :appendToBody="true"
        maskClosable
        type="popup"
        popupDirection="right"
        @on-show="showSearch"
        @on-hide="hideSearch"
      >
        <div class="h3-form-sheet-search-title">{{ $t('cloudpivot.form.renderer.selectNumber') }}</div>
        <div class="h3-form-sheet-search-list">
          <span
            class="h3-form-sheet-search-item"
            v-for="key in sheetTab"
            :key="key"
            @click="changeTab(key - 1)"
            :class="{ selected : currentIndex === key }"
          >{{ key }}</span>
        </div>
      </h3-modal>

      <div>
        <h3-dialog v-model="showRelevanceFormAdd" class="dialog-sheet-add">
          <div class="dialog-sheet-add__content">
            <div class="dialog-tips">
              <p>{{ $t("cloudpivot.form.runtime.biz.addMethod") }}</p>
            </div>
            <div class="dialog-content">
              <p @click="add">{{ $t("cloudpivot.form.runtime.biz.add") }}</p>
              <p @click="importRelevance" class="no-padding">{{ $t("cloudpivot.form.runtime.biz.importFormRelevanceForm") }}</p>
            </div>
          </div>
        </h3-dialog>
      </div>
      <relevance-form-modal
        v-if="control"
        class="relevance-form-panel"
        v-control-back
        v-transfer-dom
        :visible="showModal"
        :schemaCode="schemaCode"
        :queryCode="queryCode"
        :control="control"
        @change="relevanceFormChange"
        :columns="columns"
        :query="query"
        @back="close"
      ></relevance-form-modal>
    </template>
  </div>
</template>


<script lang="ts">
import { Vue, Prop, Component, Watch, Inject } from "vue-property-decorator";

import { H3Modal, H3CheckboxItem } from "h3-mobile-vue";

import { RendererFormControl, SheetDisplayMode } from "../../typings";

import BaseControlAdapter from "./base-control-adapter.vue";

import * as typings from "../../typings";

import { FormBuilderHelper } from "../../controls/form-builder-helper";

import { FormSheetControl, RelevanceFormControl } from "../../controls";

import numberFilter from "../number-filter";

import H3Dialog from "h3-mobile-vue/src/components/h3-dialog/index";

import ControlBack from '../../directives/control-back';

import TransferDom from '../../directives/transfer-dom';

import RelevanceFormModal from "./relevance-form/relevance-form-modal2.vue";
import { FormControlValueService, ReverseQueryService } from "../../services";


import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormControlOptions
} from "h3-forms";

@Component({
  name: "form-sheet",
  components: {
    BaseControlAdapter,
    H3Modal,
    H3Dialog,
    H3CheckboxItem,
    RelevanceFormModal
  },
  filters: {
    number: numberFilter
  },
  directives: {
    ControlBack,
    TransferDom
  }
})
export default class FormSheet extends FormSheetControl {
  // 子表交互属性
  mode = SheetDisplayMode.Waterfall;

  currentIndex: number = 0;

  showModel: boolean = false;

  checkeds: boolean[] = [];

  shadowLeft = false;

  shadowRight = false;

  @Inject()
  emitScrollTop!: (top: number) => void;

  @Inject()
  emitScrollLock!: (lock: boolean) => void;

  // 子表计算属性
  get isHorizontal() {
    // return this.mode === "h";
    return this.isPage;
  }

  @Inject()
  layoutTypeFn!: Function;

  aa () {
    console.log('22222222222222')
  }

  // get aa () {
  //   debugger
  //   return this.schemaCode;
  // }

  //上下布局模式
  get layoutType(){
    if(this.layoutTypeFn){
      return this.layoutTypeFn();
    }
  }

  get sheetTab() {
    return this.rows.length ? this.rows.length : 0;
  }

  get isWaterfall() {
    return this.mode === SheetDisplayMode.Waterfall;
  }

  get isPage() {
    return this.mode === SheetDisplayMode.Page;
  }

  get isTable() {
    return this.mode === SheetDisplayMode.Table;
  }

  get canDelete() {
    return this.checkeds.some(c => c);
  }
  // 是否可以编辑
  get editModal() {
    return !this.readonly && this.canEdit
  }

  get isReadonly() {
    return this.readonly
  }

  get checkedAll() {
    return this.checkeds.length > 0 && this.checkeds.every(c => c);
  }

  get indeterminate() {
    const checkeds = this.checkeds.filter(c => c);
    return checkeds.length > 0 && checkeds.length < this.checkeds.length;
  }

  checkAll(evt: any) {
    const checked = evt.target.checked;
    this.checkeds = this.checkeds.map(c => checked);
  }

  check(idx: number) {
    const checked = this.checkeds[idx];
    this.$set(this.checkeds, idx, !checked);
  }

  removeChecked() {
    this.checkeds
      .map((c, i) => (c ? i : -1))
      .filter(i => i > -1)
      .reverse()
      .forEach(i => this.splice(i));
  }

  // 子表交互函数
  // changeMode() {
  //   // console.log("222");
  //   if (this.mode === "h") {
  //     this.mode = "v";
  //     return;
  //   }
  //   this.mode = "h";
  // }
  changeMode() {
    if (this.isWaterfall) {
      this.mode = SheetDisplayMode.Page;
    } else if (this.isPage) {
      this.mode = SheetDisplayMode.Table;
    } else if (this.isTable) {
      this.mode = SheetDisplayMode.Waterfall;
    }
  }

  changeTab(key: number) {
    if (this.showModel) {
      this.showModel = false;
      this.positionRow();
    }

    const idx = this.currentIndex;

    if (idx === key) {
      return;
    }

    this.currentIndex = key;
  }

  @Watch("isEdit")
  onWritableChange() {
    super.edit();
  }

  setControl() {
    this.mode =
      this.controlOpts.mobileDisplayMode || SheetDisplayMode.Waterfall;

    const ctrl = this.getCtrl();
    if (!ctrl) {
      return;
    }

    this.reset();

    super.listenPropertyChange();

    super.initStat();

    super.initRows();

    this.checkeds = this.rows.map(() => false);

    super.listenRowChange();

    this.currentIndex = 0;
  }

  copy(idx: number) {
    super.copy(idx);
  }

  showRelevanceFormAdd = false;

  showModal = false;

  // get schemaCode() {
  //   return super.schemaCode;
  // }

  get queryCode() {
    return super.queryCode;
  }

  query:any[] = [];
  importRelevance() {
    this.show();
    this.query = this.getParams(true);
    this.columns = this.relavanceColumns();
    this.closeAdd();
  }

  addSheetRow() {
    if (this.importFormRelevanceForm) {
      this.showRelevanceFormAdd = true;
    } else {
       this.add();
    }
  }

  show() {
    this.showModal = true;
  }
  close() {
    this.showModal = false;
  }
  async relevanceFormChange(val) {
    const formControls = this.getFormControls();
    // debugger;
    this.close();
    const dataitems = await RelevanceFormControl.service.dataitemsOf(
      this.schemaCode
    );
    if (!val || val.length === 0) return;
    val.forEach(res => {
      const obj:any = {};
      (this.control as any).columns.forEach(c => {
        if (c.key === this.controlOpts.importFormRelevanceForm) {
          // debugger;
          let formData = res;
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
      // this.addRow(obj);
    });
  }

  closeAdd() {
    this.showRelevanceFormAdd = false;
  }

  add(idx?: number, vals?: any) {
    const row =
      typeof idx === "number" ? this.addRow(vals, idx) : this.addRow(vals);

    if (this.showRelevanceFormAdd) {
      this.closeAdd();
    }
  }

  splice(idx: number) {
    this.removeRow(idx);
  }

  rowInserted(index: number, row: RendererFormControl[]): void {
    this.checkeds.splice(index, 0, false);
    this.changeTab(index);

    this.positionRow();
  }

  rowRemoved(index: number, row: RendererFormControl[]) {
    this.checkeds.splice(index, 1);
    this.changeTab(index === 0 ? 0 : index - 1);
    this.positionRow();
  }

  rowsInserted(index: number, rows: RendererFormControl[][]): void {
    const news = rows.map(() => false);
    this.checkeds.splice(index, 0, ...news);
    this.changeTab(index + rows.length - 1);
    // this.changeTab(index);
    this.positionRow();
  }

  rowsRemoved(indexs: number[]) {
    for (const index of indexs) {
      this.checkeds.splice(index, 1);
    }

    if (this.currentIndex > this.checkeds.length) {
      const index = this.checkeds.length === 0 ? 0 : this.checkeds.length - 1;
      this.changeTab(index);
    }

    this.positionRow();
  }

  search() {
    this.showModel = true;
  }

  showSearch() {
    this.emitScrollLock(true);
  }

  hideSearch() {
    this.emitScrollLock(false);
    this.showModel = false;
  }

  positionRow() {
    this.$nextTick(() => {
      if (this.mode === SheetDisplayMode.Waterfall) {
        const id = "#" + this.id + this.currentIndex;
        const el = this.$el.querySelector(id) as HTMLDivElement;
        if (el) {
          this.emitScrollTop(el.offsetTop);
        }
      } else if (this.mode === SheetDisplayMode.Page) {
        const selectedTab = this.$refs.selectedTab as any;
        const tab = this.$el.querySelector(
          ".h3-form-sheet-action-tab-selected"
        ) as HTMLDivElement;
        if (tab) {
          selectedTab.scrollLeft = tab.offsetLeft;
        }
      }
    });
  }
}
</script>

<style lang="less" scoped>
.sheet-row {
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  padding: 0 15px;
  height: 45px;
  border-bottom: 1px solid #eee;
  background: #fff;

  &__actions__item {
    width: 45px;
    height: 45px;
    line-height: 45px;
    font-size: 14px;
    text-align: center;
    display: inline-block;
    color: #999;
    user-select: none;
  }
}

.h3-form-sheet {
  .aufontAll {
    color: @primary-color;
  }
  &-head {
    font-size: 17px;
    font-weight: 500;
    padding-right: 0;
    color: #333;
    &_sticky {
      background-color: #fff;
      // position: sticky;
      // top: 0;
      z-index: 2;
    }
  }

  &-action {
    background-color: #fff;
    padding: 0;
    // position: sticky;
    // top: 0;
    z-index: 2;

    &-tab {
      flex-grow: 1;
      overflow-x: scroll;
      white-space: nowrap;

      &::-webkit-scrollbar {
        height: 0;
      }

      span {
        color: #333;
      }

      &-selected {
        // color: @primary-color !important;
        background: @background-color;
      }
    }

    & > .sheet-row__actions {
      flex-shrink: 0;
      box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
    }
  }

  &-component {
    // background-color: #F8F8F8;
    // padding-bottom: 0.5em;

    .h3-form-sheet-col-title {
      text-align: left;
      font-size: 15px;
      font-weight: 500;
      color: #333;
    }

    .h3-form-sheet-col-margin {
      height: 4px;
      width: 100%;
      background-color: #f8f8f8;
    }

    & > div {
      min-height: 45px;
    }
  }

  &-footer {
    color: @primary-color;
    justify-content: space-between;
    padding: 0;
    align-items: initial;

    span {
      display: inline-flex;
      width: 50%;
      font-size: 14px;
      justify-content: center;
      align-items: center;
      position: relative;
      user-select: none;

      &:not(:last-child)::after {
        content: "";
        height: @font-size-20;
        width: 1px;
        background: #eeeeee;
        position: absolute;
        top:12.5px;
        right: 0;
      }

      i {
        margin-right: 8px;
      }

      // &:active{
      //   background:@background-color;
      // }
    }
  }

  &-search-title {
    height: 45px;
    line-height: 45px;
    padding: 0 15px;
    color: #666666;
    font-size: 15px;
    text-align: left;
  }
  &-search-list {
    text-align: left;
    padding: 0 7px 0 15px;

    .h3-form-sheet-search-item {
      display: inline-block;
      width: 54px;
      height: 34px;
      background: #f7f8fc;
      border-radius: 4px;
      line-height: 34px;
      margin-right: 8px;
      margin-bottom: 8px;
      text-align: center;
      color: #333;

      &.selected {
        background: #e9f0ff;
      }
    }
  }
}

// .sheet {
//   display: flex;
//   flex-grow: 1;
// }

td,
th {
  border: 1px #e8e8e8 solid;
  min-height: 38px;
  height: 38px;
}

thead th {
  background-color: #fafafa;
  max-height: 38px;
  // padding: 0 8px;
  font-weight: 500;
}

tbody td {
  // padding: 3px 8px;
  word-break: break-all;
}

.sheet-center > table {
  border-collapse: unset;
  border-spacing: 0;
  border: none;
  z-index: 1;
}

.sheet-center {
  flex: 1 1;
  overflow: auto;

  & > table {
    min-width: 100%;
    & th,
    td {
      border: 1px #e8e8e8 solid;
      min-width: 136px;
      max-width: 320px;
      border: 1px #e8e8e8 solid;
      border-width: 1px 0 0 1px;
      position: relative;

      /deep/ .h3-field-layout-h-label {
        display: none;
      }

      /deep/ .h3-field-line::after {
        display: none;
      }

      /deep/ .h3-upload::after {
        display: none;
      }

      /deep/ .field__label {
        display: none;
      }

      /deep/ .field.relevance-form::after {
        display: none;
      }

      /deep/ .h3-org::after {
        display: none;
      }

      /deep/ .h3-radio-list::after {
        display: none;
      }
    }

    tr {
      &:first-child th {
        border-top-width: 0;
      }

      &:last-child td {
        border-bottom-width: 1px;
      }

      td,
      th {
        &.col50,
        &:first-child {
          width: 50px;
          min-width: 50px;
        }
        &:last-child {
          border-right-width: 1px;
        }
      }
    }
  }
}

.sheet-right {
  &.shadow {
    box-shadow: -6px 0 6px -4px rgba(0, 0, 0, 0.15);
  }

  & th,
  td {
    width: 46px;
    min-width: 46px;
    max-width: 46px;
    text-align: center;
    vertical-align: middle;
    border: 1px #e8e8e8 solid;
    border-width: 1px 1px 0 0;
  }

  tr {
    &:first-child th:first-child {
      border-top-right-radius: 4px;
    }

    &:last-child td {
      border-bottom-width: 1px;
      &:first-child {
        border-bottom-right-radius: 4px;
      }
    }
  }
}

.row-menus {
  & > li {
    cursor: pointer;
  }
}

/deep/.h3-modal-popup-slide-right {
  width: 336px !important;
}

/deep/.h3-modal-wrap-side {
  overflow: auto;
}

.h3-rows.horizontal {
  display: flex;
  flex-direction: row;
  will-change: margin-left;
  transition: margin-left 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;

  .h3-form-sheet-component {
    flex-shrink: 0;
    width: 100%;
    transition: opacity 0.45s;
    opacity: 1;

    &:not(.active) {
      opacity: 0;
      height: 0;
      padding: 0 !important;
      pointer-events: none;
    }
  }
}
.dialog-sheet-add{
  text-align: left;
  &__content{
    padding: 0.56rem;
    p {
      text-align: left;
      // margin-bottom: 0.4rem;
      line-height: 1.17rem;
      
    }
    .dialog-content {
      p {
        color: #333;
        font-size:  0.37rem;
        
      }
      p.no-padding{
        margin-bottom: 0;
      }
    }
  }
  .h3-dialog{
    width: 7.2rem;
  }
}
</style>

