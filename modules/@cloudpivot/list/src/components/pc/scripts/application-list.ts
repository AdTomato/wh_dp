import '@/config/h3-form';

import {
  Component, Prop, Vue, Watch, Provide
} from 'vue-property-decorator';
import {
  Button, Modal, Table, Pagination, Checkbox, Icon, Tooltip
} from 'h3-antd-vue'; // todo

import {
  State, Action, namespace
} from 'vuex-class';

import * as queryConditionTypings from '../helper/query-conditions.typings';

import { DataItemType } from '@cloudpivot/list/src/typings/data-items';

import * as  AllTypes from './all.typings';

import { listApi, listParams } from '@cloudpivot/api';

import * as  applicationList from '@cloudpivot/list';

import * as platform from '@cloudpivot/platform';

import common from '@cloudpivot/common';

import CommonTable from '@cloudpivot/flow-center/src/components/pc/components/common-table/table.vue';

import sheet from '@cloudpivot/form/src/renderer/components/pc/form-sheet/sheet.vue';

import columnSetting from '../components/column-setting.vue';

import ImportErrModal from '../components/import-modal/index.vue';

import filterCard from '../components/filter-card/filter-card.vue';

import printHtml from '../printHTML.vue';

import * as Helper from '../helper/helper';

import queryConditionHelper from '../helper/query-conditions';

import printQrCode from './printQrcode';

import columnWidthRecord from './recordColunmWidth';

import onActionClick from './onActionClick';

import listEventHooksHandler from '@cloudpivot/list/src/components/listCustom/eventHooks/handler'

import { QueryActionTypes } from '@cloudpivot/h3-list/src/core/schema/basic/enums';

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

// 挂载给钩子
import axios from 'axios';
// 自定义模板 --start
import listCustomTemplate from '../listCustomTemplate.vue';
import { is } from 'tinymce';
// 自定义模板 --end


@Component({
  name: 'app-list',
  components: {
    sheet,
    ImportErrModal,
    listCustomTemplate,  // 模板抽离
    CommonTable,
    printHtml,
    columnSetting: columnSetting,
    filterCard: filterCard,
    AButton: Button,
    AModal: Modal,
    ATable: Table,
    APagination: Pagination,
    ACheckbox: Checkbox,
    AIcon: Icon,
    ATooltip: Tooltip,
    DataImport: applicationList.components.pc.DataImport,
    DataUpload: applicationList.components.pc.DataUpload,
    DataImportStatus: applicationList.components.pc.DataImportStatus,
    QueryForm: applicationList.components.pc.QueryForm,
    DataExport: applicationList.components.pc.DataExport,
    PrintQrcode: applicationList.components.pc.PrintQrcode,
    PageNoData: common.components.pc.PageNoData,
    PageLoading: common.components.pc.PageLoading,
    PageLoadFail: common.components.pc.LoadFail
  }
})

export default class AppList extends Vue {
  @WorkflowCenterModule.State('applicationPageTitle') applicationPageTitle: any;

  @WorkflowCenterModule.Action('getDataItemList') getDataItemList: any;

  // 挂载给钩子
  axios:any = axios;

  @Prop({
    default: true
  }) showTitle!: boolean;

  @Prop() offset!: number; // 集成到钉钉的垂直方向偏移量

  @Prop({ default: false }) isSPA!: boolean;

  get pageVM() {
    return this;
  }

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  get showUploadModel() {
    return this.isInitView;
  }

  get showImportModel() {
    return this.isImporting;
  }

  get showImportStatus() {
    return !this.isImporting && !this.isInitView && this.importStatus !== listParams.ImportResult.Unspecified;
  }

  get showConfirmButton() {
    return this.importStatus === listParams.ImportResult.DataNumExceed
      || this.importStatus === listParams.ImportResult.DataColumnError
      || this.importStatus === listParams.ImportResult.PartialSuccess;
  }

  get showReImportButton() {
    return this.importStatus === listParams.ImportResult.SystemError;
  }

  get showCancelButton() {
    return this.isInitView || this.importStatus === listParams.ImportResult.SystemError;
  }

  get schemaCode() {
    const { schemaCode } = this.$route.params;
    return schemaCode;
  }

  get recordKey() {
    const code:string = this.curListCode;
    return `${code}_width_records`;
  }

  get columnsOptsKey() {
    const code:string = this.curListCode;
    return `${code}_columns_options`;
  }

  // 删除按钮置灰状态
  get deleteDisabled() {
    return this.checkeds.some((c: boolean) => c);
  };

  showImportErrModal: boolean = false;

  // 是否显示加载中
  isLoading: boolean = true;

  // 自定义脚本相关
  eventHooksHandler:any = null;
  customStyle:string = '';
  isRenderingReady:boolean = false;

  // 是否显示表格
  isShowTableBox: boolean = false;

  isShowTable: boolean = false;

  // 加载失败
  isShowLoadFailBox: boolean = false;

  // 记载完全部
  isShowLoadAll: boolean = false;

  // 加载无数据
  isShowNoData: boolean = false;

  // 搜索无数据
  isShowSearchNoData: boolean = false;

  curTitle: string = '';

  curTitleNameI18n: any = {};

  visible: boolean = false;

  isInitView: boolean = true;

  isUploading: boolean = false;

  canImport: boolean = false;

  isImporting: boolean = false;

  importPercent: number = 0;

  importStatus: listParams.ImportResult = listParams.ImportResult.Unspecified;

  secondSuccessNum = 0;

  secondFailNum = 0;

  secondImportStatus: listParams.ImportResult = listParams.ImportResult.FaileReImport;

  isImportEnd: boolean = false;

  showDataExport: boolean = false;

  checkedLength: number = 0;

  showPrintQrcode: boolean = false;

  successNum: number = 0;

  failNum: number = 0;

  importFileName: string = '';

  importrQueryField: string = '';

  // 表头固定
  scrollY: number = 0;

  scrollX: number = 0;

  // 自定义列去除序号和摘要
  cusColumns: Array<any> = [];

  // 标识初次加载列表
  firstLoad: boolean = true;

  columnSlots: any = {};

  rowSlots: any = {};

  rows: any = [];

  showColumnSetting: boolean = false;

  defaultColums: any = [];

  isShowPdf: boolean = false; // 是否展示pdf

  pdfUrl: string = '';

  opts: any = {};

  sheetCode: string = ''; // 批量打印二维码按钮绑定表单编码

  queryFormValues:any = ''; // 查询条件再赋值

  adaptWidth: boolean = false;

  isShowFilterBox: boolean = false;

  columns: any[] = [];

  dataSource:any[] = [];
  userListData:any;

