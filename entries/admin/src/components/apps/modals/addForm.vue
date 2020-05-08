<template>
  <a-modal
    class="form-modal-customize"
    :title="title"
    v-model="showModal"
    :width="466"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @cancel="closeModal"
    @ok="formConfirm"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form :autoFormCreate="(form) => { this.form = form }" @submit="handleFormSubmit">
      <a-form-item
        :label="$t('languages.Apps.FormCode')"
        class="label-8-value"
        fieldDecoratorId="code"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.code"
      >
        <a-input
          maxlength="28"
          v-model="formData.code"
          :disabled="isEdit"
          :placeholder="$t('languages.Apps.FormCodePlaceholder')"
        ></a-input>
      </a-form-item>
      <a-form-item
        :label="$t('languages.Apps.FormName')"
        class="label-8-value"
        fieldDecoratorId="name"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.name"
      >
        <a-input
          maxlength="50"
          v-model.trim="formData.name"
          :placeholder="$t('languages.Apps.FormNamePlaceholder')"
        ></a-input>
      </a-form-item>

      <a-form-item
        class="selected-icon-customize label-8-value"
        :label="$t('languages.Apps.Icon')"
        fieldDecoratorId="icon"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <selected-icon v-model="formData.icon"></selected-icon>
      </a-form-item>

      <a-form-item
        :label="$t('languages.Apps.FormType')"
        class="label-8-value"
        fieldDecoratorId="sheetType"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <a-radio-group
          v-model="formData.sheetType"
          defaultValue="0"
          :disabled="isEdit"
        >
          <a-radio value="0">{{ $t('languages.Apps.SysForm') }}</a-radio>
          <a-radio value="1">{{ $t('languages.Apps.CusForm') }}</a-radio>
        </a-radio-group>
      </a-form-item>
      <!-- 自定义表单部分 -->
      <div v-show="formData.sheetType == 1">
        <a-form-item
          fieldDecoratorId="pcUrl"
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
        >
          <template slot="label">
            <span>
              <span>{{ $t('languages.Apps.PcRequestUrl') }}</span>
              <a-tooltip placement="top" :overlayStyle="popoverStyle">
                <template slot="title">
                  <span>{{ $t('languages.Apps.PcRequestUrlTips') }}</span>
                </template>
                <i class="question icon aufontAll h-icon-all-question-circle-o"></i>
              </a-tooltip>
            </span>
          </template>
          <a-input v-model="formData.pcUrl" :placeholder="$t('languages.Apps.PcUrlPlaceholder')"></a-input>
        </a-form-item>

        <a-form-item
          :class="formData.mobileIsPc ? 'mobile-url-customize' : 'url-form-item'"
          :label="$t('languages.Apps.MobileRequestUrl')"
          fieldDecoratorId="mobileIsPc"
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
        >
          <a-checkbox
            v-model="formData.mobileIsPc"
          >{{ $t('languages.Apps.SameAsPc') }}</a-checkbox>
        </a-form-item>

        <a-form-item
          v-show="!formData.mobileIsPc"
          class="url-customer"
          :colon="false"
          fieldDecoratorId="mobileUrl"
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
        >
          <template slot="label">
            <span class="label-block"></span>
          </template>
          <a-input v-model="formData.mobileUrl" :placeholder="$t('languages.Apps.PlzInputUrl')"></a-input>
        </a-form-item>

        <a-form-item
          :class="formData.printIsPc ? '' : 'url-form-item'"
          :label="$t('languages.Apps.PrintRequestUrl')"
          fieldDecoratorId="printIsPc"
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
        >
          <a-checkbox
            v-model="formData.printIsPc"
          >{{ $t('languages.Apps.SameAsPc') }}</a-checkbox>
        </a-form-item>

        <a-form-item
          v-show="!formData.printIsPc"
          class="url-customer"
          :colon="false"
          fieldDecoratorId="printUrl"
          :labelCol="formItemLayout.labelCol"
          :wrapperCol="formItemLayout.wrapperCol"
        >
          <template slot="label">
            <span class="label-block"></span>
          </template>
          <a-input v-model="formData.printUrl" :placeholder="$t('languages.Apps.PlzInputUrl')"></a-input>
        </a-form-item>
      </div>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Vue, Prop, Watch, Component } from 'vue-property-decorator';

import { pattern, nameValidator } from '@/common/utils';

import selectedIcon from '@/components/global/select-icon/index.vue';

import * as formApi from '@/apis/form';

@Component({
  name: 'AddFormModal',
  components: {
  selectedIcon
  }
  })
export default class AddFormModal extends Vue {
  @Prop() value!: boolean;
  @Prop() data!: any;

  @Prop() schemaCode!: string;

  /* Data */
  showModal: boolean = false;
  dftCheck = true;
  isEdit: boolean = false;
  popoverStyle: any = {
    maxWidth: '370px'
  };
  form: any = {};
  /* 接口暂无，数据类型待定 */
  formData: any = {
    name: '',
    code: '',
    icon: 'h-icon-all-operation-log-o',
    sheetType: '0',
    pcUrl: '',
    mobileIsPc: true,
    mobileUrl: '',
    printIsPc: true,
    printUrl: '',
    schemaCode: this.schemaCode
  };
  rules: any = {};
  formItemLayout: Common.FormItemLayout = {
    labelCol: {
      span: 5
    },
    wrapperCol: {
      span: 19
    }
  };
  codeError: any = null;
  existCodes: Array<string> = [];

  get title() {
    return this.isEdit ? this.$t('languages.Apps.EditForm') : this.$t('languages.Apps.AddForm');
  }

