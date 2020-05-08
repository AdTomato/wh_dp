declare namespace BPM {

  export namespace System {
    /**
     * 创建系统管理员参数
     */
    export interface CreatedSystemManager {
      users: Array<User>
    }

    /**
     * 用户信息
     */
    export interface User {
      id: string  // 用户id
    }

    /**
     * 查询管理员列表参数
     */
    export interface GetManager {
      managerType: ManagerType
    }

    /**
     * 管理员类型
     */
    enum ManagerType {
      SystemManager = 1, // 系统管理员
      AppsManager = 2, // 应用管理员
    }

    /**
     * 创建应用管理员参数
     */
    export interface CreatedAppManagerParams {
      users: Array<User>,
      appPackages: Array<App>,
      departments: Array<User>,
      id: string
    }

    /**
     * 应用编码
     */
    export interface App {
      code: string // 应用编码 
    }

    /**
     * 数据管理员查询参数
     */
    export interface GetDataManagerParams {
      page: number
      size: number
    }

    /**
     * 创建数据管理员请求参数
     */
    export interface CreatedDataManagerParams {
      appPackages: Array<App> // 应用
      users: Array<User>
      departments: Array<User>
      dataQuery: boolean // 数据查看权限
      dataManage: boolean // 数据管理权限
      id: string
    }

    /**
     * 查询日志
     */
    export interface GetLoginLogParams {
      name: string  // 用户id
      startTime: string
      endTime: string
      ipAddress: string // ip地址
      loginSourceType: LoginSourceType // 登录源
      page: number
      size: number
    }

    /**
     * 获取异常日志列表参数
     */
    interface GetErrorLogParams {
      startTime: string
      endTime: string
      workflowCode: string
      workflowInstanceName: string
      originator: string
      page: number
      size: number
    }

    /**
     * 操作单个异常日志传参
     */
    interface ExceptionItemParams {
      exceptionLogId: string
    }

    enum ExceptionStatus {
      unfixed = 0,
      fixed = 1,
    }
    
    /**
     * 异常日志详情
     */
    interface ExceptionInfo {
      createdTime: string,
      creater: string,
      createrName: string,
      detail: string,
      fixNotes: string,
      fixedTime: string,
      fixer: string,
      fixerName: string,
      id: string,
      remarks?: string,
      status: ExceptionStatus,
      summary: string,
      workflowCode: string,
      workflowInstanceId: string,
      workflowInstanceName: string,
      workflowName: string,
      workflowVersion: number,
      workItemId?: string
    }

    interface ExceptionFormParams {
      workflowInstanceId: string
    }

    /**
     * 登录源
     */
    enum LoginSourceType {
      All = 0, // 全部
      Portal = 1, // 门户
      DingTalk = 2, // 钉钉平台
      Mobile = 3, // 移动平台
      Other = 4 // 其他
    }

    /**
     * 查询业务服务日志
     */
    export interface GetBizLogParams {
      code: string  // 业务服务编码
      methodName: string // 业务服务名称
      startTime: string
      endTime: string
      page: number
      size: number
    }
    
    /**
     * 查询业务服务日志调用信息
     */
    export interface GetBizLogCallParams {
      schemaCode: string // 模型编码
      bizObjectId?: string // 业务对象ID
    }

    /**
     * 创建钉钉集成数据
     */

    export interface CreatedDingtalkParams {
      appKey: string
      appSecret: string
      agentId:  string // 消息推送ID
      pcServerUrl: string // pc端首页地址
      mobileServerUrl: string // 移动端应用首页地址
      synRedirectUri?: string // 增量同步回调地址
    }
    /**
     *  创建 portal 设置
     */
    export interface CreatPortalSetting {
      corpId: string // 企业id
      corpSecret: string // 企业密钥
      scanAppId: string // 移动端接入应用————应用id
      scanAppSecret: string // 移动端接入应用————应用密钥
    }

    /**
     *  增量同步url
     */
    export interface CreatSynRedirectUri {
      synRedirectUri: string
    }
    /**
     * 创建oos参数
     */

    export interface CreateedOssParams {
      keyId: string // 唯一标识
      keySecret: string // 密钥
      endPoint: string // 上传节点
      bucket: string  // 存储空间
      checked: boolean
    }
    export interface CreateedFtpParams {
      ftpAccount: string // 服务账号
      ftpFilePath: string // 服务目录
      ftpPassword: string // 服务密码
      ftpPort: string // 端口
      ftpServer: string // 服务器
      checked: boolean //是否启用
    }

    export interface FileStorageParams {
      ftpConfigVO: CreateedFtpParams
      ossConfigVO: CreateedOssParams
    }


    /**
     * 获取新用户状态
     */
    interface UserGuide {
      userId: string,
      pageType: number
    }
  }
}