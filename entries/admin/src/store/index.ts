import Vue from 'vue';
import Vuex from 'vuex';
import Organization from './modules/organization/index';
import Apps from './modules/app/index';
import System from './modules/system'
import Print from './modules/print'
const zh_CN = require('h3-antd-vue/lib/locale-provider/zh_CN');
const en_US = require('h3-antd-vue/lib/locale-provider/en_US');
import Integration from './modules/integration'
import systemSettingApi from '@/apis/system/system-manager.api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    locale: 'zh',
    systemUnsetCount: 0,
    // showSysSettingCount: false,
    config: {}
  },
  getters: {
    getAntLocale: (state: any) => {
      return state.locale === 'zh' ? zh_CN : en_US;
    }
  },
  mutations: {
    setLocale(state: any, language: string) {
      state.locale = language;
    },
    setSystemSetCount(state: any, count: number) {
      // 后端实际统计的已改为3项：钉钉基础+门户扫码+文件存储，不检查增量回调地址，后端返回的最大数字是3
      const unsetCount: number = Math.max(3 - count, 0);
      // 前端显示的未设置的系统配置项数量应该为最大3，最小0
      state.systemUnsetCount = Math.min(unsetCount, 3);
      // state.showSysSettingCount = !!unsetCount;
    },
    setConfig(state: any, config: any) {
      state.config = config;
    }
  },
  actions: {
    async getConfigCount({ commit, state }: any) {
      const res = await systemSettingApi.getConfigCount();
      commit('setSystemSetCount', res.data);
    }
  },
  namespace: true,
  modules: {
    Organization,
    Apps,
    System,
    Integration,
    Print
  }
} as any);
