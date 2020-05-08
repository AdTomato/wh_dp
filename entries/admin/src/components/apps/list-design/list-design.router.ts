export const listDesignRouter = {
    path: 'list-design/:code',
    name: 'list-design',
    meta: { title: '云枢-数据视图' },
    props: true,
    component: () => import('@/views/app/listDesign/listDesign-index.vue')
  }
