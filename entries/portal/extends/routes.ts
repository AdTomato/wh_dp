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
  },
  screenDd: {
    path: '/form/detail/screen-dd',  //  /application
    name: 'screen-dd',
    component: () => import('./screenDd.vue')
  },
  formDraw: {
    path: '/form/detail/draw',  //  /application
    name: 'form-draw',
    component: () => import('./draw.vue')
  },
  drawItem: {
    path: '/form/detail/draw-item',
    name: 'drawItem',
    component: () => import('./components/draw-item.vue')
  },
  drawTable: {
    path: '/form/detail/draw-table',
    name: 'drawTable',
    component: () => import('./components/draw-table.vue')
  }
} as any;
