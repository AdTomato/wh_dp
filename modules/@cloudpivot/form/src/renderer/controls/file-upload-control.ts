import * as typings from "../typings";

import { UploadControl, UploadFile } from "./upload-control";

export abstract class FileUploadControl extends UploadControl<
  typings.ImageUploadOptions
> {
  uploadFunc?: Function;

  deleteFunc?: Function;

  max: number = -1; // 图片可以上传最大数量
  min: number = -1; // 图片可以上传最少数量

  get isImage() {
    return this.control.type === typings.FormControlType.Image;
  }

  get text() {
    // return this.isImage ? "图片" : "附件";
    return this.isImage
      ? this.$t("cloudpivot.form.renderer.image")
      : this.$t("cloudpivot.form.renderer.attachment");
  }

  get multi() {
    if (this.isImage) {
      let arr = this.controlOpts.number.split("_");
      let type = arr.shift();
      return type === "batch";
    }
    return true;
  }

  get canUpload() {
    if (!this.multi && this.ctrl.value && this.ctrl.value.length > 0) {
      return false;
    }
    return true;
  }

  emitUpload(files: any[]) {
    if (!this.controlOpts.onUpload) {
      return;
    }

    if (!this.uploadFunc) {
      this.uploadFunc = new Function("files", this.controlOpts.onUpload);
    }

    this.uploadFunc.call(this.getThisProxy(), files);
  }

  emitDelete(files: any[]) {
    if (!this.controlOpts.onDelete) {
      return;
    }

    if (!this.deleteFunc) {
      this.deleteFunc = new Function("files", this.controlOpts.onDelete);
    }
    this.deleteFunc.call(this.getThisProxy(), files);
  }

  onFilesChange(files: UploadFile[]): void {
    // .filter(f => f.status === "done")
    // .map(f => f.response.data);

    const value = this.ctrl.value || [];

    let ids = value.map((f: any) => f.uid);

    const news = files.filter(f => ids.indexOf(f.uid) === -1);
    if (news.length > 0) {
      this.emitUpload(news);
    }

    ids = files.map(f => f.uid);

    const deletes = value.filter((f: any) => ids.indexOf(f.uid) === -1);
    if (deletes.length > 0) {
      this.emitDelete(deletes);
    }

    const val = files && files.length > 0 ? files : null;
    this.setValue(val);

    // const vals = this.ctrl.value as any[];
    // files.forEach((f, i) => {
    //   vals.splice(i, 1, f);
    // });
  }
  // 根据 文件 在value 中index移除文件,移动端删除文件使用
  removedFile(file: any) {
    const value = this.ctrl.value || [];
    if (value.length) {
      let nValue = value.filter((v: any) => v.uid !== file.uid);
      this.setValue(nValue);
    }
  }

  // 检测 图片上传最大数量
  checkImageNumber(showError: (msg: string) => void) {
    if (!this.isImage || !~this.max) {
      return true;
    }
    let currImageNum =
      this.ctrl.value && Array.isArray(this.ctrl.value)
        ? this.ctrl.value.length
        : 0;
    console.log(currImageNum, this.ctrl.value);
    if (currImageNum === 0) return true;

    if (currImageNum < this.max) {
      return true;
    } else {
      showError(`${this.controlOpts.name}数量不能大于${this.max}张`);
      return false;
    }
  }

  init() {
    if (this.isImage) {
      let arr = this.controlOpts.number.split("_");
      let type = arr.shift();
      if (arr.length) {
        for (let item of arr) {
          let [key, val] = item.split(":");
          switch (key) {
            case "min":
              this.min = +val;
              break;
            case "max":
              this.max = +val;
              break;
          }
        }
      }
    }
  }
}
