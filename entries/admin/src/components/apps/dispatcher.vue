
<template>
  <span></span>
</template>

<script lang="ts">

import { Component, Vue, Prop, Watch } from 'vue-property-decorator';


import * as formApi from '@/apis/form';
import * as listApi from '@/apis/list/list.api';
import WorkflowApi from '@/apis/workflow';

import * as ModelAction from '@/typings/model-action';

@Component({
    name: 'model-dispatcher'
})
export default class Dispatcher extends Vue {

    mounted() {
        this.openBizModel();
    }

    async openBizModel() {
        
        // const hide = (this.$message as any).loading();

        const { appCode, bizSchemaCode } = this.$route.params;

        const modelActions = this.getModelActions();
        let isExist: boolean = true; // 当前项的code是否存在数据库中
        let data: any; // 请求到的数据库最新记录
        let href: string = ''; // 跳转链接
        const hashPrefix = '';
        if (modelActions) {
            // 根据本地的code判断当前项是否在数据库中
            // todo: 默认表单目前取的第一个，完成默认表单功能需改正
            const record: ModelAction.ModelActionItem = modelActions.find((item: ModelAction.ModelActionItem) => (item.bizSchemaCode === bizSchemaCode));
            if (record) {
                const { type, code } = record;
                switch (type) {
                    case ModelAction.ModalActionTypes.DataModel:
                        data = [];
                        isExist = true;
                        href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/data`;
                        break;
                    case ModelAction.ModalActionTypes.Form:
                        data = await this.getFormList(bizSchemaCode);
                        isExist = data.some((item: any) => item.code === code);
                        href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/form-design/${isExist ? code : data[0].code}`;
                        break;
                    case ModelAction.ModalActionTypes.Workflow:
                        data = await this.getWorkflowList(bizSchemaCode);
                        isExist = data.some((item: any) => item.workflowCode === code);
                        if (!isExist && !data.length) {
                            const formData = await this.getFormList(bizSchemaCode);
                            href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/form-design/${formData[0].code}`;
                        } else {
                            href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/workflowDesign/${isExist ? code : data[0].workflowCode}`;
                        }
                        break;
                    case ModelAction.ModalActionTypes.List:
                        data = await this.getLists(bizSchemaCode);
                        isExist = data.some((item: any) => item.code === code);
                        href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/list-design/${isExist ? code : data[0].code}`;
                        break;
                    default: break;
                }
                if (!isExist) { // 删除这条记录
                    const newAction: Array<ModelAction.ModelActionItem> = modelActions.filter((item: any) => item.code === code);
                    this.updateModelAction(newAction);
                }
            } else {
                data = await this.getFormList(bizSchemaCode);
                href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/form-design/${data[0].code}`;
            }
        } else { // 没有记录，直接跳默认表单
            data = await this.getFormList(bizSchemaCode);
            href = `${hashPrefix}/apps/model/${appCode}/${bizSchemaCode}/form-design/${data[0].code}`;
        }

        // hide();

        this.$router.push(href);
    }


    /**
     * @desc 获取最新表单列表
     * @params bizSchemaCode 业务模型编码
    */
    async getFormList(schemaCode: string) {
        const res = await formApi.list(schemaCode);
        if (res.errcode === 0) {
            return res.data;
        }
        return null;
    }

    /**
     * @desc 获取最新流程列表
     * @params bizSchemaCode 业务模型编码
    */
    async getWorkflowList(schemaCode: string) {
        const params = {
            schemaCode
        };
        const res = await WorkflowApi.getWorkflowList(params);
        if (res.errcode === 0) {
            return res.data;
        }
        return null;
    }

    /**
     * @desc 获取最新表单列表
     * @params bizSchemaCode 业务模型编码
    */
    async getLists(schemaCode: string) {
        const res = await listApi.getList(schemaCode);
        if (res.errcode === 0) {
            return res.data;
        }
        return null;
    }

    /**
     * 获取本地存储中的记录
     */
    getModelActions() {
        const modelActions = window.localStorage.getItem('ModelAction') as string;
        if (!modelActions) return null;
        return JSON.parse(modelActions);
    }

    /**
     * 更新记录
     */
    updateModelAction(newAction: Array<ModelAction.ModelActionItem>) {
        window.localStorage.setItem('ModelAction', JSON.stringify(newAction));
    }

}

</script>