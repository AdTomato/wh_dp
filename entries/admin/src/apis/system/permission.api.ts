
import axios from 'axios';

const path = '/api/system/permission';

export default {
    /**
     * 创建权限组
     * @param params 
     */
    createGroup(params: BPM.System.PermissionGroupModel)
        : Promise<Common.Res<void>> {
        return axios.post(`${path}/create_group`, params);
    },

    /**
     * 删除权限组
     * @param id 
     */
    deleteGroup(id: string)
        : Promise<Common.Res<void>> {
        return axios.delete(`${path}/delete_group`, {
            params: {
                id
            }
        });
    },

    /**
     * 获取权限组
     * @param id 
     */
    getGroup(id: string, appCode: string)
        : Promise<Common.Res<BPM.System.PermissionGroupModel>> {
        return axios.get(`${path}/get_group`, {
            params: {
                id,
                appCode
            }
        });
    },

    /**
     * 查询权限过滤条件
     * @param schemaCode 
     */
    listCondition(schemaCode: string, functionId: string)
        : Promise<Common.Res<BPM.System.AppFunctionPermissionConditionModel[]>> {
        return axios.get(`${path}/list_condition`, {
            params: {
                schemaCode,
                functionId
            }
        });
    },

    /**
     * 修改应用权限
     */
    updateAppPackage(params: BPM.System.UpdateAppPackageParams)
        : Promise<Common.Res<void>> {
        return axios.put(`${path}/update_apppackage`, params);
    },

    /**
     * 修改权限组
     */
    updateGroup(params: BPM.System.PermissionGroupModel)
        : Promise<Common.Res<void>> {
        return axios.put(`${path}/update_group`, params);
    },

    /**
     * 通过应用编码查询应用权限
     * @param appCode 
     */
    getAppPackage(appCode: string)
        : Promise<Common.Res<BPM.System.AppPackagePermissionModel>> {
        return axios.get(`${path}/get_apppackage`, {
            params: {
                appCode
            }
        });
    }
}