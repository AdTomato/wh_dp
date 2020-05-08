<template>
  <a-tooltip placement="top">
    <template slot="title">
      <span>当前为{{ LangText }}编辑模式，名称将保存为{{ LangText }}名称</span>
    </template>
    <a-icon class="global-icon" type="global"/>
  </a-tooltip>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'i18n-icon'
})
export default class I18nIcon extends Vue {
  get LangText() {
    return this.$i18n.locale === 'zh' ? '中文' : '英文';
  }
}
</script>
<style lang="less" scoped>
.global-icon {
  margin-left: 9px;
  cursor: pointer;
}
</style>
