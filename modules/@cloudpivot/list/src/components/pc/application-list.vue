<template>
  <div id="portal-form-list-container" class="app-menu">
    <div
      id="ApplicationList"
      class="application-box"
      ref="application"
    >
      <!-- style="height: 0px" -->
      <!-- <printHtml style="height: 0px"  :options="opts" /> -->
      <!-- v-if="showTitle" -->
      <div class="content-top" ref="contentTop">
        <h2>
          <!-- 左侧logo -->
          <slot name="left"></slot>
          <!-- 1 -->
          <!-- <span v-if="isSPA">{{ $route.params.displayName }}</span> -->
          <div
            class="list-header"
            @click="showQueryHeaderList = !showQueryHeaderList"
          >
            <div :title="isChinese ? curTitle : curTitleNameI18n[$i18n.locale]">{{ isChinese ? curTitle : curTitleNameI18n[$i18n.locale] }}</div>
            <i v-show="!showQueryHeaderList && showIcon" class="icon aufontAll h-icon-all-down-o"></i>
            <i v-show="showQueryHeaderList && showIcon" class="icon aufontAll h-icon-all-up-o"></i>
          </div>

          <div class="query-header-list" v-if="showQueryHeaderList && showIcon">
            <div
              class="list-item"
              :class="{'selected': curListCode === list.code}"
              v-for="(list, index) in queryHeaderList"
              :key="index"
              @click="changeListView(list)"
            >
              <i class="icon aufontAll h-icon-all-layout-o"></i>
              <div class="item-name">{{ isChinese ? list.name : list.name_i18n[$i18n.locale] }}</div>
              <i class="checked icon aufontAll h-icon-all-check" v-show="curListCode === list.code"></i>
            </div>

            <!-- 下拉框遮罩 -->
            <div class="filter-mask" @click="showQueryHeaderList = false"></div>
          </div>
        </h2>

        <!-- 操作 -->
        <div class="actions-box">
          <!-- 设置展示项 -->
          <div class="settings">
            <div class="settings-item" v-if="queryConditions && queryConditions.length > 0">
              <filterCard
                @clear="clear"
                v-if="queryConditionSource.length === 1"
                :source="queryConditionSource"
              />
              <filterCard
                @item-click="toggleQueryConditions"
                @clear="clear"
                v-else-if="queryConditionSource.length > 1"
                :source="queryConditionSource"
              />
              <a-tooltip v-if="queryConditionSource.length <= 1">
                <template slot="title">
                  {{ $t('cloudpivot.list.pc.Screen') }}
                </template>
                <i
                  class="icon aufontAll  h-icon-all-filter-o"
                  :class="{'high-light': isShowFilterBox}"
                  @click="toggleQueryConditions"
                ></i>
              </a-tooltip>
            </div>
            <div class="settings-item">
              <a-tooltip>
                <template slot="title">
                  {{ $t('cloudpivot.list.pc.SetDisplayItems') }}
                </template>
                <i class="icon aufontAll  h-icon-all-setting-o" @click="columnSetting"></i>
              </a-tooltip>
            </div>
          </div>
          <!-- 其他操作按钮:新增/删除/... -->
          <div
            id="list-actions"
            ref="actions"
          >
            <template v-for="(ac,index) in queryActions">
              <a-button
                v-show="ac.actionCode !== 'edit'"
                :class="ac.attributes && ac.attributes.class || `list-action-${ac.actionCode}`"
                :id="ac.attributes && ac.attributes.id"
                :type="index === 0 ? 'primary' : 'default'"
                :key="index"
                :disabled="(!deleteDisabled && ac.actionCode === 'delete') || (exportDisabled && ac.actionCode === 'export') || (exportDisabled && ac.actionCode === 'qr_code')"
                @click="actionClick(ac)"
              >{{ isChinese ? ac.name : ac.name_i18n[$i18n.locale] }}</a-button>
            </template>
            <!-- <a-button type="primary" @click="printQrCode">打印二维码</a-button> -->
          </div>
        </div>
      </div>

      <!-- 加载状态 -->
      <PageLoading
        v-model="isLoading"
        shadeColor="#F4F6FC"
        :shadeOpacity="1"
      />
      <!-- 列表数据 -->
      <div class="table-box" v-if="isShowTableBox">
        <div
          class="filters-box"
          v-show="isShowFilterBox"
          ref="filtersBox">
          <query-form
            ref="queryForm"
            :fields="queryConditions"
            @setFilterData="setFilterData"
            @hide="hideQueryItem"
          />
        </div>

        <div
          class="table"
          ref="table"
        >
          <!-- 旧版表单 -->
          <sheet
            v-if="tableConfig.keepInOldVersion||tableConfig.version==='1.0'"
            v-show="cusColumns.length>0"
            :checkbox="canDelete"
            :checkeds="checkeds"
            :columns="cusColumns"
            :rows="rows"
            :columnSlots="columnSlots"
            :rowSlots="rowSlots"
            @check="onCheck"
            @columnResize="onResizeEnd"
          >
            <!-- checkbox -->
            <span slot="checkboxTitle" v-if="canDelete">
              <a-checkbox
                @change.stop="selectAll"
                v-model="isSelectAll"
              ></a-checkbox>
            </span>
            <!-- 序号 -->
            <span
              class="order-number-box"
              slot="indexTitle"
            >
              <span>{{ $t('cloudpivot.list.pc.Number') }}</span>
            </span>

            <span
              slot="checkbox"
              v-if="canDelete"
              slot-scope="{text, row}"
            >
              <a-checkbox
                v-model="row.isChecked"
                @change.stop="onItemCheckboxChange"
              ></a-checkbox>
            </span>
            <span
              class="order-number-box"
              slot="index"
              slot-scope="{row}"
            >
              <span>{{ JSON.stringify(row) }}</span>
            </span>

            <!-- 自定义的列 头 -->
            <template v-for="(item, index) in cusColumns">
              <span
                :key="index"
                :slot="columnSlots[item.key]"
                :title="item.vcTitle"
                class="text-ellipsis"
                v-show="item.isShow"
              >{{ isChinese ? item.vcTitle : item.name_i18n[$i18n.locale] }}</span>
            </template>

            <!-- 自定义的列 表体 :title="text" -->
            <template
              v-for="(item, index) in cusColumns"
              :slot="rowSlots[item.key]"
              slot-scope="{column, rowIndex}"
            >
              <span
                :key="index"
                class="cursor text-ellipsis"
                v-show="item.isShow"
                @click="goForm(column, rowIndex)"
              >{{ getLabelContent(column, rowIndex) }}</span>
            </template>

          </sheet>
          <!-- 新版表单 -->
          <list-custom-template
            v-else
            v-show="cusColumns.length>0"
            :pageVM="pageVM"
            :tableConfig="tableConfig"
            :originalTableColumns="cusColumns"
            :originalTableData="dataSource"
            @onCheck="onCheck"
            @onResizeEnd="onResizeEnd"
          >
          </list-custom-template>

          <!-- 所有列取消勾选  -->
          <div class="no-columns" v-if="cusColumns.length <= 0 && (!isShowNoData && !isShowSearchNoData)">
            <img src="./components/no-data/images/no-data.png" alt="">
            <p>{{ $t('cloudpivot.list.pc.chooseColumns') }}</p>
          </div>

          <div class="no-data" v-if="isShowNoData || isShowSearchNoData">
            <PageNoData
              :isShowNoData="isShowNoData"
              :isShowSearchNoData="isShowSearchNoData"
              :tipText="$t('cloudpivot.list.pc.NoData')"
            />
          </div>
        </div>



        <div
          class="pagination-box"
          ref = "paginationBox"
          v-if="cusColumns.length > 0"
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
      </div>

      <div class="load-fail-box">
        <PageLoadFail v-model="isShowLoadFailBox" @refresh="reload"/>
      </div>

    </div>
    <a-modal
      class="import-modal"
      v-model="visible"
      :title="$t('cloudpivot.list.pc.ImportData')"
      @cancel="handleCancel"
      :width="552"
      :destroyOnClose="true"
      :footer="null"
      :mask="true"
      :maskClosable="false"
      :keyboard="false"
    >
      <data-upload
        v-if="showUploadModel"
        @change="changeImportBtnStatus"
        @setFileName="setImportFileName"
        @setQueryField="setImportQueryField"
        :schemaCode="schemaCode"
        :queryCode="curListCode"
      ></data-upload>

      <data-import
        v-if="showImportModel"
        :percent="importPercent"
        @importEnd="importEnd"
      ></data-import>
      <data-import-status
        v-if="showImportStatus"
        :successNum="successNum"
        :failNum="failNum"
        :status="importStatus"
        :fileName="importFileName"
        :schemaCode="schemaCode"
        :queryCode="curListCode"
      ></data-import-status>
      <div class="modal-footer">
        <a-button
          v-if="showCancelButton"
          key="back"
          @click="handleCancel"
        >{{ $t('cloudpivot.list.pc.Cancel') }}</a-button>
        <a-button
          v-if="showUploadModel"
          key="import"
          type="primary"
          :disabled="!canImport"
          @click="confirmImport"
        >{{ $t('cloudpivot.list.pc.StartImport') }}</a-button>
        <a-button
          v-if="showConfirmButton"
          key="confirm"
          type="primary"
          @click="confirm"
        >{{ $t('cloudpivot.list.pc.OK') }}</a-button>
        <!-- <a-button
          v-if="showReImportButton"
          key="reimport"
          type="primary"
          @click="reImport"
        >{{ $t('cloudpivot.list.pc.ReImport') }}</a-button> -->
      </div>
    </a-modal>
    <!-- 导入选人值报错时，导入错误信息弹窗 -->
    <!-- <button @click="showImportErrModal = true" style="position: absolute;top: 90px;left: 420px;z-index: 9898;">打开</button> -->
    <ImportErrModal
      v-model="showImportErrModal"
      :status="secondImportStatus"
      :successNum="secondSuccessNum"
      :failNum="secondFailNum"
      :fileName="importFileName"
      :importData="importData"
      @reloadList="getQueryList"
    ></ImportErrModal>

    <DataExport
      v-model="showDataExport"
      :queryColumns="queryColumns"
      @exportEnd="handleExportData"
    ></DataExport>
    <!-- 打印二维码弹窗 -->
    <PrintQrcode
      v-model="showPrintQrcode"
      :checkedLength="checkedLength"
      @createPrintQrCodeData="createPrintQrCodeData"
    ></PrintQrcode>
    <!-- 删除弹窗 -->

    <columnSetting
      v-model="showColumnSetting"
      :columns="columns"
      @confirm="reRenderTable"
      @recovery="recovery"
    />
    <div class="pdf-frame-div" v-if="pdfUrl.includes('?file=') && isShowPdf"></div>
    <iframe
      class="pdf-frame"
      id="pdfFrame"
      :srcdoc="srcdoc"
    ></iframe>
    <a-icon
      v-if="isShowPdf"
      @click="closePdf"
      type="close"
      class="close-previewPdf"
    />
    <!-- :options="opts" -->
    <printHtml style="height: 0px; overflow: hidden" :options="opts" />
  </div>
