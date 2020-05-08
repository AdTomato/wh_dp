declare namespace Organization {
  enum UnitType {
    Deaprtment=1,
    Role=2,
    User=3,
  }
 // 组织树
  interface OrgNode {
    id: string,
    code: string,
    name: string,
    leaf: boolean,
    unitType: UnitType,
    parentId: string,
    sortKey: number,
    childrenUsers: number,
    managerId: string,
    employees: number,
    groupId?: string,
    roleType?: string,
    children: Array<OrgNode>
  }
  // 公司组织机构树
  interface OrgTree {
    rootNode: OrgNode,
  }
  // 展开组织机构树
  export interface SelectTreeNode {
    eventKey?: string,
    dataRef: any,
  }
  // 表格的头
  export interface TableHead{
    title?: string,
    dataIndex: string,
    scopedSlots?: Action,
    filteredValue?: string,
    key?: string,
    onFilter?: any,
    slots?: object,
    align?: string,
    width?: any
  }
  // 表格头部的插槽名称
  export interface TableTitleSlots {

  }
  // 表格操作
  export interface Action {
    customRender: string,
    filterDropdown?: string,
    filterIcon?: string,
    scopedSlots?: any,
  }
  namespace Users {
    export interface RequestParams {
      // 定义请求参数结构
      id: string,
      // 定义获取应用管理员管理的应用模型过滤参数
      filterType?: string
    }

    export interface EduRequestParams {
      userId: string,
      deptId: string
    }

    export interface PasswordParams {
      username: string,
      oldPassword: string,
      newPassword: string
    }

    export interface UpdateMainParams {
      // 更改主部门参数
      deptId: string,
      main: boolean,
      userId: string,
    }
    export interface OrgTreeParams {
      // 定义组织机构树请求参数结构
      deptId: string,
      filterType?: string,
    }
    export interface OrgUserListParams {
      // 定义组织机构的用户列表请求参数
      deptId: string,
      page: number,
      size: number,
      filterType?: string,
    }
    export interface SearchUserListParams {
      // 定义根据用户名搜索组织机构的用户请求参数
      wd: string,
      page: number,
      size: number,
      filterType?: string,
    }
    // 用户信息
    interface OrgUserNode {
      id: string,
      name: string,
      status: string,
      managerId: string,
      mobile: string,
      email: string,
      password: string,
      gender: string,
      dingtalkId: string,
      imgUrl: string,
      isRemoved: string,
      privacyLevel: string,
      appellation: string,
      officePhone: string,
      employeeNo: string,
      employeeRank: string,
      secretaryId: string,
      identityNo: string,
      sourceId: string,
      sourceParentId: string,
      birthday: string,
      entryDate: string,
      departureDate: string,
      departmentId: string,
      accountId?: string,
      isAdmin: string,
      rowNum?: number,
      /* 用户信息字段 */
      accountUsername?: string,
      departmentName?: string,
      otherDepartments?: Array<string>, // 前端自定义的兼职部门字段，截取于departmentName的第二个部门及之后
      roleName?: string,
      secretaryName?: string,
      managerName?: string,
      [rest: string]: any,
    }
    // 工作交接
    export interface TaskTransfer{
      myTask: Array<TodoTask>,
      selectedRowKeys: Array<number>
    }
    // 待办任务
    export interface TodoTask{
      id: string,
      task: string,
      workflowName: string,
      organizer: string,
      organizerUnit: string,
      receiveTime: string
    }

    interface OrgUserListPayload {
      data: OrgUserList,
      isSearch: boolean,
      params: any,
    }

    export interface UnitTitleObj {
      name: string,
      id: string,
      deptType: number // 1:系统部门  2:家校部门
    }

     // 公司组织机构用户列表
     interface OrgUserList {
      total: number,
      content: Array<OrgUserNode>,
      last: boolean,
      first: boolean,
      totalElements: number,
    }
      // 定义vuex state 结构
    export interface State {
      orgTree: OrgTree | null,
      orgUserList: Array<OrgUserNode> | null,
      loading: boolean,
      noUser: boolean,
      loadCompleted: boolean,
      dataRef: any,
      unitTitleObj: UnitTitleObj,
      searchTitle: string,
      userInfoParams: Users.RequestParams,
      eduUserInfoParams: Users.EduRequestParams,
      orgUserInfo: OrgUserNode | null,
    }
  }
  namespace Roles {
    export interface RequestListParams {
      roleId: string,
      page: number,
      size: number,
      name?: string,
      filterType?: string
    }
    export interface RequestChildrenTreeParams {
      groupId: string
    }
    interface RoleNode {
      id: string,
      name: string,
      code: string,
      sortKey: number
    }
    // 组织角色
    export interface RoleState {
      orgTree: OrgTree | null,
      orgTreeBySearch: OrgTree | null,
      isRoleSearchResult: boolean,
      roleList: Array<RoleInfo>,
      dataRef: any,
      loading: boolean,
      isLoadMore: boolean,
      treeParams: Roles.RequestChildrenTreeParams,
      roleTitle: RoleTitle,
      searchTips: boolean,
    }
    export interface RoleTitle {
      code: string
      name: string
      id?: string
    }
    export interface RoleInfo {
      id: string,
      name: string,
      index: number
      roleName: string,
    }
    export interface RoleListMutation {
      content: Array<RoleInfo>,
      first: boolean,
      last: boolean,
      total: number,
      page: number,
    }
    export interface RoleGroupParams {
      roleId: string
    }
    export interface RoleGroupByCodeParams {
      roleCode: string
    }

    export interface LiseTaskByUserParams {
      userId: string
      workflowCode: string
      originator: string
      page: number
      size: number
    }

    export interface BusinessTaskByUserParams {
      userId: string
      schemaCode: string
      sequenceStatus: string
      page: number
      size: number
    }

    export interface TransferParams {
      transferAll: boolean  // 是否交接全部
      transferUserId: string  //交接人id
      userId: string // 用户id
      workItemIds: Array<string> // 代办 id
      transferDeptId?: string // 任务交接人部门id
      isBusiness?: boolean  // 是否是业务数据交接
      isSyncInstance?: boolean // 是否同步更新流程实例
      originator?: string  // 发起人id
      workflowCode?: string  // 流程编码
      schemaCode?: string  // 业务模型编码
      sequenceStatus?: string  // 单据状态-可多选
    }

    export interface UpdateUserOuscope {
      ouScopeList: Array<string>
      roleId: string
      userId?: string
      deptId?: string
      unitType: number
    }

    export interface GetUserOuscope {
      roleId: string
      userId: string
    }
  }

  export interface roleGroupParams {
    roleGroupName: string,
    roleGroupId?: string,
  }

  export interface roleParams {
    roleName: string,
    roleGroupId: string,
    roleId?: string,
  }

  export interface roleDeleteParams {
    ids: string,
  }

  export interface roleUserDeleteParams {
    userIds: any,
    deptIds: any,
    roleId: string
  }

  export interface roleUserParams {
    roleId: string,
    userIds: Array<string>,
  }

}
