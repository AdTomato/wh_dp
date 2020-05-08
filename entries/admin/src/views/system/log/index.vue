<template>
  <div class="log">
    <div class="log__tabs">
      <a-tabs defaultActiveKey="1">
        <a-tab-pane :tab="'登录日志'" key="1">
          <div class="tabs__wrap">
            <login-log/>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="'业务服务日志'" key="2">
          <div class="tabs__wrap">
            <biz-log/>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="'异常日志'" key="3">
          <div class="tabs__wrap">
            <exception/>
          </div>
        </a-tab-pane>
        <a-tab-pane :tab="'数据规则执行日志'" key="4">
          <div class="tabs__wrap">
            <data-rule-info />
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import LoginLog from './login-log.vue';
import BizLog from './biz-log.vue';
import Exception from './exception.vue';

import DataRuleInfo from './data-rule-info/data-rule-info.vue';


@Component({
  name: "log",
  components: {
  LoginLog,
  BizLog,
  Exception,
  DataRuleInfo
  }
  })
export default class Log extends Vue {

}
</script>
<style lang="less" scoped>
.log {
  text-align: left;
  &__tabs {
    /deep/.ant-tabs-nav {
      margin: 0 24px;
    }
    .tabs__wrap {
      margin: 0 24px;
    }
  }
  /deep/.ant-table-body, /deep/.ant-table-header {
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>

