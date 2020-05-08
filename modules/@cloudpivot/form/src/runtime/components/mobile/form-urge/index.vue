<template>
  <div class="form-urge">
    <div class="urge-tab">
      <span
        :class="curComp === 'Content' ? 'cur' : ''"
        @click="toggle('Content')"
      >{{ $t('cloudpivot.form.runtime.urge.urgeContent') }}</span>
      <span
        :class="curComp === 'Record' ? 'cur' : ''"
        @click="toggle('Record')"
      >{{ $t('cloudpivot.form.runtime.urge.urgeRecord') }}</span>
    </div>

    <div class="tab-content">
      <component
        ref="component"
        :is="curComp"
        :urgeList="urgeList"
      />
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import {
  FormActionComponent,
  FormActionModalOptions
} from "../../../form-action-modal";

import { formApi } from "@cloudpivot/api";

import Content from "./content.vue";
import Record from "./record.vue";

@Component({
  name: "form-urge",
  components: {
    Content,
    Record
  }
})
export default class FormUrge extends Vue implements FormActionComponent {
  curComp: string = "Content";

  urgeList: Array<any> = [];

  toggle(compName: string) {
    if (!compName) return;
    this.curComp = compName;
    if (this.curComp === "Record") {
      this.getUrgeList();
    }
  }

  submit() {
    const content = (this.$refs.component as any).urgeContent;
    const instanceId = this.$route.query.workflowInstanceId;
    const data = {
      content,
      instanceId,
      type: "mobile"
    };
    return data;
  }

  /**
   * 获取催办记录
   */
  async getUrgeList() {
    const instanceId: string = this.$route.query.workflowInstanceId as string;
    if (!instanceId) return;
    const res: any = await formApi.getUrgeList(instanceId);
    if (res.errcode === 0) {
      this.urgeList = res.data;
    }
  }
}
</script>
<style lang='less'>
@import "~@cloudpivot/common/styles/mixins.less";
.form-urge {
  background: #f8f8f8 !important;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-flow: column;
  .urge-tab {
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-bottom: 1px solid rgba(228, 228, 228, 1);
    background: white;
    span {
      display: inline-block;
      .px2rem(height, 84px);
      .px2rem(line-height, 84px);
      .px2rem(font-size, 30px);
      font-weight: 400;
      color: rgba(153, 153, 153, 1);
      &.cur {
        color: rgba(0, 0, 0, 0.85);
        font-weight: 600;
        position: relative;
        &:after {
          content: "";
          display: block;
          .px2rem(width, 48px);
          .px2rem(height, 6px);
          .px2rem(border-radius, 3px);
          background: rgba(41, 112, 255, 1);
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
        }
      }
    }
  }
  .tab-content {
    background: white;
    overflow: hidden;
    .px2rem(margin-top, 20px);
  }
}
</style>
