
<template>
  <div class="form-approval">
    <div 
      v-for="(approval, i) in approvalsData" 
      :key="i" 
      class="form-approval__item"
    >
      <div class="form-approval__workflow">
        <div class="form-approval__title">
          <label>{{ isChinese ? approval.activityName : approval.name_i18n[$i18n.locale] }}</label>
        </div>
        <div class="form-approval__trail">
          <div class="form-approval__line"></div>
          <!-- <i :class="`form-approval__line-icon ${approval.activityStatus}`"></i> -->
          <i :class="`icon aufontAll form-approval__line-icon ${approval.activityStatus}`"></i>
          <div class="form-approval__line"></div>
        </div>
      </div>
      <div class="form-approval__instances">
        <div 
          v-for="(node, g) in approval.nodes" 
          :key="g" 
          class="form-approval__instance"
        >
          <template
            v-if="approval.subInstanceActivity || (node.workItemStatus !== 1 && node.workItemStatus !== 2)"
          >
            <a-avatar
              class="form-approval__avatar"
              :size="40"
              icon="user"
              :src="node.approvaler.imgUrl"
            />
            <div class="form-approval__content">
              <div class="row form-approval__info">
                <label class="form-approval__username">{{ node.approvaler.name }}</label>
                <span
                  v-if="approval.subInstanceActivity"
                >{{ getSubWorkflowActionStatus(node.subInstanceStatus) }}</span>
                <template v-else>
                  <label
                    :class="`workflow-action ${getWorkflowActionStatusColorClass(node.workActionType)}`"
                  >
                    <span>{{ getWorkflowActionStatus(node.workActionType) }}</span>
                  </label>
                  <label v-if="node.from" class="workflow-action form-approval__coming">
                    <span>{{ node.from.userInfo.name + '的' + getWorkflowActionStatus(node.from.fromType) }}</span>
                  </label>
                </template>
              </div>
              <div class="row">
                <div class="form-approval__org">{{ node.dept }}</div>
                <div class="form-approval__date">{{ node.approvalTime }}</div>
              </div>
              <template v-if="!approval.subInstanceActivity">
                <div
                  v-if="node.bizComment && node.bizComment.type !== 0 && node.bizComment.type !== 9"
                  class="row"
                >
                  <div
                    class="form-approval__text"
                    v-if="node.bizComment.type === 5 || node.bizComment.type === 6 || node.bizComment.type === 7"
                  >
                    <span class="form-approval__participant">
                      {{ getWorkflowActionStatus(node.bizComment.type) + '给' }}
                      <template
                        v-if="node.bizComment.type === 7"
                      >{{ node.forwardReceiver }}</template>
                      <template v-for="(user, userIdx) in node.bizComment.userInfos">
                        {{ user.name }}
                        <template
                          v-if="userIdx < node.bizComment.userInfos.length- 1"
                        >、</template>
                      </template>
                    </span>
                    {{ node.bizComment.content }}
                  </div>

                  <div class="form-approval__text" v-else-if="node.bizComment.content">
                    <span class="form-approval__opinion">{{ node.bizComment.title }}</span>
                    {{ node.bizComment.content }}
                  </div>

                  <div class="resources" v-if="node.bizComment.resources">
                    <template v-for="resource in node.bizComment.resources">
                      <div
                        class="resources__item"
                        :key="resource.id"
                        v-if="resource.name !== 'signsture.png'"
                      >
                        {{ resource.name }}
                        <i
                          class="icon aufontAll h-icon-all-download-o"
                          @click="download(resource.refId)"
                        ></i>
                      </div>
                    </template>
                  </div>

                  <div
                    class="form-approval__signsture clearfix"
                    v-if="node.resources && node.resources.length"
                  >
                    <template v-for="(source,index) in node.resources">
                      <div
                        :key="index"
                        v-if="source.img"
                        @mouseover="mouseListener(1,source)"
                        @mouseleave="mouseListener(0,source)"
                      >
                        <img :src="source.img" @click.stop="previewImage(source)">
                        <!-- <span
                          v-if="source.hover"
                          @click.stop="previewImage(source)"
                          class="icon aufontAll"
                        >&#xe726;</span> -->
                      </div>
                    </template>
                  </div>
                </div>
              </template>

              <template v-else>
                <a
                  class="form-approval__link"
                  @click="goToFrom(node.workflowInstanceId, node.workItemId)"
                >{{ $t('cloudpivot.flow.pc.ViewDetails') }} >></a>
              </template>
            </div>
          </template>
          <template v-else>
            <div class="form-approval__progress" v-if="node.approvaler && node.approvaler.length">
              <label>{{ getWorkItemStatus(node.workItemStatus) }}</label>
              <div class="form-approval__progress-users">
                <span v-for="(user, i) in node.approvaler" :key="i">{{ user.name }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
    <!-- 已完成流程增加结束 -->
    <div class="form-approval__item" v-if="completed || canceled">
      <div class="form-approval__workflow">
        <div class="form-approval__title">
          <label>{{ $t('cloudpivot.flow.pc.Finish') }}</label>
        </div>
        <div class="form-approval__trail">
          <div class="form-approval__line"></div>
          <i class="icon aufontAll form-approval__line-icon PASS"></i>
          <div class="form-approval__line"></div>
        </div>
      </div>
      <div class="form-approval__instances">
        <div class="form-approval__instance">
          <div class="form-approval__progress">
            <div class="form-approval__date end">{{ finishTime }}</div>
          </div>
        </div>
      </div>
    </div>
    <a-modal 
      v-model="isPreviewImage" 
      :footer="null"
      :maskClosable="false"
      :keyboard="false"
    >
      <img style="width: 100%" :src="img">
    </a-modal>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop,Watch } from "vue-property-decorator";
