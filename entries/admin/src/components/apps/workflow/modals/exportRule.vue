<template>
  <a-modal
    width="500px"
    :visible="value"
    :cancelText="'取消'"
    :okText="'保存'"
    class="export"
    @cancel="closeModal"
    @ok="handleOk"
    :maskClosable="false"
    :keyboard="false"
  >
    <div slot="title" class="title-wrap">
      <span>出口规则</span>
      <div class="tag">
        <div
          class="tag-button approve"
          :class="{'tag-selected':!isSelected}"
          @click="approveExport"
        >同意出口</div>
        <div
          class="tag-button disapprove"
          :class="{'tag-selected':isSelected}"
          @click="disApproveExport"
        >否决出口</div>
      </div>
    </div>
    <div class="approve-export" v-show="!isSelected">
      <div class="export-rule">
        <a-select
          placeholder="请选择"
          @change="selectChange($event, 'approve')"
          v-model="approveSelect"
          class="input-select"
        >
          <a-select-option
            v-for="(item,index) in selectData"
            :key="index"
            :value="item.type"
          >{{ item.name }}</a-select-option>
        </a-select>
        <a-input-number
          v-model="exportRuleData.approveExit"
          :min="1"
          :max="approvePercent?100:Infinity"
          :precision="0"
          class="input-number"
        ></a-input-number>
        <span v-show="approvePercent">%</span>
        <span v-show="!approvePercent">人</span>
        <span class="export-text">同意时进入下一节点</span>
      </div>
      <div class="export-content">
        <p>例1：</p>
        <p class="content-text">
          百分比80%同意时进入下一节点，如果当前节点有10个处理人，其中8个人审批同意后会进入下一节点
        </p>
        <p>例2：</p>
        <p class="content-text">
          人数为4同意时进入下一节点，如果当前节点有10个处理人，其中4个人审批同意后会直接进入下一节点，其他人的审批结果不需要再计算；如果当前节点有3个处理人，不足4人时，3个人全部通过才会进入下一节点
        </p>
      </div>
    </div>
    <div class="disapprove-export" v-show="isSelected">
      <div class="export-rule">
        <a-select
          placeholder="请选择"
          @change="selectChange($event, 'disapprove')"
          v-model="disapproveSelect"
          class="input-select"
        >
          <a-select-option
            v-for="(item,index) in selectData"
            :key="index"
            :value="item.type"
          >{{ item.name }}</a-select-option>
        </a-select>
        <a-input-number
          v-model="exportRuleData.disapproveExit"
          :min="1"
          :max="approvePercent?100:Infinity"
          :precision="0"
          class="input-number"
        ></a-input-number>
        <span v-show="disApprovePercent">%</span>
        <span v-show="!disApprovePercent">人</span>
        <span class="export-text">不同意时驳回至</span>
        <a-select
          placeholder="请选择"
          class="select-from"
          v-model="exportRuleData.targetActivityCode"
        >
          <a-select-option
            v-for="(item,index) in selectFrom"
            :key="index"
            :value="item.activityCode"
          >{{ item.activityName }}</a-select-option>
        </a-select>
      </div>
      <div class="export-content">
        <p>例1：</p>
        <p class="content-text">
          百分比80%同意时进入下一节点，如果当前节点有10个处理人，其中8个人审批同意后会进入下一节点
        </p>
        <p>例2：</p>
        <p class="content-text">
          人数为4同意时进入下一节点，如果当前节点有10个处理人，其中4个人审批同意后会直接进入下一节点，其他人的审批结果不需要再计算；如果当前节点有3个处理人，不足4人时，3个人全部通过才会进入下一节点
        </p>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import Graph from '@/utils/rejectActivity/graph';
import AF from '@/utils/rejectActivity/af';
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'ExportRule'
})
export default class ExportRule extends Vue {
  @WorkflowModule.State('activities') activities: any;
  @WorkflowModule.State('lines') lines: any;
  @WorkflowModule.State('currentActivity') currentActivity: any;
  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  @Prop() value!: boolean;
  @Prop() type!: string;

  isSelected:boolean = false;
  // 是否展示%
  approvePercent:boolean = true;
  disApprovePercent:boolean = true;
  // 百分比下拉框默认值
  approveSelect:string = 'percent';
  disapproveSelect:string = 'percent';
  selectData:any = [{
    name: '按百分比',
    type: 'percent'
  }, {
    name: '按人数',
    type: 'number'
  }];
  selectFrom:any = [];
  // 出口规则弹窗数据
  exportRuleData:any = {
    approveExit: '',
    disapproveExit: '',
    targetActivityCode: ''
  };

