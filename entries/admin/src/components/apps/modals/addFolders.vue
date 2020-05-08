<template>
  <a-modal
    :title="folderModelTitle"
    v-model="showAddFolder"
    :width="446"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="addMenu"
    @cancel="closeModel"
    class="app-form-modal"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form
      :autoFormCreate="(form) => { this.form = form }"
      class="app-form"
    >
      <a-form-item
        :label="$t('languages.Apps.GroupName')"
        fieldDecoratorId="name"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.folder"
      >
        <a-input
          class="app-form__input"
          v-model="params.name"
          :placeholder="$t('languages.PlaceHolder.InputName')"
          maxLength="50"
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

import { LanguageTransform } from '@/utils';

import I18nIcon from '@/components/global/i18n-icon.vue';

const MenuModule = namespace('Apps/AppItem');
const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'AddFolderModal',
  components: {
    I18nIcon
  }
})


export default class AddFolderModal extends Vue {
  @AppCenterModule.State('appInfo') appDetails: any;

  @MenuModule.State('appInfo') appInfo: any;

  @MenuModule.Action('addFolders') addFolders: any;

  @MenuModule.Action('updateFolders') updateFolders: any;

  @Prop() value!: boolean;

  @Prop() folderModel!: any;

  showAddFolder:boolean = false;

  folderModelTitle:any = {};

  params:any = {
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

  /**
   * 设置规则，多语言文案
   */
  setRules() {
    this.rules = {
      folder: {
        rules: [
          {
            required: true,
            message: this.$t('languages.Apps.GroupNameCannotBeBlank')
          },
          {
            validator: nameValidator,
            message: this.$t('languages.Apps.AppNameRule')
          }
        ]
      }
    };
  }

  /**
   * 关闭弹窗
   */
  closeModel() {
    // 关闭模态窗
    this.$emit('input', false);
    this.params.name = '';
    this.$emit('resetFolderModel');
    this.form.resetFields();
  }

  /**
   * 新建目录
   */
  addMenu() {
    // 新建目录、编辑目录
    const vm:any = this;
    this.form.validateFields((err: any) => {
      /* 校验必填项和格式 */
      if (!err) {
        const folderTitle = vm.form.getFieldsValue();

        // 处理多语言字段保存
        let name:string = '';
        let nameI18n:any = {};
        if (vm.folderModel && vm.folderModel.name_i18n) {
          try {
            nameI18n = JSON.parse(vm.folderModel.name_i18n);
          } catch {
            nameI18n = {};
          }
        }
        if (vm.$i18n.locale === 'zh') {
          /* eslint-disable-next-line */
          name = folderTitle.name;
          if (!nameI18n.en) {
            nameI18n.en = name;
          }
        } else {
          name = vm.folderModel.name || folderTitle.name;
          nameI18n[vm.$i18n.locale] = folderTitle.name;
        }

        if (!vm.folderModel.id) { // 新增
          const folderParams:Apps.AppItem.AddFolders = {
            appCode: vm.appInfo.appCode,
            name,
            parentId: vm.appDetails.id,
            name_i18n: JSON.stringify(nameI18n)
          };
          vm.addFolders(folderParams);
        } else { // 编辑
          const folderParams:Apps.AppItem.UpdateFolders = {
            id: vm.folderModel.id,
            name,
            name_i18n: JSON.stringify(nameI18n)
          };
          vm.updateFolders(folderParams);
        }
        vm.closeModel();
      }
    });
  }

  /**
   * 多语言名称赋值
   */
  setLangName() {
    const name:string = this.getLangName(this.folderModel);
    this.form.setFieldsValue({
      name
    });
    this.params.name = name;
  }

  /**
   * 获取当前多语言对应显示名
   */
  getLangName(item:any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }

  beforeMount() {
    this.folderModelTitle = this.$t('languages.Apps.AddGroup');
    this.setRules();
  }

  mounted() {
    if (this.folderModel.id) {
      this.$nextTick(() => {
        this.setLangName();
      });
    }
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showAddFolder = v;
  }

  @Watch('folderModel', { deep: true })
  onFolderModelChange(v: any) {
    this.$nextTick(() => {
      // debugger
      if (v.id && this.form.setFieldsValue) {
        this.folderModelTitle = this.$t('languages.Apps.EditGroup');
        this.setLangName();
      } else {
        this.folderModelTitle = this.$t('languages.Apps.AddGroup');
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
<style lang="less" scoped>
.app-form-modal{
  .app-form{
    .app-form__input{
      width: 292px;
    }
  }
}
</style>
