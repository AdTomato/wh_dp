
<template>
  <h3-list>
    <approve-opinion v-if="options.approval" :control="options.approval"></approve-opinion>

    <h3-popup-picker
      :title="$t('cloudpivot.form.runtime.modal.reject')"
      :data="[activities]"
      v-model="value"
      :placeholder="$t('cloudpivot.form.runtime.modal.pleaseInput')"
      valueTextAlign="left"
      :cancelText="$t('cloudpivot.form.runtime.biz.cancel')"
      :confirmText="$t('cloudpivot.form.runtime.biz.ok')"
      :clearText="$t('cloudpivot.form.runtime.biz.clear')"
    ></h3-popup-picker>

    <h3-list-item :hasExtra="true">{{ $t('cloudpivot.form.runtime.modal.reSubmitTip') }}
      <h3-switch
        slot="extra"
        v-model="back"
        color="#2970ff"
      ></h3-switch>
    </h3-list-item>
  </h3-list>
</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import {
  H3List, H3ListItem, H3RadioList, H3Radio, H3Switch, H3PopupPicker
} from 'h3-mobile-vue';

import { components } from '../../../renderer';

import { workflowApi } from '@cloudpivot/api';

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

@Component({
  name: 'form-reject',
  components: {
    H3List,
    H3ListItem,
    H3RadioList,
    H3Radio,
    H3Switch,
    H3PopupPicker,
    ApproveOpinion : components.mobile.ApproveOpinion
  }
})
export default class FormReject extends Vue implements FormActionComponent {
  value: Array<any> = []

  code: string = '';

  back = false

  activities: any[] = [];

  @Prop()
  options !: FormActionModalOptions

  @Watch('options', {
    immediate: true
  })
  setOptions(opts: FormActionModalOptions) {
    if (!opts) {
      return false;
    }
    this.$nextTick(() => {
      const formObject = opts.data;
      if (formObject.workflowInstanceId) {
        this.$h3.toast.show({
          iconType: 'loading'
        });

        const _this = this;
        workflowApi.getRejectActivities({
          workflowInstanceId: formObject.workflowInstanceId,
          activityCode: formObject.activityCode
        }).then((res: any) => {
          this.$h3.toast.hide();

          if (res.errcode !== 0) {
            this.$h3.toast.show({
              text: res.errmsg,
              iconType: 'close'
            });
            return;
          }

          if (res.data) {
            _this.activities = res.data.map((x: any) => x.activityName);
            if (res.data.length > 0) {
              _this.value = [res.data[0].activityName];
              _this.code = res.data[0].activityCode;
            } else {
              this.$h3.toast.show({
                text: this.$t('cloudpivot.form.runtime.modal.noRejectNode'),
                iconType: 'close'
              });
            }
          }
        });
      }
    });
  }

  onChange(evt: any) {
    this.back = evt.target.checked;
  }

  submit() {
    if (!this.code) {
      return;
    }

    return {
      rejectToActivityCode: this.code,
      submitToReject: this.back,
    };
  }
}
</script>

<style lang="less" scoped>

@import "~@cloudpivot/common/styles/mixins.less";

.ant-radio-wrapper {
  display: block;
}

.h3-cell__hd {
  .px2rem(width, 180);
  .px2rem(margin-right, @vertical-padding-lg);
  text-align: left;
  margin-right: 12px;
}
</style>
