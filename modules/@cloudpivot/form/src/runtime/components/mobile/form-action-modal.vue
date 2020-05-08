

<template>
  <div
    class="form-action-modal"
    v-control-back
    v-show="visible"
  >

    <div>
      <component
        ref="component"
        :is="modal"
        :options="options"
        class="content"
      />
    </div>

    <div class="border-top">
      <h3-button @click="ok">{{ btnText }}</h3-button>
    </div>
  </div>

</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  H3Button
} from 'h3-mobile-vue';

import FormReject from './form-reject.vue';
import FormForward from './form-forward.vue';
import FormDeptSelect from './form-dept-select.vue';

import FormUrge from './form-urge/index.vue';

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

import { FormAction } from '../../form-action';


import common from '@cloudpivot/common';


@Component({
  name: 'form-reject-modal',
  components: {
    H3Button,
    FormDeptSelect,
    FormReject,
    FormForward,
    FormUrge
  },
  directives: {
    ControlBack : common.directives.controlBack,
  }
})
export default class FormActionModal extends Vue {
  // @Prop()
  options : FormActionModalOptions = {} as any

  visible = false

  modal = ''

  get btnText(){
    return this.modal === 'FormUrge' ? this.$t('cloudpivot.form.runtime.action.urge') : this.$t('cloudpivot.form.runtime.biz.ok')
  }

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

    this.visible = true;
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

    this.close();
  }
}

</script>

<style lang="less">

@import "~@cloudpivot/common/styles/mixins.less";

.form-action-modal{
  // position: absolute;
  position: fixed;
  z-index: 30;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: #F8F8F8;
  .px2rem(font-size, @font-size-base);

  & > div:first-child{
    flex-grow: 1;
    height: 100%;
    overflow: hidden;
  }

  .content{
    background-color: #fff;
  }


  & > div:last-child{
    flex-basis: 0;
    color: @primary-color;
    // border-top:1px #eee solid;
    .hairline(border-top,#eee);
    // .px2rem(padding-top, @font-size-base);
    // .px2rem(padding-bottom, @font-size-base);

    .h3-button{
      color: @primary-color;
      .px2rem(font-size, @font-size-base);
      .px2rem(height, 88px);
      .px2rem(line-height, 88px);
      border-radius:0;

      &:before{
        border:none;
        border-radius:0;
      }
    }

  }

}

/deep/ .h3-popover-item-content{
  .px2rem(width, 211px);
  .px2rem(padding-top,20px);
  .px2rem(padding-bottom,20px);
}

</style>