</template>
<script src="./scripts/application-list.ts" />
<style lang="less">
  .application-box {
    .content-top{
      &>h2{
        position: relative;
      }
    }
    .list-header{
      cursor: pointer;
      &>div{
        display: inline-block;
        max-width: 144px;
        overflow: hidden;
        white-space: nowrap;
        vertical-align: middle;
        text-overflow: ellipsis;
      }
      i{
        font-size: 13px;
        color: rgba(0,0,0,0.65);
        margin-left: 8px;
      }
    }
    .query-header-list{
      position: absolute;
      top: 30px;
      left: 0;
      width: 480px;
      background: #fff;
      box-shadow: 0px 2px 8px 0px rgba(30,85,255,0.15);
      border-radius: 4px;
      z-index: 30;
      .list-item{
        height: 32px;
        line-height: 32px;
        padding: 0 16px;
        cursor: pointer;
        position: relative;
        z-index: 9;
        &:hover{
          background: #f0f7ff;
        }
        &.selected{
          background: #f8fbff;
        }
        i{
          color: #1890FF;
          font-size: 18px;
          float: left;
        }
        .item-name{
          font-size: 14px;
          width: 292px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin-left: 8px;
          float: left;
        }
        .checked{
          float: right;
        }
      }
    }
    .sheet {
      .sheet__body > .sheet__row {
        position: relative;
        &.marked::after {
          content: '';
          display: block;
          width: 4px;
          height: calc(100% - 1px);
          position: absolute;
          left: 0;
          top: 0;
          background: #FAAD14;
        }
      }
    }
    /*ie11 css hack*/
    @media all and (-ms-high-contrast:none) {
      .sheet {
        .sheet__row.sheet__head {
          padding-right: 17px;
        }
      }
    }
  }
