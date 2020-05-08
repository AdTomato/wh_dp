<template>
  <div class="property-wrap">
    <div class="property-left">
      <span
        v-if="title"
        class="text"
        :title="title">{{ label }}</span>
      <span v-else class="text">{{ label }}</span>
      <!-- <slot name="tip" class="icon"></slot> -->
      <a-tooltip placement="top" v-if="tip">
        <span slot="title">{{ tip }}</span>
        <i class="icon aufontAll h-icon-all-question-circle-o"></i>
      </a-tooltip>
    </div>
    <div class="property-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'PropertyWidget'
})

export default class PropertyWidget extends Vue {
  @Prop() label !: any;

  @Prop() tip !: any;

  @Prop() title !: any;
}
</script>


<style lang="less" scoped>
.property-wrap {
  display: flex;
  width: 100%;
  border-bottom: 1px solid #e9e9e9;
  &:first-child {
    border-top: 1px solid #e9e9e9;
  }
}
.property-left {
  flex-basis: 33.33%;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  min-width: 80px;
  padding: 5px 8px 5px 12px;
  box-sizing: border-box;
  border-right: 1px solid #e9e9e9;
  .text {
    display: inline-block;
    vertical-align: middle;
    min-width: 42px;
    width: calc(100% - 16px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(0,0,0,.65);
  }
  .icon {
    display: inline-block;
    vertical-align: middle;
    flex: none;
    cursor: pointer;
  }
}
.property-right {
  flex-shrink: 1;
  display: inline-flex;
  align-self: center;
  padding: 0;
  flex-basis: 66.66%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