  queryActions: any[] = [];

  queryConditions: Array<listParams.QueryConditions> = [];

  queryPresentation: object|null = null;

  total: number = 100;

  pageSize: number = 20;

  curPage: number = 1;

  // 分页配置项
  pageSizeOptions: string[] = ['10', '20', '50', '100'];

  filterData: Array<listParams.Filters> = [];

  // 是否全选
  isSelectAll: boolean = false;

  // 导出按钮置灰状态
  exportDisabled: boolean = false;

  // 删除按钮权限
  canDelete: boolean = false;

  // 列表显示字段
  queryColumns: any = [];

  checkeds: any = [];

  queryConditionSource: any = []; // 查询条件展示数组

  srcdoc:string = '';

  isDingTalk:any = true;

  showQueryHeaderList:boolean = false;

  queryHeaderList:any = [];

  curListCode:string = '';

  showIcon:boolean = false;

  importData:any = {
    headColumns: [],
    secondImportData: [],
    queryField: ''
  };


  tableConfig:any = {
    version:'2.0',
    presentationType:'table',
    keepInOldVersion:false,
    fixedHeader:true,
    fixedLeftColumns:['__ordinalNo'],
    fixedRightColumns:[''],
    columnResizable:true,
    rowOrdinal:true,
    rowSelectable:false,
    scrollbarAutoHidding:false,
  }

  @Watch('canDelete')
  updateTableConfig(val) {
    this.tableConfig.rowSelectable = val;
  }


  created() {
    this.getQueryHeaders();
  }

  mounted() {
    const records: string = window.localStorage.getItem(this.recordKey) as string;
    this.adaptWidth = !!records;

    document.title = `奥哲云枢-${this.applicationPageTitle}` || '奥哲云枢';

    this.$message.config({
      maxCount: 1,
      duration: 2
    });
    // 接收消息
    window.addEventListener('message', this.reloadMessage, false);

    // 监控视口变化
    window.addEventListener('resize', this.setTableMaxHeight, false);
  }

  destroyed() {
    window.removeEventListener('message', this.reloadMessage, false);
    window.removeEventListener('resize', this.setTableMaxHeight);
    this.$message.destroy();

    // 销毁挂载器
    if (this.eventHooksHandler ) {
      this.eventHooksHandler.destroy();
      this.eventHooksHandler = null;
    }
  }

  onCheck(checkeds: boolean[]) {
    this.checkeds = checkeds;
    // console.log('______onche')
    console.log( checkeds )
  }

  /**
  * 展示搜索条件
  */
  toggleQueryConditions() {
    // 清空未确定的值
    (this.$refs.queryForm as any).backWriteData(this.queryFormValues);
    this.isShowFilterBox = !this.isShowFilterBox;
  }

  /**
   * 展示项设置弹窗
  */
  columnSetting() {
    this.showColumnSetting = true;
  }

  /*
  * 获取已点亮视图列表
  */
  async getQueryHeaders() {
    this.showQueryHeaderList = false;
    this.showIcon = false;
    const { schemaCode } = this.$route.params;
    const params = {
      schemaCode,
      clientType: listParams.QueryClientType.PC
    };
    const res = await listApi.getQueryHeaders(params);
    if (res.errcode === 0 && Array.isArray(res.data)) {
      res.data.forEach((item:any) => {
        common.utils.compatible(item, 'name');
      });
      this.queryHeaderList = res.data;
      this.curListCode = res.data[0] ? res.data[0].code : '';
      this.showIcon = res.data.length > 1;
    }

    // 获取数据项列表
    return this.getDataItem().then(() => {
      return this.getListConfigData();
    });
  }

  /*
  * 改变应用列表展示视图
  */
  async changeListView(list:any) {
    this.curListCode = list.code;
    this.showQueryHeaderList = false;
    this.isRenderingReady = false;
    this.resetView();
    this.getDataItem().then(() => {
      return this.getListConfigData();
    })
    // 改变视图也会触发 onLoad 和 onRendered
    // .then(()=>{
    //   if ( !this.eventHooksHandler ) {
    //     this.$nextTick(()=>{
    //       this.eventHooksHandler.exec('onLoad');
    //     });
    //   }
    // })
  }

  /*
  * 获取数据项列表
  */
  getDataItem() {
    return new Promise((resolve) => {
      const { schemaCode } = this.$route.params;
      const params = {
        schemaCode,
      };
      this.getDataItemList(params).finally(() => {
        resolve();
      });
    });
  }

  /*
  * 新增按钮打开新窗口新增表单后，关闭页面原列表刷新
  */
  reloadMessage(event: any) {
    if (event.source === window) return;
    if (event.data.indexOf('/application') !== -1 || event.data.indexOf('%2Fapplication') !== -1) {
      // 如果是新增动作,
      if ( event.data.indexOf('iframeAction=add')>=0 ) {
        this.getQueryList('append')
      } else {
        this.getQueryList('reload')
      }
    }
  }

  /*
  * 动态计算表格的最大高度
  */
  setTableMaxHeight() {
    this.$nextTick(() => {
      const table = this.$refs.table as HTMLElement;
      const tbody: HTMLElement = document.querySelector('.sheet__body') as HTMLElement;
      if (tbody) {
        tbody.style.maxHeight = `${table.clientHeight - 45}px`;
      }
    })
  }

  /**
   * 表格滚动条展示
  */
  setTableScroller() {
    this.$nextTick(() => {
      const tableBody: HTMLElement = document.querySelector('div.table') as HTMLElement;
      if (!tableBody) return;
      tableBody.onmouseenter = function () {
        tableBody.className = 'table active';
      }

      tableBody.onmouseleave = function () {
        tableBody.className = 'table';
      }
    })
  }

  /*
  * 全选
  */
  selectAll(e: Event) {
    const isChecked = (e.target as any).checked;

    if (isChecked) {
      this.dataSource.forEach((item: any, index: number) => {
        item.isChecked = true;
      });
    } else {
      this.dataSource.forEach((item: any, index: number) => {
        item.isChecked = false;
      });
    }
  }

  /*
  * 当checkbox选择change时事件
  */
  onItemCheckboxChange() {
    const isCheckedItems = this.dataSource.filter((d: any) => d.isChecked);
    if (isCheckedItems.length < this.dataSource.length) {
      this.isSelectAll = false;
    } else {
      this.isSelectAll = true;
    }
  }

