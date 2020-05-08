<template>
  <div class="popover-wrap">
    <a-row class="row">
      <a-col :span="leftWidth">
        <label class="title">{{ $t('languages.Apps.DataItem') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <span class="l-h">{{ `${modalData.propertyName || modalData.name}[${modalData.code}]` }}</span>
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="6">
        <label class="title">{{ $t('languages.Apps.DisplayName') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-input
          v-if="isChinese"
          maxlength="50"
          v-model="backData.name"
        />
        <a-input
          v-else
          maxlength="50"
          v-model="backData.name_i18n[$i18n.locale]"
        />
      </a-col>
    </a-row>
    <a-row class="row">
      <a-col :span="leftWidth">
        <label class="title">{{ $t('languages.Apps.DisplayFormat') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.displayFormat"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option
            v-for="(option, index) in numberType"
            :key="index"
            :value="option.type"
          >{{ $t(`languages.Apps.ListControl.${option.text}`) }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <!-- <a-row class="row">
        <a-col :span="leftWidth">
          <label class="title">列宽设置</label>
        </a-col>
        <a-col :span="rightWidth">
          <div class="width-setting">
            <div>
              <a-input class="input" v-model="backData.width"/>
            </div>
            <div>
              <a-select
                class="select"
                :placeholder="$t('languages.PlaceHolder.Select')"
                v-model="backData.unit"
              >
                <a-select-option
                  v-for="(option, index) in widthSettingType"
                  :key="index"
                  :value="option.type"
                >{{ $t(`languages.Apps.ListControl.${option.text}`) }}</a-select-option>
              </a-select>
            </div>
          </div>
        </a-col>
      </a-row> -->
    <a-row class="row">
      <a-col :span="leftWidth">
        <label class="title">{{ $t('languages.Apps.Summarys') }}</label>
      </a-col>
      <a-col :span="rightWidth">
        <a-select
          class="select"
          :placeholder="$t('languages.PlaceHolder.Select')"
          v-model="backData.sumType"
          :getPopupContainer="getPopupContainer"
        >
          <a-select-option
            v-for="(option, index) in calculationType"
            :key="index"
            :value="option.type"
          >{{ $t(`languages.Apps.ListControl.${option.text}`) }}</a-select-option>
        </a-select>
      </a-col>
    </a-row>
    <div class="btn-group btn-group-fixed clearfix">
      <a-button
        class="btn"
        type="primary"
        size="small"
        @click="close"
      >{{ $t('languages.Apps.Ok') }}</a-button>
      <a-button
        class="btn"
        size="small"
        @click="concel"
      >{{ $t('languages.Apps.Cancel') }}</a-button>
    </div>
    <div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';
import { numberType, WidthSettingType, calculationType } from '../../control-modals-map';
@Component({
  name: 'DateSetting',
  components: {
  }
})
export default class DateSetting extends Vue {
  @Prop() modalData!:any;

  // 判断当前是否是中文版本
  get isChinese() {
    return this.$i18n.locale === 'zh';
  }

  leftWidth:number = 6;

  rightWidth:number = 18;

  visible: boolean = true;

  numberType = numberType;

  widthSettingType = WidthSettingType;

  calculationType = calculationType;

  // backData = {
  //   name: '',
  //   showType: 0,
  //   width: 176,
  //   widthType: 0,
  //   calculationType: 0
  // }
  backData = {
    /*  显示格式 */
    displayFormat: '',
    name: '',
    propertyCode: '',
    propertyType: 0,
    sumType: 0,
    width: 176,
    unit: 0
  }

  created() {
    if (this.modalData.data) {
      this.backData = this.modalData.data;
    } else {
      this.backData.name = this.modalData.name;
    }
  }

  close() {
    this.backData.propertyCode = this.modalData.code;
    this.backData.propertyType = this.modalData.type;
    this.$emit('backData', this.backData);
  }

  concel() {
    this.$emit('closeModal');
  }
}
</script>
<style lang="less" scoped>
  .popover-wrap{
    padding: 0 6px;
    width: 280px;
    .row{
      margin-bottom: 16px;
      .ant-col-6{
        label{
          line-height: 32px;
          color: rgba(0, 0, 0, .65);
        }
      }
      .ant-col-18{
        .l-h{
          line-height: 32px;
        }
        .width-setting{
          &>div{
            float: left;
            &:last-child{
              float: right;
            }
          }
          .input{
            width: 97px;
          }
          .select{
            width: 97px;
          }
        }
      }
      .select{
        width: 100%;
      }
    }
    .btn-group {
      .btn{
        &:last-child{
          margin-right: 8px;
        }
        float: right;
      }
      .left{
        margin-right: 16px;
      }
    }
  };
</style>
