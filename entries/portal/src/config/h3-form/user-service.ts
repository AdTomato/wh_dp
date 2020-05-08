
import {
  renderer
} from '@cloudpivot/form';


import { organizationApi } from '@cloudpivot/api';

import { userApi } from '@cloudpivot/api';


export class DefaultUserService implements renderer.UserService {
  getCurrentUser() {
    const json = sessionStorage.getItem('user');
    if (json) {
      const user = JSON.parse(json);
      user.type = renderer.OrganizationType.User;

      user.departments = [{
        id: user.departmentId,
        name: user.departmentName,
        type: renderer.OrganizationType.Department,
        leaf: false,
        employees: 0
      }];

      return user;
    }
    return null;
  }

  getCurrentUserDept() {
    const user = this.getCurrentUser();
    if (!user || user.departments.length === 0) {
      return null;
    }
    return user.departments[0];
  }


  async getDepartmentsBy(deptIds?: string): Promise<{
    departments: renderer.DepartmentInfo[]
    myDepartment?: renderer.DepartmentInfo[]
  }> {
    const res = await organizationApi.getOrgTree(deptIds);
    const data = res.data;

    const map = (d: any) => {
      d.type = renderer.OrganizationType.Department;
      return d;
    };

    const departments = data.departmentList.map(map);

    let myDepartment: renderer.DepartmentInfo[] | undefined;

    if (data.myDepartment) {
      myDepartment = data.myDepartment.map(map);
    }

    return {
      departments,
      myDepartment
    };
  }


  async getUsersBy(deptId: string, roleId?: string): Promise<renderer.UserInfo[]> {
    const res = await organizationApi.getUsersTree(deptId, roleId);
    const data = res.data;

    const map = (d: any) => {
      d.type = renderer.OrganizationType.User;
      if (Array.isArray(d.departments)) {
        d.parentId = d.departments.filter((f: any) => f && f.id).map((m: any) => m.id);
      }
      return d;
    };

    const users = data.map(map);
    return users;
  }


  async search(name: string, deptIds?: string, roleIds?: string): Promise<{
    departments?: renderer.DepartmentInfo[]
    users?: renderer.UserInfo[]
  }> {
    const res = await organizationApi.search(name, deptIds, roleIds);
    const data = res.data;

    let departments: renderer.DepartmentInfo[] | undefined;
    let users: renderer.UserInfo[] | undefined;

    if (data.departments) {
      departments = data.departments.map((d: any) => {
        d.type = renderer.OrganizationType.Department;
        return d;
      });
    }

    if (data.users) {
      users = data.users.map((u: any) => {
        u.type = renderer.OrganizationType.User;
        if (Array.isArray(u.departments)) {
          u.parentId = u.departments.filter((d: any) => d && d.id).map((d: any) => d.id);
        }
        return u;
      });
    }

    return {
      departments,
      users
    };
  }

  async getUserDepartments(userId: string) {
    const res = await userApi.getUserDepartments(userId);
    if (res.errcode !== 0 || !res.data) {
      return null;
    }
    return res.data.map((d: any) => ({
      id: d.deptId,
      name: d.deptName
    }));
  }

}
