
<template>
  <div class="form-detail">
    <a-progress
      :percent="percent"
      :isAuto="true"
      :loadding="loadding"
    />
    <div class="form-body">
      <transition>
        <toptip v-show="comment">{{ comment }}</toptip>
      </transition>

      <transition>
        <toptip v-show="error" class="error">{{ error }}</toptip>
      </transition>

      <mobile-form-renderer
        ref="formRenderer"
        class="form border-top"
        :controls="controls"
        :formControls="formControls"
        @scrollTop="onScrollTop"
        @scrollLock="onScrollLock"
        :dataItems="dataItems"
      >
        <workflow-info
          v-if="workflowInstanceId"
          :id="workflowInstanceId"
          :itemId="formObj.workItemId"
          :user="creater"
          @flowTrack="flowTrack"
        ></workflow-info>
      </mobile-form-renderer>
    </div>

    <form-actions
      class="form-foot border-top"
      :actions="mobileActions"
      v-show="mobileActions.length > 0"
      @action="onAction"
    ></form-actions>

    <form-action-modal ref="actionModal" @ok="onOk"></form-action-modal>
  </div>
</template>

<script lang="ts">
import {
  Component,
  Vue,
  Prop,
  Watch,
  Inject,
  Provide
} from "vue-property-decorator";

import { H3Button } from "h3-mobile-vue";

import Progress from './progress.vue';

import { schema, renderer, runtime } from "@cloudpivot/form";

import * as flow from "@cloudpivot/flow";

import { externalLinkApi, workflowApi } from "@cloudpivot/api";

import common from "@cloudpivot/common";

import * as platform from "@cloudpivot/platform";

import env from "@/config/env";

import "@/config/amap";

Component.registerHooks([
  "beforeRouteEnter",
  "beforeRouteLeave",
  "beforeRouteUpdate"
]);

