<template>
  <div class="field reverse-relevance">
    <div class="field__label" :style="style">{{ label }}</div>
    <div class="field__control">
      <div
        v-for="item in dataList"
        :key="item.id"
        @click="onClick(item)"
        class="reverse-relevance__item"
      >
        <div>{{ item.name }}</div>
        <i v-if="isLink" class="icon aufontAll h-icon-all-right-o" />
      </div>
    </div>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop, Watch, Inject } from "vue-property-decorator";

import { ReverseRelevanceControl,RelevanceFormControl } from "../../../controls";

import { ReverseQueryService }  from '../../../services'
import * as SystemCodes from '../../../../schema/system-data-item-codes';

import { FormStatusZh, FormStatusEn } from '../../../../schema';

@Component({
  name: "reverse-relevance-list",
  components: {}
})
export default class ReverseRelevanceList extends ReverseRelevanceControl {
  data: any[] = [];


  get dataList() {
    const data = this.data.map((x: any) => x.data);
    return data;
  }

  onClick(item: any) {
    this.open(item);
  }

  updated(){
    const el:any = document.querySelector('.form-body');
    el.style.overflow = 'auto';
  }

  mounted() {
    const schemaCode = this.controlOpts.schemaCode || '';
    const listCode = this.controlOpts.listCode || '';
    const conditions = this.controlOpts.mobileConditions;
    const formControls = this.getFormControls();
    const c =  this.control;
    const param = ReverseQueryService.getParams(conditions,formControls,c, this.findController);
    const queryParam:any[] = [];
    // if (param.length > 0) {
      ReverseQueryService.getListQueryConditions(schemaCode,listCode,param).then(res => {
        let queryConditions = res.conditions || [];
        // debugger;
        queryConditions = ReverseQueryService.formatQueryData(queryConditions);
        
        // queryConditions.map(qc => {
        //   let val =  qc.defaultValue;
        //   if (qc.propertyCode === SystemCodes.sequence_status && qc.defaultValue) {
        //     const status_en:string[] = [];
        //     if (qc.defaultValue) {
        //       const statusArr = qc.defaultValue.split(';');
        //       statusArr.forEach(s => {
        //         switch (s) {
        //           case FormStatusZh.DRAFT:
        //             status_en.push(FormStatusEn.DRAFT)
        //             break;
        //           case FormStatusZh.PROCESSING:
        //              status_en.push(FormStatusEn.PROCESSING)
        //             break;
        //           case FormStatusZh.CANCELLED:
        //             status_en.push(FormStatusEn.CANCELLED)
        //             break;
        //           case FormStatusZh.COMPLETED:
        //             status_en.push(FormStatusEn.COMPLETED)
        //             break;
                
        //           default:
        //             break;
        //         }
        //       });
        //       val = status_en.join(';');
        //     }
        //     // const status =  param.find(p => p.code === SystemCodes.sequence_status);
        //     // if (status) {
        //     //   val = [p.value];
        //     // }
        //   }
        //   return {
        //     code: qc.propertyCode,
        //     type: qc.propertyType,
        //     value: val
        //   }
        // })
        // param.forEach(p => {
        //   const queryItem = queryConditions.find(q => q.propertyCode === p.code);
        //   queryParam.push({
        //     code: p.code,
        //     type: queryItem.propertyType,
        //     value: p.value 
        //   })
        // });
        this.getAll(queryConditions).then(data => (this.data = data));
      });
    // } else {
    //   this.getAll(queryParam).then(data => (this.data = data));
    // }
    
    // this.param = param;
    
  }
}
</script>

<style lang="less" scoped>
.field__label {
  padding: 10px 0;
  align-self: flex-start;
}
.field__control {
  justify-content: flex-start;
  flex-direction: column;
  min-height: 32px!important;
}
</style>
