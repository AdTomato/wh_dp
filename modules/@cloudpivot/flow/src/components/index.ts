export default {
  pc: {
    WorkflowInfo: () => import('./pc/workflow-info.vue'),
    WorkflowTrack: () => import('./pc/workflow-track.vue'),
    WorkflowTrackActions: () => import('./pc/workflow-track-actions.vue'),
    WorkflowChart: () => import('./pc/chart.vue'),
    Approval :() => import('./pc/approval/approval.vue'),
    OperationLogs: () => import('./pc/operation-logs.vue'),
  },
  mobile:{
    WorkflowInfo: () => import('./mobile/workflow-info.vue'),
    Approval :() => import('./mobile/form-approvals.vue'),
    WorkflowChart : () => import('./mobile/chart.vue')
  },
  shared:{
    WorkflowStatus: () => import('./shared/workflow-status/workflow-status.vue'),
  }
}