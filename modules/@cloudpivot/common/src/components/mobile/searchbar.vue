<template>
  <div class="search-bar">
    <h3-search-bar
      class="search-bar-input"
      defaultValue=""
      :value="value"
      :placeholder="placeHolder || $t('cloudpivot.Common.mobile.search')"
      :onClear="onClear"
      :onCancel="onCancel"
      :onSubmit="submit"
      :onChange="onChange"
      :onFocus="onFocus"
      :onBlur="onBlur"
      :cancelText="cancelText || $t('cloudpivot.Common.mobile.cancel')"
    />
    <div class="search-bar-slot">
      <slot/>
    </div>
  </div>
</template>
<script lang="ts">
/* NOTE： 首页和应用列表共用的顶部搜索框，支持插槽 */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { H3SearchBar } from 'h3-mobile-vue';
@Component({
  name: 'SearchBar',
  components: {
    H3SearchBar
  }
})
export default class SearchBar extends Vue {
  @Prop({
    default: ''
  }) placeHolder!: string;

  @Prop({
    default: ''
  }) cancelText!: string;


  @Prop() value!: any;

  // 清空搜索框时执行
  @Prop() onclear?: Function;

  submit(e:any) {
    this.$emit('search', e);
  }

  onClear() {
    if (this.onclear) {
      this.onclear();
    } else {
      this.$emit('search', '');
    }
  }

  onCancel() {
    this.$emit('cancel');
  }

  onChange(val: string) {
    this.$emit('change', val);
  }

  onFocus() {
    this.$emit('focus');
  }

  onBlur() {
    this.$emit('blur');
  }
}
</script>
<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.search-bar {
  display: flex;
  align-items: center;
  &-input {
    flex: 1;
    /deep/.h3-search-input {
      background-color: #F2F4F8;
      .px2rem(border-radius, 28px);
    }
    /deep/.h3-search-synthetic-ph-placeholder{
      line-height: 15px;
    }
  }
  &-slot {
    flex: none;
  }
}
</style>
