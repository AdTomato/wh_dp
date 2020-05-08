export interface ImplementState {
  code: State,
  name: string
}

export enum State {
  Success = 'success',
  Fail = 'fail',
  All = 'all'
}

export enum TableType {
  MainSheet = 1,
  SubSheet = 2
}

export enum ActionType {
  // 新增
  Insert = 1,
  // 更新
  UpDated = 2,
  // 删除
  Delete = 3
}

export const pageSizeOptions: Array<string> = [
  '10',
  '20',
  '50',
  '100'
]


export const executionState: Array<ImplementState>  = [
  {
    code: State.Success,
    name: '成功'
  },
  {
    code: State.Fail,
    name: '失败'
  },
  {
    code: State.All,
    name: '全部'
  }
]

export const columns: Array<Common.TableHead> = [
  {
    dataIndex: 'index',
    slots: { title: 'indexTitle' },
    scopedSlots: { customRender: 'index' },
    width: 60,
    key: 'index',
    align: 'center',
  },
  // 应用
  {
    dataIndex: 'sourceAppName',
    slots: { title: 'sourceAppNameTitle' },
    scopedSlots: { customRender: 'sourceAppName' },
    width: '15%',
    key: 'sourceAppName'
  },
  // 模型
  {
    dataIndex: 'sourceSchemaName',
    slots: { title: 'sourceSchemaNameTitle' },
    scopedSlots: { customRender: 'sourceSchemaName' },
    width: '15%',
    key: 'sourceSchemaName'
  },
  // 数据规则名称
  {
    dataIndex: 'ruleName',
    slots: { title: 'ruleNameTitle' },
    scopedSlots: { customRender: 'ruleName' },
    // width: '16%',
    key: 'ruleName'
  },
  // 执行时间
  {
    dataIndex: 'modifiedTime',
    slots: { title: 'modifiedTimeTitle' },
    scopedSlots: { customRender: 'modifiedTime' },
    width: '15%',
    key: 'modifiedTime'
  },
  // 目标模型
  {
    dataIndex: 'targetSchemaName',
    slots: { title: 'targetSchemaNameTitle' },
    scopedSlots: { customRender: 'brtargetSchemaNameowser' },
    key: 'targetSchemaName',
    width: '15%',
  },
  // 执行状态
  {
    dataIndex: 'state',
    slots: { title: 'successTitle' },
    scopedSlots: { customRender: 'state' },
    key: 'state',
    width: 100,
  },
  {
    dataIndex: 'action',
    slots: { title: 'actionTitle' },
    scopedSlots: { customRender: 'action' },
    key: 'action',
    width: 88
  }
]