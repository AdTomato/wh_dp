<template>
  <div>
    <FormDrawer :templates="templates"></FormDrawer>
  </div>
</template>
<style lang="less" scoped>

</style>
<script lang="ts">
import { Vue } from 'vue-property-decorator';
import FormDrawer from './dataItemDrawer.vue';
import { pattern, nameValidator } from '@/common/utils';

// 数据模型：关联表单
export default Vue.extend({
  components: {
    FormDrawer,
  },
  data() {
    return {
      name: 'dataItemBaseModel',
      templates: [
        {
          order: 1,
          labelName: this.$t('languages.Apps.Code'),
          uiformId: 'code',
          uiType: 1, // 1输入框/2下拉选择器/3复选框
          required: true,
          maxLength: 28,
          minLength: 0,
          pattern: new RegExp(/^[a-zA-Z][a-zA-Z0-9_]{0,27}$/),
          ruleMsg: this.$t('languages.Apps.CodeRule'),
          tip: this.$t('languages.Apps.CodeRule'),
          placeholder: this.$t('languages.PlaceHolder.InputCode'),
          validator: new RegExp(/^[a-zA-Z][a-zA-Z0-9_]{0,27}$/)
        },
        {
          order: 2,
          labelName: this.$t('languages.Apps.Name'),
          uiformId: 'name',
          uiType: 1,
          required: true,
          maxLength: 50,
          minLength: 0,
          pattern: new RegExp(/^[^ ].{0,49}$/),
          ruleMsg: '请输入不以空格开头长度不超过50个字符',
          placeholder: this.$t('languages.PlaceHolder.InputName'),
          validator: nameValidator
        },
        {
          order: 3,
          labelName: this.$t('languages.Apps.DataType'),
          uiformId: 'propertyType',
          uiType: 2, // 下拉选择器
          required: false,
          maxLength: 50,
          minLength: 0,
          pattern: '',
          ruleMsg: '',
          placeholder: this.$t('languages.PlaceHolder.Select')
        }
      ],
      // 选择器的数值
      selectCollection: {
        // 数据项
        type: [{ label: 'rrrrr', value: 'man' }, { label: 'ggggg', value: 'woman' }],
        // 选择业务类型
        businessTypeSelect: [{ label: '业务类型222', value: 'man' }, { label: '业务类型3333', value: 'woman' }]
      }
    };
  }
});
</script>
