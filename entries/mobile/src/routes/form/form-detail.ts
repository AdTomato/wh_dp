
export default [{
  path: '/form/detail',
  name: 'form-detail',
  props: true,
  meta: {
    hideFootbar: true,
  },
  component: () => import('@/views/form/form-detail.vue')
}, {
  path: '/form/empty',
  name: 'form-empty',
  props: true,
  meta: {
    hideFootbar: true,
  },
  component: () => import('@/views/form/empty.vue')
}];
