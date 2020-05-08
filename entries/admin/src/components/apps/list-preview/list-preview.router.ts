
export const listPreviewRouter = {
    path: 'list-preview/:code',
    name: 'list-preview',
    meta: { title: '云枢-数据视图-预览' },
    props: true,
    component: () => import('./list-preview.vue')
  }
