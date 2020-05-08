import Vue from 'vue';
// import i18n from '@/config/i18n';
import ChartCard from './chart-card.vue';
import { ChartCardOptions } from './chart-card';

export default (options: ChartCardOptions) => {
  const Instance: Vue = new Vue({
    destroyed: () => { main ? document.getElementsByClassName('main')[0].removeChild(Instance.$el): document.body.removeChild(Instance.$el); },
    render: (h: any) => h(ChartCard, {
      props: options,
      on: {
        destroy: () => Instance.$destroy()
      }
    }),
  } as any);
  const component = Instance.$mount();
  const main = document.getElementsByClassName('main')[0];
  if (main) {
    document.getElementsByClassName('main')[0].appendChild(component.$el);
  } else {
    document.body.appendChild(component.$el);
  }
};
