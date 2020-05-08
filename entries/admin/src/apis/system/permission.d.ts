
declare namespace BPM {

    export namespace System {

        /**
         * 权限组
         */
        export interface PermissionGroupModel {
            /**
             * 关联的应用编码
             */
            appCode: string

            /**
             * 数据权限
             */
            dataPermissionGroups: AppFunctionPermissionModel[]

            /**
             * 权限组关联的部门或人
             * @param string 
             * @param optional 
             */
            departments: string

            /**
             * 权限组Id
             * @param string 
             * @param optional 
             */
            id: string

            /**
             * 权限组名称
             * @param string
             * @param optional 
             */
            name: string

            /**
             * 权限组关联的角色
             * @param string 
             * @param optional 
             */
            roles: string,
            
            /**
             * 外部用户
             * @param string 
             * @param optional 
             */
            externalUser: boolean,

            /**
             * 授权类型
             * @param string
             * @param optional
             */
            authorType: number
        }

        /**
         * 应用目录权限
         */
        export interface AppFunctionPermissionModel {

            /**
             * 自定义数据权限
             * @param Array 
             * @param param1 
             * @param optional 
             */
            conditions: AppFunctionPermissionConditionModel[]

            /**
             * 数据权限类型1, 2, 3, 4
             */
            dataPermissionType: number

            /**
             * 可新增
             * @param boolean 
             * @param optional 
             */
            creatable: boolean
            /**
             * 可删除
             */
            deletable: boolean

            /**
             * 可编辑
             */
            editable: boolean
            /**
             * 可导出
             */
            exportable: boolean
            
            /**
             * 批量打印二维码
             */
            printAble: boolean
            
            /**
             * 过滤条件类型 1全部 2部分
             */
            filterType:number
            /**
             * 过滤条件类型名称
             */
            filterTypeName: string
            /**
             * 目录编码
             */
            functionCode: string
            /**
             * 目录名称
             */
            functionName: string
            /**
             * ID
             */
            id: string
            /**
             * 可导入
             */
            importable: boolean
            /**
             * 数据权限类型名称
             */
            managerTypeName: string
            /**
             * 关联的权限组的Id
             */
            permissionGroupId: string
            /**
             * 数据模型编码
             */
            schemaCode: string
            /**
             * 数据模型名称
             */
            schemaName: string
            /**
             * 是否可见
             */
            visible: boolean

            /**
             * 节点类型
             * page自定义页面
             */
            nodeType : 'Page' | 'BizModel'
        }

        /**
         * 应用目录权限条件
         */
        export interface AppFunctionPermissionConditionModel {

            id?: string

            functionId ?: string

            /**
             *  过滤条件类型 =['1', '2', '3', '4', '5', '6'],
             */
            operatorType: string
            /**
             *  过滤条件名称
             */
            operatorTypeName: string
            /**
             * 数据项编码
             */
            propertyCode: string
            /**
             * 数据项名称
             */
            propertyName: string
            /**
             * 模型编码
             */
            schemaCode: string
            /**
             * 过滤条件值
             */
            value: any
        }

        /**
         * 更新应用权限参数
         */
        export interface UpdateAppPackageParams {
            /**
             * 应用编码
             */
            appCode: string
            /**
             * 可见类型 1所有，2部分
             */
            visibleType: string
        }

        /**
         * 应用权限
         */
        export interface AppPackagePermissionModel {

            id : string

            departments : string

            roles : string

            visibleType : number

            permissionGroups : PermissionGroupModel[]
        }

         /**
         * 授权提交参数
         */
        export interface PermParams {
          authDeparts: Array<string>,
          authRoles: Array<string>
          authUsers: Array<string>,
          permMode: PermMode
        }

        export enum PermMode {
          ALL = 'ALL',
          PART = 'PART'
        }

    }

}