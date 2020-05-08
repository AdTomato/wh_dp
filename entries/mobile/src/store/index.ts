import Vue from 'vue';
import Vuex from 'vuex';

import circulate from '@cloudpivot/flow-center/src/components/mobile/store/circulate';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    circulate
  },
  state: {
    userinfo: {
      id: '',
      name: '',
      username: '',
    },
    appCode: '',
    hasControlOpen: false,
    config: {}
  },
  mutations: {
    setUserinfo(state: any, payload: OAuth.Userinfo) {
      state.userinfo = payload;
    },
    setAppCode(state: any, appCode: string) {
      state.appCode = appCode;
    },
    setControlOpenStatus(state: any, status: boolean) {
      state.hasControlOpen = status;
    },
    setConfig(state: any, config:any){
      state.config = config;
    }
  },
  actions: {
  },
});
