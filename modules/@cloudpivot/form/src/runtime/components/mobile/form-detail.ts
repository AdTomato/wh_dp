
import * as renderer from '../../../renderer';

import { FormDetail } from '../form-detail';

import { FormAction } from '../../form-action';

import { FormActionButton } from '../../form-action-modal';


export abstract class MobileFormDetail extends FormDetail {

  error = '';

  get isMobile(){
    return true;
  }

  // async presubmit(ac: FormActionButton, isMobile?: boolean) {
  //   const result = await super.presubmit(ac, true);
  //   return result;
  // }

  // /**
  //  * 驳回
  //  */
  // async reject(data: any) {
  //   if (this.approval && !this.approval.controller.value.content) {
  //     this.$message.error("请填写审批意见");
  //     return;
  //   }

  //   return super.reject(data) as any;
  // }

  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        const formWrap = this.$refs.formRenderer as any;
        // const formRenderer = formWrap.$refs.formRenderer as any;
        const formRenderer = this.$refs.formRenderer as any;
        if (!formRenderer) {
          return;
        }
        this.$watch(() => (formRenderer.getErrors()), (errors: any) => {
          if (errors) {
            console.log(errors);
            const keys = Object.keys(errors);
            if (keys.length > 0) {
              const key = keys[0];
              this.error = formRenderer.getErrorMessage(key, errors[key][0]);
              return;
            }
          }
          this.error = '';
        }, {
          immediate: true
        });
      }, 200);
    });
  }

}
