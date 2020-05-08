import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Mutation, Action, namespace } from 'vuex-class';

import { Steps, Select, Tooltip, Input, Button, Table } from 'h3-antd-vue';

import { DataItemType } from "@cloudpivot/form/schema";

import h3Panel from './panel.vue';

import DataItemSelect  from './data-item-select.vue';

import * as DataRuleApi from '@/apis/data-rule';

import { renderer } from '@cloudpivot/form';

import ModelTree from './tree/tree2.vue';

import { Helper } from './helper/helper';

import * as DataRuleType from './typings/data-rule.typings';

import dataRuleMap from './typings/data-rule-map';

import DataCache from './helper/cache';


const DataModelModule = namespace('Apps/DataModel');

@Component({
  name: 'DataRuleHandler',
  components: {
    ASteps: Steps,
    AStep: Steps.Step,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATooltip: Tooltip,
    AInput: Input,
    AButton: Button,
    ATable: Table,
    ASelectOptGroup: Select.OptGroup,
    ModelTree,
    StaffSelector: renderer.components.pc.StaffSelector,
    h3Panel,
    DataItemSelect
  }
})

export default class DataRuleHandler extends Vue {
  @DataModelModule.Action('getBizmodeltitle') getBizmodeltitle: any;
  @DataModelModule.Mutation('setBizSchemaCode') setBizSchemaCode: any;
  @DataModelModule.State('dataItemList') dataItemList: any; // 当前模型数据项

  @Prop() isShowDataRuler!:boolean;

  @Prop() mode!:string;

  @Prop() data!:any;

  @Prop() ruleTypes!:any;

  @Prop() drawerEl!:any;


  curModelDataItems:any = []; // 当前触发对象下所有的字段 缓存

  bizModelName:string = ''; // 模型名称，用于组装触发对象

  curStep:number = 0; // 当前步骤 从0开始

  ruleName:string = ''; // 规则名称

  isShowErrRuleName:boolean = false; // 是否显示检验规则名称错误提示

  validateStr:string = ''; // 规则名称校验提示文字

  triggerObj:string = ''; // 触发对象

  triggerObjLists:any = []; // 触发对象列表，模型以及模型下的子表集合

  upDateObjLists:any = []; // 更新对象列表

  UpDateObjIsSheet: boolean = false; // 更新对象是否时子表

  targetTableCode: string = ''; // 目标模型编码

  triggerCondition:number = 0; // 触发条件

  triggerConditionList:Array<any> = []; // 触发条件列表

  targetModel:string = ''; // 目标模型

  triggerAction:number = 1; // 触发条件

  triggerActionList:Array<any> = []; // 触发动作列表

  insertConditionJoinType: number = 1;

  get actionTabelText () {
    let str = '';

    return str;
  }

  /** 数据条件 start */
  dataConditionColumns:any = [];
  dataConditionData:any = []; // 满足条件 table 数据列表
  /** 数据条件 end */

  /* 过滤条件 start */
  filterData:any = [];
  /**
   * 过滤条件子表
   */
  ruleScopeChild: any = [];

  filterColumns:any = [];
  /* 过滤条件 end */


  /* 数据动作 start */
  dataActionData:any = []

  // 数据动作子表
  ruleActionMainScope:any = [];

  dataActionColumns:any = [];
  /* 数据动作 end */

  searchCondition:number = 0; // 查询条件

  conditionJoinTypes:Array<any> = [];

  targetFields:any = []; // 目标模型字段

  currentFields:any = []; // 当前模型字段

  operatorList:any[] = []; // 操作符列表

  actionTypeList:Array<any> = [];

  valueList:Array<any> = [];// 值列表

  abledDataItemTypes:Array<number> = [DataItemType.ShortText, DataItemType.Number, DataItemType.Logic, DataItemType.Date, DataItemType.LongText];

  isWriteBack:boolean = false; // 通知是否需要回写

  appCode:string = ''; // 选中目标模型所属应用的code

  isShowModelTree:boolean = false;

  isShowActionSysDataItems:boolean = true;

  unabledItemCodes:Array<string> = ['createdTime', 'modifiedTime', 'sequenceStatus', 'creater', 'createdDeptId', 'owner', 'ownerDeptId', 'modifier'];

  dynamicValueCodes = ['owner', 'creater', 'createdDeptId', 'ownerDeptId', 'modifier'];

  dataConditionJoinType:number = 1;  // 满足条件
  dataConditionList:Array<any> = [];
  dataFilterConditionList:Array<number> = [];

  isShowAlert:boolean = false;

  isSubSchema: boolean = false;

  staffSelectorOpts:any = {
    selectOrg: true,
    selectUser: false,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: '请选择'
  }

  getPopupContainer(triggerNode:any) {
    return this.$refs.scrollArea;
  }

  get isNextAble() {
    const {
      ruleName, triggerObj, triggerCondition, isShowErrRuleName, 
      dataConditionData, dataConditionJoinType
    } = this;
    let isDataOk:boolean = false;
    if (dataConditionData && dataConditionData.length > 0) {
      isDataOk = dataConditionData.every((item:any) => {
        if (item.filterCondition.val === DataRuleType.DataConditionFilterType.EP || item.filterCondition.val === DataRuleType.DataConditionFilterType.NEP) {
          return item.dataItem.val && item.filterCondition.val && !item.value.errMsg;
        } else {
          return item.dataItem.val && item.filterCondition.val && item.value.val.length > 0 && !item.value.errMsg;
        }
      });
    }

    if (dataConditionJoinType === 1) { // 不展示数据动作数据
      return !(ruleName && triggerObj && triggerCondition && !isShowErrRuleName);
    }
    return !(ruleName && triggerObj && triggerCondition && !isShowErrRuleName) || !isDataOk;
  }

  get dataActionText() {
    switch (this.triggerAction) {
      case DataRuleType.TriggerActionType.Add:
        return '新增数据动作';
      case DataRuleType.TriggerActionType.Update:
        return '更新数据动作';
      case DataRuleType.TriggerActionType.Delete:
        return '删除数据动作';
      default:
        return '';
    }
  }

  get filterConditionText() {
    switch (this.triggerAction) {
      case DataRuleType.TriggerActionType.Add:
        return '过滤条件';
      case DataRuleType.TriggerActionType.Update:
        return '查找数据范围';
      case DataRuleType.TriggerActionType.Delete:
        return '删除数据范围';
      default:
        return '';
    }
  }

  get filterConditionTooltip() {
    switch (this.triggerAction) {
      case DataRuleType.TriggerActionType.Add:
        return '满足以下条件的数据存在时不做插入动作';
      case DataRuleType.TriggerActionType.Update:
        return '';
      case DataRuleType.TriggerActionType.Delete:
        return '';
      default:
        return '';
    }
  }


  /**
   * 校验规则名称
   */
  onRuleNameChange() {
    const res:any = Helper.validateRuleName(this.ruleName);
    if (res) {
      const { isOk, validateMsg } = res;
      this.isShowErrRuleName = !isOk;
      this.validateStr = validateMsg;
    }
  }


  /**
   * 选中触发对象，设置当前模型字段
   */
  selectTriggerObj(val:any, vNode:any) {
    this.isSubSchema = false;
    // 如何判断当前选中的是模型还是子表
    const { propertyType } = vNode.data.attrs;

    this.currentFields = this.setCurFieldsList(propertyType, val);

    // 当切换了触发对象的时候，过滤条件和数据动作清空并添加一条默认数据
    this.clearThenAddDefaultData();
    // 切换条件；
    this.initDataCondition();
  }

  initDataCondition() {
    this.dataConditionData = [];
  }


