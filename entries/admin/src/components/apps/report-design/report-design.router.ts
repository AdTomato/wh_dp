
export const reportDesignRouter = {
    path: ':appCode/report-design/:reportCode',
    name: 'report-design',
    meta: { title: '云枢-报表设计' },
    props: true,
    component: () => import('./report-design.vue')
  }