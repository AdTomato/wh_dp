<template>
  <div class="exception-info">
    <div class="exception-info__content">
      <div class="exception-info__card">
        <h3 class="exception-info__title">详细信息</h3>
        <a-row>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">流程模版：</a-col>
              <a-col :span="18">{{ info.workflowName }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">流程模版编码：</a-col>
              <a-col :span="18">{{ info.workflowCode }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">流程实例：</a-col>
              <a-col :span="18">
                <a @click="$emit('openForm')">{{ info.workflowInstanceName }}</a>
              </a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">流程实例ID：</a-col>
              <a-col :span="18">
                <a @click="$emit('openForm')">{{ info.workflowInstanceId }}</a>
              </a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">模版版本：</a-col>
              <a-col :span="18">{{ info.workflowVersion }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">修复状态：</a-col>
              <a-col :span="18">{{ info.status === 1 ? '已修复' : '未修复' }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">创建人：</a-col>
              <a-col :span="18">{{ info.createrName }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">创建时间：</a-col>
              <a-col :span="18">{{ info.createdTime }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">修复人：</a-col>
              <a-col :span="18">{{ info.status === 1 ? info.fixerName : '无' }}</a-col>
            </a-row>
          </a-col>
          <a-col class="exception-info__item" :span="12">
            <a-row>
              <a-col class="exception-info__label" :span="6">修复时间：</a-col>
              <a-col :span="18">{{ info.status === 1 ? info.fixedTime : '无' }}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div class="exception-info__card">
        <h3 class="exception-info__title">异常信息</h3>
        <a-row
          class="exception-info__item"
          type="flex"
          justify="start"
        >
          <a-col class="exception-info__label" :span="4">摘要：</a-col>
          <a-col :span="20">{{ info.summary }}</a-col>
        </a-row>
        <a-row
          class="exception-info__item"
          type="flex"
          justify="start"
        >
          <a-col class="exception-info__label" :span="4">详细信息：</a-col>
          <a-col :span="20">{{ info.detail }}</a-col>
        </a-row>
      </div>
      <div class="exception-info__card">
        <h3 class="exception-info__title">修复说明</h3>
        <a-row
          class="exception-info__item"
          type="flex"
          justify="start"
        >
          <a-col class="exception-info__label" :span="4">说明：</a-col>
          <a-col :span="20">{{ info.status === 1 ? info.fixNotes : '无' }}</a-col>
        </a-row>
      </div>
    </div>
    <div class="exception-info__footer">
      <a-button
        type="primary"
        :disabled="info.status === 1"
        @click="$emit('fix')"
      >修复</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'exception-info'
})
export default class ExceptionInfo extends Vue {
  @Prop() info!: BPM.System.ExceptionInfo;
}
</script>
<style lang="less" scoped>
.exception-info {
  padding-bottom: 52px;
  &__content {
    height: calc(100% - 52px);
  }
  &__card {
    color: rgba(0, 0, 0, 0.85);
    &:not(:last-child) {
      margin-bottom: 24px;
      padding-bottom: 24px;
      border-bottom: 1px solid #e8e8e8;
    }
  }
  &__title {
    font-weight: 600;
  }
  &__item {
    margin-top: 16px;
    word-break: keep-all;
    word-wrap: break-word;
  }
  &__label {
    color: rgba(0, 0, 0, 0.65);
  }
  &__footer {
    position: absolute;
    z-index: 5;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 10px;
    text-align: center;
    border-top: 1px solid #e8e8e8;
    background-color: #fff;
  }
}
</style>
