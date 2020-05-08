// 初始化表单组件配置
import "@/config/h3-form";

import { Component, Vue, Prop, Provide } from "vue-property-decorator";

import { Collapse, Icon, Alert } from "h3-antd-vue";

import { schema, renderer, runtime } from "@cloudpivot/form";

import { formApi, workflowApi, workflow, externalLinkApi } from "@cloudpivot/api";

import * as flow from "@cloudpivot/flow";

// import { replaceValueData } from '@cloudpivot/common/src/utils/utils';

import common from "@cloudpivot/common";

const { replaceValueData } = common.utils.BusinessFunctions;

import FormDetailHeader from "./form-detail-header.vue";

import * as Common from "@/typings/common";

import env from "@/config/env";

import site from "@/config/site";
import * as platform from "@cloudpivot/platform";
// import {FormActionButton, FormAction} from "@cloudpivot/form/src/runtime";

@Component({
  name: "pc-form-detail",
  components: {
    AIcon: Icon,
    ACollapse: Collapse,
    ACollapsePanel: Collapse.Panel,
    AAlert: Alert,
    FormDetailHeader,
    WorkflowInfo: flow.components.pc.WorkflowInfo,
    FormActionModal: runtime.components.pc.FormActionModal,
    FormModifyOwnerModal: runtime.components.pc.FormModifyOwnerModal,
    Approval: flow.components.pc.Approval,
    PcFormRenderer: renderer.components.pc.FormRenderer,
    FormActions: runtime.components.pc.FormActions,
    GenerateHtml: () => import("./generateHTML.vue")
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      (vm as PcFormDetail).load();
    });
  },

  beforeRouteUpdate(to, from, next) {
    const vm = this as PcFormDetail;
    vm.clean();
    next();
    vm.load();
  }
})
export default class PcFormDetail extends runtime.components.pc.FormDetail {
  showBacktop = false;

  draftAttributesJson: any[][] = [];
  formdata: any = null;
  isShow: boolean = false; // 是否有打印模板
  pdfAble: boolean = false; // 是否开启打印模板
  showPdf: boolean = false;
  pdfUrl: string = `/pdfjs/web/viewer.html`;
  showAlertWarn = false;
  timer: any = null;
  finishTime: string = "";
  srcdoc: string = "";

  @Provide()
  layoutTypeFn() {
    return this.formObj && this.formObj.bizSheet && this.formObj.bizSheet.layoutType === "vertical";
  }

  get borderMode() {
    return this.formObj && this.formObj.bizSheet && this.formObj.bizSheet.borderMode === "open";
  }

  get completed() {
    return (
      this.formObj &&
      this.formObj.bizObject &&
      this.formObj.bizObject.sequenceStatus === "COMPLETED"
    );
  }

  get canceled() {
    return (
      this.formObj && this.formObj.bizObject && this.formObj.bizObject.sequenceStatus === "CANCELED"
    );
  }

  // mounted() {
  //     // debugger
  //     // this.formObj
  //     const url: any = this.$route.query.return;
  //     const opener = window.opener;
  //     window.onbeforeunload = () => {
  //             opener.postMessage(url, opener.location.href);
  //     };
  // }

  // 页面销毁的时候
  destroyed() {
    clearInterval(this.timer);
  }

  onBodyScroll(evt: Event) {
    const formBody = evt.target as HTMLDivElement;
    this.showBacktop = formBody.scrollTop > 0;
  }

  @Provide()
  getScrollEl() {
    return this.$el.querySelector(".form-body") as HTMLDivElement;
  }

  backTop() {
    const formBody = this.getScrollEl();
    if (formBody) {
      formBody.scrollTop = 0;
    }
  }

  showMessage() {
    const h3Messsag = this.$refs.h3Messsag as any;
    return h3Messsag.show();
  }

  get $message() {
    return Vue.prototype.$message;
  }

  get getFileUrlFn() {
    return renderer.UploadControl.service.getDownloadUrl;
  }

  clean() {
    super.clean();
    this.showBacktop = false;
  }

  get dataItems() {
    if (this.formObj.bizSchema && this.formObj.bizSchema.properties) {
      return this.formObj.bizSchema.properties;
    }

    return [];
  }

