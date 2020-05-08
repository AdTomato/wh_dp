import axios from 'axios';

export default {
  /**
   * 新增系统管理员
   * @param params 
   */
  creatSystemManager(params: BPM.System.CreatedSystemManager)
    : Promise<Common.Res<void>> {
    return axios.post('/api/system/create_systemmanager', params);
  },

  /**
   * 查询系统管理员与数据管理员
   * @param params
   */
  getListManager(params: BPM.System.GetManager)
    : Promise<Common.Res<void>> {
    return axios.get('/api/system/list_manager', { params });
  },

  /**
   * 创建应用管理员
   * @param params
   */
  createdappsManager(params: BPM.System.CreatedAppManagerParams)
    : Promise<Common.Res<void>> {
    const arg = {
      users: params.users,
      appPackages: params.appPackages,
      departments:params.departments,
      id: params.id
    }
    return axios.post('/api/system/create_apppackagemanager', arg);
  },

  /**
   * 更新应用管理员
   * @param params
   */
  upDateappsManager(params: BPM.System.CreatedAppManagerParams)
    : Promise<Common.Res<void>> {
    const arg = {
      users: params.users,
      appPackages: params.appPackages,
      departments:params.departments,
      id: params.id
    }
    return axios.put('/api/system/update_apppackagemanager', arg);
  },
  /**
   * 查询单个管理员
   * @param params
   */
  getManagerInfo(params: BPM.System.User)
    : Promise<Common.Res<void>> {
    return axios.get('/api/system/get_manager', { params });
  },
  /**
   * 查询数据管理员列表
   * @param params
   */
  getDataManager(params: BPM.System.GetDataManagerParams)
    : Promise<Common.Res<void>> {
    return axios.get('/api/system/list_datamanager', { params });
  },

  /**
   * 创建数据管理员
   * @param params
   */
  createdDataManager(params: BPM.System.CreatedDataManagerParams)
    : Promise<Common.Res<void>> {
      const arg = {
        appPackages: params.appPackages,
        users: params.users,
        departments: params.departments,
        dataQuery: params.dataQuery,
        dataManage: params.dataManage,
        id: params.id
      }
    return axios.post('/api/system/create_datamanager', arg);
  },
  /**
   * 更新数据管理员
   * @param params
   */
  upDateDataManager(params: BPM.System.CreatedDataManagerParams)
  : Promise<Common.Res<void>>  {
    const arg = {
      appPackages: params.appPackages,
      users: params.users,
      departments: params.departments,
      dataQuery: params.dataQuery,
      dataManage: params.dataManage,
      id: params.id
    }

    return axios.put('/api/system/update_datamanager', arg);
  },

  /**
   * 查询登陆日志
   * @param params
   */
  getLoginLog(params: BPM.System.GetLoginLogParams)
    : Promise<Common.Res<void>> {
    return axios.post('/api/login/log/search', params);
  },

  /**
   * 业务服务日志
   * @param params
   */
  getBizLog(params: BPM.System.GetBizLogParams)
    : Promise<Common.Res<void>> {
    return axios.get('/api/log/list_bizservicelog', { params });
  },

  /**
   * 获取业务服务日志调用信息
   * @param params 
   */
  getBizLogReference(params: BPM.System.GetBizLogCallParams): Promise<Common.Res<void>>{
    return axios.get('/api/log/callObject',{ params })
  },

  /**
   * 删除管理员
   * @param params
   */
  deleteManager(params: BPM.System.User)
    : Promise<Common.Res<void>> {
    return axios.delete('/api/system/delete_manager', { params });
  },

  /**
   * 获取钉钉配置参数
   */
  getDingtalkParams():Promise<Common.Res<void>> {
    return axios.get('/api/system/get_dingtalk_integration');
  },

  /**
   * 保存钉钉配置参数
   */
  createdDingtalkParams(params: BPM.System.CreatedDingtalkParams):Promise<Common.Res<void>> {
    return axios.post('/api/system/save_dingtalk_integration', params);
  },

  /**
   * 连接钉钉测试
   */
  checkDingtalkParams(params: BPM.System.CreatedDingtalkParams):Promise<Common.Res<void>> {
    return axios.post('/api/system/check_dingtalk_integration', params);
  },

  /**
   * 创建 oos
   */
  createdOss(params: BPM.System.FileStorageParams) :Promise<Common.Res<void>> {
    return axios.put('/api/system/update_file_config', params);
  },

  /**
   * 连接 oos
   */
  checkOss(params: BPM.System.CreateedOssParams) :Promise<Common.Res<void>> {
    return axios.post('/api/system/check_file_config', params);
  },

  /**
   * 查询 oss
   */

  getOss() :Promise<Common.Res<void>> {
    return axios.get('/api/system/get_File_config');
  },
  /**
   * 查询增量同步 uri
   */
  getSynRedirectUri() :Promise<Common.Res<void>> {
    return axios.get('/api/system/get_syn_redirect_uri');
  },
  creatSynRedirectUri(params: BPM.System.CreatSynRedirectUri) :Promise<Common.Res<void>>{
    return axios.post('/api/system/save_syn_redirect_uri', params);
  },

  /**
   *  查询门户设置
   * @param params 
   */
  getPortalSetting() :Promise<Common.Res<void>> {
    return axios.get('/api/system/get_portal_config');
  },

  /**
   *  创建 门户设置
   * @param params 
   */
  creatPortalSetting(params: BPM.System.CreatPortalSetting) :Promise<Common.Res<void>> {
    return axios.post('/api/system/save_portal_config', params);
  },
  /**
   * 连接测试 门户设置
   * @param params 
   */
  checkPortalSetting(params: BPM.System.CreatPortalSetting) :Promise<Common.Res<void>> {
    return axios.post('/api/system/check_portal_config', params);
  },
  /**
   * 查询异常日志
   * @param params 
   */
  getErrorLog(params: BPM.System.GetErrorLogParams)
    : Promise<Common.Res<void>> {
    return axios.get('/api/log/list_exception', {
      params
    })
  },
  /**
   * 修复异常流程
   * @param params 
   */
  fixException(params: BPM.System.ExceptionItemParams)
    : Promise<Common.Res<void>> {
    return axios.get('/api/runtime/workflow/fix_activity', {
      params
    })
  },
  /**
   * 获取异常日志详情
   * @param params 
   */
  getExceptionInfo(params: BPM.System.ExceptionItemParams)
  :Promise<Common.Res<BPM.System.ExceptionInfo>> {
    return axios.get('/api/log/get_exception', {
      params
    })
  },
  /**
   * 获取异常日志条目对应的workItem以打开表单
   * @param params 
   */
  getWorkItemByInstanceId(params: BPM.System.ExceptionFormParams)
  :Promise<Common.Data> {
    return axios.get('/api/runtime/form/load', {
      params
    })
  },
  /**
   * 获取钉钉配置数量
   */
  getConfigCount() :Promise<Common.Data> {
    return axios.get('/api/system/count_config');
  },

  /**
   * 获取是否是新用户
   */
  getUserGuide(params:BPM.System.UserGuide):Promise<Common.Data> {
    return axios.get('/api/system/get_user_guide', { params });
  },

  /**
   * 更新用户的新用户状态 
   */
  updateUserGuide(params:BPM.System.UserGuide):Promise<Common.Data> {
    return axios.put('/api/system/update_user_guide', params);
  },

  /**
   * 获取License基本信息
   */
  getLicenseInfo():Promise<Common.Data> {
    return axios.get('/api/license/info');
  },

  /**
   * 获取License到期时间
   */
  getLicenseExpired():Promise<Common.Data> {
    return axios.get('/api/license/notifyExpired');
  },

  // 获取授权权限
  getAuGateway():Promise<Common.Data>{
    return axios.get('/api/permLicense/get_gateway');
  },
  

  // 获取授权信息
  getPermInfo():Promise<Common.Data>{
    return axios.get('/api/permLicense/load_perm_license');
  },

  // 设置用户授权
  setPermInfo(params:BPM.System.PermParams):Promise<Common.Data>{
    return axios.post('/api/permLicense/set_perm_license', params);
  }
}
