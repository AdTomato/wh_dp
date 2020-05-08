
export interface Page {
  page: number
  size: number
}

export interface ListBizRuleLog extends Page {
  schemaCode: string // 模型编码
  ruleName: string
  startTime: string
  endTime: string
  status: string
 }