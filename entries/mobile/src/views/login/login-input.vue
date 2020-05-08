<template>
  <div class="login-input">
    <p v-show="showTitle" class="login-input-label">{{ lable }}</p>
    <input
      :type="inputType"
      :placeholder="placeholder"
      @focus="focus"
      @blur="blur"
      @change="chang"
      v-model="val"
    />
    <i
      v-if="type === 'password'"
      class="icon aufontAll icon-eye"
      :class="{'h-icon-all-eye-close': !showPassWord, 'h-icon-all-eye-o': showPassWord}"
      @click="switchType"
    ></i>
    <i
      @click="clearValue"
      v-show="val && showTitle"
      class="clear icon aufontAll icon-clear"
      :class="{'password-clear': type === 'password'}"
    >&#xe994;</i>
  </div>
</template>
<script lang="ts">
enum inputType {
  text = "text",

  password = "password"
}

import { Component, Vue, Prop, Model, Watch } from "vue-property-decorator";

@Component({
  name: "login-input",
  components: {}
})
export default class LoginInput extends Vue {
  @Prop({
    default: ""
  })
  placeholder!: boolean;

  @Model("change")
  val!: string;

  @Prop({
    default: ""
  })
  lable!: string;

  @Prop({
    default: inputType.text
  })
  type!: inputType;

  showTitle = false;

  showPassWord = false;

  inputType = inputType.text;

  created() {
    this.inputType = this.type;
  }

  focus() {
    this.showTitle = true;
  }
  blur() {
    this.showTitle = false;
  }
  chang(e: any) {
    this.$emit("change", e.target.value);
  }

  switchType() {
    this.showPassWord = !this.showPassWord;
    this.inputType = this.showPassWord ? inputType.text : inputType.password;
  }

  clearValue() {
    this.$emit("change", "");
    // this.val = '';
  }
}
</script>
<style lang="less" scoped>
.login-input {
  position: relative;
  text-align: left;
  .login-input-label {
    color: @primary-color;
    font-size: 0.373rem;
    line-height: 0.533rem;
    position: absolute;
    top: 0;
  }
  input {
    width: 100%;
    border-bottom: 0.04rem solid rgba(230, 235, 246, 1);
    background-color: inherit;
    padding: 0.13rem 0;
    font-size: 0.43rem;
    padding-top: 0.68rem;
    &::-webkit-input-placeholder {
      color: #999;
    }
  }
  .icon-eye {
    position: absolute;
    right: 0;
    top: 0.6rem;
    color: rgba(204, 204, 204, 1);
  }
  .icon-clear {
    position: absolute;
    right: 0;
    top: 0.6rem;
    color: rgba(204, 204, 204, 1);
    &.password-clear {
      right: 0.74rem;
    }
  }
}
</style>
