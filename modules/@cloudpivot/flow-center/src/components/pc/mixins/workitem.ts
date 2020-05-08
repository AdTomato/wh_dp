import {
  Component, Vue, Watch
} from 'vue-property-decorator';

import { workflowCenterApi } from '@cloudpivot/api';

import { closest } from '@cloudpivot/common/src/utils/dom';

import * as WorkflowCenterRouterTypes from '../typings/workflow-center';

import * as WorkflowCenterHelper from '../helper/helper';

import * as WorkflowCenterNS from '../typings/workflow-center';


@Component
export default class WorkflowItemMixin extends Vue {
  tableData: any = []; // 表格数据

  userInfo: any = {}; // 用户信息

  isShowDrawer: boolean = false; // 展示人信息

  /**
   * 分页相关数据
  */
  pageSize: number = 20;

  curPage: number = 1;

  total: number = 0

  pageSizeOptions: string[] = ['10', '20', '50', '100'];


  /**
   * 列表状态相关
  */
  isShowNoData: boolean = false; // 内容为空

  isShowSearchNoData: boolean = false; // 搜索内容为空

  isShowTableBox: boolean = true; // 是否展示表格

  isShowLoadFailBox: boolean = false; // 是否展示加载失败

  isLoading: boolean = true; // 是否显示加载中

  isShowLoadAll: boolean = false; // 全部加载完成

  isShowPagination: boolean = false; // 是否显示分页器

  scrollY: number = 0; // 固定表头相关

  isCirculateAll:boolean = false; // 控制全部已阅置灰

  dataHandler: Function = () => { }; // 数据处理函数

  searchNumber:number = -1; // 搜索条数

  isShowPager:boolean = false;

  isShowQueryItem:boolean = false; // 是否显示查询条件

  queryConditionSource:any = [];

  pageType:string = '';

  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  /**
   * @desc 请求完毕统一处理方法
   * @param res 请求返回的结果
   * @param type 搜索的类型
  */
  commonHandler(res: any, type?: string) {
    this.isLoading = false;
    this.isShowQueryItem = false;
    if (res.errcode === 0) {
      this.displayWithSuccess(res.data.content);
      // 展示搜索条数
      if(type === 'search') {
        this.searchNumber = res.data.totalElements;
      } else {
        this.searchNumber = -1;
      }
      if (res.data.content.length <= 0) {
        this.displayWithEmpty(type);
        this.isCirculateAll = true;
      } else {
        const data = this.dataHandler(res.data.content);
        // 统一处理数据为空的时候展示 '--'
        data.forEach((item:any) => {
          const keys = Object.keys(item);
          keys.forEach((key:any) => {
            if (typeof item[key] !== 'boolean') {
              item[key] = item[key] || '--';
            }
          });
        });
        this.tableData = data;
        this.isCirculateAll = false;
        // 展示数据
        this.displayWithData(res.data.totalPages, res.data.totalElements, res.data.content, type);

        const { name } = this.$route;
        let calType: string = '';
        switch (name) {
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyUnfinishedWorkItem:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.OnlyTable;
            break;
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyUnReadWorkItem:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.HasBtns;
            break;
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyFinishedWorkItem:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.HasFilters;
            break;
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyReadWorkItem:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.HasFilters;
            break;
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyWorkflow:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.HasTabsAndFilters;
            break;
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.QueryInstance:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.HasTabsAndFilters;
            break;
          case WorkflowCenterRouterTypes.WorkflowCenterRouter.QueryParticipantWorkItem:
            calType = WorkflowCenterNS.CalculateMaxHeightTypes.HasTabsAndFilters;
            break;
          default: break;
        }
        // 表头固定
        // WorkflowCenterHelper.setTableMaxHeight({
        //   vm: this,
        //   type: calType
        // });

        this.setTableMaxHeight();

        // 表格滚动条滚动到顶部
        this.tableScrollToTop();

        // 表格滚动条
        this.tableScrollerHandler()
      }

      this.total = res.data.totalElements;
    } else {
      this.displayWithError();
    }
  }


