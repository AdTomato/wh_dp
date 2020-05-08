<template>
  <a-drawer
    :title="eventObj.eventTitle"
    :closable="true"
    :mask="true"
    :width="850"
    wrapClassName="event-drawer"
    :visible="isShow"
    @close="onClose"
  >
    <div class="event-box">
      <a-form>
        <!-- 钉钉通知 -->
        <div class="dd-box">
          <p class="title">钉钉消息通知</p>
          <div class="event-content">
            <a-form-item
              label="接收方"
              :labelCol="{ span: 2 }"
              :wrapperCol="{ span: 10 }"
              :colon="false"
            >
              <a-input :value="receiver" @click="showModal = true"></a-input>
            </a-form-item>

            <a-form-item
              label="消息内容"
              :labelCol="{ span: 2 }"
              :wrapperCol="{ span: 22 }"
              :colon="false"
            >
              <a-select
                class="input-select"
                mode="tags"
                :placeholder="$t('languages.PlaceHolder.Select')"
                v-model="eventData.content"
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
              <!-- <a-textarea v-model="eventData.content" rows="5"></a-textarea> -->
            </a-form-item>
          </div>
        </div>

        <!-- 设置数据 -->
        <div class="dd-box">
          <p class="title">设置数据</p>
          <div class="event-content">
            <a-table :dataSource="eventData.dataDisposals" :pagination="false">
              <!-- 数据项 -->
              <a-table-column
                key="property"
                dataIndex="property"
              >
                <span
                  slot="title"
                  class="resize resize-first"
                >数据项</span>
                <template slot-scope="text, record">
                  <a-select
                    class="p-w-section"
                    v-model="record.property"
                    @change="onDataItemChange($event, record)"
                  >
                    <a-select-option
                      v-for="(d, i) in record.list"
                      :key="i"
                      :value="d.code"
                    >{{ `${d.name}[${d.code}]` }}</a-select-option>
                  </a-select>
                </template>
              </a-table-column>

              <!-- 操作方式 -->
              <a-table-column
                key="disposalType"
                dataIndex="disposalType"
              >
                <span
                  slot="title"
                  class="resize"
                >操作方式</span>
                <template slot-scope="operationWay">
                  等于
                </template>
              </a-table-column>

              <!-- 值 -->
              <a-table-column
                key="value"
                dataIndex="value"
              >
                <span
                  slot="title"
                  class="resize"
                >值</span>

                <template slot-scope="value, record">
                  <a-tooltip :visible="!!record.errorMsg">
                    <template slot="title">
                      <span>{{ record.errorMsg }}</span>
                    </template>
                    <div :class="!!record.errorMsg && 'has-error'" class="value">
                      <a-input
                        v-model="record.value"
                        @change="validate(record,$event)"
                      ></a-input>
                    </div>
                  </a-tooltip>
                </template>
              </a-table-column>

              <a-table-column
                key="operationIndex"
                dataIndex="operationIndex"
              >
                <span
                  slot="title"
                  class="resize"
                >操作</span>
                <template slot-scope="operationIndex, record">
                  <i @click="deleteItem(record)" class="icon aufontAll h-icon-all-delete-o"></i>
                </template>
              </a-table-column>
            </a-table>
            <div
              class="add-item"
              @click="addItem"
              ref="addButton"
            ><i class="icon aufontAll h-icon-all-plus-o"></i> 新增数据</div>
          </div>
        </div>

        <!-- 触发动作 -->
        <div class="dd-box">
          <p class="title">触发动作</p>
          <div class="event-content last">
            <div class="check-box inner-padding" v-if="eventObj.eventCode === 'endActivity'">
              <a-checkbox
                v-model="eventData.cancelParllelActivity"
                class="checkbox"
              ></a-checkbox><span class="left">通过时取消并行活动</span>
              <a-checkbox
                v-model="eventData.rejectCancelParllelActivity"
                class="checkbox"
              ></a-checkbox><span>驳回时取消并行活动</span>
            </div>
            <div class="business-box">
              <a-form-item
                label="执行业务方法"
                :labelCol="{ span: 4 }"
                :wrapperCol="{ span: 21 }"
                :colon="false"
              >
                <a-select
                  mode="multiple"
                  placeholder="请选择"
                  class="task-select"
                  v-model="eventData.bizActions"
                >
                  <a-select-option
                    v-for="(business, index) in bizMethodList"
                    :value="business.code"
                    :key="index"
                  >{{ business.name }}</a-select-option>
                </a-select>
              </a-form-item>
            </div>
          </div>
        </div>

        <div class="footer">
          <a-button type="primary" @click="saveData">保存</a-button>
        </div>
      </a-form>
    </div>
    <!-- 参与者弹窗 -->
    <participant-modal
      v-model="showModal"
      :data="eventData.receiver"
      :popupType="eventData.popupType"
      @close="showModal = false"
      @submit="setReceiver"
    />
  </a-drawer>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import Bus from '@/utils/bus';
