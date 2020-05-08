import Vue from "vue";
import VueI18n from "vue-i18n";

import zhCN from "../locale/zh-CN";
import enUS from "../locale/en-US";

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.getItem("locale") || "zh",
  messages: {
    zh: zhCN,
    en: enUS
  }
});
window["globalI18n"] = i18n;
export default i18n;
