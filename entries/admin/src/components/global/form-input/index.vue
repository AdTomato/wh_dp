<template>
  <div :class="['form-input',message && 'has-error']">
    <template v-if="tipPosition === 'top'">
      <a-tooltip :visible="showTooltip">
        <template slot="title">
          <span>{{ message }}</span>
        </template>
        <a-input
          v-if="loaded"
          :type="type"
          :defaultValue="defaultValue || value"
          :placeholder="placeholder"
          @change="validateValue"
          @blur="validateValue"
          :disabled="disabled"
        />
      </a-tooltip>
      <!-- :defaultValue="defaultValue || value" -->
    </template>
    <template v-else>
      <a-input
        v-if="loaded"
        :type="type"
        :defaultValue="defaultValue || value"
        :placeholder="placeholder"
        @change="validateValue"
        @blur="validateValue"
        :disabled="disabled"
      />
      <!-- :defaultValue="defaultValue || value" -->
      <p class="form-input__message" v-if="message">{{ message }}</p>
    </template>
  </div>
</template>
<script lang="ts">
/**
 * 使用范例：
 <form-input
    v-model="form.name"
    placeholder="请填写"
    :rules="rules.name"
    :type="'text'"
    :defaultValue="defaultValue"
    @change="change"
  />
 * 表单校验方法：
  validateForm() {
    let hasError: boolean = false;
    const inputs: any[] = this.$vnode.componentInstance
      ? this.$vnode.componentInstance.$children.filter((el: any) => el.$el.className.includes('form-input'))
      : [];
    inputs.forEach((node: any) => {
      const unValidated: boolean = node.validateValue({ target: { value: node.content } });
      if (unValidated) {
        hasError = true;
      }
    });
    if (hasError) {
      return Promise.reject(new Error('validate failed'));
    }
    return Promise.resolve();
  }
 */
import {
 Component, Vue, Prop, Watch 
} from 'vue-property-decorator';

declare interface ruleItem {
  required?: boolean,
  pattern?: RegExp,
  validator?: Function,
  message: any;
}

enum TipPositions {
  top = 'top',
  bottom = 'bottom',
}

@Component({
  name: 'form-input'
})
export default class FormInput extends Vue {
  @Prop() value?: any;

  @Prop({ default: 'text' }) type?: string;

  @Prop({ default: '' }) defaultValue?: any;

  @Prop({ default: '' }) placeholder?: any;

  @Prop({ default: 'bottom' }) tipPosition?: TipPositions;

  @Prop({ default: () => [] }) rules?: ruleItem[];

  @Prop({ default: false }) disabled?: boolean;


  content: any = this.value || '';

  loaded: boolean = false;

  // 输入提示信息
  message: string = '';

  showTooltip: boolean = false;

  /**
   * 校验输入内容
   */
  validateValue(e: any) {
    // this.value = e.target.value;
    this.$emit('change', e);
    this.message = '';
    const val: any = e.target.value;
    // this.value = val;
    this.content = val;
    if (!this.rules || !this.rules.length) {
      this.setValue(val);
      return;
    }
    const vm: any = this;
    this.rules.some((item: ruleItem) => {
      if (item.required && !val) {
        this.message = item.message;
        return true;
      }
      if (item.pattern && !item.pattern.test(val)) {
        this.message = item.message;
        return true;
      }
      if (item.validator && typeof item.validator === 'function') {
        let validateStatus: boolean = false;
        item.validator(item, val, (res?:any) => {
          if (typeof res !== 'undefined') {
            vm.message = res || item.message;
            validateStatus = true;
          }
        });
        return validateStatus;
      }
      return false;
    });
    if (!this.message) {
      this.setValue(val);
    } else if (this.tipPosition === 'top') {
      this.showTooltip = true;
      setTimeout(() => {
        this.showTooltip = false;
      }, 3000);
    }

    return this.message;
  }


  /**
   * 设置值
   */
  setValue(val: any) {
    if (val !== this.value) {
      this.$emit('input', val);
    }
  }

  reset() {
    this.message = '';
  }

  mounted() {
    this.loaded = true;
    this.$nextTick(() => {
      this.content = this.value || this.defaultValue;
    });
  }
  // @Watch('value')
  // onValueChange(value:string){
  //   debugger;
  //   this.content = value;
  // }
}
</script>
<style lang="less" scoped>
.form-input {
  width: 100%;
  position: relative;
  zoom: 1;
  &__message {
    position: absolute;
    left: 0;
    right: 0;
    font-size:12px;
    font-family:PingFang-SC-Regular;
    font-weight:400;
    color:rgb(245,34,45);
  }
}
</style>
