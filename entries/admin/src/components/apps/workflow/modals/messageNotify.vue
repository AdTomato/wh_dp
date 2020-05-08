<template>
  <a-modal
    title="自定义通知设置"
    width="446px"
    :visible="value"
    cancelText="取消"
    okText="确定"
    @cancel="closeModal"
    @ok="handleOk"
    :maskClosable="false"
  >
    <div class="message-notify">
      <div class="message-notify__item">
        <div class="label">标题</div>
        <div class="select-type">
          <a-select
            class="input-select"
            mode="tags"
            :placeholder="$t('languages.PlaceHolder.Select')"
            v-model="title"
          >
            <a-select-opt-group>
              <span slot="label" class="select-title">业务数据项</span>
              <a-select-option v-for="i in bizSummaryList" :key="i.code">{{ i.name }}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label" class="select-title">系统数据项</span>
              <a-select-option v-for="i in defaultSummaryList" :key="i.code">{{ i.name }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
      </div>

      <div class="message-notify__item">
        <div class="label">内容</div>
        <div class="select-type">
          <a-select
            class="input-select"
            :placeholder="$t('languages.PlaceHolder.Select')"
            v-model="summary"
          >
            <!-- 20191217 新需求 选择查询列表 -->
            <a-select-option v-for="i in lists" :key="i.id">{{ i.name }}</a-select-option>
            
            
            <!-- <a-select-opt-group>
              <span slot="label" class="select-title">业务数据项</span>
              <a-select-option v-for="i in bizSummaryList" :key="i.code">{{ i.name }}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label" class="select-title">系统数据项</span>
              <a-select-option v-for="i in defaultSummaryList" :key="i.code">{{ i.name }}</a-select-option>
            </a-select-opt-group> -->
          </a-select>
          <p>取对应列表移动端的展示字段作为消息内容</p>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
// eslint-disable-next-line import/no-extraneous-dependencies
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import * as listApi from '@/apis/list/list.api';

// eslint-disable-next-line import/no-extraneous-dependencies
import { State, namespace } from 'vuex-class';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'MessageNotify',

})
export default class MessageNotify extends Vue {
  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.State('WorkflowDataItem_origin') WorkflowDataItemOrigin: any;

  @Prop() value!: boolean;

  get defaultSummaryList() {
    return this.WorkflowDataItemOrigin.filter((data: any) => data.defaultProperty);
  }

  get bizSummaryList() {
    return this.WorkflowDataItemOrigin.filter((data: any) => !data.defaultProperty);
  }

  title:any = [];

  summary:any = '';

  lists:any = [];


  closeModal() {
    this.$emit('input', false);
  }

  handleOk() {
    const { title, summary } = this;

    this.$emit('ok', { title, summary });

    this.$emit('input', false);
  }

  /*
  * 获取查询列表的列表
  */
  getLists() {
    const { bizSchemaCode } = this.$route.params;
    listApi.getList(bizSchemaCode).then((res: any) => {
      if (res.data && Array.isArray(res.data)) {
        this.lists = res.data.filter((l: any) => l.publish);
      }
    });
  }

  mounted(){
    this.getLists();
  }


  @Watch('value')
  onValueChange(v:any) {
    if (v) {
      this.title = this.curActivityProps.todoDataItem.title;
      if (typeof this.curActivityProps.todoDataItem.summary === 'string') {
        this.summary = this.curActivityProps.todoDataItem.summary;
        return;
      }

      if (!this.curActivityProps.todoDataItem.summary) {
        this.summary = '';
        return ;
      }

      let isOldData:boolean = this.curActivityProps.todoDataItem.summary.some((item:any) => item.isDataItem === 0 || item.isDataItem === 1) as boolean;
      if (isOldData) {
        this.summary = '';
      } else {
        this.summary = this.curActivityProps.todoDataItem.summary[0] ? this.curActivityProps.todoDataItem.summary[0].code : '';
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .message-notify {
    &__item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      &:last-of-type {
        margin-bottom: 0;
      }
      & .label {
        width:64px;
        font-size:14px;
        line-height: 22px;
        color:rgba(0,0,0,0.65);
      }
      & .select-type {
        flex-grow: 1;
        max-width: calc( 100% - 64px );
        position: relative;
        .input-select {
          width: 100%;
          &.has-error {
            border-color: #F4454E!important;
            /deep/.ant-select-selection {
              border-color: #F4454E!important;
            }
          }
        }
        p {
          position: absolute;
          bottom: -20px;
          font-size: 12px;
        }
      }
    }
    /deep/.ant-select-selection--multiple .ant-select-selection__rendered > ul > li {
      margin-bottom: 3px;
    }
  }

</style>
