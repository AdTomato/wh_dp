
import {
  renderer, schema
} from '@cloudpivot/form';

import * as platform from '@cloudpivot/platform';

import axios from 'axios';
// import appsApi from '../../apis/apps.api';

const { DataItemType } = schema;

import { listApi, listParams, formApi } from '@cloudpivot/api';



export enum QueryDisplayType {

  /**
   * 默认展示查询列表配置的显示字段
   */
  Default = '0',

  /**
   * 覆盖展示查询列表配置的显示字段
   */
  Override = '1',

  /**
   * 在查询列表配置的显示字段的基础上新增显示字段
   */
  Append = '2'

}

export class DefaultRelevanceFormService implements renderer.RelevanceFormService {
  search(schemaCode: string, queryCode: string, params: renderer.RelevanceFormSearchParams[], columns: string[],
    page: number, pageSize: number, query?: any[]) {
    // schemaCode = 'api1';
    // queryCode = 'api1';


    let filters = params.map((x: any) => {
      let val: any = x.value || x.propertyValue;

      if (x.type && x.value) {
        switch (x.type) {
          case renderer.DataItemType.RelevanceForm:
            val = x.value.id || '';
            break;
          case renderer.DataItemType.StaffSelector:
            val = x.value.map((v: any) => ({
              id: v.id,
              type: v.unitType || v.type
            }));
            val = JSON.stringify(val);
            break;
          default:
            if (Array.isArray(x.value)) {
              val = x.value.map(v => v.toString()).join(';');
            } else {
              val = x.value;
            }
            break;
        }
      }

      return ({
        propertyCode: x.code,
        propertyType: x.type,
        propertyValue: val
      });
    });

    if (query) {
      filters = filters.concat(query);
    }

    const obj: any = {
      queryCode,
      schemaCode,
      mobile: true,
      page: page - 1,
      size: pageSize,
      filters
    };

    if (columns && columns.length > 0) {
      obj.options = {
        customDisplayColumns: columns,
        queryDisplayType: QueryDisplayType.Append
      };
    }


    return listApi.getQueryList(obj).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        const data = res.data.content;
        // .map((x: any) => x.data);
        return {
          total: res.data.totalElements,
          data
        };
      }
      return {
        total: 0,
        data: []
      };
    });
  }

  open(schemaCode: string, queryCode: string, id: string, sheetId: string, isAuthorize: boolean, code: string, value: any) {
    const params = {
      bizObjectId: value.id,
      schemaCode: schemaCode
    };
    listApi.getFormUrl(params).then((res: any) => {
      const hash = window.location.hash.substr(1);
      let url = window.location.href.replace(hash, res);

      if (isAuthorize) {
        url += '&tempAuthSheetId=' + sheetId + '&tempAuthObjectId=' + id + '&tempAuthPropertyCode=' + code
      }

      window.location.href = url;

      // platform.service.openLink();
      // console.log(url);
      // if (common.isDingtalk) {
      //   dingtalk.openLink(url);
      // } else {
      //   window.open(url);
      // }
    });
  }

  dataitemsOf(schemaCode: string) {
    return axios.get('/api/app/bizproperty/list', {
      params: {
        schemaCode,
        isPublish: true
      }
    }).then((res: any) => {
      if (res.errcode === 0) {
        return res.data;
      }
      return [];
    });
  }

  getBizmodelTitle(schemaCode: string) {
    return formApi.getBizModelName(schemaCode).then(res => {
      if (res.errcode === 0) {
        return res.data;
      }
      return null;
    })
  }


  async getListQueryConditions(schemaCode: string, listCode: string,
    params: renderer.RelevanceFormSearchParams[]
  ) {
    const res = await listApi.getListConfigData({ code: listCode, schemaCode, clientType: "APP" });
    if (res.errcode !== 0 || !res.data) {
      return null;
    }

    const conditions: any[] = res.data.queryConditions || [];
    const queryActions: any[] = res.data.queryActions || [];
    const queryColumns: any[] = res.data.queryColumns || [];
    // if (!conditions || conditions.length === 0) {
    //   return null;
    // }
    // if (!res.data) {

    // }
    const sequenceStatus: any = conditions.find(c => c.propertyCode === 'sequenceStatus');
    if (sequenceStatus && sequenceStatus.defaultValue) {
      const state = sequenceStatus.defaultValue.split(';');
      const vals_zh: string[] = [];
      state.forEach(s => {
        switch (s) {
          case 'DRAFT':
            vals_zh.push('草稿');
            break;
          case 'PROCESSING':
            vals_zh.push('进行中');
            break
          case 'COMPLETED':
            vals_zh.push('已完成');
            break
          case 'CANCELED':
            vals_zh.push('已作废');
            break
          default:
            break;
        }
      });
      sequenceStatus.defaultValue = vals_zh.join(';');
    }

    params.forEach((x) => {
      const item = conditions.find((q: any) => q.propertyCode === x.code);
      if (item) {
        switch (item.propertyType) {
          case DataItemType.Date:
          case DataItemType.Number:
            if (x.value !== '') {
              item.defaultValue = [x.value, x.value];
            }
            break;
          case DataItemType.Logic:
            if (x.value === 'false' || x.value === false) {
              item.defaultState = 0;
              item.defaultValue = false;
            } else {
              item.defaultState = 1;
              item.defaultValue = true;
            }
            break;
          default:
            if (x.value !== undefined && x.value !== null) {
              item.defaultValue = x.value;
            }
            break;
        }
      }
    });
    console.log(conditions)
    return {
      conditions,
      queryActions,
      queryColumns
    };

  }

  getOptions(schemaCode: string, queryCode: string, params: any[], sheetDataItem: string) {
    // debugger;
    const filters = params.map((x) => {
      // if( !x ) return;
      let val: any = x.propertyValue;
      switch (x.type) {
        case DataItemType.RelevanceForm:
          val = x.value.id || '';
          break;
        case DataItemType.StaffSelector:
          val = x.value.map((v: any) => ({
            id: v.id,
            type: v.unitType || v.type
          }));
          val = JSON.stringify(val);
          break;
        case DataItemType.Number:
          if (Array.isArray(x.value)) {
            val = x.value.map(v => v.toString()).join(';');
          } else {
            val = x.value;
          }
          break;
        default:
          if (Array.isArray(x.value)) {
            val = x.value.map(v => v.toString()).join(';');
          } else {
            val = x.value;
          }
          break;
      }
      // switch(x.ctrlType) {
      //   case schema.FormControlType.CreateBy:
      //   case schema.FormControlType.ModifyBy:
      //   case schema.FormControlType.CreateByParentId:
      //     val = JSON.stringify(x.propertyValue);
      //     break;
      //   case schema.FormControlType.Dropdown:
      //   case schema.FormControlType.Checkbox:
      //   case schema.FormControlType.Radio:
      //     if(typeof val !== 'string') {
      //       val = val.join(';');
      //     }
      //     break;
      //   default:
      //       val = x.propertyValue
      //     break;
      // }
      return ({
        propertyCode: x.propertyCode,
        propertyValue: val,
        op: 'Eq'
      });
    });
    let groupByFields = [sheetDataItem];
    const obj: any = {
      queryCode,
      schemaCode,
      groupByFields,
      page: 0,
      size: 1000,
      filters
    };
    return listApi.listSkipQueryList(obj).then((res) => {
      if (res.errcode === 0) {
        const data: string[] = [];
        res.data.content.forEach((x: any) => {
          const s = x.data[sheetDataItem]
          if (s && data.indexOf(s) === -1) {
            data.push(s);
          }
        });
        return data
      }
      return []
    });
  }

  queryDefaultValue(schemaCode: string, queryCode: string, columns: string[], filters: any[]) {

    const obj: any = {
      queryCode,
      schemaCode,
      mobile: false,
      page: 0,
      size: 2,
      filters
    };

    if (columns && columns.length > 0) {
      obj.options = {
        customDisplayColumns: columns,
        queryDisplayType: listParams.QueryDisplayType.Append
      };
    }

    return listApi.listSkipQueryList(obj).then((res) => {
      if (res.errcode === 0) {
        const data = res.data.content.map((x: any) => x.data);
        return {
          total: res.data.totalElements,
          data
        };
      }
      return {
        total: 0,
        data: []
      };
    });
  }

}
