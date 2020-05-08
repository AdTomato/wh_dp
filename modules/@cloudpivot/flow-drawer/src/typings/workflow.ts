export interface WorkflowData {
  activities: Array<ActivitySchema>,
  rules: Array<RulesSchema>,
  workflowName?: string,
  workflowCode?: string,
  workflowVersion?: number,
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
  timeoutWarn1?: string,
  timeoutWarn2?: string,
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
  ID?: string | undefined;
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
  activityType: string;
  icon: string,
  dom?: HTMLElement | null,
  allowedTime?: string | null,
  timeoutWarn1?: string | null,
  timeoutWarn2?: string | null,
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
  workflowDataMaps?:Array<workflowDataMapsSchema>
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

interface ActivityEventSchema {
  receiver: string|null,
  content: string|null,
  cancelParllelActivity: boolean,
  dataDisposals: Array<dataDisposalsSchema>,
  bizActions: Array<string>
}

interface dataDisposalsSchema {
  property: string,
  disposalType: string,
  value: string
}