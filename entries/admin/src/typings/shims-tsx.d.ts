import Vue, { VNode } from "vue";

declare module "vue/types/vue" {
  // 3. 声明为 Vue 补充的东西
  interface Vue {
    // $confirm: any;
    // $warning: any;
    // $message: any;
    // $error: any;
    isDingTalk: boolean;
    $h3: {
      toast: any;
      modal: any;
      datetime: any;
    };
  }
}

declare global {
  namespace JSX {
    // tslint:disable no-empty-interface
    interface Element extends VNode {}
    // tslint:disable no-empty-interface
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  interface Window {
    less: any;
    screenWidth?: any;
    config?: any;
    // onresize?: any;
  }

  var AMap: any;
}

// declare module 'echarts';
