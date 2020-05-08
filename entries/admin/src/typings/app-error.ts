export enum ErrorCodes {
  FormBindByActivity = 302027,
  FormBindByList = 302028,
  DefaultForm = 302029,
  FormBindByDraftWorkflow = 302030,

  WorkflowBindByList = 303024,
  WorkflowBindAsSubWorkflowDraft = 401046,
  WorkflowBindAsSubWorkflow = 401045,
  WorkflowInstanceExist = 402508,

  DefaultList = 303025
}

export enum FileValidateStatus {
  ValidateOk = 'ok', // 校验通过
  CodeRepeat = 'repeat',// 编码重复
  ValidateError = 'error', // 校验错误
  referCodesError = 'referCode' // 关联表单 或者 子流程模型不存在
}

export enum FileValidateTypes {
  FileFormateError = 1,
  VersionError = 2,
  DataItemTypeError = 3,
  SystemError = 4,
  RepeatCode = 5,
  SubTableCodeRepeat = 6,
  RelativeModelNotImported = 7,
  SubFlowNeedBeImportedFirst = 8
}

export enum ImportStatus {
  Importing = 'process',
  ImportSuccess = 'success',
  ImportError = 'error'
}