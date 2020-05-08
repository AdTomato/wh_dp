<template>
  <div class="participant-panel">
    <property-widget label="参与者">
      <ellipsis-input
        slot="right"
        :value="participantData"
        @click="showModal = true"
      />
    </property-widget>
    <template v-if="type === 'PARTICIPANT'">
      <property-widget label="参与者类型">
        <a-radio-group
          slot="right"
          v-model="curActivityProps.participant.participantType"
        >
          <a-radio :value="'SINGLE_PARTICIPANT'">单人</a-radio>
          <a-radio :value="'MULTI_PARTICIPANT'">多人</a-radio>
        </a-radio-group>
      </property-widget>
      <!-- 多人时显示以下部分 -->
      <template v-if="participantType === 'MULTI_PARTICIPANT'">
        <property-widget label="参与方式">
          <a-radio-group
            slot="right"
            v-model="curActivityProps.participant.participationModel"
          >
            <a-radio :value="'PARALLEL'">并行</a-radio>
            <a-radio :value="'SERIAL'">串行</a-radio>
          </a-radio-group>
        </property-widget>
        <property-widget label="同意出口">
          <ellipsis-input
            slot="right"
            :value="approveExitText"
            @click="openExportRuleModel('approve')"
          />
        </property-widget>
        <property-widget label="否决出口">
          <ellipsis-input
            slot="right"
            :value="disapproveExitText"
            @click="openExportRuleModel('disApprove')"
          />
        </property-widget>
      </template>
      <!-- 常显部分 -->
      <property-widget label="无参与者" tip="转交管理员指的是找不到人时找对这条数据有管理权限的数据管理员，如果没有找到数据管理员就找系统管理员">
        <a-radio-group
          slot="right"
          v-model="curActivityProps.participant.noParticipant"
          :options="noparticipants"
          :defaultValue="noparticipant"
        />
      </property-widget>
      <property-widget label="是发起人">
        <!-- <a-radio-group
          slot="right"
          v-model="curActivityProps.participant.originator"
          :options="options"
          :defaultValue="isCreated"
        /> -->
        <a-checkbox
          slot="right"
          class="checkbox"
          v-model="isCreated"
          @change="checkboxChange('isCreated')"
        ></a-checkbox>
        <span slot="right">直接通过</span>
      </property-widget>
      <property-widget label="前一活动处理" tip="与上一活动处理人相同，如A的下一节点是B,当B的参与者与A相同，自动通过">
        <!-- <a-radio-group
          slot="right"
          :options="options"
          v-model="curActivityProps.participant.perviousParticipate"
          :defaultValue="preParticipant"
        /> -->
        <a-checkbox
          slot="right"
          class="checkbox"
          v-model="preParticipant"
          @change="checkboxChange('preParticipant')"
        ></a-checkbox>
        <span slot="right">直接通过</span>
      </property-widget>
      <property-widget label="处理过流程" tip="在之前活动参与过流程,注当某个用户驳回之后，下一次任务再到达时不算参与过流程，例如A提交给B，B提交给C，C驳回给A，当A提交，再次到C时，不会自动跳过C；">
        <!-- <a-radio-group
          slot="right"
          :options="options"
          v-model="curActivityProps.participant.participated"
          :defaultValue="joinedFlow"
        /> -->
        <a-checkbox
          slot="right"
          class="checkbox"
          v-model="joinedFlow"
          @change="checkboxChange('joinedFlow')"
        ></a-checkbox>
        <span slot="right">直接通过</span>
      </property-widget>
      <!-- <property-widget label="后续流程参与" tip="后续有活动并且必须经过时，跳过前面的环节不处理">
        <a-radio-group
          slot="right"
          :options="options"
          v-model="curActivityProps.participant.followUpParticipate"
          :defaultValue="postParticipant"
        />
      </property-widget>
      <property-widget label="下一活动无参与者">
        <a-radio-group
          slot="right"
          :options="options"
          v-model="curActivityProps.participant.noParticipantNextActivity"
          :defaultValue="outNext"
        />
      </property-widget> -->
    </template>
    <!-- 相关弹窗 -->
    <participant-modal
      v-model="showModal"
      :data="curActivityProps.participant.participant"
      :popupType="curActivityProps.participant.popupType"
      @close="showModal = false"
      @submit="setParticipant"
    />
    <!-- 出口规则弹窗 -->
    <export-rule-modal
      v-model="showExportRule"
      :type="exportRuleType"
      @submit="setExportRuleText"
      @close="showExportRule = false"
    />
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import * as WorkflowNamespace from '@/typings/workflow';
import PropertyWidget from '../base/propertyWidget.vue';
import EllipsisInput from '../base/ellipsisInput.vue';

