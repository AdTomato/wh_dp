import RouterView from '@/views/common-view/index.vue';

import * as  applicationList from '@cloudpivot/list';

import * as flow from "@cloudpivot/flow";

import site from '@/config/site';

export default {
  error: {
    path: '/error',
    name: 'error',
    component: () => import('@/views/shared/error.vue')
  },

  formDetail: {
    path: '/form/external-link',
    name: 'form-detail',
    component: () => import('@/views/form/form-detail.vue')
  },
  // flowTrackLogs: {
  //   path: '/from/workflow-track/:workflowInstanceId/operation-logs/',
  //   name: 'flowTrackOperationLogs',
  //   component: () => import('@/views/form/workflow-track/operation-logs.vue')
  // },

  sharedSuccess: {
    path: '/shared/success',
    name: 'shared-success',
    component: () => import('@/views/shared/success.vue')
  },

  // error: {
  //   path: '/error',
  //   name: 'error',
  //   component: () => import('@/views/shared/error.vue')
  // },
}
