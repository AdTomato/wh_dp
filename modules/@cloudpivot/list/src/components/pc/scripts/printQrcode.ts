import { listApi, listParams } from '@cloudpivot/api';
import printQrCodeHelper from '../helper/print-qrcode';
export default {
  /*
  * 构建打印二维码数据格式
  */
  async createPrintQrCodeData(vm:any, data: any) {
    const customDisplayColumns = data.textData.filter((d: any) => d.isDataItem === 1).map((c: any) => {
      return c.code;
    });

    // 选择当前勾选的数据生成二维码
    let objectIds: any = [];
    const allObjectIds: any = [];
    vm.checkeds.forEach((c: boolean, index: number) => {
      if (c) {
        objectIds.push(vm.dataSource[index].id);
      }
      allObjectIds.push(vm.dataSource[index].id);
    });
    // 如果当前未勾选任何数据，默认全部生成
    if (objectIds.length === 0) {
      objectIds = allObjectIds;
    }


    let config: any = {};
    if (vm.$store && vm.$store.state) {
      config = vm.$store.state.config;
    }

    const { schemaCode } = vm.$route.params;
    const params = {
      filters: vm.filterData,
      mobile: false,
      page: vm.curPage - 1,
      queryCode: '',
      schemaCode,
      size: vm.pageSize,
      options: {
        customDisplayColumns,
        queryDisplayType: listParams.QueryDisplayType.Append
      }
    };
    const res = await listApi.getQueryList(params);
    let dataArr = [];
    if (res.errcode === 0 && res.data) {
      if (!Array.isArray(res.data.content)) {
        return;
      }
      dataArr = res.data.content.filter((d: any) => objectIds.includes(d.id)).map((item: any) => {
        let str = '';
        data.textData.forEach((d: any) => {
          if (d.isDataItem === 0) {
            str += d.code;
          } else {
            let value = item.data[d.code] ? item.data[d.code] : '';
            // 如果value为对象则取name字段
            if (typeof value === 'object') {
              value = value.name ? value.name : '';
            } else if (d.code === 'sequenceStatus') {
              switch (value) {
                case 'DRAFT':
                  value = '草稿';
                  break;
                case 'PROCESSING':
                  value = '进行中';
                  break;
                case 'COMPLETED':
                  value = '已完成';
                  break;
                case 'CANCELED':
                  value = '已作废';
                  break;
                default:
                  value = '';
                  break;
              }
            }
            str += value;
          }
        });
        return {
          text: str,
          url: '',
        };
      });

      // 整合生成短码参数
      const genShortCodesParams:any = [];
      res.data.content.filter((d: any) => objectIds.includes(d.id)).forEach((item:any) => {
        const json:any = {
            sheetCode: vm.sheetCode,
            schemaCode,
            id: item.id
          }
        genShortCodesParams.push({
          pairValue: JSON.stringify(json)
        });
      });

      // 调用接口批量生成短码
      const genShortCodesRes:any = await listApi.genShortCodes(genShortCodesParams);
      if (genShortCodesRes.errcode === 0 && genShortCodesRes.data) {
        const { data: otherData } = genShortCodesRes;
        dataArr.forEach((item:any, index:number) => {
          const text:string = `${config.mobileServerUrl}/?sCode=${otherData[index].pairCode}&corpId=${config.corpId}&agentId=${config.agentId}`;
          const url:string = `${config.apiHost}/api/qrcode/generate_qrcode?text=${encodeURIComponent(text)}`;
          item.url = url;
        })
      }
    }

    const result = {
      width: data.width,
      height: data.height,
      fontSize: data.fontSize,
      qrCodes: dataArr,
    };
    this.printQrCode(vm, result);
  },

  printQrCode(vm:any, result: any) {
    vm.opts = result;
    const size: any = { width: result.width, height:result.height };
    const closeLoading = vm.$message.loading(vm.$t('cloudpivot.list.pc.loading').toString()) as any;

    // isEdage  针对兼容Edage浏览器  Edge浏览器不识别onload 故不会执行调起
    const isEdage:boolean = window.navigator.userAgent.indexOf('Edge') !== -1;
    if (isEdage) {
      const iframe:any = document.getElementById('pdfFrame');
      vm.$nextTick(() => {
        vm.srcdoc = printQrCodeHelper.generateHtml('qrcodeBox', size);
        iframe.contentWindow.document.body.innerHTML = vm.srcdoc;
        iframe.contentWindow.print();
      });
    } else {
      // isTrident： 针对IE11兼容打印预览
      const isTrident:boolean = window.navigator.userAgent.indexOf('Trident') !== -1;
      setTimeout(async () => {
        // vm.pdfUrl = '/print/a.html';
        // vm.isShowPdf = true;
        vm.$nextTick(() => {
          vm.srcdoc = printQrCodeHelper.generateHtml('qrcodeBox', size);
          const iframe:any = document.getElementById('pdfFrame');
          iframe.onload = () => {
            if (!vm.srcdoc) return;
            if (isTrident) {
              iframe.contentWindow.document.execCommand('print',false,null);
              // iframe.contentWindow.document.body.innerHTML = vm.srcdoc;
              // const webBrowser:any = document.createElement('object');
              // webBrowser.classid = 'CLSID:8856F961-340A-11D0-A96B-00C04FD705A2';
              // webBrowser.width = 0;
              // webBrowser.height = 0;
              // iframe.contentWindow.document.body.appendChild(webBrowser);
              // webBrowser.ExecWB(7,1);
            } else {
              iframe.contentWindow.print();
            }
            setTimeout(() => {
              vm.srcdoc = '';
            }, 300);
          }
          if (isTrident) {
            iframe.onload();
          }
        });
        // vm.pdfUrl = `/pdfjs/web/viewer.html`;
        // // 1. 获取html
        // const htmlContent: string = printQrCodeHelper.generateHtml('qrcodeBox', size);
        // // 2. 存入服务器
        // const saveToServerRes: any = await formApi.toHtml({ htmlName: '批量打印二维码.html', htmlContent });
        // if (saveToServerRes.errcode !== 0) return;
        // // 3. 转成pdf
        // const makePDFres: any = await formApi.makePDF({ htmlName: saveToServerRes.data.html });
        // if (makePDFres.errcode !== 0) return;
        // vm.isShowPdf = true;
        // const pdfUrl: string = `${env.apiHost}/api/runtime/convert/download?fileName=${makePDFres.data.pdf}`;
        // vm.pdfUrl += `?file=${encodeURIComponent(pdfUrl)}`;
        closeLoading();

        // WONDER:TODO: 貌似没有失败的可能?
        if ( vm.eventHooksHandler ) {
          vm.eventHooksHandler.exec('onActionDone', vm.getAction('qr_code'), true);
        }
      }, 1800);
    }
  }
}