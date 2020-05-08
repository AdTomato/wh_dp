
import { ControlHelper, UploadStatus } from '../controls';
import * as typings from '../typings';
import { FormSheet } from 'h3-forms';



import { FormControlValueService } from './form-control-value-service';

import * as SystemCodes from '../../schema/system-data-item-codes';

import { DataItemType, RelevanceFormSelectMode } from '../typings';

import { FormStatusZh, FormStatusEn } from '../../schema';

import * as common  from '@cloudpivot/common';
import * as moment from "moment";

import { form } from "@cloudpivot/api";

// import { UploadStatus } from "./upload-control";

import {
    RelevanceFormControl,
    ReverseRelevanceControl
  } from "../controls";

export abstract class ReverseQueryService {

  static async getListQueryConditions(schemaCode: string,queryCode: string, params:any) {
    
    if (!RelevanceFormControl.service.getListQueryConditions) {
        return Promise.reject(null);
    }

    return await RelevanceFormControl.service.getListQueryConditions(schemaCode, queryCode, params);
    // return await getList(schemaCode, queryCode, params);
  }

  static getParams(conditions:any,formControls:any, c:any,findController:any) {
    if (!conditions) {
        return [];
    }
  
    const params = conditions.split(';').map(arr => {
        const _index = arr.indexOf(":");
        let f1 =  arr.slice(0, _index);
        let f2 = arr.substring(_index + 1);
        if (!f2) {
            return null;
        }

        if (f2[0] === '{') {
            f2 = f2.substr(1, f2.length - 2);

            let ctrl: any;
            let control: typings.RendererFormControl | undefined;

            const idx = f2.indexOf('.');
            if (idx > -1) {
                const sheetKey = f2.substring(0, idx);
                const controlKey = f2.substr(idx + 1);

                const sheet = formControls.find((child: any) => child.key === sheetKey) as any as typings.FormSheet;
                if (sheet) {
                    control = sheet.columns.find(child => child.key === controlKey) as any;
                }

                const sheetCtrl = findController(f2.substring(0, idx)) as FormSheet;
                if (sheetCtrl && c.options && typeof c.options.rowIndex === 'number') {
                    const row = sheetCtrl.rows[c.options.rowIndex];
                    ctrl = row.findChild(f2.substr(idx + 1));
                }
            } else {
                ctrl = findController(f2);
                control = formControls.find((child: any) => child.key === f2);
            }

            if (!ctrl || !control) {
                return null;
            }

            return ({
                code: f1,
                value: ctrl.value,
                type: ControlHelper.mapToDataItemType(control.type)
            });
        } else {
            return {
                code: f1,
                value: f2
            };
        }

    }).filter(x => x !== null);

        return params as any[];
    }

  static formatQueryData(queryCondition:any[]) {
      return queryCondition.map(res => {
          const type = res.propertyType;
          const code = res.propertyCode;
          let val:any = '';
          switch(res.propertyType){
              case DataItemType.Logic:
                  if(res.defaultState === 1) {
                      val = true;
                  } else {
                      val = false;
                  }
                  break;
              case DataItemType.Date:
                  if (res.defaultValue) {
                  val = res.defaultValue.map((x:any) => {
                    if(typeof x === 'string'){
                      return x;
                    }else if(x instanceof Date){
                      try{
                        return (moment as any).default(x).format('YYYY-MM-DD');
                      }catch {
                        return '';
                      }
                    }
                    return '';
                  }).join(';');
                  }

                  break
              default:
                  val = res.defaultValue;
                  break;
          }

          if (res.propertyCode === SystemCodes.sequence_status && res.defaultValue) {
              const status_en:string[] = [];

              const statusArr = res.defaultValue.split(';');
                statusArr.forEach(s => {
                  switch (s) {
                    case FormStatusZh.DRAFT:
                      status_en.push(FormStatusEn.DRAFT)
                      break;
                    case FormStatusZh.PROCESSING:
                        status_en.push(FormStatusEn.PROCESSING)
                      break;
                    case FormStatusZh.CANCELLED:
                      status_en.push(FormStatusEn.CANCELLED)
                      break;
                    case FormStatusZh.COMPLETED:
                      status_en.push(FormStatusEn.COMPLETED)
                      break;
                  
                    default:
                      break;
                  }
                });
                val = status_en.join(';');
          }
          return {
              code,
              type,
              value: val
          }

      });
  }
  
