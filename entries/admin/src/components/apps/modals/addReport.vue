<template>
  <a-modal
    :title="$t('languages.Apps.AddReport')"
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
          v-model="modelData.catalogues"
          :placeholder="$t('languages.Apps.SelectFolder')"
          v-show="floders.length"
          class="app-form__input"
        >
          <template v-for="selectItem in floders">
            <a-select-option :key="selectItem.id">{{ getLangName(selectItem) }}</a-select-option>
          </template>
        </a-select>
      </a-form-item>

      <a-form-item
        :label="$t('languages.Apps.ReportCode')"
        fieldDecoratorId="modelCode"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.modelCode"
      >
        <a-input
          :placeholder="$t('languages.Apps.InputReportCode')"
          maxLength="26"
          v-model="modelData.modelCode"
          class="app-form__input"
          :disabled="!!(model && model.id)"
        />
      </a-form-item>

      <a-form-item
        :label="$t('languages.Apps.ReportName')"
        fieldDecoratorId="modelName"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.modelName"
      >
        <a-input
          :placeholder="$t('languages.Apps.InputReportName')"
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
  name: 'AddReport',
  components: {
    selectedIcon,
    I18nIcon
  }
})


export default class AddReport extends Vue {
  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.State('floders') floders: any;

  @MenuModule.State('menuId') menuId: any;

  @MenuModule.Action('getFolders') getFolders: any;

  @MenuModule.Action('addReport') addReport: any;

  @MenuModule.Action('updateReport') updateReport: any;

  @MenuModule.Action('getAppItem') getAppItem: any;

  @Prop({
    type: Boolean
  }) value!: boolean;

  @Prop({
    default : () => {}
  })
  model !: any

  showUpdateModel:boolean = false;

  defaultFolder:string = '';

  modelForm:any = {};

  modelData:any = {};

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
    this.initModel();
  }

  setRules() {
    this.rules = {
      modelCode: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.InputReportCode')
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
            message: this.$t('languages.Apps.InputReportName')
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

  initModel(){

    let catalogues = '';

    if (this.defaultFolder) {
      catalogues = this.defaultFolder;
    } else {
      catalogues = this.appDetails.id;
    }

    this.modelData = {
      catalogues,
      modelName: '',
      icon: 'h-icon-all-catalogue-o',
      modelCode: '',
      visibleRange: ['pc','mobile']
    };
  }

  closeModel() {

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


        const params = {
          id: this.modelData.id,
          appCode: vm.appInfo.appCode,
          name: modelFormData.modelName,
          parentId: modelFormData.catalogues,
          code: modelFormData.modelCode,
          icon: modelFormData.icon,
          name_i18n: JSON.stringify(nameI18n),
          mobileAble: modelFormData.visibleRange.indexOf('mobile') > -1,
          pcAble: modelFormData.visibleRange.indexOf('pc') > -1,
        };
        
        const req = params.id ? vm.updateReport(params) : vm.addReport(params);

        req.then((res: Common.Data) => {
            if (res.errcode) {
              vm.existCodes.push(params.code);
              vm.$nextTick(() => {
                vm.errCodeTxt = res.errmsg;
                vm.modelForm.setFieldsValue({ modelCode: params.code });
                vm.modelForm.validateFields();
              });
            } else {
              vm.getAppItem(vm.appInfo);
              vm.closeModel();
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
      this.initModel();

      this.$nextTick(() => {
        this.modelForm.setFieldsValue(this.modelData);

      });
    }
    this.showUpdateModel = v;
  }

  @Watch('model',{
    immediate: true
  })
  onModelChange(m : any){
    if(m){

      let visibleRange : string[] = [];

      if(m.mobileAble){
        visibleRange.push('mobile');
      }
      
      if(m.pcAble){
        visibleRange.push('pc');
      }

      this.modelData = {
        id: m.id,
        appCode: m.appCode,
        catalogues: m.parentId,
        modelCode: m.code,
        modelName: m.name,
        name_i18n: m.name_i18n,
        icon: m.icon,
        visibleRange
      };
    }
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
}

/deep/.ant-checkbox-group{
  display: block;
  line-height: 32px;
}
</style>
