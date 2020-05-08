
import {
  renderer
} from '@cloudpivot/form';

import env from '../env';

import { formApi,listApi } from '@cloudpivot/api';

import { utils } from '@cloudpivot/common';


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
    window.open(url);
  }

  downloadBatch(files: renderer.H3File[]): void {
    if (files.length === 0) {
      return;
    }

    const refIds = files.map(f => f.refId).join(',');
    let url = `${env.apiHost}/api/aliyun/download_multi?multiVO=${refIds}`;

    const token = (window as any).externalLinkToken || localStorage.getItem('token');
    if (token) {
      url += `&access_token=${token}`;
    }

    window.open(url);

    // utils.downloadFileByPost(url, {
    //   refIds
    // });
  }

  preview() { }

  upFile(file: any) {
    return Promise.resolve();
  }

  getSheetDetail(params: any) {
    return formApi.importData(params);
  }

  exportSheet(params: any) {
    const name = params.name + utils.DateHandle.dateFormat(new Date(),'YYYYMMDDHHmmss');
    // debugger
    formApi.exportData(params).then((res: any) => {
      if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {

      } else {
        
        // const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
        // const fileName = `${params.subSchemaCode}.xlsx`;
        // this.downloadFile(blob, fileName);
        if (res.errcode === 0) {
          this.exportErrorResult(res.data, name);
        }
      }
      
    })
  }
  
  /**
   * 文件下载方法
   */
  downloadFile(blob: any, fileName: string) {
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, fileName);
    } else {
      const a = document.createElement('a');
      const url = URL.createObjectURL(blob);
      a.download = fileName;
      a.href = url;
      a.click();
      URL.revokeObjectURL(url);
    }
  }

  async exportErrorResult(file:string,name:string) {
    const res = await listApi.exportErrorResult(file);
    if ((res.errcode && res.errcode !== 0) || res.byteLength < 100) {
      // this.$message.error(this.$t('cloudpivot.list.pc.DownloadFailed'));
    } else {
      const blob = new Blob([res], { type: 'application/vnd.ms-excel' });
      const stamp = new Date().getMilliseconds();
      let fileName = '';
      if(name) {
        fileName = `${name}.xlsx`;
      } else {
        fileName = `错误信息${stamp}.xlsx`;
      }
       
      this.downloadFile(blob, fileName);
    }
  }
}
