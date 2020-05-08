export default {
  path: '/demo',
  name: 'demo',
  component: () => import('../views/routerview.vue'),
  children: [
    {
      path: '/',
      redirect: { name: 'smartorg' }
    },
    {
      path: 'smartorg',
      name: 'smartorg',
      meta: { title: '表单控件选人控件' },
      component: () => import('../components/global/smart-org/demo/index.vue')
    },
    {
      path: 'smartapproval',
      name: 'smartapproval',
      meta: { title: '表单控件审批意见' },
      component: () => import('../components/global/smart-approve/demo/index.vue')
    },
    {
      path: 'SmartLocaleDemo',
      name: 'SmartLocaleDemo',
      meta: { title: '位置控件' },
      component: () => import('../components/global/smart-location/demo/index.vue')
    },
    {
      path: 'charts',
      name: 'charts',
      meta: { title: '图表示例' },
      component: () => import('../views/components-demo/charts.vue')
    },
    {
      path: 'other',
      name: 'other',
      meta: { title: '自定义组件示例' },
      component: () => import('../views/components-demo/index.vue')
    }
  ]
};
