
export const formDesignRouter = {
  path: 'form-design/:sheetCode',
  name: 'form-design',
  meta: { title: '云枢-表单设计' },
  props: true,
  component: () => import('./form-design.vue')
}