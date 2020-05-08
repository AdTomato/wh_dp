<template>
  <div class="apps">
    <!-- 搜索框 -->
    <search-bar
      class="apps__search"
      :value="wd"
      :onclear="onClear"
      @focus="focusSearch"
      @cancel="cancelSearch"
      @search="search"
    />
    <!-- 主体内容 -->
    <search-panel
      v-if="showSearchPanel"
      v-model="wd"
      class="apps__main"
    />
    <app-list class="apps__main" v-show="!showSearchPanel"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

// import { Bus } from '@cloudpivot/common/src/pc/utils';


import common from '@cloudpivot/common';

const Bus:any = common.utils.Bus;
// import Bus from '@/utils/bus';

// import SearchBar from '@/components/global/searchbar.vue';
// import SearchBar from '@cloudpivot/common/src/mobile/components/global/searchbar.vue';

import SearchPanel from './search-panel.vue';

import AppList from './list-panel.vue';

@Component({
  name: 'apps',
  components: {
    SearchBar: common.components.mobile.Searchbar,
    SearchPanel,
    AppList,
  }
})
export default class Apps extends Vue {
  showSearchPanel: boolean = false;

  wd: string = '';

  /**
   * 开始搜索，展示搜索面板
   */
  focusSearch() {
    this.showSearchPanel = true;
    Bus.$emit('toggleNavbar', !this.showSearchPanel);
  }

  /**
   * 取消搜索，隐藏搜索面板
   */
  cancelSearch() {
    this.showSearchPanel = false;
    Bus.$emit('toggleNavbar', !this.showSearchPanel);
  }

  /**
   * 清空搜索框
   */
  onClear() {
    this.wd = '';
    this.showSearchPanel = false;
  }

  /**
   * 开始搜索
   */
  search(wd: string) {
    this.wd = wd;
  }

  beforeDestroy() {
    Bus.$emit('toggleNavbar', true);
  }
}
</script>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";
.apps {
  display: flex;
  height: inherit;
  flex-direction: column;
  overflow: hidden;
  &__search {
    flex: none;
  }
  &__main {
    flex: 1;
  }
}
</style>