import { Button, Avatar, Modal } from "h3-antd-vue";
import { mixins } from "vue-class-component";
import WorkflowMixin from "../mixins/workflow";
import { renderer } from "@cloudpivot/form";
import common from '@cloudpivot/common';

import { workflow,workflowApi,user } from "@cloudpivot/api";

@Component({
  name: "form-approval",
  components: {
    AButton: Button,
    AAvatar: Avatar,
    AModal: Modal
  }
})
export default class FormApproval extends mixins(WorkflowMixin) {
  //@Prop({ default: () => [] }) 
  approvals: workflow.ApprovalInstance[] = []; // 流程实例

  @Prop({
    default : ''
  })
  workflowInstanceId !: string

  @Prop({
    default : false
  })
  completed !: boolean

  @Prop({
    default : false
  })
  canceled !: boolean

  @Prop()
  finishTime !: string

  @Prop()
  getFileUrlFn !: (file : any) => string;

  isPreviewImage: boolean = false;

  img: string = "";

  @Watch('workflowInstanceId',{
    immediate : true
  })
  onWorkflowInstanceIdChange(id : string){
    if(id){
      workflowApi.getApproval({
            workflowInstanceId: id
        }).then(res=>{
          if (res.errcode === 0) {
            if (Array.isArray(res.data)) {
              res.data.forEach((d:any) => {
                common.utils.compatible(d, 'activityName');
              });
            }
            this.approvals = res.data || [];
          }else{
            this.approvals = [];
          }
        });
    }else{
      this.approvals = [];
    }
  }

  previewImage(file: any) {
    this.isPreviewImage = true;
    this.img = file.img;
  }

  mouseListener(type: number, file: any) {
    file.hover = Boolean(type);
  }

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  get approvalsData() {
    const approvals = Object.assign([], this.approvals);
    approvals.forEach((item: workflow.ApprovalInstance) => {
      if (!item.subInstanceActivity) {
        if (item.nodes && item.nodes.length) {
          const noStartedApprovaler: user.Info[] = [];
          const inProgressApprovaler: user.Info[] = [];
          item.nodes = item.nodes.map((node: any) => {
            if (node.resources && node.resources.length) {
              node.resources = node.resources.map((signatrue: any) => {
                const s: any = {
                  img: "",
                  file: signatrue,
                  hover: false
                };
                if (this.getFileUrlFn && signatrue.name === "signsture.png") {
                  s.img = this.getFileUrlFn(
                    signatrue
                  );
                }
                return s;
              });
            }

            // 过滤 1 未启动 和 2 进行中的节点, 进行数据重组
            if (node.workItemStatus === 1 || node.workItemStatus === 2) {
              node.workItemStatus === 1 ? noStartedApprovaler.push(node.approvaler): inProgressApprovaler.push(node.approvaler);
              return;
            }
            return node;
          }).filter(Boolean);

          if (noStartedApprovaler.length) {
            item.nodes.push({ workItemStatus: 1, approvaler: noStartedApprovaler } as workflow.ApprovalNode);
          }
          if (inProgressApprovaler.length) {
            item.nodes.push({ workItemStatus: 2, approvaler: inProgressApprovaler } as workflow.ApprovalNode);
          }
        }
      }
    });
    return approvals;
  }

  // hasParticipant() {

  // }

  goToFrom(workflowInstanceId: string, workItemId: string) {
    this.$router.push({
      name: "form-detail",
      query: {
        workflowInstanceId,
        workitemId: workItemId,
        return: `${location.pathname + location.search}`
      }
    });
  }

  download(refId: string) {
    // const token = localStorage.getItem('token') || '';
    // const url = `${env.apiHost}/api/aliyun/download?refId=${refId}&access_token=${token}`;
    // window.open(url);
    this.$emit("download", {
      refId
    });
  }
}
</script>


