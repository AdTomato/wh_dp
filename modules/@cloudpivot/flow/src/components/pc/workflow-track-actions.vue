<template>
  <div class="options">
    <a-button 
      v-if="headerAction.showEditable" 
      @click="edit" 
      type="primary"
    >{{ $t('cloudpivot.flow.pc.Edit') }}</a-button>
    <a-button v-if="headerAction.showAdjust" @click="adjustNode">{{ $t('cloudpivot.flow.pc.AdjustNode') }}</a-button>
    <a-button v-if="headerAction.showCancel" @click="nullify">{{ $t('cloudpivot.flow.pc.Nullify') }}</a-button>
    <a-button v-if="headerAction.showRemove" @click="deleteForm">{{ $t('cloudpivot.flow.pc.Delete') }}</a-button>
    <a-button v-if="headerAction.showUserLog" @click="logs">{{ $t('cloudpivot.flow.pc.Logs') }}</a-button>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Button } from "h3-antd-vue";
import confirm from "./confirm";
import { ConfirmOptions } from "./confirm/confirm";
import AdjusNodeModal from "./adjust-node-modal.vue";
import { workflowApi,workflow } from "@cloudpivot/api";

@Component({
  name: "workflow-track-actions",
  components: {
    AButton: Button
  }
})
export default class WorkflowTrackActions extends Vue {

  @Prop() workflowInstanceId!: string; // 流程实例id

  @Prop() workItemId!: string; // 流程id

  @Prop({ default: [] }) headerAction!: workflow.HeaderAction; // 头部按键权限

  @Prop() currentActivityCode!: string; // 当前节点code

  i18nData:any = {};

  destoryConfirm:any = {};

  flag:boolean = false;

  /**
   * 编辑事件
   */
  edit() {
    this.$emit('edit');
  }

  /**
   * 作废事件
   */
  nullify() {
    const formOptions: ConfirmOptions = {
      title: `${this.$t('cloudpivot.flow.pc.Nullify')}`,
      content: `${this.$t('cloudpivot.flow.pc.NullifyTips')}`,
      ok: async () => {
        const res = await workflowApi.abortInstance(this.workflowInstanceId);
        this.$emit("loadData", res.data);
      },
      buttonsText: [`${this.$t('cloudpivot.flow.pc.Cancel')}`, `${this.$t('cloudpivot.flow.pc.OK')}`]
    };
    confirm(formOptions);
  }

  /**
   * 删除事件
   */
  deleteForm() {
    const formOptions: ConfirmOptions = {
      title: `${this.$t('cloudpivot.flow.pc.Delete')}`,
      content: (h: any) =>
        h("div", [
          `${this.$t('cloudpivot.flow.pc.DeleteTips1')}`,
          h(
            "span",
            {
              style: {
                color: "rgba(244, 69, 78, 1)"
              }
            },
            `${this.$t('cloudpivot.flow.pc.DeleteTips2')}`
          ),
          `${this.$t('cloudpivot.flow.pc.DeleteTips3')}`
        ]),
      ok: async () => {
        await workflowApi.deleteInstance(this.workflowInstanceId);
        this.$router.replace({ name: "shared-empty" });
      },
      buttonsText: [`${this.$t('cloudpivot.flow.pc.Cancel')}`, `${this.$t('cloudpivot.flow.pc.OK')}`]
    };
    confirm(formOptions);
  }

