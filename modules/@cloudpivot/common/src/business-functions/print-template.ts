import moment from 'moment';

/**
 * @params data 是要处理的数据
 * @params obj组件实例或者iconTypes
 * @params str 是替换真实和伪造的数据的标志符
 */

export function replaceValueData(env: any, data: any[], str: string, obj?: any) {

  const pages: any[][] = JSON.parse(JSON.stringify(data));
  // @ts-ignore
  if (str.includes('real')) {
    const realData = obj.formObj.bizObject.data;
    const dataType = obj.formObj.bizSchema.properties;
    if (!Object.keys(realData).length || !Object.keys(dataType).length) return;
    console.log('拿到了真实数据', realData);

    for (const tempData of pages) {
      tempData.forEach((item: any, index: number) => {

        if (item.eleType === 'sheet') {

          const list = realData[item.id];
          if (list) {

            item.value = list.map((x: any) => x);

          }

          return;
        }

        // @ts-ignore
        if (item.eleType.includes('column')) {
          // @ts-ignore
          if (item.leftKey.borderColorValue === '#ccc') item.leftKey.borderColorValue = 'transparent';
          // @ts-ignore
          if (item.rightValue.borderColorValue === '#ccc') item.rightValue.borderColorValue = 'transparent';
          // @ts-ignore
          if (item.leftKey.code) {
            // @ts-ignore
            const leftCode: string = item.leftKey.code.split('#_#')[0];
            let itemType: any;
            // @ts-ignore
            if (!Object.keys(realData).includes(leftCode) || !realData[leftCode]) { item.leftKey.innerTxt = ''; return; }
            dataType.forEach((type: object, i: number) => {
              // @ts-ignore
              if (type.code === leftCode) itemType = type.propertyType;
            });
            realReplace(leftCode, itemType, realData, item, 'leftKey', 'column', obj.formObj, obj);
          }
          // @ts-ignore
          if (item.rightValue.code) {
            // @ts-ignore
            const rightCode: string = item.rightValue.code.split('#_#')[0];
            let itemType: any;
            // @ts-ignore
            if (!Object.keys(realData).includes(rightCode) || !realData[rightCode]) { 
              item.rightValue.innerTxt = realData[rightCode] === false ? '否' : '';
              return; 
            }
            dataType.forEach((type: object, i: number) => {
              // @ts-ignore
              if (type.code === rightCode) itemType = type.propertyType;
            });
            realReplace(rightCode, itemType, realData, item, 'rightValue', 'column', obj.formObj, obj);
          }
        }
        // @ts-ignore
        if (item.eleType.includes('text')) {
          // @ts-ignore
          if (item.borderColorValue === '#ccc') item.borderColorValue = 'transparent';
          // @ts-ignore
          if (item.code) {
            // @ts-ignore
            const itemCode: string = item.code.split('#_#')[0];
            let itemType: any;
            // @ts-ignore
            if (!Object.keys(realData).includes(itemCode) || !realData[itemCode]) { 
              item.innerTxt = realData[itemCode] === false ? '否' : '';
              return; 
            }
            dataType.forEach((type: object, i: number) => {
              // @ts-ignore
              if (type.code === itemCode) itemType = type.propertyType;
            });
            realReplace(itemCode, itemType, realData, item, 'text', 'text', obj.formObj, obj);
          }
        }
        // @ts-ignore
        if (item.eleType.includes('leftQrcodePic')) {
          // @ts-ignore
          item.picUrl = calcQrCodeUrl(env, obj, item.qrCreateOrShow) || '';
        }
        // @ts-ignore
        if (item.eleType.includes('leftBarcodePic')) {

          if (item.barCodeKey === 'formColumn') {
            // @ts-ignore
            item.barCodeValue = realData[item.barCodeValue] || '';
          }

          // @ts-ignore
          item.picUrl = `${env.apiHost}/api/qrcode/generate_barcode?text=${item.barCodeValue}&width=${item.widthValue}&height=${item.heightValue}`;
        }
      })
    }
  }
  // @ts-ignore
  if (str.includes('fake')) {

    for (const tempData of pages) {
      tempData.forEach((item: any, index: number) => {
        // @ts-ignore
        if (item.eleType.includes('leftBarcodePic')) {
          // @ts-ignore
          item.picUrl = `${env.apiHost}/api/qrcode/generate_barcode?text=${item.barCodeValue}&width=${item.widthValue}&height=${item.heightValue}`;
        }
        // @ts-ignore
        if (item.eleType.includes('leftQrcodePic')) {
          // @ts-ignore
          item.picUrl = `${env.apiHost}/api/qrcode/generate_qrcode?text=https://www.baidu.com/`;
        }
        if (obj) {
          obj.forEach((fakeItem: object, fakeIndex: number) => {
            // @ts-ignore
            if (item.eleType.includes('column')) {
              // @ts-ignore
              if (item.leftKey.borderColorValue === '#ccc') item.leftKey.borderColorValue = 'transparent';
              // @ts-ignore
              if (item.rightValue.borderColorValue === '#ccc') item.rightValue.borderColorValue = 'transparent';
              // @ts-ignore
              item.leftKey.active = false;
              // @ts-ignore
              item.rightValue.active = false;
              // @ts-ignore
              if (item.leftKey.code && item.leftKey.code.split('#_#')[1] - 0 === fakeItem.propertyType) {
                // @ts-ignore
                item.leftKey.innerTxt = fakeItem.value;
              }
              // @ts-ignore
              if (item.rightValue.code && item.rightValue.code.split('#_#')[1] - 0 === fakeItem.propertyType) {
                // @ts-ignore
                item.rightValue.innerTxt = fakeItem.value;
              }
            }
            // @ts-ignore
            if (item.eleType.includes('text')) {
              // @ts-ignore
              if (item.borderColorValue === '#ccc') item.borderColorValue = 'transparent';
              // @ts-ignore
              if (item.code && item.code.split('#_#')[1] - 0 === fakeItem.propertyType) {
                // @ts-ignore
                item.innerTxt = fakeItem.value;
              }
            }
          });
        }
        if (item.leftKey && item.leftKey.active) {
          item.leftKey.active = true;
        }
        if (item.rightValue && item.rightValue.active) {
          item.rightValue.active = true;
        }
        // @ts-ignore
        if (item.active) {
          // @ts-ignore
          item.active = false;
        }
      })
    }
  }
  return pages;
}

