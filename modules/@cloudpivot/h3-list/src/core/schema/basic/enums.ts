/**
 * 视图客户端
 */
export enum ClientTypes {
    PC = 'PC',
    APP = 'APP'
}

export enum PublishStatus {
    UnPublished = 0,
    Published = 1,
}

/**
 * 视图类型
 */
export enum QueryPresentationTypes {
    LIST = 'LIST',
    BOARD = 'BOARD',
    CALENDAR = 'CALENDAR'
}

/**
 * 关联类型 -- 操作按钮
 */
export enum AssociationTypes {
    //关联到流程
    FLOW = 0,
    //关联到表单
    FORM = 1,
}

/**
 * 操作类型 -- 操作按钮
 */
export enum QueryActionTypes {
    XXX = 1,
    //新增
    ADD = 2,
    //编辑
    EDIT = 3,
    //删除
    DELETE = 4,
    //导入
    IMPORT = 5,
    //导出
    EXPORT = 6,
    //自定义
    CUSTOM = 7,
    //打印二维码
    QRCODE = 8,
}

export enum DefaultActionTypes {
    ADD = 'add',
    DELETE = 'delete',
    IMPORT = 'import',
    EXPORT = 'export',
    QRCODE = 'qr_code'
}

/**
 * 数据项类型
 */
export enum PropertyTypes {
    //短文本
    ShortText = 0,
    //长文本
    LongText = 1,
    //数值
    Number = 2,
    //日期
    Date = 3,
    //逻辑
    Logic = 4,
    //选人控件
    StaffSelector = 5,
    //附件
    Attachment = 6,
    //审批意见
    ApprovalOpinion = 7,
    //子表
    Sheet = 8,
    //关联表单
    RelevanceForm = 9,
    //地址
    Address = 10
}
