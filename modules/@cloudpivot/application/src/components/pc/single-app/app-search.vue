<template>
  <div class="app-search">
    <a-input
      
      :placeholder="placeHolder"
      type="search"
      v-model="searchKey"
      @pressEnter="search"
    />
    <div
      class="app-search__clear"
      @click="clear"
      v-show="searchKey.length > 0"
    >
      <i class="icon aufontAll h-icon-all-close-circle"></i>
    </div>
    <div class="app-search__menu" @click="search">
      <i class="icon aufontAll h-icon-all-search-o"></i>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { Input } from 'h3-antd-vue'
@Component({
  name: 'app-search',
  components: {
    AInput: Input
  }
})
export default class AppSearch extends Vue {
  @Prop() placeHolder!:string;

  searchKey: string = '';

  search() {
    if (!this.searchKey) {
      return;
    }
    this.$emit('search', this.searchKey);
  }

  clear() {
    this.searchKey = '';
    this.$emit('clear');
  }
}

</script>
<style lang='less' scoped>
.app-search {
  position: relative;
  display: block;
  height: 32px;
  // padding: 0 @base4-padding-sm;
  // border: 1px solid @normal-color;
  border-radius: @border-radius-lg;
  &__input {
    width: 100%;
    padding-right: @base10-padding-lg;
    line-height: @line-height-4;
  }
  &__clear {
    position: absolute;
    right: 40px;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 2px;
  }
  &__menu {
    position: absolute;
    right: @base4-padding-md;
    top: 50%;
    transform: translateY(-50%);
    padding: 0 2px;
  }
}
</style>
