<template>
  <a-modal
    title="上传数量"
    :visible="true"
    width="500px"
    @cancel="closeModal"
    @ok="backData"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Save')"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="verify-item">
      <div class="label">上传数量</div>
      <div class="content">
        <a-radio-group v-model="updateType">
          <a-radio :value="1" style="width: 120px">单张</a-radio>
          <a-radio :value="2">多张</a-radio>
        </a-radio-group>
      </div>
    </div>
    <div
      class="verify-item"
      style="margin-top: 10px;margin-bottom: 10px;"
      v-show="isMultiple">
      <div class="label">最小数量</div>
      <div class="content">
        <a-input-number
          style="width:100%"
          v-model="min"
          placeholder="请输入"/>
      </div>
    </div>
    <div class="verify-item" v-show="isMultiple">
      <div class="label">最大数量</div>
      <div class="content">
        <a-input-number
          style="width:100%"
          v-model="max"
          placeholder="请输入"/>
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from "vue-property-decorator";
import {message} from 'h3-antd-vue'
@Component({
  name: 'UpdateImgNum'
})
export default class UpdateImgNum extends Vue {
  @Prop()
  modalData!: any
  updateType: 1|2 = 1 // 上传数量方式 1/单张 2/多张
  min: number|'' = '' // 最少数量
  max: number|'' = '' // 最大数量
  // 是否是 上传多张模式
  get isMultiple () {
    return this.updateType === 2
  }
  backData() {
    let value = `${this.updateType=== 1 ? 'unique':'batch'}`
    if (this.updateType === 2) {
      if (this.min) {
        if (!/^[1-9]\d*$/.test(''+this.min)) {
          message.error('最小值不合法!')
          return
        }
        value = `${value}_min:${this.min}`
      }
      if (this.max) {
        if (!/^[1-9]\d*$/.test(''+this.max)) {
          message.error('最大值不合法!')
          return
        }
        value = `${value}_max:${this.max}`
      }
      if (this.min && this.max && this.min > this.max) {
        message.error('最大值必须大于最小值!')
        return
      }
    }
    this.$emit("backData", {value});
  }
  closeModal() {
    this.$emit("closeModal");
  }
  created() {
    // value unique/单张 batch/多张
    let arr = this.modalData.data.value.split('_')
    let type = arr.shift()
    if (type === 'batch') {
      this.updateType = 2
    }
    if (arr.length) {
      for (let item of arr) {
        let [key, val] = item.split(':')
        switch(key) {
          case 'min':
            this.min = +val;
            break;
          case 'max':
            this.max = +val;
            break;
        }
      }
    }
  }
}
</script>
<style lang="less">
  .verify-item {
  display: flex;
  width: 100%;
  height: 32px;
  align-items: center;
  .label {
    width: 100px;
    flex-shrink: 0;
    margin-right: 10px;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
  }
  .content {
    display: flex;
    flex: 1;
  }
}
</style>