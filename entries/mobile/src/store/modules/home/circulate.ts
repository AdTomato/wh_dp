/*
 * @Author: nooldey <nooldey@gmail.com>
 * @Date: 2019-01-13 15:55:56
 * @Last Modified by: nooldey
 * @Last Modified time: 2019-01-29 20:23:46
 */

import { homeApi } from '@cloudpivot/api';

const state:any = {
  checkedIds: [],
  checkAll: false,
  showCheckbox: false,
  totalItem: {
    workitems: 0,
    circulates: 0
  }
};

const mutations:any = {
  /**
   * 重置勾选状态数据
   */
  resetCheckState(state: any) {
    state.checkAll = false;
    state.checkedIds = [];
    state.showCheckbox = false;
  },
  /**
   * 设置已选中的待阅条目
   * @param payload
   */
  setCheckedIds(state:any, payload: string[]) {
    state.checkedIds = payload;
  },
  /**
   * 切换全选待阅
   */
  toggleCheckAll(state:any) {
    if (state.checkAll) {
      state.checkAll = false;
      state.checkedIds = [];
    } else {
      state.checkAll = true;
    }
  },
  /**
   * 切换待阅条目勾选框显隐
   */
  toggleShowCheckbox(state: any) {
    state.showCheckbox = !state.showCheckbox;
  },
  /**
   * 设置标签栏总条数
   * @param totalItem
   */
  setTotalItem(state:any, totalItem:any) {
    if (/^\d+$/.test(totalItem.workitem)) {
      state.totalItem.workitems = totalItem.workitem;
    }
    if (/^\d+$/.test(totalItem.circulate)) {
      state.totalItem.circulates = totalItem.circulate;
    }
  }
};
const actions:any = {
  /**
   * 切换了单个待阅条目的勾选状态
   * @param circulateId
   */
  checkItem({ state, commit }:any, circulateId: string) {
    let resultIds: string[] = state.checkedIds;
    if (resultIds.includes(circulateId)) {
      resultIds = resultIds.filter((id:string) => id !== circulateId);
    } else {
      resultIds.push(circulateId);
    }
    commit('setCheckedIds', resultIds);
  },
  /**
   * 获取待办待阅总数
   * @param appCode
   */
  getTotalCount({ commit }:any, appCode: string) {
    homeApi.getWorkCount(appCode).then((res: Common.Data) => {
      if (res.data) {
        commit('setTotalItem', {
          workitem: res.data.workItemCount,
          circulate: res.data.circulateItemCount
        });
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
