
<template>
  <div class="relevance-form-modal">
    <a-input
      :value="text"
      :readonly="true"
      :placeholder="placeholder"
      @click="onClick"
      @mouseover="onMouseenter"
      @mouseout="onMouseleave"
    >
      <a-icon
        v-show="hover"
        slot="suffix"
        type="close-circle"
        @click="clear"
        @mouseenter="onMouseenter"
      />
      <a-icon
        v-show="!hover"
        slot="suffix"
        type="file"
      />
    </a-input>

    <a-modal
      :title="formTitle"
      :visible="visible"
      :width=" full ? '100%':'850px'"
      :destroyOnClose="true"
      :maskClosable="false"
      :keyboard="false"
      :class="{ 'full-modal': full, 'relevance-form':true}"
      :closable="!full"
      @ok="onModalOk"
      @cancel="onModalCancel"
    >
      <a-tooltip placement="top" v-show="!full">
        <template slot="title">
          <span>{{ $t('cloudpivot.form.runtime.biz.fullScreen') }}</span>
        </template>
        <span
          @click="fullScreen(true)"
          class="fullscreen icon aufontAll"
        >&#xe8e5;</span>
      </a-tooltip>

      <a-tooltip placement="top" v-show="full">
        <template slot="title">
          <span>{{ $t('cloudpivot.form.runtime.biz.smallScreen') }}</span>
        </template>
        <span
          @click="fullScreen(false)"
          class="fullscreen icon aufontAll"
        >&#xe8e7;</span>
      </a-tooltip>

      <list-selector
        v-model="selected"
        :listCode="controlOpts.queryCode"
        :schemaCode="controlOpts.schemaCode"
        :cols="2"
        :columns="columns"
        :showActions="false"
        :query="query"
        :defuaultShowSearch="false"
        @change="onListChange"
      ></list-selector>
    </a-modal>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch, Prop } from "vue-property-decorator";

import { RelevanceFormControl } from "../../../controls";
import common from '@cloudpivot/common';

import {
  // TreeSelect,
  Modal,
  Tooltip,
  Icon,
  Spin,
  Input
} from "h3-antd-vue";

@Component({
  name: "relevance-form-modal",
  components: {
    ATooltip: Tooltip,
    AModal: Modal,
    AInput: Input,
    AIcon: Icon,
    ASpin: Spin
  }
})
export default class RelevanceFormModal extends RelevanceFormControl {
  visible = false;

  selected = new Array();

  query = {};

  hover = false;

  full = false;

  get text() {
    if (!this.ctrl.value) {
      return "";
    }
    console.info(this.ctrl.value, this.getDisplayField)
    return this.parseDisplayFieldValue(this.ctrl.value[this.getDisplayField],this.getDisplayField)
  }

  async onClick() {
    this.query = this.getParams();
    this.visible = true;
    this.formTitleObj = await RelevanceFormControl.service.getBizmodelTitle(this.controlOpts.schemaCode || '');
  }

  onMouseenter() {
    this.hover = true;
  }

  onMouseleave() {
    this.hover = false;
  }

  clear() {
    this.ctrl.value = null;
    this.selected = [];
  }

  onListChange(rows: any) {
    this.selected = rows;
  }

  fullScreen(full: boolean) {
    this.full = full;
  }

  async onModalOk() {
    let item = await this.convertForMappings(this.selected[0]);
    this.visible = false;
    // this.ctrl.value = item;
    this.setValue(item);
  }

  onModalCancel() {
    this.visible = false;
    this.full = false;
    if (this.ctrl.value) {
      this.selected = [this.ctrl.value];
    }
  }

  beforeCreate() {
    const comp = RelevanceFormControl.loadListSelector();
    
    (this.$options as any).components.ListSelector = comp;
  }
  
}
</script>

<style lang="less" scoped>
.ant-input-suffix > i {
  color: #ccc;
}

.relevance-form-modal .anticon-close-circle {
  cursor: pointer;
  transition: color 0.3s;
  font-size: 12px;

  &:hover {
    color: #999;
  }

  &:active {
    color: #666;
  }
}

.fullscreen {
  position: absolute;
  top: 16px;
  right: 60px;
  cursor: pointer;
}

.full-modal .fullscreen {
  right: 16px;
}
</style>

<style lang="less">
.relevance-form:not(.full-modal) .ant-modal-body {
  height: 55vh;
  overflow: auto;
}
</style>