
import axios from 'axios';

export interface Comment {

  content: string

  id: string

  sortKey: number
}

const path = '/api/runtime/comment';

// 错误处理
export function errorHandle(res: any) {
  if (res.hasOwnProperty('errcode') && res.errcode !== 0) {
    return Promise.reject(res);
  }
  return res;
}

export function list() : Promise<any>{
  return axios.get(`${path}/list`);
}
