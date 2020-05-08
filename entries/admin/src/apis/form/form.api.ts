
import axios from 'axios';

import { FormItem, FormUpdate } from './form-typings';


const path = '/api/app/bizsheet';

export function errorHandle(res: any) {

  if (res.hasOwnProperty('errcode') && res.errcode !== 0) {
    return Promise.reject(res);
  }

  return res;
}

export function list(schemaCode: string) {
  return axios.get(`${path}/list`, {
    params: {
      schemaCode
    }
  }).then(errorHandle);
}


export function get(schemaCode: string, sheetCode: string) {
  return axios.get(`${path}/get`, {
    params: {
      schemaCode,
      sheetCode
    }
  }).then(errorHandle);
}


export function remove(schemaCode: string, sheetCode: string) {
  return (axios.delete(`${path}/delete`, {
    params: {
      schemaCode,
      sheetCode
    }
  }) as any).then(errorHandle);
}


export function create(data: FormUpdate) {
  return axios.post(`${path}/create`, data).then(errorHandle);
}


export function update(data: FormUpdate) {
  return axios.put(`${path}/update`, data).then(errorHandle);
}

export function publish(data: FormUpdate) {
  return axios.put(`${path}/publish`, data).then(errorHandle);
}
export function getShortCode(schemaCode:string,sheetCode:string) {
  return axios.get(`${path}/getShortCode`, {
    params: {
      schemaCode,
      sheetCode
    }
  }).then(errorHandle);
}
