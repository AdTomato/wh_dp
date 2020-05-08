import { Component } from "vue";
import ReportOptions from '@h3/report/dist/options';
import { FieldColumn } from '@h3/report';
import { schema } from '@cloudpivot/form';

import ReportStaffSelect from './report-staff-select.vue';

import env from '@/env'


let inited = false;

export function init() {

    if (inited) {
        return;
    }

    inited = true;

    ReportOptions.baseUrl = env.portalHost;

    ReportOptions.requestHeader = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            return null;
        }

        return {
            Authorization: 'Bearer ' + token
        }
    }

    /**
       * 字段类型分类
       */
    ReportOptions.classification = (field: FieldColumn) => {
        return [field.dataType];
        // let arr: Array<number> = [];
        // // 通过field.dataType判断业务对象值类型 返回同类型值对象的dataType值
        // switch (field.dataType) {
        //     case 7:
        //         arr = [1, 2, 7];
        //         break;
        // }
        // return arr;
    };


    ReportOptions.integrateComponents = (field: FieldColumn, formula: string): Component | null => {
        let components: any = null;
        switch (field.dataType) {

            case schema.DataItemType.StaffSelector:
                components = ReportStaffSelect;
                break;
        }
        return components;
    };


}

init();