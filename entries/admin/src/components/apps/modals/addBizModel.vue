<template>
  <a-modal
    :title="$t('languages.Apps.AddModel')"
    v-model="showUpdateModel"
    :width="446"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="editModel"
    @cancel="closeModel"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :autoFormCreate="(modelForm) => { this.modelForm = modelForm }"
      class="app-form"
    >
      <a-form-item
        :label="$t('languages.Apps.Catalogues')"
        fieldDecoratorId="catalogues"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <a-select
          :placeholder="$t('languages.Apps.SelectFolder')"
          v-show="floders.length"
          class="app-form__input"
        >
          <template v-for="selectItem in floders">
            <a-select-option :key="selectItem.id" v-model="selectItem.id">{{ getLangName(selectItem) }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>
      <a-form-item
        :label="$t('languages.Apps.ModelCode')"
        fieldDecoratorId="modelCode"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.modelCode"
      >
        <a-input
          :placeholder="$t('languages.Apps.InputModelCode')"
          maxLength="26"
          v-model="modelData.modelCode"
          class="app-form__input"
        />
      </a-form-item>
      <a-form-item
        :label="$t('languages.Apps.ModelName')"
        fieldDecoratorId="modelName"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.modelName"
      >
        <a-input
          :placeholder="$t('languages.Apps.InputModelName')"
          maxLength="50"
          v-model="modelData.modelName"
          class="app-form__input"
        />
        <i18n-icon/>
      </a-form-item>
      <a-form-item
        :label="$t('languages.Apps.Icon')"
        fieldDecoratorId="icon"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <selected-icon @input="changeIcon" class="app-form__input"></selected-icon>
      </a-form-item>

      <a-form-item
        :label="$t('languages.Apps.VisibleRange')"
        fieldDecoratorId="visibleRange"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        
        <a-checkbox-group
          v-model="modelData.visibleRange"
        >
          <a-row>
            <a-col :span="8"><a-checkbox value="pc">{{ $t('languages.Apps.PcVisible') }}</a-checkbox></a-col>
            <a-col :span="12"><a-checkbox value="mobile">{{ $t('languages.Apps.MobileVisible') }}</a-checkbox></a-col>
          </a-row>
        </a-checkbox-group>

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

import selectedIcon from '@/components/global/select-icon/index.vue';

import I18nIcon from '@/components/global/i18n-icon.vue';

import { pattern, bizModelNameValidator } from '@/common/utils';

import { LanguageTransform } from '@/utils';

const MenuModule = namespace('Apps/AppItem');
const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'AddBizModel',
  components: {
    selectedIcon,
    I18nIcon
  }
})


export default class AddBizModel extends Vue {
  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.State('floders') floders: any;

  @MenuModule.State('menuId') menuId: any;

  @MenuModule.Action('getFolders') getFolders: any;

  @MenuModule.Action('addBizModel') addBizModel: any;

  @MenuModule.Action('getAppItem') getAppItem: any;

  @Prop({
    type: Boolean
  }) value!: boolean;

  showUpdateModel:boolean = false;

  defaultFolder:string = '';

  modelForm:any = {};

  modelData:any = {
    catalogues: '',
    modelName: '',
    icon: '',
    modelCode: '',
    visibleRange: ['pc','mobile']
  };

  formItemLayout: Common.FormItemLayout = {
    labelCol: {
      span: 5
    },
    wrapperCol: {
      span: 19
    }
  };

  rules:any = {};

  errCode:string = '';

  existCodes:Array<string> = [];

  errCodeTxt:string = '';

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      modelCode: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.InputModelCode')
          },
          {
            pattern: pattern('modelcode'),
            message: this.$t('languages.Apps.ModelCodeRule')
          },
          {
            validator: (rules:any, value:any, callback:any) => {
              if (value && this.existCodes.includes(value)) {
                callback(this.errCodeTxt);
              }
              callback();
            }
          }
        ]
      },
      modelName: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.InputModelName')
          },
          {
            validator: bizModelNameValidator,
            message: this.$t('languages.Apps.BizModelNameRule')
          }
        ]
      }
    };
  }

  changeIcon(icon:any) {
    this.modelForm.setFieldsValue({
      icon
    });
  }

  closeModel() {
    // 关闭模态窗
    this.modelData.catalogues = '';
    this.modelData.modelCode = '';
    this.modelData.modelName = '';
    this.modelData.icon = '';
    this.modelData.visibleRange = ['pc','mobile'];
    this.$emit('input', false);
    this.modelForm.resetFields();
    this.existCodes = [];
    this.errCodeTxt = '';
  }

  editModel() {
    // 修改、新增业务模型
    const vm:any = this;
    this.modelForm.validateFields((err: any) => {
      if (!err) {
        const modelFormData = vm.modelForm.getFieldsValue();

        // 多语言业务字段保存
        const nameI18n:any = {};
        if (this.$i18n.locale === 'zh') {
          nameI18n.en = modelFormData.modelName;
        } else {
          nameI18n[this.$i18n.locale] = modelFormData.modelName;
        }
        const modelParams:Apps.AppItem.AddBizModel = {
          appCode: vm.appInfo.appCode,
          name: modelFormData.modelName,
          parentId: modelFormData.catalogues,
          bizSchemaCode: modelFormData.modelCode,
          icon: modelFormData.icon,
          name_i18n: JSON.stringify(nameI18n),
          pcAble: modelFormData.visibleRange.includes('pc'),
          mobileAble: modelFormData.visibleRange.includes('mobile')
        };
        vm.addBizModel(modelParams).then((res: Common.Data) => {
          if (!res.errcode) {
            if (res.data) {
              modelFormData.id = res.data.id;
              modelFormData.code = res.data.code;
            }
            vm.getAppItem(vm.appInfo);
            vm.$emit('getBizModel', modelFormData);
            vm.closeModel();
          } else {
            vm.existCodes.push(modelParams.bizSchemaCode);
            vm.$nextTick(() => {
              vm.errCodeTxt = res.errmsg;
              vm.modelForm.setFieldsValue({ modelCode: modelParams.bizSchemaCode });
              vm.modelForm.validateFields();
            });
          }
        });
      }
    });
  }

  getLangName(item:any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }

  @Watch('value')
  onValueChange(v: boolean) {
    if (v) {
      this.getFolders(this.appInfo);
      this.$nextTick(() => {
        if (this.defaultFolder) {
          this.modelForm.setFieldsValue({
            catalogues: this.defaultFolder,
            icon: 'h-icon-all-catalogue-o',
            visibleRange: ['pc','mobile']
          });
        } else {
          this.modelForm.setFieldsValue({
            catalogues: this.appDetails.id,
            icon: 'h-icon-all-catalogue-o',
            visibleRange: ['pc','mobile']
          });
          

          // this.resetlangRow(v.name_i18n);
        }
      });
    }
    this.showUpdateModel = v;
  }

  @Watch('menuId')
  onMenuIdChange(v: string) {
    this.defaultFolder = v;
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRules();
  }
}
</script>

<style lang="less" scoped>
.app-form{
  .app-form__input{
    width: 292px;
  }
  .ant-checkbox-group {
    width: 100%;
    line-height: 32px;
  }
}
</style>
