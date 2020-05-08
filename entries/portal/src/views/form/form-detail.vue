
<template>
  <div class="form-detail">
    <form-detail-header :formObj="formObj">
      <form-actions
        :actions="actions"
        @action="onAction"
        :toShowPrints="isShow"
        :setPdfConf="pdfAble"
        @propPrintClick="getChildPrintClick"
        @modifyOwnerClick="onModifyOwnerClick"
      ></form-actions>
    </form-detail-header>

    <div class="form-body" @scroll="onBodyScroll" @click="isShow = false">
      <div class="form-wrap">
        <workflow-info
          v-if="workflowInstanceId"
          :id="workflowInstanceId"
          :itemId="formObj.workItemId"
          @setFinishTime="setFinishTime"
          @flowTrack="flowTrack"
        ></workflow-info>
        <pc-form-renderer
          :class="{'has-form-border': borderMode}"
          ref="formRenderer"
          :controls="controls"
          :formControls="formControls"
          :dataItems="dataItems"
          @sheetColumnResize="onSheetColumnResize"
        ></pc-form-renderer>

        <a-collapse
          v-if="workflowInstanceId"
          class="workflow-collapse"
          activeKey="approvals"
          :bordered="false"
        >
          <a-collapse-panel
            class="bold-collapse-panel"
            :header="$t('languages.common.approval')"
            key="approvals"
          >
            <Approval
              :workflowInstanceId="workflowInstanceId"
              :completed="completed"
              :canceled="canceled"
              :finishTime="finishTime"
              :getFileUrlFn="getFileUrlFn"
              @download="onDownload"
            ></Approval>
          </a-collapse-panel>
        </a-collapse>

        <form-action-modal ref="actionModal" @ok="onOk"></form-action-modal>

        <form-modify-owner-modal ref="modifyOwmerModal" @ok="onOk"></form-modify-owner-modal>
      </div>

      <div v-show="showBacktop" class="back-top" @click="backTop">
        <a-icon type="up"></a-icon>
      </div>
    </div>
    <a-alert v-if="comment" :message="comment" type="info" banner closable class="alert-info" />

    <a-alert
      v-if="showAlertWarn"
      class="alert-warning"
      message="该表单未发布，请联系管理员处理"
      type="warning"
      showIcon
      closable
    />

    <div class="pdf-frame-div" v-if="pdfUrl.includes('?file=') && showPdf"></div>
    <iframe class="pdf-frame" :src="pdfUrl" v-if="pdfUrl.includes('?file=') && showPdf"></iframe>
    <iframe class="pdf-frame" id="pdfFrame" :srcdoc="srcdoc"></iframe>
    <a-icon v-if="showPdf" @click="showPdf = false" type="close" class="close-previewPdf" />
    <GenerateHtml ref="printRenderer" v-show="false" :pages="draftAttributesJson" :formdata="formdata"></GenerateHtml>

    <!-- <h3-message
      ref="h3Messsag"
      :title="$t('languages.form.operateDone')"
      :content="$t('languages.form.goNextTask')"
    ></h3-message>-->
  </div>
</template>

<script src="./form-detail.ts"></script>

<!--自定义弹出框背景样式-->
<style lang="less">
.ant-modal-mask {
  background: rgba(0, 0, 0, 0.3968);
}
.pdf-frame-div {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: 233;
  background-color: #000;
  opacity: 0.6;
}
// .pdf-frame {
//   position: absolute;
//   left: 25%;
//   top: 0;
//   z-index: 2333;
//   width: 50%;
//   height: 100%;
// }
.pdf-frame {
  position: fixed;
  left: 250%;
  top: 0;
  z-index: 2333;
  width: 50%;
  height: 100%;
}
.close-previewPdf {
  width: 32px;
  position: relative;
  z-index: 2333;
  left: 75.5%;
  bottom: 96%;
  color: #606165;
  font-size: 32px;
  background: #ccc;
  border-radius: 50%;
  &:hover {
    color: #000;
    cursor: pointer;
    transition: all 0.3s;
  }
}
</style>
<style lang="less" scoped>
@import "../../styles/themes/default.less";
// @import "../../components/apps/form/style";
.form-detail {
  min-width: 1100px;
}
.textarea {
  display: flex;
  align-items: center;
}
.form-body {
  flex-grow: 1;
  overflow: auto;
  position: relative;
  min-width: 1050px;
}
// /deep/.ant-tabs-content{
//   min-height: 500px;
// }
.form-wrap {
  width: 1032px;
  margin: @base10-padding-md auto 100px auto;
}

.back-top {
  cursor: pointer;
  position: fixed;
  display: inline-flex;
  right: 40px;
  bottom: 40px;
  width: 40px;
  height: 40px;
  background: @light-color-3;
  border-radius: 50%;
  color: #fff;
  font-weight: 700;
  font-size: @font-size-18;
  justify-content: center;
  align-items: center;
}

/deep/.ant-alert.alert-info {
  position: absolute;
  top: 74px;
  left: calc(50% - 308px);
  width: 616px;
  min-height: 40px;
  background-color: #f0f7ff;
  color: rgba(0, 0, 0, 0.65);
  border-radius: 4px;
  border: 1px solid rgba(41, 112, 255, 0.5);

  & > i {
    top: 12px;
  }
}

/deep/.ant-alert-message {
  // overflow: hidden;
  // white-space: nowrap;
  // text-overflow: ellipsis;
  word-break: break-all;
  display: block;
  margin-right: 1em;
}

/deep/.ant-alert.alert-warning {
  position: absolute;
  top: 74px;
  left: calc(50% - 308px);
  width: 616px;
  height: 40px;
  border-radius: 4px;
}

/deep/.field__label {
  min-width: 102px;
  max-width: 102px;
  width: 102px;
}

/deep/.ant-row-flex {
  .field.system .field__control {
    padding-left: 5px;
  }

  .field.system {
    padding-left: 0;
    padding-right: 0;
    .field__label {
      flex-grow: 1;
      // max-width: none;
      margin-right: 0;
      margin-left: 8px;
    }
  }

  & > .ant-col:first-child > .field.system {
    .field__label {
      min-width: 1em;
      width: auto;
      margin-right: 0;
      justify-content: flex-start;
      flex-grow: 0 !important;
    }
  }

  // & > .ant-col:last-child > .field.system {
  //   .field__label {
  //     flex-grow: 1;
  //     margin-right: 0;
  //     max-width: none;
  //   }

  //   .field__control {
  //     flex-grow: 0;
  //     flex-shrink: 0;
  //     justify-content: flex-end;
  //   }
  // }
}
</style>
