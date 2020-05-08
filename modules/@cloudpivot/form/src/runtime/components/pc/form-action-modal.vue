

<template>
  <a-modal
    v-model="visible"
    :title="options.title"
    :maskClosable="false"
    :keyboard="false"
    :okText="$t('languages.common.ok')"
    :cancelText="$t('languages.common.cancel')"
    :destroyOnClose="true"
    @ok="ok"
    :class="modal === 'FormUrge' ? 'form-action-model_urge' : 'form-action-model_common'"
  >
    <component
      ref="component"
      :is="modal"
      :options="options"
    />
  </a-modal>
</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  Modal
} from 'h3-antd-vue';

import FormReject from './form-reject.vue';
import FormForward from './form-forward.vue';
import FormDeptSelect from './form-dept-select.vue';
import FormUrge from './form-urge/index.vue'

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

import { FormAction } from '../../form-action';

@Component({
  name: 'form-reject-modal',
  components: {
    AModal: Modal,
    FormDeptSelect,
    FormReject,
    FormForward,
    FormUrge
  }
})
export default class FormActionModal extends Vue {
  // @Prop()
  options : FormActionModalOptions = {} as any

  visible = false

  modal = ''

  show(opts: FormActionModalOptions) {
    this.options = opts;

    switch (opts.code) {
      case FormAction.Reject:
        this.modal = 'FormReject';
        break;
      case FormAction.Assist:
      case FormAction.Circulate:
      case FormAction.Forward:
      case FormAction.AdjustParticipant:
        this.modal = 'FormForward';
        break;
      case FormAction.Submit:
      case FormAction.Agree:
      case FormAction.DisAgree:
        this.modal = 'FormDeptSelect';
        break;
      case FormAction.Urge:
        this.modal = 'FormUrge';
        break;
      default:
        this.modal = '';
        break;
    }

    this.visible = !!this.modal;
  }

  close() {
    this.visible = false;
  }

  ok() {
    if (!this.modal) {
      return;
    }

    const modal = this.$refs.component as any as FormActionComponent;
    const data = modal.submit();
    if (data === null || data === undefined) {
      return false;
    }

    this.$emit('ok', {
      code: this.options.code,
      text: this.options.title
    }, data);
  }
}

</script>

<style lang="less">
  .form-action-model_urge {
    .ant-modal-header {
      border-bottom: 0;
    }
    .ant-modal-footer {
      border-top: 0;
    }
  }

  .form-action-model_common {
    .ant-modal-body {
      max-height: calc(100vh - 56px - 70px - 100px);
      overflow-y: auto;
    }
  }
</style>