  /**
   * 计算记录中列的宽度
  */
  caculateColWidth(columns: any): number {
    let colWidth: number = 0;
    const records: string = window.localStorage.getItem(this.recordKey) as string;

    if (records) {
      const recordJson: AllTypes.WidthRecords = JSON.parse(records) as AllTypes.WidthRecords;
      const item: AllTypes.Record = recordJson.value.find((d: AllTypes.Record) => Object.keys(d)[0] === columns.propertyCode) as AllTypes.Record;
      if (item) {
        colWidth = item[columns.propertyCode];
      } else {
        colWidth = columns.width ? Number(columns.width) : 176;
      }
    } else {
      colWidth = columns.width ? Number(columns.width) : 176;
    }
    return colWidth;
  }

  /*
  * 初始化表格表头信息
  */
  initColumns() {
    if (Array.isArray(this.queryColumns)) {
      this.queryColumns.forEach((colum: any) => {
        common.utils.compatible(colum, 'name');
      });
    };
    const columnsArray = this.queryColumns.filter((a: any) => a.propertyCode);
    let isShortText: boolean = true;
    if (columnsArray.some((c: any) => c.propertyCode === 'name')) {
      isShortText = false;
    }
    const columns: any[] = columnsArray.map((c: any) => {
      let colWidth: number = this.caculateColWidth(c);

      const back = {
        vcTitle: c.name,
        dataIndex: c.propertyCode,
        name_i18n: c.name_i18n,
        width: colWidth,
        propertyType: c.propertyType,
        isShortText: false,
        displayFormat: c.displayFormat,
        id: c.propertyCode,
        key: c.propertyCode,
        isShow: true
      };
      if (isShortText && c.propertyType === 0) {
        isShortText = false;
        back.isShortText = true;
      }
      if (c.propertyCode === 'name') {
        back.isShortText = true;
      }

      // 添加自定义列表头slot
      this.columnSlots[c.propertyCode] = `${c.propertyCode}Title`;

      // 添加自定义表体slot
      this.rowSlots[c.propertyCode] = `${c.propertyCode}Body`;

      return back;
    });
    this.defaultColums = JSON.parse(JSON.stringify(columns));

    // 判断是否存有记录
    const columnOpts: any = window.localStorage.getItem(this.columnsOptsKey);
    if (columnOpts) {
      const _column: any = JSON.parse(columnOpts);
      // this.cusColumns = _column.filter((col:any) => col.isShow);
      const showColumns = _column.filter((col: any) => col.isShow);
      // 记录列是否全在请求列中
      const isAllIncluded: boolean = showColumns.every((col: any) => !!columns.find((innerCol: any) => innerCol.key === col.key));
      if (isAllIncluded) {
        // 把剩余列修改成不显示
        const fCols: any = columns
          .map((col: any) => {
            const item: any = _column.find((innerCol: any) => col.key === innerCol.key);
            if (!item) { // 新增的展示列
              col.isShow = true;
              return col;
            }
          })
          .filter((col: any) => !!col);
        const _showColumns = _column.map((col:any) => {
          const item: any = columns.find((innerCol: any) => col.key === innerCol.key);
          if (item) {
            item.isShow = col.isShow;
            return item;
          }
        }).filter((col: any) => !!col);
        this.columns = _showColumns.concat(fCols);
        this.cusColumns = showColumns.concat(fCols);
      } else {
        // 记录列是否全不在请求列中
        let isAllNotInclude: boolean = true;
        showColumns.forEach((sCol: any) => {
          const f: boolean = !!columns.find((innerCol: any) => innerCol.key === sCol.key);
          if (!f) {
            isAllNotInclude = true;
          } else {
            isAllNotInclude = false;
          }
        })
        if (isAllNotInclude) { // 都不在，使用请求列，清空记录
          this.cusColumns = columns;
          this.columns = columns;
          window.localStorage.removeItem(this.columnsOptsKey);
        } else { // 部分在
          // 1. 找出展示列
          const sCols: any = showColumns.map((col: any) => {
            const c: any = columns.find((innerCol: any) => col.key === innerCol.key);
            if (c) {
              c.isShow = true;
              return c;
            }
          }).filter((col: any) => !!col);
          this.cusColumns = sCols;

          // 2. 把剩余列修改成不显示
          const fCols: any = columns
            .map((col: any) => {
              const item: any = sCols.find((innerCol: any) => col.key === innerCol.key);
              if (!item) {
                col.isShow = false;
                return col;
              }
            })
            .filter((col: any) => !!col);
          this.columns = sCols.concat(fCols);
        }
      }
    } else {
      this.cusColumns = JSON.parse(JSON.stringify(columns));
      this.columns = columns;
    }

    // 计算表格width
    this.scrollX = 0;
    columns.forEach((c: any) => {
      this.scrollX += c.width;
    });

    // console.log('colus', columns);
  }

  // 初始化视图自定义数据&事件
  async initPresentation(queryPresentation:any) {

    // console.log('__________________ initPresentation', queryPresentation)


    // 变量
    let vm = this as any;
    let listWrapper  = this.$refs.application as any;
    let styleElement = listWrapper.querySelector('#customStyle')
    let isStyleElementExist = !!styleElement;
    styleElement = styleElement || document.createElement('style');

    // 尝试解析
    let htmlObj, isError=!queryPresentation || !queryPresentation.htmlJson;
    try {
      if ( !isError ) htmlObj = JSON.parse(queryPresentation.htmlJson) as any;
    } catch(err) {
      isError = true;
      console.error(err);
    }

    // 如果数据为空|数据出错, 清空模型自定义数据&事件
    if ( isError ) {
      styleElement.innerHTML    = '';
      this.eventHooksHandler = null;
      return;
    }

    // 注入样式
    styleElement.innerHTML = htmlObj.styleJson;
    if ( !isStyleElementExist ) {
      styleElement.id = 'customStyle';
      listWrapper.appendChild(styleElement);
    }

    try {
      this.eventHooksHandler = listEventHooksHandler.loadSupportingVersionHandler({
        vm,
        scriptString:htmlObj.scriptJson,
        hooksOption:[
          {name:'onPreLoad', params:[]},
          {name:'onLoad',    params:['dataSource']},
          {name:'onRendered', params:['dataSource']},
          {name:'onPreAction', params:['dataSource']},
          {name:'onCustomAction', params:['dataSource']},
          {name:'onActionDone', params:[]},
        ],
      });
      // 初始化完毕直接调用 onPreLoad;
      await this.eventHooksHandler.exec('onPreLoad')
    } catch(err) {
      if ( err==='first version scription uncompatible!' ) return;
      this.$message.error(err.toString(), 8);
    }


    // TODO: 注入模板
  }

  /*
  * 分页改变
  */
  onPaginationChange(page: number, size: number) {
    this.curPage = page;
    this.getQueryList('pageChange');
    this.resetSelectAll(this);
  }

