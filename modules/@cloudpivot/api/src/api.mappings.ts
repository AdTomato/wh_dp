const
  prefix_app = '/api/runtime/app',
  prefix_workflow = '/api/runtime/workflow',
  prefix_form = '/api/runtime/form/',
  prefix_bizsheet = '/api/app/bizsheet/',
  prefix_urge = '/api/runtime/urge/',
  prefix_bizproperty = '/api/app/bizproperty/',
  prefix_convert = '/api/runtime/convert/',
  prefix_log = '/api/log/'
  ;


export interface ApiMap {
  [name: string]: {
    [key: string]: string
  }
}


const original: ApiMap = {
  /**
   * 应用中心
   */
  application: {
    appListApps: prefix_app + '/list_apps',
    appListFunctionsByCode: prefix_app + '/list_functions_by_appcode',
    appListFunctionsById: prefix_app + '/list_functions_by_id',
    appListRecentBizModels: prefix_app + '/list_recent_bizModel',
    appPackageGetSingleInfo: '/api/app/apppackage/get',
    appPackageTree: '/api/app/apppackage/trees',
    appPackageSearch: '/api/app/apppackage/search',
    appQueryGet: '/api/app/query/get',
    appSearchBizModels: prefix_app + '/search_bizModels',
    deleteListData: '/api/runtime/query/delete_data',
    getFormUrl: '/api/runtime/form/get_form_url',
    queryDownloadResult: '/api/runtime/query/download_result',
    queryExportData: '/api/runtime/query/export_data',
    queryExportTemplate: '/api/runtime/query/export_template',
    queryImportData: '/api/runtime/query/import_data',
    queryImportProgress: '/api/runtime/query/import_progress',
    queryList: '/api/runtime/query/list',
    queryListReverseSheet: '/api/runtime/query/list_reverse_sheet',
    listSkipQueryList: '/api/runtime/query/listSkipQueryList',
    importQueryField: '/api/app/bizproperty/list',
    checkDeleteItem: '/api/runtime/query/checkForRemoveBizObject',
    genShortCodes: '/api/runtime/query/genShortCodes',
    getReport: '/api/report/frontget',
    queryHeaders: '/api/runtime/query/getHeaders',
    secondImportData: '/api/runtime/query/second_import_data',
  },
  /**
   * 流程相关
   */
  workflow: {
    abortInstance: prefix_workflow + '/abort_instance',
    activateActivity: prefix_workflow + '/activate_activity',
    adjustWorkitemParticipators: prefix_workflow + '/adjust_workItem_participators',
    assistWorkitem: prefix_workflow + '/assist_workItem',
    cancelActivity: prefix_workflow + '/cancel_activity',
    circulateWorkitem: prefix_workflow + '/circulate_workItem',
    createFavoriteWorkflow: '/api/runtime/favorites/create_favorites_workflow',
    deleteFavoriteWorkflow: '/api/runtime/favorites/delete_favorites_workflow',
    deleteInstance: prefix_workflow + '/delete_instance',
    finishInstance: prefix_workflow + '/finish_instance',
    forwardWorkitem: prefix_workflow + '/forward_workItem',
    getComment: prefix_workflow + '/get_comment',
    getParticipants: prefix_workflow + '/get_participants',
    getWorkCount: prefix_workflow + '/get_work_count',
    listFavoritesWorkflow: '/api/runtime/favorites/list_favorites_workflow',
    listFinishedCirculates: prefix_workflow + '/list_finished_circulates',
    listFinishedWorkitems: prefix_workflow + '/list_finished_workitems',
    listInstances: prefix_workflow + '/list_instances',
    listMyInstances: prefix_workflow + '/list_my_instances',
    listMyWorkflow: prefix_workflow + '/list_my_workflow',
    listMyWorkflowByFolderId: prefix_workflow + '/list_my_workflow_by_folder_id',
    listMyWorkflowByName: prefix_workflow + '/list_my_workflow_by_name',
    listRejectActivities: prefix_workflow + '/list_reject_activities',
    listWorkitemApprovals: prefix_workflow + '/list_workitem_approvals',
    listWorkitems: prefix_workflow + '/list_workitems',
    rejectWorkitem: prefix_workflow + '/reject_workItem',
    revokeWorkitem: prefix_workflow + '/revoke_workitem',
    searchCirculates: prefix_workflow + '/search_circulates',
    searchWorkitems: prefix_workflow + '/search_workitems',
    updateCirculateReaded: prefix_workflow + '/update_circulate_readed',
    workflowList: '/api/workflow/list',
    listOperation: prefix_workflow + '/list_operation',
    getActivityPreprocessors: prefix_workflow + '/get_activity_preprocessors',
    adjustParticipantors: prefix_workflow + '/adjust_participantors',
    listWorkflowInstanceActivity: prefix_workflow + '/list_workflow_instance_activity',
    getInstanceBaseInfo: prefix_workflow + '/get_instance_baseinfo',
    listInstanceLogs: prefix_workflow + '/list_instance_logs',
    getWorkflowtemplateChart: prefix_workflow + '/get_workflowtemplate_chart',
    isRetrieve: prefix_workflow + '/is_retrieve',
    getWorkitemByInstanceid: prefix_workflow + '/get_workitem_by_instanceid'
  },
  /**
   * 用户信息
   */
  user: {
    getInfo: '/api/organization/user/info',
    departments: '/api/organization/user/departments'
  },
  /**
   * 机构
   */
  organization: {
    departmentTree: '/api/organization/department/tree',
    departmentListUser: '/api/organization/department/list_user',
    userTreeSearch: '/api/organization/user/tree/search',
    roleTree: '/api/organization/role/list',
    roleUsersByGroupid: '/api/organization/role/childs',
    getRolesByGroupParams: '/api/organization/role/page/childs',
    searchRoleByName: '/api/organization/role/get_role_by_name',
    roleGroupByCode: '/api/organization/role/get_rolegroup_by_code',
    
  },
  /**
   * 表单
   */
  form: {
    load: prefix_form + 'load',
    save: prefix_form + 'save',
    submit: prefix_form + 'submit',
    delete: prefix_form + 'delete',
    workItemExist: prefix_form + 'workitem_exist',
    importData: prefix_form + 'import_data',
    exportData: prefix_form + 'export_data',
    exportTemplate: prefix_form + 'export_template',
    getMessageFormUrl: prefix_form + 'get_message_form_url',
    getUrgeList: prefix_urge + 'findAll',
    saveDing: prefix_urge + 'saveDing',
    getTodoUsers: prefix_urge + 'todoUser',
    getShortCode: prefix_bizsheet + 'getShortCode',
    updateSortkey: prefix_bizsheet + 'updateSortkey',
    get: prefix_bizsheet + 'get',
    toHtml: prefix_convert + 'tohtml',
    pdf: prefix_convert + 'pdf',
    getBizModelName: '/api/app/query/getBizModelName'
  },
  /**
   * 外链
   */

  externalLink: {
    sheet: '/externalLink/sheet',
    generateQrcode: '/api/qrcode/generate_qrcode',
    getShortCode: '/externalLink/getShortCode'
  },
  /**
   * 系统管理 api
   */
  systemManage: {
    getBizRuleLogDetail: prefix_log + 'getBizRuleLogDetail',
    listBizRuleLog: prefix_log + 'listBizRuleLog'
  },

  /**
   * 业务模型
   */
  bizproperty: {
    sortkeys: prefix_bizproperty + 'sortkeys'
  },

  dingTalk: {
    sign: '/api/dingtalk/sign',
    login: '/login/mobile/ajax'
  },

  common: {
    systemConfig: '/public/system/config'
  }
};

let api = Object.assign({}, original);

export function assign(source: ApiMap) {

  if (!source) {
    return;
  }

  Object.keys(source).forEach(key => {
    if (api[key]) {
      api[key] = Object.assign({}, api[key], source[key]);
    } else {
      api[key] = source[key];
    }
  });
}

export default api;
