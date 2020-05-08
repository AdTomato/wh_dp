<template>
  <a-modal
    :title="$t('languages.Apps.Edit')"
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
          disabled
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
        <selected-icon
          class="app-form__input"
          v-model="modelData.icon"
          @input="changeIcon"
        ></selected-icon>
      </a-form-item>

      <a-form-item
        :label="$t('languages.Apps.VisibleRange')"
        fieldDecoratorId="visibleRange"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        
        <a-checkbox-group
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

@Component({
  name: 'UpdateBizModel',
  components: {
    selectedIcon,
    I18nIcon
  }
})


export default class UpdateBizModel extends Vue {
  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.State('floders') floders: any;

  @MenuModule.Action('getFolders') getFolders: any;

  @MenuModule.Action('updateBizModel') updateBizModel: any;
  
  @MenuModule.Action('getAppItem') getAppItem: any;

  @Prop() value!: boolean;

  @Prop() updateModelData!: any;

  showUpdateModel:boolean = false;

  modelForm:any = {};

  modelData:any = {
    catalogues: '',
    modelName: '',
    icon: '',
    modelCode: '',
    visibleRange: []
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

  closeModel(form: any) {
    // 关闭模态窗
    this.modelData.catalogues = '';
    this.modelData.modelCode = '';
    this.modelData.modelName = '';
    this.modelData.icon = '';
    this.modelData.visibleRange = [];
    this.$emit('input', false);
    this.modelForm.resetFields();
    this.$emit('resetBizModel', form);
  }

  editModel() {
    // 修改业务模型
    const vm:any = this;
    this.modelForm.validateFields((err: any) => {
      if (!err) {
        const modelFormData = vm.modelForm.getFieldsValue();
        // 处理多语言字段保存
        let nameI18n:any = {};
        let name:string = '';
        if (vm.updateModelData.name_i18n) {
          try {
            nameI18n = JSON.parse(vm.updateModelData.name_i18n);
          } catch {
            nameI18n = {};
          }
        }
        if (vm.$i18n.locale === 'zh') {
          name = modelFormData.modelName;
          if (!nameI18n.en) {
            nameI18n.en = name;
          }
        } else {
          name = vm.updateModelData.name || modelFormData.modelName;
          nameI18n[vm.$i18n.locale] = modelFormData.modelName;
        }

        const modelParams:Apps.AppItem.UpdateBizModel = {
          id: vm.updateModelData.id,
          name,
          bizSchemaCode: modelFormData.modelCode,
          icon: modelFormData.icon,
          parentId: modelFormData.catalogues,
          name_i18n: JSON.stringify(nameI18n),
          pcAble: modelFormData.visibleRange.includes('pc'),
          mobileAble: modelFormData.visibleRange.includes('mobile')
        };
        vm.updateBizModel(modelParams);
        // 触发关闭弹窗并更新模型数据
        vm.closeModel(Object.assign({}, vm.updateModelData, modelParams));
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
    }
    this.showUpdateModel = v;
  }

  @Watch('updateModelData', { deep: true })
  onUpdateModelChange(v: any) {
    this.$nextTick(() => {
      if (this.modelForm.setFieldsValue) {
        let visibleRange = [''];
        if ( Object.keys(v).length > 0 && (v.pcAble === undefined || v.pcAble === null) ) {
         visibleRange = ['pc','mobile'];
         //visibleRange = [];
        } else {
          visibleRange = [];
          if (v.pcAble) {
            visibleRange.push('pc');
          }
          if (v.mobileAble) {
            visibleRange.push('mobile');
          }
        }
        this.modelForm.setFieldsValue({
          modelName: this.getLangName(v),
          modelCode: v.code,
          catalogues: v.parentId,
          icon: v.icon,
          visibleRange,
        });

        this.modelData.visibleRange = visibleRange;
        // debugger
        this.modelData.modelName = this.getLangName(v);
        this.modelData.modelCode = v.code;
        this.modelData.catalogues = v.parentId;
        this.modelData.icon = v.icon;
      }
    });
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
