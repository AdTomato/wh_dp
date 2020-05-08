import axios from './axios';

import Mappings from './api.mappings';

import * as wf from './workflow-params';

import { HttpResponse } from './response';


export class WorkflowApi {

  /**
   * 获取驳回页面的流程节点列表
   */
  getRejectActivities(params: wf.GetRejectActivitiesParams):
    Promise<HttpResponse<wf.RejectActivity[]>> {
    return axios.get(Mappings.workflow.listRejectActivities, {
      params
    });
  }

  /**
   * 驳回
   * @param params
   */
  rejectWorkItem(params: wf.RejectParams):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.rejectWorkitem, params);
  }

  /**
   * 撤回
   * @param params
   */
  revokeWorkItem(params: wf.RevokeWorkitemParams):
    Promise<HttpResponse<boolean>> {
    return axios.get(Mappings.workflow.revokeWorkitem, {
      params
    });
  }

  /**
   * 作废流程实例
   * @param workflowInstanceId
   */
  abortInstance(workflowInstanceId: string):
    Promise<HttpResponse<void>> {
    return axios.get(Mappings.workflow.abortInstance, {
      params: { workflowInstanceId }
    });
  }

  /**
   * 删除流程实例
   * @param workflowInstanceId
   */
  deleteInstance(workflowInstanceId: string):
    Promise<HttpResponse<void>> {
    return axios.delete(Mappings.workflow.deleteInstance, {
      params: { workflowInstanceId }
    });
  }

  /**
   * 结束流程实例
   * @param workflowInstanceId
   */
  finishInstance(workflowInstanceId: string):
    Promise<HttpResponse<void>> {
    return axios.get(Mappings.workflow.finishInstance, {
      params: { workflowInstanceId }
    });
  }

  /**
   * 更新已阅
   * @param params
   */
  updateCirculateReaded(params: wf.UpdateCirculateReadedParams):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.updateCirculateReaded, params);
  }

  /**
   * 转办
   */
  forwardWorkItem(params: wf.ForwardParams):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.forwardWorkitem, params);
  }

  /**
   * 协办
   */
  assistWorkItem(params: wf.AssistParams):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.assistWorkitem, params);
  }

  /**
   * 传阅
   */
  circulateWorkItem(params: wf.AssistParams):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.circulateWorkitem, params);
  }
  /**
   * 取消当前活动的所有代办任务
   * @param params
   */
  cancelActivity(params: any):
    Promise<HttpResponse<void>> {
    return axios.get(Mappings.workflow.cancelActivity, { params });
  }
  /**
   * 激活指定活动
   * @param params
   */
  activateActivity(params: any):
    Promise<HttpResponse<void>> {
    return axios.get(Mappings.workflow.activateActivity, { params });
  }
  /**
   * 加签
   */
  adjustWorkItemParticipators(params: wf.AssistParams):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.adjustWorkitemParticipators, params);
  }

  /**
   * 获取表单的审批意见
   * @param params
   */
  getComment(params: wf.GetCommentParams):
    Promise<HttpResponse<wf.BizCommentModel>> {
    return axios.get(Mappings.workflow.getComment, {
      params
    });
  }

  /**
   * 获取流程实例
   */
  getApproval(params: wf.GetWorkflowTrackParams):
    Promise<HttpResponse<wf.ApprovalInstance[]>> {
    return axios.get(Mappings.workflow.listWorkitemApprovals, { params });
  }

  /*
  * 待办列表
  */
  searchWorkitems(params: wf.SearchParams): Promise<HttpResponse<any>> {
    return axios.get(Mappings.workflow.searchWorkitems, { params });
  }

  /**
   * 获取流程图信息
   * @param params
   */
  getWorkflowOperationLog(params: wf.GetWorkflowTrackParams): Promise<HttpResponse<wf.WorkflowOperationLog[]>> {
    return axios.get(Mappings.workflow.listOperation, { params });
  }

  /**
  * 获取预估处理人
  */
  getActivityPreprocessors(params: wf.GetWorkflowTrackParams):
    Promise<HttpResponse<wf.ApprovalInstance[]>> {
    return axios.get(Mappings.workflow.getActivityPreprocessors, { params });
  }

  /**
   * 调整当前处理人
   */
  adjustParticipantors(params: any):
    Promise<HttpResponse<void>> {
    return axios.post(Mappings.workflow.adjustParticipantors, params);
  }

  /**
 * 获取节点信息
 */
  getWorkflowNodes(params: wf.GetWorkflowTrackParams):
    Promise<HttpResponse<void>> {
    return axios.get(Mappings.workflow.listWorkflowInstanceActivity, { params });
  }

  /**
 * 获取流程跟踪基础信息
 * @param params
 */
  getWorkflowBaseInfo(params: wf.GetWorkflowTrackParams): Promise<HttpResponse<wf.InstanceBaseInfo>> {
    return axios.get(Mappings.workflow.getInstanceBaseInfo, { params });
  }

    /**
   * 获取流程审批信息
   * @param params
   */
  getWorkflowLogs(params: wf.GetWorkflowTrackParams): Promise<HttpResponse<wf.WorkflowTrackLog[]>> {
    return axios.get(Mappings.workflow.listInstanceLogs, { params });
  }

    /**
   * 获取流程图信息
   * @param params
   */
  getWorkflowChart(params: wf.GetWorkflowTrackParams): Promise<HttpResponse<wf.Chart>> {
    return axios.get(Mappings.workflow.getWorkflowtemplateChart, { params });
  }

  /**
   * 查询撤回状态
   */
  isRetrieve(params: wf.GetRejectActivitiesParams) :Promise<HttpResponse<any>> {
    return axios.get(Mappings.workflow.isRetrieve, { params });
  }

  /**
   * 查询撤回后的流程实例Id
   */
  getWorkitemByInstanceid (params: wf.GetWorkitem):Promise<HttpResponse<any>>  {
    return axios.get(Mappings.workflow.getWorkitemByInstanceid, { params });
  }

  compareOperationLog(bizObjectLogId:string){
    return axios.get('/api/runtime/workflow/compareOperationLog', { params: {bizObjectLogId} })
  }
}