function realReplace(code: string, itemType: number, codeObj: any, itemOne: any, str: string, kind: string, forDataProperty: any, formDeatil: any) {

  const imgReg = /.[png|jpg|jpeg]/i;
  if (kind.includes('column')) {
    if (itemType === 2) {
      dateAndNumberFilter(code, forDataProperty, itemOne, str, 'number', codeObj, 'column');
    }
    if (itemType === 3) {
      dateAndNumberFilter(code, forDataProperty, itemOne, str, 'date', codeObj, 'column');
    }
    if (itemType === 4) {
      // @ts-ignore
      itemOne[str].innerTxt = codeObj[code] ? '是' : '否';
    }
    if (itemType === 10) {
      // @ts-ignore
      itemOne[str].innerTxt = `${codeObj[code].provinceName || ''}${codeObj[code].cityName || ''}${codeObj[code].districtName || ''}${codeObj[code].address || ''}`;
      return;
    }
    // @ts-ignore
    if (itemType === 5 && codeObj[code].length) {
      let tempTxt: string[] = [];
      // @ts-ignore
      codeObj[code].forEach((staff: object, i: number) => {
        // @ts-ignore
        tempTxt.push(staff.name);
      });
      // @ts-ignore
      itemOne[str].innerTxt = tempTxt.join('，');
      return;
    }
    // @ts-ignore
    if (typeof codeObj[code] === 'string') {
      // @ts-ignore
      itemOne[str].innerTxt = codeObj[code];
      return;
    }
    // @ts-ignore
    if (typeof codeObj[code] === 'object') {
      // @ts-ignore
      if (codeObj[code].length && codeObj[code][0].name) {
        const attaches = codeObj[code];
        if (attaches.length > 0 && imgReg.test(attaches[0].name)) {
          if (attaches[0].response && attaches[0].response.data) {
            itemOne.picUrl = formDeatil.getDownloadUrl(attaches[0].response.data);
          } else if (attaches[0].refId) {
            itemOne.picUrl = formDeatil.getDownloadUrl(attaches[0]);
          }
        } else {
          // @ts-ignore
          itemOne[str].innerTxt = codeObj[code][0].name;
        }
        return;
        // @ts-ignore
      } else if (itemType === 0 && codeObj[code].length) {
        // @ts-ignore
        itemOne[str].innerTxt = codeObj[code].join(',');
        return;
      } else if (itemType === 9) {
        // @ts-ignore
        itemOne[str].innerTxt = codeObj[code].name || '';
        return;
      } else if (itemType === 6) {
        let tempTxt: string[] = [];
        // @ts-ignore
        codeObj[code].forEach((attach: object, i: number) => {
          // @ts-ignore
          tempTxt.push(attach.name);
        });
        // @ts-ignore
        itemOne[str].innerTxt = tempTxt.join('，');
        return;
      }
    }
  }
  if (kind.includes('text')) {
    if (itemType === 2) {
      dateAndNumberFilter(code, forDataProperty, itemOne, str, 'number', codeObj, 'text');
    }
    if (itemType === 3) {
      dateAndNumberFilter(code, forDataProperty, itemOne, str, 'date', codeObj, 'text');
    }
    if (itemType === 4) {
      // @ts-ignore
      itemOne.innerTxt = codeObj[code] ? '是' : '否';
    }
    if (itemType === 10) {
      // @ts-ignore
      itemOne.innerTxt = `${codeObj[code].provinceName || ''}${codeObj[code].cityName || ''}${codeObj[code].districtName || ''}${codeObj[code].address || ''}`;
      return;
    }
    // @ts-ignore
    if (itemType === 5 && codeObj[code].length) {
      let tempTxt: string[] = [];
      // @ts-ignore
      codeObj[code].forEach((staff: object, i: number) => {
        // @ts-ignore
        tempTxt.push(staff.name);
      });
      // @ts-ignore
      itemOne.innerTxt = tempTxt.join('，');
      return;
    }
    // @ts-ignore
    if (typeof codeObj[code] !== 'object') {
      // @ts-ignore
      itemOne.innerTxt = codeObj[code];
      return;
    }
    // @ts-ignore
    if (typeof codeObj[code] === 'object') {
      // @ts-ignore
      if (codeObj[code].length && codeObj[code][0].name) {
        const attaches = codeObj[code];
        if (attaches.length > 0 && imgReg.test(attaches[0].name)) {
          if (attaches[0].response && attaches[0].response.data) {
            itemOne.picUrl = formDeatil.getDownloadUrl(attaches[0].response.data);
          } else if (attaches[0].refId) {
            itemOne.picUrl = formDeatil.getDownloadUrl(attaches[0]);
          }
        } else {
          // @ts-ignore
          itemOne.innerTxt = codeObj[code][0].name;
        }
        return;
        // @ts-ignore
      } else if (itemType === 0 && codeObj[code].length) {
        // @ts-ignore
        itemOne.innerTxt = codeObj[code].join(',');
        return;
      } else if (itemType === 9) {
        // @ts-ignore
        itemOne.innerTxt = codeObj[code].name || '';
        return;
      } else if (itemType === 6) {
        let tempTxt: string[] = [];
        // @ts-ignore
        codeObj[code].forEach((attach: object, i: number) => {
          // @ts-ignore
          tempTxt.push(attach.name);
        });
        // @ts-ignore
        itemOne.innerTxt = tempTxt.join('，');
        return;
      }
    }
  }
}

