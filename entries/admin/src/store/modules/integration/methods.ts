import methodApi from '@/apis/biz-service/method.api';

const state = {
  locationTypes: [],
  paramTypes: [],
  httpTypes: [],
  requestBodyTypes: [],
}

const mutations = {
  setLocationTypes(state: any, payload: any) {
    state.locationTypes = payload.filter((item: any) => item.index === '0' || item.index === '3' ).map((item: any) => ({
      label: item.name,
      value: +item.index
    }));
  },
  setParamTypes(state: any, payload: any) {
    state.paramTypes = payload.map((item: any) => ({
      label: item.name,
      value: +item.index
    }));
  },
  setHttpTypes(state: any, payload: any) {
    state.httpTypes = payload.http.map((item: any) => ({
      label: item.name,
      value: +item.index
    }));
    state.requestBodyTypes = payload.requestbody.map((item: any) => ({
      label: item.name,
      value: +item.index
    }));
  },
}

const actions = {
  getTypes({ commit }: any) {
    Promise.all([
      methodApi.listLocationType(),
      methodApi.listParamType(),
      methodApi.listHttpType()
    ]).then(([locations, params, requests]) => {
      commit('setLocationTypes', locations.data);
      commit('setParamTypes', params.data);
      commit('setHttpTypes', requests.data);
    })
  },
  getMethods({ }: any, params: BizService.Method.ListByCodeParams) {
    return methodApi.listMethodsByCode(params)
  },
  createMethod({ }: any, params: BizService.Method.CreateParams) {
    return methodApi.createMethod(params)
  },
  updateMethod({ }: any, params: BizService.Method.UpdateParams) {
    return methodApi.updateMethod(params);
  },
  deleteMethod({ }: any, params: BizService.Method.DeleteParams) {
    return methodApi.deleteMethod(params);
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}