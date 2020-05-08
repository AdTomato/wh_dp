
import { ActionContext } from 'vuex';

import appsApi from '@/apis/apps';

import { DataItem } from '../typings/data-item';
import { DataItemType } from '../typings';


export interface DataItemState extends DataItem {

  used: boolean

}


export interface StateType {

  items: Array<DataItemState>

}


const mutations = {

  setState(state: StateType, items: DataItemState[]) {
    if (items) {
      state.items = items;
    }
  },

  switchUsed(state: StateType, payload: {
    code: string,
    subCode?: string
  }) {
    const item = state.items.find(x => x.code === payload.code);
    if (!item) {
      return;
    }

    if (payload.subCode && item.properties) {
      const subItem = item.properties.find(x => x.code === payload.subCode) as DataItemState;
      if (subItem) {
        subItem.used = !subItem.used;
      }
    } else {
      item.used = !item.used;
    }
  },
  
  setUsed(state: StateType, payload: {
    used : boolean,
    code: string,
    subCode?: string
  }) {
    const item = state.items.find(x => x.code === payload.code);
    if (!item) {
      return;
    }

    if (payload.subCode && item.properties) {
      const subItem = item.properties.find(x => x.code === payload.subCode) as DataItemState;
      if (subItem) {
        subItem.used = payload.used;
      }
    } else {
      item.used = payload.used;
    }
  },

  deleteItem(state: StateType, payload: {
    code: string,
    subCode?: string
  }) {
    const idx = state.items.findIndex(x => x.code === payload.code);
    if (idx === -1) {
      return;
    }

    const item = state.items[idx];

    if (payload.subCode && item.properties) {
      const i = item.properties.findIndex(x => x.code === payload.subCode);
      if (i > -1) {
        item.properties.splice(i, 1);
      }
    } else {
      state.items.splice(idx, 1);
    }
  },

  addItem(state: StateType, item: DataItemState) {
    if (item.parentCode) {
      const idx = state.items.findIndex(x => x.code === item.parentCode);
      if (idx > -1) {
        if (state.items[idx].properties) {
          (state.items[idx].properties as any).push(item);
        } else {
          state.items[idx].properties = [item];
        }
      }
    } else {
      if (state.items.findIndex(x => x.code === item.code) === -1) {
        state.items.push(item);
      }
    }
  }

};


const actions = {

  load(context: ActionContext<StateType, any>, schemaCode: string) {

    const convert = (x: any) => {
      const item: DataItemState = {
        id: x.id,
        code: x.code,
        name: x.name,
        type: x.propertyType,
        isSystem: x.defaultProperty,
        published: x.published,
        used: false,
        defaultValue: x.defaultValue,
        propertyIndex : x.propertyIndex,
        propertyEmpty : x.propertyEmpty,
        schemaCode : x.schemaCode,
        relativeCode : x.relativeCode,
        relativeName : x.relativeName,
        appPackageCode : x.appPackageCode,
        appFunctionCode: x.appFunctionCode,
        name_i18n: x.name_i18n
      };

      if (x.subSchema && x.subSchema.properties) {
        item.properties = x.subSchema.properties
          .filter((p: any) => !p.defaultProperty).map(convert);

        if (item.properties) {
          item.properties.forEach(p => p.parentCode = item.code);
        }
      }

      return item;
    };

    return appsApi.getDataItemList({
      schemaCode: schemaCode
    }).then(res => {

      if (res.errcode !== 0) {
        return Promise.reject(res);
      }

      const items = res.data.filter((x:any) => x.type !== DataItemType.ApprovalOpinion).map(convert);

      context.commit('setState', items);
      return Promise.resolve(res);
    });

  },

  deleteUnPublish(context: ActionContext<StateType, any>, payload: {
    schemaCode: string,
    code: string,
    subCode?: string
  }) {

    const item = context.state.items.find(x => x.code === payload.code);
    if (item && item.published) {
      return;
    }

    return appsApi.deleteDataItem({
      bizSchemaCode: payload.schemaCode,
      bizPropertyCode: payload.code
    }).then(res => {
      context.commit('deleteItem', payload);
      return res;
    });

  }

};


export default {
  namespaced: true,

  state: {
    items: []
  },

  getters: {

    groupBy: (state: StateType) => (isSystem: boolean) => state.items.filter(x => x.isSystem === isSystem),

    notUsed: (state: StateType, getters: any) => (c: string) => getters.groupBy(c).filter((x: any) => !x.used)

  },

  mutations: mutations,

  actions: actions

}
