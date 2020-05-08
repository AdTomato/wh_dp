import axios from 'axios';

import * as DataPermissionType from './data-permission.typings';

export function getPermissions(params: DataPermissionType.getParams): Promise<Common.Data> {
  return axios.get('/api/app/bizperm/get', { params });
}

export function updatePermission(params: DataPermissionType.updateParams): Promise<Common.Data> {
  return axios.post('/api/app/bizperm/update', params);
}

export function deletePermission(params: DataPermissionType.deleteParams): Promise<Common.Data> {
  return axios.delete('/api/app/bizperm/delete', { params });
}

export function getPermProperties(params: DataPermissionType.getPropertyParams): Promise<Common.Data> {
  return axios.get('/api/app/bizperm/get_perm_properties', { params });
}
