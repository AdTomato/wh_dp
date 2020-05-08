
<template>
  <a-modal
    v-model="visible"
    title="添加过滤条件"
    :width="700"
    :maskClosable="false"
    :keyboard="false"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    :destroyOnClose="true"
    @ok="ok"
    @cancel="onCancel"
  >
    <dataitem-condition :items="items" v-model="conditionValue"></dataitem-condition>
  </a-modal>
</template>


<script lang="ts">
import { message } from 'h3-antd-vue';
import { Component, Vue, Prop, Watch, Model } from "vue-property-decorator";

import appsApi from "@/apis/apps";

import permissionApi from "@/apis/system/permission.api";

import DataitemCondition from "@/components/shared/data-item/dataitem-condition.vue";

import { DataItemType, NumberFormatType } from "@cloudpivot/form/schema";


const forbiddenCodes = ['id','ownerDeptQueryCode','workflowInstanceId','createdDeptId'
,'ownerDeptId','modifier'];


@Component({
  name: "dataitem-condition-modal",
  components: {
    DataitemCondition
  }
})
export default class DataitemConditionModal extends Vue {
  @Prop()
  permission!: BPM.System.AppFunctionPermissionModel;

  visible = false;

  conditionValue = "" as any;

  items = [];

  @Watch("permission", {
    immediate: true
  })
  onPermissionChange() {
    if (!this.permission) {
      return;
    }

    const schemaCode = this.permission.schemaCode;
    const functionId = this.permission.id;

    if (schemaCode) {
      const closeLoader = (this.$message as any).loading();

      appsApi
        .getDataItemList({
          schemaCode
        })
        .then(res => {
          closeLoader();

          if (res.errcode === 0) {
            this.items = res.data.filter((x:any) => {
              if(forbiddenCodes.indexOf(x.code) > -1){
                return false;
              }
              // 26迭代需要处理业务选人控件
              // if(!x.defaultProperty && x.propertyType === DataItemType.StaffSelector){
              //   return false;
              // }
              
              return true;
            }).map((x: any) => ({
              code: x.code,
              name: x.name,
              type: x.propertyType,
              isSystem : x.defaultProperty
            }));
          } 
        });

      // permissionApi.listCondition(schemaCode, functionId).then(res => {
      //   if (res.errcode === 0) {
      //     if (res.data && res.data.length) {
      //       this.conditionValue = {
      //         type: this.permission.filterType,
      //         conditions: res.data
      //       };
      //     } else {
      //       this.conditionValue = "";
      //     }
      //   }
      // });
    }

    if (this.permission.conditions) {
      this.conditionValue = {
        type: this.permission.filterType,
        conditions: this.permission.conditions.slice(0)
      };
    }else{
      this.conditionValue = "";

      if (schemaCode && functionId) {

        permissionApi.listCondition(schemaCode, functionId).then(res => {
          if (res.errcode === 0) {
            if (res.data && res.data.length) {
              this.conditionValue = {
                type: this.permission.filterType,
                conditions: res.data
              };
            }
          }
        });
      }
    }
  }

  show() {
    this.visible = true;
  }

  ok() {
    if(this.conditionValue.conditions){
      this.conditionValue.conditions.forEach((c:any) => {
        c.schemaCode = this.permission.schemaCode;
        c.functionId = this.permission.id;
      });
    }
    // 防止业务选人控件有有空值，报错
    let error = this.conditionValue.conditions.filter(item => {
      return item.propertyType === 5 && item.value.length == 0;
    })
    if (error.length > 0) {
      message.error('选人控件的值不能为空！');
      return false;
    }

    this.$emit("ok", this.conditionValue);
    this.visible = false;
  }

  onCancel() {
    this.$emit("cancel");
  }
}
</script>

<style lang="less" scoped>
</style>