  /**
   * 设置当前模型字段列表
   * @params propertyType 当前数据类型
   * @params code 当前模型或子表的code，主要用于过滤子表
   */
  setCurFieldsList(propertyType:number, code:string) {
    const dataItemsCopy = Helper.jsonDeepCopy(this.curModelDataItems);
    let list:any = [];
    if (propertyType === -1) { // 模型
      list = Helper.filterSubSchema(dataItemsCopy);
    } else { // 子表
      this.isSubSchema = true;
      const subSchemaTem = dataItemsCopy.find((item:any) => item.code === code);
      if (subSchemaTem.subSchema) {
        list = subSchemaTem.subSchema.properties.filter((item:any) => item.published);
      }
    }
    return list;
  }


  /**
   * 点击触发条件
   */
  selectTriggerCondition(index:number) {
    // 切换前缓存数据
    const prefix:string = 'triggerCondition';
    const cacheKey:string = `${prefix}${this.triggerCondition}`;
    const dataConditionData = Helper.jsonDeepCopy(this.dataConditionData);
    DataCache.setCacheData(cacheKey, {dataConditionData});

    // 切换操作
    this.triggerConditionList.forEach((item:any, idx:number) => {
      if (idx === index) {
        item.isSelected = true;
        this.triggerCondition = item.index;
      } else {
        item.isSelected = false;
      }
    });

    // 切换后读数据
    const readCacheKey:string = `${prefix}${this.triggerCondition}`;
    if (DataCache.cacheExist(readCacheKey)) {
      const cacheData = DataCache.getCacheData(readCacheKey);
      this.dataConditionData = cacheData.dataConditionData;
    } else {
      this.clearThenAddDefaultData('triggerCondition');
    }
  }


  /**
   * 点击触发动作
   */
  selectTriggerAction(index:number) {
    this.isShowActionSysDataItems = index !== 1;
    // 切换前缓存数据
    const prefix:string = 'triggerAction';
    const cacheKey = `${prefix}${this.triggerAction}`;
    const filterData = Helper.jsonDeepCopy(this.filterData);
    const dataActionData = Helper.jsonDeepCopy(this.dataActionData);
    const ruleScopeChild = Helper.jsonDeepCopy(this.ruleScopeChild);
    const ruleActionMainScope = Helper.jsonDeepCopy(this.ruleActionMainScope);

    DataCache.setCacheData(cacheKey, { filterData, dataActionData, ruleScopeChild,ruleActionMainScope });

    // 切换操作
    this.triggerActionList.forEach((item:any, idx:number) => {
      if (idx === index) {
        item.isSelected = true;
        this.triggerAction = item.index;
      } else {
        item.isSelected = false;
      }
    });


    // 切换后读数据
    const readCacheKey:string = `${prefix}${this.triggerAction}`;
    if (DataCache.cacheExist(readCacheKey)) {
      const cacheData = DataCache.getCacheData(readCacheKey);
      this.filterData = cacheData.filterData;
      this.dataActionData = cacheData.dataActionData;
      this.ruleScopeChild = cacheData.ruleScopeChild;
      this.ruleActionMainScope = cacheData.ruleActionMainScope;
    } else {
      this.clearThenAddDefaultData();
    }
  }


  /**
   * 清空表格数据，并添加一条默认数据
   */
  clearThenAddDefaultData(type?:string) {
    if (type === 'triggerCondition') {
      this.dataConditionData = [];

      this.addDataCondition();
    } else {
      this.filterData = [];
      this.dataActionData = [];
      this.ruleScopeChild = [];
      this.ruleActionMainScope = [];

      this.addFilterCondition(true);
      this.addSheetCondition();
      this.addSheetDataAction();
      this.addDataAction(true);
    }
  }


  /**
   * 下一步
   */
  goNextStep() {
    this.curStep = 1;

    // 设置默认数据 仅在新增的情况下
    if (this.mode === DataRuleType.OperationMode.Add) {
      if (this.filterData.length <= 0) {
        this.addFilterCondition(true);
      }

      if (this.dataActionData.length <= 0) {
        this.addDataAction(true);
      }
    }
  }


  /**
   * 上一步
   */
  goPrevStep() {
    this.curStep = 0;
  }


  /**
   * 获取触发对象
   */
  async getTriggerObjLists() {
    const { bizSchemaCode } = this.$route.params;
    const res = await Helper.getDataItemsBySchemaCode(bizSchemaCode);
    if (res.errcode === 0) {
      this.curModelDataItems = res.data;
      const subSchemaLists:any = Helper.findSubSchema(res.data);
      // 再拼接上当前模型
      subSchemaLists.unshift({
        code: bizSchemaCode,
        name: this.bizModelName,
        propertyType: -1 // 任意值区分模型与子表
      });
      this.triggerObjLists = subSchemaLists;
    }
  }

  /**
   * 渲染更新对象数据
   * @param data 
   */
  getUpDateObjLists(model:any, dataItemList:any) {
    // debugger;
    const { code, selectTrace, title } = model;
    // 兼容老数据
    if (this.targetTableCode === null) {
      this.targetTableCode = code;
    }
    const subSchemaLists:any = Helper.findSubSchema(dataItemList);
    subSchemaLists.unshift({
      code,
      name: title,
      propertyType: -1// 任意值区分模型与子表
    });
    this.upDateObjLists = subSchemaLists;

    if (this.targetTableCode) {
      this.targetTableChange(this.targetTableCode);
    }
  };

  currentSheetList: any = []; // 当前子表数据

  targetTableChange(val:any) {
    const selectData:any = this.upDateObjLists.find((res:any) => res.code ===val);
    if(selectData.propertyType === -1) {
      this.UpDateObjIsSheet = false;
    } else {
      this.UpDateObjIsSheet = true;
      this.currentSheetList = selectData.subSchema.properties;
      // if (this.ruleScopeChild.length === 0) {
      //   this.addSheetCondition();
      // }
    }
    this.initTabelData();
  }

  /**
   * 更新对象切换时，初始数据
   */
  initTabelData() {
    this.filterData = [];
    this.ruleScopeChild = [];
    this.ruleActionMainScope = [];
    this.dataActionData = [];
  }

  /**
   * 目标模型改变时清空更新对象值
   */
  clearTargetTableCode() {
    this.targetTableCode = '';
  }


  /**
   * 选中目标模型时赋值，并且加载目标模型下的所有已发布字段
   */
  async selectModel(data:any) {
    const { code, selectTrace } = data;
    // console.log('334444', this.targetModel);
    if (!code) return;
    this.targetModel = code;
    this.appCode = selectTrace;
    const res = await Helper.getDataItemsBySchemaCode(this.targetModel);

    if (res.errcode === 0) {

      this.targetFields = res.data;
      //Helper.filterSubSchema(res.data);
      this.getUpDateObjLists(data, res.data);
      if (this.mode === DataRuleType.OperationMode.Add) {
        this.padTargteFields();
      }
    }
  }


  /**
   * 将空的目标字段列表填充
   */
  padTargteFields() {
    const { targetFieldsCopy } = Helper.jsonDeepCopy(this.targetFields);
    if (this.filterData.length <= 0) {
      this.addFilterCondition(true);
    } else { // 切换模型重置已设置数据
      this.filterData = [];
      setTimeout(() => {
        this.addFilterCondition(true);
      }, 100);
    }
    this.filterData.forEach((item:any) => {
      if (item.targetField.list.length === 0) {
        item.targetField.list = targetFieldsCopy;
      }
    });

    if (this.dataActionData.length <= 0) {
      this.addDataAction(true);
    } else { // 切换模型重置已设置数据
      this.dataActionData = [];
      setTimeout(() => {
        this.addDataAction(true);
      }, 100);
    }
    this.dataActionData.forEach((item:any) => {
      if (item.targetField.list.length === 0) {
        item.targetField.list = targetFieldsCopy;
      }
    });
  }


