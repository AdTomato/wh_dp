<template>
  <div class="content-box">
    <Header/>
    <div class="main">
      <div class="main-left">
        <Aside/>
      </div>

      <div class="main-right">
        <router-view/>
      </div>
    </div>
  </div>
</template>

<script>
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import Header from '@/components/shared/header/header.vue';


import Aside from '@/components/apps/aside/aside.vue';

@Component({
  name: 'common-view',
  components: {
    Aside,
    Header
  }
})
export default class CommonView extends Vue {
}
</script>

<style lang="less" scoped>
  @import '../../styles/themes/default.less';
  .main {
    display: flex;
    justify-content: space-between;
    .main-right {
      width: 100%;
      height: 100%;
      max-height: 100%;
      overflow: hidden;
      padding: @base4-padding-md;
      background-color: @main-background ;
    }
  }

</style>