import participantModal from './participant/index.vue';

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'EventHandler',
  components: {
    participantModal
  }
})
export default class EventHandler extends Vue {
  @WorkflowModule.State('curActivityProps') curActivityProps: any;

  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem:any;

  @WorkflowModule.State('workflowData') workflowData:any;

  @WorkflowModule.State('bizMethodList') bizMethodList:any;

  @WorkflowModule.Mutation('setPropValue') setPropValue: any;

  @WorkflowModule.Mutation('setWorkflowEventHandler') setWorkflowEventHandler: any;

  @WorkflowModule.State('WorkflowDataItem_origin') WorkflowDataItemOrigin: any;

  @Prop() value !: any;

  @Prop() eventObj !: any;

  @Prop() type !: any;

  // 参与者弹窗类型
  @Prop() popupType?: string;


  get defaultSummaryList() {
    return this.WorkflowDataItemOrigin.filter((data: any) => data.defaultProperty);
  }

  get bizSummaryList() {
    return this.WorkflowDataItemOrigin.filter((data: any) => !data.defaultProperty);
  }

  get receiver() {
    if (!this.eventData) return;
    if (this.eventData.receiver && /^\[.*\]$/.test(this.eventData.receiver)) {
      const data = JSON.parse(this.eventData.receiver);
      let str = '';
      if (Array.isArray(data)) {
        data.forEach((d:any) => {
          str += `${d.name};`;
        });
      }
      return str;
    }
    return this.eventData.receiver;
  }

  // 显示控制
  isShow:boolean = false;

  // 事件抽屉数据
  eventData:any = {
    bizActions: [],
    receiver: '',
  };

  // 业务模型数据项列表
  dataItem:any = [];

  // 已选的数据项列表
  // selectedItem:any = [];
  // 展示参与者弹窗
  showModal:boolean = false;

  index:number = -1;

  // 获取当前下标
  getOperationIndex() {
    this.index += 1;
    return this.index;
  }

  mounted() {
    this.dataMounted();
    // 处理流程事件加载不到数据项问题，请求完成再执行设置
    if (this.type === 'workflow' && !this.WorkflowDataItem.length) {
      Bus.$on('initWorkflowDataItem', this.setWorkflowDataItem);
    } else {
      this.setWorkflowDataItem();
    }
  }

  // 设置流程数据项
  setWorkflowDataItem() {
    if (this.WorkflowDataItem.length) {
      const array = this.WorkflowDataItem.filter((item:any) => (!item.defaultProperty));
      this.dataItem = array.filter((item:any) => (item.propertyType === 0 || item.propertyType === 2));
    }
  }

  // 根据数据初始化视图
  dataMounted() {
    if (this.type === 'workflow') {
      if (this.eventObj.eventCode) {
        const jsonStr = this.workflowData[this.eventObj.eventCode];
        if (jsonStr) {
          this.eventData = JSON.parse(JSON.stringify(this.workflowData[this.eventObj.eventCode]));
        } else {
          this.eventData = {
            bizActions: [],
            dataDisposals: [],
            receiver: '',
          };
        }
        if (!this.eventData.receiver) {
          this.eventData.receiver = '';
        }
      }
    } else if (Object.keys(this.curActivityProps.acticityEvent).length) {
      const acticityEventArray = Object.entries(this.curActivityProps.acticityEvent);
      acticityEventArray.forEach((a: any) => {
        if (!a && !a[0] && !a[1]) {
          return;
        }
        const [key, value] = a;
        if (key === this.eventObj.eventCode) {
          this.eventData = JSON.parse(JSON.stringify(value));
        }
      });
    }
    if (!this.eventData.receiver) {
      this.eventData.receiver = '';
    }
    if (!this.eventData.bizActions) {
      this.eventData.bizActions = [];
    }
    this.eventData.bizActions = this.eventData.bizActions.filter((biz:any) => biz);
    
    // 兼容老数据
    this.compatibleContent();

    if (!this.eventData.dataDisposals) {
      return;
    }
    this.eventData.dataDisposals.forEach((td:any, index:number) => {
      td.list = [...this.dataItem];
      const _item = this.dataItem.find((d:any) => d.code === td.property);
      td.type = _item.propertyType;
    });
  }