  /**
   * 深复制备用数据，防止被串改
   * @returns Object, 深复制后的一行数据
   */
  deepCopyRowData() {
    // 数据条件
    // DataItemType.RelevanceForm,
    const disableTypes:Array<number> = [
      DataItemType.Sheet,
      DataItemType.Attachment,
      DataItemType.ApprovalOpinion,
      DataItemType.Address
    ];
    const disableCodes = ['workflowInstanceId', 'id', 'ownerDeptQueryCode', 'modifier']
    const dataItems_tem = this.curModelDataItems.filter((item:any) => disableTypes.indexOf(item.propertyType) < 0)
                                                .filter((item:any) => disableCodes.indexOf(item.code) < 0);
    const dataItemsCopy =  Helper.jsonDeepCopy(dataItems_tem);

    const targetFieldsCopy = Helper.jsonDeepCopy(this.targetFields);
    const operatorListCopy = Helper.jsonDeepCopy(this.operatorList);
    const valueListCopy = Helper.jsonDeepCopy(this.valueList);
    const currentFieldCopy = Helper.jsonDeepCopy(this.currentFields);
    const actionTypeListCopy = Helper.jsonDeepCopy(this.actionTypeList);
    const dataFilterConditionListCopy = Helper.jsonDeepCopy(this.dataFilterConditionList);
    const currentSheetList = Helper.jsonDeepCopy(this.currentSheetList);


    return {
      targetFieldsCopy, operatorListCopy, 
      valueListCopy, currentFieldCopy, actionTypeListCopy,
      dataItemsCopy, dataFilterConditionListCopy, currentSheetList
    };
  }

  /** 
   * 新增数据条件
  */
  addDataCondition(){
    // 如果有不合法的时间  则不能添加
    if (this.dataConditionData.length > 0) { 
      const isExistIllegleTime:boolean = this.dataConditionData.some((item:any) => item.value.errMsg);
      if (isExistIllegleTime) {
        this.isShowAlert = true;
        return; 
      } else {
        this.isShowAlert = false;
      }
      
      const isDataOk:boolean = this.dataConditionData.every((item:any) => {
        if (item.filterCondition.val === DataRuleType.DataConditionFilterType.EP || item.filterCondition.val === DataRuleType.DataConditionFilterType.NEP) {
          return item.dataItem.val && item.filterCondition.val && !item.value.errMsg;
        } else {
          return item.dataItem.val && item.filterCondition.val && item.value.val && !item.value.errMsg;
        }
      });
      if (!isDataOk) {
        this.isShowAlert = true;
        return;
      } else {
        this.isShowAlert = false;
      }
    }

    if (this.dataConditionJoinType === 1) return;
    
    const { dataItemsCopy, dataFilterConditionListCopy, currentSheetList } = this.deepCopyRowData();


    const item = {
      dataItem: {
        val: '',
        list: Helper.jsonDeepCopy(this.currentFields),
      },
      filterCondition: {
        val: '',
        list: dataFilterConditionListCopy,
      },
      value: {
        val: '',
        display: DataRuleType.ValueDisplay.CommonInput,
        errMsg: ''
      },
      operation: {
      }
    }

    this.dataConditionData.push(item);

    this.setIndex(DataRuleType.DataType.DataCondition);

    this.showButtonOnViewport(DataRuleType.ButtonTypes.DataCondition);
  }

  // /**
  //  * 获取条件当前数据项。非子表给全部数据项
  //  * 子表给子表数据项；
  //  */
  // getCurrentDataItem() {
  //   const { dataItemsCopy } = this.deepCopyRowData();
  //   console.log('3333', dataItemsCopy)
  //   if (!this.isSubSchema) {
  //     return dataItemsCopy;
  //   }
  // }


  /**
   * 新增过滤条件
   * @params isSetDefault 是否设置默认数据
   */
  addFilterCondition(isSetDefault:boolean) {
    const {
      targetFieldsCopy, operatorListCopy, valueListCopy, currentFieldCopy
    } = this.deepCopyRowData();
    const item = {
      targetField: {
        val: '',
        name: '',
        list: targetFieldsCopy,
      },
      operator: {
        val: DataRuleType.ConditionType.Equal,
        name: '',
        list: operatorListCopy,
      },
      value: {
        val: DataRuleType.ValueType.DynamicValue,
        name: '',
        list: valueListCopy,
      },
      currentField: {
        val: '',
        name: '',
        list: currentFieldCopy,
      },
      operation: {
      }
    };

    if (isSetDefault) {
      this.filterData.push(item);
      this.setIndex(DataRuleType.DataType.Filter);
    } else { // 不是设置默认数据，检查目标模型是否为空
      const { targetModel } = this;
      if (!targetModel) {
        this.$message.warning('请选择目标模型');
        return false;
      }
      this.filterData.push(item);
      this.setIndex(DataRuleType.DataType.Filter);
      this.showButtonOnViewport(DataRuleType.ButtonTypes.FilterCondition);
    }
  }

