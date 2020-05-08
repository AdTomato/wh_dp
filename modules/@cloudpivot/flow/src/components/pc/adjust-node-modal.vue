<template>
  <div class="adjust-node-modal">
    <div class="row">
      <label>{{ i18nData.chooseAdjustType }}</label>
      <a-radio-group 
        class="ct" 
        @change="change" 
        v-model="value"
      >
        <a-radio :value="1">{{ i18nData.finishWorkflow }}</a-radio>
        <a-radio :value="2">{{ i18nData.adjustOriginator }}</a-radio>
        <a-radio :value="3">{{ i18nData.cancelAllTask }}</a-radio>
        <a-radio :value="4">{{ i18nData.activateNodes }}</a-radio>
      </a-radio-group>
    </div>
    <div v-if="this.value === 3" class="row">
      <div class="ct">
        <span class="tip">{{ i18nData.adjustNodeTips }}</span>
      </div>
    </div>
    <div class="row" v-show="selectShow">
      <label>{{ i18nData.chooseNode }}</label>
      <div class="ct">
        <a-select
          :placeholder="i18nData.clickChoose"
          @change="handleChange"
          :notFoundContent="i18nData.null"
          style="width: 100%"
          v-model="selectValue"
          :options="selectOptions"
        ></a-select>
      </div>
    </div>
    <div v-if="this.value === 2" class="row">
      <label>{{ i18nData.chooseHandler }}</label>
      <div class="ct">
        <Selector v-model="userValue" :options="options"></Selector>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { Radio, Select } from "h3-antd-vue";
import { renderer } from "@cloudpivot/form";
import { workflowApi } from "@cloudpivot/api";

@Component({
  name: "adjust-node-modal",
  components: {
    Selector: renderer.components.pc.StaffSelector,
    ARadio: Radio,
    ARadioGroup: Radio.Group,
    ASelect: Select
  }
})
export default class FlowTrackAdjustNodeModal extends Vue {
  @Prop() workflowInstanceId!: string;

  @Prop() i18nData!: any;

  value: number = 1;

  selectValue: any = [];

  userValue: any = [];

  selectOptions: any[] = []; // 下拉配置项

  options: any = {
    key: "test",
    selectOrg: false,
    selectUser: true,
    mulpitle: true,
    showModel: true,
    showSelect: true,
    placeholder: "点击选择"
  };

  nodes: any; // 所有节点信息

  selectShow: Boolean = false;

  async created() {
    console.log(this.i18nData);
    const res = await workflowApi.getWorkflowNodes({
      workflowInstanceId: this.workflowInstanceId
    });
    this.nodes = res.data;
  }

  /**
   * chang事件
   */
  change() {
    this.selectValue = [];
    this.userValue = [];
    this.selectShow = false;
    const tmpOptions: any[] = [];
    switch (this.value) {
      case 1:
        break;
      case 2:
      case 3:
        this.nodes.forEach((item: any) => {
          if (item.status) {
            tmpOptions.push({
              value: item.activityCode,
              label: item.activityName
            });
          }
        });
        if (tmpOptions.length > 1) {
          this.selectShow = true;
          this.selectOptions = tmpOptions;
        } else if (tmpOptions.length > 0) {
          this.selectValue = tmpOptions[0].value;
          this.handleChange();
          this.selectShow = false;
        }
        break;
      case 4:
        this.selectShow = true;
        this.nodes.forEach((node: any) => {
          tmpOptions.push({
            value: node.activityCode,
            label: node.activityName,
            disabled: node.status !== 0
          });
        });
        this.selectOptions = tmpOptions;
        break;
      default:
        break;
    }
  }

  /**
   * 处理下拉控件
   */
  handleChange() {
    this.userValue = [];
    this.nodes.find((node: any) => {
      if (node.activityCode === this.selectValue) {
        node.participantors.forEach((p:any) => p.type = 3);
        this.userValue = node.participantors;
      }
      return node.activityCode === this.selectValue;
    });
    console.log(this.userValue);
  }
}
</script>
<style lang="less">
// @import "../../../../styles/themes/default.less";
.adjust-node-modal {
  height: 270px;
  .row {
    display: flex;
    margin-bottom: @base10-padding-md;
    > label {
      flex: 0 0 84px;
      margin-right: @base4-padding-md;
    }
    .ct {
      flex: 1 1;
      .tip {
        color: @light-color-3;
        font-size: @font-size-12;
      }
      .h3-organization__label{
        max-height: 92px;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .ant-radio-wrapper {
        width: 100%;
        margin-bottom: @base4-padding-xs;
      }
      .ant-radio-wrapper:last-child {
        margin: 0;
      }
    }
  }
}
</style>
