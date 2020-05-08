import catApi from '@/apis/biz-service/category.api';

const state = {
  categories: [],
}

const mutations = {
  setCategories(state: any, payload: BizService.Category.Item[]) {
    state.categories = payload
  },
  deleteItem(state: any, payload: BizService.Category.Item){
    state.categories = state.categories.filter((item: BizService.Category.Item) => item.id !== payload.id)
  }
}

const actions = {
  getCategories({ commit }: any) {
    return catApi.listCategory().then((res: Common.Res<BizService.Category.Item[]>) => {
      if (!res.errcode && res.data) {
        commit('setCategories', res.data)
      }
    })
  },
  createCategory({ dispatch }: any, item: BizService.Category.CreateParams) {
    return catApi.createCategory(item).then(async (res: any) => {
      if (!res.errcode) {
        await dispatch('getCategories');
      }
      return res;
    })
  },
  updateCategory({ dispatch }: any, item: BizService.Category.UpdateParams) {
    return catApi.updateCategory(item).then((res: any) => {
      if (!res.errcode) {
        dispatch('getCategories');
      }
      return res;
    })
  },
  deleteCategory({ commit }: any, item: BizService.Category.Item) {
    return catApi.deleteCategory(item).then((res: any) => {
      if (!res.errcode) {
        commit('deleteItem', item)
      }
      return res
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}