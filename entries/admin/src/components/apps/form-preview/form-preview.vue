<template>
  <div class="form-preview">
    <div class="header">
      <div class="left">表单预览</div>
      <div @click="switchView('pc')" :class="{ selected : !isMobile }">PC端</div>
      <div @click="switchView('mobile')" :class="{ selected : isMobile }">移动端</div>
      <div class="right">
        <div class="hide-preview" @click="hidePreview">
          <i class="icon aufontAll h-icon-all-close"></i>
          <span>关闭</span>
        </div>
      </div>
    </div>
    <div class="form-content">
      <div class="form">
        <div class="form-actions" v-if="!isMobile">
          <a-button disabled>暂存</a-button>
          <a-button disabled>驳回</a-button>
          <a-button disabled>提交</a-button>
          <a-button disabled v-for="(action, key) in actions" :key="key">{{ action.text }}</a-button>
        </div>

        <smart-form :preview="preview" actionsAlign="right" :mobile="isMobile"></smart-form>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Provide } from "vue-property-decorator";
import SmartForm from "../shared/smart-form.vue";
import { schema } from "@cloudpivot/form";
@Component({
  name: "form-preview",
  components: {
    SmartForm
  }
})
export default class FormPreview extends Vue {
  @Prop() curview!: any;

  view = "pc";
  actions: schema.FormAction[] = [];
  preview: any = {};

  mounted() {
    this.preview = this.curview;
  }

  get isMobile() {
    return this.view === "mobile";
  }

  switchView(type: string) {
    this.view = type;
  }

  hidePreview() {
    this.$emit("hidePreview");
  }

  @Provide()
  getScrollEl() {
    return document.body;
  }
}
</script>

<style lang="less" scoped>
.form-preview {
  height: 100%;
  background: #fff;
}
.container {
  top: 0 !important;
}

.form {
  width: 1024px;
  margin: auto;
  padding-bottom: 2em;
  margin-bottom: 5em;
}

.form-actions {
  padding: 16px;
  text-align: right;

  & > button {
    margin-right: 8px;
  }
}

.header {
  display: flex;
  justify-content: center;
  background: #052535;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.85);
  font-size: 16px;
  position: relative;

  & > div {
    &:not(.left) {
      cursor: pointer;
    }
    min-width: 50px;
    height: 64px;
    margin: 0 12px;
    padding: 0 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    &.selected {
      color: @primary-color;

      &::after {
        content: "";
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0;
        border-bottom: 3px solid @primary-color;
      }
    }
  }

  & > div.left {
    position: absolute;
    left: 12px;
  }
  & > div.right {
    position: absolute;
    right: 12px;
  }

  .hide-preview {
    cursor: pointer;
    width: 82px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    border-radius: 4px;
    border: 1px solid #d9d9d9;
    color: #fff;
    font-size: 14px;
    i {
      font-size: 14px;
      margin-right: 8px;
    }
  }
}
.form-content {
  height: 100%;
  overflow-y: auto;
}
</style>
  