<template>
  <div class="urge-content">
    <div class="desc-box">
      <textarea
        v-model="urgeContent"
        :placeholder="$t('cloudpivot.form.runtime.urge.plzInput')"
        autofocus
      ></textarea>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
@Component({
  name: "urge-content"
})
export default class UrgeContent extends Vue {
  urgeContent: string = "";
}
</script>
<style lang='less'>
@import "~@cloudpivot/common/styles/mixins.less";
.urge-content {
  .desc-box {
    .px2rem(height, 280px);
    .px2rem(padding, 26px);
    position: relative;
    background: white;
    box-shadow: 0px 1px 0px 0px rgba(238, 238, 238, 1);
    textarea {
      width: 100%;
      height: 100%;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.85);
      border: none;
      resize: none;
      outline: none;
      border-radius: 4px;
    }
  }
}
</style>
