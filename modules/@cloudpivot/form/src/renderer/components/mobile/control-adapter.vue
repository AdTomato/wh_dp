
<template>
  <div v-if="isTitle" v-show="show"></div>

  <description
    :control="control"
    v-else-if="isDescription"
    v-show="show"
  ></description>

  <form-sheet
    :id="id"
    :control="control"
    v-else-if="isSheet"
  ></form-sheet>

  <system-control
    :control="control"
    v-else-if="isSystem"
    v-show="show"
  ></system-control>

  <!-- <a-col class="ant-col" :span="span" v-else v-show="show"> -->
  <div
    v-else
    v-show="show"
    :id="id"
  >
    <base-control-adapter :control="control" :class="{ error : hasError, vertical : layoutType }"></base-control-adapter>
  </div>

  <!-- </a-col> -->
</template>


<script lang='ts'>
import { Vue, Prop, Component, Inject } from "vue-property-decorator";

import { RendererFormControl } from "../../typings";

import { FormControlType } from "../../typings";

import BaseControlAdapter from "./base-control-adapter.vue";

import FormSheet from "./form-sheet.vue";
import SystemControl from "./system-control.vue";

import FormTitle from "../layout/form-title.vue";
import Description from "../layout/description.vue";

import ControlAdapter from "../control-adapter";

@Component({
  name: "control-adapter",
  components: {
    BaseControlAdapter,
    FormTitle,
    Description,
    SystemControl,
    FormSheet
  }
})
export default class MobileControlAdapter extends ControlAdapter {

  @Inject()
  layoutTypeFn!: Function;

  //上下布局模式
  get layoutType(){
    if(this.layoutTypeFn){
      return this.layoutTypeFn();
    }
  }
}
</script>


<style>
.vertical .h3-FBH, .field.vertical{
  display: block;
}

.vertical .h3-FBH>.h3-FB1, .vertical .h3-FBH>.h3-FB2, .vertical .h3-FBH>.h3-FB3{
  width: 100%;
  position: relative;
  padding-top: 0;
}

.h3-org.vertical .h3-FBH .h3-field-layout-h-label,.vertical.form-sheet .h3-org-field .h3-field-layout-h-label{
  padding-bottom: 0;
}

/* 处理子表基础控件上下布局样式 */
.h3-form-sheet.vertical .field{
  display: block;
}

.h3-form-sheet.vertical .field__label{
  width: 100%;
  position: relative;
  padding: 10px 0;  
}

/* 处理子表中的关联表单控件上下布局样式 */
.h3-form-sheet.vertical .relevance-form .field__control{
  padding-bottom: 10px;
}
.h3-form-sheet.vertical .relevance-form .h-icon-all-right-o{
  position: absolute;
  right: 20px;
  bottom: 14px;
}
/* 处理子表中的逻辑控件上下布局样式 */
.vertical .input-logic .h3-field-box > .h3-FB1{
  text-align: left;
}

/* 处理子表中的手写签名控件上下布局样式 */
.vertical .input-signsture .row__file{
  display: block;
}

/* 处理子表数值控件上线布局 */
.h3-form-sheet.vertical .ant-input-number-input-wrap{
  height: 30px;
}
.h3-form-sheet.vertical .icon-base-close-circle{
  position: absolute;
  right: 20px;
  bottom: 10px;
}

</style>

