export interface ListParams {
  schemaCode: string
}

export interface CreateParams {
  ruleModel: RuleModel
}

export interface RuleModel {
  conditionJoinType: number,
  enabled?: boolean,
  id?: string,
  name: string,
  ruleActionJson: string,
  ruleScopeJson: string,
  dataConditionJson:string,
  sourceSchemaCode: string,
  targetSchemaCode: string,
  triggerActionType: number,
  triggerConditionType: number,
  triggerSchemaCode: string,
  chooseAction: string,
  dataConditionJoinType: number,
  targetTableCode: string,
  ruleScopeChildJson: string,
  ruleActionMainScopeJson: string,
  insertConditionJoinType: number
}

export interface UpdateEnableParams {
  id: string,
  enable: boolean
}

export interface IdParams {
  id: string
}