</style>
<style lang='less' scoped>
@import "./style/index.less";
@media screen and (max-width: 1366px) {
  .application-box .table-box .no-data {
    margin-top: 50px;
  }
}
.modal-footer {
  height: 53px;
  line-height: 53px;
  text-align: right;
  margin-bottom: -24px;
  & button + button {
    margin-left: 8px;
    margin-bottom: 0;
  }
}
.actions-box {
  display: flex;
  align-items: center;
  justify-content: space-around;
  .settings {
    display: flex;
    .settings-item {
      margin-right: 16px;
      cursor: pointer;
      .icon:hover {
        color: @primary-color;
      }
      .high-light{
        color: @primary-color;
      }
    }
  }
  #list-actions {
    button {
      margin-right: 8px;
      &:last-of-type {
        margin-right: 0;
      }
    }
  }
}
.table-box {
  position: relative;
  min-height:400px;
  .filters-box {
    position: absolute;
    width: 100%;
    z-index: 666;
    margin-top: -8px;
  }
  .table {
    /deep/.sheet__body::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0);
      box-shadow: unset;
      transition: all ease .3s;
    }
  & /deep/.scrollbar .sheet__cols {
    opacity: 0;
  }

  &.active {
    /deep/.sheet__body::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, .45);
      box-shadow: auto;
    }
    & /deep/.scrollbar .sheet__cols {
      opacity: 1;
    }
  }

  /deep/.sheet .sheet__body .sheet__row {
    transition: all ease .3s;
    &:hover {
      background: #f0f7ff;
    }
  }

  .common-table.active .common-table__tbody-wrap::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, .45);
    box-shadow: auto;
  }
    height: 100%;
    max-height: calc(100% - 50px);
    /deep/.ant-table-wrapper {
      height: 100%;
    }
    /deep/.ant-table-body {
      max-height: calc(100vh - 95px - 52px - 160px)!important;
    }
    &.has-filterbox {
      /deep/.ant-table-body {
        max-height: calc(100vh - 155px - 52px - 160px)!important;
      }
    }

    .order-number-box {
      .index {
        margin-left: @base4-padding-lg;
      }
    }
    .name{
      cursor: pointer;
    }
    .cursor {
      cursor: pointer;
      display: block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      &:hover {
        color: @primary-color;
      }
    }
    .no-columns {
      text-align: center;
      position: absolute;
      top: 40%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  }
  /*ie11 css hack*/
  @media all and (-ms-high-contrast:none) {
    *::-ms-backdrop, .table { max-height: calc(100% - 68px); }
  }
}


.load-fail-box {
  padding-top: 100px;
  text-align: center;
}

/deep/.ant-pagination-total-text{
  margin-right: @base4-padding-md;
}
.pagination-box { margin-top:0!important; }
/deep/.ant-pagination-options {
  height: 32px;
}
.delete-title{
  color: rgba(0,0,0,0.85);
  font-weight: 600;
}
.delete-content{
  margin-left: -38px;
  background: #FFFBE6;
  border: 1px solid #FFE58F;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
  div{
    color: rgba(0,0,0,0.85);
    font-size: 14px;
    line-height: 22px;
    .tip-text{
      color: rgba(0,0,0,0.65);
      font-size: 12px;
    }
    span{
      font-weight: 600;
    }
    img{
      width: 5px;
      height: 5px;
      margin-right: 5px;
      margin-top: -2px;
      vertical-align: middle;
    }
  }
  .hidden{
    display: none;
  }
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