  /*
  * eventData.content 兼容
  */
  compatibleContent(){
    const _content:any = this.eventData.content;
    let arr:any = [];
    if (Array.isArray(_content) && _content.length > 0) {
      return;
    } 
    if (_content) {
      try { // 是json字符串
        const json:any = JSON.parse(_content);
        json.forEach((item:any) => {
          if (item.code) {
            arr.push(item.code);
          }
        })
        this.eventData.content = arr;
      } catch{ // 不是json字符串
        if (Array.isArray(_content)) {
          _content.forEach((item:any) => {
            if (item.code) {
              arr.push(item.code);
            } 
          })
          this.eventData.content = arr;
        } else {
          this.eventData.content = [_content];
        }
      }
    } 
    else { // 防止select组件报错
      if (this.type !== 'workflow') {
        this.eventData.content = [];
      }
    }
  }

  // 参与者弹窗submit事件
  setReceiver(payload: any) {
    this.eventData.receiver = payload.formula;
    this.eventData.popupType = payload.popupType;
    this.showModal = false;
  }

  // 设置数据项
  addItem() {
    if (!this.eventData.dataDisposals) {
      this.eventData.dataDisposals = [];
    }
    const options: any = this.filterDataItem();
    if (Array.isArray(options) && options.length) {
      this.eventData.dataDisposals.push({
        property: '',
        disposalType: 'SET',
        value: '',
        index: this.getOperationIndex(),
        list: options,
      });
      const dom: any = this.$refs.addButton;
      dom.scrollIntoView();
    } else {
      this.$message.warning('暂无可设置数据项');
    }
  }

  // 数据项改变事件
  onDataItemChange(code:any, item:any) {
    const _item = this.dataItem.find((d:any) => d.code === code);
    item.type = _item.propertyType;
  }

  // 数据项去重
  filterDataItem() {
    if (!this.eventData.dataDisposals) {
      return;
    }
    const selectedItem:Array<string> = [];
    this.eventData.dataDisposals.forEach((td:any) => {
      selectedItem.push(td.property);
    });
    const optionList = this.dataItem.filter((wd:any) => !selectedItem.includes(wd.code));
    if (!optionList) {
      return;
    }
    return optionList;
  }

  // 校验输入框内容
  validate(item:any, evt?: Event) {
    let err = '';
    if (!item.value) {
      err = '请输入内容';
    }
    if (
      item.type === 2
      && !/^\d+(.\d{1,3})?$/.test(item.value)) {
      err = '请输入数值（小数位最多3位）';
      setTimeout(() => {
        const matches: any = item.value.match(/\d+(.\d{0,3})?/);
        item.value = Array.isArray(matches) ? matches[0] : '';
        item.errorMsg = '';
      }, 500);
    }
    item.errorMsg = err;
  }

  // 删除数据项
  deleteItem(item:any) {
    const index = this.eventData.dataDisposals.findIndex((a:any) => a.index === item.index);
    this.eventData.dataDisposals.splice(index, 1);
    // 将删除的数据项添加回所有的list中
    const dataItemList = this.dataItem.find((wd:any) => wd.code === item.property);
    if (!dataItemList) {
      return;
    }
    this.eventData.dataDisposals.forEach((td:any) => {
      if ((dataItemList.code !== td.property) && !td.list.includes(dataItemList)) {
        td.list.push(dataItemList);
      }
    });
  }

  // 抽屉关闭事件
  onClose() {
    if (this.eventData.dataDisposals) {
      this.eventData.dataDisposals.forEach((td:any) => {
        delete td.errorMsg;
      });
    }
    this.$emit('input', false);
  }

  contentDataForamt(data:any) {
    let array:any = [];
    if (typeof data === 'string')  {
      array = JSON.parse(data)
    } else {
      array = JSON.parse(JSON.stringify(data));
    }
    
    let obj:any = {};
    const json:Array<any> = [];
    array.forEach((item:any) => {
      item = item.trim();
      if (item) {
        const isItemData:boolean = this.WorkflowDataItemOrigin.findIndex((dataItem:any) => dataItem.code === item) > -1;
        if (isItemData) {
          obj = {
            isDataItem: 1,
            code: item
          };
        } else {
          obj = {
            isDataItem: 0,
            code: item
          };
        }
      json.push(obj);
      }
    });

    return json;
  }

setContent2JsonStr(){
  const _content:any = this.eventData.content;
  // 统一将content转成json字符串
  if (_content && _content.length > 0) {
    const d:any = this.contentDataForamt(_content);
    this.eventData.content = JSON.stringify(d);
  }
}


