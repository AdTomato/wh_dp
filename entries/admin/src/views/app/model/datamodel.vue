<template>
  <div class="data-model">
    <div class="data-model-content">
      <div class="tabs">
        <a-tabs
          :animated="false"
          v-model="activeKey"
        >
          <a-tab-pane :tab="$t('languages.Apps.DataModel')" key="1">
            <DataItem :bizSchemaCode="bizSchemaCode"></DataItem>
          </a-tab-pane>
          <a-tab-pane :tab="$t('languages.Apps.BizMethod')" key="2">
            <BizMethod :bizSchemaCode="bizSchemaCode"/>
          </a-tab-pane>
          <a-tab-pane :tab="$t('languages.Apps.DataRule')" key="3">
            <DataRule :bizSchemaCode="bizSchemaCode"/>
          </a-tab-pane>
          <a-tab-pane :tab="$t('languages.Apps.DataPermission')" key="4">
            <DataPermission :bizSchemaCode="bizSchemaCode"/>
          </a-tab-pane>
          <a-tab-pane :tab="$t('languages.Apps.MessageReminder')" key="5">
            <message-reminder v-if="activeKey === '5'" :bizSchemaCode="bizSchemaCode" />
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {
 Component, Vue, Prop, Watch 
} from 'vue-property-decorator';
import {
 State, Action, Mutation, namespace 
} from 'vuex-class';
import DataItem from '@/components/apps/model/dataitem.vue';
import BizMethod from '@/views/app/biz-method/index.vue';
import DataRule from '@/views/app/data-rule/index.vue';
import DataPermission from '@/views/app/data-permission/index.vue';
import MessageReminder from '@/views/app/message-reminder/index.vue';

@Component({
  name: 'DataModel',
  components: {
    DataItem,
    BizMethod,
    DataRule,
    DataPermission,
    MessageReminder
  }
})
export default class DataModel extends Vue {
  @Prop({
    type: String
  })bizSchemaCode!: string

  activeKey = '1';
  created() {
    // 参数不合法强制跳转
    if (this.bizSchemaCode === 'data') {
      this.$router.push({ path: '/apps' });
    }
  }
}

</script>
<style lang='less'>
  .data-model{
    overflow: hidden;
    height: calc(100vh - 64px);
    .loading{
      height: 100%;
      position: relative;
      display: none;
      .ant-spin{
        position: absolute;
        top: 50%;
        margin-top: -40px;
      }
    }
    .data-model-content{
      .tabs{
        .ant-tabs-nav-scroll{
          text-align: left;
          margin: 0px 24px;
          .ant-tabs-tab{
            padding: 16px 16px 12px 16px;
          }
        }
      }
    }
  }
</style>
