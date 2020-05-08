import RouterView from '@/views/common-view/index.vue';

import * as  applicationList from '@cloudpivot/list';

import * as flow from "@cloudpivot/flow";

import site from '@/config/site';

export default {
  home: {
    path: '/',
      // redirect: 'home'
    meta: {
      hideFootbar: true,
    }
  },
  'form-detail': {
    path: '/form/external-link',
    name: 'form-detail',
    props: true,
    meta: {
        hideFootbar: true,
    },
    component: () => import('@/views/form/form-detail.vue')
  },
  sharedSuccess: {
    path: '/shared/success/:shortCode',
    name: 'shared-success',
    props: true,
    meta: {
      hideFootbar: true,
    },
    component: () => import('../components/success/success.vue')
  },
}
