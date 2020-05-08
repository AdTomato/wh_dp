import AppsApi from '@/apis/apps';

const state:Apps.Datamodel.State = {
  keyWords: '',
  bizSchemaCode: '',
  bizPropertyCode: '',
  isLoading: false,
  dataItemList: [],
  filterDataItemList: [],
  dataItemTypeList: [], // 数据项类型
  relativeCode: '', // 业务类型code
  bussinessType: [], // 业务类型
  dataItemDetails: {}, // 数据项详情
  editMode: '', // 编辑模式
  drawerVisible: false, // drawer显示隐藏
  bizPropertyModel: {},
  bizSchemaModelList: [],
  summaryList: [],
  targetSummary: [],
  defaultSummary: []
};
/* Mutations */
const mutations = {
  setKeyWords(state: any, val:string) {
    state.keyWords = val;
  },
  setDefaultSummary(state: any, val:Array<Apps.Datamodel.Summary>) {
    val = val.filter((x:any) => x.code);
    
    state.defaultSummary = [];
    if(val.length === 0){
      return;
    }

    state.targetSummary = val;
    const arrLength = val.length;
    for (let i = 0; i < arrLength; i+=1) {
      state.defaultSummary.push(val[i].code);
    }
  },
  // 编辑模式（编辑or新增）
  setCurrenEdittMode(state: any, val: string) {
    state.editMode = val;
  },
  // drawer显示隐藏
  setDrawerVisible(state: any, val: string) {
    state.drawerVisible = val;
  },
  /**
   * 设置摘要
   */
  setSummary(state: any, val: Array<string>) {
    // const lang: string = localStorage.getItem('locale') || '';
    val = val.filter(x => x);
    state.defaultSummary = val;
    const summaryLength:number = val.length;
    const summaryListLength:number = state.summaryList.length;
    const targetSummary : any[] = [];
    for (let i = 0; i < summaryLength; i+=1) {
      for (let j = 0; j < summaryListLength; j+=1) {
        if (val[i] === state.summaryList[j].code) {
          const summaryObj = {
            isDataItem: 1,
            code: val[i]
          };
          targetSummary.push(summaryObj);
          break;
        }
        if (j === summaryListLength -1 && val[i] !== state.summaryList[j].code) {
          const summaryObj = {
            isDataItem: 0,
            code: val[i]
          };
          targetSummary.push(summaryObj);
        }
      }
    }
    //debugger
    state.targetSummary = targetSummary;
  },
  setBizPropertyCode(state: any, val: string) {
    state.bizPropertyCode = val;
  },
  setFilterDataItemList(state: any, val: string) { // 过滤数据项，且高亮
    if (!val) {
      state.filterDataItemList = state.dataItemList;
      //debugger
      // mutations.setLang();
      return;
    }
    const tar:string = val.toLowerCase();

    const str = JSON.stringify(state.dataItemList);
    const actionArr = JSON.parse(str);
    for (let i = 0; i < actionArr.length; i+=1) {
      if (actionArr[i].children) {
        const filtersTagget = actionArr[i].children.filter((x:any) => (new RegExp(tar).test(x.name)) || (new RegExp(tar).test(x.code.toLowerCase())));
        const filtersTaggetLength = filtersTagget.length;
        for (let j = 0; j < filtersTaggetLength; j+=1) {
          filtersTagget[j].index = j+1;
        }
        actionArr[i].children = filtersTagget;
      }
    }
    const filterArr = actionArr.filter((x:any) => ((new RegExp(tar).test(x.name)) || (new RegExp(tar).test(x.code.toLowerCase()))) || (x.children&&x.children.length));
    state.filterDataItemList = filterArr.filter((item:any) => item.propertyType !==7);
    // debugger
    // mutations.setLang();
  },
  /**
   * 多语言处理
   */
  setLang(state: any) {

    state.filterDataItemList.forEach((res:any) => {
      // debugger
      const lang: string = localStorage.getItem('locale') || 'zh';
      if (res.name_i18n) {
        const langObj:any = JSON.parse(res.name_i18n);
        if (langObj[lang]) {
          res.name = langObj[lang];
        }
      }

      if (res.propertyType === 8&& res.subSchema&& res.subSchema.properties) {
        res.subSchema.properties.forEach((d:any) => {
          if (d.name_i18n) {
            const nameObj:any = JSON.parse(d.name_i18n);
            if (nameObj[lang]) {
              d.name = nameObj[lang];
            }
          }
        })
      }
    });

  },
  /**
   *设置列表展示数据添加排序号
   */
  setDataItemList(state: any, dataItem:Array<Apps.Datamodel.DataItem>) {
    // debugger
    dataItem.forEach((res:any) => {
      
      const lang: string = localStorage.getItem('locale') || 'zh';
      if (res.name_i18n) {
        const langObj:any = JSON.parse(res.name_i18n);
        if (langObj[lang]) {
          res.name = langObj[lang];
        }
      }
      if (res.propertyType === 8&& res.subSchema&& res.subSchema.properties) {
        res.subSchema.properties.forEach((d:any) => {
          if (d.name_i18n) {
            const nameObj:any = JSON.parse(d.name_i18n);
            if (nameObj[lang]) {
              d.name = nameObj[lang];
            }
          }
        })
      }
    });
    
    const dataLength:number = Array.isArray(dataItem) ? dataItem.length : 0;

    // if()
    state.summaryList = [];
    let count:number = 1;
    // 摘要过滤
    state.summaryList = dataItem.map((res:any) => {
      return {
        name: res.name,
        code: res.code,
        propertyType: res.propertyType,
        defaultProperty: res.defaultProperty,
        published: res.published
      }
    }).filter((res:any) => {
      return (res.propertyType !== 6 &&
        res.propertyType !== 7 &&
        res.propertyType !== 8 &&
        // res.propertyType !== 9 &&
        res.propertyType !== 10 &&
        res.code !== 'name' &&  //摘要
        res.code !== 'id' &&   //id
        res.code !== 'ownerDeptQueryCode' &&
        res.code !== 'workflowInstanceId' )
    });
    
    for (let i = 0; i < dataLength; i+=1) {
      if (!dataItem[i].defaultProperty) {
        dataItem[i].index = count;
        count+=1;
      }
      dataItem[i].isSchema = true;
      dataItem[i].key = dataItem[i].code;
      if (dataItem[i].subSchema) {
        dataItem[i].children = dataItem[i].subSchema.properties.filter((res:any) =>{ return !res.defaultProperty});
        dataItem[i].children.forEach((res:any,index:number) => {
          res.index = index+1;
          res.key = `${dataItem[i].code}-${res.code}`;
          res.isSchema = false;
        })
      }
    }
    state.dataItemList = dataItem.filter((item:any) => (!item.defaultProperty));
  },
  // 设置数据项类型
  setDataItemTypeList(state: any, dataItemType: Array<Apps.Datamodel.DataType>) {
    state.dataItemTypeList = dataItemType;
  },
  // 数据项详情
  setDataItemDetails(state: any, params: {}) {
    console.info(params);
    state.dataItemDetails = params; // 到这里。。。。。。
  },
  // 设置业务类型
  setBussinessTypeList(state: any, bussinessTypeParams: any[]) {
    state.bussinessType = bussinessTypeParams;
  },
  // 添加数据项

  // bizPropertyJson: string,
  //     subSchemaJson: string,
  //     propertiesJson: string
  postDataItem(state: any, PostDataItemParms: object) {
    // console.info('mutations::', PostDataItemParms);
    state.bizPropertyModel = PostDataItemParms;
    // state.dataItemList.push(PostDataItemParms);
  },
  // 更新数据项
  updateDataItems(state: any, updateDataItemsParms: object) {
    // state.bizPropertyModel = updateDataItemsParms;
  },
  setBizSchemaCode(state: any, val: string) { // 设置编码
    state.bizSchemaCode = val;
  }
};

