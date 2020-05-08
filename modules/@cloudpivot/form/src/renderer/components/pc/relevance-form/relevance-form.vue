
<template>
  <div>
    <template v-if="!readonly">
      <relevance-form-modal v-if="isModal" :control="control" :parseDisplayFieldValue="parseDisplayFieldValue"></relevance-form-modal>

      <relevance-form-dropdown v-else :control="control" :parseDisplayFieldValue="parseDisplayFieldValue"></relevance-form-dropdown>
    </template>

    <template v-else-if="ctrl.value">
      <a
        class="link"
        v-if="showLink"
        @click.stop.prevent="onClick">
        {{ lookUpModalValue }}
      </a>
      <div v-else>{{ lookUpModalValue }}</div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop, Provide } from "vue-property-decorator";

import RelevanceFormDropdown from "./relevance-form-dropdown.vue";
import RelevanceFormModal from "./relevance-form-modal.vue";

import { RelevanceFormControl } from "../../../controls";

import {
  RendererFormControl,
  RelevanceFormOptions,
  RelevanceFormSelectMode
} from "../../../typings";

import {
  // TreeSelect,
  Select,
  Tooltip,
  Icon,
  Spin
} from "h3-antd-vue";

@Component({
  name: "relevance-form",
  components: {
    RelevanceFormDropdown,
    RelevanceFormModal
  }
})
export default class RelevanceForm extends RelevanceFormControl {
  onClick() {
    this.open();
  }
}
</script>

<style scoped>

  a.link{
    word-break: break-all;
  }

</style>
