
<template>
  <div class="workflow-info">
    <div class="workflow-info__item">
      <form-originator :user="user">{{ $t('cloudpivot.flow.mobile.UsedTime', { time: usedTime }) }}</form-originator>
      <div>
        <workflow-status class="workflow-info__status" :status="info.status"></workflow-status>
        <span @click="flowTrack">
          {{ $t('cloudpivot.flow.mobile.FlowTrack') }}
          <i class="icon aufontAll h-icon-all-right-o" />
        </span>
      </div>
    </div>

    <div class="field" v-if="info.participants && info.participants.length">
      <div class="field__label">{{ $t('cloudpivot.flow.mobile.Participant') }}</div>

      <div class="field__control">
        <div 
          class="multi-text" 
          ref="multText" 
          :class="{ collapsed : collapsed }"
        >
          <div v-for="(node, index) in info.participants" :key="index">
            <b>[{{ node.activityName }}]</b>
            <template v-for="(item, index) in node.participants">
              <span :key="index">
                {{ item.name }}
                <template v-if="index !== node.participants.length - 1">,</template>
              </span>
            </template>
          </div>
          <span 
            class="collapsed-btn" 
            v-show="showAll" 
            @click="toggle"
          >
            <span v-if="collapsed">{{ $t('cloudpivot.form.renderer.expand') }}</span>
            <span v-else>{{ $t('cloudpivot.form.renderer.collapse') }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">

import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { workflowApi, workflow } from '@cloudpivot/api';

import WorkflowStatus from '../shared/workflow-status/workflow-status.vue';
import FormOriginator from './form-originator.vue';

import common from '@cloudpivot/common';

const timeTranslate = common.utils.DateHandle.timeTranslate;


@Component({
  name: 'workflow-info',
  components: {
    WorkflowStatus,
    FormOriginator
  }
})
export default class WorkflowInfo extends Vue {
  @Prop()
  id !: string

  @Prop({
    default: ''
  })
  itemId !: string

  @Prop({
    default: {}
  })
  user !: any

  info: workflow.InstanceBaseInfo = {} as any

  showAll = true;

  collapsed = true;

  taskRef: any;

  get usedTime() {
    let usedTime = 0;
    if (!this.info || !this.info.usedTime) {
      return '';
    }
    if (this.info.status === 'COMPLETED' && this.info.startTime && this.info.finishTime) {
      const startTime = new Date(this.info.startTime.replace(/-/g, '/')).getTime();
      const finishTime = new Date(this.info.finishTime.replace(/-/g, '/')).getTime();
      usedTime = finishTime - startTime;
    } else if (this.info.status === 'CANCELED' && this.info.startTime && this.info.cancelTime) {
      const startTime = new Date(this.info.startTime.replace(/-/g, '/')).getTime();
      const cancelTime = new Date(this.info.cancelTime.replace(/-/g, '/')).getTime();
      usedTime = cancelTime - startTime;
    } else {
      usedTime = this.info.usedTime;
    }
    return timeTranslate(usedTime);
  }

  @Watch('id', {
    immediate: true
  })
  setId() {
    if (this.id) {
      workflowApi.getWorkflowBaseInfo({
        workflowInstanceId: this.id
      }).then((res) => {
        if (res.errcode === 0) {
          this.info = res.data || {};
          this.scroll();
        } else {
          this.$message.error(res.errmsg);
        }
      });
    }
  }

  flowTrack() {
    this.$emit('flowTrack');
  }

  toggle() {
    this.collapsed = !this.collapsed;
  }

  /**
   * 判断是否已展示长文本的所有内容
   */
  scroll() {
    this.$nextTick(() => {
      const el = this.$refs.multText as HTMLDivElement;
      if (el) {
        this.showAll = el.scrollHeight > el.offsetHeight + 3;
        if (el.offsetHeight === 0) {
          clearTimeout(this.taskRef);
          this.taskRef = setTimeout(() => {
            this.scroll();
          }, 500);
        }
      }
    });
  }

  mounted() {
    this.scroll();
  }

  destroyed() {
    clearTimeout(this.taskRef);
  }
}

</script>

<style lang="less" scoped>
@import "~@cloudpivot/common/styles/mixins.less";

.workflow-info {
  background-color: #fff;
  text-align: left;

  &__item {
    display: flex;
    .px2rem(padding, @font-size-base);
    justify-content: space-between;

    & > div:last-child {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      .px2rem(font-size, @font-size-base);
      color: @text-color-main;

      i.icon {
        color: @text-color-describe;
        .px2rem(margin-left, @font-size-xxs);
        //.px2rem(font-size, @font-size-xxs);
        .px2rem(font-size, @font-size-base);
      }
    }
  }

  &__status {
    .px2rem(width, 140px);
  }

  & > .field {
    .hairline("top", #eee);
    align-items: flex-start;

    b {
      color: rgba(0, 0, 0, 0.85);
      font-weight: 400;
      margin-right: 0.2em;
    }

    & > .field__label {
      flex-shrink: 0;
      padding: @horizontal-padding-sm 0;
    }

    & > .field__control {
      padding: @horizontal-padding-sm 0;
      align-items: flex-start;
      flex-direction: column;
    }
  }
}

.multi-text {
  position: relative;
  width: 100%;
  .px2rem(line-height, 40px);
  &.collapsed {
    max-height: 3.9em;
    overflow: hidden;
    .px2rem(line-height, 40px);
    // .px2rem(max-height, 120px);
  }

  .collapsed-btn {
    position: absolute;
    z-index: 9;
    right: 1px;
    bottom: -1px;
    cursor: pointer;
    background-color: #fff;

    & > span {
      color: @primary-color;
    }
  }
}
</style>
