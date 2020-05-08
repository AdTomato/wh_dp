<template>
  <div class="action-updated">
    <p class="action-updated-title">更新动作：</p>
    <!-- <div>
    </div> -->
    <div
      class="action-updated-item"
      v-for="(item, index) in dataList"
      :key="index"
    >
      <p> {{ item.title }} </p> 
      <!-- <p v-for="(str,index) in item.dataItemList" :key="index">
        {{ str }}
      </P> -->
      <span
        v-for="(str,index) in item.dataItemList"
        :key="index"
      > {{ str }} </span>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import * as dataType from './typings/data-rule';
import { DataItemType } from "@cloudpivot/form/schema";
@Component({
  name: "action-updated",
  components: {
  }
  })
export default class ActionUpdated extends Vue {
  @Prop() updateEffectMap!: any;

  dataList:any[] = [];

  created() {
    this.setDataList();
  }

  setDataList() {
    for (let i in this.updateEffectMap) {
      if (this.updateEffectMap[i].length > 0) {
        let str:string = '';
        const item:any = this.updateEffectMap[i][0];
        const type: dataType.TableType = item.targetTableType;
        const dataItem:string[] = [];
        this.updateEffectMap[i].forEach(res => {
          let s = '';
          s = `字段${res.targetPropertyName}[${res.targetPropertyCode}]由`
            + `“${this.initDataItemVal(res.targetPropertyType,res.targetPropertyLastValue)}”` + '到'
            + `“${this.initDataItemVal(res.targetPropertyType,res.targetPropertySetValue)}”`;
          dataItem.push(s);
        });
        if (type === dataType.TableType.MainSheet) {
          str = `修改了“${item.targetMainObjectName}”(${item.targetMainObjectId})的数据`;
        } else {
          str = `修改了主表“${item.targetMainObjectName}”(${item.targetMainObjectId})下id为 ${item.targetObjectId}的数据`;
        }

        const obj = {
          title: str,
          dataItemList: dataItem
        };

        this.dataList.push(obj);
      }
    }
  }

  initDataItemVal(targetPropertyType: DataItemType,val:any) {
    if (val === null) {
      return 'null';
    }
    switch(targetPropertyType) {
      default:
      case DataItemType.ShortText:
        return val;
      case DataItemType.StaffSelector:
        return val.map(res => {
          return res.name;
        }).join(',');
      case DataItemType.RelevanceForm:
        return `${val.name}(${val.id})`;
      case DataItemType.Logic:
        return `${val}`;
      case DataItemType.Address:
        const ad:any = JSON.parse(val);
        return `${ad.provinceName || ''}${ad.cityName || ''}${ad.districtName || ''}${ad.address || ''}`
    }
  }
}
</script>
<style lang="less" scoped>
.action-updated{
  &-item {
    width: 100%;
    font-weight: 600;
    font-size: 12px;
    margin-bottom: 20px;
    span {
      display: block;
      font-weight: 400;
    }
  }
  &-title {
    font-weight: 600;
    font-size: 14px;
  }
}


</style>

