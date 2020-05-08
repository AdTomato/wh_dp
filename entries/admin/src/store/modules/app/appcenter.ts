import AppCenterApi from '@/apis/apps';
import appBaseApi from '@/apis/app-settings/base.api';


const state: Apps.AppCenter.State = {
  appList: [],
  appInfo: {
    name: '',
    code: ''
  }
};

const mutations = {
  setAppList(state: any, data: Array<Apps.AppCenter.AppInfo>) {
    state.appList = data;
  },
  setAppDetail(state: any, data: Apps.AppCenter.AppInfo) {
    state.appInfo = data;
  }
};

const actions = {
  /**
   * 获取应用列表
   */
  async getAppList({ commit }: any) {
    const res:any = await AppCenterApi.getAppList();
    if (res.errcode === 0) {
      commit('setAppList', res.data);
    }
  },

  /**
   * 添加应用
   * @param params 
   */
  async addAppPackage({ dispatch }: any, params: Apps.AppCenter.AppInfo) {
    const res = await AppCenterApi.addAppPackage(params);
    if (res.errcode === 0) {
      await dispatch('getAppList');
    } else {
      return Promise.reject(res);
    }
  },

  /**
   * 检查应用下是否有模型
   * @param params 
   */
  async checkIfHasModel({ dispatch }: any, params: Apps.AppCenter.AppInfoParams) {
    return AppCenterApi.checkIfHasModel(params);
  },

  /**
   * 删除应用
   * @param params 
   */
  async popAppPackage({ dispatch }: any, params: Apps.AppCenter.AppInfoParams) {
    const res = await AppCenterApi.deleteAppPackage(params);
    if (res.errcode === 0) {
      await dispatch('getAppList');
    }
  },

  /**
   * 应用排序
   * @param params 
   */
  async updateAppSort({ dispatch }: any, params: Apps.AppCenter.AppSortParams) {
    const res = await AppCenterApi.updateAppSort(params);
    if (res.errcode === 0) {
      await dispatch('getAppList');
    }
  },

  /**
   * 获取单个应用的详情
   * @param params 
   */
  async getAppDetail({ commit, state }: any, params: Apps.AppCenter.AppInfoParams) {
    if (state.appInfo.code === params.appCode) {
      return;
    }
    const res = await AppCenterApi.getAppDetail(params);
    if (res.data) {
      commit('setAppDetail', res.data);
    }
  },

  /**
   * 更新应用
   * @param params 
   */
  async updateAppPackage({ state, commit }: any, params: Apps.AppCenter.AppInfo) {
    const res: Apps.AppCenter.AppInfo = {
      ...state.appInfo, 
      ...params
    };
    const response: Common.Data = await appBaseApi.updatePackage(res);
    if (!response.errcode) {
      Object.assign(state.appInfo, params);
      commit('setAppDetail', res);
    }
    return response;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
