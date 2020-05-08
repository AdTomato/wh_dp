
<template>
  <form-title
    :control="control"
    v-if="isTitle"
    v-show="show"
  ></form-title>

  <description :control="control" v-else-if="isDescription"></description>

  <div v-else-if="isSheet">
    <form-sheet
      :id="id"
      :control="control"
      :frozenKeys="frozenKeys"
      @fullScreen="fullScreen"
      @freezeColumn="onFreezeColumn"
      :class="{ 'vertical' : layoutType }"
    ></form-sheet>

    <a-modal
      :width="'100%'"
      class="import-modal full-modal"
      v-model="isFullScreen"
      :footer="null"
      :mask="true"
      style="top: 0;"
      :bodyStyle="{height: 'calc(100vh)',padding:0}"
      :closable="false"
      :maskClosable="false"
      :keyboard="false"
    >
      <form-sheet
        :control="control"
        :canFull="true"
        :frozenKeys="frozenKeys"
        @fullScreen="fullScreen"
        @freezeColumn="onFreezeColumn"
      />
    </a-modal>
  </div>

  <reverse-relevance
    :id="id"
    :control="control"
    v-else-if="isReverseRelevance"
    v-show="show"
  ></reverse-relevance>

  <system-control
    :control="control"
    v-else-if="isSystem"
    v-show="show"
    :class="{ system:isSystem, vertical : layoutType }"
  ></system-control>

  <base-control-adapter :control="control" v-else-if="isHtml"></base-control-adapter>

  <div
    class="field"
    v-else
    v-show="show"
    :class="fieldClassObj"
    :id="id"
  >
    <div
      class="field__label"
      :class="{ top : isHigh }"
      :style="style"
    >
      <div :title="label">
        {{ label }}
        <a-tooltip placement="top" v-if="tips">
          <template slot="title">
            <span>{{ tips }}</span>
          </template>
          <a-icon type="anticon anticon-question-circle-o" theme="twoTone" />
        </a-tooltip>
      </div>
    </div>

    <div class="field__control" :class="{ 'detail' : (layoutType && readonly), 'field__control--selectOrg' : isStaffSelector }">
      <a-tooltip placement="topLeft">
        <template slot="title" v-if="hasError">
          <ul>
            <li v-for="err in errors" :key="err.code">{{ getErrorMessage(err) }}</li>
          </ul>
        </template>

        <div>
          <div :class="[ typeClass ]">
            <base-control-adapter :control="control"></base-control-adapter>
          </div>
        </div>
      </a-tooltip>
    </div>
  </div>
</template>


<script lang='ts'>
import { Vue, Prop, Component, Inject, Watch } from "vue-property-decorator";

import { RendererFormControl } from "../../typings";

import { FormControlType } from "../../typings";

import BaseControlAdapter from "./base-control-adapter.vue";

import FormSheet from "./form-sheet/form-sheet.vue";
import ReverseRelevance from "./reverse-relevance/reverse-relevance.vue";
import SystemControl from "./system-control.vue";

import FormTitle from "../layout/form-title.vue";

import FormTabs from "../layout/pc-form-tabs.vue";

import FormTabsPane from "../layout/pc-form-tabs-pane.vue";

import Description from "../layout/description.vue";

import { Tooltip, Modal, Icon } from "h3-antd-vue";

import ControlAdapter from "../control-adapter";

@Component({
  name: "control-adapter",
  components: {
    AModal: Modal,
    ATooltip: Tooltip,
    AIcon: Icon,
    BaseControlAdapter,
    FormTitle,
    Description,
    SystemControl,
    FormSheet,
    ReverseRelevance,
    FormTabs,
    FormTabsPane
  }
})
export default class PcControlAdapter extends ControlAdapter {
  isFullScreen = false;

  frozenKeys: string[] = [];

  fullScreen() {
    this.isFullScreen = !this.isFullScreen;
  }

  onFreezeColumn(key: string, freeze: boolean) {
    if (freeze) {
      this.frozenKeys.push(key);
    } else {
      const index = this.frozenKeys.findIndex(k => k === key);
      if (index > -1) {
        this.frozenKeys.splice(index, 1);
      }
    }
  }

  get readonly(){
    return this.ctrl ? this.ctrl.readonly : false;
  }

  get typeClass() {
    const type = this.control.type;
    if((this.control as any).diff) {
      console.log(this.control.value)
    }
    const name = FormControlType[type];
    return name.toLowerCase();
  }

  @Inject()
  layoutTypeFn?: () => void;

  get layoutType() {
    if(this.layoutTypeFn){
      return this.layoutTypeFn()
    }
  }

  get fieldClassObj() {
    return {
      vertical: this.layoutType,
      error : this.hasError,
      required : this.required,
      edit : this.control.edit,
      diffControls: (this.control as any).diff
    }
  }
  
}
</script>


<style lang="less" scoped>
.ant-col > div.field {
  display: flex;
  padding: 8px;
  flex-shrink: 0;
  text-align: left;
  height: 100%;

  &.dotted {
    border-bottom: 1px dotted #e8e8e8;
  }
}

/deep/ .field__label {
  flex-shrink: 0;
  margin-right: 8px;
  display: flex;
  color: rgba(0, 0, 0, 0.65);

  & > div {
    word-break: break-word;
  }
}

/deep/ .field__control {
  flex-grow: 1;
  position: relative;
  min-width: 10px;

  & > div {
    line-height: 22px;
  }

  // &--selectOrg {
  //   overflow: hidden !important;
  // }
}

.edit {
  .dropdown,
  .relevanceform {
    line-height: 0.99;
  }
}

.ant-col > div.field.vertical{
  display: block;
}

.ant-col > div.field.vertical .field__label{
  font-size: 12px;
  font-weight:600;
  height:20px;
  line-height: 20px;
  width: 100%;
  max-width: 100%;
  padding-top: 0;
  margin-left: 12px;
}

.query-form .ant-col > div.field.vertical{
  display: flex;
  display: -webkit-box;
}

.query-form .ant-col > div.field.vertical .field__label{
  min-width: 1em;
  max-width: 6em;
  font-size: 14px;
  font-weight:400;
  margin-left: 0;
}
.field__control.detail{
  margin-left: 12px;
}
</style>

<style>
 .description .collapsed.vertical{
  padding-left: 14px;
}
</style>