/* Action */
const actions = {
  submitSummary({ commit, state } : any) {
    const params: Apps.Datamodel.SummaryParams = {
      schemaCode: state.bizSchemaCode,
      summary: state.targetSummary.length ? JSON.stringify(state.targetSummary) : ''
    };
    return AppsApi.submitSummary(params);
  },
  deleteDataItem({ commit, state } : any, id:string) { // 删除数据项
    const params:Apps.Datamodel.DeleteParams = { bizSchemaCode: state.bizSchemaCode, bizPropertyCode: id };
    return AppsApi.deleteDataItem(params);
  },
  forceDeleteDataItem({ commit, state } : any, id:string) { // 强制删除数据项
    //  
    const params:Apps.Datamodel.DeleteParams = { bizSchemaCode: state.bizSchemaCode, bizPropertyCode: id };
    return AppsApi.forceDeleteDataItem(params);
  },
  publishDataItem({ commit, state } : any) { // 发布数据项
    const params:Apps.Datamodel.PublishParams = {
      bizSchemaCode: state.bizSchemaCode,
    };
    return AppsApi.publishDataItem(params);
  },
  getBizmodeltitle({ commit, state } : any) { // 获取业务模型名称
    const params: Apps.Datamodel.DataItemListParams = {
      schemaCode: state.bizSchemaCode
    };
    return AppsApi.getBizmodeltitle(params);
  },
  async getDataItemList({ commit, state } : any) { // 获取数据项数据
    const params:Apps.Datamodel.DataItemListParams = { schemaCode: state.bizSchemaCode };
    const res = await AppsApi.getDataItemList(params);
    if (res.data) {
      commit('setDataItemList', res.data);
      // commit('setLang', res.data);
    }
  },
  async getDataItemType({ commit, state } : any) { // 获取数据项类型
    const res = await AppsApi.getDataItemType();
    commit('setDataItemTypeList', res.data);
  },
  async getDataItemDetails({ commit, state } : any, params: object) { // 获取数据项详情
    const res = await AppsApi.getDataItemDetails(params);
    return new Promise((resolve, reject) => {
      resolve(res.data);
      // commit('setDataItemDetails', res.data);
    });
  },
  async getBussinessType({ commit, state } : any, params: object) { // 获取业务类型
    const res = await AppsApi.getBussinessType(params);
    commit('setBussinessTypeList', res.data);
  },
  async postDataItem({ commit, state } : any, reqParams: Apps.Datamodel.SavaDataItem) { // 添加数据项
    // console.info('<<<<<< 请求的数据req：', reqParams);
    // const pramas = {
    //   bizPropertyJson: reqParams.bizPropertyJson,
    //   subSchemaJson: reqParams.subSchemaJson,
    //   propertiesJson: reqParams.propertiesJson,
    // };
    return AppsApi.saveDataItem(reqParams);
    // console.info('>>>>>> 返回的数据req：', res);
    // // if (res.code === 0) {
    // if (res.errcode === 0) {
    //   commit('postDataItem', reqParams);
    // } else {
    //   commit('postDataItem', { warn: res.errmsg });
    // }
    // return res;
  },
  updateDataItems({ commit, state } : any, req: Apps.Datamodel.DataItem) { // 更新数据项
    return  AppsApi.updateDataItem(req);
    // if (res.errcode === 0) {
    //   commit('updateDataItems', req);
    // }
  },
  async getSummary({ commit, state }:any) {
    const params: Apps.Datamodel.DataItemListParams = {
      schemaCode: state.bizSchemaCode
    };
    const res = await AppsApi.getSummary(params);
    const str:any = res.data;
    if (res.data) {
      const arr:Array<Apps.Datamodel.Summary> = JSON.parse(str);
      commit('setDefaultSummary', arr);
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