import participantModal from '../modals/participant/index.vue';
import exportRuleModal from '../modals/exportRule.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'participantPanel',
  components: {
    PropertyWidget,
    EllipsisInput,
    participantModal,
    exportRuleModal
  }
})
export default class ParticipantPanel extends Vue {
  @WorkflowModule.State('currentActivity') currentActivity: any;

  @WorkflowModule.State('curActivityProps') curActivityProps?: WorkflowNamespace.curActivityProps;

  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem: any;

  @WorkflowModule.Mutation('updateExitRules') updateExitRules?: WorkflowNamespace.curActivityProps;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  @Prop() type!:any;

  /* 参与方式 */
  participantWays: any[] = [
    { label: '并行', value: 'PARALLEL' },
    { label: '串行', value: 'SERIAL' },
  ];

  participantWay: any = '1';

  /* 无参与者 */
  noparticipants: any[] = [
    { label: '转交管理员', value: 'TO_ADMIN' },
    { label: '直接通过', value: 'APPROVE' },
  ];

  noparticipant: any = '1';

  /* 通用选项 */
  options: any[] = [
    { label: '不处理', value: 'DEFAULT' },
    { label: '自动通过', value: 'APPROVE' }
  ];

  /* 是发起人 */
  isCreated: boolean = false;

  /* 前一活动参与 */
  preParticipant: boolean = false;

  /* 参与过流程 */
  joinedFlow: boolean = false;

  /* 后续流程参与 */
  postParticipant: any = 'DEFAULT';

  /* 下一活动无参与者 */
  outNext: any = 'DEFAULT';

  /* //////// */
  showModal: boolean = false;

  showExportRule: boolean = false;

  /* 出口规则类型 */
  exportRuleType:string = '';

  // 同意出口文本
  approveExitText:string = '';

  // 否决出口文本
  disapproveExitText:string = '';

   get childSheetUserList() {
    const UserData:any = [];
    const triggerMapping = (this as any).curActivityProps.commonSettings.triggerMappingObj;
    const childSheetCode = triggerMapping ? triggerMapping.code : '';

    const childSheet = this.WorkflowDataItem.filter((item: Apps.Datamodel.ChildeDataItem) => `${item.propertyType}` === '8' && item.published && item.code === childSheetCode);
    childSheet.forEach((item: any) => {
      if (item.subSchema && item.subSchema.properties) {
        item.subSchema.properties.forEach((subItem: any) => {
          if (`${subItem.propertyType}` === '5' && subItem.published) {
            UserData.push({
              label: `${item.name}.${subItem.name}`,
              value: `{${item.code}.${subItem.code}}`,
              code: `${item.code}.${subItem.code}`
            });
          }
        });
      }
    });
    return UserData;
  }

  get participantType() {
    if (!this.curActivityProps) return;
    return this.curActivityProps.participant.participantType;
  }