  /**
   * 调整节点事件
   */
  adjustNode() {
    this.i18nData = {
      chooseAdjustType: `${this.$t('cloudpivot.flow.pc.ChooseAdjustType')}`,
      finishWorkflow: `${this.$t('cloudpivot.flow.pc.FinishWorkflow')}`,
      adjustOriginator: `${this.$t('cloudpivot.flow.pc.AdjustOriginator')}`,
      cancelAllTask: `${this.$t('cloudpivot.flow.pc.CancelAllTask')}`,
      activateNodes: `${this.$t('cloudpivot.flow.pc.ActivateNodes')}`,
      adjustNodeTips: `${this.$t('cloudpivot.flow.pc.AdjustNodeTips')}`,
      chooseNode: `${this.$t('cloudpivot.flow.pc.ChooseNode')}`,
      clickChoose: `${this.$t('cloudpivot.flow.pc.ClickChoose')}`,
      null: `${this.$t('cloudpivot.flow.pc.Null')}`,
      chooseHandler: `${this.$t('cloudpivot.flow.pc.ChooseHandler')}`,
    };

    const formOptions: ConfirmOptions = {
      title: `${this.$t('cloudpivot.flow.pc.AdjustNode')}`,
      width: 552,
      content: (h: any) =>
        h(AdjusNodeModal, {
          props: { workflowInstanceId: this.workflowInstanceId, i18nData: this.i18nData }
        }),
      ok: (e: any, content: Vue) => {
        this.adjustNodeHandle(content);
        console.log("调整节点事件回调", e, content);
      },
      oKCallBack: (destory:any) => {
        if (destory) {
          this.destoryConfirm = destory;
        }
      },
      oKDestoryed: false,
      buttonsText: [`${this.$t('cloudpivot.flow.pc.Cancel')}`, `${this.$t('cloudpivot.flow.pc.OK')}`]
    };
    confirm(formOptions);
  }

  /**
   * 处理节点操作
   */
  async adjustNodeHandle(content: any) {
    let formOptions: ConfirmOptions;
    let selectValue: string;
    let userValue: any;
    let res;
    switch (content.value) {
      case 1:
        formOptions = {
          title: `${this.$t('cloudpivot.flow.pc.FinishWorkflow')}`,
          content: `${this.$t('cloudpivot.flow.pc.FinishWorkflowTips')}`,
          ok: async () => {
            res = await workflowApi.finishInstance(this.workflowInstanceId);
            this.$emit("loadData", res.data);
          },
          buttonsText: [`${this.$t('cloudpivot.flow.pc.Cancel')}`, `${this.$t('cloudpivot.flow.pc.OK')}`]
        };
        confirm(formOptions);
        break;
      case 2:
        // 防止重复请求过多导致的报错
        if (this.flag) {
          return;
        }
        this.flag = true;
        let actCode:string = this.currentActivityCode;
        if (typeof content.selectValue === 'string' && content.selectValue) {
          actCode = content.selectValue;
        }
        res = await workflowApi.adjustParticipantors({
          activityCode: actCode,
          participantors: content.userValue.map((u: any) => u.id),
          workflowInstanceId: this.workflowInstanceId
        });

        this.flag = false;
        if(res.errcode !== 0 && res.errmsg){
          this.$message.error(res.errmsg);
        } else if(this.destoryConfirm.$destroy instanceof Function) {
          this.destoryConfirm.$destroy();
        }

        this.$emit("loadData", res ? res.data : null);
        break;
      case 3:
        let activityCode:string = this.currentActivityCode;
        if (typeof content.selectValue === 'string' && content.selectValue) {
          activityCode = content.selectValue;
        }
        // return;
        res = await workflowApi.cancelActivity({
          workflowInstanceId: this.workflowInstanceId,
          activityCode
        });
        this.$emit("loadData", res ? res.data : null);
        break;
      case 4:
        res = await workflowApi.activateActivity({
          activityCode: content.selectValue,
          workflowInstanceId: this.workflowInstanceId
        });
        this.$emit("loadData", res ? res.data : null);
        break;
      default:
        break;
    }
    if(content.value !== 2 && this.destoryConfirm.$destroy instanceof Function) {
      this.destoryConfirm.$destroy();
    }
  }

  /**
   * 跳转日志
   */
  logs() {
    this.$emit('logs');
  }

}
</script>
<style lang="less">
.options {
    flex: 1 1;
    display: flex;
    justify-content: flex-end;
    flex-wrap: wrap;
    button {
      margin-left: @base4-padding-xs;
    }
  }
</style>
