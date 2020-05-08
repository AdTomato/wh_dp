<template>
  <div class="app-list">
    <app-home-header>

    </app-home-header>
    <application-list
      class="app-list__main"
      :showTitle="false"
      :offset="235"
      :isSPA="true"
    >
      <div
        slot="left"
        class="back"
      >
        <a @click="goBack">
          <i class="icon aufontAll h-icon-all-left-o"></i>
          返回
        </a>
        <!-- <a-divider type="vertical"></a-divider>
        <span class="menu-title"> {{ displayName }} </span> -->
      </div>
    </application-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
// import { State } from 'vuex-class';
import { Divider } from 'h3-antd-vue';
import * as Application from '@cloudpivot/application';
// import AppHomeHeader from '../../components/single-app/app-home-header.vue';
import * as ApplicationList from '@cloudpivot/list';
// import ApplicationList from '../applications/application-list.vue';

@Component({
  name: 'app-list',
  components: {
    ADivider: Divider,
    ApplicationList: ApplicationList.components.pc.ApplicationList,
    AppHomeHeader: Application.components.pc.AppHomeHeader
  }
})
export default class AppList extends Vue {
  // @State('appCode') appCode!: string;

  get displayName() {
    const { displayName } = this.$route.params;
    return displayName;
  }

  /**
   * 返回
   */
  goBack() {
    this.$router.go(-1);
  }
}

</script>
<style lang='less' scoped>
@import "../../styles/themes/default.less";
.app-list {
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  bottom: 16px;
  /deep/ .app-home-header {
    .menu-title {
      color: rgba(0,0,0,0.85);
      font-weight: @font-weight-md;
    }
  }
  &__main {
    // margin-left: -16px;
    // margin-right: -16px;
    // /deep/ .table-box {
    //   box-shadow: 0 0 0 0;
    //   height: calc(100% - 0px);
    // }
    .back {
      margin-right: 16px;
    }
  }
}
</style>