  get participantData() {
    if (!this.curActivityProps) return;
    if (this.curActivityProps.participant.participant && /^\[.*\]$/.test(this.curActivityProps.participant.participant)) {
      const data = JSON.parse(this.curActivityProps.participant.participant);
      let str = '';
      if (Array.isArray(data)) {
        data.forEach((d:any) => {
          str += `${d.name};`;
        });
      }
      return str;
    }



    const triggerMapping = (this as any).curActivityProps.commonSettings.triggerMappingObj;
    const triggerMappingData = triggerMapping || { mainTable: 0, code: 'main' };
    const reg:RegExp = /^\{(.+?)\}$/;
    const participant:string = this.curActivityProps.participant.participant as string;
    // 子流程触发对象为子表时，参与者弹窗为子流程表达式弹窗
    if (triggerMappingData.mainTable === 1 && reg.test(participant)) {
      const item:any = this.childSheetUserList.find((d:any) => d.value === participant);
      return `${item.label}${participant}`;
    }

    return this.curActivityProps.participant.participant;
  }

  beforeMount() {
    this.setCheckboxValue();
    this.setExportRuleText();
  }

  setParticipant(payload: any) {
    // console.log('设置参与者函数：', payload);
    /* 赋值到store */
    this.setPropValue({
      key: 'participant.participant',
      value: payload.formula,
    });
    this.setPropValue({
      key: 'participant.popupType',
      value: payload.popupType,
    });
    this.showModal = false;
  }

  setCheckboxValue() {
    if (!this.curActivityProps || !this.curActivityProps.participant) return;
    if (this.curActivityProps.participant.originator === 'APPROVE') {
      this.isCreated = true;
    } else {
      this.isCreated = false;
    }
    if (this.curActivityProps.participant.perviousParticipate === 'APPROVE') {
      this.preParticipant = true;
    } else {
      this.preParticipant = false;
    }
    if (this.curActivityProps.participant.participated === 'APPROVE') {
      this.joinedFlow = true;
    } else {
      this.joinedFlow = false;
    }
  }

  // checkbox的change事件
  checkboxChange(type:string) {
    if (type === 'isCreated') { // 是发起人
      const value = this.isCreated ? 'APPROVE' : 'DEFAULT';
      this.setPropValue({
        key: 'participant.originator',
        value,
      });
    } else if (type === 'preParticipant') { // 前一活动参与
      const value = this.preParticipant ? 'APPROVE' : 'DEFAULT';
      this.setPropValue({
        key: 'participant.perviousParticipate',
        value,
      });
    } else if (type === 'joinedFlow') { // 参与过流程
      const value = this.joinedFlow ? 'APPROVE' : 'DEFAULT';
      this.setPropValue({
        key: 'participant.participated',
        value,
      });
    }
  }

  /* 打开出口规则弹窗 */
  openExportRuleModel(type:string) {
    this.exportRuleType = type;
    this.showExportRule = true;
  }

  setExportRuleText() {
    if (!this.curActivityProps || !this.curActivityProps.participant) return;
    if (this.curActivityProps.participant.approveExit) {
      if ((`${this.curActivityProps.participant.approveExit}`).indexOf('%') !== -1) {
        this.approveExitText = `${this.curActivityProps.participant.approveExit}同意到下一节点`;
      } else {
        this.approveExitText = `${this.curActivityProps.participant.approveExit}人同意到下一节点`;
      }
    }
    if (this.curActivityProps.participant.disapproveExit) {
      if ((`${this.curActivityProps.participant.disapproveExit}`).indexOf('%') !== -1) {
        this.disapproveExitText = `${this.curActivityProps.participant.disapproveExit}不同意时驳回`;
      } else {
        this.disapproveExitText = `${this.curActivityProps.participant.disapproveExit}人不同意时驳回`;
      }
    }
  }

  @Watch('currentActivity')
  onActivityChange(v: string) {
    this.setCheckboxValue();
    this.setExportRuleText();
  }
}
</script>

<style lang="less" scoped>
.participant-panel {
  /deep/.ant-radio-group {
    display: flex;
    width: 100%;
    padding: 0 8px;
  }
  /deep/.ant-radio-wrapper {
    flex: 1;
  }
  .checkbox{
    margin-left: 8px;
  }
}

</style>
