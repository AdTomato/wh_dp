
export default {

    meetingsQRCode: {
        path: '/meetings/qr-code',
        name: 'meetingsQRCode',
        meta: {
          hideFootbar: true,
          title: '签到二维码'
        },
        component: () => import('./qr-code.vue')
      },
    
      meetingsSignIn: {
        path: '/meetings/sign-in',
        name: 'meetingsSignIn',
        meta: {
          hideFootbar: true,
          title: '签到'
        },
        component: () => import('./sign-in.vue')
      },

}