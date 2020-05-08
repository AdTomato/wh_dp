import serviceApi from '@/apis/biz-service/service.api';
const state = {
  categoryId: '',
  isLoading: false,
  wd: '',
  services: [],
  list: [],
  adapters: [],
}
const mutations = {
  setCategory(state: any, payload: string) {
    state.categoryId = payload;
  },
  setServices(state: any, payload: BizService.Service.Item[]) {
    state.services = payload;
  },
  setLoading(state: any, payload: boolean) {
    state.isLoading = payload;
  },
  filterServices(state: any, payload: string) {
    state.wd = payload;
    if (payload) {
      state.list = state.services.filter((item: BizService.Service.Item) => new RegExp(state.wd).test(item.name) || new RegExp(state.wd).test(item.code));
    } else {
      state.list = state.services;
    }
    state.list.forEach((item: any, index: number) => {
      item.index = index + 1;
    })
  },
  setAdapters(state: any, payload: BizService.AdapterConfig[]) {
    state.adapters = payload;
  }
}
const actions = {
  getAdapters({ commit }: any) {
    serviceApi.getAdapterConfigs().then((res: any) => {
      if (!res.errcode && res.data) {
        const adapters: BizService.AdapterConfig[] = JSON.parse(res.data);
        commit('setAdapters', adapters);
      }
    })
  },
  getServiceList({ commit }: any, categoryId: string) {
    commit('setLoading', true);
    commit('setCategory', categoryId);
    serviceApi.listServicesById({ categoryId }).then((res: Common.Res<BizService.Service.Item[]>) => {
      if (!res.errcode) {
        commit('setServices', res.data);
        commit('filterServices', '');
        commit('setLoading', false);
      }
    })
  },
  createService({ dispatch }: any, params: BizService.Service.CreateParams) {
    return serviceApi.createService(params).then((res: any) => {
      if (!res.errcode) {
        dispatch('getServiceList', params.serviceCategoryId);
      }
      return res;
    })
  },
  updateService({ dispatch }: any, params: BizService.Service.UpdateParams) {
    return serviceApi.updateService(params).then((res: any) => {
      if (!res.errcode) {
        dispatch('getServiceList', params.serviceCategoryId);
      }
      return res;
    })
  },
  deleteService({ commit, state }: any, params: BizService.Service.DeleteParams) {
    serviceApi.deleteService(params).then((res: any) => {
      if (!res.errcode) {
        const list: BizService.Service.Item[] = state.services.filter((item: BizService.Service.Item) => item.id !== params.id)
        commit('setServices', list);
        commit('filterServices', state.wd);
      }
      return res;
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