<style lang="less"
>
// @import "../../../../styles/themes/default.less";
@import "../../style";
.form-approval {
  width: 1024px;
  margin: auto;
  &__item {
    display: flex;
  }
  &__item:first-child {
    .form-approval__trail {
      padding-top: @base4-padding-sm;
      .form-approval__line:first-child {
        display: none;
      }
    }
  }
  // &__item:last-child {
  //   .form-approval__trail {
  //     .form-approval__line:last-child {
  //       // display: none;
  //     }
  //   }
  // }
  &__workflow {
    display: flex;
    flex: 0 0 148px;
  }
  &__title {
    display: flex;
    justify-content: flex-end;
    flex: 0 0 90px;
    width: 90px;
    // margin-top: @base4-padding-xs;
    margin-top: @base10-padding-sm;
    color: @light-color-1;
    label {
      display: block;
      word-wrap: break-word;
      word-break: break-all;
    }
  }
  &__instances {
    flex: 1 1;
  }
  &__trail {
    flex: 0 0 10px;
    margin: 0 @base4-padding-lg;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  // &__line-icon {
  //   flex: 0 0 10px;
  //   margin: @base4-padding-base 0;
  //   width: 10px;
  //   border: 2px solid rgba(50, 182, 131, 1);
  //   border-radius: 50%;
  //   &.UNPASS {
  //     border-color: #f4454e;
  //   }
  //   &.INPROGRESS {
  //     border-color: #2970ff;
  //   }
  // }
  &__line-icon {
    flex: 0 0 14px;
    width: 14px;
    height: 14px;
    line-height: 14px;
    margin: @base4-padding-base 0;
    color: #ffffff;
    background-color: #32b683;
    border-radius: 50%;
    text-align: center;
    font-size: 10px;
    &.UNPASS {
      background-color: #f5222d;
    }
    &.INPROGRESS {
      background-color: #ffffff;
    }
    &.END {
      background-color: rgba(0, 0, 0, 0.45);
    }
    &.PASS:before{
      content: '\e98f';
    }
    &.UNPASS:before{
      content: '\e996';
    }
    &.END:before{
      content: '\e8d5';
    }
    &.INPROGRESS:before {
      content: '';
      display: inline-block;
      width: 10px;
      height: 10px;
      margin-top: 2px;
      border: 2px solid #2970ff;
      border-radius: 50%;
    }
  }
  &__line {
    flex: 1 1;
    width: 2px;
    background: rgba(232, 232, 232, 1);
  }
  &__line:first-child {
    flex: 0 0 10px;
  }
  &__instance {
    display: flex;
  }
  &__avatar {
    flex: 0 0 40px;
    margin-right: @base4-padding-md !important;
    border: 1px solid #eaedf3;
  }
  &__coming {
    background-color: @white-background;
    border: 1px solid rgba(177, 187, 197, 1);
    span {
      color: #b1bbc5;
    }
  }
  &__content {
    flex: 1 1;
    padding-bottom: @base4-padding-lg;
    > *:first-child {
      margin-bottom: @base4-padding-base;
    }
    > * {
      margin-bottom: @base4-padding-xs;
    }
    > *:last-child {
      margin: 0;
    }
  }
  &__org,
  &__date {
    font-size: @font-size-12;
    display: inline-block;
  }
  &__date {
    color: @light-color-3;
    margin-left: @base4-padding-md;
  }
  .end{
    margin-left: 0;
  }
  &__info label {
    margin-right: @base4-padding-xs;
    color: @light-color-1;
  }
  &__text {
    padding: @base4-padding-xs;
    color: @light-color-1;
    font-size: @font-size-12;
    background-color: #f4f6fc;
    border-radius: @border-radius-lg;
    word-break: break-all;
  }
  &__opinion {
    margin-right: @base4-padding-base;
    color: @light-color-3;
  }
  &__participant {
    display: inline-block;
    background-color: #b1bbc5;
    padding: 2px @base4-padding-xs;
    margin-right: @base4-padding-base;
    color: #fff;
    border-radius: @border-radius-lg;
  }
  &__progress {
    display: flex;
    flex-grow: 1;
    margin-top: 10px;
    label {
      flex: 0 0 60px;
      font-size: @font-size-12;
      color: @light-color-3;
    }
  }
  &__progress-users {
    flex: 1;
    flex-shrink: 0;
    padding-bottom: @base4-padding-base;
    color: @light-color-1;
    font-size: @font-size-12;

    & > span:not(:last-child)::after {
      content: "、";
    }
  }
  &__instance:last-child &__progress-users {
    padding-bottom: 24px;
  }

  .resources {
    &__item {
      color: rgba(0, 0, 0, 0.85);
      padding: 15px 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      &:hover {
        background-color: #f0f7ff;
      }

      & > i {
        color: @primary-color;
        cursor: pointer;
        font-size: 1em;
      }
    }
  }
  &__signsture {
    padding-top: 8px;
    & > div {
      float: left;
    }
    position: relative;
    img {
      width: 64px;
      height: 64px;
      border-radius: 2px;
      border:1px solid rgba(221,221,221,1);
      margin-right: 8px;
      cursor: url("./enlarge-o.png"), pointer;
    }
    .icon {
      position: absolute;
      left: 50px;
      top: 36px;
      cursor: pointer;
      font-size: 14px;
    }
  }
  &__org {
    color: @light-color-1;
  }
  &__link {
    font-size: @font-size-12;
  }
}
</style>
