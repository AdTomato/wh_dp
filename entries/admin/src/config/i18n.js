import Vue from 'vue';
import VueI18n from 'vue-i18n';

import zhCN from '../locale/zh-CN';
import enUS from '../locale/en-US';

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.getItem('locale') || 'zh',
  messages: {
    zh: zhCN,
    // en: enUS
    /* NOTE: 暂时修改语言包加载，任何语言都加载英文包 */
    en: zhCN,
  }
});

const languageType = [
  {
    value: 'en',
    label: 'English'
  },
  {
    value: 'zh',
    label: '中文'
  }
];
export {
  i18n,
  languageType
};
