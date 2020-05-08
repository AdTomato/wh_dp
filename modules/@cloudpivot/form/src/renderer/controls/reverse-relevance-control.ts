
import * as typings from '../typings';

import { BaseControl } from './base-control';

import { ControlHelper } from './control-helper';

import { DataItemType, DispalyMode, ListDispalyMode } from '../typings';

import { FormControlValueService } from '../services';

export abstract class ReverseRelevanceControl extends BaseControl<typings.ReverseRelevanceOptions> {

    static service: ReverseRelevanceService

    get isShow () {
        return this.controlOpts.listDisplayMode === ListDispalyMode.Table;
    }

    get isTabs() {
        return this.controlOpts.listDisplayMode === ListDispalyMode.Tabs;
    }

    get isList() {
        return this.controlOpts.displayMode === DispalyMode.List;
    }

    get isLink() {
        return this.controlOpts.displayMode === DispalyMode.Link;
    }

    get sequenceStatus() {
        let value = '';
        const val:any = (this.controlOpts as any).sheetParams;
        if(val && val.sequenceStatus){
            value = val.sequenceStatus;
        }
        return value;
    }

    get field() {
        let value = '';
        const val:any = (this.controlOpts as any).sheetParams;
        if(val && val.id){
            value = val.id;
        }
        return {
            code: this.controlOpts.fieldCode,
            type: DataItemType.RelevanceForm,
            value
        }
    }

    get query() {
        return [this.field];
    }

    get currentFormId () {
        let id = '';
        const val:any = (this.controlOpts as any).sheetParams;
        if(val && val.id){
            id = val.id;
        }
        return id;
    }
    
    get currentSheetId () {
        let id = '';
        const val:any = (this.controlOpts as any).sheetParams;
        if(val && val.sheetid){
            id = val.sheetid;
        }
        return id;
    }

    get selfFormCode() {
        const val:any = (this.controlOpts as any).sheetParams;
        if(val && val.formCode){
            return val.formCode;
        }
        return '';
    }

    get selfSchemaCode() {
        const val:any = (this.controlOpts as any).sheetParams;
        // const val = this.ctrl.value;
        if(val && val.schemaCode){
            return val.schemaCode;
        }
        return '';
    }

    getAll(queryParam?:any[]) {
        let query:any[] = [];
        if (queryParam) {
            query = query.concat(queryParam);

            query = query.map((x:any) => {
                let val: any = null;
                if (x.value || x.value === false) {
                    val = x.value;
                } else {
                    val = x.propertyValue;
                }
          
                if ((x.type || x.type === 0) && (x.value || x.value === false)) {
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
                      break
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
                  code: x.code,
                  type: x.type,
                  value: val
                });
              });
        }
        query.push(this.field)
        const schemaCode = this.controlOpts.schemaCode;
        return ReverseRelevanceControl.service.getAll(schemaCode, this.id, this.selfSchemaCode, this.selfFormCode ,query);
    }

    open(item: any) {
        if (this.isLink || this.isTabs) {
            ReverseRelevanceControl.service.open(this.controlOpts.schemaCode, item);
        }
        
    }

    fetch(page: number, pageSize: number, value: string, queryData: any[]) {
        // if (!RelevanceFormControl.service) {
        //     return;
        // }

        const schemaCode = this.controlOpts.schemaCode || '';
        const queryCode = this.controlOpts.listCode || '';

        // if (!schemaCode || !queryCode) {
        //     return;
        // }
        let params = queryData;
        params.push({
            code: 'name',
            type: DataItemType.ShortText,
            value
        });
        if (this.field) {
            // params = params.filter(res => res.code !== this.controlOpts.fieldCode);
            params.push(this.field);
        }

        const _ctrl = this.ctrl as any;
        const cols = _ctrl.options && _ctrl.options.mappings ? Object.keys(_ctrl.options.mappings) : [];
        return ReverseRelevanceControl.service.search(schemaCode, this.selfSchemaCode, this.id, this.selfFormCode, params, cols, page, pageSize, queryData);

        // return ReverseRelevanceControl.service.search(schemaCode, queryCode, params, cols, page, pageSize, queryData);
    }

}



export interface ReverseRelevanceService {

    getAll(schemaCode: string, reverseCode: string, 
        reverseSchemaCode: string, formCode : string,
        field: any[]): Promise<Array<{
        id: string
        name: string
    }>>

    open(schemaCode: string, item: any): void

    search(schemaCode: string, formCode: string, reverseCode: string,reverseSchemaCode:string,
        params: any[], columns: string[],
        page?: number, pageSize?: number, query?: any[]
    ): void

}

// export interface RelevanceFormSearchParams {
//     code: string
//     type: DataItemType
//     value: any
// }


// export interface RelevanceFormSearchResult {
//     id: string
//     name: string
//     [key: string]: any
// }


// export interface Segment<T> {

//     total: number

//     data: T[]

// }

