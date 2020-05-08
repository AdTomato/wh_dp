import { workflowCenterApi, workflowCenter as workflowCenterParams }  from '@cloudpivot/api';
import * as utils  from '@cloudpivot/common/src/utils/pc/utils';

const state:any = {
  wd: '', // 发起流程搜索关键字
  asideTitle: '', // 侧边栏的title, 只有当前应用中心的路由下才会去设置
  asideTitleI18n: {}, // 侧边栏的国际化
  applicationPageTitle: '', // 应用中心页面title
  unFinishedListCount: 0, // 待办数据条数
  unReadListCount: 0, // 待阅数据条数
  userId: '' // 用来获取当前用户的id
};

const mutations = {
  // 设置侧边栏title
  setAsideTitle(state: any, app:any) {
    if (!app || !app.name) return;
    state.asideTitle = app.name;
    state.asideTitleI18n = app.name_i18n;
  },

  // 设置应用中心页面title
  setApplicationPageTitle(state: any, title:string) {
    if (!title) return;
    state.applicationPageTitle = title;
  },

  // 设置待办待阅消息条数
  setListCoutnt(state:any, counts:any) {
    if (!counts) return;
    state.unFinishedListCount = counts.workItemCount;
    state.unReadListCount = counts.circulateItemCount;
  },

  // 设置用户id
  setUserId(state:any, id:string) {
    if (id) {
      state.userId = id;
    }
  }
};

const actions = {
  // 获取待办待阅列表条数
  async getWorkCount({ commit }:any) {
    const res = await workflowCenterApi.getWorkCount();
    if (res.errcode === 0) {
      commit('setListCoutnt', res.data);
    }
  },

  // 删除常用意见请求
  // async deleteComment({ commit }:any, params:workflowCenterParams.CommentParams) {
  //   const res = await workflowCenterApi.deleteComment(params);
  //   return res;
  // }

};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
