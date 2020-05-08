<template>
  <section class="content" :class="{'pc': clientType === clientPc}">
    <section class="content-setion" v-if="clientType === clientPc">
      <TableBar></TableBar>
      <TableList></TableList>
    </section>
    <section class="content-mobile" v-else>
      <MobileList></MobileList>
    </section>
    <!-- <empty-page v-if="false"></empty-page> -->
  </section>
</template>
<script lang="ts">
import {
 Component, Vue, Prop, Watch 
} from 'vue-property-decorator';
import {
 State, Action, Mutation, namespace 
} from 'vuex-class';


import TableBar from '@/components/apps/list-design/table-bar.vue';
import TableList from '@/components/apps/list-design/table-list.vue';
import MobileList from '@/components/apps/list-design/mobile-list.vue';
import EmptyPage from '@/components/global/empty-page/index.vue';

import * as H3List from '@cloudpivot/h3-list';


const ListdesignModule = namespace('Apps/Listdesign');
@Component({
  name: 'ListDesignContent',
  components: {
    TableBar,
    TableList,
    EmptyPage,
    MobileList
  }
})
export default class ListDesignContent extends Vue {
  @ListdesignModule.State('showFieldArray') showFieldArray: any;

  @ListdesignModule.State('payloadOptions') payloadOptions: any;

  @ListdesignModule.State('clientType') clientType: any;

  clientPc: H3List.schema.ClientTypes = H3List.schema.ClientTypes.PC;
}
</script>

<style lang="less">
.content {
  position: relative;
  border-radius: 4px;
  &.pc{
    background: rgba(255, 255, 255, 1);
  }
}
.content-mobile, .mobile-list {
  background: #E9EDF2;
  overflow: auto;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  &>.mobile {
    margin: 8px auto;
    box-shadow: 0 12px 29px 0 rgba(0, 0, 0, 8%);
    background: rgba(0,0,0,0.44);
    //background: #E8FCF4;

    .mobile-view {
      height: 100%;
      background-color: #fff;
      overflow: hidden;
      &-header{
        width: 50%;
        margin: auto;
        background: #818386;
      }
      &-content{
        height: 96%;
      }
    }
  }

  @media screen and (min-device-height: 768px) {
    &>.mobile {
      width: 384px;
      height: 100%;
      border-radius: 34px;
      padding: 8px;

      .mobile-view {
        border-radius: 30px;
        font-size: 12px;
        &-header{
          height: 22px;
          border-radius: 0 0 11px 11px;
        }
      }
    }
  }
  @media screen and (min-device-height: 900px) {
    &>.mobile {
        width: 384px;
        height: 100%;
        border-radius: 40px;
        padding: 10px;

      .mobile-view {
        border-radius: 36px;
        font-size: 12px;
        &-header{
          height: 28px;
          border-radius: 0 0 14px 14px;
        }
      }
    }
  }
  @media screen and (min-device-height: 1080px) {
    &>.mobile {
        width: 384px;
        height: 100%;
        border-radius: 52px;
        padding: 14px;

      .mobile-view {
        border-radius: 48px;
        font-size: 14px;
        &-header{
          height: 28px;
          border-radius: 0 0 19px 19px;
        }
      }
    }
  }
}
</style>
