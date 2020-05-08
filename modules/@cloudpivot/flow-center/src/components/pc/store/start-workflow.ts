import { workflowCenterApi, workflowCenter as workflowCenterParams }  from '@cloudpivot/api';
import * as utils  from '@cloudpivot/common/src/utils/pc/utils';
const state = {
  favoriteList: [], // 常用流程列表数据
  searchTotal: 0, // 发起流程搜索总条数
  isShowSearchNoData: false, // 暂无搜索结果（发起流程）
  isShowSearchResult: false, // 是否展示搜索结果（发起流程）
  itemList: [], // 发起流程列表数据
  searchList: [], // 发起流程根据流程名称搜索数据
}

/**
 * 处理形如 '{"en":"appName"} | {"en":"bizName"}'的字符串
 * @return {en: "appName | bizName"}
 * @todo 拓展多个语言，只需要循环执行此方法
 */
function name_i18nHandler(name:string){
  const nameI18nStr:string = name.replace(/\s+/g,'') as string; // '{"en":"应用名称"}|{"en":"模型名称"}'
  let name_i18n_tem:any = {};    
  let nameI18nKey:string = '';
  if(nameI18nStr.indexOf('|') <= -1) { // 只有应用，则直接解析
    try{
      name_i18n_tem = JSON.parse(nameI18nStr);
    } catch(e) {
      if (e) {
        throw 'Error Json';
      }
    }
  } else { // 既有应用也有模型
    const temArr:Array<any> = [];
    nameI18nStr.split('|').forEach((jsonStr:string) => {
      try {
        const obj = JSON.parse(jsonStr);
        const locale:string = Object.keys(obj)[0];
        nameI18nKey = locale;
        temArr.push(obj[locale]);
      } catch(e) {
        if (e) {
          throw 'Error Json';
        }
      }
    })
    Object.assign(name_i18n_tem, {
      [nameI18nKey]: temArr.join(' | ')
    });
  }
      
  return name_i18n_tem;
}

const mutations = {
  // 设置常用流程列表
  setFavoriteList(state: any, data: any) {
    data.forEach((item:any) => {
      item = utils.compatible(item, 'name');
    })
    state.favoriteList = data;
  },

  // 设置发起流程列表
  setItemList(state: any, data: any) {
    data.forEach((item:any) => {
      item = utils.compatible(item, 'appName');
      item.dataList.forEach((innerItem:any) => {
        innerItem = utils.compatible(innerItem, 'name');
      })
    })
    state.itemList = data;
    state.isShowSearchResult = false;
    if (state.itemList && state.itemList.length) {
      state.isShowSearchNoData = false;
    } else {
      state.isShowSearchNoData = true;
    }
  },

  // 设置发起流程根据流程名称搜索的流程列表
  setSearchList(state: any, data: any) {
    const locale:string = window.localStorage.getItem('locale') as string;
    if(!data.appList || data.appList.length <= 0)  data.appList = [];
    data.appList.forEach((item:any) => {
      // 解析name_i18n字段
      item.name_i18n = name_i18nHandler(item.name_i18n);
      
      item.dataList.forEach((innerItem:any) => {
        innerItem = utils.compatible(innerItem, 'name');
      })
    });
    state.searchList = data.appList;
    state.searchTotal = data.size ? data.size : 0;
    state.isShowSearchResult = true;
    if (state.searchList && state.searchList.length) {
      state.searchList.forEach((item:any) => {
        if(locale === 'zh') {
          item.appName = utils.searchHighLight(state.wd, item.appName);
        } else {
          item.name_i18n[locale] = utils.searchHighLight(state.wd, item.name_i18n[locale]);
        }
        
        if (item.dataList && item.dataList.length) {
          item.dataList.forEach((list:any) => {
            if(locale === 'zh') {
              list.name = utils.searchHighLight(state.wd, list.name);
            } else {
              list.name_i18n[locale] = utils.searchHighLight(state.wd, list.name_i18n[locale]);
            }
          });
        }
      });
    }
    if (state.searchList && state.searchList.length) {
      state.isShowSearchNoData = false;
    } else {
      state.isShowSearchNoData = true;
    }
  },
}

const actions = {
  // 请求常用流程列表数据
  async getFavoriteWorkflowList({ commit, state }: any) {
    const res = await workflowCenterApi.getFavoriteWorkflowList();
    if (!res.errcode) {
      commit('setFavoriteList', res.data);
    }
    return res;
  },
  
  // 请求发起流程列表数据
  async getWorkflowList({ commit, state }: any) {
    const res = await workflowCenterApi.getMyWorkflowList(false);
    if (!res.errcode) {
      commit('setItemList', res.data);
    }
    return res;
  },

  // 根据流程名称查询可发起的流程
  async searchMyWorkflowList({ commit, state }: any, params:workflowCenterParams.SearchWorkflowParams) {
    state.wd = params.workflowName;
    const res = await workflowCenterApi.searchMyWorkflowList(params);
    if (!res.errcode) {
      commit('setSearchList', res.data);
    }
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
};