  /**
   * @desc 无数据时展示
   * @params type 搜索或者分页展示不同的图片
  */
  displayWithEmpty(type?: string) {
    this.isShowLoadAll = false;
    this.removeLoadAll();
    this.isShowPagination = false;
    if (type === 'search' || type === 'pageChange') {
      this.isShowNoData = false;
      this.isShowSearchNoData = true;
    } else {
      this.isShowNoData = true;
      this.isShowSearchNoData = false;
    }
  }


  /**
   * @desc 有数据时展示
   * @params pages 总页数
  */
  displayWithData(pages: number, total: number, data: any, type?: string) {
    this.tableData = data;
    this.isShowSearchNoData = false;
    this.isShowNoData = false;
    if (pages <= 1) {
      this.appendLoadAll();
      this.isShowPager = true;
      this.isShowLoadAll = true;
      this.isShowPagination = false;
    } else {
      this.isShowPagination = true;
      if (data.length < this.pageSize) {
        this.isShowLoadAll = true;
        this.appendLoadAll();
        this.isShowPager = true
      } else {
        this.removeLoadAll();
        this.isShowPager = false;
        this.isShowLoadAll = false;
      }
    }

    if (type) { // 切换pageSize,展示分页器
      this.isShowPagination = true;
    }
  }


  /**
    * @desc 加载错误时展示
  */
  displayWithError() {
    this.isShowTableBox = false;
    this.isShowLoadFailBox = true;
  }


  /**
    * @desc 加载成功时展示
    * @params data 列表数据
  */
  displayWithSuccess(data: any) {
    this.isShowTableBox = true;
    this.isShowLoadFailBox = false;

    this.tableData = [];
  }


  /**
    * @desc 加载成功时展示
    * @params data 列表数据
  */
  tableScrollToTop() {
    this.$nextTick(() => {
      const Table = document.getElementsByClassName('ant-table-body')[0];
      if (Table.scrollTop && Table.scrollTop > 0) {
        Table.scrollTop = 0;
      }
    });
  }


  /**
    * @desc 展示用户信息侧滑
  */
  async showDrawer(id: string) {
    await this.getUserInfo(id);
    this.isShowDrawer = true;
  }


  /**
    * @desc 点击流程名称打开表单
    * @params obj 当前项数据
  */
  openDetail(obj: any) {
    this.$emit('openForm', obj);
  }


  /**
    * @desc 获取用户信息，用于打开用户信息侧滑
    * @params id 用户id
  */
  async getUserInfo(id: string) {
    const res = await workflowCenterApi.getUserInfo({ id });
    if (res.errcode === 0) {
      this.userInfo = res.data;
    }
  }


  /**
    * @desc 添加全部加载完成
  */
  appendLoadAll() {
    const { name } = this.$route;
    let hint: string = '';
    switch (name) {
      case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyUnfinishedWorkItem:
        hint =  this.searchNumber < 0 ? (this.$t('cloudpivot.flowCenter.pc.showAllTodo') as string) : this.$t('cloudpivot.flowCenter.pc.showAllSearch') as string;
        break;
      case WorkflowCenterRouterTypes.WorkflowCenterRouter.MyUnReadWorkItem:
        hint = this.$t('cloudpivot.flowCenter.pc.showAllToRead') as string;
        break;
      default:
        hint = this.$t('cloudpivot.flowCenter.pc.showAllResult') as string;
        break;
    }
    this.$nextTick(() => {
      const isLoadAllBoxExist = document.querySelectorAll('.data-load-all').length > 0;
      if (isLoadAllBoxExist) return;
      const loadAllBox = document.createElement('div');
      loadAllBox.innerHTML = hint;
      loadAllBox.className = 'data-load-all';
      loadAllBox.style.cssText = 'color:rgba(0,0,0,0.45);text-align:center;margin: 40px 0 25px 0';
      (document.querySelector('.ant-table-body') as any).appendChild(loadAllBox);
    });
  }