  /**
   * 校验主表条件
   */
  validateSheetScope() {
    const list =  this.filterData.filter((item:any) => {
      return (item.currentField.val && item.targetField.val) || (item.targetField.val && item.value.val === 3);
    });
    if (list.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  addSheetCondition() {
    if (this.UpDateObjIsSheet && !this.validateSheetScope()) {
      this.$message.info('请先设置主表条件');
      return;
    }
    const {
     operatorListCopy, valueListCopy, currentFieldCopy, currentSheetList
    } = this.deepCopyRowData();
    const item = {
      targetField: {
        val: '',
        name: '',
        list: currentSheetList,
      },
      operator: {
        val: DataRuleType.ConditionType.Equal,
        name: '',
        list: operatorListCopy,
      },
      value: {
        val: DataRuleType.ValueType.DynamicValue,
        name: '',
        list: valueListCopy,
      },
      currentField: {
        val: '',
        name: '',
        list: currentFieldCopy,
      },
      operation: {
      }
    };
    this.ruleScopeChild.push(item);
    this.setIndex(DataRuleType.DataType.SheetFilter);
  }

  addSheetDataAction() {
    const {
      targetFieldsCopy, actionTypeListCopy, valueListCopy, currentFieldCopy, operatorListCopy
    } = this.deepCopyRowData();

    const item = {
      targetField: {
        val: '',
        name: '',
        list: targetFieldsCopy,
      },
      operator: {
        val: DataRuleType.ActionType.Equal,
        name: '',
        list: operatorListCopy,
      },
      value: {
        val: DataRuleType.ValueType.DynamicValue,
        name: '',
        list: valueListCopy,
      },
      currentField: {
        val: '',
        name: '',
        list: currentFieldCopy,
      },
      operation: {
      }
    };
    this.ruleActionMainScope.push(item);
    this.setIndex(DataRuleType.DataType.MainQuery);
  }

  /**
   * 校验主表条件
   */
  validateMainScope() {
    const list =  this.ruleActionMainScope.filter((item:any) => {
      return (item.currentField.val && item.targetField.val) || (item.targetField.val && item.value.val === 3);
      // return item.currentField.val && item.targetField.val;
    });
    if (list.length > 0) {
      return true;
    } else {
      return false;
    }
  }
 
  /**
   * 新增数据动作
   * @params isSetDefault 是否设置默认数据
  */
  addDataAction(isSetDefault:boolean) {
    if (this.UpDateObjIsSheet && this.isShowActionSysDataItems && !this.validateMainScope()) {
      this.$message.info('请先设置主表查找');
      return;
    }
    const {
      targetFieldsCopy, actionTypeListCopy, valueListCopy, currentFieldCopy,currentSheetList
    } = this.deepCopyRowData();

    let dataItem = this.UpDateObjIsSheet ? currentSheetList : targetFieldsCopy;

    // 过滤子表的系统数据项
    if (this.UpDateObjIsSheet) {
      dataItem = dataItem.filter((item:any) => {
        return !item.defaultProperty;
      });
    }

    // 新增 保留拥有
    if (this.isShowActionSysDataItems && !this.UpDateObjIsSheet) {

      const filterArr = ['creater', 'owner'];

      const dataList = dataItem.filter((item:any) => {
        return filterArr.includes(item.code);
      });

      dataItem = dataItem.filter((item:any) => {
        return !item.defaultProperty;
      });
      dataItem = dataItem.concat(dataList);
    }

    // 更新
    if (!this.isShowActionSysDataItems && !this.UpDateObjIsSheet) {
      dataItem = dataItem.filter((item:any) => {
        return !item.defaultProperty;
      });
    }
    const item = {
      targetField: {
        val: '',
        name: '',
        list: dataItem,
      },
      operator: {
        val: DataRuleType.ActionType.Equal,
        name: '',
        list: actionTypeListCopy,
      },
      value: {
        val: DataRuleType.ValueType.DynamicValue,
        name: '',
        list: valueListCopy,
      },
      currentField: {
        val: '',
        name: '',
        list: currentFieldCopy,
      },
      operation: {
      }
    };

    if (isSetDefault) {
      this.dataActionData.push(item);
      this.setIndex(DataRuleType.DataType.Action);
    } else { // 不是设置默认数据，检查目标模型是否为空
      const { targetModel } = this;
      if (!targetModel) {
        this.$message.warning('请选择目标模型');
        return false;
      }
      this.dataActionData.push(item);
      this.setIndex(DataRuleType.DataType.Action);

      this.showButtonOnViewport(DataRuleType.ButtonTypes.DataAction);
    }
  }


  /**
   * 设置index
   * @params type 区分设置哪个数据的下标 filter为过滤条件， action为数据动作
   */
  setIndex(type:string) {
    if (!type) return;
    let data:any = [];
    if (type === DataRuleType.DataType.Filter) {
      data = this.filterData;
    } else if (type === DataRuleType.DataType.Action) {
      data = this.dataActionData;
    } else if (type === DataRuleType.DataType.DataCondition) {
      data = this.dataConditionData;
    } else if (type === DataRuleType.DataType.MainQuery) {
      data = this.ruleActionMainScope;
    } else if (type === DataRuleType.DataType.SheetFilter) {
      data = this.ruleScopeChild;
    }
    data.forEach((item:any, index:number) => {
      Object.keys(item).forEach((key:any) => {
        item[key].index = index;
      });
    });
  }


  /**
   * 让按钮出现在可是区域
   * @param btnType 按钮类型
   */
  showButtonOnViewport(btnType:number) {
    this.$nextTick(() => {
      const drawerBody:any = document.querySelector('.ant-drawer-body');
      const drawerBodyHeight = drawerBody.clientHeight;

      let addBtn:any = '';
      if (btnType === DataRuleType.ButtonTypes.FilterCondition) {
        addBtn = this.$refs.addFilterConditionBtn;
      } else if (btnType === DataRuleType.ButtonTypes.DataAction) {
        addBtn = this.$refs.addDataActionBtn;
      } else if (btnType === DataRuleType.ButtonTypes.DataCondition) {
        addBtn = this.$refs.addDataConditionBtn;
      }
      const addBtnOffsetTop = addBtn.offsetTop || 0;

      if ((addBtnOffsetTop - drawerBody.scrollTop) > drawerBodyHeight) {
        drawerBody.scrollTop += 100;
      }
    });
  }


  /**
   * 删除过滤条件
   */
  deleteFilterItem(row:any) {
    const { index } = row;
    this.filterData.splice(index, 1);
    this.setIndex(DataRuleType.DataType.Filter);
  }


  /**
   * 删除数据动作
   */
  deleteActionItem(row:any) {
    const { index } = row;
    this.dataActionData.splice(index, 1);
    this.setIndex(DataRuleType.DataType.Action);
  }
  
  /**
   * 删除子表条件
   * @param row 
   */
  deleteRuleScopeChild(row:any) {
    // debugger;
    const { index } = row;
    this.ruleScopeChild.splice(index, 1);
    this.setIndex(DataRuleType.DataType.SheetFilter);
  }

  /**
   * 删除查找主表
   * @param row 
   */
  deleteRuleActionMainScope(row:any) {
    const { index } = row;
    this.ruleActionMainScope.splice(index, 1);
    this.setIndex(DataRuleType.DataType.MainQuery);
  }

  /**
   * 删除数据条件
   */
  deleteDataConditionItem(row:any) {
    const { index } = row;
    this.dataConditionData.splice(index, 1);
    this.setIndex(DataRuleType.DataType.DataCondition);
  }


  /**
   * 过滤模型字段，相互影响
   */
  dataItemChange(value:any, record:any, type: DataRuleType.DataType,operator:any, clearVal?:boolean) {
    const currentItem:any =  record.targetField.list.find((item:any) => {
      return item.code === value;
    });
    let propertyType = -1;
    let code = '';
    if (currentItem) {
      propertyType = currentItem.propertyType;
      code = currentItem.code
    }
    // const { propertyType, code } = currentItem;
    this.setCurrentDataItems(propertyType, code, record, type);
    this.setOperator(propertyType, record);
    this.setValue(propertyType, code, record,operator);

    if (clearVal !== false) {
      this.clearRowVal(record);
    }  
  }
  /**
   * 清楚每行的值
   */
  clearRowVal(rowData: any) {
    rowData.currentField.val = '';
    rowData.operator.val = 1;
    rowData.value.val = 1;
  }

  /**
   * 设置当前字段属性
   * @param type 
   * @param rowData 
   */
  setCurrentDataItems(type:DataItemType, code: string, rowData:any, Datatype: DataRuleType.DataType) {
    // debugger;
    // 清空目前模型的值
    if(type === -1) {
      return;
    }
    const { currentFieldCopy, targetFieldsCopy } = this.deepCopyRowData();

    const curModel =  this.upDateObjLists.find((res:any) => {
      return res.propertyType === -1;
    });

    const codeArr = ['creater', 'owner'];
    const codeArr2 = ['ownerDeptId', 'createdDeptId'];
    const list:any = currentFieldCopy;
    const { bizSchemaCode } = this.$route.params;
    let arr:any = [];

    arr = list.filter((item:any) => {
      return item.propertyType === type;
    });
    
    if (type === DataItemType.RelevanceForm) {
      // let targetItems = this.getCurrentSubSchema(); 
      // if (Datatype === DataRuleType.DataType.MainCondition) {
      //   targetItems = targetFieldsCopy;
      // }
      const ctargetCode = rowData.targetField.list.find((item:any) => {
        return item.code === code;
      });

      if (ctargetCode) {
        arr = arr.filter((item:any) => {
          return item.relativeCode === ctargetCode.relativeCode;
          // if (ctargetCode.relativeCode === bizSchemaCode) {
          //   return item.relativeCode === ctargetCode.relativeCode || (this.UpDateObjIsSheet && item.code === 'id') || item.code === 'parentId';
          // } else {
          //   return item.relativeCode === ctargetCode.relativeCode;
          // }
        });
      }
      if (ctargetCode && ctargetCode.relativeCode === bizSchemaCode) {
        const filterCode = !this.isSubSchema ? 'id' : 'parentId';
        const idData = list.find((item:any) => item.code === filterCode);
        arr.push(idData);
      };
    }

    // rowData.currentField.list = arr;
    switch (Datatype) {
      
      case DataRuleType.DataType.DataAcition:
      case DataRuleType.DataType.MainCondition:
      case DataRuleType.DataType.SheetCondition:
      case DataRuleType.DataType.QueryMain:
        // id 和 parentId 可选择文本类型与关联表单
        if (code === 'id' || code === 'parentId') {
          arr = list.filter((item:any) => {
            if (item.propertyType === DataItemType.RelevanceForm) {

              if (item.relativeCode !== curModel.code) {
                return false;
              }
              
            }
            return (item.propertyType === type ||
              (item.propertyType === DataItemType.RelevanceForm && item.relativeCode === curModel.code)
              )
            && item.code !== 'sequenceStatus' && item.code !== 'id';
          });
        }

        if (code === 'id' && Datatype === DataRuleType.DataType.SheetCondition) {
          arr = list.filter((item:any) => {
            return (item.propertyType === type && !item.defaultProperty && item.code !== 'id');
          });
        };

        // 创建人与拥有者;
        if (codeArr.includes(code)) {
          arr = list.filter((item:any) => {
            if ( Datatype === DataRuleType.DataType.DataAcition ) {
              return codeArr.includes(item.code);
            } else {
              return item.propertyType === type && !codeArr2.includes(item.code);
            }
          });
        }

        // 创建人部门 与 拥有着部门
        if (codeArr2.includes(code)) {
          arr = list.filter((item:any) => {
            return item.propertyType === type && !codeArr.includes(item.code);
          });
        }

        // 选人控件过滤修改人
        switch (type) {
          case DataItemType.StaffSelector:
            arr = arr.filter((item:any) => {
              return item.code !== 'modifier';
            });
            break;

          case DataItemType.Number:
              arr = arr.filter((item:any) => {
                return item.code !== 'sortKey';
              });
            break;
          case DataItemType.RelevanceForm:
            // const curDataIten:any = targetFieldsCopy.find((item:any) => {
            //   return item.code === code;
            // });
          
            
            break;
          default:
            break;
      }
      rowData.currentField.list =  arr;
    }
  }

  operatorChange(rowData:any) {
    
    const currentItem:any = rowData.targetField.list.find((item:any) => {
       return item.code === rowData.targetField.val;
    });

    if (!currentItem) {
      return;
    }
    const { propertyType, code } = currentItem;

    rowData.value.val = 1;

    this.setValue(propertyType, code, rowData, rowData.operator.val);
  }

  /**
   * 设置操作符号
   * @param value 
   * @param vNode 
   */
  setOperator(type:DataItemType | number, rowData:any) {
    // item.index === 1  对应等于
    // 重置操作符号
    if (type === -1) {
      return;
    }
    rowData.operator.list.forEach((item:any) => {
      if (type === DataItemType.Number) {
        item.disabled = false;
      } else {

        if (item.index === 1) {
          item.disabled = false;
        } else {
          item.disabled = true;
        }
      }
    })

    rowData.operator.list = [...rowData.operator.list];
  }

  /**
   * 
   * @param rowData 
   */
  valueSelectChange(rowData:any) {
    rowData.currentField.val = '';
  }

   /**
   * 设置值状态
   * @param type 
   * @param rowData 
   */
  setValue(type:DataItemType, code:string, rowData:any, operator?:DataRuleType.ConditionType) {
    // debugger;
    const { targetFieldsCopy } = this.deepCopyRowData();
    const operatorCopy = operator ? operator : 1;
    const  codeArr = ['id','parentId'];
    const codeArr2 = ['sortKey', 'createdTime', 'modifiedTime', 'name','sequenceStatus'];
    const useDefault = ['creater','createdDeptId','owner', 'ownerDeptId'];

    if (codeArr.includes(code)) {
      rowData.value.list = Helper.jsonDeepCopy(dataRuleMap.liveValue);
      return;
    }
    if (codeArr2.includes(code)) {
      // 不能为空
      rowData.value.list = Helper.jsonDeepCopy(dataRuleMap.valGroup2);
      return;
    }

    const currentIte:any = targetFieldsCopy.find((item:any) => {
      return item.code === code;
    });

    // if (currentIte && currentIte.defaultProperty) {
    //   rowData.value.list = Helper.jsonDeepCopy(dataRuleMap.valGroup2);
    //   return;
    // }



    let arr:any = [];
    switch (type) {
      case DataItemType.ShortText:
      case DataItemType.LongText:
      case DataItemType.Date:
      case DataItemType.Number:
        arr = dataRuleMap.valGroup2;
        if (operatorCopy === DataRuleType.ConditionType.Equal) {
          arr = dataRuleMap.valGroup1;
        }
        break;
      case DataItemType.Logic:
        arr = dataRuleMap.valGroup2;
        break;
      case DataItemType.StaffSelector:
        arr = dataRuleMap.valGroup3;
        if (useDefault.includes(code)) {
          // 系统选人选人控件
          arr = dataRuleMap.liveValue;
        }
        break;
      case DataItemType.RelevanceForm:
      case DataItemType.Address:
        arr = dataRuleMap.valGroup3;
        break;
      default:
        arr = dataRuleMap.valGroup1;
        break;
    }
    rowData.value.list = Helper.jsonDeepCopy(arr);
  }


  /**
   *操作符变化
  */
  onOperatorChange(value:any, vNode:any) {
    const { index, dataType } = vNode.data.attrs;
    const params:DataRuleType.OperatorChangeParams = {
      curDataType: dataType,
      value,
      index
    };

    this.handleOperatorChange(params);
  }


  /**
   * 统一处理操作变化
   */
  handleOperatorChange(params:DataRuleType.OperatorChangeParams) {
    const { curDataType, value, index } = params;
    const {
      targetFieldsCopy, operatorListCopy, actionTypeListCopy, currentFieldCopy
    } = this.deepCopyRowData();

    const data:any = curDataType === DataRuleType.DataType.Filter ? this.filterData : this.dataActionData;
    const operatorEqualType:number = curDataType === DataRuleType.DataType.Filter ? DataRuleType.ConditionType.Equal : DataRuleType.ActionType.Equal;

    if (value === operatorEqualType) { // 操作符等于的时候
      // 值类型为为空的选项可点击
      data[index].value.list.forEach((item:any) => {
        if (item.index === DataRuleType.ValueType.ToBeNull) {
          item.disabled = false;
        }
      });

      // 所有选项可选
      data[index].targetField.list = targetFieldsCopy;
      data[index].currentField.list = currentFieldCopy;
    } else { // 操作符不等于的时候
      // 值类型为为空的选项不可选
      data[index].value.list.forEach((item:any) => {
        if (item.index === DataRuleType.ValueType.ToBeNull) {
          item.disabled = true;
        }
      });

      // 过滤出数值类型的数据项，因为只有数值才能做比较或者累加扣减
      // 对已选的数据项，数据项类型不为数值型则置空
      data[index].targetField.list = targetFieldsCopy.filter((item:any) => item.propertyType === DataItemType.Number);
      const curTargetFieldVal:string = data[index].targetField.val;
      if (curTargetFieldVal) {
        const tarFieldProperty = targetFieldsCopy.find((item:any) => item.code === curTargetFieldVal).propertyType;
        if (tarFieldProperty !== DataItemType.Number) {
          data[index].targetField.val = '';
        }
      }

      data[index].currentField.list = currentFieldCopy.filter((item:any) => item.propertyType === DataItemType.Number);
      const curFieldVal:string = data[index].currentField.val;
      if (curFieldVal) {
        const curFieldProperty = currentFieldCopy.find((item:any) => item.code === curFieldVal).propertyType;
        if (curFieldProperty !== DataItemType.Number) {
          data[index].currentField.val = '';
        }
      }

      // 再判断当前值类型是不是固定值，需要根据固定值过滤字段列表
      if (data[index].value.val === DataRuleType.ValueType.FixedValue) {
        data[index].targetField.list = data[index].targetField.list.filter((item:any) => this.abledDataItemTypes.indexOf(item.propertyType) > -1);
        data[index].currentField.list = data[index].currentField.list.filter((item:any) => this.abledDataItemTypes.indexOf(item.propertyType) > -1);
      }
    }
  }


  /**
   * 整合提交参数
   * @params type 区分是修改还是新增
   */
  paramsFormater(type:string) {
    const { bizSchemaCode } = this.$route.params;

    // 格式化查找数据范围
    const { ruleScopeJson, ruleActionJson, dataConditionJson, ruleScopeChildJson, ruleActionMainScopeJson } = this.ruleJsonFormater();

    const params:DataRuleApi.RuleModel = {
      conditionJoinType: this.searchCondition,
      name: this.ruleName,
      ruleActionJson, // 数据动作json
      ruleScopeJson, // 过滤条件json
      dataConditionJson, // 数据条件json
      ruleScopeChildJson,
      ruleActionMainScopeJson,
      sourceSchemaCode: bizSchemaCode,
      targetSchemaCode: this.targetModel,
      triggerActionType: this.triggerAction,
      triggerConditionType: this.triggerCondition,
      dataConditionJoinType: this.dataConditionJoinType,
      triggerSchemaCode: this.triggerObj,
      chooseAction: this.appCode,
      targetTableCode: this.targetTableCode,
      insertConditionJoinType: this.insertConditionJoinType
    };

    if (type === DataRuleType.OperationMode.Add) {
      return params;
    }
    const { id, enabled } = this.data;
    params.id = id;
    params.enabled = enabled;
    return params;
  }


  /**
   * 格式化过滤条件（查找范围）
   * @returns 只返回所有项都不为空的数据
   */
  ruleJsonFormater() {
    const ruleScopeJson:any = [];
    let ruleActionJson:any = [];
    let dataConditionJson:any = [];
    let ruleScopeChildJson:any = [];
    // 主表过滤条件
    let ruleActionMainScopeJson:any = [];


    // 主表条件啊
    this.filterData.forEach((item:any) => {
      if (item.targetField.val && item.currentField.val) {
        ruleScopeJson.push({
          targetPropertyCode: item.targetField.val,
          conditionType: item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      } else if (item.value.val === DataRuleType.ValueType.ToBeNull && item.targetField.val !== '') {
        ruleScopeJson.push({
          targetPropertyCode: item.targetField.val,
          conditionType: item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      }
    });

    // 数据动作
    this.dataActionData.forEach((item:any) => {
      if (item.targetField.val && item.currentField.val) {
        ruleActionJson.push({
          targetPropertyCode: item.targetField.val,
          // 当触发动作是新增，actionType显示为设置为，其值为新增
          actionType: this.triggerAction === DataRuleType.TriggerActionType.Add ? DataRuleType.TriggerActionType.Add : item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      } else if (item.value.val === DataRuleType.ValueType.ToBeNull && item.targetField.val !== '') {
        ruleActionJson.push({
          targetPropertyCode: item.targetField.val,
          // 当触发动作是新增，actionType显示为设置为，其值为新增
          actionType: this.triggerAction === DataRuleType.TriggerActionType.Add ? DataRuleType.TriggerActionType.Add : item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      }
    });
    
    this.dataConditionData.forEach((item:any) => {
      const currentData = item.dataItem.list.find(res => res.code === item.dataItem.val);
      dataConditionJson.push({
        triggerPropertyCode: item.dataItem.val,
        dataConditionType: item.filterCondition.val,
        value: item.value.val,
        type: currentData ? currentData.propertyType : 0
      })
    })

    // 子表条件
    this.ruleScopeChild.forEach((item:any) => {
      if (item.targetField.val && item.currentField.val) {
        ruleScopeChildJson.push({
          targetPropertyCode: item.targetField.val,
          conditionType: item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      } else if (item.value.val === DataRuleType.ValueType.ToBeNull && item.targetField.val !== '') {
        ruleScopeChildJson.push({
          targetPropertyCode: item.targetField.val,
          conditionType: item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      }
    })

    // 主表过滤条件
    this.ruleActionMainScope.forEach((item:any) => {
      // ruleActionMainScopeJson
      if (item.targetField.val && item.currentField.val) {
        ruleActionMainScopeJson.push({
          targetPropertyCode: item.targetField.val,
          conditionType: item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      } else if (item.value.val === DataRuleType.ValueType.ToBeNull && item.targetField.val !== '') {
        ruleActionMainScopeJson.push({
          targetPropertyCode: item.targetField.val,
          conditionType: item.operator.val,
          valueType: item.value.val,
          triggerPropertyCode: item.currentField.val
        });
      }
    });


    if (this.triggerAction === DataRuleType.TriggerActionType.Delete) {
      ruleActionJson = [];
    }

    if (this.dataConditionJoinType === 1) { // 所有数据不需要json
      dataConditionJson = [];
    } 

    return { 
      ruleScopeJson: JSON.stringify(ruleScopeJson), 
      ruleActionJson: JSON.stringify(ruleActionJson),
      dataConditionJson: JSON.stringify(dataConditionJson),
      ruleScopeChildJson: JSON.stringify(ruleScopeChildJson),
      ruleActionMainScopeJson: JSON.stringify(ruleActionMainScopeJson)
    };
  }


  /**
   * 校验数据动作是否每一行的当前字段和目标字段都有值
   * @param type 检验类型
   */
  validateData(type:string):boolean {
    let isDataOk: boolean = true;
    const data:any = type === DataRuleType.DataType.Filter ? this.filterData : this.dataActionData;
    for (let i = 0; i < data.length; i += 1) {
      const item = data[i];
      if ((item.targetField.val === '' || item.currentField.val === '') && item.value.val !== DataRuleType.ValueType.ToBeNull) {
        isDataOk = false;
        break;
      }
    }
    return isDataOk;
  }


  /**
   * 提交数据
   */
  submit() {
  // 判断是否可提交
    if (this.targetModel === '') {
      this.$message.warning('目标模型不能为空');
      return;
    }
    if (this.targetTableCode === '' && this.UpDateObjIsSheet) {
      this.$message.warning('更新对象不能为空');
      return;
    }
    const { dataActionData, filterData, triggerAction } = this;

    // 204190515 当触发动作是更新数据和删除数据时，查询条件必填
    if (triggerAction === DataRuleType.TriggerActionType.Add) {
      if (dataActionData.length <= 0) {
        this.$message.warning('新增数据动作不能为空');
        return false;
      }
      const isOk:boolean = this.validateData(DataRuleType.DataType.Action);
      if (!isOk) {
        this.$message.warning('目标模型数据字段或当前模型数据字段不能为空');
        return false;
      }
    }

    if (triggerAction === DataRuleType.TriggerActionType.Update) {
      if (filterData.length <= 0) {
        this.$message.warning('查找数据范围不能为空');
        return false;
      }
      if (dataActionData.length <= 0) {
        this.$message.warning('更新数据动作不能为空');
        return false;
      }

      const isFilterDataOk:boolean = this.validateData(DataRuleType.DataType.Filter);
      if (!isFilterDataOk) {
        this.$message.warning('目标模型数据字段或当前模型数据字段不能为空');
        return false;
      }

      const isActionDataOk:boolean = this.validateData(DataRuleType.DataType.Action);
      if (!isActionDataOk) {
        this.$message.warning('目标模型数据字段或当前模型数据字段不能为空');
        return false;
      }
    }

    if (triggerAction === DataRuleType.TriggerActionType.Delete) {
      if (filterData.length <= 0) {
        this.$message.warning('删除数据范围不能为空');
        return false;
      }

      const isFilterDataOk:boolean = this.validateData(DataRuleType.DataType.Filter);
      if (!isFilterDataOk) {
        this.$message.warning('目标模型数据字段或当前模型数据字段不能为空');
        return false;
      }
    }

    this.postData(this.mode as DataRuleType.OperationMode);
    // if (this.mode === DataRuleType.OperationMode.Add) { // 新增
    //   this.handleCreateDataRule();
    // } else { // 编辑即修改
    //   this.handleUpdateDataRule();
    // }
  }

  async postData (type: DataRuleType.OperationMode) {
    let isAdd = type === DataRuleType.OperationMode.Add;
    const successTip = isAdd ? '创建数据规则成功' : '更新数据规则成功';
    const failTip = isAdd ? '创建数据规则失败' : '更新数据规则失败';
    const params:DataRuleApi.RuleModel = this.paramsFormater(type);
    const res:any = await DataRuleApi.create(params);
    if (res.errcode === 0) {
      this.$message.success(successTip);
      this.$emit('submited');
    } else {
      if (res.errcode === 10005) {
        this.$message.error(res.errmsg);
      } else {
        this.$message.error(failTip);
      }
    }
  }
  /**
   * 新增数据规则
   */
  // async handleCreateDataRule() {
  //   const params:DataRuleApi.RuleModel = this.paramsFormater(DataRuleType.OperationMode.Add);
  //   const res:any = await DataRuleApi.create(params);
  //   if (res.errcode === 0) {
  //     this.$message.success('创建数据规则成功');
  //     this.$emit('submited');
  //   } else {
  //     if (res.errcode === 10005) {
  //       this.$message.error(res.errmsg);
  //     } else {
  //       this.$message.error('创建数据规则失败');
  //     }
  //   }
  // }


  // /**
  //  * 更新数据规则
  //  */
  // async handleUpdateDataRule() {
  //   const params:DataRuleApi.RuleModel = this.paramsFormater(DataRuleType.OperationMode.Edit);
  //   const res:any = await DataRuleApi.update(params);
  //   if (res.errcode === 0) {
  //     this.$message.success('更新数据规则成功');
  //     this.$emit('submited');
  //   } else {
  //     if (res.errcode === 10005) {
  //       this.$message.error(res.errmsg);
  //     } else {
  //       this.$message.error('更新数据规则失败');
  //     }
  //   }
  // }


  /**
   * 编辑时数据回写
   */
  async dataBackWriting() {
    if (this.mode === DataRuleType.OperationMode.Edit) {
    // 数据回写
      const {
        conditionJoinType, name, targetSchemaCode, triggerActionType, triggerConditionType,
        triggerSchemaCode, sourceSchemaCode, ruleActionJson, ruleScopeJson, chooseAction, targetSchemaName,
        dataConditionJoinType, dataConditionJson, targetTableCode, ruleScopeChildJson, ruleActionMainScopeJson, insertConditionJoinType
      } = this.data;
      this.searchCondition = conditionJoinType;
      this.ruleName = name;
      this.targetTableCode = targetTableCode;

      this.insertConditionJoinType = insertConditionJoinType ? insertConditionJoinType : 1;
      // 
      // 模型回写
      // 描述，后端提供一个字段用于存储用户选择是哪个应用下面的哪个模型
      // 格式为: 'appcode-modelcode'
      this.targetModel = targetSchemaCode;
      this.isWriteBack = false;
      setTimeout(() => {
        this.isWriteBack = true;
      }, 10);


      this.triggerObj = triggerSchemaCode;
      const ptype:number = triggerSchemaCode === sourceSchemaCode ? -1 : 0;
      this.currentFields = this.setCurFieldsList(ptype, triggerSchemaCode);

      // 触发动作回写以及ui展示控制
      this.triggerCondition = triggerConditionType;
      this.triggerConditionList.forEach((item:any) => {
        if (item.index === triggerConditionType) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
      });

      this.triggerAction = triggerActionType;
      this.isShowActionSysDataItems = triggerActionType !== 2;
      this.triggerActionList.forEach((item:any) => {
        if (item.index === triggerActionType) {
          item.isSelected = true;
        } else {
          item.isSelected = false;
        }
      });

      const {
        dataItemsCopy, dataFilterConditionListCopy
      } = this.deepCopyRowData();

      // 数据动作回写
      this.dataConditionJoinType = dataConditionJoinType || 1;
      if (this.dataConditionJoinType !== 1) {
        const dataConditionData = JSON.parse(dataConditionJson);
        dataConditionData.forEach((item:any) => {
          const { triggerPropertyCode, dataConditionType, value } = item;
          
          // 判断展示类型
          // 1. 判断当前字段是系��字段还是业务字段
          const curRowDataItem:any = this.currentFields.find((child:any) => child.code === triggerPropertyCode);

          const k:any = curRowDataItem.defaultProperty ? triggerPropertyCode : curRowDataItem.propertyType;
          // let k:any = curRowDataItem ? curRowDataItem.propertyType : triggerPropertyCode;
          // let k:any = curRowDataItem ? triggerPropertyCode : curRowDataItem.propertyType;

          // if (item.type !== undefined) {
          //   k = item.type;
          // }

          // 2. 获取过滤条件列表
          const filterMap:Array<number> = Helper.getDataConditionFilterMap(k);
          const filterConditoinList:any = dataFilterConditionListCopy.filter((filterCondition:any) => filterMap.indexOf(filterCondition.index) > -1);
          
          // 3. 获取展示类型
          const displayType:number = Helper.getDisplayType(k, dataConditionType);

          const dataConditionItem:any = {
            dataItem: {
              val: triggerPropertyCode,
              list: Helper.jsonDeepCopy(this.currentFields),
            },
            filterCondition: {
              val: dataConditionType,
              list: filterConditoinList,
            },
            value: {
              val: value,
              display: displayType,
              errMsg: ''
            },
            operation: {
            }
          }

          this.dataConditionData.push(dataConditionItem);
      });
      }
      await this.selectModel({ code: targetSchemaCode, selectTrace: chooseAction, title: targetSchemaName || '' });
      
      const {
        targetFieldsCopy, operatorListCopy, 
        valueListCopy, currentFieldCopy, actionTypeListCopy,
      } = this.deepCopyRowData();

      // 表格数据赋值
      const filterData = JSON.parse(ruleScopeJson);
      const dataActionData = JSON.parse(ruleActionJson);

      // 主表过滤条件回写
      this.filterData = this.initRunTimeData(filterData,targetFieldsCopy, DataRuleType.DataType.MainCondition);
      // 查找主表
      if (ruleActionMainScopeJson) {
        const ruleActionMainScope = JSON.parse(ruleActionMainScopeJson);
        this.ruleActionMainScope = this.initRunTimeData(ruleActionMainScope, targetFieldsCopy, DataRuleType.DataType.QueryMain);
      }
      // debugger;
      const targetItems = this.getCurrentSubSchema(); 
      // 子表条件
      if (ruleScopeChildJson) {
        const ruleScopeChild = JSON.parse(ruleScopeChildJson);
        this.ruleScopeChild = this.initRunTimeData(ruleScopeChild, targetItems,DataRuleType.DataType.SheetCondition);
      }
      // 数据动作
      this.dataActionData = this.initRunTimeData(dataActionData, targetItems, DataRuleType.DataType.DataAcition);

      // 数据动作回写
      
      // 设定下标
      this.setIndex(DataRuleType.DataType.Filter);
      this.setIndex(DataRuleType.DataType.Action);
      this.setIndex(DataRuleType.DataType.DataCondition);
    } else {
      this.addDataCondition();
    }
  }

  getCurrentSubSchema() {
    const {
      targetFieldsCopy
    } = this.deepCopyRowData();
    const sheet:any =  targetFieldsCopy.find((innerItem:any) => innerItem.code === this.targetTableCode);

    if (sheet) {
      return sheet.subSchema.properties
    }
    return targetFieldsCopy;
  }

  // 过滤条件主表 与 查找主表数据 回写
  initRunTimeData(dataItem:any,targetItemList:any, type?:DataRuleType.DataType) {
    if (!type) {
      type = 1;
    }
    const backData:any = [];
    const {
      targetFieldsCopy, operatorListCopy, 
      valueListCopy, currentFieldCopy, actionTypeListCopy,
    } = this.deepCopyRowData();
    const codeArr = ['creater', 'owner'];
    dataItem.forEach((item:any) => {
      // debugger;
      let operator = [];
      let list = targetItemList.filter((innerItem:any) => innerItem.published);
      if (type === DataRuleType.DataType.DataAcition) {
        list = list.filter((innerItem:any) => codeArr.includes(innerItem.code) || !innerItem.defaultProperty )
        operator = actionTypeListCopy;
      } else {
        operator = operatorListCopy;
      }
      const operatorListCopy_tem = Helper.jsonDeepCopy(operator);
     

      // const targetItem = list.find((innerItem:any) => innerItem.code === item.targetPropertyCode);

      // if(!targetItem){
      //   return;
      // }
      // const curItemPropertyType = targetItem.propertyType;
      let curFieldsList = currentFieldCopy.filter((innerItem:any) => innerItem.published);
      const valueListForFilterData = Helper.jsonDeepCopy(valueListCopy);
      const filterItem = {
        targetField: {
          val: item.targetPropertyCode,
          name: '',
          list,
        },
        operator: {
          val: item.conditionType || item.actionType,
          name: '',
          list: operatorListCopy_tem,
        },
        value: {
          val: item.valueType,
          name: '',
          list: valueListForFilterData,
        },
        currentField: {
          val: item.triggerPropertyCode,
          name: '',
          list: curFieldsList,
        },
        operation: {
        }
      };
      
      this.dataItemChange(item.targetPropertyCode, filterItem, type as any, item.conditionType, false);
      backData.push(filterItem);
    });

    return backData;
  }


  /**
   * 所有规则条件赋值
   */
  setAllRuleTypes() {
    const {
      triggerConditionType, triggerActionType,
      conditionJoinType, conditionType, 
      actionType, valueType, dataConditionJoinType, dataConditionType
    } = this.ruleTypes;

    triggerConditionType.forEach((item:any, index:number) => {
      if (index === 0) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    this.triggerConditionList = triggerConditionType;
    this.triggerCondition = this.triggerConditionList[0].index;

    triggerActionType.forEach((item:any, index:number) => {
      if (index === 0) {
        item.isSelected = true;
      } else {
        item.isSelected = false;
      }
    });
    this.triggerActionList = triggerActionType;
    this.triggerAction = this.triggerActionList[0].index;

    this.conditionJoinTypes = conditionJoinType;
    this.searchCondition = this.conditionJoinTypes[0].index;

    conditionType.forEach((item:any, index:any) => {
      item.disabled = false;
    });
    this.operatorList = conditionType;

    actionType.forEach((item:any, index:any) => {
      item.disabled = false;
    });
    this.actionTypeList = actionType;

    valueType.forEach((item:any, index:any) => {
      item.disabled = false;
    });
    this.valueList = valueType;

    // 数据条件
    this.dataConditionList = dataConditionJoinType;

    // 数据条件过滤条件
    this.dataFilterConditionList = dataConditionType;
  }

  getLogicType(targetList:any){
    if (targetList.val === '') return false;
    const item:any = targetList.list.find((child:any) => child.code === targetList.val);
    if (!item) return;
    return item.propertyType === DataItemType.Logic;
  }

  getDateType(targetList : any){
    if (targetList.val === '') return false;
    const item:any = targetList.list.find((child:any) => child.code === targetList.val);
    if (!item) return;
    return item.propertyType === DataItemType.Date;
  }

  getNumberType(targetList:any){
    if (targetList.val === '') return false;
    const item:any = targetList.list.find((child:any) => child.code === targetList.val);
    if(!item) return;
    return item.propertyType === DataItemType.Number;
  }

  /** 
   * 数据字段变化
  */
  onDataItemChange(rowData:any){
    // debugger;
    // const { propertyType, code, isDefaultProperty, index } = vNode.data.attrs;
    const currentItem:any = rowData.dataItem.list.find((item:any) => {
      return rowData.dataItem.val === item.code;
    });
    const index = rowData.dataItem.index,
          code = currentItem.code,
          isDefaultProperty = currentItem.defaultProperty,
          propertyType = currentItem.propertyType;

    const k:any = isDefaultProperty ? code : propertyType;

    const filterMap:Array<number> = Helper.getDataConditionFilterMap(k);

    const { dataFilterConditionListCopy } = this.deepCopyRowData();
    
    // 获取当前行过滤条件类型
    const curRowFilterCondition:any = this.dataConditionData[index].filterCondition;
    let curRowFilterVal:any = curRowFilterCondition.val;

    // 过滤过滤条件
    const list:any = dataFilterConditionListCopy.filter((filterCondition:any) => filterMap.indexOf(filterCondition.index) > -1);
    this.dataConditionData[index].filterCondition.list = list;

    if (!curRowFilterVal) return;
    if (filterMap.indexOf(curRowFilterVal) <= -1)  {
      curRowFilterCondition.val = filterMap[0];
    }

    // 类型变化，值清空
    if (propertyType === DataItemType.StaffSelector) {
      this.dataConditionData[index].value.val = [];
    } else {
      this.dataConditionData[index].value.val = '';
    }
  
    // 展示类型变化 
    this.calcDisplayType(index, k, curRowFilterCondition.val);
  }

  /** 
   * 过滤条件变化
  */
  onFilterConditionChange(value:any, vNode:any) {
    const { index } = vNode.data.attrs;
    const dataItemVal:any = this.dataConditionData[index].dataItem.val; // code
    if (!dataItemVal) return;
    
    const curRowDataItemPtype:number = this.dataConditionData[index].dataItem.list.find((item:any) => item.code === dataItemVal).propertyType as number;
    const isDefault:boolean = this.dataConditionData[index].dataItem.list.find((item:any) => item.code === dataItemVal).defaultProperty as boolean;
    let dataItemType:number|string = isDefault ? dataItemVal : curRowDataItemPtype;
    this.calcDisplayType(index, dataItemType, value);
  }

  /** 
   * 处理过滤条件变化
   * @params index 当前数据下标
   * @params propertyType 数据字段的数据类型
   * @params filterConditionType 过滤条件类型
  */
  calcDisplayType(index:number, propertyType:number|string, filterConditionType:number) {
    const displayType:number = Helper.getDisplayType(propertyType, filterConditionType);
    this.dataConditionData[index].value.display = displayType;
  }

  /**
   * 校验时间格式
   */
  checkDate(value:any){
    const { index, val } = value;
    if (!val) {
      value.rrMsg = '';
      return;
    };
    const regArr = [/^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})$/, /^(\d{4}-\d{2})$/,
                     /^(\d{4}-\d{2}-\d{2})$/,
                     /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2})$/];
    let isDateOk:boolean = true;
    const regResultArr:Array<boolean> = [];
    for (let i = 0; i < regArr.length; i++) {
      const b:boolean = regArr[i].test(val) as boolean;
      regResultArr.push(b);
    }

    isDateOk = regResultArr.some((item:boolean) => item);

    if (!isDateOk) {
      value.errMsg = `输入格式错误，示例：<br/>
      2019-05-10 08:00:00 <br/>
      2019-05-10 08:00 <br/>
      2019-05-10 <br/>
      2019-05`;
    } else {
      // 判断是否是合法时间
      const str:string = new Date(val).toString();
      if (str === 'Invalid Date') {
        isDateOk = false;
        value.errMsg = `输入格式错误，示例：<br/>
        2019-05-10 08:00:00 <br/>
        2019-05-10 08:00 <br/>
        2019-05-10 <br/>
        2019-05`;
      } else {
        isDateOk = true;
        value.errMsg = '';
      }
    }
  }

  onClose(){
    this.isShowAlert = false;
  }

  mounted() {
    const { bizSchemaCode } = this.$route.params;
    this.setBizSchemaCode(bizSchemaCode);
    this.getBizmodeltitle().then(async (res: any) => {
      this.bizModelName = res.data;
      await this.getTriggerObjLists();
      this.isShowModelTree = true;
      this.dataBackWriting();
    });

    this.setAllRuleTypes();
    this.dataConditionColumns = dataRuleMap.dataConditionColumns;
    this.filterColumns = dataRuleMap.filterColumns;
    this.dataActionColumns = dataRuleMap.dataActionColumns;
  }


  beforeDestroy() {
    DataCache.clearCache();
  }


  @Watch('isShowDataRuler')
  onIsShowDataRulerChange(v:boolean) { // 打开抽屉就加载最新的数据项
    if (v) {
      this.getTriggerObjLists();
    }
  }
}