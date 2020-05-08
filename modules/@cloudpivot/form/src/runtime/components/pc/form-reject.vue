
<template>
  <div>

    <div class="field">
      <div class="field__label">{{ $t('cloudpivot.form.runtime.modal.reject') }}</div>
      <div class="field__control" style="max-height:194px;overflow:auto">
        <a-radio-group v-model="code" v-if="activities.length > 1">
          <a-radio
            v-for="activity in activities"
            :key="activity.activityCode"
            :value="activity.activityCode"
          >{{ activity.activityName }}</a-radio>
        </a-radio-group>

        <span v-else-if="activities.length === 1">{{ activities[0].activityName }}</span>

      </div>
    </div>

    <div class="field">
      <a-checkbox @change="onChange">{{ $t('cloudpivot.form.runtime.modal.reSubmitTip') }}</a-checkbox>
    </div>

  </div>
</template>


<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { Radio, Checkbox } from 'h3-antd-vue';

import { workflowApi,workflow } from '@cloudpivot/api';

import { FormActionComponent, FormActionModalOptions } from '../../form-action-modal';

@Component({
  name: 'form-reject',
  components: {
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ACheckbox: Checkbox
  }
})
export default class FormReject extends Vue implements FormActionComponent {
  code = ''

  back = false

  activities : workflow.RejectActivity[] = [];

  @Prop()
  options !: FormActionModalOptions

  @Watch('options', {
    immediate: true
  })
  setOptions(opts : FormActionModalOptions) {
    if (!opts) {
      return false;
    }

    const formObject = opts.data;

    if (formObject.workflowInstanceId) {
      const closeLoader = (this.$message as any).loading();

      workflowApi.getRejectActivities({
        workflowInstanceId: formObject.workflowInstanceId,
        activityCode: formObject.activityCode
      }).then((res) => {
        closeLoader();

        if (res.errcode !== 0) {
          this.$message.error(res.errmsg);
          return;
        }

        if (res.data && res.data.length > 0) {
          this.activities = res.data;
          if (this.activities.length > 0) {
            this.code = this.activities[0].activityCode;
          }
        } else {
          this.$message.error(this.$t('cloudpivot.form.runtime.modal.noRejectNode'));
        }
      },() => closeLoader());
    }
  }

  onChange(evt:any) {
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

/deep/.ant-radio-wrapper{
  display: block;
}

</style>