  /**
    * @desc 移除全部加载完成
  */
  removeLoadAll() {
    this.$nextTick(() => {
      const loadAllBox = document.querySelector('.data-load-all');
      if (loadAllBox) {
        (document.querySelector('.ant-table-body') as any).removeChild(loadAllBox);
      }
    });
  }

  /**
   * 设置加载全部文字
  */ 
  setLoadAllTxt(){
    if(this.isShowPager) {
      this.removeLoadAll();
      this.appendLoadAll();
    }
  }

  /**
   * 设置表格滚动条相关
   */
  tableScrollerHandler(){
    this.$nextTick(() => {
      const tableBody:any = document.querySelector('div.ant-table-body') as HTMLElement;
      tableBody.onmouseenter = function(){
        tableBody.className = 'ant-table-body active';
      }

      tableBody.onmouseleave = function(){
        tableBody.className = 'ant-table-body';
      }
    })
  }

  /** 
   * 计算表格可视区域的高度
   * 需要减去的高度：
   * content-top：头部 
   * actions-btn 操作按钮 
   * filter-box：查询条件 
   * tab栏 
   * 表头
   * 分页器
   * padding table容器的32px内边距
   * 搜索结果高度
   * @tHeadOverflow 部分页面转化成英文版本之后，表头的高度编程两行， 故特殊处理
  */ 
  setTableMaxHeight(){
    let diff:number = 0;
    this.$nextTick(() => {
      const thead:HTMLElement = document.querySelector('thead.ant-table-thead') as HTMLElement;
      if (thead.clientHeight > 39) { // 说明表头已经两行了，需要对偏差值进行累加
        diff += 13;
      }
      const table:HTMLElement = this.$refs.table as HTMLElement;
      this.scrollY = table.clientHeight - 31 - diff;
    })

    // this.$nextTick(() => {
    //   let contentTopH:number = 0;
    //   let actionsBtnH:number = 0;
    //   let filtersBoxH:number = 0;
    //   let tabH:number = 0;
    //   let pagerH:number = 8;
    //   let searchRztH:number = 0;
    //   let padding:number = 32;
    //   let diff:number = 36; // 偏差值

    //   const thead:HTMLElement = document.querySelector('thead.ant-table-thead') as HTMLElement;
    //   if (thead.clientHeight > 39) { // 说明表头已经两行了，需要对偏差值进行累加
    //     diff += 13;
    //   }

    //   const workItemDom:HTMLElement = this.$refs.workItem as HTMLElement;
    //   const workItemH:number = workItemDom.clientHeight;
      
    //   const contentTopDom:HTMLElement = document.querySelector('.content-top') as HTMLElement;
    //   if (contentTopDom) {
    //     contentTopH = contentTopDom.clientHeight + 16; // 16px marign-bottom
    //   }

    //   const actionsBtnDom:HTMLElement = document.querySelector('.actions-btn') as HTMLElement;
    //   if (actionsBtnDom) {
    //     actionsBtnH = actionsBtnDom.clientHeight;
    //   }

    //   const filtersBoxDom:HTMLElement = document.querySelector('.filters-box') as HTMLElement;
    //   if (filtersBoxDom) {
    //     filtersBoxH = filtersBoxDom.clientHeight;
    //   }

    //   const searchResultDom:HTMLElement = document.querySelector('.search-result') as HTMLElement;
    //   if (searchResultDom) {
    //     searchRztH = searchResultDom.clientHeight - 8;
    //   }

    //   const tabDom:HTMLElement = document.querySelector('.ant-tabs-bar') as HTMLElement;
    //   if (tabDom) {
    //     tabH = tabDom.clientHeight;
    //   }

    //   const pagerDom:HTMLElement = document.querySelector('.pagination-box') as HTMLElement;
    //   if (pagerDom) {
    //     pagerH = pagerDom.clientHeight;
    //   }

    //   this.scrollY = workItemH - contentTopH - actionsBtnH - filtersBoxH - tabH -  pagerH - searchRztH - padding - diff;

      
    // })
  }

