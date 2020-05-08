
<template>

  <div>

    <!-- <approve-opinion v-if="options.approval" :control="options.approval"></approve-opinion> -->

    <mobile-staff-selector
      v-model="staff"
      :required="true"
      :options="staffSelectorOpts"
      :title="$t('cloudpivot.form.runtime.modal.pleaseSelectUser', { text: text })"
      :class="{ error : staffError }"
    ></mobile-staff-selector>

    <h3-textarea
      v-model="comment"
      :required="!isCirculate"
      type="text"
      :title="$t('cloudpivot.form.runtime.modal.explain', { text: text })"
      :placeholder="$t('cloudpivot.form.runtime.modal.pleaseInput')"
      :maxLength="500"
      :error="commentError"
    ></h3-textarea>

  </div>

</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { FormAction } from '../../form-action';

import { H3List, H3ListItem, H3Textarea } from 'h3-mobile-vue';

import { components } from '../../../renderer';

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

@Component({
  name: 'form-forward',
  components: {
    H3List,
    H3ListItem,
    H3Textarea,
    MobileStaffSelector : components.mobile.StaffSelector,
    ApproveOpinion : components.mobile.ApproveOpinion
  }
})
export default class FormForward extends Vue implements FormActionComponent {
  @Prop()
  options !: FormActionModalOptions

  comment = ''

  commentError = false

  staff = '' as any

  staffError = false

  staffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    mulpitle: false,
    showModel: true,
    showSelect: true,
    placeholder: ''
  }

  get text() {
    return `${this.options ? this.options.title : ''}`;
  }

  get isCirculate() {
    return this.options && this.options.code === FormAction.Circulate;
  }
  
  // get isForward() {
  //   return this.options && this.options.code === FormAction.Forward;
  // }

  @Watch('options', {
    immediate: true
  })
  setOptions(opts: FormActionModalOptions) {
    if (!opts) {
      return;
    }

    this.comment = '';
    this.staff = [];

    this.$set(this.staffSelectorOpts, 'mulpitle', opts.code !== FormAction.Forward);
    this.$set(this.staffSelectorOpts, 'placeholder', this.$t('cloudpivot.form.runtime.modal.pleaseChoose'));
  }

  submit() {
    this.staffError = !this.staff || !this.staff.length;
    if (!this.isCirculate) {
      this.commentError = !this.comment;
    }

    if (this.staffError || this.commentError) {
      if (this.staffError) {
        this.$h3.toast.show({
          text: this.$t('cloudpivot.form.runtime.modal.pleaseSelectUser', { text: this.text }),
          iconType: ''
        });
      } else if (this.commentError) {
        this.$h3.toast.show({
          text: this.$t('cloudpivot.form.runtime.modal.pleaseInputExplain', { text: this.text }),
          iconType: ''
        });
      }

      return;
    }

    return {
      comment: this.comment,
      participantors: this.staff
    };
  }
}

</script>
