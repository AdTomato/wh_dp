/* 
* 系统公共store
*/
const state:any = {
  isAdmin: false, //是否有登陆后台的权限
  admin: false, //是否为系统管理员
};

const mutations = {
  // 设置登陆后台的权限
  setIsAdmin(state: any, params: any) {
    state.isAdmin = params;
  },
  // 设置是否为系统管理员
  setAdmin(state: any, params: any) {
    state.admin = params;
  }
};

const actions = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
