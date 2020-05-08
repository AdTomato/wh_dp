import AppItem from '@/apis/apps';
import WorkflowApi from '@/apis/workflow';
import Axios from 'axios';

const state: Apps.AppItem.State = {
  appMenu: [],
  appMenuLoaded: false,
  appInfo: {
    appCode: ''
  },
  floders: [],
  openKeys: [],
  menuId: '',
};

const mutations = {
  setAppItem(state: any, data: Array<Apps.AppItem.AppMenu>) {
    if (data.length) {
      state.appMenu = data;
    } else {
      state.appMenu = [];
    }
    state.appMenuLoaded = true;
  },
  setAppCode(state: any, params: Apps.AppItem.ItemTree) {
    state.appInfo = params;
  },
  setFolders(state: any, data: Array<Apps.AppItem.AppMenu>) {
    state.floders = data;
  },
  setMenuId(state: any, id: string) {
    state.menuId = id;
  }
};

const actions = {
  async getAppItem({ commit }: any, params: Apps.AppItem.ItemTree) {
    state.appMenuLoaded = false;
    const res = await AppItem.getAppItem(params);
    commit('setAppItem', res.data);
  },
  async addFolders({ dispatch }: any, params: Apps.AppItem.AddFolders) {
    // 新增目录
    const res = await AppItem.addAppFolder(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    }
  },
  async updateFolders({ dispatch }: any, params: Apps.AppItem.UpdateFolders) {
    // 修改目录
    const res = await AppItem.updateAppFolder(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    }
  },
  async deleteFolders({ dispatch }: any, params: Apps.AppItem.DeleteFolders) {
    // 删除目录
    const res = await AppItem.deleteAppFolder(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    }
  },
  async validFolders({ dispatch }: any, params: Apps.AppItem.ValidFolder) {
    // 校验目录节点下是否存在业务模型
    return AppItem.validFolder(params);
  },
  async addBizModel({ dispatch }: any, params: Apps.AppItem.AddBizModel) {
    // 新增业务模型
    return AppItem.addAppModel(params);
    // if (!res.errcode) {
    //   await dispatch('getAppItem', state.appInfo);
    // }
  },
  async updateBizModel({ dispatch }: any, params: Apps.AppItem.UpdateBizModel) {
    // 更改业务模型
    const res = await AppItem.updateAppModel(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    }
  },
  async deleteBizModel({ dispatch }: any, params: Apps.AppItem.DeleteBizModel) {
    // 删除业务模型
    const res = await AppItem.deleteAppModel(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    } else {
      return Promise.reject(res);
    }
  },
  async addReport({ dispatch }: any, params: Apps.AppItem.AddReport) {
    return AppItem.addAppReport(params);
  },
  async updateReport({ dispatch }: any, params: Apps.AppItem.UpdateReport) {
    const res = await AppItem.updateAppReport(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    }
    return res;
  },
  async deleteReport({ dispatch }: any, params: Apps.AppItem.DeleteReport) {
    const res = await AppItem.deleteAppReport(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    } else {
      return Promise.reject(res);
    }
    return res;
  },
  async validBizModel({ dispatch }: any, params: Apps.AppItem.ValidBizModel) {
    // 校验业务模型节点下是否存在业务数据
    return AppItem.validBizModel(params);
  },
  async getFolders({ commit }: any, params: Apps.AppItem.ItemTree) {
    // 加载当前应用下的目录
    const res = await AppItem.getFolders(params);
    commit('setFolders', res.data);
  },
  async appItemTreeSort({ dispatch }: any, params: Apps.AppItem.AppItemSortParams) {
    // 更新应用的树结构节点的排序
    const res = await AppItem.appItemSort(params);
    if (!res.errcode) {
      await dispatch('getAppItem', state.appInfo);
    }
  },
  // 新建列表
  async createWorkflow({ dispatch }: any, params: Apps.Workflow.CreateWorkflowParams) {
    const res = await WorkflowApi.createWorkflow(params);
    return res;
  },

  // 获取列表
  async getWorkflowList({ dispatch }: any, params: Apps.Workflow.WorkflowSchemaCode) {
    const res = await WorkflowApi.getWorkflowList(params);
    return res;
  },

  // 获取流程详细
  async getWorkflowDetail({ dispatch }: any, params: Apps.Workflow.WorkflowSchemaCode) {
    const res = await WorkflowApi.getWorkflowDetails(params);
    return res;
  },

  // 更新流程
  async updateWorkflow({ dispatch }: any, params: Apps.Workflow.CreateWorkflowParams) {
    const res = await WorkflowApi.updateWorkflow(params);
    return res;
  },

  // 删除流程
  async deleteWorkflow({ dispatch }: any, params: Apps.Workflow.WorkflowCode) {
    const res = await WorkflowApi.deleteWorkflow(params);
    return res;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
