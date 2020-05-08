import * as OrgApi from '@/apis/organization';

const state:any = {
  loginedUserInfo: {},
  isAdmin: true, // 是否有登录后台权限(应用管理员或系统管理员)
  isOnlyAppAdmin: true, // 是否只是应用管理员，不是系统管理员
  menuShowStatus: false,  // 系统设置的显示状态
}

const mutations = {
  setLoginedUserInfo(state:any, data:any){
    if(!data) return;
    state.loginedUserInfo = data;
  },
  setOnlyAppAdmin(state:any, val:boolean) {
    state.isOnlyAppAdmin = val;
  },
  setIsAdmin(state:any, val:boolean) {
    state.isAdmin = val;
  },
    // 改变状态
  setMenuStatus(state:any, payload:boolean) {
      state.menuShowStatus = payload;
  }
}

const actions = {
   // 获取当前用户信息
   async getUserInfo({ commit }:any) {
    const res = await OrgApi.getUserInfoLogin();
    if (res.errcode === 0) {
      commit('setLoginedUserInfo', res.data);
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}