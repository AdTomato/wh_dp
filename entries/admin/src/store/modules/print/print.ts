const state: any = {
  isOver: false,
  pages: [],
  itemAttrs: {},
  xywh: {},
  activeLeft: '1',
  leftOrRight: 'left',
  toLeft: 0,
  toTop: 0,
  bizSysData: [],
  isFocus: false,
  copyData: '',
  pageSettings: {}
};

const mutations = {
  setPageSettingData(state: any, data: any) {
    state.pageSettings = data;
    // 防止store丢失
    sessionStorage.setItem(`printStore${data.code}`, JSON.stringify(state.pageSettings));
  },
  setIsOver(state: any, bool: Boolean) {
    state.isOver = bool;
  },
  assignAllData(state: any, data: any[]) {
    if (!data) return;

    if (data.length > 0 && !Array.isArray(data[0])) {
      data = [data];
    }
    state.pages = data;
  },
  addOneEle(state: any, payload: {
    oneEle: any,
    page: number
  }) {
    state.pages[payload.page].push(payload.oneEle);
  },
  delOneEle(state: any, payload: { id: string, page: number }) {
    // state.pages[payload.page] = state.pages[payload.page].filter(
    //   // @ts-ignore
    //   (item: object) => item.id !== payload.id
    // );
    // const page = state.pages[payload.page];
    for (const page of state.pages) {
      const idx = page.findIndex((item: any) => item.id === payload.id);
      if (idx > -1) {
        page.splice(idx, 1);
        break;
        // state.pages.splice(payload.page, 1, page);
      }
    }
  },
  setCopyData(state: any, json: string) {
    state.copyData = json;
  },
  setAttrs(state: any, res: any) {
    if (!Object.keys(res).length) {
      state.itemAttrs = {};
      return;
    }
    // @ts-ignore
    let widthValue = res.widthValue;

    if (!res.parentId && res.eleType) {
      // @ts-ignore
      if (res.eleType.includes('column')) {
        // @ts-ignore
        widthValue = res.rightValue.widthValue;
        if (state.leftOrRight.includes('left')) {
          // @ts-ignore
          widthValue = res.leftKey.widthValue;
        }
      }
      state.xywh = {
        // @ts-ignore
        left: res.left,
        // @ts-ignore
        top: res.top,
        // @ts-ignore
        widthValue,
        // @ts-ignore
        heightValue: res.heightValue
      };
    }
    state.itemAttrs = res;
  },
  changeXYWH(state: any, res: object) {
    state.xywh = Object.assign(state.xywh, res);
  },
  changeKey(state: any, tab: string) {
    state.activeLeft = tab;
  },
  changeIsFocus(state: any, str: boolean) {
    state.isFocus = str;
  },
  changeLeft(state: any, num: number) {
    state.toLeft = num;
  },
  changeTop(state: any, num: number) {
    state.toTop = state.toTop + num;
  },
  setBizSysData(state: any, res: object[]) {
    state.bizSysData = res;
  },
  changeLeftRight(state: any, res: any) {
    const { obj, str } = res;
    state.leftOrRight = str;
    let tempObj: object = {
      // @ts-ignore
      left: obj.left,
      // @ts-ignore
      top: obj.top,
      // @ts-ignore
      widthValue: obj.widthValue,
      // @ts-ignore
      heightValue: obj.heightValue,
    };
    if (!obj.letfKey) return;
    state.xywh = Object.assign(state.xywh, tempObj);
  },
  addPage(state: any) {
    state.pages.push([]);
  },
  removePage(state: any, page: number) {
    state.pages.splice(page, 1);
  },
  updateNode(state: any, payload: {
    page: number,
    id: string,
    node: any
  }) {
    const page = state.pages[payload.page];
    const idx = page.findIndex((item: any) => item.id === payload.id);
    if (idx > -1) {
      page.splice(idx, 1, payload.node);
      // state.pages.splice(payload.page, 1, page);
    }
  }
};

const actions = {
  changeOver({ commit }: any, res: Boolean) {
    commit("setIsOver", res);
  },
  updatePageSettingData({ commit }: any, data: Object, ) {
    commit("setPageSettingData", data);
  }
};

const getters = {
  getItemAttrsById: (state: any) => (id: string, page = 0) => {
    // @ts-ignore
    return state.pages[page].find((item: object) => item.id === id)
  },
  getPageSettingData: (state: any) => (code: string) => {
    const sessionData: string | null = sessionStorage.getItem(`printStore${code}`);
    sessionData === null ? state.pageSettings = null : state.pageSettings = Object.assign({}, JSON.parse(sessionData));
    return state.pageSettings;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