  /*
  * 分页pageSize改变
  */
  onSizeChange(current: number, size: number) {
    this.curPage = 1;
    this.pageSize = size;
    this.getQueryList('pageChange');
    this.resetSelectAll(this);
  }

  /*
  * 重新加载
  */
  reload() {
    this.getListConfigData();
  }

  /**
   * 按钮队列:
   */

  getAction(code:string) {
    return this.queryActions.find(a=>a.actionCode===code);
  }

  /*
  * 列表按钮点击事件
  */
  async actionClick(action: listParams.QueryActions) {
    const type = action.actionCode;
    // onPreAction 执行前
    if ( this.eventHooksHandler && (await this.eventHooksHandler.exec('onPreAction',action)) === false ) return;

    // executeAction 确认执行
    switch(type) {
      case 'add'    : onActionClick.handleAdd(this, action); break;
      case 'delete' : onActionClick.handleDeleteListData(this); break;
      case 'import' : this.visible = true; break;
      case 'export' : this.showDataExport = true; break;
      case 'qr_code': {
        const length = this.checkeds.filter((c: boolean) => c).length;
        this.checkedLength = length > 0 ? length : this.checkeds.length;
        this.showPrintQrcode = true;
      }; break;
      // 自定义按钮, 如果返回异步, 则等待异步完成触发 done; 否则直接触发 done;
      default : {
        if ( this.eventHooksHandler ) {
          this.eventHooksHandler.exec('onCustomAction',action)
          .then(resp=>{
            this.eventHooksHandler.exec('onActionDone',action,resp);
          });
        }
      }
    }
  }

  /*
  * 获取模型的配置信息
  */
  listConfig:any = null;
  async getListConfigData() {
    const { schemaCode } = this.$route.params;
    const params = {
      code: this.curListCode,
      schemaCode,
      source: 1
    };
    this.isLoading = true;
    const res = await listApi.getListConfigData(params);


    // 如果获取数据失败
    if ( !res || res.errcode!==0 || !res.data ) {
      this.curTitle = '';
      this.curTitleNameI18n = {};
      this.isShowLoadFailBox = true;
      this.isShowTableBox = false;
      this.isLoading = false;
      // 异常情况不触发
      this.$message.error(res.errmsg);


      await this.initPresentation( null);

      return;
    } else {

      this.listConfig = res.data;
      await this.initPresentation( res.data.queryPresentation || null);
    }


    // if (!res.data || true) {
    //   this.isShowTableBox    = false;
    //   this.isShowLoadFailBox = true;
    //   this.$message.error(res.errmsg);
    //   return;
    // }

    this.isShowLoadFailBox = false;

    if (res.data.name) {
      common.utils.compatible(res.data, 'name');
      this.curTitle = res.data.name;
      this.curTitleNameI18n = res.data.name_i18n;
    } else {
      this.curTitle = '';
      this.curTitleNameI18n = {};
    }

    // let hasCallRenderEvent = false;

    if (res.data.length === 0) return this.$message.error(res.errmsg);
    if (!res.data.queryConditions || res.data.queryConditions.length <= 0) {
      // this.isShowFilterBox = false;
      // WARN: 异步获取列表
      // hasCallRenderEvent = true;
      this.getQueryList('getConfig')
      // .then(resp=>{
      //   this.$nextTick(()=>{
      //     this.isRenderingReady = true;
      //   })
      // })
    } else {
      // this.isShowFilterBox = true;
      this.isShowTableBox   = true;
      if (Array.isArray(res.data.queryConditions)) {
        res.data.queryConditions.forEach((condition: any) => {
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
          common.utils.compatible(condition, 'name');
          condition.name_i18n['zh'] = condition.name;
          condition.name_i18n = JSON.stringify(condition.name_i18n);
        });
      };
    }
    this.queryConditions = res.data.queryConditions;

    let presentationActions = [];
    if ( res.data.queryPresentation && typeof(res.data.queryPresentation)==='object' ) {
      this.queryPresentation = res.data.queryPresentation;
      try {
        presentationActions = JSON.parse( (this.queryPresentation as any).actionsJson );
      } catch(err) {}
    }

    // 如果视图设计里有自定义按钮数据, 择取 queryActions 包含的系统按钮和 actionsJson 包含的自定义按钮:
    // 原本 actionsJson 只做 queryActions 的补充, 存些类名之类, 具体显示和默认数据都由 queryActions 来决定
    // 但现在接口 queryActions 对自定义按钮的权限处理上有些问题, 自定义字段本身也不能存在 queryActions 上
    // 所以需要合并 queryActions 和 actionsJson 的数据
    if ( presentationActions && presentationActions.length ) {
      let queryActions  = res.data.queryActions;
      // 获取 queryActions 中存在的数据还自定义数据
      this.queryActions = res.data.queryActions = presentationActions.map((a1:any)=>{
        let a2 = queryActions.find((a:any)=>a.actionCode===a1.actionCode);
        if (
          a2 || a1.queryActionType===QueryActionTypes.CUSTOM
        ) {
          return {...a2, ...a1, sortKey:a2.sortKey};  // sortKey 以接口为准
        }
        else return null;
      })
      .filter(Boolean)
      .sort((c:any,n:any)=>(c.sortKey-n.sortKey));
    }
    else {
      this.queryActions = res.data.queryActions;
    }




    if (this.queryActions && Array.isArray(this.queryActions)) {
      // 本地调试代码--qrcodescan
      // this.queryActions.push({
      //   actionCode: "qr_code",
      //   associationCode: 'sahngpin',
      //   associationType: 0,
      //   customService: false,
      //   icon: "download",
      //   id: "2c928e496be55caa016bf473716d011e",
      //   modifiedTime: "2019-07-31 16:51:23",
      //   name: "打印二维码",
      //   name_i18n: null,
      //   queryActionType: 8,
      //   queryId: "2c928e496be55caa016bf4737106010c",
      //   schemaCode: "sys",
      //   serviceCode: null,
      //   serviceMethod: null,
      //   sortKey: 3,
      //   systemAction: false
      // });
      const deleteBtn = this.queryActions.filter((ac: any) => ac.actionCode === 'delete' || ac.actionCode === 'export');
      this.canDelete = !!deleteBtn.length;
      this.queryActions.forEach((action: any) => {
        if (action.actionCode === 'qr_code') {
          this.sheetCode = action.associationCode;
        }
        common.utils.compatible(action, 'name');
      });
    }


    if (res.data.queryColumns) {
      this.queryColumns = res.data.queryColumns; //.filter((query: any) => query.propertyType !== 6);
      this.initColumns();
    }
    // this.getQueryList();

    // if ( !hasCallRenderEvent ) {
    //   this.$nextTick(()=>{
    //     this.isRenderingReady = true;
    //   })
    // }


  }

