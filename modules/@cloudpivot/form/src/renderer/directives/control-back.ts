
import common from '@cloudpivot/common';

export default common.directives.controlBack;

// import { DirectiveOptions, VNode, VNodeDirective } from 'vue';
// // import { subscribeBack, unsubscribeBack } from '@/config/back';

// export interface ControlBackConfig {

//   handler: BackEventHandler

// }

// export const config: ControlBackConfig = {} as any;

// export default {
//   bind(el: HTMLElement, bind: VNodeDirective, vm: any) {
//     const options = {
//       callback: vm.context.close
//     };
//     if (vm.context.show) {
//       const tmpShow = vm.context.show;
//       vm.context.show = function () {
//         const result = tmpShow.apply(vm.context, arguments);
//         config.handler.subscribe(options);
//         return result;
//       }
//     }
//     if (vm.context.close) {
//       const tmpClose = vm.context.close;
//       vm.context.close = () => {
//         const result = tmpClose.apply(vm.context, arguments);
//         config.handler.unsubscribe(options);
//         return result;
//       }
//     }
//   }
// };

// export interface BackOptions {
//   callback: () => void
// }

// export interface BackEventHandler {

//   subscribe(options: BackOptions): void;

//   unsubscribe(options: BackOptions): void;

// }