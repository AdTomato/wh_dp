
<template>
  <div class="field">
    <div class="field__label">{{ $t('cloudpivot.form.runtime.modal.selectOrg') }}</div>
    <div class="field__control" style="max-height:194px;overflow:auto">

      <a-radio-group v-model="id">
        <a-radio
          v-for="dept in options.data"
          :key="dept.id"
          :value="dept.id"
        >{{ dept.name }}</a-radio>
      </a-radio-group>

    </div>
  </div>
</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Radio, Checkbox } from 'h3-antd-vue';

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

@Component({
  name: 'form-dept-select',
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ACheckbox: Checkbox
  }
})
export default class FormDeptSelect extends Vue implements FormActionComponent {
  @Prop()
  options !: FormActionModalOptions

  id = ''

  @Watch('options', {
    immediate: true
  })
  setOptions() {
    if (this.options) {
      this.id = this.options.data[0].id;
    }
  }

  submit() {
    return {
      deptId: this.id
    };
  }
}

</script>


<style lang="less" scoped>

/deep/.ant-radio-wrapper{
  display: block;
  margin-bottom:8px;
}

</style>
