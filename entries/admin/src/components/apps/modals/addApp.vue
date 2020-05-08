<template>
  <a-modal
    v-model="showModal"
    :title="$t('languages.Apps.AddApp')"
    :width="446"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="submitAddApp"
    @cancel="closeAddModal"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form class="add-app__wrap" :autoFormCreate="(form) => { this.form = form }">
      <a-form-item
        :label="$t('languages.Apps.AppCode')"
        fieldDecoratorId="code"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.code"
      >
        <a-input
          class="add-app__input"
          v-model="params.code"
          maxlength="28"
          :placeholder="$t('languages.PlaceHolder.InputAppCode')"
        />
      </a-form-item>
      <a-form-item
        :label="$t('languages.Apps.AppName')"
        fieldDecoratorId="name"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.name"
      >
        <a-input
          class="add-app__input"
          v-model="params.name"
          maxlength="50"
          :placeholder="$t('languages.PlaceHolder.InputAppName')"
        />
        <i18n-icon/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import { pattern, nameValidator } from '@/common/utils';

import I18nIcon from '@/components/global/i18n-icon.vue';

const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'AddAppModal',
  components: {
    I18nIcon
  }
})
export default class AddAppModal extends Vue {
  @Prop() value!: boolean;

  @AppCenterModule.Action('addAppPackage') addAppPackage: any;

  showModal: boolean = false;

  params: Apps.AppCenter.AppInfo = {
    name: '',
    code: ''
  };

  form: any = {};

  formItemLayout: Common.FormItemLayout = {
    labelCol: {
      span: 5
    },
    wrapperCol: {
      span: 19
    }
  };

  rules: any = {};

  codeError: any = null;

  existCodes: Array<string> = [];

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      name: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.FillInAppName')
          },
          {
            validator: nameValidator,
            message: this.$t('languages.Apps.AppNameRule')
            // 仅限50个字符以内，并不能以空格开头
          }
        ]
      },
      code: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.FillInAppCode')
          },
          {
            pattern: pattern('code'),
            message: this.$t('languages.Apps.AppCodeRule')
            // '以字母开头不超过28个字符，仅支持字母、数字、下划线'
          },
          {
            validator: (rule: any, value: string, callback: Function) => {
              if (value && this.existCodes.includes(value)) {
                callback(this.codeError);
              }
              callback();
            }
          }
        ]
      }
    };
  }

  closeAddModal() {
    this.$emit('input', false);
    this.params = {
      name: '',
      code: ''
    };
    this.form.resetFields();
    this.codeError = null;
    this.existCodes = [];
  }

  submitAddApp() {
    // console.log(this.params, 'after submit');
    /* 校验必填项和格式 */
    this.form.validateFields((err: any) => {
      if (!err) {
        /* 提交新建应用表单 */

        const params: any = Object.assign({}, this.params);

        // 处理多语言字段保存
        const nameI18n: any = {};

        if (this.$i18n.locale === 'zh') {
          nameI18n.en = params.name;
        } else {
          nameI18n[this.$i18n.locale] = params.name;
        }

        params.name_i18n = JSON.stringify(nameI18n);

        this.addAppPackage(params)
          .then(() => {
            this.$emit('submitEvent', this.params.code);
            /* 关闭弹窗 */
            this.closeAddModal();
          })
          .catch((e: Common.Data) => {
            console.log(e.errmsg);
            if (e.errcode === 10005) {
              this.codeError = '应用编码重复';
            } else {
              this.codeError = e.errmsg;
            }
            this.existCodes.push(this.params.code);
            this.$nextTick(() => {
              this.form.setFieldsValue({ code: this.params.code });
              this.form.validateFields();
            });
          });
      }
    });
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showModal = v;
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRules();
  }
}
</script>

<style lang="less">
.add-app__wrap {
  .ant-form-item-label {
    // width: 74px;
    label {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(0, 0, 0, 0.65);
    }
  }
  input {
    color: rgba(0, 0, 0, 0.85);
  }
  // .ant-form-item-control-wrapper {
  //   width: 307px;
  // }

  .add-app__input {
    width: 292px;
  }
}
</style>
