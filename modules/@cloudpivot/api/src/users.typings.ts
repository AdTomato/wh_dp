export enum OrgType {
  Department = '1', // 部门
  Role = '2', // 角色
  User = '3'// 用户
}

/**
 * 信息
 */
export interface Info {

  id: string// 用户ID

  /**
   * 钉钉userId
   */
  dingtalkId:string

  imgUrl: string// 用户头像
  name: string// 用户姓名
  unitType: OrgType// 组织对象类型 = ['1', '2', '3']
  username: string// 用户名

  email ?:string

  mobile ?: string

  roleName ?: string

  /**
   * 状态 = ['DISABLE', 'ENABLE', 'LOCK']
   */
  status ?:string

  /**
   * 部门ID
   */
  departmentName ?: string
}