  /* Methods */
  // 关闭按钮
  closeModal() {
    this.$emit('cancel');
    this.resetForm();
    this.codeError = null;
    this.existCodes = [];
  }

  // 确定按钮
  formConfirm() {
    this.handleFormSubmit();
  }

  // 表单提交
  handleFormSubmit() {
    this.form.validateFields((err: any, value: any) => {
      if (!err) {
        this.formData.schemaCode = this.schemaCode;
        const form = Object.assign({}, this.formData);
        form.sheetType = Number(form.sheetType);

        if (form.sheetType === 1 ) {
          form.published = true;
        }

        const name_i18n:any = {
          en: form.name,
          zh: form.name
        }

        form.name_i18n = JSON.stringify(name_i18n);

        const promise = this.isEdit ? formApi.update(form) : formApi.create(form);

        const hideLoader = (this.$message as any).loading();

        promise.then((res: any) => {
          hideLoader();
          this.$emit('confirm', this.formData);
          this.closeModal();
          this.resetForm();
          this.$message.success(this.$t('languages.SaveSuccess'));
        }, (res) => {
          if (res.errcode === 302023) {
            this.codeError = '表单编码重复';
          } else {
            this.codeError = res.errmsg;
          }
          this.existCodes.push(this.formData.code);
          this.$nextTick(() => {
            this.form.setFieldsValue({ code: this.formData.code });
            this.form.validateFields();
          });
        }).finally(() => hideLoader());
      }
    });
  }

  // 表单重置
  resetForm() {
    this.form.resetFields();
    this.form.setFieldsValue({ sheetType: '0' });
    this.formData = {
      name: '',
      code: '',
      icon: 'h-icon-all-operation-log-o',
      sheetType: '0',
      pcUrl: '',
      mobileIsPc: true,
      mobileUrl: '',
      printIsPc: true,
      printUrl: '',
      schemaCode: this.schemaCode
    };
  }

  beforeMount() {
    this.setRules();
  }

  // 设置表单验证规则
  setRules() {
    this.rules = {
      name: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.RequiredFormName')
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
            message: this.$t('languages.Apps.RequiredFormCode')
          },
          {
            pattern: pattern('code'),
            message: this.$t('languages.Apps.AppCodeRule')
          },
          {
            validator: (rule: any, value: string, callback: Function) => {
              if (value && this.existCodes.includes(value)) {
                callback(this.codeError);
              }
              callback();
            },
          }
        ]
      }
    };
  }

  @Watch('value')
  onValueChange(val: boolean) {
    this.showModal = val;
    this.$nextTick(() => {
      if (val && this.form.setFieldsValue) {
        this.form.setFieldsValue({
          icon: 'h-icon-all-operation-log-o'
        });
      }
    });
  }

  @Watch('data', { deep: true })
  onDataChange(val: any) {
    this.$nextTick(() => {
      if (val.id && this.form.setFieldsValue) {
        const data = Object.assign({}, val);
        data.sheetType = data.sheetType.toString();
        if (!data.icon) {
          data.icon = 'h-icon-all-operation-log-o';
        }
        this.form.setFieldsValue(data);
        this.formData = data;
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    });
    // this.$nextTick(() => {
    //   if (val.id && this.form.setFieldsValue) {
    //     this.isEdit = true;
    //     this.form.setFieldsValue({
    //       name: val.name,
    //       code: val.code,
    //       icon: val.icon,
    //       sheetType: val.sheetType.toString(),
    //       pcUrl: val.pcUrl,
    //       mobileIsPc: val.mobileIsPc,
    //       mobileUrl: val.mobileUrl,
    //       printIsPc: val.printIsPc,
    //       printUrl: val.printUrl
    //     });
    //     Object.keys(val).forEach(item => {
    //       this.formData[item] = val[item];
    //     });
    //   } else {
    //     this.isEdit = false;
    //   }
    // });
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRules();
  }
}
</script>
<style lang="less">
  .form-modal-customize {
    .ant-form-item-label{
      text-align: left;
    }
    .ant-form-item-control{
      line-height: 32px;
    }
    .ant-form-item-children {
      input {
        color: rgba(0,0,0,.85);
        &:-webkit-autofill {
          box-shadow: 0 0 0 1000px rgba(255, 255, 255, 1) inset !important;
          -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 1) inset !important;
          -webkit-text-fill-color: rgba(0,0,0,.85);
        }
        &:focus{
          background:transparent;
          box-shadow: 0 0 0 1000px rgba(255, 255, 255, 1) inset !important;
          -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 1) inset !important;
        }
      }
    }
  }
</style>
<style lang="less">
.label-block {
  display: inline-block;
  width: 50px;
}
.url-form-item {
  margin-bottom: 0 !important;
}
.url-customer {
  .ant-form-item-control {
    top: -9px;
  }
}

.form-modal-customize {
  .ant-row.ant-form-item {
    margin-bottom: 10px !important;
  }
  .ant-row.ant-form-item .url-customer {
    margin-bottom: 0px !important;
  }
  .ant-modal-content {
    max-height: 600px;
    overflow: hidden;
  }
  .ant-modal-body {
    max-height: 491px;
    overflow-y: auto;
    .question{
      font-size: 14px;
    }
  }
  .selected-icon-customize {
    margin-top: 13px !important;
  }
  .ant-row.ant-form-item.mobile-url-customize {
    margin-bottom: 0px !important;
  }
}
.label-8-value .ant-form-item-control-wrapper {
  margin-left: -10px;
}
</style>
