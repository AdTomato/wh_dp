
import {
  renderer
} from '@cloudpivot/form';

import * as platform from '@cloudpivot/platform';

import env from '../env';

import axios from 'axios';

export class DefaultFileService implements renderer.FileService {
  getListUploadUrl(): string {
    return `${env.apiHost}/api/runtime/query/upload_file`;
  }

  getUploadUrl(): string {
    return `${env.apiHost}/api/aliyun/upload`;
  }

  getDownloadUrl(file: renderer.H3File): string {
    const url = `${env.apiHost}/api/aliyun/download?refId=${file.refId}`;
    const token = (window as any).externalLinkToken || localStorage.getItem('token');
    if (!token) {
      return url;
    }
    return `${url}&access_token=${token}`;
  }

  getHeaders(): { [key: string]: string } {
    const token = (window as any).externalLinkToken || localStorage.getItem('token');
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
    return {};
  }

  download(file: renderer.H3File): void {
    const url = this.getDownloadUrl(file);
    platform.service.openLink(url);
    // if (common.isDingtalk) {
    //   dingtalk.openLink(url);
    // } else {
    //   window.open(url);
    // }
  }

  downloadBatch(files: renderer.H3File[]): void {

  }

  preview(file: any, fileList: Array<any>) {
    // 无用废弃
    // if (!file) {
    //   return;
    // }

    // let f: any;
    // if (file.refId) {
    //   f = file;
    // } else if (file.response && file.response.errcode === 0) {
    //   f = file.response.data;
    // }

    // if (!f) {
    //   return;
    // }

    // const current = this.getDownloadUrl(f);

    // // alert(current);
    // const files = fileList.map((x) => {
    //   if (x.refId) {
    //     return this.getDownloadUrl(x);
    //   }
    //   if (x.response && x.response.errcode === 0) {
    //     return this.getDownloadUrl(x.response.data);
    //   }
    //   return null;
    // }).filter(x => x) as string[];

    // dingtalk.previewImage({
    //   current,
    //   urls: files,
    //   fn: (res:any) => {
    //     // alert(res);
    //   },
    //   failFn: () => {
    //     // alert('error');
    //   }
    // });
  }

  upFile(file: any) {

    return new Promise((resolve, reject) => {

      const formData = new FormData();

      // const arr:any[] = file.split(',');

      const binaryString = window.atob(file.split(',')[1]) || '';
      const arrayBuffer = new ArrayBuffer(binaryString.length);
      const intArray = new Uint8Array(arrayBuffer);

      for (let i = 0, j = binaryString.length; i < j; i++) {
        intArray[i] = binaryString.charCodeAt(i);
      }

      const fileData = [intArray];

      const f: any = new Blob(fileData, {
        type: 'image/png'
      });

      const fileName = 'signsture.png';

      const fileOfBlob = new File([f], fileName, { type: 'image/png' });

      formData.append('file', fileOfBlob);

      formData.append('isAddWatermark', 'false');

      formData.append('locationInfo', '');

      formData.append('fileName', fileName);

      axios.post(env.apiHost + '/api/aliyun/upload', formData).then(res => {
        resolve(res);
      })
    });
  }

  getSheetDetail(fileName: string) {
    return Promise.resolve();
  }

  exportSheet(params: any) { }

}
