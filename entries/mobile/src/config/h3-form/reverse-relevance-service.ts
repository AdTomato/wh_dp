
import {
  renderer
} from '@cloudpivot/form';

import * as platform from '@cloudpivot/platform';

import { listApi, listParams } from '@cloudpivot/api';


export class DefaultReverseRelevanceService implements renderer.ReverseRelevanceService {

  getAll(schemaCode: string, reverseCode: string,
    reverseSchemaCode: string, formCode: string, field:  {
      code: string,
      type: number,
      value: any
    }[]) {
    const filters = field.map( f => {
      return {
        propertyCode: f.code,
        propertyType: f.type,
        propertyValue: f.value
      }
    }) 
    // [{
    //   propertyCode: field.code,
    //   propertyType: field.type,
    //   propertyValue: field.value
    // }];

    const obj: any = {
      schemaCode,
      reverseCode,
      reverseSchemaCode,
      formCode,
      mobile: false,
      page: 0,
      size: 1000,
      filters
    };

    return listApi.queryReverse(obj).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        const data = res.data.content;
        // const data = res.data.content.map((x: any) => x.data);
        return data;
      }
      return [];
    });
  }

  open(schemaCode: string, item: any) {
    listApi.getFormUrl({
      bizObjectId : item.id, 
      schemaCode
    }).then((res: any) => {
      const hash = window.location.hash.substr(1);
      const url = window.location.href.replace(hash, res);

      platform.service.openLink(url);
      // console.log(url);
      // if (common.isDingtalk) {
      //   dingtalk.openLink(url);
      // } else {
      //   window.open(url);
      // }
    });
  }

  search(schemaCode: string, formCode: string, reverseCode: string,reverseSchemaCode:string ,params: renderer.RelevanceFormSearchParams[], columns: string[],
    page: number, pageSize: number, query ?: any[]) {

    let filters = params.map((x:any) => {
      let val: any =  undefined;
      if(x.value || x.value === false) {
        val = x.value;
      } else {
        val = x.propertyValue;
      }
      // let val: any = x.value || x.propertyValue;
      if (x.type && (x.value || x.value === false)) {
        switch (x.type) {
          case renderer.DataItemType.RelevanceForm:
            val = x.value
            break;
          case renderer.DataItemType.Logic:
            if (x.value === 'false' || x.value === false) {
              x.defaultValue = false;
            } else {
              x.defaultValue = true;
            }
           break;
          case renderer.DataItemType.StaffSelector:
            // val = x.value.map((v: any) => ({
            //   id: v.id,
            //   type: v.unitType || v.type
            // }));
            // val = JSON.stringify(val);
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

    // if(query){
    //   filters = filters.concat(query);
    // }

    


    // const obj: any = {
    //   queryCode,
    //   schemaCode,
    //   mobile: true,
    //   page: page - 1,
    //   size: pageSize,
    //   filters
    // };
    const obj: any = {
      formCode,
      mobile: true,
      reverseCode,
      reverseSchemaCode,
      schemaCode,
      
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


    return listApi.queryReverse(obj).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        // const data = res.data.content.map((x: any) => x.data);
        const data = res.data.content;
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
