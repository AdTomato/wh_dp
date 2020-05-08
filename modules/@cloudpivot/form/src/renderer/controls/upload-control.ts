
import * as typings from '../typings';

import { BaseControl } from './base-control';

const ignore_file_types = [
  ".php",
  ".php5",
  ".php4",
  ".php3",
  ".php2",
  ".php1",
  ".html",
  ".htm",
  ".phtml",
  ".php",
  ".php5",
  ".php4",
  ".php3",
  ".php2",
  ".php1",
  ".html",
  ".htm",
  ".phtml",
  ".jsp",
  ".jspa",
  ".jspx",
  ".jsw",
  ".jsv",
  ".jspf",
  ".jtml",
  ".jsp",
  ".jspx",
  ".jspa",
  ".jsw",
  ".jsv",
  ".jspf",
  ".jhtml",
  ".asp",
  ".aspx",
  ".asa",
  ".asax",
  ".ascx",
  ".ashx",
  ".asmx",
  ".cer",
  ".asp",
  ".aspx",
  ".asa",
  ".asax",
  ".ascx",
  ".ashx",
  ".asmx",
  ".cer",
  ".swf"
];

const image_types = [".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg", ".tif"];

const doc_types = [".docx", ".xlsx", ".pptx", ".doc", ".xls", ".ppt", ".wpt", ".dot", ".rtf", ".txt", ".xml", ".pdf"];

export abstract class UploadControl<T extends typings.UploadOptions> extends BaseControl<T> {

  static service: FileService

  get headers() {
    return UploadControl.service.getHeaders();
  }

  get uploadUrl() {
    return UploadControl.service.getUploadUrl();
  }

  /**
   * 批量下载
   */
  get canBatchDownload() {
    return this.controlOpts.batch;
  }

  preview(file: any, fileList: Array<any>) {
    UploadControl.service.preview(file, fileList);
  }

  download(file: H3File) {
    UploadControl.service.download(file);
  }

  downloadBatch() {
    const files = this.ctrl.value as UploadFile[];
    if (files && files.length > 0) {
      const list = files.filter(f => f.response).map(f => f.response.data);
      UploadControl.service.downloadBatch(list);
    }
  }

  getDownloadUrl(file: H3File) {
    return UploadControl.service.getDownloadUrl(file);
  }


  checkFileSize(file: File, showError?: (msg: string) => void) {
    const limit = this.getLimitSize();
    const size = file.size / 1024 / 1024;
    if (size > limit) {
      if (showError) {
        showError(`文件大小不能超过${limit}M`);
      }
      return false;
    }

    return true;
  }

  checkFileType(name: string, showError?: (msg: string) => void) {
    const idx = name.lastIndexOf(".");
    if (idx === -1) {
      return false;
    }

    const ext = name.substring(idx).toLowerCase();

    if (this.control.type === typings.FormControlType.Image) {
      const is = image_types.indexOf(ext) > -1;
      if (!is && showError) {
        showError(`图片格式错误","只支持${image_types.join("、")}`);
      }
      return is;
    }

    if (ignore_file_types.indexOf(ext) > -1) {
      if (showError) {
        showError(`文件格式错误","不支持${ext}文件`);
      }
      return false;
    }

    if (!this.control.options.fileTypes) {
      return true;
    }

    const types = this.control.options.fileTypes.split(",");
    if (types.indexOf(ext) < 0) {
      if (showError) {
        showError(`文件格式错误","只支持${types.join("、")}`);
      }
      return false;
    }

    return true;
  }

  get limitSize() {
    return this.getLimitSize();
  }

  getExt(filename : string){
    const idx = filename.lastIndexOf(".");
    if (idx === -1) {
      return '';
    }

    const ext = filename.substring(idx).toLowerCase();
    
    return ext;
  }

  testIamge(ext : string){
    return image_types.includes(ext);
  }
  
  testDocument(ext : string){
    return doc_types.includes(ext);
  }

  getLimitSize() {
    const type = this.control.options.limit;
    switch (type) {
      case typings.UploadLimitType["1M"]:
        return 1;
      case typings.UploadLimitType["5M"]:
        return 5;

      default:
      case typings.UploadLimitType["10M"]:
        return 10;

      case typings.UploadLimitType["20M"]:
        return 20;
      case typings.UploadLimitType["50M"]:
        return 50;
      case typings.UploadLimitType["100M"]:
        return 100;
      case typings.UploadLimitType["200M"]:
        return 200;
      // case typings.UploadLimitType["512M"]:
      //   return 512;
      // case typings.UploadLimitType["1G"]:
      //   return 1024;
    }
  }

  map(x: any, mobile?: boolean) {
    if (x.refId) {
      const url = this.getDownloadUrl(x);
      return {
        uid: x.refId,
        name: x.name,
        status: mobile ? 2 : 'done',
        url: url,
        size : x.fileSize,
        response: {
          data: x
        }
      };
    } else {
      return x;
    }
  }

}


export interface H3File {
  refId: string
  fileExtension: string
  mimeType: string
  name: string
  storageMethod: string
}


export enum UploadStatus {

  Uploading = 1,

  Done = 2,

  Error = 3

}


export interface UploadFile {

  uid: string

  name: string

  size: number

  status: UploadStatus

  response: any

  type: string

  base64?: string

  url?: string

}


export interface FileService {

  getUploadUrl(): string

  getDownloadUrl(file: H3File): string

  getHeaders(): { [key: string]: string }

  download(file: H3File): void;

  downloadBatch(files: H3File[]): void;

  preview(file: any, fileList: Array<any>): void

  upFile(file: any): Promise<any>;

  getListUploadUrl(): string;

  getSheetDetail(params: any): Promise<any>;

  exportSheet(params: any): void;

}

