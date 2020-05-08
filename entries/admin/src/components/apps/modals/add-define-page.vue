<template>
  <a-modal
    class="add-define-page"
    :title="title"
    :visible="isShowDefinePage"
    :destroyOnClose="true"
    :width="566"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @cancel="closeModal"
    @ok="formConfirm"
    :maskClosable="false"
    :keyboard="false"
  >
    <div>
      <a-row
        class="add-define-page_item"
        v-for="item in operationDate"
        :key="item.key || item.code"
      >
        <a-col :span="layout.left" class="add-define-page__left">
          <span :class="{'label-required': item.required}">{{ item.title }}:</span>
        </a-col>
        <a-col :span="layout.right" class="add-define-page__right">
          <div v-if="item.type === 'input'">
            <form-input
              v-if="['code', 'name'].includes(item.code)"
              :value="item.value"
              :rules="rules[`${item.code}`]"
              :type="'text'"
              :ref="`form-input-${item.code}`"
              :tipPosition="'bottom'"
              :placeholder="'请输入'"
              :disabled="item.code==='code' && isEdit"
              @change="(val) => inputCHange(item.code, val)"
              class="define-page__input"
            />
            <a-input
              v-else
              v-model="item.value"
              :placeholder="'请输入'"
              class="define-page__input"
            />
            <i18n-icon v-if="item.code === 'name'"/>
          </div>

          <selected-icon
            v-model="item.value"
            v-if="item.type === 'icon-select'"
            class="icon-select define-page__input"
          />
          <a-radio-group
            v-if="item.type === 'radio'"
            name="radioGroup"
            v-model="item.value"
          >
            <a-radio
              class="radio-row"
              v-for="(option, index) in item.options"
              :key="index"
              :value="option.value"
            >{{ option.title }}</a-radio>
          </a-radio-group>

          <a-checkbox-group
            v-model="item.value"
            v-if="item.type === 'checkbox'"
            class="checkbox-row"
          >
            <a-row>
              <a-col :span="8"><a-checkbox value="pc">{{ $t('languages.Apps.PcVisible') }}</a-checkbox></a-col>
              <a-col :span="12"><a-checkbox value="mobile">{{ $t('languages.Apps.MobileVisible') }}</a-checkbox></a-col>
            </a-row>
          </a-checkbox-group>
        </a-col>
      </a-row>
    </div>
  </a-modal>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Emit, Watch
} from 'vue-property-decorator';

import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import { nameValidator } from '@/common/utils';

import selectedIcon from '@/components/global/select-icon/index.vue';

import FormInput from '@/components/global/form-input/index.vue';

import appsApi from '@/apis/apps';

import I18nIcon from '@/components/global/i18n-icon.vue';

import { LanguageTransform } from '@/utils';

const MenuModule = namespace('Apps/AppItem');
@Component({
  name: 'add-define-page',
  components: {
    selectedIcon,
    FormInput,
    I18nIcon
  }
})
export default class AddDefinePage extends Vue {
  @MenuModule.Action('getAppItem') getAppItem: any;

  @Prop() isShowDefinePage!: boolean;

  @Prop() appCode!: string;

  @Prop() parentId!: string;

  @Prop({ default: '' }) code!: string;

  showModal: boolean = false;

  title: string = '';

  id: string = '';

  pageData: any = null;

  isEdit: boolean = false;

  layout:any = {
    left: 5,
    right: 19
  };

  rules:any = {};

  setData:any[] = [];

  operationDate: any[] = [];

  /**
   * 关闭弹窗
   */
  closeModal() {
    this.$emit('cancel', false);
    this.cleardata();
  }

  /**
   * 点击表单确定按钮
   */
  formConfirm() {
    const params: any = {};
    this.operationDate.forEach((res: any) => {
      params[res.code] = res.value;
    });
    params.appCode = this.appCode;
    params.parentId = this.parentId;
    params.id = this.id;
    params.pcAble = params.visibleRange.includes('pc');
    params.mobileAble = params.visibleRange.includes('mobile');
    delete params.visibleRange;

    // 处理多语言字段保存
    let name:string = '';
    let nameI18n:any = {};
    if (this.pageData && this.pageData.name_i18n) {
      try {
        nameI18n = JSON.parse(this.pageData.name_i18n);
      } catch {
        nameI18n = {};
      }
    }
    if (this.$i18n.locale === 'zh') {
      /* eslint-disable-next-line */
      name = params.name;
      if (!nameI18n.en) {
        nameI18n.en = name;
      }
    } else {
      name = (this.pageData && this.pageData.name) || params.name;
      nameI18n[this.$i18n.locale] = params.name;
    }

    params.name = name;
    params.name_i18n = JSON.stringify(nameI18n);

    if (!this.isEdit) {
      this.createPage(params);
    } else {
      this.updatePage(params);
    }
  }

