import axios from './axios';

import { HttpResponse } from './response';

import * as form from './form-params';

import api from './api.mappings';

export class FormApi {

  /**
   * 表单加载
   * @param params
   */
  load(params: any): Promise<HttpResponse<form.FormObject>> {
    return axios.get(api.form.load, {
      params
    });
  }

  /**
   * 暂存
   * @param params
   */
  save(params: form.SaveParams, path?: string):
    Promise<HttpResponse<any>> {
    const url = path ? `${path}/save` : api.form.save;
    return axios.post(url, params);
  }

  /**
   * 提交
   * @param params
   */
  submit(params: form.SubmitParams, path?: string):
    Promise<HttpResponse<void>> {
    const url = path ? `${path}/submit` : api.form.submit;
    return axios.post(url, params);
  }

  /**
   * 删除业务表单
   * @param params
   */
  delete(params: form.DeleteFormParams, path?: string):
    Promise<HttpResponse<void>> {
    const url = path ? `${path}/delete` : api.form.delete;
    return axios.delete(url, {
      params
    });
  }

  /**
   * 检查工作项是否存在
   * @param workflowInstanceId
   */
  workItemExist(workflowInstanceId: string, ownerId: string): Promise<HttpResponse<string>> {
    return axios.get(api.form.workItemExist, {
      params: {
        workflowInstanceId,
        ownerId
      }
    });
  }

  /**
   * 获取催办记录列表
   */
  getUrgeList(instanceId: string): Promise<HttpResponse<any>> {
    return axios.get(api.form.getUrgeList, {
      params: {
        instanceId
      }
    });
  }

  /**
   * 保存催办消息
   * web端发送消息
   */
  saveDing(params: form.SaveDingParams): Promise<HttpResponse<any>> {
    return axios.post(api.form.saveDing, params);
  }

  /**
   * 获取待办用户id
   */
  getTodoUsers(instanceId: string): Promise<HttpResponse<any>> {
    return axios.get(api.form.getTodoUsers, {
      params: {
        instanceId
      }
    });
  }

  /**
   * 子表导入
   */
  importData(params: form.ImportSheetParams): Promise<HttpResponse<any>> {

    return axios.post(api.form.importData, params)
  }

  /**
   * 子表导出
   */
  exportData(params: form.ImportSheetParams): Promise<HttpResponse<any>> {
    return axios.post(api.form.exportData, params)
  }

  /**
   * 子表模板导出
   */
  exportTemplate(params: form.ImportSheetParams): Promise<HttpResponse<any>> {
    return axios.post(api.form.exportTemplate, params)
  }

  /**
   * 获取表单短码
   */
  getShortCode(params: form.LoadParams): Promise<HttpResponse<any>> {
    return axios.get(api.form.getShortCode, {
      params
    })
  }

  /**
   * 更新子表排序
   */
  updateSortkey(params: form.UpdateSortkeyParams): Promise<HttpResponse<any>> {
    return axios.put(api.form.updateSortkey, params);
  }

  /**
   * 获取打印模板draftAttributesJson的接口
   */
  getPrintAttributesJson(params: form.getDraftAttributesJsonParams): Promise<HttpResponse<any>> {
    return axios.get(api.form.get, { params });
  }

  /*
   * @params {"htmlName": "文件名","htmlContent": "文件内容"}
  */
  toHtml(params: object): Promise<HttpResponse<any>> {
    return axios.post(api.form.toHtml, params);
  }

  /*
  * @params string htmlName为文件文件名，生成PDF文件
   */
  makePDF(params: any): Promise<HttpResponse<any>> {
    return axios.get(api.form.pdf, { params });
  }

  getMessageFormUrl(params: form.getMessageFormUrlParams)
    : Promise<HttpResponse<form.getMessageFormUrlResult>> {
    return axios.get(api.form.getMessageFormUrl, {
      params
    });
  }

  /*
  * @params 获取关联表单title
   */
  getBizModelName(schemaCode: string): Promise<HttpResponse<form.getMessageFormUrlResult>> {
    return axios.get(api.form.getBizModelName, {
      params: {
        schemaCode
      }
    });
  }
}


