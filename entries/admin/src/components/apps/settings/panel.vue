
<template>
  <div class="h3-panel">
    <div
      class="h3-panel-header"
      v-if="title"
      :title="title"
      @click="collapse"
    >
      <span>{{ title }}</span>
      <span class="h3-panel-header-tips">{{ tips }}</span>
      <i
        class="icon aufontAll h-icon-all-right-o"
        :class="{ expanded : show }"
      />
    </div>
    <transition name="h3-fade">
      <div class="h3-panel-body" v-show="show">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang='ts'>
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
  name: "h3-panel",
  components: {}
})
export default class H3Panel extends Vue {
  @Prop({
    default: ""
  })
  title!: string;

  @Prop({
    default: ""
  })
  tips!: string;

  @Prop()
  collapsible!: boolean;

  @Prop()
  collapsed!: boolean;

  @Prop({
    default: ""
  })
  labelStyle!: string;

  @Prop({
    default: false
  })
  showHeard!: boolean;

  show = true;

  get icon() {
    return this.show ? "h-icon-all-down-o" : "h-icon-all-right-o";
  }

  collapse() {
    if (this.collapsible) {
      this.show = !this.show;
    }
  }
   
  @Watch("collapsed", {
    immediate: true
  })
  setCollapsed(val: boolean) {
    this.show = val;
  }
}
</script>


<style lang="less" scoped>
.h3-panel-right {
  float: right;
  cursor: pointer;
  margin-top: 6px;
}
.h3-panel-header {
  background:rgba(250,250,250,1);
  box-shadow:0px 1px 0px 0px rgba(232,232,232,1);
  // display: inline-block;
  // align-items: center;
  text-align: left;
  padding: 9px 4px 9px 16px;
  // border-bottom: 1px solid rgba(217, 217, 217, 1);

  // user-select: none;
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  cursor: pointer;

  &.center {
    // justify-content: center;
    text-align: center;
  }

  &.right {
    // justify-content: flex-end;
    text-align: right;
  }

  &.left {
    text-align: left;
  }

  & > span {
    font-size: 14px;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
  }

  & > i {
    margin-left: 0.5em;
    margin-right: 9px;
    font-size: 10px;
    display: inline-block;
    transition: transform 0.24s;
    float: right;

    &.expanded {
      transform: rotate(90deg);
    }
  }
  & > .h3-panel-header-tips {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);
    margin-left: 8px;
  }
}

.h3-panel-body {
  overflow: hidden;
}

.h3-panel.xl > .h3-panel-header {
  padding: @base4-padding-sm 0;

  & > span {
    font-size: 18px;
  }
}

.h3-fade-enter-active,
.h3-fade-leave-active {
  max-height: 100rem;
  // transition: all 3s ease;
  transition: all 0.15s cubic-bezier(0.645, 0.045, 0.355, 1) !important;
}

.h3-fade-enter,
.h3-fade-leave-to {
  opacity: 0;
  max-height: 0;
}
</style>
