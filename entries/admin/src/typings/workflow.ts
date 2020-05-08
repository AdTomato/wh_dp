export interface WorkflowData {
  createdTime?: number,
  deleted?: boolean,
  id?: string,
  schemaCode: string,
  workflowCode: string,
  workflowDefine: WorkflowSchema,
  workflowName: string,
  workflowVersion: string
}

export interface WorkflowSchema {
  activities: Array<ActivitySchema>,
  createdTime?: number,
  deleted?: boolean,
  id?: string,
  remarks?: string,
  rules: Array<RulesSchema>
}

export interface ActivitySchema {
  activityCode: string,
  activityName: string,
  activityType: string,
  afterActivate: string,
  allowedTime?: string,
  asyncEndJob: string,
  beforeActivate: string,
  cancelActivity: string,
  createdTime?: number,
  creater?: string,
  deleted?: boolean,
  endActivity: string,
  id?: string,
  jobRejected: string,
  jobSubmitted: string,
  participantType?: string,
  remarks?: string,
  timeoutStrategy: string,
  timeoutWarning1?: string,
  timeoutWarning2?: string,
  x?: number,
  y?: number,
  right?: number,
  bottom?: number,
  center?: number,
  middle?: number,
  participationModel?: string,
}

export interface RulesSchema {
  fixedPoint: boolean,
  formula: string,
  points: string[],
  postActivityCode: string,
  preActivityCode: string,
  text?: string,
  utilizeElse: boolean
}

export interface Activity {
  ID?: string;
  WorkflowElementType?: string;
  left: number;
  top: number;
  x: number,
  y: number,
  width: number;
  height: number;
  right: number;
  bottom: number;
  center: number;
  middle: number;
  activityCode: string;
  isSelected: boolean;
  toolTipText: string;
  activityName: string;
  name_i18n ?: Object;
  activityType: string;
  icon: string,
  dom?: HTMLElement | null,
  allowedTime?: string | null,
  timeoutWarning1?: string | null,
  timeoutWarning2?: string | null,
  timeoutStrategy?: string | null,
  beforeActivate?: ActivityEventSchema,
  afterActivate?: ActivityEventSchema,
  endActivity?: ActivityEventSchema,
  cancelActivity?: ActivityEventSchema,
  asyncEndJob?: string | null,
  jobSubmitted?: ActivityEventSchema,
  jobRejected?: ActivityEventSchema,
  participant?: string | null,
  participantType?: string,
  workflowCode?: string|null,
  submitButtonName?: string | null,
  rejectButtonName?: string | null,
  finishExit?: string | null,
  sheetCode?: string,
  assistant?: string,
  circulate?: string,
  permittedAction?: permittedAction,
  participationModel?: string,
  noParticipant?: string,
  originator?: string,
  perviousParticipate?: string,
  participated?: string,
  followUpParticipate?: string,
  noParticipantNextActivity?: string,
  approveExit?: string,
  disapproveExit?: string,
  sync?: boolean | null,
  finishStartActivity?: boolean | null,
  bizActions?: string[],
  finishCondition?: string|null,
  propertyPermissions?: Array<propertyPermissionsSchema>,
  workflowDataMaps?:Array<workflowDataMapsSchema>,
  targetActivityCode?: string|null,
  workflowChooseAction?: string,
  todoDataItem?:any,
  triggerMappingObj?: any,
}

interface permittedAction {
  forward: boolean,
  retrieve: boolean,
  rejectToActivityCode: string | null,
  adjustParticipant: boolean,
  finishInstance: boolean,
  rejectToStart: boolean,
  reject: boolean,
  rejectToFixded: boolean,
  assist: boolean,
  circulate: boolean
}

interface workflowDataMapsSchema {
  parentDataName: string,
  childDataName: string,
  inOutType: string
}

interface propertyPermissionsSchema {
  itemName: string,
  visible: boolean,
  editable: boolean,
  required: boolean
}

export interface ActivityParams {
  ID?: string | undefined;
  WorkflowElementType?: string;
  left?: number;
  top?: number;
  x: number,
  y: number,
  width: number;
  height: number;
  right: number;
  bottom: number;
  center: number;
  middle: number;
  activityCode: string;
  isSelected: boolean;
  toolTipText: string;
  activityName: string;
  activityType: string;
  icon: string,
  participationModel?:String,
  approveExit?:string,
  disapproveExit?:string
  
}

export interface defaultActivitySettings {
  start: ActivitySettings,
  fillsheet: ActivitySettings,
  approve: ActivitySettings,
  end: ActivitySettings
}

export interface ActivitySettings {
  left: number,
  top: number,
  x?: number,
  y?: number
  width: number,
  height: number,
  right: number,
  bottom: number,
  center: number,
  middle: number,
  WorkflowElementType: string,
  activityName?: string
}

export enum SameStyle {
  Width= 'width',
  Height = 'height',
  Left = 'left',
  Center = 'center',
  Right = 'right',
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
  Size = 'size',
  // 竖排等间距
  VerticalDistance = 'vertical-distance',
  // 横排等间距
  HorizontalDistance = 'horizontal-distance'
}

export interface curActivityProps {
  ID: number,
  type: string,
  acticityEvent: any,
  activitySenior: any,
  commonSettings: commonSettings,
  dataItem: any,
  operation: any,
  participant: participant
}

interface commonSettings {
  activityCode: string,
  activityName: string,
  sheetCode?: string,
  bizActions?: Array<string>,
  finishCondition?: string,
  sync?: boolean,
  workflowCode?: string, // 子流程模板
  finishStartActivity?: boolean, // 发起环节 
}

interface participant {
  participant:string,
  participantType:string,
  participationModel?:string,
  noParticipant:string,
  originator:string,
  perviousParticipate:string,
  participated:string,
  followUpParticipate:string,
  noParticipantNextActivity:string,
  approveExit?:string|null,
  disapproveExit?:string|null
}

interface ActivityEventSchema {
  receiver: string|null,
  content: string|null,
  cancelParllelActivity: boolean,
  rejectCancelParllelActivity: boolean,
  dataDisposals: Array<dataDisposalsSchema>,
  bizActions: Array<string>
}

interface dataDisposalsSchema {
  property: string,
  disposalType: string,
  value: string
}

export interface PropValue {
  key: string,
  value: any
}

export interface workflowDataMap {
  parentDataName: string,
  childDataName: string,
  inOutType:string
}