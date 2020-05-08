import Axios from 'axios';

export default {
  uploadFile(params: AppSettings.uploadParam): Promise<Common.Data> {
    const formData: FormData = new FormData();
    Object.entries(params).forEach(([k,v]) => {
      formData.append(k,v);
    })
    return Axios.post('/api/aliyun/upload', formData, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  },
  updatePackage(params: Apps.AppCenter.AppInfo): Promise<AppSettings.uploadResponse>{
    return Axios.put('/api/app/apppackage/update', params);
  }
}