  /*
  * 获取查询条件
  */
  setFilterData(data: any) {
    const filterArray: any = [];
    const dataArray = Object.entries(data);
    this.queryFormValues = data;
    this.filterData = [];
    console.log(dataArray);
    dataArray.forEach((a: any) => {
      if (!a && !a[0]) {
        return;
      }
      const [key, value] = a;
      this.queryConditions.forEach((query: listParams.QueryConditions) => {
        let propertyValueName: string = '';
        if (key === query.propertyCode) {
          let propertyValue = value;
          if (Array.isArray(propertyValue)) {
            if (key === 'sequenceStatus') { // 后端传回来的只会是英文
              const sequenceStatus: any = [];
              propertyValue.forEach((pop: any) => {
                switch (pop) {
                  case '草稿':
                    return sequenceStatus.push('DRAFT');
                  case '进行中':
                    return sequenceStatus.push('PROCESSING');
                  case '已完成':
                    return sequenceStatus.push('COMPLETED');
                  case '已作废':
                    return sequenceStatus.push('CANCELED');
                  default:
                    break;
                }
              });
              propertyValue = sequenceStatus.join(';');
            } else if (propertyValue.length === 1 && query.propertyType === 2) {
              propertyValue = `${propertyValue};`;
            } else if (query.propertyType === DataItemType.StaffSelector) {
              propertyValue = JSON.stringify(propertyValue.map(p => ({
                id: p.id,
                unitType: p.unitType,
                name: p.name
              })));
            } else if (query.propertyType === DataItemType.Date && propertyValue.length === 2) {
              if (propertyValue[0] === propertyValue[1] && propertyValue[0] && propertyValue[1]) {
                propertyValue[0] = `${propertyValue[0]} 00:00:00`;
                propertyValue[1] = `${propertyValue[1]} 23:59:59`;
              }
              propertyValue = propertyValue.join(';');
            } else {
              propertyValue = propertyValue.join(';');
            }
          } else {
            switch (query.propertyType) {
              case DataItemType.RelevanceForm:
                propertyValue = value ? value.id : '';
                propertyValueName = value ? value.name : '';
                break;
              case DataItemType.Logic:
                propertyValue = value ? true : false;
                break;
              case DataItemType.Address:
                if (value && Object.keys(value).length > 0) {
                  propertyValue = JSON.stringify(propertyValue);
                } else {
                  propertyValue = null;
                }

                break;
              default:
                break;
            }
          }
          filterArray.push({
            propertyCode: query.propertyCode,
            propertyType: query.propertyType,
            propertyValue,
            propertyValueName
          });
        }
      });
    });
    this.filterData = filterArray;
    // filterData 转化成展示项
    const cacheData:any = window.sessionStorage.getItem('filterData');
    let filterData = this.filterData;
    if (platform.IS_DINGTALK) {
      if(cacheData) {
        const result:any = JSON.parse(cacheData);
        filterData = result.filterData;
      }
    }
    const qcArr = queryConditionHelper.getValue(queryConditionTypings.CheckTypes.FromFilterData, this.queryConditions as any, filterData as any);
    this.queryConditionSource = qcArr;
    // console.log('queryConditionTypings.,', this.queryConditions)
    console.log('filterData', filterData)
    console.log('qcArr', qcArr)
    this.curPage = 1;
    const _type: string = this.firstLoad ? '' : 'search';
    this.getQueryList(_type);
    this.resetSelectAll(this);
  }

  /*
  * 查询列表数据参数
  */
  queryParamsFormater() {
    const { schemaCode } = this.$route.params;
    const { queryCode } = this.$route.query;
    // 取缓存种的查询条件 dingtalk
    const cacheData:any = window.sessionStorage.getItem('filterData');
    if (platform.IS_DINGTALK) {
      if (cacheData) {
        const data:any = JSON.parse(cacheData);
        this.curPage = data.curPage;
        this.pageSize = data.pageSize;
        this.filterData = data.filterData;
      }
    }
    const params: listParams.ExportDataParams = {
      filters: this.filterData,
      mobile: false,
      page: this.curPage - 1,
      queryCode: this.curListCode,
      schemaCode,
      size: this.pageSize
    };

    return params;
  }