  async load(edit?: boolean) {
    const closeLoading = this.$message.loading(null, 0);
    try {
      const res = await super.load(edit);

      this.loadSheetColumnWidth();

      if (this.formObj) {
        let {
          creater: { name }
        } = this.formObj.bizObject;
        window.sessionStorage.setItem("uploadName", name);
        const title = this.formObj.instanceName || this.formObj.bizSheet.name;
        document.title = `${site.title}-${title}`;
      }
    } catch (e) {
      console.log(e);
      if (e.errcode === 601010 || e.errcode === 6000018) {
        this.goPermission();
        return;
      }

      if (e.errcode === 302034 || this.formObj.bizSheet.publishedAttributesJson === null) {
        // this.showAlertWarn = true;
        this.goUnpublished();
        return;
      }
      this.goEmptyPage();
      return;
    } finally {
      closeLoading();
    }
  }

  getSheetStorageKey(sheet: schema.FormSheet) {
    return `${this.formObj.bizSchema.code}-${this.formObj.bizSheet.code}-${sheet.key}`;
  }

  onSheetColumnResize(data: {
    sheet: schema.FormSheet;
    column: schema.FormSheetColumn;
    width: number;
  }) {
    const key = this.getSheetStorageKey(data.sheet);
    let json = localStorage.getItem(key);

    let widthMap: any;
    if (json) {
      try {
        widthMap = JSON.parse(json);
      } catch (error) {}
    }

    if (!widthMap) {
      widthMap = {};
    }

    widthMap[data.column.key] = data.width;

    json = JSON.stringify(widthMap);
    localStorage.setItem(key, json);
  }

  loadSheetColumnWidth() {
    const formControls: schema.RendererFormControl[] = [];
    renderer.components.FormRendererHelper.findFormControl(this.controls, formControls);

    const sheets = formControls.filter(
      c =>
        c.type === schema.FormControlType.Sheet &&
        ((c as any) as schema.FormSheet).columns.length > 0
    );

    for (const s of sheets) {
      const sheet = (s as any) as schema.FormSheet;
      const key = this.getSheetStorageKey(sheet);
      const json = localStorage.getItem(key);
      if (!json) {
        continue;
      }

      try {
        const widthMap = JSON.parse(json);

        if (!widthMap) {
          continue;
        }

        for (const col of sheet.columns) {
          const w = widthMap[col.key];
          if (w) {
            col.width = w;
          }
        }
      } catch {}
    }
  }

  initIframe(url: string) {
    const iframe = super.initIframe(url);
    const w = iframe.contentWindow as any;
    w.env = env;
    w.config = env;
    return iframe;
  }

  onOk(ac: runtime.FormActionButton, data: any) {
    // 删除保存在sessionStorage中的值，防止错误填充审批衣间
    window.sessionStorage.removeItem("$approval");
    super.doAction(ac, data);
  }

  async onAction(ac: runtime.FormActionButton) {
    // if (ac.code === runtime.FormAction.Reject && !this.validateApproval()) {
    //     return;
    // }
    console.log("ac", ac);
    await super.onAction(ac);
  }

  async goto(ac: runtime.FormActionButton, res: Common.Data) {
    // debugger
    this.judgeIfNeedReload(ac);
    // debugger;
    const url = this.$route.query.return as string;
    const params: any = this.$route.query;

    const reload = () => {
      const workitem = res.data.workItem;
      if (workitem) {
        this.goWfForm(workitem.id, workitem.instanceId);
      } else if (params.workitemId && params.workflowInstanceId) {
        this.goWfForm(params.workitemId, params.workflowInstanceId);
      } else {
        this.goBizForm();
      }
    };

    if (this.isDingTalk) {
      if (ac.code === runtime.FormAction.Save) {
        reload();
      } else {
        this.$router.push({
          path: url
        });
      }
      return;
    }

    // // debugger
    // // 非流程表单
    // if (!this.isWorkflowForm) {
    //     if (ac.code === runtime.FormAction.Save) {
    //         this.goBizForm();
    //     } else if (
    //         ac.code === runtime.FormAction.Submit ||
    //         ac.code === runtime.FormAction.Delete
    //     ) {
    //         this.goSuccessPage(res);
    //     }
    //     return;
    // }

    // const gotoNext = async () => {
    //     const fromUnfinished = url && url.indexOf("my-unfinished-workitem") > -1;
    //     if (fromUnfinished) {
    //         const item = await this.getFirstUnfinish();
    //         if (item) {
    //             await this.showMessage();
    //             this.goWfForm(item.id, item.instanceId, true);
    //             return;
    //         }
    //     }

    //     this.goSuccessPage();
    // };

    switch (ac.code) {
      case runtime.FormAction.Save:
      case runtime.FormAction.Assist:
      case runtime.FormAction.Circulate:
      case runtime.FormAction.AdjustParticipant:
        reload();
        break;

      case runtime.FormAction.Retrieve:
        const workflowInstanceId = this.$route.query.workflowInstanceId as string;
        this.goWfForm(res.data.id as string, workflowInstanceId, true);
        // this.retrieveCallBack();
        break;

      default:
        // gotoNext();
        this.goSuccessPage(res);
        break;
    }
  }

