
<template>
  <a-modal
    :title="title"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    :visible="true"
    @cancel="onCancel"
    @ok="onOk"
    :maskClosable="false"
    :keyboard="false"
  >
    <div>
      <p style="color:green">/** <br />&nbsp;* value 当前值，oldValue旧值，form表单对象 <br />&nbsp;*/ <br />
      </p>
      <span style="color:blue">function</span>(value, oldValue, form){
    </div>
    <h3-textarea
      v-model="value"
      :placeholder="`请输入${title}详细信息，例：form.text1.value = ''`"
      :autosize="{minRows:8}"
      :maxLength="2000"
      style="border:0"
    ></h3-textarea>
    <div>}</div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

// import H3Textarea from "@cloudpivot/form/src/renderer/components/pc/h3-textarea.vue";

import { renderer } from '@cloudpivot/form';

@Component({
  name: "script-input",
  components: {
    H3Textarea:renderer.components.pc.H3Textarea
  }
})
export default class ScriptInput extends Vue {
  get title() {
    const data = this.modalData;
    if (!data || !data.label) {
      return "";
    }
    return data.label;
  }

  value = "";

  @Prop({
    default: {}
  })
  modalData!: any;

  @Watch("modalData", {
    immediate: true
  })
  onModalDataChange(modalData: any) {
    const data = modalData.data;
    if (!data) {
      return;
    }

    this.value = data.value || "";
  }

  onCancel() {
    this.$emit("closeModal");
  }

  onOk() {
      this.$emit("backData", {
          value : this.value
      });
  }

}
</script>

<style lang="less" scoped>
/deep/.h3-textarea {
  border: 0 !important;
}
</style>
