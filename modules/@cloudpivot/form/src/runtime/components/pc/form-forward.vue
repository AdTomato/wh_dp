
<template>
  <div class="form-forward">
    <div
      class="field"
      :class="{ error : form.participantors.hasError,
                required : form.participantors.required }"
    >
      <div class="field__label">{{ $t('cloudpivot.form.runtime.modal.selectUser', { text: text }) }}</div>
      <div class="field__control">
        <a-tooltip>
          <template slot="title" v-if="form.participantors.hasError">
            <p>{{ $t('cloudpivot.form.runtime.modal.pleaseSelectUser', { text: text }) }}</p>
          </template>
          <div>
            <staff-selector v-model="form.participantors.value" :options="staffSelectorOpts"></staff-selector>
          </div>
        </a-tooltip>
      </div>
    </div>

    <div
      class="field"
      :class="{
        error : form.comment.hasError,
        required : form.comment.required
      }"
    >
      <div class="field__label top">{{ $t('cloudpivot.form.runtime.modal.explain', { text: text }) }}</div>
      <div class="field__control">
        <a-tooltip>
          <template slot="title" v-if="form.comment.hasError">
            <p>{{ $t('cloudpivot.form.runtime.modal.pleaseInputExplain', { text: text }) }}</p>
          </template>

          <div>
            <h3-textarea
              v-model="form.comment.value"
              :placeholder="$t('cloudpivot.form.runtime.modal.pleaseInput')"
              :autosize="{minRows:8}"
              :maxLength="500"
            ></h3-textarea>
          </div>
        </a-tooltip>
      </div>
    </div>
  </div>
</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Input, Tooltip } from 'h3-antd-vue';

import { FormGroup, FormControlType, FormBuilder } from 'h3-forms';

import { components } from '../../../renderer';

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

import { FormAction } from '../../form-action';

@Component({
  name: 'form-forward',
  components: {
    ATextarea: Input.TextArea,
    ATooltip: Tooltip,
    StaffSelector: components.pc.StaffSelector,
    H3Textarea: components.pc.H3Textarea
  }
})
export default class FormForward extends Vue implements FormActionComponent {
  @Prop()
  options !: FormActionModalOptions

  comment = ''

  staff = '' as any

  staffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: ''
  }

  formGroup = this.createFormGroup();

  get text() {
    return this.options ? this.options.title : '';
  }

  get isCirculate() {
    return this.options && this.options.code === FormAction.Circulate;
  }

  get form() {
    return this.formGroup ? this.formGroup.children : null;
  }

  createFormGroup() {
    const group = FormBuilder.build({
      participantors: {
        type: FormControlType.Radio,
        options: {
          required: true
        }
      },
      comment: {
        type: FormControlType.Radio,
        options: {
          required: true
        }
      }
    });

    return group;
  }

  // /**
  //  * 选人控件placeholder多语言
  //  */
  // placeHolderLang(){
  //   this.staffSelectorOpts.placeholder = this.$t('cloudpivot.flowCenter.pc.plzSelect') as string;
  // }

  // @Watch('$i18n.locale')
  // onLanguageChange(l:string) {
  //   this.placeHolderLang();
  // }

  @Watch('options', {
    immediate: true
  })
  setOptions(opts: FormActionModalOptions) {
    if (!opts) {
      return;
    }

    if (this.form) {
      (this.form.comment as any).required = !this.isCirculate;
    }

    this.$set(this.staffSelectorOpts, 'mulpitle', opts.code !== FormAction.Forward);
    this.$set(this.staffSelectorOpts, 'placeholder', this.$t('cloudpivot.form.runtime.modal.pleaseChoose'));
  }

  submit() {
    if (this.formGroup && this.formGroup.validate() === false) {
      return;
    }

    const data = this.formGroup.value;

    return data;
  }

  // mounted(){
  //   this.placeHolderLang();
  // }
}

</script>