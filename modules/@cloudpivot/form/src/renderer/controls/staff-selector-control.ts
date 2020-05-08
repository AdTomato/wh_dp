
import { Subscription } from 'rxjs';

import * as typings from '../typings';

import { BaseControl } from './base-control';
import * as schema from '../../schema';

import {
    SelectControl, RadioControl, Control, ControlValueChange,
    ControlPropertyChange, FormGroup
} from 'h3-forms';


export abstract class StaffSelectorControl extends BaseControl<typings.StaffSelectorOptions> {

    static service: UserService

    val: any[] = [];

    staffSelectorOpts: any = {};

    refSubscription?: Subscription;

    get text(){
        return this.val.map(x => x.name).join(';');
    }

    get displayType(){
        if(this.controlOpts.displayType){
            return this.controlOpts.displayType;
        }
        return schema.DisplayType.Tag;
    }

    setControl() {
        this.staffSelectorOpts = this.createOptions();

        this.unsubscribe();

        let key = this.controlOpts.orgRoot;

        if (this.controlOpts.orgRootValueType === schema.StaffSelectorValueType.Ref
            && key && typeof key === 'string') {
            key = key.substr(1, key.length - 2);

            const ctrl = this.findController(key) as RadioControl;

            if (ctrl) {

                if(ctrl.value){
                    this.$set(this.staffSelectorOpts, 'rootNode', ctrl.value);
                }

                this.refSubscription = ctrl.valueChange.subscribe((change) => {
                    this.$set(this.staffSelectorOpts, 'rootNode', change.value);
                });
            }
        }

        this.handleValueChange(this.ctrl.value);
    }
    
    handleValueChange(value: any): void {
        this.val = value ? value : [];
    }

    unsubscribe() {
        if (this.refSubscription) {
            this.refSubscription.unsubscribe();
        }
    }

    createOptions() {
        const opts = this.controlOpts;
        const dept = opts.deptVisible;

        const selectOrg = dept === 'all' || dept === 'org';
        const selectUser = dept === 'all' || dept === 'user';

        let root: any;

        if (this.controlOpts.orgRootValueType === schema.StaffSelectorValueType.None) {
            if (opts.orgRoot && typeof opts.orgRoot === 'string') {
                try {
                    root = JSON.parse(opts.orgRoot);
                } catch (error) {
                    
                }
            } else if (Array.isArray(opts.orgRoot)) {
                root = opts.orgRoot;
            }
        } else if (this.controlOpts.orgRootValueType === schema.StaffSelectorValueType.OriginatorDept) {
            root = StaffSelectorControl.service.getCurrentUserDept();
        }

        if (root && !Array.isArray(root)) {
            root = [root];
        }

        let role: any;
        if (opts.roles && typeof opts.roles === 'string') {
            role = JSON.parse(opts.roles);
        }

        return {
            key: this.control.key,
            selectOrg: selectOrg,
            selectUser: selectUser,
            mulpitle: Boolean(this.controlOpts.multi),
            rootNode: root,
            role: role,
            showModel: true,
            showSelect: true,
            recursive : this.controlOpts.recursive,
            placeholder: this.placeholder
        };
    }

    destroyed() {
        super.destroyed();

        this.unsubscribe();
    }

    // setCurrentUser() {
    //     const user = StaffSelectorControl.service.getCurrentUser();
    //     if (user) {
    //         this.ctrl.value = [user];
    //     }
    // }

    // setCurrentUserDept() {
    //     const dept = StaffSelectorControl.service.getCurrentUserDept();
    //     if (dept) {
    //         this.ctrl.value = [dept];
    //     }
    // }

    // initValue() {
    //     if (!this.control.value || !this.control.value.length) {
    //         const type = this.controlOpts.defaultValueType;
    //         if (type === typings.StaffSelectorValueType.Originator) {
    //             this.setCurrentUser();
    //         } else if (type === typings.StaffSelectorValueType.OriginatorDept) {
    //             this.setCurrentUserDept();
    //         }
    //     }
    // }

}

/**
 * 机构类型
 */
export enum OrganizationType {

    /**
     * 部门
     */
    Department = 1,

    /**
     * 角色
     */
    Role = 2,

    /**
     * 用户
     */
    User = 3

}


export interface OrganizationBase {

    id: string

    name: string



}


export interface DepartmentInfo extends OrganizationBase {

    /**
     * 员工数
     */
    employees: number

    /**
     * 叶子节点
     */
    leaf: boolean

    /**
     * 父级部门ID
     */
    parentId?: string

    type: OrganizationType
}

/**
 * 用户状态
 */
export enum UserStatus {

    /**
     * 启用
     */
    Enable = 'ENABLE',

    /**
     * 禁用
     */
    Disable = 'DISABLE'

}


export interface UserInfo extends OrganizationBase {

    /**
     * 头像
     */
    imgUrl?: string

    status: UserStatus

    [key: string]: any

    type: OrganizationType
}


export interface UserService {

    /**
     * 当前登录用户
     */
    getCurrentUser(): UserInfo | null

    /**
     * 当前登录用户部门
     */
    getCurrentUserDept(): DepartmentInfo | null

    /**
     * 获取部门集合
     * @param deptId 所属部门ID，无值时获取根部门，多个时以“,”分割
     */
    getDepartmentsBy(deptIds?: string, filterType?:string): Promise<{
        departments: DepartmentInfo[]
        myDepartment?: DepartmentInfo[]
    }>

    /**
     * 获取用户集合
     * @param deptId 所属部门ID
     * @param roleId 所属角色ID
     */
    getUsersBy(deptId: string, roleId?: string,filterType?: string): Promise<UserInfo[]>

    /**
     * 搜索部门和用户
     * @param name 名称
     * @param deptIds 部门编码 “,”分割
     * @param roleIds 角色编码 “,”分割
     */
    search(name: string, deptIds?: string, roleIds?: string, filterType?:string): Promise<{
        departments?: DepartmentInfo[]
        users?: UserInfo[]
    }>

    /**
     * 根据用户ID获取部门列表
     * @param userId 
     */
    getUserDepartments(userId: string): Promise<OrganizationBase[] | null>
}