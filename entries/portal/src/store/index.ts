import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import System from './modules/system/index';
import WorkflowCenter from './modules/workflow-center/index';


const vuexLocal = new VuexPersistence({
  key: 'vuex',
  storage: localStorage,
  reducer: (state: any) => (
    {
      appCode: state.appCode
    })
});

Vue.use(Vuex);

export default new Vuex.Store({
  namespace: true,
  state: {
    appCode: '', // 单应用appCode,
    config: {}
  },
  mutations: {
    setAppCode(state: any, appCode: string) {
      state.appCode = appCode;
    },
    setConfig(state: any, config: string) {
      state.config = config;
    },
  },
  modules: {
    WorkflowCenter,
    System
  },
  plugins: [vuexLocal.plugin]
} as any);
