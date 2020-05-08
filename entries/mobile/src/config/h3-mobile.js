import Vue from 'vue';

import {
  toast, modal, datetime
} from 'h3-mobile-vue';

Vue.prototype.$toast = toast;
Vue.prototype.$modal = modal;
Vue.prototype.$datetime = datetime;
Vue.use(toast);
Vue.use(modal);
Vue.use(datetime);
