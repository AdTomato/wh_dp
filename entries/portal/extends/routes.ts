export default {
  formDetail: {
    path: '/form/detail',
    name: 'form-detail',
    component: () => import('@/views/form/form-detail.vue')
  },
  screen: {
    path: '/form/detail/screen',  //  /application
    name: 'screen',
    component: () => import('./screen.vue')
  }
} as any;
