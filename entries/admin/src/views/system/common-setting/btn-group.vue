<template>
  <div class="btn-group">
    <a-button
      type="primary"
      @click="$emit('save')"
      class="btn-group__btn"
      :disabled="disabled[0]"
    >{{ btnText[0] }}</a-button>
    <a-button @click="$emit('connect')" :disabled="disabled[1]">{{ btnText[1] }}</a-button>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
@Component({
  name: "btn-group"
})
export default class BtnGroup extends Vue {
  @Prop({
    default: ["保存", "连接测试"]
  })
  btnText?: Array<String>;

  @Prop({
    default: [false, false]
  })
  disabled?: Array<Boolean>;
}
</script>
<style lang="less">
.btn-group {
  &__btn {
    margin-right: 8px;
  }
}
</style>