  toggleQuery(){
    this.isShowQueryItem = !this.isShowQueryItem;
  }

  clear(type?:string){
    this.queryConditionSource = [];
    if (!type) {
      const queryWorkitem:any = this.$refs.queryWorkitem;
      queryWorkitem.reset();
    } else {
      const tabTable = this.$refs.tabTable as any;
      const queryWorkitem:any = tabTable.$refs.queryWorkitem;
      queryWorkitem.reset();
    }
  }

  /** 
   * 将查询条件转成组件需要的格式
   * @params data 需要转的数据
   * @params type 有些页面同一个控件但是显示名称不一样
  */
  dataTranslateToFilterCard(data:any, type?:string){
    this.pageType = type ? type : '';
    // 将开始结束时间整合
    const deepData:any = JSON.parse(JSON.stringify(data));
    delete deepData.unitType;
    deepData.time = `${deepData.startTime}~${deepData.endTime}`;
    deepData.originator = deepData.originatorName;
    delete deepData.startTime;
    delete deepData.endTime;
    delete deepData.originatorName;
    delete deepData.workflowCode;
    const emptyVals:Array<any> = ['', '~'];
    
    const vals:any = [];
    Object.keys(deepData).forEach((key:string) => {
      if (emptyVals.indexOf(deepData[key]) <= -1) {
        if (key === 'instanceState') {
          vals.push({
            name: this.nameTranslator(key, 'zh'),
            name_i18n: `{"en": "${this.nameTranslator(key, 'en')}"}`,
            content: this.translateStatusToTxt(deepData[key]),
            type: -2,
          })
        } else if (key === 'workflowTplName') {
          vals.push({
            name: this.nameTranslator(key, 'zh'),
            name_i18n: `{"en": "${this.nameTranslator(key, 'en')}"}`,
            content: deepData[key],
            type: -10,
          })
        }else {
          vals.push({
            name: this.nameTranslator(key, 'zh'),
            name_i18n: `{"en": "${this.nameTranslator(key, 'en')}"}`,
            content: deepData[key],
            type: -1,
          })
        }
      }
    });
    return vals;
  }

  nameTranslator(key:string, type:string){
    if(!key) return '';
    switch(key) {
      case 'workflowName':
        return type === 'en' ? "Workflow Name" : "流程名称";
      case 'time':
        return type === 'en' ? this.timeLabelHandler('en') : this.timeLabelHandler('zh');
      case 'originator':
        return type === 'en' ? "Originator" : "发起人";
      case 'instanceState':
        return type === 'en' ? "Workflow Status" : "流程状态";
      case 'workflowTplName':
        return type === 'en' ? "Workflow mode" : "流程模板";
      default:
        return '';
    }
  } 

  timeLabelHandler(lang:string){
    if (!lang) return;
    switch (this.pageType) {
      case 'myReadWorkItem':
        return lang === 'en' ? "Receive Time" : "接收时间";
      case 'processing':
        return lang === 'en' ? "Start Time" : "发起时间";
      case 'canceled':
        return lang === 'en' ? "Cancel Time" : "作废时间";
      default:
        return lang === 'en' ? "Action Time" : "处理时间";
    } 
  } 

  translateStatusToTxt(status:string){
    switch(status){
      case 'PROCESSING':
        return {zh: '进行中', en: 'Processing'}
      case 'COMPLETED':
        return {zh: '已完成', en: 'Completed'}
      case 'CANCELED':
        return {zh: '已作废', en: 'Canceled'}
      case 'EXCEPTION':
        return {zh: '流程异常', en: 'Exception'}
    }
  }

  hideQueryItem(){
    if (!this.isShowQueryItem) return;
    this.isShowQueryItem = false;
  }
}