/*
* 计算二维码的url，新增、查看
 */

function calcQrCodeUrl(env: any, _this: any, showOrCreate: string): any {
  const { workflowInstanceId, workItemId, workflowCode } = _this.formObj;
  const { id, schemaCode, sheetCode } = _this.formObj.bizObject;
  const { config } = _this.$store.state;
  const { corpId, agentId } = config;
  let qrText = '';
  // @ts-ignore
  if (!showOrCreate.includes('create')) {
    if (workflowInstanceId && workItemId) { // 查看
      qrText = `${config.mobileServerUrl}/?workflowInstanceId=${workflowInstanceId}&workItemId=${workItemId}&corpId=${corpId}&agentId=${agentId}&mode=form`;
    } else {
      qrText = `${config.mobileServerUrl}/?corpId=${corpId}&agentId=${agentId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&id=${id}&mode=form`;
    }
  } else { // 新增
    if (workflowCode) {
      qrText = `${config.mobileServerUrl}/?workflowCode=${workflowCode}&corpId=${corpId}&agentId=${agentId}&mode=create`;
    } else {
      qrText = `${config.mobileServerUrl}/?corpId=${corpId}&agentId=${agentId}&schemaCode=${schemaCode}&sheetCode=${sheetCode}&mode=create`;
    }
  }
  const text = encodeURIComponent(qrText);
  return `${env.apiHost}/api/qrcode/generate_qrcode?text=${text}`;
}