@Component({
  name: "mobile-form-detail",
  components: {
    Toptip: common.components.mobile.Toptip,
    WorkflowInfo: flow.components.mobile.WorkflowInfo,
    FormActions: runtime.components.mobile.FormActions,
    MobileFormRenderer: renderer.components.mobile.FormRenderer,
    FormActionModal: runtime.components.mobile.FormActionModal,
    AProgress: Progress
  },

  beforeRouteEnter(to, from, next) {
    next(vm => {
      (vm as MobileFormDetail).load();
    });
  },

  beforeRouteUpdate(to, from, next) {
    const vm = this as MobileFormDetail;
    // vm.clean();
    next();
    vm.load();
  }
})
export default class MobileFormDetail extends runtime.components.mobile
  .FormDetail {
  creater: any = {};

  timer: any = null;
  loadding: boolean = false;
  // todo: 待优化代码，需要监听axios的事件
  // percent:number = 0;
  // timers = 0;
  
  mounted() {
    // this.timers = setInterval(() => {
    //   this.percent = this.percent + 5;
    //   if (this.percent >= 100) {
    //     clearTimeout(this.timers)
    //   }
    // }, 300)

  }

  // 页面销毁的时候
  destroyed() {
    clearInterval(this.timer);
  }

  get $message() {
    return {
      error: (msg: string) => {
        this.showError(msg);
      },
      success: (msg: string) => {
        this.showSuccess(msg);
      },
      loading: (msg?: string) => {
        this.showLoading(msg || "");
        return this.hideToast;
      }
    } as any;
  }

  get $confirm() {
    return ((opts: {
      title: string;
      content: string;
      onOk?: () => void;
      onCancel?: () => void;
    }) => {
      this.$h3.modal.show({
        type: "alert",
        title: opts.title,
        content: opts.content,
        actions: [
          {
            text: this.$t("cloudpivot.form.renderer.cancel").toString(),
            onPress() {
              if (opts.onCancel) {
                opts.onCancel();
              }
            }
          },
          {
            text: this.$t("cloudpivot.form.renderer.ok").toString(),
            onPress() {
              if (opts.onOk) {
                opts.onOk();
              }
            }
          }
        ]
      });
    }) as any;
  }

  get mobileActions() {
    return this.actions.filter(
      ac => ac.visible !== false && ac.code !== runtime.FormAction.Print
    );
  }

  get dataItems() {
    if (this.formObj.bizSchema && this.formObj.bizSchema.properties) {
        return this.formObj.bizSchema.properties;
    }

    return [];
  }

  @Provide()
  getScrollEl() {
    return this.$el;
  }

  @Provide()
    layoutTypeFn() {
      return (
        this.formObj &&
        this.formObj.bizSheet &&
        this.formObj.bizSheet.layoutType === "vertical"
      );
  }

  showLoading(text: string) {
    this.$h3.toast.show({
      text,
      autoHide: false,
      iconType: "loading"
    });
  }

  showError(text: string) {
    this.$h3.toast.show({
      text,
      autoHide: true,
      iconType: text.length < 8 ? "close" : ""
    });
  }

  showSuccess(text: string) {
    this.$h3.toast.show({
      text,
      autoHide: true,
      iconType: "check",
      duration: 1000
    });
  }

  hideToast() {
    this.$h3.toast.hide();
  }

  @Watch("mobileActions")
  onMobileActionsChange(actions: runtime.FormActionButton[]) {
    if (this.$el) {
      const formBody = this.getFormBody();
      if (formBody) {
        const height = actions.length > 0 ? "calc(100% - 44px)" : "100%";
        formBody.style.height = height;
      }
    }
  }

  getFormBody() {
    return this.$el.querySelector(".form-body") as HTMLDivElement;
  }

  onScrollTop(top: number) {
    const formBody = this.getFormBody();
    if (formBody) {
      formBody.scrollTop = top;
    }
  }

  onScrollLock(lock: boolean) {
    const formBody = this.getFormBody();
    if (formBody) {
      formBody.style.overflow = lock ? "hidden" : "auto";
    }
  }

  validate(onlyUpload?: boolean) {
    let formRenderer = this.$refs.formRenderer as any;
    // formRenderer = formRenderer.$refs.formRenderer as any;

    let valid = false;

    const formControls: renderer.RendererFormControl[] = [];
    renderer.components.FormRendererHelper.findFormControl(
      this.controls,
      formControls
    );

    if (!onlyUpload) {
      if (this.approval) {
        valid = formRenderer.validate([this.approval.key]);
      } else {
        valid = formRenderer.validate();
      }
      // this.formControls = formControls;
      const isRequire: boolean = formControls
        .filter(c => c.type === renderer.FormControlType.Address)
        .some((c: any) => {
          const val: any = c.controller.value;

          if (c.controller.required && (!val || !val.provinceAdcode)) {
            this.$message.error(`请输入${c.options.name}`);
            return true;
          }

          return false;
        });

      if (isRequire) {
        return false;
      }
    }

    const formBody = this.$el.querySelector(".form-body");

    const scrollTo = (key: string) => {
      const el = this.$el.querySelector(`#${key}`) as HTMLDivElement;
      if (el && formBody) {
        formBody.scrollTop = el.offsetTop - el.offsetHeight;
      }
    };

    if (!onlyUpload) {
      if (!valid) {
        const errors = formRenderer.getErrors();
        if (errors) {
          let keys = Object.keys(errors);
          if (keys.length > 0) {
            let key = keys[0];

            const control = formControls.find(c => c.key === key);

            if (control && control.type === schema.FormControlType.Sheet) {
              const map = errors[key];
              keys = Object.keys(map);
              const keys2 = Object.keys(map[keys[0]]);
              const err = formRenderer.getErrorMessage(
                keys2[0],
                map[keys[0]][keys2[0]][0],
                key
              );
              this.error = err;
              key += keys[0];
            } else {
              this.error = formRenderer.getErrorMessage(key, errors[key][0]);
            }

            scrollTo(key);
            return false;
          }
        }
      }
    }

    let upload = super.findUploadBy(renderer.UploadStatus.Uploading);
    if (upload) {
      this.error = `${upload.options.name}正在上传！`;
      scrollTo(upload.key);
      return false;
    }

    upload = super.findUploadBy(renderer.UploadStatus.Error);
    if (upload) {
      this.error = `${upload.options.name}上传失败！`;
      scrollTo(upload.key);
      return false;
    }

    this.error = "";

    return true;
  }

  async load(edit?: boolean) {
    // const closeLoading = (this.$message as any).loading();
    this.loadding = true;
    try {
      const res = await super.load(edit);

      const title = this.formObj.instanceName || this.formObj.bizSheet.name;
      // dingtalk.setTitle(title);
      if (platform && platform.service && platform.service.setTitle) {
        platform.service.setTitle(title);
      }
      const creaters = this.formObj.bizObject.data.creater;
      if (creaters && Array.isArray(creaters)) {
        this.creater = creaters[0];
      }

      if (this.approval) {
        setTimeout(() => {
          this.approval.controller = (this.formRenderer as any).findController(
            this.approval.key
          );
        }, 500);
      }
    } catch (e) {
      if (e instanceof Error) {
        // alert(e);
        console.log(e);
      }
      if (e.errcode === 302034) {
        // this.error = "该表单未发布，请联系管理员处理";
        this.goUnpublished();
        return;
      }
      if (e.errcode === 601010 || e.errcode === 6000018) {
        this.goPermission();
        return;
      }
      this.goEmptyPage();
    } finally {
      // closeLoading();
      this.loadding = false;
    }
  }

  async onActionModalOk(ac: runtime.FormActionButton, data: any) {
    if (ac.code === runtime.FormAction.Reject && !super.validateApproval()) {
      return;
    }
    return super.onActionModalOk(ac, data);
  }

  initIframe(url: string) {
    const { bizSheet } = this.formObj;
    if (!bizSheet.mobileIsPc) {
      url = bizSheet.mobileUrl;
    }
    // console.log(`aaa: ${url}`);
    const iframe = super.initIframe(url);
    const w = iframe.contentWindow as any;
    w.env = env;
    w.config = env;
    return iframe;
  }

  onOk(ac: runtime.FormActionButton, data: any) {
    // debugger
    super.doAction(ac, data);
  }

  async onAction(ac: runtime.FormActionButton) {
    await super.onAction(ac);
  }

  async goto(ac: runtime.FormActionButton, res: Common.Data) {
    // debugger
    // switch(ac.code) {
    //   case runtime.FormAction.Save:
    // }
    // this.onScrollLock(true);
    if (ac.code === runtime.FormAction.Save) {
      this.$message.success(this.$t(
        `cloudpivot.form.runtime.actionTip.${ac.code}`
      ) as string);
      setTimeout(() => {
        this.hideToast();

        if (this.isWorkflowForm) {
          const params: any = this.$route.query;
          const workitem = res.data.workItem;
          if (workitem) {
            this.goWfForm(workitem.id, workitem.instanceId);
          } else if (params.workitemId && params.workflowInstanceId) {
            this.goWfForm(params.workitemId, params.workflowInstanceId);
          }
        } else {
          this.goBizForm();
        }
      }, 2000);
    } else if (ac.code === runtime.FormAction.Retrieve) {
      // 撤回刷新页面
      const workflowInstanceId = this.$route.query.workflowInstanceId as string;
      const workitemId = this.$route.query.workitemId as string;
      if (res.data.id === workitemId) {
        this.reload();
        this.workflowInstanceId = "";
        this.$nextTick(() => {
          this.workflowInstanceId = workflowInstanceId;
        });
      } else {
        this.goWfForm(res.data.id, workflowInstanceId);
      }

      // this.retrieveCallBack();
    } else {
      this.$message.success(this.$t(
        `cloudpivot.form.runtime.actionTip.${ac.code}`
      ) as string);

      setTimeout(() => {
        let url =
          (this.$route.query.return as string) ||
          window.sessionStorage.getItem("fullPath");

        if (url) {
          this.$router.replace({
            path: url
          });
          // this.$router.push(url)
        } else {
          this.goEmptyPage(res);
        }
      }, 1000);
    }
  }

  // retrieveCallBack() {
  //   const workflowInstanceId = this.$route.query.workflowInstanceId as string;
  //   const workitemId = this.$route.query.workitemId as string;
  //   const vm = this;
  //   this.timer = setInterval(() => {
  //       const params = {
  //           workflowInstanceId,
  //           activityCode: this.formObj.activityCode as string
  //       }
  //       workflowApi.isRetrieve(params).then(res => {
  //           if (res.errcode === 0) {
  //               if (!res.data) {
  //                   // 撤回成功获得新流程实例id 刷新表单
  //                   workflowApi.getWorkitemByInstanceid({ workflowInstanceId }).then(res => {
  //                       if (res.errcode === 0) {
  //                           vm.reload();
  //                           vm.workflowInstanceId = '';
  //                           vm.$nextTick(()=>{
  //                             vm.workflowInstanceId = workflowInstanceId;
  //                           });
  //                       }
  //                   });
  //                   clearInterval(vm.timer);
  //               }
  //           } else {
  //               this.$message.error(res.errmsg || '');
  //               clearInterval(vm.timer);
  //           }
  //       });
  //   },1000);
  // }

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

  goWfForm(workitemId: string, workflowInstanceId: string) {
    const url = this.$route.query.return as string;
    this.$router.replace({
      name: "form-detail",
      query: {
        workitemId,
        workflowInstanceId,
        return: url
      } as any
    });
  }

  goEmptyPage(backData?: any) {
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
            this.$router.replace({
              name: "shared-success",
              params: { shortCode: res.data.pairCode }
            });
            console.log("url", (window as any).location.href);
          }
        });
    } else {
      this.$router.replace({
        name: "form-empty",
        query: {
          return: this.$route.query.return
        }
      });
    }
  }

  goUnpublished() {
    this.$router.push({
      name: "formUnpublished"
    });
  }

  goPermission() {
    this.$router.replace({
      name: "permission"
    });
  }

  flowTrack() {
    // if(!this.formObj || !this.formObj.workItemId){
    //   return;
    // }

    this.$router.push({
      name: "FormApproval",
      params: {
        workflowInstanceId: this.workflowInstanceId
      },
      query: {
        return: this.$route.query.return
      }
    });
  }
}
</script>