  /*
  * 获取查询列表数据
  */
  //  type = search | cleanUp | append | reload | pageChange | getConfig | ;
  async getQueryList(type?: string) {
    const vm: any = this;
    const hasData = this.rows.length;
    const prevTotal = this.total;
    this.userListData = [];
    this.dataSource = [];
    this.rows = [];
    const params = this.queryParamsFormater();
    this.isLoading = true;
    this.isShowTable = false;

    // console.log('_______________lalalalal');
    // console.log( this.eventHooksHandler )

    // 外部请求
    let res;
    let isCustomRequest   = false;
    let customRequestMode = '';
    let scriptVersion;

    // 检测版本
    if ( this.eventHooksHandler && (scriptVersion=parseFloat(this.eventHooksHandler.scription.options.version))>1 ) {
      let listData = this.eventHooksHandler.getApi('listData');
      if ( listData ) {
        isCustomRequest = true;
        customRequestMode = listData.mode;
        // console.log('_______fetch')
        // console.log( this.eventHooksHandler.fetchApi(listData, params) )
        res = await this.eventHooksHandler.fetchApi(listData, params);

        if ( customRequestMode==='replace' ) {
          this.eventHooksHandler.hooksOption.forEach(o=>{o.params.includes('dataSource')? o.params=['userListData']:undefined });
          console.log( this.eventHooksHandler.hooksOption );
        }
      }
      else {
        res = await listApi.getQueryList(params);
      }
    } else {
      res = await listApi.getQueryList(params);
    }


    // console.log('_____', this.eventHooksHandler.scription.options.version);
    // console.log( res )

    // this.isShowTable = true; // 因为要做流程控制, 先触发 onLoad, 所以不能直接这么做展示
    this.firstLoad = false;
    this.isLoading = false;
    this.isShowFilterBox = false;

    // 如果有自定义接口并且使用替换模式
    if ( isCustomRequest && customRequestMode==='replace' ) {
      this.isShowTableBox = true;
      this.isShowLoadFailBox = false;
      this.userListData = res;
    }
    // 如果没有自定义接口或者自定义接口使用combine
    else {
      if (res.errcode===0) {
        this.isShowTableBox = true;
        this.isShowLoadFailBox = false;
        if (!res.data) throw new Error('response data empty!');
        // 生成key 以及序号
        this.dataSource = [];
        if (res.data.content.length <= 0) {
          this.isShowLoadAll = false;
          this.exportDisabled = true;
          if (type === 'search' || type === 'pageChange') {
            this.isShowNoData = false;
            this.isShowSearchNoData = true;
          } else {
            this.isShowNoData = true;
            this.isShowSearchNoData = false;
          }
          this.rowsFormatter(this.cusColumns);
        } else {
          this.exportDisabled = false;
          res.data.content.forEach((item: any, index: number) => {
            const obj: any = {};
            Object.entries(item.data).forEach((data: any, i: number) => {

              const [key, value] = data;
              const column: any = vm.columns.find((c: any) => c.dataIndex === key);

              // 键值
              if (value && typeof value === 'object') {
                if (Array.isArray(value)) {
                  // MARK: 如果是附件, 返回全部, 而不只是名字;
                  obj[key] = ( column && column.propertyType===6 )?
                    value:
                    value.map( x=>(x.name||'') ).join();
                } else {
                  obj[key] = value.name || value.address || '';
                }
              } else if (value === 'null') {
                obj[key] = null;
              } else if (typeof value === 'boolean') {
                obj[key] = value ? '是' : '否';
              } else {
                obj[key] = value;
              }

              // 类型
              if (value && column && column.propertyType === 10) {
                try {
                  let address: any = JSON.parse(value);
                  if (typeof address === 'string') {
                    address = JSON.parse(address);
                  }
                  // 省市区如果为空则展示空字符
                  address.provinceName = address.provinceName ? address.provinceName : '';
                  address.cityName = address.cityName ? address.cityName : '';
                  address.districtName = address.districtName ? address.districtName : '';
                  address.address = address.address ? address.address : '';

                  obj[key] = `${address.provinceName}${address.cityName}${address.districtName}${address.address}`;
                } catch {
                  console.log('位置控件格式正确！');
                }
              } else if (value && column && column.propertyType === 3) {
                // 日期数据项展示格式处理
                const date = new Date(value.replace(/-/g, '/')); // 修复safari/ie下日期转换问题
                const month = (date.getMonth() + 1) > 9 ? (date.getMonth() + 1) : `0${date.getMonth() + 1}`;
                const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
                const yearAndMonth = `${date.getFullYear()}-${month}`;
                const time = `${date.getFullYear()}-${month}-${day}`;
                const hours = date.getHours() > 9 ? date.getHours() : `0${date.getHours()}`;
                const minutes = date.getMinutes() > 9 ? date.getMinutes() : `0${date.getMinutes()}`;
                const seconds = date.getSeconds() > 9 ? date.getSeconds() : `0${date.getSeconds()}`;

                switch (column.displayFormat) {
                  case 0:
                    break;
                  case 1:
                    obj[key] = time;
                    break;
                  case 2:
                    obj[key] = `${time} ${hours}:${minutes}:${seconds}`;
                    break;
                  case 3:
                    obj[key] = `${time} ${hours}:${minutes}`;
                    break;
                  case 4:
                    obj[key] = yearAndMonth;
                    break;
                  default:
                    break;
                }
              }  else if (column && column.propertyType === 2) {
                // 数值数据项展示格式处理
                if (value === 0) {
                  obj[key] = '0';
                } else if (value) {
                  obj[key] = Helper.numberToDisplay(value, column);
                }
              }

              if (key === 'sequenceStatus') {
                switch (value) {
                  case 'DRAFT':
                    obj[key] = '草稿';
                    break;
                  case 'PROCESSING':
                    obj[key] = '进行中';
                    break;
                  case 'COMPLETED':
                    obj[key] = '已完成';
                    break;
                  case 'CANCELED':
                    obj[key] = '已作废';
                    break;
                  default:
                    break;
                }
              }
              if (key === 'isChecked') {
                obj[key] = false;
              } else {
                obj[key] = obj[key] || '--';
              }
            });
            this.dataSource.push(obj);
          });

          this.rowsFormatter(this.cusColumns);

          // 显示全部加载完成
          this.isShowSearchNoData = false;
          this.isShowNoData = false;
          if (Math.ceil(res.data.totalElements / this.pageSize) <= 1) {
            this.isShowLoadAll = true;
          } else {
            if (res.data.content.length < this.pageSize) {
              this.isShowLoadAll = true;
            } else {
              this.isShowLoadAll = false;
            }
          }

          const columnOpts: any = window.localStorage.getItem(this.columnsOptsKey);
          if (columnOpts) {
            this.rowsFormatter(this.cusColumns);
          }
        }
        this.total = res.data.totalElements;
      } else {
        this.isShowTableBox = false;
        this.isShowLoadFailBox = true;
        // 报错
        this.$message.error(res.errmsg)
      }
    }

    // 触发 onLoad 只在成功加载数据时触发
    // 而 onLoad 的触发又会带动 onRendered 的触发
    // isShowTable 也会根据 if/else, 同步/异步的情况情况来做触发
    if (
      (isCustomRequest && customRequestMode!=='combine') ||
      res.errcode===0
    ) {
      // 触发onLoad钩子: 第一次加载/过滤/分页器 时, 新增/删除 成功时
      if (
        !hasData ||
        type === 'search' ||
        type === 'pageChange' ||
        type === 'reload' ||
        type === 'append'
      )  {
        if ( this.eventHooksHandler ) {
          // 针对一些事件要在 onLoad 之前处理一下 actionDone
          // 之前 append 的 actionDone 会在 onLoad 后触发
          if ( type==='append' ) {
            // DELAY:TODO:如果要监听详细的失败信息, 需要修改其他文件, 可能会对相关依赖有影响, delay 一下; 目前仅做新旧 total 做对比
            this.eventHooksHandler.exec('onActionDone', this.getAction('add'), prevTotal!==this.total);
          }
          await this.eventHooksHandler.exec('onLoad')
          this.isShowTable = true;
          this.isRenderingReady = false;
          this.$nextTick(()=>{
            this.isRenderingReady = true;
            this.setTable(); // 因为异步，所以此处单独执行一次
          })
        }
      }

    }

    this.isShowTable = true;

    // 因脚本执行流程控制，所有与dom操作相关都放置最底部
    this.setTable();

    // 设置缓存中默认值
    const cacheData:any = window.sessionStorage.getItem('filterData');
    if (platform.IS_DINGTALK) {
      if (cacheData) {
        const data:any = JSON.parse(cacheData);
        (this.$refs.queryForm as any).backWriteData(data.queryFormValues);
      }

      // 钉钉环境删除记录
      window.sessionStorage.removeItem('filterData');
    }

    return res;
  }


