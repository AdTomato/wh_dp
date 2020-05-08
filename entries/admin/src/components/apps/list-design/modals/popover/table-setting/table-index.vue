<template>
  <div class="modal-wrap">
    <component
      :is="currentModal"
      @backData="backData"
      @closeModal="closeModal"
      :modalData="modalMsg"
    ></component>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from 'vue-property-decorator';
import DateSetting from './date-setting.vue';
import TextSetting from './text-setting.vue';
import NumberSetting from './number-setting.vue';

@Component({  
  name: 'TableDesign',
  components: {
    DateSetting,
    TextSetting,
    NumberSetting
  }
})
export default class TableDesign extends Vue {
  @Prop() modalData!: any
  currentModal:string = '';
  created() {
    // debugger
    switch (this.modalData.type) {
      /** 数值型 */
      case 2:
        this.currentModal = 'NumberSetting';
        break;
      /** 日期型 */
      case 3:
        this.currentModal = 'DateSetting';
        break;
      /** 文本型 */
      default:
        this.currentModal = 'TextSetting';
        break;
    }
  }
  backData(val:any) {
    this.$emit('confirm', val);
  }
  closeModal() {
    this.$emit('cancel');
  } 
  get modalMsg() {
    return this.modalData;
  }
}
</script>
<style lang="less" scoped>
.modal-wrap{
  padding-top: 12px;
  padding-bottom: 4px;
}
</style>
