import * as renderer from "../../../renderer";

import { FormDetail } from "../form-detail";

import * as schema from "../../../schema";
import { Modal } from "h3-antd-vue";

export abstract class PcFormDetail extends FormDetail {
  get isMobile() {
    return false;
  }

  validate(onlyUpload?: boolean) {
    const formBody = document.querySelector(".form-body") as HTMLDivElement;

    let getOffsetTop = (el: any, body: any):any => {
      let offsetParent = el.offsetParent;
      let offsetTop = offsetParent.offsetTop;
      if (offsetTop === 0 && offsetParent !== body) {
        return getOffsetTop(offsetParent, body)
      } else {
        return offsetTop;
      }
      
    }
    const scrollTo = (key: string) => {
      
      const el = document.querySelector(`#${key}`) as HTMLDivElement;
      
      if (el && formBody) {
        let scrollTop = getOffsetTop(el, formBody);
        formBody.scrollTop = scrollTop;
      }
    };
    
    if (!onlyUpload) {
      // const formWrap = this.$refs.formRenderer as any;
      // const formRenderer = formWrap.$refs.formRenderer as any;
      const formRenderer = this.$refs.formRenderer as any;
      if (!formRenderer.validate()) {
        const errors = formRenderer.getErrors();
        if (errors) {
          let keys = Object.keys(errors);
          let msg = "";

          const formControls: renderer.RendererFormControl[] = [];
          renderer.components.FormRendererHelper.findFormControl(
            this.controls,
            formControls
          );

          if (keys.length > 0) {
            let key = keys[0];

            const control = formControls.find(c => c.key === key);

            if (control && control.type === schema.FormControlType.Sheet) {
              const map = errors[key];
              keys = Object.keys(map);
              const keys2 = Object.keys(map[keys[0]]);
              const err = formRenderer.getErrorMessage(
                keys2[0],
                map[keys[0]][keys2[0]][0],
                key
              );
              msg = err;
              // key = key + keys[0];
              this.showErrorMsg(msg, control, keys2[0]);
            } else {
              msg = formRenderer.getErrorMessage(key, errors[key][0]);
              this.showErrorMsg(msg, control);
            }
            // this.$message.error(msg);
            scrollTo(key);
            return false;
          }
        }
      }
    }

    let upload = super.findUploadBy(renderer.UploadStatus.Uploading);
    if (upload) {
      this.$message.error(`${upload.options.name}正在上传！`);
      scrollTo(upload.key);
      return false;
    }

    upload = super.findUploadBy(renderer.UploadStatus.Error);
    if (upload) {
      this.$message.error(`${upload.options.name}上传失败！`);
      scrollTo(upload.key);
      return false;
    }

    if (!onlyUpload) {
      if (this.approval) {
        const ctrl = this.approval.controller as any;
        if (ctrl.required && (!ctrl.value || !ctrl.value.content)) {
          this.$message.error(`请输入${this.approval.options.name}`);
          return false;
        }
      }
      const formControls: renderer.RendererFormControl[] = [];
      renderer.components.FormRendererHelper.findFormControl(
        this.controls,
        formControls
      );

      const isRequire: boolean = formControls
        .filter(c => c.type === renderer.FormControlType.Address)
        .some((c: any) => {
          const val: any = c.controller.value;
          if (c.controller.required && (!val || !val.provinceAdcode)) {
            // debugger
            c.controller.setError("required");
            this.$message.error(`请输入${c.options.name}`);
            return true;
          }

          return false;
        });

      if (isRequire) {
        return false;
      }
    }

    return true;
  }

  showErrorMsg(errorMsg: string, control: any, sheet = "") {
    let ctl = control;
    if (control.type === schema.FormControlType.Sheet && sheet) {
      ctl = control.columns.find((v: any) => v.key === sheet);
    }
    if (
      ctl &&
      (ctl.type === schema.FormControlType.Number ||
        ctl.type === schema.FormControlType.Date)
    ) {
      let verifyFormula = ctl.options.verifyFormula;
      if (verifyFormula) {
        if (isJSONString(verifyFormula)) {
          let obj = JSON.parse(verifyFormula);
          let type = obj.dialogBox || 1;
          if (+type === 2) {
            this.dialogError(errorMsg);
            return;
          }
        } else {
          let arr = /dialogBox:\d/.exec(verifyFormula);
          if (arr) {
            let type = arr[0].split(":")[1];
            if (+type === 2) {
              this.dialogError(errorMsg);
              return;
            }
          }
        }
      }
    }
    this.messageError(errorMsg);
  }
  // 用提示框 展示错误信息
  messageError(err: string) {
    this.$message.error(err);
  }
  dialogError(err: string) {
    Modal.error({
      title: "错误提示",
      content: err
    });
  }
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
}
function isJSONString(str: string) {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
}