  setTable(){
    this.setTableMaxHeight();
    this.setTableScroller();
    this.addMarkColorBlock(this.dataSource);
  }

  tableChange() {
    // console.log('_______________tableChange')
    console.log(arguments)
  }

  /**
   * 用色块标注进行中与草稿
   * @tableData 表格数据
  */
  addMarkColorBlock(tableData:any){
    if(!tableData) return;
    this.$nextTick(() => {
      const rowList:any = document.querySelectorAll('.sheet .sheet__body > .sheet__row') as NodeList;
      if (rowList) {
        rowList.forEach((row:HTMLElement, index:number) => {
          const markStatus:Array<string> = ['草稿', '进行中'];
          if (markStatus.indexOf(tableData[index].sequenceStatus) > -1) {
            row.classList.add('marked');
          }
        });
      }
    })
  }

  /**
   * 表格row格式化
   * @desc 将展示列的每一列整合到每一行
   * @params columns 共有多少列
   */
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

  /**
   * 字段排序筛选之后重新渲染表格
  */
  reRenderTable(columns: any) {
    this.cusColumns = columns.filter((col: any) => col.isShow);
    // 更新columns状态
    this.columns = columns;
    this.rowsFormatter(this.cusColumns);

    this.saveColumnsOpts(columns);

  }

  /**
   * 回复默认设置
   */
  recovery() {
    this.cusColumns = this.defaultColums;
    this.columns = this.defaultColums;
    this.rowsFormatter(this.defaultColums);

    window.localStorage.removeItem(this.columnsOptsKey);
  }

  /**
   * 字段信息存入本地缓存
  */
  saveColumnsOpts(columns: any) {
    const jsonStr: string = JSON.stringify(columns);
    window.localStorage.setItem(this.columnsOptsKey, jsonStr);
  }


  /*
  * 新增按钮
  */
  handleAdd(obj: listParams.QueryActions) {
    // debugger
    let url: string = '';
    const code = obj.associationCode;
    if (obj.associationType === 1) { // 关联流程
      url = `/form/detail?startWorkflowCode=${code}`;
    } else { // 关联表单
      const { schemaCode } = this.$route.params;
      url = `/form/detail?schemaCode=${schemaCode}&sheetCode=${code}`;
    }

    url += `&return=${location.pathname + encodeURIComponent(location.search)}`;

    if (platform.IS_DINGTALK) {
      // window.location.href = url;
      this.$router.push(url);
    } else {
      const opens = window.open(url);
    }
  }