  static initMappings(mappings:string) {
    let obj: any = {};
      mappings
        .split(";")
        .filter((x: string) => x)
        .forEach((x: string) => {
          const idx = x.indexOf(":");
          const source = x.substring(0, idx);
          const target = x.substring(idx + 2, x.length - 1);
          if (obj[source]) {
            if (Array.isArray(obj[source])) {
              obj[source].push(target);
            } else {
              obj[source] = [obj[source], target];
            }
          } else {
            obj[source] = target;
          }
        });
    return obj;
  }

  static convertForMappings(value: any, dataitems:any, mappings:any, formControls:any) {


    if (!mappings) {
      return value;
    }
    const locale =  window.localStorage.getItem('locale') || 'zh';

    // const dataitems = await RelevanceFormControl.service.dataitemsOf(
    //   schemaCode
    // );

    const item = JSON.parse(JSON.stringify(value));

    // const formControls = this.getFormControls();

    for (const key in mappings) {
      let target = mappings[key];
      let targetKey = Array.isArray(target) ? target[0] : target;
      const idx = targetKey.indexOf(".");
      let control;
      if (idx === -1) {
        control = formControls.find(c => c.key === targetKey);
      } else {
        const parentKey = targetKey.substring(0, idx);
        targetKey = targetKey.substr(idx + 1);
        const parent = (formControls.find(
          c => c.key === parentKey
        ) as any) as typings.FormSheet;
        if (!parent || !parent.columns) {
          continue;
        }
        control = parent.columns.find(c => c.key === targetKey);
      }
      if (!control) {
        continue;
      }

      const targetItemType = ControlHelper.mapToDataItemType(control.type);
      const dataitem = dataitems.find(
        (d: typings.DataItemLike) => d.code === key
      );
      if (!dataitem || targetItemType !== dataitem.propertyType) {
        item[key] = FormControlValueService.defaultValueOf(control.type);
        continue;
      }

      if (control.type === typings.FormControlType.Sheet) {
        const rows = item[key];
        const columns = ((control as any) as typings.FormSheet).columns;
        if (Array.isArray(rows) && rows.length > 0 && columns.length > 0) {
          const subSchema = (dataitem as typings.SheetDataItemLike).subSchema;

          for (const col of columns) {
            const subItem = subSchema
              ? subSchema.properties.find(p => p.code === col.key)
              : null;

            const match =
              subItem &&
              subItem.propertyType ===
                ControlHelper.mapToDataItemType(col.type);

            for (const row of rows) {
              delete row.id;

              if (row[col.key] !== undefined) {
                if (match) {
                  if (key === "sequenceStatus") {
                    if (item[key] && locale === "zh") {
                      const text = form.sequenceStatusZh[item[key]];
                      if (text) {
                        item[key] = text;
                      }
                    }
                  } else {
                    row[col.key] = FormControlValueService.convert(
                      col.type,
                      row[col.key],
                      col.options.multi
                    );
                  }
                } else {
                  row[col.key] = FormControlValueService.defaultValueOf(
                    col.type
                  );
                }
              }
            }
          }
        }
      } else if (
        control.type === typings.FormControlType.Attachment ||
        control.type === typings.FormControlType.Image
      ) {
        const files = item[key];
        if (files && Array.isArray(files)) {
          item[key] = files.map((f: any) => ({
            uid: f.refId,
            name: f.name,
            status: UploadStatus.Done,
            size: f.fileSize,
            response: {
              data: f
            }
          }));
        }
      } else {
        if (key === "sequenceStatus") {
          if (item[key] && locale === "zh") {
            const text = form.sequenceStatusZh[item[key]];
            if (text) {
              item[key] = text;
            }
          }
        } else {
          item[key] = FormControlValueService.convert(
            control.type,
            item[key],
            control.options.multi
          );
        }
      }
    }

    return item;
  }

    // static fetch(schemaCode: string,queryCode:string,page: number, pageSize: number, value: string, params: any[]) {
    //     // if (!RelevanceFormControl.service) {
    //     //     return;
    //     // }

    //     // const schemaCode = this.controlOpts.schemaCode || '';
    //     // const queryCode = this.controlOpts.queryCode || '';

    //     // if (!schemaCode || !queryCode) {
    //     //     return;
    //     // }
    //     // const params = queryData ? [] : this.getParams();
    //     params.push({
    //         code: 'name',
    //         type: DataItemType.ShortText,
    //         value
    //     });

    //     // const _ctrl = this.ctrl as any;
    //     // const cols = _ctrl.options && _ctrl.options.mappings ? Object.keys(_ctrl.options.mappings) : [];
    //     const cols: any[] = [];
    //     return ReverseRelevanceControl.service.search(schemaCode, queryCode, params, cols, page, pageSize);
    // }
}

// export interface RelevanceFormSearchParams {
//   code: string
//   type: DataItemType
//   value: any
// }
