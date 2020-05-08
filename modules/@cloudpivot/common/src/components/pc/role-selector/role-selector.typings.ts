export interface RoleItem {
  name: string,
  id: string,
  code: string,
  groupId: string,
  groupName?: string,
  displayName?: string,
}

export interface RoleGroupItem {
  name: string,
  id: string,
  children: Array<RoleItem>,
  total?: number | null
}

export interface GroupRolesParams {
  groupId: string,
  page: number,
  size: number,
}