  goBizForm() {
    const url = this.$route.query.return as string;
    this.$router.replace({
      name: "form-detail",
      query: {
        schemaCode: this.formObj.bizSchema.code,
        sheetCode: this.formObj.bizSheet.code,
        objectId: this.formObj.bizObject.id,
        return: url
      }
    });
  }

  goWfForm(workitemId: string, workflowInstanceId: string, reload?: boolean) {
    const url = this.$route.query.return as string;
    const params = {
      name: "form-detail",
      query: {
        workitemId,
        workflowInstanceId,
        return: url
      }
    };

    if (reload) {
      const { href } = this.$router.resolve(params);
      window.location.href = href;
    } else {
      this.$router.push(params);
    }
  }

  goEmptyPage() {
    this.$router.push({
      name: "shared-empty"
    });
  }

  goUnpublished() {
    this.$router.push({
      name: "formUnpublished"
    });
  }

  goPermission() {
    this.$router.push({
      name: "permission"
    });
  }

  goSuccessPage(backData?: any) {
    if ((window as any).externalLinkToken && backData) {
      const { formCode, objectId, schemaCode } = backData.data;
      externalLinkApi
        .getShortCode({
          formCode,
          objectId,
          schemaCode
        })
        .then((res: any) => {
          if (res.errcode === 0) {
            this.$router.push({
              name: "shared-success",
              params: { shortCode: res.data.pairCode }
            });
          }
        });
    } else {
      const msg = this.$t("languages.form.operateDone").toString();
      this.$message.success(msg, 2, () => window.close());
      // this.$router.push({
      //     name: "shared-success"
      // });
    }
  }

  flowTrack() {
    if (!this.formObj || !this.formObj.workItemId) {
      return;
    }

    this.$router.push({
      name: "flowTrack",
      params: {
        workItemId: this.formObj.workItemId,
        workflowInstanceId: this.workflowInstanceId
      },
      query: {
        return: this.$route.query.return
      }
    });
  }

  setFinishTime(time: any) {
    if (time) {
      this.finishTime = time;
    }
  }

  async getFirstUnfinish() {
    const res = await workflowApi.searchWorkitems({
      wd: "",
      page: 0,
      size: 1
    });

    if (res.errcode === 0 && res.data.totalElements > 0) {
      return res.data.content[0];
    }

    return null;
  }

  onDownload(file: any) {
    if (!file || !file.refId) {
      return;
    }

    const url = renderer.UploadControl.service.getDownloadUrl(file);
    window.open(url);
  }

  print(ac: runtime.FormActionButton) {
    if (!this.formObj.bizSheet.pdfAble) {
      this.pdfAble = false;
    } else {
      this.pdfAble = this.formObj.bizSheet.pdfAble.includes("true");
    }
    // @ts-ignore
    if (!this.formObj.bizSheet.printTemplateJson || !this.pdfAble) {
      // 默认打印
      this.doPrint(ac);
    } else {
      // 已设置打印模板
      this.isShow = !this.isShow;
    }
  }

  doPrint(ac: runtime.FormActionButton) {
    if (platform.IS_DINGTALK) {
      this.$confirm({
        title: this.$t("languages.form.printConfirmTitle").toString(),
        content: this.$t("languages.form.printConfirmContent").toString(),
        okText: this.$t("languages.form.go").toString(),
        onOk() {
          let url = location.href + "&access_token=" + localStorage.getItem("token");
          // window.open(url);
          platform.service.openLink(url);
        }
      });
    } else {
      super.print(ac);
    }
  }

  // 系统管理员可修改表单拥有者
  onModifyOwnerClick() {
    (this.$refs.modifyOwmerModal as any).init(this.formObj);
  }

