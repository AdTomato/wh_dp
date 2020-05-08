import { organizationApi } from '@cloudpivot/api';

import { searchHighLight } from '../../../utils/pc/utils';

import * as RoleSelectorTypings from './role-selector.typings';

class AbstractRoleService {
  /**
   * 整理输出角色组列表
   * @param groups 待整理的角色组列表
   */
  generateGroups(groups: Array<any>): Array<RoleSelectorTypings.RoleGroupItem> {
    return groups.map((group: any) => {
      if (group.children) {
        group.children = this.generateChilds(group.children, group.name);
      }
      return {
        name: group.name,
        id: group.id,
        total: null,
        children: group.children || []
      }
    })
  }

  /**
   * 整理输出组下的角色列表
   * @param childs 待整理的组下角色列表
   */
  generateChilds(childs: Array<any>, groupName: string): Array<RoleSelectorTypings.RoleItem> {
    return childs.map((child: any) => {
      return {
        name: child.name,
        id: child.id,
        code: child.code,
        groupId: child.groupId,
        groupName
      }
    })
  }

  /**
   * 整理输出搜索角色的结果列表
   * @param results 搜索角色结果
   */
  generateSearchRoles(results: Array<any>, wd: string): Array<RoleSelectorTypings.RoleItem> {
    // console.log(wd);
    return results.map((role: any) => {
      const displayName: string = wd ? searchHighLight(wd, role.roleName) : role.roleName;
      return {
        displayName,
        name: role.roleName,
        id: role.roleId,
        code: role.code,
        groupId: role.roleGroupId,
        groupName: role.roleGroupName
      }
    })
  }

  /**
   * 请求接口获取角色组列表
   * @param expandAll 是否展开所有角色组
   */
  async getGroupList(expandAll?: boolean) {
    let groups: Array<RoleSelectorTypings.RoleGroupItem> = [];
    const res: any = await organizationApi.getRoleGroupList(expandAll);
    if (res.errcode === 0 && Array.isArray(res.data)) {
      groups = this.generateGroups(res.data);
    } else {
      console.error(res.errmsg);
    }
    return groups;
  }

  /**
   * 根据角色组id，请求接口获取组下角色列表
   * @param params 请求参数
   * @param group 角色组
   */
  async getGroupRoles(params: RoleSelectorTypings.GroupRolesParams, group: RoleSelectorTypings.RoleGroupItem) {
    let roles: Array<RoleSelectorTypings.RoleItem> = [];
    const res: any = await organizationApi.getRolesByGroupParams(params);
    if (res.errcode === 0 && Array.isArray(res.data.content)) {
      roles = this.generateSearchRoles(res.data.content, '');
      group.total = res.data.totalElements;
    } else {
      console.error(res.errmsg);
    }
    //如果不是请求第一页的数据，则追加到子角色列表
    if (params.page !== 0) {
      roles = group.children.concat(roles);
    }
    return roles;
  }

  /**
   * 根据关键字模糊搜索角色列表（全局）
   * @param roleName 角色名关键字
   */
  async searchRoles(roleName: string) {
    // searchRolesByName
    let roles: Array<RoleSelectorTypings.RoleItem> = [];
    const res: any = await organizationApi.searchRolesByName(roleName);
    if (res.errcode === 0 && Array.isArray(res.data)) {
      roles = this.generateSearchRoles(res.data, roleName);
    } else {
      console.log(res.errmsg);
    }
    return roles;
  }

  async getRoleInfoByCode(roleCode: string) {
    const res: any = await organizationApi.getRoleGroupByCode(roleCode);
    let roleInfo: RoleSelectorTypings.RoleItem | null = null;
    if (res.errcode === 0 && res.data) {
      const { roleGroupId, roleGroupName,roleId,roleName } = res.data;
      roleInfo = {
        groupName: roleGroupName,
        groupId: roleGroupId,
        code: roleCode,
        name: roleName,
        id: roleId
      }
    }
    return roleInfo;
  }
}

export const RoleService = new AbstractRoleService();