export default [
  {
    path: '/form/workflow-track/:workflowInstanceId/:workItemId/',
    name: 'flowTrack',
    meta:{
      hideFootbar : true,
      title: '流程跟踪'
    },
    component: () => import('@/views/form/workflow-track.vue')
  },
  {
    path: '/form/approval/:workflowInstanceId',
    name: 'FormApproval',
    meta:{
      hideFootbar : true,
      title: '流程跟踪'
    },
    component: () => import('@/views/form/workflow-track.vue')
  },
  {
    path: '/form/approval-details',
    name: 'FormApprovalDetails',
    meta:{
      hideFootbar : true,
      title: '流程跟踪'
    },
    component: () => import('@/views/form/form-approval-details.vue')
  }
];
