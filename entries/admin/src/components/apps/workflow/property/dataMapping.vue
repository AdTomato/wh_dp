<template>
  <div class="data-mapping-panel">
    <property-widget
      label="映射"
    >
      <ellipsis-input
        slot="right"
        :value="mappingStr"
        @click="showMappingModal"
      />
    </property-widget>

    <mapping-modal
      v-model="isShowModal"
      @confirm="dataMapping"
    />
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';

import { DataItemType } from '@cloudpivot/form/schema';

import PropertyWidget from '../base/propertyWidget.vue';
import ellipsisInput from '../base/ellipsisInput.vue';
import MappingModal from '../modals/mapping.vue';

import * as Helper from '../helper/helper';

const WorkflowModule = namespace('Apps/Workflow');

const AppItemModule = namespace('Apps/AppItem');

@Component({
  name: 'DataMapping',
  components: {
    PropertyWidget,
    ellipsisInput,
    MappingModal
  }
})
export default class DataMapping extends Vue {
  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.State('curActivityID') curActivityID: any;

  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem: any;

  @WorkflowModule.State('WorkflowDataItem_all') WorkflowDataItem_all:any;

  @WorkflowModule.Mutation('setChildWorkflow') setChildWorkflow:any;

  @WorkflowModule.Action('getWorkflowDataItem') getWorkflowDataItem:any;

  @WorkflowModule.Action('getWorkflowDataItemNotFiltered') getWorkflowDataItemNotFiltered:any;

  @AppItemModule.Action('getWorkflowDetail') getWorkflowDetail: any;
  

  @Prop() value !: any;

  isShowModal:boolean = false;

  parentDataItem:any = '';

  childDataItem:any = '';

  mappingStr:string = '';

  // 20190604 放开附件和表单， 目前只过滤审批意见和子表
  filterArr:Array<number> = [DataItemType.ApprovalOpinion];

  init() {
    if (this.curActivityProps.commonSettings.workflowCode) {
      let _workflowCode:string = '';
      if (this.curActivityProps.commonSettings.workflowCode.indexOf('-') > -1) {
        [, _workflowCode] = this.curActivityProps.commonSettings.workflowCode.split('-');
      }
      // 通过workflowCode获取schemaCode 这样可获取到子流程数据项
      const params: Apps.Workflow.WorkflowCode = { workflowCode: _workflowCode };
      this.getWorkflowDetail(params).then(async (res: any) => {
        if (res.errcode === 0) {
          this.setChildWorkflow(res.data.schemaCode);

          // 拼接显示字符串 mappingStr
          const strArr:Array<string> = [];
          if (this.curActivityProps.workflowDataMaps && this.curActivityProps.workflowDataMaps.length > 0) {
            const maps = this.curActivityProps.workflowDataMaps;
            const scode = { schemaCode: res.data.schemaCode, hasReturn: true };
            let workflowDataitemCopy = JSON.parse(JSON.stringify(this.WorkflowDataItem_all));
            const isSubTable:boolean = this.curActivityProps.commonSettings.triggerMappingObj.mainTable === 1;
            if (isSubTable) {
              workflowDataitemCopy = Helper.releaseSubTableDataItem(workflowDataitemCopy);
            }

            const { filterArr } = this;
            workflowDataitemCopy = workflowDataitemCopy.filter((item:any) => filterArr.indexOf(item.propertyType) < 0);

            // 获取子流程数据项
            const _sCode = { schemaCode: res.data.schemaCode};
            const data = await this.getWorkflowDataItemNotFiltered(_sCode);
            if (!data || data.length === 0) return;
            // let _list = data.filter((item:any) => (!item.defaultProperty));
            let _list = data;
            // _list = Helper.releaseSubTableDataItem(_list);

            // 20190130 需求变更：过滤掉子表以及审批意见
            _list = _list.filter((item:any) => filterArr.indexOf(item.propertyType) < 0);
            maps.forEach((map:any) => {
              const pDataItems = workflowDataitemCopy.find((wd:any) => wd.code === map.parentDataName);
              const pname = pDataItems ? pDataItems.name : '';
              const pcode = pDataItems ? pDataItems.code : '';
              const sDataItems = _list.find((wd:any) => wd.code === map.childDataName);
              const sname = sDataItems ? sDataItems.name : '';
              const subcode = sDataItems ? sDataItems.code : '';
              strArr.push(`${pname}[${pcode}]->${sname}[${subcode}]`);
            });
            this.mappingStr = strArr.join('&');
          }
        } else {
          console.log(res);
        }
      });
    }
  }

  mounted() {
    this.init();
  }

  showMappingModal() {
    this.isShowModal = true;
  }

  dataMapping(str:string) {
    if (!str) return;
    this.mappingStr = str;
  }

  @Watch('value')
  onValueChange(v:any) {
    if (!v) return;
    this.isShowModal = v;
  }

  @Watch('curActivityID')
  onCurActivityIDChange(v:any) {
    this.mappingStr = '';
    this.init();
  }
}
</script>
<style lang="less" scoped>

</style>
