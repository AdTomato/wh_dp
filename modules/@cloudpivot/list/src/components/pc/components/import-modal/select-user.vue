<template>
  <div class="selector-user">
    <div class="selector" @click="setUser">
      <i class="icon aufontAll h-icon-all-add-user-o"></i>{{ $t('cloudpivot.list.pc.chooseUser') }}
    </div>
    <staff-selector
      v-model="selectorData"
      :options="taffSelectorOpts"
      @ok="submitUser"
      @cancel="cancel"
    ></staff-selector>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';

@Component({
  name: "select-user",
  components: {
    StaffSelector
  }
})

export default class SelectUser extends Vue {
  @Prop() value!: any;

  selectorData:any = [];

  taffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    showModel: false,
    mulpitle: true,
    showSelect: false,
    placeholder: '请选择'
  }

  /* 
  * 打开选人控件
  */
 setUser(selector:any) {
   this.taffSelectorOpts.showModel = true;
 }

  /* 
  * 选人控件确定事件
  */
 submitUser(val:any) {
   const value = val.map((v:any) => {
     return {
      excelType: v.excelType,
      id: v.id,
      type: v.type,
      name: v.name,
      imgUrl: v.imgUrl,
      departmentId: null,
      departments: null,
      parentId: null,
     }
   });
   this.$emit('input', value);
   this.taffSelectorOpts.showModel = false;
 }

  /* 
  * 选人控件取消事件
  */
  cancel() {
    this.taffSelectorOpts.showModel = false;
  }
  
  @Watch('value', { deep: true, immediate: true })
  onUserDataChange(value:any) {
    this.selectorData = value;
  }
}
</script>

<style lang="less" scoped>
.selector-user{
  .selector{
    text-align: right;
    color: @primary-color;
    cursor: pointer;
    i{
      font-size: 14px;
      margin-right: 4px;
    }
  }
}
</style>
