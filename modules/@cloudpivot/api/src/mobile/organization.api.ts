import Axios from '../axios';

import Mappings from '../api.mappings';

import { HttpResponse } from '../response';

export class OrganizationApi {

  // 错误处理
  errorHandle(res: any) {
    if (res.hasOwnProperty('errcode') && res.errcode !== 0) {
      return Promise.reject(res);
    }
    return res;
  }

  // 下一级-组织树
  getOrgTree(deptIds: any,filterType?:string): Promise<HttpResponse<any>>  {
    return Axios.get(Mappings.organization.departmentTree, {
      params: {
        deptIds,
        filterType
      }
    }).then(this.errorHandle);
  }

  // 下一级-用户
  getUsersTree(deptId: string, roleId?: string): Promise<HttpResponse<any>>  {
    return Axios.get(Mappings.organization.departmentListUser, {
      params: {
        deptId,
        roleId
      }
    }).then(this.errorHandle);
  }

  /**
   * 选人控件根据名称搜索人或部门
   * @param name
   * @param deptIds 部门编码 “,”分割
   * @param roleIds 角色编码 “,”分割
   */
  search(name: string, deptIds?: string, roleIds?: string) {
    return Axios.get(Mappings.organization.userTreeSearch, {
      params: {
        name,
        deptIds,
        roleIds
      }
    }).then(this.errorHandle);
  }

  getRoleGroupList(expandAll?: boolean) {
    return Axios.get(Mappings.organization.roleTree, {
      params: {
        expandAll: !!expandAll
      }
    })
  }

  getRolesByGroupid(groupId: string) {
    return Axios.get(Mappings.organization.roleUsersByGroupid, {
      params: {
        groupId,
      }
    })
  }

  searchRolesByName(roleName: string){
    return Axios.get(Mappings.organization.searchRoleByName, {
      params: {
        roleName
      }
    })
  }

  getRoleGroupByCode(roleCode: string) {
    return Axios.get(Mappings.organization.roleGroupByCode, {
      params: {
        roleCode
      }
    });
  }

  getRolesByGroupParams(params: any) {
    return Axios.get(Mappings.organization.getRolesByGroupParams, {
      params
    })
  }
};
