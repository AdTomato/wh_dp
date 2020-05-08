<template>
  <div class="instance">
    <!-- 搜索框 -->
    <search-bar
      class="instance__search"
      :value="wd"
      :onclear="onClear"
      @focus="focusSearch"
      @cancel="cancelSearch"
      @search="search"
      :placeHolder="$t('languages.common.search')"
      :cancelText="$t('languages.common.cancel')"
    />
    <!-- 搜索面板 -->
    <search-panel
      v-if="showSearchPanel"
      v-model="wd"
      class="instance__main"
    />
    <!-- 主体列表 -->
    <instance-list class="instance__main" v-show="!showSearchPanel"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import common from '@cloudpivot/common';
import SearchPanel from './initial-instance/search-panel.vue';
import InstanceList from './initial-instance/list-panel.vue';

@Component({
  name: 'initial-instance-home',
  components: {
    SearchBar: common.components.mobile.Searchbar,
    SearchPanel,
    InstanceList,
  },
})
export default class InitialInstance extends Vue {
  showSearchPanel: boolean = false;

  wd: string = '';

  /**
   * 开始搜索，展示搜索面板
   */
  focusSearch() {
    this.showSearchPanel = true;
  }

  /**
   * 取消搜索，隐藏搜索面板
   */
  cancelSearch() {
    this.showSearchPanel = false;
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
}
</script>

<style lang="less" scoped>
.instance {
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
