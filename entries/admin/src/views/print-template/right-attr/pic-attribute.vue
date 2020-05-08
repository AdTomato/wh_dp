<template>
  <div class="left-attr">
    <div class="left-item qr-code" v-show="itemAttrs.eleType.includes('leftQrcodePic')">
      <p>二维码（QR）</p>
      <div class="select-input">
        <a-select v-model="itemAttrs.qrCreateOrShow">
          <a-select-option value="create">显示表单新增二维码</a-select-option>
          <a-select-option value="show">显示数据查看二维码</a-select-option>
        </a-select>
      </div>
    </div>
    <div class="left-item" v-show="itemAttrs.eleType.includes('leftBarcodePic')">
      <p>条形码（code 128）</p>
      <div class="select-input">
        <a-select v-model="itemAttrs.barCodeKey">
          <a-select-option value="formColumn">根据表单字段生成条形码</a-select-option>
          <a-select-option value="otherContent">根据其他内容生成条形码</a-select-option>
        </a-select>
      </div>
      <div class="select-input">
        <a-select
          placeholder="请选择"
          v-model="itemAttrs.barCodeValue"
          v-if="itemAttrs.barCodeKey.includes('formColumn')"
        >
          <a-select-option
            v-for="item in barcodeItems"
            :key="item.id"
            :value="`${item.code}`"
          >{{ item.name }}_{{ item.owner }}</a-select-option>
        </a-select>
        <a-input
          placeholder="请输入"
          v-model="itemAttrs.barCodeValue"
          v-if="itemAttrs.barCodeKey.includes('otherContent')"
          @keyup="judgeInput"
        />
      </div>
    </div>
    <div class="left-item" v-show="itemAttrs.eleType.includes('topPic')">
      <p>图片</p>
      <div class="pic-div">
        <img :src="itemAttrs.picUrl" alt="">
      </div>
      <div class="pic-btn">
        <a-button
          type="primary"
          block
        >上传图片</a-button>
        <input type="file" name="file" class="upload_file" @change="upLoadFile($event)" />
      </div>
    </div>
    <Xywh/>
  </div>
</template>

<script lang="ts">
// eslint-disable-next-line
import { Component, Vue } from 'vue-property-decorator';
// eslint-disable-next-line
import { namespace } from 'vuex-class';
// eslint-disable-next-line
import { inputReg } from '@/utils/print-util';
import Xywh from './xywh.vue';

const PrintVuex = namespace('Print/Print');
@Component({
  name: 'pic-attribute',
  components: {
    Xywh
  }
})
export default class LeftAttribute extends Vue {
  @PrintVuex.State('itemAttrs') itemAttrs!: any;

  @PrintVuex.State('bizSysData') bizSysData!: any[];

  get barcodeItems(){
    if(this.bizSysData){
      return this.bizSysData.filter(x => x.code === 'sequenceNo' || x.propertyType === 2);
    }
    return [];
  }

  upLoadFile(e: File) {
    const _this = this;
    // @ts-ignore
    const file = e.target.files[0];
    if (file.size > 2101440) {
      this.$message.warning('上传的图片大于2M！');
      return;
    }
    if(!/image\/\w+/.test(file.type)) {
      this.$message.warning('请上传图片文件！');
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e: any) => {
      // 读取到的图片base64 数据编码 e.target.result
      // @ts-ignore
      _this.itemAttrs.picUrl = e.target.result;
    }
  }

  judgeInput() {
    // @ts-ignore
    const isOk = inputReg(this.itemAttrs.barCodeValue);
    // @ts-ignore
    if (this.itemAttrs.barCodeValue.length > 80) {
      // @ts-ignore
      this.itemAttrs.barCodeValue = this.itemAttrs.barCodeValue.substr(0, 80);
      this.$message.warning('长度不能超过80个字符！');
    }
    if (!isOk) {
      this.$message.warning('请输入字母数字下划线组合格式的数据！');
      // @ts-ignore
      this.itemAttrs.barCodeValue = '';
    }
  }
}
</script>

<style lang="less" scoped>
  .left-attr {
    text-align: left;
    margin-top: -10px;
    .left-item {
      padding-bottom: 15px;
      border-bottom: 1px solid #ddd;
      p {
        font-size: 14px;
        font-weight: bold;
        color: rgba(0,0,0,0.85);
      }
      .input-select, .xywh-position, .select-input, .pic-div, .pic-btn {
        margin: 10px 0 0 0;
        .ant-select {
          width: 100%;
        }
      }
      .xywh-position {
        display: flex;
        .ant-input-group-wrapper {
          margin-right: 10px;
        }
        .ant-input-group-wrapper:last-child {
          margin-right: 0;
        }
      }
      .pic-div {
        height: 170px;
        border-radius: 4px;
        background: url('../../../assets/images/transparent_pic.png') no-repeat;
        background-size: cover;
        text-align: center;
        line-height: 170px;
        overflow: hidden;
      }
      .pic-btn {
        .upload_file {
          position: relative;
          z-index: 23;
          top: -30px;
          left: 0;
          width: 100%;
          height: 30px;
          opacity: 0;
          cursor: pointer;
        }
        margin-bottom: -30px;
      }
    }
    .qr-code {
      height: 80px!important;
      margin-top: 10px!important;
    }
    .left-item:nth-child(1) {
      margin-top: 0;
    }
    .left-item:last-child {
      border-bottom: none;
    }
  }
</style>