<style lang="less" scoped>
@import "~@/styles/mixins.less";
@import "~@/styles/1px.less";

.form-detail {
  // display: flex;
  // flex-direction: column;
  height: 100%;
  position: relative;
  overflow-x: hidden;

  /deep/.h3-org-select {
    position: fixed;
  }

  /deep/ .h3-panel > .h3-panel-header {
    .px2rem(font-size, @font-size-xl);
    // .px2rem(height, 90px);
    .px2rem(padding-left, 30px);
    .px2rem(padding-right, 30px);
    .px2rem(padding-top, 20px);
    .px2rem(padding-bottom, 20px);
    .hairline("bottom", #eee);
    display: block;
    // align-items: center;
    background-color: #f7f8fc;

    & > span {
      font-size: 18px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.85);
    }
  }

  /deep/.desc {
    min-height: 2.8em;
    margin: 0.5em;
    .px2rem(margin-left, 30px);
    .px2rem(margin-right, 30px);
  }
}

.form-body {
  // flex-grow: 1;
  overflow-x: hidden;
  overflow-y: auto;
  // margin-bottom: 44px;
  height: calc(100% - 44px);
  .form {
    //border-top:0.5px solid #eee;
    background-color: #fff;
  }
}

/deep/ .h3-swiper {
  overflow: hidden !important;
}
/deep/.h3-swiper-item > div {
  overflow-y: auto;
  height: calc(100vh - 2.47rem) !important;
}

.form-foot {
  // flex-shrink: 0;
  // position: fixed;
  // z-index: 10;
  // bottom: 0;
  // width: 100%;
  // height: 24px;
  // box-sizing: border-box;
}

/deep/.toptip.error {
  color: @error-color;
  position: fixed;
  z-index: 11;
  background-color: @error-bg;
}
</style>
