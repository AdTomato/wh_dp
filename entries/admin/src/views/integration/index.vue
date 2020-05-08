<template>
  <div class="integration">
    <sidebar
      v-show="currentFolder"
      class="integration__sidebar"
      ref="sidebar"
      @toggle="selectFolder"
      v-resize.east
    />
    <content-panel
      v-show="currentFolder"
      class="integration__content"
      ref="content"
    />
    <template v-if="loaded && !currentFolder">
      <no-data
        tip="新建集成服务前请新建目录"
        buttonText="新建目录"
        @click="addFolder"
      />
    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { namespace, Action } from 'vuex-class';
import NoData from '@/components/global/no-data.vue';
import Sidebar from './sidebar.vue';
import ContentPanel from './content.vue';

const MethodsModule = namespace('Integration/Methods');

@Component({
  name: 'integration',
  components: {
    Sidebar,
    ContentPanel,
    NoData,
  }
})
export default class Integration extends Vue {
  @MethodsModule.Action('getTypes') getTypes: any;

  currentFolder: any = null;

  loaded: boolean = false;

  mounted() {
    this.getTypes();
    setTimeout(() => { this.loaded = true; }, 500);
  }

  /**
   * 选中目录
   */
  selectFolder(item: any) {
    // console.log(item, 'xxxxxxxxx');
    this.currentFolder = item;
    const dom: any = this.$refs.content;
    dom.setFolder(item);
  }

  /**
   * 新建目录
   */
  addFolder() {
    const dom:any = this.$refs.sidebar;
    dom.addFolder();
  }
}
</script>
<style lang="less" scoped>
.integration {
  display: flex;
  overflow: hidden;
  &__sidebar {
    flex: none;
    width: 224px;
    height: 100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }
  &__content {
    flex: 1;
    height: 100%;
    padding: 0 24px;
    overflow-y: auto;
  }

  /deep/.no-data {
    flex: 1;
  }
}
</style>
