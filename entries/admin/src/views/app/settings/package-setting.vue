<template>
  <div class="package-setting">
    <div class="package-setting__header" v-if="!isTabPane">
      <h3>{{ $t('languages.appSettings.packageSetting') }}</h3>
      <a-button
        type="primary"
        icon="save"
        @click="bing"
      >{{ $t('languages.appSettings.bind') }}</a-button>
    </div>
    <div class="info">
      <a-alert
        :message="$t('languages.appSettings.PackageSettingTitle')"
        :description="$t('languages.appSettings.PackageSettingContent')"
        type="warning"
        showIcon
      />
    </div>
    <div class="package-setting__form">
      <div class="package-setting__form-item">
        <span class="required">AppKey:</span>
        <p>
          <a-input v-model="form.appKey" :placeholder="$t('languages.PlaceHolder.Input')"/>
        </p>
      </div>
      <div class="package-setting__form-item">
        <span class="required">AppSecret:</span>
        <p>
          <a-input
            v-model="form.appSecret"
            type="password"
            maxlength="28"
            :placeholder="$t('languages.PlaceHolder.Input')"
          />
        </p>
      </div>
      <div class="package-setting__form-item">
        <span class="required">AgentId:</span>
        <p>
          <a-input v-model="form.agentId" :placeholder="$t('languages.PlaceHolder.Input')"/>
        </p>
      </div>
    </div>
    <div class="package-setting__footer" v-if="isTabPane">
      <a-button
        type="primary"
        @click="bing"
      >{{ $t('languages.appSettings.bind') }}</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'package-setting'
})
export default class PackageSetting extends Vue {
  @Prop() isTabPane?: boolean;

  @AppCenterModule.State('appInfo') appInfo: any;

  @AppCenterModule.Action('updateAppPackage') updateAppPackage: any;

  // 应用配置信息
  form: AppSettings.deployForm = {
    appKey: '',
    appSecret: '',
    agentId: '',
  };

  /**
   * 保存应用配置
   */
  bing() {
    if (Object.values(this.form).some((val: string) => !val)) {
      this.$message.warning(this.$t('languages.appSettings.PlzFillInInfo'));
      return;
    }
    // submit
    this.updateAppPackage(this.form).then((res: Common.Data) => {
      if (res.errcode) {
        this.$message.error(res.errmsg);
      } else {
        this.$message.success(this.$t('languages.appSettings.BindSuccessfully'));
      }
    });
  }

  mounted() {
    const {
      appKey, appSecret, agentId
    } = this.appInfo;
    this.form = {
      appKey, appSecret, agentId
    };
  }
}

</script>
<style lang="less" scoped>
.package-setting {
  padding: 0 24px;
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    border-bottom: 1px solid #e8e8e8;
    h3 {
      font-size: 18px;
      font-weight: 500;
      color: #000;
    }
  }
  .info {
    margin-top: 20px;
    text-align: left;
    /deep/.ant-alert-icon {
      font-size: 24px;
    }
    /deep/.ant-alert-message, /deep/.ant-alert-description {
      font-family: PingFangSC-Medium;
      font-weight: 500;
      font-size: 14px;
      color:rgba(0,0,0,0.85);
    }
  }
  &__form {
    margin-top: 20px;
    text-align: left;
  }
  &__form-item {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 20px;
    > span {
      display: inline-block;
      vertical-align: middle;
      width: 80px;
      white-space: nowrap;
      color: rgba(0, 0, 0, 0.65);
    }
    > p {
      flex: 1;
      color: rgba(0, 0, 0, 0.85);
    }
    input {
      min-width: 268px;
      width: 100%;
    }
    .required {
      &:before {
        content: "*";
        display: inline-block;
        vertical-align: middle;
        color: #f4454e;
      }
    }
  }
  &__footer {
    position: absolute;
    z-index: 9;
    bottom: 0;
    left: 0;
    right: 0;
    height: 52px;
    line-height: 52px;
    border-top: 1px solid #e8e8e8;
    text-align: center;
    background-color: #fff;
  }
}
</style>
