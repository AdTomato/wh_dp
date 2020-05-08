import { Component, Vue } from 'vue-property-decorator';

@Component
export class FormInputValidateMixin extends Vue {
  /**
   * 校验表单填写内容
   */
  validateForm() {
    return new Promise((resolve, reject) => {
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
        reject(new Error('validate failed'));
      } else {
        resolve();
      }
    });
  }
}
