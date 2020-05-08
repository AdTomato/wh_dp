import  pca  from './pca';

export const setAddressVal = (adcode:string) => {
  const value:any[] = [];
  pca.forEach((p:any) => {
    // 找到对应是省
    if (p.adcode === adcode) {
      value.push(initVal(p));
      return;
    }


    if (p.districts.length > 0) {
      p.districts.forEach((c:any) => {
        // 匹配到省
        if (c.adcode === adcode) {
          value.push(initVal(p));
          value.push(initVal(c));
          return;
        }
        
        if (c.districts.length > 0) {
          c.districts.forEach((a:any) => {
            // 匹配到市
            if (a.adcode === adcode) {
              value.push(initVal(p));
              value.push(initVal(c));
              value.push(initVal(a));
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
  
  value.forEach((pca:any) => {

    if (pca.level === 'province') {
      pcaDate.provinceName = pca.name;
      pcaDate.provinceAdcode = pca.adcode;
    }

    if (pca.level === 'city') {
      pcaDate.cityName = pca.name;
      pcaDate.cityAdcode = pca.adcode;
    }


    if (pca.level ===  "district") {
      pcaDate.districtName = pca.name;
      pcaDate.districtAdcode = pca.adcode;

    }


  });
  return pcaDate;
}

export const initVal = (pcaItem:any) => {
    const { adcode, center, level, name } = pcaItem;
    return {
      adcode,
      center,
      level,
      name
    }
  }