<template>
  <div class="password-span">
    <template v-if="!showPassword">
      <span class="text">
        ****************
      </span>
      <i
        class="eye icon aufontAll h-icon-all-eye-close"
        @click="passwordVisible"
      />
    </template>
    <template v-else>
      <div
        :title="value"
        :class="{'show-all':fn,'text':!fn}"
      >
        {{ value }}
        <a-icon
          class="eye"
          type="eye-o"
          @click="passwordVisible"
        />
      </div>
      <!-- <a-icon type="eye-invisible" @click="showPassword = !showPassword" /> -->

    </template>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { fn } from 'moment';
@Component({
  name: 'password-span',
  components: {

  }
})
export default class PasswordSpan extends Vue {
  @Prop({
    default: ''
  }) value!: string

  @Prop({
    default: undefined
  }) fn!: any

  showPassword: boolean = false;

  passwordVisible() {
    if (!this.showPassword && this.fn && typeof this.fn === 'function') {
      this.fn(() => {
        this.showPassword = !this.showPassword;
      });
    } else {
      this.showPassword = !this.showPassword;
    }
  }
}
</script>

<style lang="less" scoped>
.password-span{
  line-height: 32px;
  width: 100%;
  .text {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    float: left;
    max-width: 80%;
  }
  .show-all{
    word-break: break-all;
    width: 120%;
  }
  .eye{
    // vertical-align: 2px;
    font-size: 14px;
    margin-left: 16px;
    cursor: pointer;
  }
}
</style>

