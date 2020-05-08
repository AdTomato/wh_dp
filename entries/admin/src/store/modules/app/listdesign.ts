// import AppCenterApi from '@/apis/apps';
import * as formApi from '@/apis/form/index';
import workFlowApi from '@/apis/workflow';
import * as listApi from '@/apis/list/list.api';

import * as H3List from '@cloudpivot/h3-list';

const state: Apps.ListDesign.AsideInfo = {
  index: -1, // 索引
  thefieldBlock: -1,
  operationAarry: [],
  showFieldArray: [],
  sortArray: [],
  ChangeFlag: false,
  saveFlag: false, // 是否按下保存
  payloadOptions: [],
  queryActiBtn: [],
  edit: false,
  name: '',
  backupsName: '',
  name_i18n: '',
  formList: [],
  workflowList: [],
  clientType: H3List.schema.ClientTypes.PC,
  presentationType: H3List.schema.QueryPresentationTypes.LIST,
  isShowPop: false,
  filterTipsFlag: false,
  isPublish: false,
  saveCompleted: false,
};

const mutations = {

  nameChange(state: any,data:any) {
    const localeList:Array<string> = ['en']; // 语言列表
    state.name = data.name;
    if (data.isupdate) {
      state.backupsName =  data.name;
    }
    localeList.forEach((local:string) => {
      if (!data.name_i18n) {
        data.name_i18n = {};
        data.name_i18n[local] = data.name || '';
      } else if (data.name_i18n[local] === '') {
        data.name_i18n[local] = data.name || '';
      }
    });
    state.name_i18n = data.name_i18n;
  },
  onEdit(state: any, edit:boolean) {
    state.edit = edit;
  },
  setPayloadOptions(state: any, mutationData: any) {
    if (state.filterTipsFlag && mutationData.length) {
      state.isShowPop = true;
    } else {
      state.isShowPop = false;
    }
    state.payloadOptions = mutationData;
    state.ChangeFlag = !state.ChangeFlag;
  },
  setFilterTipsFlag(state: any, show: boolean) {
    state.filterTipsFlag = show;
  },
  setFieldBlock(state: any, mutationData: number) {
    state.thefieldBlock = mutationData;
  },
  queryChange(state: any, mutationData: object) {
    state.ChangeFlag = !state.ChangeFlag;
  },
  // 列表操作--按钮
  setOperationArray(state: any, mutationData: any) {
    state.operationAarry = [...mutationData];
  },
  // 展示字段
  setShowFieldArray(state: any, mutationData: any) {
    state.showFieldArray = [...mutationData];
  },
  // 排序字段
  setSortArray(state: any, mutationData: any) {
    state.sortArray = [...mutationData];
  },
  // 顶部-保存
  setSaveFlage(state: any, mutationData: any) {
    //
    state.saveFlag = mutationData;
  },
  setQueryAction(state: any, mutationData: any) {
    state.queryActiBtn = mutationData;
  },
  setFormList(state: Apps.ListDesign.AsideInfo, data:any) {
    if (!data) return;
    state.formList = data;
  },
  setWorkflowList(state: Apps.ListDesign.AsideInfo, data:any) {
    if(!data) return;
    state.workflowList = data;
  },
  setClientType(state: Apps.ListDesign.AsideInfo, type:string) {
    state.clientType = type;
  },
  setPresentationType(state: Apps.ListDesign.AsideInfo, type: H3List.schema.QueryPresentationTypes) {
    state.presentationType = type;
  },
  setShowPop(state: Apps.ListDesign.AsideInfo, show:boolean) {
    state.isShowPop = show;
  },
  setListTitle(state: Apps.ListDesign.AsideInfo, publish:boolean) {
    state.isPublish = publish;
  },
  setSaveCompleted(state: Apps.ListDesign.AsideInfo, completed:any) {
    state.saveCompleted = completed;
  }
};

const actions = {
  // /* 获取单个应用的详情 */
  // async getAppDetail({ commit }:any, params: Apps.AppCenter.AppInfoParams) {
  //   const res = await AppCenterApi.getAppDetail(params);
  //   if (res.data) {
  //     commit('setAppDetail', res.data);
  //   }
  // }

  // 获取当前列表头部信息
  async getListTitle({ commit }: any, params:any) {
    listApi.get(params.schemaCode, params.listCode).then((res:any) => {
      const publish = res.data.publish;
      commit('setListTitle', publish);
      if (res.data.name_i18n) {
        res.data.name_i18n = JSON.parse(res.data.name_i18n);
      }
      commit('nameChange', { name: res.data.name, isupdate: true, name_i18n: res.data.name_i18n });
    });
  },

  // 获取关联表单列表
  async gerFormList({ commit }: any, schemaCode:string) {
    formApi.list(schemaCode).then((res:any) => {
      const formList:any = res.data.filter((item:any) => (!!item.published));
      commit('setFormList', formList)
    });
  },

  // 获取关联流程列表
  async getWorkflowList({ commit }: any, schemaCode:string) {
    const params:Apps.Workflow.WorkflowSchemaCode = {
      schemaCode
    };
    workFlowApi.getWorkflowList(params).then((res:any) => {
      if (res.data) {
        const workflowList:any = res.data.filter((item:any) => (!!item.published));
        commit('setWorkflowList', workflowList)
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
