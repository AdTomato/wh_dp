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
import {
  Component, Vue, Prop, Watch, Emit
} from 'vue-property-decorator';
import AddBtn from './add-btn.vue';
import DeleteOrImportBtn from './delete-import-btn.vue';
import QrcodeBtn from './qrcode-btn.vue';
import EditBtn from './edit-btn.vue';

@Component({
  name: 'BtnSetting',
  components: {
    AddBtn,
    DeleteOrImportBtn,
    EditBtn,
    QrcodeBtn
  }
})
export default class BtnSetting extends Vue {
  @Prop() modalData!: any

  currentModal:string = '';

  created() {
    switch (this.modalData.actionCode) {
      case 'add':
        this.currentModal = 'AddBtn';
        break;
      case 'edit':
        this.currentModal = 'EditBtn';
        break;
      case 'qr_code':
        this.currentModal = 'QrcodeBtn';
        break;

      default:
        this.currentModal = 'DeleteOrImportBtn';
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
    return JSON.parse(JSON.stringify(this.modalData));
  }
}
</script>
<style lang="less" scoped>
.modal-wrap{
  padding-top: 12px;
  padding-bottom: 4px;
}
</style>
