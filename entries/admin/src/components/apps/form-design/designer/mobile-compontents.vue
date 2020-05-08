<template>
  <div class="h3-moilbe-view">
    <div
      class="h3-moilbe-view-common"
      style="justify-content:center"
      v-if="isTitle"
    >
      <div class="h3-moilbe-view-common-title header-title">{{ control.options.name }}</div>
    </div>

    <div class="h3-moilbe-view-common" v-else-if="!smartOrg">
      <div
        class="h3-moilbe-view-common-title"
        :class="control.options.align ? control.options.align: ''"
      >
        <span :class="control.type === 200? 'bold' : ''">{{ control.options.name }}</span>
      </div>
      <div class="h3-moilbe-view-common-content">
        {{ placeholder }}
        <span
          v-if="!isSystem"
          class="aufontAll"
          :class="iconType"
          style="float: right;"
        ></span>
      </div>
    </div>

    <div class="h3-moilbe-view-org" v-else>
      <div class="h3-moilbe-view-org-title">{{ control.options.name }}</div>
      <span class="h3-moilbe-view-org-content">
        <span class="aufontAll h-icon-all-plus-o"></span>
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch, Inject } from "vue-property-decorator";

import { FormControl, FormControlType } from "../typings";

@Component({
  name: "h3-moible-view",
  components: {}
})
export default class Designer extends Vue {
  @Prop()
  control!: FormControl;
  created() {
    // console.log(this.control.options.name)
    // console.log(this.control.type)
  }
  get placeholder() {
    const type = this.control.type;

    if (this.isSystem) {
      return "系统自动填充";
    }

    switch (type) {
      case 1:
      case 2:
      case 4:
        return "请输入";
      case 200:
        return "";
      default:
        return "请选择";
    }
  }

  get isTitle() {
    return this.control.type === FormControlType.Title;
  }

  get isSystem() {
    const type = this.control.type;
    return (
      type >= FormControlType.SequenceNo && type <= FormControlType.SystemOther
    );
  }

  get iconType() {
    // else if (this.control.type === 11) { // 位置8, 11
    //     return 'h-icon-all-position-o';
    //   } else if (this.control.type === 8) { // 逻辑
    //     return 'h-icon-all-logic';
    //   }
    if (this.control.type === 9) {
      return "h-icon-all-paperclip-o";
    } else if (this.control.type === 10) {
      // 图片
      return "h-icon-all-picture-o";
    } else if ([1, 2, 4, 8, 11, 200].some(i => i === this.control.type)) {
      return "";
    } else {
      return "h-icon-all-right-o";
    }
  }
  get smartOrg() {
    return [50, 51, 60, 61].some(i => i === this.control.type);
  }
}
</script>

<style lang="less">
.h3-moilbe-view {
  border-bottom: 1px solid #eeeeee;
  padding: 0 15px;
  background-color: #ffffff;
  width: 100%;
  &-common {
    display: flex;
    min-height: 45px;
    padding: 13px 0;
    &-title {
      width: 90px;
      color: #666666;
      word-break: break-all;
      max-height: 100px;
      overflow-y: auto;
    }
    .left {
      text-align: left;
    }
    .right {
      text-align: right;
    }
    .center {
      text-align: center;
    }
    .bold {
      font-weight: bold;
      color: #333;
    }
    .header-title {
      width: 100%;
    }
    &-content {
      flex: 1;
      margin-left: 12px;
      color: #cccccc;
      .h-icon-all-paperclip-o,
      .h-icon-all-picture-o {
        font-size: 16px;
        color: #999999;
      }
      .h-icon-all-right-o {
        font-size: 12px;
      }
    }
  }
  &-org {
    display: flex;
    align-items: left;
    flex-direction: column;
    min-height: 45px;
    &-title {
      width: 100%;
      height: 45px;
      line-height: 45px;
      color: #666666;
    }
    &-content {
      width: 36px;
      height: 36px;
      margin: 4px 0 16px 0;
      line-height: 20px;
      border-radius: 36px;
      background: #eceff2;
      padding: 8px;
      .h-icon-all-plus-o {
        font-size: 20px;
        color: #929ca6;
      }
    }
  }
}
</style>