import  pca from '../components/shared/pca-selector/typings/pca';
export abstract class FromAddressValueService {
  static setAddressVal(adcode:string,format?:string) {
    const value:any[] = [];
      if (!format) {
        format = 'pp-cc-aa';
      }
      const type:number = format.split('-').length;
    pca.forEach((p:any) => {
      
      // 找到对应是省
      if (p.adcode === adcode) {
        value.push(FromAddressValueService.initVal(p));
        return;
      }
  
   
      if (p.districts.length > 0) {
        p.districts.forEach((c:any) => {
          // 匹配到省
          if (c.adcode === adcode) {
            value.push(FromAddressValueService.initVal(p));
            value.push(FromAddressValueService.initVal(c));
            return;
          }
          
          if (c.districts.length > 0) {
            c.districts.forEach((a:any) => {
              // 匹配到市
              if (a.adcode === adcode) {
                value.push(FromAddressValueService.initVal(p));
                value.push(FromAddressValueService.initVal(c));
                value.push(FromAddressValueService.initVal(a));
                return;
              }
            })
          }
        })
      } 
    });
  
  
    const pcaDate = {
      provinceName: '',
      provinceAdcode: '',
      cityName: '',
      cityAdcode: '',
      districtName: '',
      districtAdcode: ''
    };
    
    value.forEach((pcaItem:any) => {
  
      if (pcaItem.level === 'province') {
        pcaDate.provinceName = pcaItem.name;
        pcaDate.provinceAdcode = pcaItem.adcode;
      }
  
      if (pcaItem.level === 'city'&& type>=2) {
        pcaDate.cityName = pcaItem.name;
        pcaDate.cityAdcode = pcaItem.adcode;
      }
  
  
      if (pcaItem.level ===  "district"&&type>=3) {
        pcaDate.districtName = pcaItem.name;
        pcaDate.districtAdcode = pcaItem.adcode;
  
      }
  
  
    });
    return pcaDate;
  };

  static initVal(pcaItem:any) {
    const { adcode, center, level, name } = pcaItem;
    return {
      adcode,
      center,
      level,
      name
    }
  }
}
