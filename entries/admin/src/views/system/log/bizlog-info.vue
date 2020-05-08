<template>
  <div class="bizlog-info">
    <div class="bizlog-info__content">
      <div class="bizlog-info__card">
        <h3 class="bizlog-info__title">详细信息</h3>
        <a-row>
          <a-col class="bizlog-info__item" :span="12">
            <a-row>
              <a-col class="bizlog-info__label" :span="5">开始时间：</a-col>
              <a-col :span="18">{{ showBizInfo.startTime }}</a-col>
            </a-row>
          </a-col>
          <a-col class="bizlog-info__item" :span="12">
            <a-row>
              <a-col class="bizlog-info__label" :span="5">结束时间：</a-col>
              <a-col :span="18">{{ showBizInfo.endTime }}</a-col>
            </a-row>
          </a-col>
          <a-col class="bizlog-info__item" :span="12">
            <a-row>
              <a-col class="bizlog-info__label" :span="5">服务编码：</a-col>
              <a-col :span="18">{{ showBizInfo.code }}</a-col>
            </a-row>
          </a-col>
          <a-col class="bizlog-info__item" :span="12">
            <a-row>
              <a-col class="bizlog-info__label" :span="5">方法名称：</a-col>
              <a-col :span="18">{{ showBizInfo.methodName }}</a-col>
            </a-row>
          </a-col>
          <a-col class="bizlog-info__item" :span="12">
            <a-row>
              <a-col class="bizlog-info__label" :span="5">耗时(ms)：</a-col>
              <a-col :span="18">{{ showBizInfo.usedTime }}</a-col>
            </a-row>
          </a-col>
          <a-col class="bizlog-info__item" :span="12">
            <a-row>
              <a-col class="bizlog-info__label" :span="5">调用对象：</a-col>
              <a-col :span="18">{{ showBizInfo.callObject || '- -' }}</a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>
      <div class="bizlog-info__card">
        <h3 class="bizlog-info__title">输入参数</h3>
        <a-row
          class="bizlog-info__item"
          type="flex"
          justify="start"
        >
          <a-col class="bizlog-info__label" :span="4">参数：</a-col>
          <a-col :span="20">{{ showBizInfo.params }}</a-col>
        </a-row>
      </div>
      <div class="bizlog-info__card">
        <h3 class="bizlog-info__title">返回值</h3>
        <a-row
          class="bizlog-info__item"
          type="flex"
          justify="start"
        >
          <a-col class="bizlog-info__label" :span="4">返回值：</a-col>
          <a-col :span="20">{{ showBizInfo.result }}</a-col>
        </a-row>
      </div>
    </div>
    <div class="bizlog-info__footer">
      <a-button @click="$emit('close')">关闭</a-button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import systemApi from '@/apis/system/system-manager.api';

@Component({
  name: 'bizlog-details'
  })
export default class BizlogDetails extends Vue {
  @Prop() bizInfo!: any;

  showBizInfo: any = {};

  argument: string = '<BizStructure> <Item> <ItemName>days</ItemName> <ItemValue> <double>500</double> </ItemValue> </Item> </BizStructure>';

  returnVal: string = '<BizStructure> <Item> <ItemName>shenpi</ItemName> <ItemValue> <ArrayOfString xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"> <string>e6a4bed8-05bf-4748-8564-f39433db3915</string> </ArrayOfString> </ItemValue> </Item> </BizStructure>';
  
  mounted() {
    this.init(this.bizInfo);
  }

  init(biz: any) {
    this.showBizInfo = {
      ...biz
    }
  }

  @Watch('bizInfo')
  onBizInfoChange(val:any) {
    if (val.id) {
      this.init(val);
    }
  }
}
</script>
<style lang="less" scoped>
.bizlog-info {
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
    word-break: break-all;
  }
  &__label {
    width: 74px;
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
