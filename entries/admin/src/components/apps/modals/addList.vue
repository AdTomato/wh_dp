<template>
  <a-modal
    class="view-modal-customize"
    :title="$t('languages.Apps.AddList')"
    :width="446"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    v-model="showModal"
    @cancel="closeModal"
    @ok="formConfirm"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :autoFormCreate="(form) => { this.form = form }"
      @submit="handleSubmit"
    >
      <div class="view-tips">新增的视图默认只在PC端展示，可前往“切换视图”下拉框内更改移动端仅支持一种视图</div>
      <a-form-item
        :label="$t('languages.Apps.ListCode')"
        fieldDecoratorId="code"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.code"
      >
        <a-input
          maxLength="50"
          class="input-text"
          v-model="formData.code"
          :disabled="isEdit"
          :placeholder="$t('languages.Apps.ListCodePlaceholder')"
          @change="codeError=null"
        >
        </a-input>
      </a-form-item>

      <a-form-item
        :label="$t('languages.Apps.ListName')"
        fieldDecoratorId="name"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.name"
      >
        <a-input
          maxLength="50"
          class="input-text"
          v-model="formData.name"
          :placeholder="$t('languages.Apps.ListNamePlaceholder')"
        >
        </a-input>
        <i18n-icon/>
      </a-form-item>

      <a-form-item
        class="selected-view-type"
        :label="$t('languages.Apps.ViewType')"
        fieldDecoratorId="queryPresentationType"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <div
          class="view-type"
          :class="{'disabled': type.code !== 'LIST'}"
          v-for="type in presentationType"
          :key="type.code"
        >
          <img :src="type.url"/>
          <p>{{ type.text }}</p>
        </div>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import {
  Vue, Prop, Watch, Component
} from 'vue-property-decorator';
import { pattern, nameValidator } from '@/common/utils';
import I18nIcon from '@/components/global/i18n-icon.vue';
import * as ListApi from '@/apis/list/list.api';
@Component({
  name: 'AddListModal',
  components: {
    I18nIcon
  }
})
export default class AddListModal extends Vue {
  // data
  @Prop() schemaCode!: string;

  isEdit: boolean = false;

  showModal: boolean = false;

  rules: any = {};

  form: any = {};

  presentationType: any = [
    {
      code: 'LIST',
      text: '列表',
      url: require('@/assets/images/list.png')
    },
    {
      code: 'BOARD',
      text: '看板(暂未开放)',
      url: require('@/assets/images/board.png')
    },
    {
      code: 'CALENDAR',
      text: '日历(暂未开放)',
      url: require('@/assets/images/calendar.png')
    }
  ];

  // 暂无接口 数据类型未知
  formData: any = {
    name: '',
    code: '',
    queryPresentationType: 'LIST'
  }

  formItemLayout: Common.FormItemLayout = {
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 20
    }
  };

  // props
  @Prop() value!: boolean;

  @Prop() data!: any;

  beforeMount() {
    this.setRules();
  }

  // Methods
  setRules() {
    this.rules = {
      name: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.RequiredListName')
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
            message: this.$t('languages.Apps.RequiredListCode')
          },
          {
            pattern: pattern('code'),
            message: this.$t('languages.Apps.AppCodeRule')
          },
          {
            validator: (rule: any, value: string, callback: Function) => {
              if (value && this.codeError) {
                callback(this.codeError);
              }
              callback();
            }
          }
        ]
      }
    };
  }

  codeError: any = null;

  handleSubmit() {
    this.form.validateFields((err:any) => {
      if (!err) {
        this.formData.schemaCode = this.schemaCode;
        const form = Object.assign({}, this.formData);
        form.sheetType = Number(form.sheetType);
        form.queryPresentationType = 'LIST';
        const hideLoader = (this.$message as any).loading();
        const promise = this.isEdit ? ListApi.updateHeader(form) : ListApi.create(form);
        promise.then((res:any) => {
          if (res.errcode > 0) {
            // 创建失败
            this.codeError = res.errmsg;
            // this.existCodes.push(this.formData.workflowCode);
            this.$nextTick(() => {
              this.form.setFieldsValue({
                code: this.formData.code
              });
              this.form.validateFields();
            });
          } else {
            this.codeError = null;
            promise.then((result: any) => {
              hideLoader();
              this.$emit('confirm', this.formData);
              this.closeModal();
              this.resetForm();
              this.$message.success(this.$t('languages.SaveSuccess').toString());
            }).finally(() => hideLoader());
          }
        });
      }
    });
  }

  resetForm() {
    this.form.resetFields();
    this.formData = {
      name: '',
      code: '',
      queryPresentationType: 'LIST'
    };
  }

  closeModal() {
    this.resetForm();
    this.$emit('cancel');
  }

  formConfirm() {
    this.handleSubmit();
  }

  // Watch
  @Watch('value')
  onValueChange(val:boolean) {
    this.showModal = val;
  }

  @Watch('data', { deep: true })
  onDataChange(val:any) {
    this.$nextTick(() => {
      if (val.id && this.form.setFieldsValue) {
        this.form.setFieldsValue({
          name: val.name,
          code: val.code,
          queryPresentationType: val.queryPresentationType
        });
        Object.keys(val).forEach((item) => {
          this.formData[item] = val[item];
        });
        this.isEdit = true;
      } else {
        this.isEdit = false;
      }
    });
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRules();
  }
}
</script>

<style lang="less">
  .view-modal-customize {
    .ant-row.ant-form-item{
      margin-bottom: 20px!important;
    }
    .view-tips{
      font-size: 12px;
      color: rgba(0,0,0,0.45);
      width: 340px;
      margin-bottom: 10px;
    }
    .input-text{
      width: 307px;
    }
    .ant-col-4{
      width: 64px;
      margin-right: 7px;
    }
    .ant-col-20{
      width: 332px;
    }
    .selected-view-type{
      margin-top: 13px!important;
      .view-type{
        width: 100px;
        height: 124px;
        background: #E8FCF4;
        border-radius: 4px;
        text-align: center;
        float: left;
        color: rgba(0,0,0,0.85);
        border:1px solid @primary-color;
        cursor: pointer;
        &:not(:last-child){
          margin-right: 16px;
        }
        img{
          width: 70px;
          margin: 24px 15px 21px 15px;
        }
        p{
          font-size: 10px;
        }
      }
      .disabled{
        color: rgba(0,0,0,0.45);
        background: rgba(191,191,191,0.15);
        border:1px solid rgba(191,191,191,0.15);
      }
    }
  }
</style>