function dateAndNumberFilter(code: string, forDataProperty: object, itemOne: object, str: string, kind: string, codeObj: object, eleType: string) {
  let dataProperties: any;
  // @ts-ignore
  if (forDataProperty.bizSheet.draftAttributesJson) {
    // @ts-ignore
    dataProperties = JSON.parse(forDataProperty.bizSheet.draftAttributesJson);
  }
  // @ts-ignore
  if (!Object.keys(dataProperties).length) {
    // @ts-ignore
    eleType.includes('column') ? itemOne[str].innerTxt = '' : itemOne.innerTxt = '';
    return;
  } else {
    for (let propItem in dataProperties) {
      if (code === propItem) {
        if (kind.includes('date')) {
          // @ts-ignore
          eleType.includes('column')
            // @ts-ignore
            ? itemOne[str].innerTxt = moment(codeObj[code]).format(dataProperties[propItem].options.format)
            // @ts-ignore
            : itemOne.innerTxt = moment(codeObj[code]).format(dataProperties[propItem].options.format);
          return;
        }
        if (kind.includes('number')) realFilter(dataProperties[propItem].options.format, itemOne, str, codeObj, code, eleType);
      }
    }
  }
}

const dataFormatter = [
  { format: 'none', fix: '', precision: 0 }, // 无格式
  { format: 'integer', fix: '', precision: 0 }, // 整数
  { format: 'tenths', fix: '', precision: 1 },
  { format: 'percentile', fix: '', precision: 2 },
  { format: 'Millimeter', fix: '', precision: 3 },
  { format: 'tenThousand', fix: '', precision: 4 },
  { format: 'ratio', fix: '%', precision: 0 },
  { format: 'ratio.tenths', fix: '%', precision: 1 },
  { format: 'ratio.percentile', fix: '%', precision: 2 },
  { format: 'ratio.Millimeter', fix: '%', precision: 3 },
  { format: 'ratio.tenThousand', fix: '%', precision: 4 },
  { format: 'RMB.percentile', fix: '￥', precision: 2 },
  { format: 'RMB.Millimeter', fix: '￥', precision: 3 },
  { format: 'RMB.tenThousand', fix: '￥', precision: 4 },
  { format: 'dollar.percentile', fix: '$', precision: 2 },
  { format: 'dollar.Millimeter', fix: '$', precision: 3 },
  { format: 'dollar.tenThousand', fix: '$', precision: 4 },
  { format: 'euro.percentile', fix: '€', precision: 2 },
  { format: 'euro.Millimeter', fix: '€', precision: 3 },
  { format: 'euro.tenThousand', fix: '€', precision: 4 },
  { format: 'HK.percentile', fix: 'HK$', precision: 2 },
  { format: 'HK.Millimeter', fix: 'HK$', precision: 3 },
  { format: 'HK.tenThousand', fix: 'HK$', precision: 4 }
];

function realFilter(format: string, itemOne: object, str: string, codeObj: object, code: string, eleType: string) {
  let tempTxt: string = '';
  let tempNumber: any;
  let strTxt: string = '';
  dataFormatter.forEach((formatItem: object, index: number) => {
    // @ts-ignore
    if (formatItem.format === format) {
      // @ts-ignore
      tempNumber = codeObj[code];
      strTxt = tempNumber.toString().split('.')[1] === undefined?'':tempNumber.toString().split('.')[1];
      // @ts-ignore
      if (!formatItem.fix) {
        // @ts-ignore
        tempTxt = formatItem.precision ? `${tempNumber}${strTxt === ''?'.':''}${''.padEnd(formatItem.precision - strTxt.length, '0')}` : tempNumber;
      }
      // @ts-ignore
      if (formatItem.fix === '%') {
        // @ts-ignore
        tempTxt = formatItem.precision ? `${tempNumber}${strTxt === ''?'.':''}${''.padEnd(formatItem.precision - strTxt.length, '0')}%` : `${tempNumber}%`;
      } else {
        // @ts-ignore
        tempTxt = formatItem.precision ? `${formatItem.fix}${tempNumber}${strTxt === ''?'.':''}${''.padEnd(formatItem.precision - strTxt.length, '0')}` : `${formatItem.fix}${tempNumber}`;
      }
    }
  });
  // @ts-ignore
  eleType.includes('column') ? itemOne[str].innerTxt = tempTxt : itemOne.innerTxt = tempTxt;
  return;
}

export function getMmFromPx(val: number) {
  return (val / 10 / 2.54) * 72;
}

export function getPxFromMm(val: number) {
  return (val / 72) * 2.54 * 10;
}
