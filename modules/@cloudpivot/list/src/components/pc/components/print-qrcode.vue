<template>
  <a-modal
    v-model="showModal"
    :title="$t('cloudpivot.list.pc.printQrcode')"
    :width="618"
    wrapClassName="print-qrcode"
    :maskClosable="false"
    @cancel="closeModel"
  >
    <div class="print-content">
      <div class="total-title">
        <i class="icon aufontAll h-icon-all-info-cirlce"></i>{{ $t('cloudpivot.list.pc.totalTip', { total: checkedLength }) }}
      </div>
      <div class="print-left">
        <div class="print-group">
          <div class="print-title">{{ $t('cloudpivot.list.pc.chooseTagSize') }}</div>
          <span>{{ $t('cloudpivot.list.pc.width') }}</span>
          <a-input
            class="input-search"
            type="number"
            v-model="width"
            @change="onWidthChange"
          >
            <span
              class="suffix-icon"
              slot="suffix"
            >mm</span>
          </a-input>
          <span>{{ $t('cloudpivot.list.pc.height') }}</span>
          <a-input
            class="input-search"
            type="number"
            v-model="height"
            @change="onHeightChange"
          >
            <span
              class="suffix-icon"
              slot="suffix"
            >mm</span>
          </a-input>
        </div>
        <div class="print-group">
          <div class="print-title">{{ $t('cloudpivot.list.pc.qrcodeText') }}</div>
          <a-select
            class="print-select print-text"
            mode="tags"
            :placeholder="$t('cloudpivot.list.pc.pleaseSelect')"
            v-model="qrcodeText"
          >
            <a-select-opt-group>
              <span slot="label" class="select-title">{{ $t('cloudpivot.list.pc.bizDataItem') }}</span>
              <a-select-option
                v-for="i in bizQrcodeTextList"
                :value="i.code"
                :key="i.code"
              >{{ i.name }}</a-select-option>
            </a-select-opt-group>
            <a-select-opt-group>
              <span slot="label" class="select-title">{{ $t('cloudpivot.list.pc.sysDataItem') }}</span>
              <a-select-option
                v-for="i in defaultQrcodeTextList"
                :value="i.code"
                :key="i.code"
              >{{ i.name }}</a-select-option>
            </a-select-opt-group>
          </a-select>
        </div>
        <div class="print-group last">
          <div class="print-title">{{ $t('cloudpivot.list.pc.textNumber') }}</div>
          <a-select
            class="print-select"
            :placeholder="$t('cloudpivot.list.pc.pleaseSelect')"
            v-model="textNumber"
          >
            <a-select-option
              v-for="(text, index) in textNumberList"
              :value="text.value"
              :key="index"
            >{{ text.name }}</a-select-option>
          </a-select>
          <p class="print-tip">{{ $t('cloudpivot.list.pc.mostShowOne') }}</p>
        </div>
      </div>
      <div class="print-right">
        <div class="qrcode-title">{{ $t('cloudpivot.list.pc.example') }}</div>
        <div class="qrcode-box">
          <i class="icon aufontAll h-icon-all-qrcode-o"></i>
          <p>{{ $t('cloudpivot.list.pc.qrcodeTextExample') }}</p>
        </div>
      </div>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="closeModel">{{ $t('cloudpivot.list.pc.Cancel') }}</a-button>
      <a-button 
        key="print" 
        type="primary" 
        @click="print"
      >
        {{ $t('cloudpivot.list.pc.print') }}
      </a-button>
    </template>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, namespace
} from 'vuex-class';
import {
  Modal, Button, Select, Input,
} from 'h3-antd-vue';

// import { getMmFromPx } from '@cloudpivot/common/src/utils/utils';
import common from '@cloudpivot/common';

const { getMmFromPx } = common.utils.BusinessFunctions;

const WorkflowCenterModule = namespace('WorkflowCenter/WorkflowCenter');

@Component({
  name: 'print-qrcode',
  components: {
    AModal: Modal,
    AButton: Button,
    ASelect: Select,
    ASelectOption: Select.Option,
    ASelectOptGroup: Select.OptGroup,
    AInput: Input,
  }
})

export default class PrintQrcode extends Vue {
  @WorkflowCenterModule.State('dataItemList') dataItemList: any;

  @Prop() value!: boolean;

  @Prop() checkedLength!: number;

  get bizQrcodeTextList() {
    return this.dataItemList.filter((d:any) => !d.defaultProperty && this.dataItemTypeArr.includes(d.propertyType));
  }

  get defaultQrcodeTextList() {
    return this.dataItemList.filter((d:any) => d.defaultProperty && this.dataItemTypeArr.includes(d.propertyType));
  }

  width:number = 60;

  height:number = 60;

  showModal:boolean = false; // 弹窗显隐

  dataItemTypeArr:any = [0, 3, 9];

  textNumber:any = 12;

  maxNumber:number = 42;

  qrcodeText:any = [];

