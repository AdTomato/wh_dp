<template>
  <a-modal
    v-model="show"
    :title="title"
    :width="422"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="submit"
    @cancel="close"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form :autoFormCreate="(form) => { this.form = form }" class="app-form">
      <a-form-item
        :label="$t('languages.integration.FolderName')"
        fieldDecoratorId="name"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.folder"
      >
        <a-input
          v-model="params.name"
          :placeholder="$t('languages.PlaceHolder.InputFolderName')"
          maxlength="50"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { pattern, nameValidator } from '@/common/utils';

@Component({
  name: 'AddFolder'
})

export default class AddFolder extends Vue {
  @Prop() value!: boolean;

  @Prop() folder!: any;

  @Prop() handler!: any;

  show: boolean = false;

  title: any = {};

  params: any = {
    name: ''
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

  beforeMount() {
    this.title = this.$t('languages.integration.AddFolder');
    this.setRules();
  }

  setRules() {
    this.rules = {
      folder: {
        rules: [
          {
            required: true,
            message: '目录名不能为空'
          },
          {
            validator: nameValidator,
            message: this.$t('languages.Apps.AppNameRule')
          }
        ]
      }
    };
  }

  close() {
    // 关闭模态窗
    this.$emit('input', false);
    this.params.name = '';
    this.$emit('resetFolderModel');
    this.form.resetFields();
  }

  submit() {
    // 新建目录、编辑目录
    const vm: any = this;
    this.form.validateFields((err: any) => {
      /* 校验必填项和格式 */
      if (!err) {
        const form = vm.form.getFieldsValue();
        this.handler({
          id: vm.folder.id,
          name: form.name,
          callback: vm.close
        });
      }
    });
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.show = v;
  }

  @Watch('folder', { deep: true })
  onFolderModelChange(v: any) {
    this.$nextTick(() => {
      if (v.id && this.form.setFieldsValue) {
        this.title = '编辑目录';
        this.form.setFieldsValue({
          name: v.name
        });
        this.params.name = v.name;
      } else {
        this.title = this.$t('languages.integration.AddFolder');
      }
    });
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRules();
    this.$emit('resetFolderModel');
  }
}
</script>