  /*
  * 删除按钮
  */
  async handleDeleteListData() {
    const vm = this;
    const { schemaCode } = vm.$route.params;

    let _ids: string[] = [];
    const allObjectIds: any = [];
    this.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        _ids.push(this.dataSource[index].id);
      }
      allObjectIds.push(this.dataSource[index].id);
    });
    // 如果当前未勾选任何数据，默认全部生成
    if (_ids.length === 0) {
      _ids = allObjectIds;
    }

    const params: listParams.DeleteListParams = {
      ids: _ids,
      schemaCode
    };


    const res = await listApi.checkDeleteItems(params);
    if (res.errcode === 0 && Array.isArray(res.data)) {
      let countObj: any = {};
      res.data.forEach((data: any) => {
        switch (data.resultCode) {
          case 1000:
            countObj.count1 = data.objectIds ? data.objectIds.length : 0;
            break;
          case 1001:
            countObj.count2 = data.objectIds ? data.objectIds.length : 0;
            break;
          case 1002:
            countObj.count3 = data.objectIds ? data.objectIds.length : 0;
            break;
          case 1003:
            countObj.count4 = data.objectIds ? data.objectIds.length : 0;
            break;
          case 1004:
            countObj.count5 = data.objectIds ? data.objectIds.length : 0;
            break;
          default:
            break;
        }
      });
      const h = this.$createElement;
      vm.$confirm({
        title: h('span', { class: 'delete-title' }, [`${vm.$t('cloudpivot.list.pc.DeleteItems').toString()}`]), // 以下数据删除后不能恢复，确定要删除吗？
        content: h('div', { class: 'delete-content' }, [
          h('div', { class: { 'hidden': !countObj.count1 } }, [h('img', { attrs: { src: require('../image/dot.png') } }), '业务数据 ', h('span', `${countObj.count1}`), ' 条']),
          h('div', { class: { 'hidden': !countObj.count2 } }, [h('img', { attrs: { src: require('../image/dot.png') } }), '未关联父子流程的流程数据 ', h('span', `${countObj.count2}`), ' 条', h('p', { class: 'tip-text' }, '（数据删除后，将同步删除已产生的流程实例）')]),
          h('div', { class: { 'hidden': !countObj.count3 } }, [h('img', { attrs: { src: require('../image/dot.png') } }), '已关联子流程的父流程数据 ', h('span', `${countObj.count3}`), ' 条', h('p', { class: 'tip-text' }, '（父流程删除后将同步删除与其绑定的子流程数据及实例）')]),
          h('div', { class: { 'hidden': !countObj.count4 } }, [h('img', { attrs: { src: require('../image/dot.png') } }), '子流程数据 ', h('span', `${countObj.count4}`), ' 条', h('p', { class: 'tip-text' }, '（子流程删除后将同步删除实例及与父流程产生的映射关系）')]),
          h('div', { class: { 'hidden': !countObj.count5 } }, [h('img', { attrs: { src: require('../image/dot.png') } }), '普通用户不可删除流程数据 ', h('span', `${countObj.count5}`), ' 条']),
        ]),
        width: '520px',
        okText: this.$t('cloudpivot.list.pc.OK').toString(),
        cancelText: this.$t('cloudpivot.list.pc.Cancel').toString(),
        onOk() {
          vm.deleteListItems();
        },
        class: 'test',
        className: 'test1',

      } as any);
    } else if (res.errcode === -1) {
      vm.$message.warning(res.errmsg);
    }
    else if (res.errcode === -1) {
      vm.$message.warning(res.errmsg);
    }
  }

  /*
  * 删除列表项
  */
  async deleteListItems() {
    const vm = this;
    const _ids: string[] = [];
    this.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        _ids.push(vm.dataSource[index].id);
      }
    })
    // vm.dataSource.forEach((data: any) => {
    //   if (data.isChecked) {
    //     _ids.push(data.id);
    //   }
    // });
    const { schemaCode } = vm.$route.params;

    const params: listParams.DeleteListParams = {
      ids: _ids,
      schemaCode
    };

    const res = await listApi.deleteListData(params);
    if (res.errcode === 0) {
      // 当前为最后一页时，且删除了所有数据，把当前页码减一
      if (_ids.length === vm.dataSource.length && res.data.successCount === _ids.length && vm.curPage > 1) {
        vm.curPage -= 1;
      }

      if (res.data && res.data.errorCount > 0) {
        if (res.data.successCount === 0) {
          vm.$message.warning(this.$t('cloudpivot.list.pc.NoPermissionDelete'), 4);
        } else {
          vm.$message.warning(this.$t('cloudpivot.list.pc.DeleteItemsTips', { successCount: res.data.successCount, errorCount: res.data.errorCount }), 4);
        }
      }
      vm.resetSelectAll(vm);
      vm.getQueryList('delete');
    } else {
      vm.$message.error(this.$t('cloudpivot.list.pc.DeleteFailed'));
    }
  }

  /*
  * 导出列表
  */
  handleExportData(data: any) {
    onActionClick.handleExportData(this, data)
    .then(resp=>{
      if ( this.eventHooksHandler ) {
        this.eventHooksHandler.exec('onActionDone', this.getAction('export'), resp);
      }
    })
  }

  /**
   * 获取每一列的数据
  */
  // TODO: 删除
  getLabelContent(column: any, rowIndex: number) {
    if (!column) return;
    const { dataIndex } = column;
    if(!this.dataSource[rowIndex]) return '';
    return this.dataSource[rowIndex][dataIndex];
  }

  /**
  * 打开表单
  */
  async goForm(column: any, rowIndex: number) {
    const rowData: any = this.dataSource[rowIndex];
    if (!rowData) return;
    const { schemaCode } = this.$route.params;
    const params: listParams.FormUrlParams = {
      bizObjectId: rowData.id,
      schemaCode,
    };
    const res = await listApi.getFormUrl(params);


    // 如果报错, 会返回一个对象
    if ( typeof(res)==='object' && res.errcode!==0 ) {
      return this.$message.error( res.errmsg );
    }
    // 否则返回一个字符串
    else if ( typeof(res)==='string' ) {
      let search = location.search;
      search = search? `${search}&iframeAction=detail`: `?iframeAction=detail`;
      const url = `${res}&return=${location.pathname + encodeURIComponent(search)}`;
      // const newWindow: any = platform.IS_DINGTALK ? window : window.open();
      // newWindow.location.href = url;
      if(platform.IS_DINGTALK){
        // 缓存查询条件
        const { curPage, filterData, queryFormValues, pageSize } = this;
        const cacheData:any = {curPage, filterData, queryFormValues, pageSize};
        window.sessionStorage.setItem('filterData', JSON.stringify(cacheData));
        this.$router.push(url);
      }else{
        window.open(url);
      }
    }


  }

  handleCancel() {
    this.visible = false;
    setTimeout(() => {
      this.reset();
    }, 1000);
  }

  confirmImport() {
    this.isInitView = false;
    this.isUploading = false;
    this.import();
  }

  /**
   * 开始导入数据
  */
  import() {
    onActionClick.import(this);
  }

  /**
   * 导入结束（不管成功与失败）
   */
  importEnd(data: any) {
    onActionClick.importEnd(this, data);
    if ( this.eventHooksHandler ) {
      this.eventHooksHandler.exec('onActionDone', this.getAction('import'), data);
    }
  }

  confirm() {
    this.visible = false;
    setTimeout(() => {
      this.reset();
    }, 1000);
  }

  async reImport() {
    this.import();
  }

  reset() {
    this.isInitView = true;
    this.isUploading = false;
    this.isImporting = false;
    this.importPercent = 0;
    this.isImportEnd = false;
    this.successNum = 0;
    this.failNum = 0;
    this.importrQueryField = '';
    this.canImport = false;
    this.importStatus = listParams.ImportResult.Unspecified;
  }

  changeImportBtnStatus(status: boolean) {
    this.canImport = status;
  }

  setImportFileName(fileName: string) {
    this.importFileName = fileName;
  }

  setImportQueryField(queryField: string) {
    this.importrQueryField = queryField;
  }

  resetParams() {
    // 路由切换不会重新挂载页面
    this.filterData = [];
    this.pageSize = 20;
    this.curPage = 1;
  }

  // 重置全选、删除按钮
  resetSelectAll(vm: any) {
    vm.isSelectAll = false;
    this.$set(this, 'isSelectAll', false);
  }

  /**
   * 拖拽结束, 记录列宽
  */
  onResizeEnd(params: AllTypes.ColumnOption) {
    columnWidthRecord.handleColumResizeEnd(params, this.recordKey, this.columnsOptsKey);
  }


  /**
   * 清空
   */
  clear() {
    this.queryConditionSource = [];
    this.filterData = [];
    this.$nextTick(() => {
      const queryForm: any = this.$refs.queryForm;
      queryForm.clearFilters();

      // this.getQueryList('cleanUp');
    })
  }

  /*
  * 构建打印二维码数据格式
  */
  createPrintQrCodeData(data: any) {
    printQrCode.createPrintQrCodeData(this, data);
  }


  hideQueryItem(){
    if (!this.isShowFilterBox) return;
    this.isShowFilterBox = false;
  }

  // 重置视图
  resetView() {
    this.rows = [];
    this.isShowTableBox = false;
    this.firstLoad = true;
    this.canDelete = false;
    const records: string = window.localStorage.getItem(this.recordKey) as string;
    this.adaptWidth = !!records;
    this.resetSelectAll(this);
    this.resetParams();
  }

  @Watch('isRenderingReady')
  onRenderingReady(val) {
    if ( !val ) return;
    if ( !this.isShowTableBox ) return;
    // 太多异步数据加载, 宏任务很乱, 尽量把 onRendered 丢到最后
    if ( this.eventHooksHandler ) {
      setTimeout(()=>{
        this.eventHooksHandler.exec('onRendered');
      },15);
    }
  }

  @Watch('dataSource')
  onDataSourceChange(val:any) {
    // this.initColumns()
    this.rowsFormatter(this.cusColumns);
    this.setTable()
  }

  @Watch('applicationPageTitle')
  onApplicationPageTitleChange(v: any) {
    document.title = `奥哲云枢-${v}`;
  }

  @Watch('$route')
  onRouteChange(to,from) {
    if ( to.path===from.path ) return;

    this.resetView();
    this.getQueryHeaders();
  }

  @Watch('$i18n.locale')
  onLocalChange() {
    const loadAllBox = document.querySelector('.data-load-all');
    if (loadAllBox) {
      loadAllBox.innerHTML = `${this.$t('cloudpivot.list.pc.AllBeShown')}`;
    }
  }

  @Provide()
  getScrollEl() {
    return document.body.querySelector(".table-box") as HTMLDivElement;
  }
}