  async getChildPrintClick(str: string) {
    this.isShow = false;
    // @ts-ignore
    const ac = this.actions.find(a => a.code === runtime.FormAction.Print);
    if (str.includes("系统默认模板")) {
      if (ac) {
        this.doPrint(ac);
      }
    } else if (str.includes("打印模板")) {
      const closeLoading = (this.$message as any).loading("", 0);
      this.showPdf = false;
      this.pdfUrl = `/pdfjs/web/viewer.html`;
      this.formdata = this.formObj;
      // @ts-ignore
      const sheetCode: string = JSON.parse(this.formObj.bizSheet.printTemplateJson)[0].sheetCode;
      // @ts-ignore
      const schemaCode: string = this.formObj.bizSheet.schemaCode;
      const { data, errcode, errmsg } = await formApi.getPrintAttributesJson({
        sheetCode,
        schemaCode
      });
      if (errcode !== 0) {
        this.$message.error(errmsg);
        return;
      }
      if (!data.draftAttributesJson || !JSON.parse(data.draftAttributesJson).length) {
        this.$message.warning("打印模板内容为空！");
        return;
      }
      // @ts-ignore
      this.draftAttributesJson = replaceValueData(
        env,
        JSON.parse(data.draftAttributesJson) || [],
        "real",
        this
      );
      for (const page of this.draftAttributesJson) {
        page
          .filter((x: any) => x.eleType === "sheet")
          .forEach((y: any) => {
            const value = this.formObj.bizObject.data[y.code];
            if (!value || value.length === 0) {
              return;
            }

            const valueCopy = JSON.parse(JSON.stringify(value));

            const controls = this.formRenderer.findFormControls([y.code]);
            if (controls && controls.length > 0) {
              const control = (controls[0] as any) as schema.FormSheet;
              if (control) {
                const map: any = {};
                control.columns.map(c => (map[c.key] = c));

                for (const row of valueCopy) {
                  for (const key in row) {
                    if (map[key]) {
                      row[key] = renderer.FormControlValueService.format(map[key], row[key]);

                      // 修改当表为‘逻辑’时 对应的值显示
                      if (map[key].key.includes("Logic")) {
                        row[key] = row[key] === "true" ? "是" : "否";
                      }
                    } else {
                      const val = row[key];
                      if (Array.isArray(val)) {
                        row[key] = val
                          .map((v: any) => v.name)
                          .filter(f => !!f)
                          .join(";");
                      } else if (typeof val === "object" && val) {
                        if (val.name) {
                          row[key] = val.name;
                        } else if (val.provinceName && val.cityName) {
                          row[
                            key
                          ] = `${val.provinceName} ${val.cityName} ${val.districtName} ${val.address}`;
                        } else if (val.address) {
                          row[key] = val.address;
                        } else {
                          row[key] = "";
                        }
                      }
                    }
                  }
                }
              }
            }

            y.value = valueCopy;
          });
      }
      setTimeout(async () => {
        // 延迟等待数据渲染成功，拿到html文件
        await this.waitPrintRender(closeLoading);
      }, 1800);
    }
  }

  getDownloadUrl(file: renderer.H3File) {
    return renderer.UploadControl.service.getDownloadUrl(file);
  }

  async waitPrintRender(closeLoadingFn: () => {}) {
    const printRenderer = this.$refs.printRenderer as any;
    if (printRenderer) {
      // isEdage  针对兼容Edage浏览器  Edge浏览器不识别onload 故不会执行调起
      const isEdage: boolean = window.navigator.userAgent.indexOf("Edge") !== -1;
      if (isEdage) {
        const iframe: any = document.getElementById("pdfFrame");
        this.$nextTick(() => {
          this.srcdoc = printRenderer.getHtml();
          iframe.contentWindow.document.body.innerHTML = this.srcdoc;
          iframe.contentWindow.print();
        });
        closeLoadingFn();
      } else {
        const isTrident: boolean = window.navigator.userAgent.indexOf("Trident") !== -1;
        setTimeout(async () => {
          this.$nextTick(() => {
            this.srcdoc = printRenderer.getHtml();
            const iframe: any = document.getElementById("pdfFrame");
            iframe.onload = () => {
              closeLoadingFn();
              setTimeout(() => {
                if (!this.srcdoc) return;
                if (isTrident) {
                  iframe.contentWindow.document.execCommand("print", false, null);
                } else {
                  iframe.contentWindow.print();
                }
                this.srcdoc = "";
              }, 300);
            };
            if (isTrident) {
              iframe.onload();
            }
          });
        }, 1800);
      }
    } else {
      setTimeout(() => {
        this.waitPrintRender(closeLoadingFn);
      }, 500);
    }
  }

  /**
   * 根据操作按钮类型，判断是否需要发出列表重载信号
   * @param ac 操作按钮对象
   */
  judgeIfNeedReload(ac: runtime.FormActionButton) {
    let ifNeedReload: boolean = false;
    switch (ac.code) {
      case runtime.FormAction.Submit:
      case runtime.FormAction.Save:
      case runtime.FormAction.Delete:
        ifNeedReload = true;
        break;

      default:
        break;
    }
    if (!ifNeedReload) {
      return;
    }
    // 定义页签关闭前发出重载信号
    const url: any = this.$route.query.return;
    const opener = window.opener;
    window.onbeforeunload = () => {
      opener.postMessage(url, opener.location.href);
    };
  }
}