  // 保存数据事件
  saveData() {
    // 保存前过滤消息内容中空格
    if (this.eventData.content && Array.isArray(this.eventData.content)) {
      this.eventData.content = this.eventData.content.filter((ev:any) => !/^\s+\s+$/g.test(ev));
    }

    // 当钉钉消息接收者与内容必须同时有值或同时为空
    if (this.eventData.receiver && this.eventData.content && this.eventData.content.length > 0) {
      this.setContent2JsonStr();
      this.$emit('saveEvent', { code: this.eventObj.eventCode, isSetting: true });
    } else if (this.eventData.content && this.eventData.content.length > 0) {
      this.$emit('saveEvent', { code: this.eventObj.eventCode, isSetting: false });
      this.$message.warning('接收方不可为空！');
      return;
    } else if (this.eventData.receiver) {
      this.$emit('saveEvent', { code: this.eventObj.eventCode, isSetting: false });
      this.$message.warning('钉钉消息内容不能为空！');
      return;
    }

    let save = true;
    let required = false;
    // 检验未通过或数据项值为空不执行保存
    if (Array.isArray(this.eventData.dataDisposals)) {
      this.eventData.dataDisposals.forEach((td:any) => {
        if (td.errorMsg || !td.value || !td.property) {
          save = false;
        }
        if (!td.value || !td.property) {
          required = true;
        }
      });
    }

    // 当钉钉推送、数据项、业务动作中一个区域有值事件都显示已设置
    if ((this.eventData.dataDisposals && this.eventData.dataDisposals.length && save) || (this.eventData.bizActions && this.eventData.bizActions.length) || this.eventData.cancelParllelActivity || !this.eventData.rejectCancelParllelActivity) {
      this.$emit('saveEvent', { code: this.eventObj.eventCode, isSetting: true });
    } else if (!(this.eventData.receiver && this.eventData.content)) {
      this.$emit('saveEvent', { code: this.eventObj.eventCode, isSetting: false });
    }
    if (!this.eventData.dataDisposals) {
      if (this.type === 'workflow') {
        const _p = { key: this.eventObj.eventCode, value: this.eventData };
        this.setWorkflowEventHandler(_p);
      } else {
        this.setPropValue({ key: `acticityEvent.${this.eventObj.eventCode}`, value: this.eventData });
      }
      this.onClose();
      return;
    }

    if (save) {
      this.eventData.dataDisposals.forEach((td:any) => {
        delete td.list;
        delete td.index;
        delete td.type;
        delete td.errorMsg;
      });
      if (this.type === 'workflow') {
        const _p = { key: this.eventObj.eventCode, value: this.eventData };
        this.setWorkflowEventHandler(_p);
      } else {
        this.setPropValue({ key: `acticityEvent.${this.eventObj.eventCode}`, value: this.eventData });
      }
      this.onClose();
    } else if (required) {
      this.$message.warning('数据项值不可为空！');
    }
  }

  @Watch('value')
  onValueChange(v:any) {
    this.isShow = v;
    if (this.isShow) {
      this.dataMounted();
    }
  }
}
</script>
<style lang="less" scoped>
  .event-box {
    /deep/.ant-table-tbody > tr > td {
      padding: 3px 16px;
      color: rgba(0,0,0,0.85);
    }
    /deep/.ant-table-thead > tr > th {
      padding:  8px 10px;
      font-weight: 600;
      color: rgba(0,0,0,0.65);
    }
    .title {
      font-weight: bold;
      margin-bottom: 16px;
      color: rgba(0,0,0,0.85);
    }
    .event-content {
      border-bottom: 1px solid #E8E8E8;
      padding-bottom: 24px;
      margin-bottom: 24px;
      /deep/.ant-form-item-label {
        width: 72px;
        text-align: left;
      }
      .left{
        margin-right: 32px;
      }
      .business-box{
        /deep/.ant-form-item-label {
          width: 106px;
          text-align: left;
        }
      }
      /deep/.ant-select-selection-selected-value{
        color: rgba(0,0,0,0.85);
      }
      /deep/.ant-table-empty{
        .ant-table-body{
          overflow: inherit !important;
        }
        .ant-table-placeholder{
          display: none;
        }
      }
      .p-w-section{
        width: 270px;
      }
      .value{
        width: 307px;
      }
    }
    .last{
      border-bottom: none;
    }
    .business-box {
      margin-bottom: 66px;
    }
    .icon {
      cursor: pointer;
    }
   .add-item {
      color: @primary-color;
      text-align: center;
      margin-top: 8px;
      user-select: none;
      cursor: pointer;
      margin-bottom: 20px;
    }
    .inner-padding {
      margin: 10px 0;
    }
    .footer{
      text-align: center;
      position: absolute;
      height: 50px;
      line-height: 50px;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #fff;
      border-top: 1px solid #E8E8E8;
    }
  }
  .resize {
    display: inline-block;
    height: 22px;
    width: calc(100% + 32px);
    padding: 0 16px;
    -webkit-transform: translateX(-16px);
    transform: translateX(-16px);
    border-left: 1px solid #e8e8e8;
    font-weight: 600;
  }
  .resize-first {
    border-left: none;
  }
</style>
<style lang="less">
.event-drawer{
  .ant-drawer-body{
    overflow: auto;
  }
}
</style>
