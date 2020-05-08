
<template>
  <div>
    <approve-opinion v-if="options.approval" :control="options.approval"></approve-opinion>

    <h3-radio-list
      v-if="depts.length > 0"
      v-model="value"
      :required="true"
      :options="depts"
      layout="v"
      showMode="0"
      :title="$t('cloudpivot.form.runtime.modal.selectOrg')"
      :cancelText="$t('cloudpivot.form.runtime.biz.cancel')"
      :confirmText="$t('cloudpivot.form.runtime.biz.ok')"
      :clearText="$t('cloudpivot.form.runtime.biz.clear')"
      :placeholder="$t('cloudpivot.form.runtime.modal.pleaseChoose')"
      @onChange="onChange"
    ></h3-radio-list>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

import {
  H3List,
  H3ListItem,
  H3RadioList,
  H3Radio,
  H3Switch
} from "h3-mobile-vue";

import { components } from "../../../renderer";

import {
  FormActionComponent,
  FormActionModalOptions
} from "../../form-action-modal";

@Component({
  name: "form-dept-select",
  components: {
    H3List,
    H3ListItem,
    H3RadioList,
    H3Radio,
    ApproveOpinion: components.mobile.ApproveOpinion
  }
})
export default class FormDeptSelect extends Vue implements FormActionComponent {
  @Prop()
  options!: FormActionModalOptions;

  value = "";

  selected: any = {};

  depts: any[] = [];

  @Watch("options", {
    immediate: true
  })
  setOptions() {
    if (this.options && this.options.data.length > 1) {
      this.value = this.options.data[0].name;

      this.depts = this.options.data.map((d: any) => ({
        value: d.id,
        label: d.name
      }));

      this.selected = this.depts[0] as any;
    }
  }

  onChange(item: any) {
    this.selected = item;
  }

  submit() {
    const _approval = this.options.approval;
    debugger
    if (_approval) {
      
      let ctrl = _approval.controller as any;
      let content = window.sessionStorage.getItem('$approval');
      
      // 用户没有输入审批意见时，填充按钮文本
      if (content) {
        if (!ctrl.value || (typeof ctrl.value === 'object' && !ctrl.value.content) ) {
          ctrl.value = {
            content
          }
        }
      }

      if (ctrl.required && (!ctrl.value && !ctrl.value.content)) {
        this.$h3.toast.show({
          text: this.$t("cloudpivot.form.runtime.modal.pleaseInputOpinion"),
          iconType: "close"
        });
        return;
      }

      const _options = _approval.options;
      if (
        _options.signatureIsRequired &&
        (!ctrl.value ||
          !ctrl.value.resources ||
          !ctrl.value.resources.some(
            (res: any) => res.name === "signsture.png"
          ))
      ) {
        this.$h3.toast.show({
          text: this.$t("cloudpivot.form.runtime.modal.pleaseAddSign"),
          iconType: "close"
        });
        return;
      }
    }

    return {
      deptId: this.selected.value
    };
  }
}
</script>


<style lang="less" scoped>
.ant-radio-wrapper {
  display: block;
}
</style>