  textNumberList:any = [{
    name: '初号',
    value: 42
  }, {
    name: '小初',
    value: 36
  }, {
    name: '一号',
    value: 26
  }, {
    name: '小一',
    value: 24
  }, {
    name: '二号',
    value: 22
  }, {
    name: '小二',
    value: 18
  }, {
    name: '三号',
    value: 16
  }, {
    name: '小三',
    value: 15
  }, {
    name: '四号',
    value: 14
  }, {
    name: '小四',
    value: 12
  }, {
    name: '五号',
    value: 10.5
  }, {
    name: '小五',
    value: 9
  }, {
    name: '六号',
    value: 7.5
  }, {
    name: '小六',
    value: 6.5
  }, {
    name: '七号',
    value: 5.5
  }, {
    name: '八号',
    value: 5
  }];

  /* 
  * 便签宽度变化事件
  */
  onWidthChange() {
    if (Number(this.width) < 0) {
      this.width = 0;
    }
  }

  /* 
  * 便签高度变化事件
  */
  onHeightChange() {
    if (Number(this.height) < 0) {
      this.height = 0;
      return;
    }
    // 根据文字高度计算默认字体大小
    const textHeight:number = getMmFromPx(Number(this.height)) * 0.1 / 1.5;
    // 文字默认最大高度
    const maxHeight:number = getMmFromPx(Number(this.height)) * 0.5 / 1.5;
    let min:number = Number.POSITIVE_INFINITY;
    let defaultNumber:number = 0;
    let once:boolean = false;
    this.textNumberList.forEach((text:any) => {
      const result = Math.abs(text.value - textHeight);
      if (result < min) {
        min = result;
        defaultNumber = text.value;
      }
      if (text.value < maxHeight && !once) {
        once = true;
        this.maxNumber = text.value;
      }
    });
    this.textNumber = defaultNumber;
  }

  /* 
  * 二维码底部文字处理
  */
  qrcodeTextData() {
    const textArr = this.qrcodeText.filter((d:any) => d !== '');
    const dataItemArr = this.dataItemList.filter((d:any) => this.dataItemTypeArr.includes(d.propertyType));
    
    let codeArr = textArr.map((text:any) => {
      const index = this.dataItemList.findIndex((item:any) => item.code === text);
      let isDataItem = 0;
      if (index !== -1) {
        isDataItem = 1;
      }
      return {
        isDataItem,
        code: text
      };
    });
    return codeArr;
  }

  /* 
  * 打印预览
  */
  print() {
    let number = this.textNumber;
    if (this.textNumber > this.maxNumber) {
      number = this.maxNumber;
    }
    const qrcodeData = {
      width: getMmFromPx(Number(this.width)),
      height: getMmFromPx(Number(this.height)),
      fontSize: number,
      textData: this.qrcodeTextData(),
    };
    this.$emit('createPrintQrCodeData', qrcodeData);  
  }

  closeModel() {
    this.resetData();
    this.$emit('input', false);
  }

  /* 
  * 重置数据
  */
  resetData() {
    this.width = 60;
    this.height = 60;
    this.textNumber = 12;
    this.maxNumber = 42;
    this.qrcodeText = [];
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showModal = v;
  }
}
</script>
<style lang="less" scoped>
.print-qrcode{
  .print-content{
    overflow: hidden;
    .total-title{
      color: rgba(0,0,0,0.65);
      font-size: 14px;
      i{
        color: #2970FF;
        margin-right: 8px;
        vertical-align: middle;
      }
    }
    .print-left{
      float: left;
      margin-top: 16px;
      .print-group{
        margin-bottom: 24px;
        .print-title{
          margin-bottom: 8px;
        }
        .input-search{
          width: 100px;
          margin: 0 16px 0 8px;
          /deep/.ant-input{
            padding-right: 37px;
          }
        }
        .suffix-icon{
          color: rgba(0,0,0,0.45);
        }
        .print-select{
          width: 260px;
        }
        .print-text{
          /deep/.ant-select-selection--multiple{
            max-height: 86px;
            overflow: auto;
          }
        }
        .print-tip{
          color: rgba(0,0,0,0.45);
          font-size: 12px;
        }
      }
      .last{
        margin-bottom: 0;
      }
    }
    .print-right{
      float: right;
      width: 200px;
      text-align: center;
      margin-right: 28px;
      margin-top: 11px;
      .qrcode-title{
        font-size: 12px;
        color: rgba(0,0,0,0.85);
      }
      .qrcode-box{
        width: 100%;
        height: 200px;
        margin-top: 4px;
        padding: 16px 30px;
        background: #F0F7FF;
        border-radius: 4px;
        i{
          font-size: 130px;
          line-height: 1;
        }
        p{
          margin-top: 8px;
          color: rgba(0,0,0,0.85);
        }
      }
    }
  }
}
</style>
<style lang="less">
.print-qrcode {
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"]{
    -moz-appearance: textfield;
  }
}
</style>
