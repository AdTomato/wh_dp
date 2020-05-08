/* configure */
// import { subscribeBack, unsubscribeBack } from './src/config/mobile/back';
// import { DefaultFileService } from './src/config/mobile/h3-form/file-service';
// import cssVariables from './styles/variable.js';

/* Directives */
import resize from './src/directives/resize';
import controlBack from './src/directives/control-back';
import { config as controlBackConfig } from './src/directives/control-back';
import moveDirective from './src/directives/move-directive';
import transferDom from './src/directives/transfer-dom';


import { RouteHelper } from './src/utils/route-helper';
import Bus from './src/utils/bus';
import DateHandle from './src/utils/date';

import * as util from './src/utils/utils';

import * as pcUtil from './src/utils/pc/utils';

import { parseUrlParam,parseQuery } from './src/utils/url';
import * as url from './src/utils/url';

import Common from './src/utils/common'

// 公共业务相关的方法
import BusinessFunctions from './src/business-functions';
import RegexpValidate from './src/utils/regexp';    //正则公式验证

export const utils = {
  url,
  Bus,
  DateHandle,
  RegexpValidate,
  RouteHelper,
  parseUrlParam,
  parseQuery,
  // zeroFormat : pcUtil.zeroFormater,
  // searchHighLight : pcUtil.searchHighLight,
  // timeTranslate: util.timeTranslate,
  // compatible: pcUtil.compatible,
  ...pcUtil,
  ...util,
  Common,
  BusinessFunctions,
}

export default {
  // cssVariables,
  components: {
    mobile: {
      Checkbox: () => import('./src/components/mobile/checkbox.vue'),
      Empty: () => import('./src/components/mobile/empty/empty.vue'),
      GridList: () => import('./src/components/mobile/grid-list.vue'),
      LoadingFailed: () => import('./src/components/mobile/loading-failed/loading-failed.vue'),
      NoSearchData: () => import('./src/components/mobile/no-search-data.vue'),
      Searchbar: () => import('./src/components/mobile/searchbar.vue'),
      Sidebar: () => import('./src/components/mobile/sidebar.vue'),
      Tabbar: () => import('./src/components/mobile/sidebar.vue'),
      Toptip: () => import('./src/components/mobile/toptip.vue'),
      BaseItem: () => import('./src/components/mobile/base-item/base-item.vue'),
      BottomButton: () => import('./src/components/mobile/bottom-button.vue'),
      FormUnpublished: () => import('./src/components/mobile/form-unpublished/form-unpublished.vue')
    },
    pc: {
      PageLoading: () => import('./src/components/pc/page-loading/page-loading.vue'),
      PageNoData: () => import('./src/components/pc/page-no-data/page-no-data.vue'),
      LoadFail: () => import('./src/components/pc/load-fail/load-fail.vue'),
      UserPopover: () => import('./src/components/pc/user/user-popover.vue'),
      H3SizeSlider: () => import('./src/components/pc/size-slider.vue'),
      H3SizeRectangle: () => import('./src/components/pc/size-rectangle.vue'),
      EmptyHeader: () => import('./src/components/pc/empty-header/empty-header.vue'),
      FormUnpublished: () => import('./src/components/pc/form-unpublished/form-unpublished.vue'),
      Panel: () => import('./src/components/pc/panel.vue'),
      RoleSelect: () => import('./src/components/pc/role-selector/index.vue'),
    }
  },
  directives: {
    resize,
    controlBack,
    controlBackConfig,
    moveDirective,
    transferDom
  },
  utils
}