  beforeMount() {
    this.dataMounted();
  }
  // 根据数据初始化视图
  dataMounted() {
    console.log('mount');
    if (Object.keys(this.curActivityProps.participant).length) {
      const participantArray = Object.entries(this.curActivityProps.participant);
      participantArray.forEach((a: any) => {
        if (!a && !a[0] && !a[1]) {
          return;
        }
        const [key, value] = a;
        if (key === 'approveExit') {
          let filterValue = value;
          if (value && (`${value}`).indexOf('%') !== -1) {
            this.approveSelect = 'percent';
            this.approvePercent = true;
            filterValue = value.replace('%', '');
          } else if (value) {
            this.approveSelect = 'number';
            this.approvePercent = false;
          }
          this.exportRuleData.approveExit = filterValue;
        } else if (key === 'disapproveExit') {
          let _filterValue = value;
          if (value && (`${value}`).indexOf('%') !== -1) {
            this.disapproveSelect = 'percent';
            this.disApprovePercent = true;
            _filterValue = value.replace('%', '');
          } else if (value) {
            this.disapproveSelect = 'number';
            this.disApprovePercent = false;
          }
          this.exportRuleData.disapproveExit = _filterValue;
        } else if (key === 'targetActivityCode') {
          const start: number = 0; // 开始节点序号
          let end = -1;
          for (let i = 0, len = this.activities.length; i < len; i += 1) {
            if (this.activities[i].ID === this.currentActivity.ID) {
              end = i;
              break;
            }
          }
          if (end !== -1) {
            const graph: Graph = new Graph(this.activities, this.lines);
            const af = new AF(graph, start, end);
            const res = af.getResult();
            const rejectArr = res.filter((activityCode: string) => (activityCode !== this.currentActivity.activityCode));
            this.selectFrom = this.activities.filter((ac:any) => (rejectArr.includes(ac.activityCode) && ac.ID !== this.currentActivity.ID && ac.activityType === 'PARTICIPANT'));
          }
          // this.selectFrom = this.activities.filter((a:any) => (a.activityType !== 'START' && a.activityType !== 'END' && a.ID !== this.currentActivity.ID));
          if (value) {
            this.exportRuleData.targetActivityCode = value;
          } else if (!this.exportRuleData.targetActivityCode && this.selectFrom.length) {
            this.exportRuleData.targetActivityCode = this.selectFrom[0].activityCode;
            this.setPropValue({ key: 'participant.targetActivityCode', value: this.exportRuleData.targetActivityCode });
          }
        }
      });
    }
  }
  // 点击关闭事件
  closeModal() {
    this.$emit('close');
  }
  // 点击保存事件
  handleOk() {
    console.log(this.curActivityProps.participant);
    console.log(this.exportRuleData);
    if (this.exportRuleData.approveExit && this.approveSelect === 'percent') {
      this.exportRuleData.approveExit = `${this.exportRuleData.approveExit}%`;
    }
    if (this.exportRuleData.disapproveExit && this.disapproveSelect === 'percent') {
      this.exportRuleData.disapproveExit = `${this.exportRuleData.disapproveExit}%`;
    }
    this.setPropValue({ key: 'participant.approveExit', value: this.exportRuleData.approveExit });
    this.setPropValue({ key: 'participant.disapproveExit', value: this.exportRuleData.disapproveExit });
    this.setPropValue({ key: 'participant.targetActivityCode', value: this.exportRuleData.targetActivityCode });
    this.$emit('submit');
    this.closeModal();
  }
  // 展示同意出口页面
  approveExport() {
    this.isSelected = false;
  }
  // 展示否决出口页面
  disApproveExport() {
    this.isSelected = true;
  }
  // 按百分比按人数下拉change事件
  selectChange(e:string, exit:string) {
    if (exit === 'approve') {
      if (e === 'number') {
        this.approvePercent = false;
      } else {
        this.approvePercent = true;
        this.exportRuleData.approveExit = this.exportRuleData.approveExit > 100 ? 100 : this.exportRuleData.approveExit;
      }
    } else if (exit === 'disapprove') {
      if (e === 'number') {
        this.disApprovePercent = false;
      } else {
        this.disApprovePercent = true;
        this.exportRuleData.disapproveExit = this.exportRuleData.disapproveExit > 100 ? 100 : this.exportRuleData.disapproveExit;
      }
    }
  }

  @Watch('value')
  onValueChange(v:any) {
    if (v) {
      if (this.type === 'approve') {
        this.approveExport();
      } else if (this.type === 'disApprove') {
        this.disApproveExport();
      }
      this.dataMounted();
    }
  }
}
</script>
<style lang="less">
.export{
  .ant-modal-header{
    position: relative;
    .tag{
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -110px;
      margin-top: -15px;
      .tag-button{
        float: left;
        width: 110px;
        font-size: 14px;
        cursor: pointer;
        color: @primary-color;
        text-align: center;
        line-height: 28px;
        border:1px solid @primary-color;
      }
      div.tag-selected{
        background: @primary-color;
        color: #fff;
      }
      .approve{
        border-radius:4px 0px 0px 4px;
      }
      .disapprove{
        border-radius:0px 4px 4px 0px;
      }
    }
  }
  .approve-export,.disapprove-export{
    height: 260px;
    .export-rule{
      .export-text{
        margin-left: 16px;
      }
      .input-select{
        vertical-align: middle;
      }
    }
    .export-content{
      margin-top: 24px;
      p{
        font-size: 12px;
        float: left;
        margin-bottom: 8px;
        line-height: 20px;
      }
      .content-text{
        width: 420px;
      }
    }
  }
  .input-select{
    width: 208px;
    height: 32px;
  }
  .input-number{
    width: 60px;
    margin: -4px 8px 0 16px;
    .ant-input-number-handler-wrap{
      display: none;
    }
  }
  .select-from{
    width: 284px;
    height: 32px;
    margin-top: 16px;
  }
}
</style>