  /**
   * 提交新增自定义页面
   */
  createPage(params: Apps.AppCenter.DefinePageParams) {
    if (this.validateForm()) {
      return;
    }

    appsApi.createDefinePage(params).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success('创建成功!');
        this.$emit('cancel', true);
        this.cleardata();
        // this.getAppItem({ appCode: this.appCode });
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  /**
   * 提交更新自定义页面
   */
  updatePage(params: Apps.AppCenter.DefinePageParams) {
    if (this.validateForm()) {
      return;
    }
    const vm: any = this;
    appsApi.updateDefinePage(params).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success('更新成功!');
        vm.$emit('cancel', params);
        this.cleardata();
        this.getAppItem({ appCode: this.appCode });
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  /**
   * 重置数据
   */
  cleardata() {
    this.operationDate.forEach((res: any) => {
      res.value = '';
      if (res.code === 'openMode') {
        res.value = 'RECENT_PAGE_MODE';
      }
      if (res.code === 'icon') {
        res.value = 'h-icon-all-subordinate-o';
      }
      if (res.code === 'visibleRange') {
        res.value = ['pc','mobile'];
      }
    });
  }

  /**
   * 输入框变化时赋值
   */
  inputCHange(code: string, e: any) {
    const val = e.target.value as string;
    this.operationDate.find((res: any) => res.code === code).value = val;
  }

  /**
  * 获取后台数据
  */
  getDefinePage(code: string) {
    const vm: any = this;
    // const { code } = vm;
    const params = {
      code
    };
    appsApi.getDefinePage(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.pageData = res.data;
        vm.operationDate = JSON.parse(JSON.stringify(vm.setData));
        vm.operationDate.forEach((item: any, index: number) => {
          if (item.code === 'name') {
            item.value = this.getLangName(res.data);
          } else if (item.code === 'visibleRange') {
            let visibleRange = [''];
            if (res.data.pcAble === undefined || res.data.pcAble === null ) {
              visibleRange = ['pc','mobile'];
            } else {
              visibleRange = [];
              if (res.data.pcAble) {
                visibleRange.push('pc');
              }
              if (res.data.mobileAble) {
                visibleRange.push('mobile');
              }
            }
            item.value = visibleRange;
          } else {
            item.value = res.data[item.code];
          }

          item.key = +new Date() + index;
        });
        vm.id = res.data.id;
        vm.isEdit = true;
      }
    });
  }

  /**
   * 获取当前语言对应的展示名
   */
  getLangName(item:any) {
    return LanguageTransform.getLang(item.name, item.name_i18n);
  }

  /**
   * 表单校验
   */
  validateForm() {
    let hasError: boolean = false;
    const list: any[] = [];
    Object.entries(this.$refs).forEach(([key, value]) => {
      if (value && /^form-input/.test(key)) {
        list.push(this.$refs[key]);
      }
    });

    list.forEach((node: any) => {
      node.forEach((res: any) => {
        const unValidated: boolean = res.validateValue({
          target: { value: res.content }
        });
        if (unValidated) {
          hasError = true;
        }
      });
    });
    return hasError;
  }

  setRulesAndForm() {
    // 标题
    this.title = (this.code ? this.$t('languages.Apps.UpdateCustomPage') : this.$t('languages.Apps.CreateCustomPage')) as string;
    // 表单规则
    this.rules = {
      name: [
        {
          required: true,
          message: this.$t('languages.Apps.FillInPageName')
        },
        {
          validator: nameValidator,
          message: this.$t('languages.Apps.NameRule')
        }
      ],
      code: [
        {
          required: true,
          message: this.$t('languages.Apps.FillInPageCode')
        },
        {
          pattern: /^[a-zA-Z][a-zA-Z0-9_]{0,27}$/,
          message: this.$t('languages.Apps.CodeRule')
        }
      ]
    };
    // 表单项
    this.setData = [
      {
        required: true,
        value: '',
        title: this.$t('languages.Apps.FormCode'),
        code: 'code',
        type: 'input'
      },
      {
        required: true,
        value: '',
        title: this.$t('languages.Apps.ShowName'),
        code: 'name',
        type: 'input'
      },
      {
        required: false,
        value: 'h-icon-all-subordinate-o',
        title: this.$t('languages.Apps.Icon'),
        code: 'icon',
        type: 'icon-select'
      },
      {
        required: false,
        value: 'RECENT_PAGE_MODE',
        title: this.$t('languages.Apps.OpenModel'),
        code: 'openMode',
        type: 'radio',
        options: [
          {
            value: 'RECENT_PAGE_MODE',
            title: this.$t('languages.Apps.IframeInsert')
          },
          {
            value: 'VUE_MODE',
            title: this.$t('languages.Apps.VueRouteModel')
          },
          {
            value: 'NEW_PAGE_MODE',
            title: this.$t('languages.Apps.NewPageModel')
          }
        ]
      },
      {
        required: false,
        value: '',
        title: this.$t('languages.Apps.PcAccessUrl'),
        code: 'pcUrl',
        type: 'input'
      },
      {
        required: false,
        value: '',
        title: this.$t('languages.Apps.MobileAccessUrl'),
        code: 'mobileUrl',
        type: 'input'
      },
      {
        required: false,
        value: ['pc','mobile'],
        title: this.$t('languages.Apps.VisibleRange'),
        code: 'visibleRange',
        type: 'checkbox'
      }
    ];
  }

  created() {
    if (this.code) {
      this.getDefinePage(this.code);
    }
    this.setRulesAndForm();
    this.operationDate = JSON.parse(JSON.stringify(this.setData));
    this.operationDate.forEach((res: any, index: number) => {
      res.key = +new Date() + index;
    });
  }

  @Watch('$i18n.locale')
  onLanguageChange() {
    this.setRulesAndForm();
  }
}
</script>
<style lang="less" scoped>
.add-define-page {
  &_item {
    margin-bottom: 16px;
    .add-define-page__left {
      line-height: 32px;
    }
    .add-define-page__right {
      .icon-select {
        width: 100%;
      }
      .radio-row {
        display: block;
        line-height: 32px;
      }
      .checkbox-row{
        width: 100%;
        line-height: 32px;
      }
      .define-page__input {
        width: 384px;
        float: left;
      }
      /deep/.global-icon {
        margin-top: 9px;
      }
    }
  }
}
</style>
<style lang="less">
.ant-menu-item-selected {
  color: rgba(0, 0, 0, 0.85) !important;
}
</style>
