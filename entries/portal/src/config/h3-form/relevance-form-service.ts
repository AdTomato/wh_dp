import {
  renderer, schema
} from '@cloudpivot/form';

const { DataItemType } = schema;

import { listApi, listParams, formApi } from '@cloudpivot/api';

import axios from 'axios';

import common from '@cloudpivot/common';

export const isDingtalk = /DingTalk/.test(navigator.userAgent);


export class DefaultRelevanceFormService implements renderer.RelevanceFormService {
  search(schemaCode: string, queryCode: string,
    params: renderer.RelevanceFormSearchParams[], columns: string[]) {
    // schemaCode = 'api1';
    // queryCode = 'api1';

    const filters = params.map((x) => {
      let val: any = x.value;

      if (x.value !== null && x.value !== undefined) {
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
              val = x.value + ';';
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
      }

      return ({
        propertyCode: x.code,
        propertyType: x.type,
        propertyValue: val
      });
    });

    const obj: any = {
      queryCode,
      schemaCode,
      mobile: false,
      page: 0,
      size: 1000,
      filters
    };

    if (columns && columns.length > 0) {
      obj.options = {
        customDisplayColumns: columns,
        queryDisplayType: listParams.QueryDisplayType.Append
      };
    }

    return listApi.getQueryList(obj).then((res) => {
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

  open(schemaCode: string, queryCode: string, id: string, sheetId: string, isAuthorize: boolean, code: string, value: any) {
    const params = {
      bizObjectId: value.id,
      schemaCode
    };
    listApi.getFormUrl(params).then((res: any) => {
      // debugger;
      if (isDingtalk) {
        res += '&access_token=' + localStorage.getItem('token');
      }
      if (isAuthorize) {
        res += '&tempAuthSheetId=' + sheetId + '&tempAuthObjectId=' + id + '&tempAuthPropertyCode=' + code
      }
      window.open(res);
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
    // axios.get('/api/app/bizproperty/list', {
    //   params: {
    //     schemaCode,
    //     isPublish: true
    //   }
    // }).then((res: any) => {
    //   if (res.errcode === 0) {
    //     return res.data;
    //   }
    //   return null;
    // });
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
        case DataItemType.Logic:
          val = `${x.value}`;
          break;
        case DataItemType.Date:
          val = common.utils.DateHandle.dateFormat(new Date(x.value), 'YYYY-MM-DD');
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
