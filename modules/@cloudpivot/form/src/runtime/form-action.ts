
/**
 * 表单操作
 */
export enum FormAction {
  /**
   * 加签
   */
  AdjustParticipant = 'adjustParticipant',
  /**
   * 同意
   */
  Agree = 'agree',
  /**
   * 协办
   */
  Assist = 'assist',
  /**
   * 作废
   */
  Cancel = 'cancel',
  /**
   * 传阅
   */
  Circulate = 'circulate',
  /**
   * 删除
   */
  Delete = 'delete',
  /**
   * 不同意
   */
  DisAgree = 'disAgree',
  /**
   * 编辑
   */
  Edit = 'edit',
  /**
   * 结束
   */
  FinishInstance = 'finishInstance',
  /**
   * 转办
   */
  Forward = 'forward',
  /**
   * 打印
   */
  Print = 'print',
  /**
   * 驳回
   */
  Reject = 'showReject',
  /**
   * 撤回
   */
  Retrieve = 'retrieve',
  /**
   * 暂存
   */
  Save = 'save',
  /**
   * 提交
   */
  Submit = 'submit',
  /** 
   * 催办 
   */ 
  Urge = 'urge'

}
