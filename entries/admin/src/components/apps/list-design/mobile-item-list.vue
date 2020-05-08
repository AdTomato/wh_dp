<template>
  <div class="mobile-item">
    <div class="item-default">
      <div class="name">{{ name }}</div>
      <img
        class="form-status"
        v-show="dataItem.sequenceStatus"
        src="@/assets/images/pending.png"
      />
      <template v-for="(list,index) in dataList">
        <p :key="index">
          <span>{{ list.name }}</span>:
          <span>{{ list.value }}</span>
        </p>
      </template>
      <div class="item-footer">
        <div class="footer-left" v-if="dataItem.creater">
          <i class="icon aufontAll h-icon-all-normal_smile"></i>
          <span>{{ dataItem.creater }}</span>
        </div>
        <div class="footer-right" v-if="dataItem.createdTime">{{ dataItem.createdTime }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import { showFieldDefaultValByCode, showFieldDefaultValByType } from './typings';

const ListdesignModule = namespace('Apps/Listdesign');


@Component({
  name: 'MobileItemList',
  components: {
  }
})
export default class MobileItemList extends Vue {
  @ListdesignModule.State('showFieldArray') showFieldArray: any;

  @ListdesignModule.State('clientType') clientType: any;

  @Prop() propDataList !: any;

  @Prop() isPreview !: boolean;

  dataList:any[] =[];

  dataItemArray:any[] = ['name', 'creater', 'createdTime', 'sequenceStatus'];

  dataItem:any = {};

  name:string = '张三的事假申请';

  mounted() {
    this.name = showFieldDefaultValByCode['name'];
  }

  /* 
  * 数据挂载
  */
  dataMounted(v:any) {
    this.dataItem = {};
    const data:any[] = v.map((pl:any, index: number) => {
      let value:any = '';
      if (this.isPreview) {
        pl.code = pl.propertyCode;
        pl.isSystem = pl.defaultProperty;
        pl.type = pl.propertyType;
      }
      if (pl.isSystem) {
        const showField = showFieldDefaultValByCode as any;
        value = showField[pl.code];
      } else {
        const showFieldDefaultVal = showFieldDefaultValByType as any;
        value = showFieldDefaultVal[pl.type] ? showFieldDefaultVal[pl.type] : '- -';
      }

      const item = this.dataItemArray.find((a:any) => a === pl.code);
      if (item) {
        this.dataItem[item] = value;
      }

      const obj: any = {
        code: pl.code,
        name: pl.name,
        value
      };
      return obj;
    });

    this.dataList = data.filter((d:any) => !this.dataItemArray.includes(d.code));
  }

  @Watch('propDataList', { deep: true })
  setPreviewFieldArray(v:any) {
    if (this.isPreview && this.clientType !== 'APP') {
      this.dataMounted(v);
    }
  }

  @Watch('showFieldArray', { deep: true, immediate: true })
  setShowFieldArray(v:any) {
    console.log('preview');
    if (this.isPreview  && this.clientType !== 'APP') {
      return;
    }
    this.dataMounted(v);
  }
}
</script>
<style lang="less" scoped>
.mobile-item{
  width: 100%;
  background: #FFF;
  padding: 12px;
  border-radius: 7px;
  min-height: 50px;
  .item-default{
    width: 100%;
    height: 100%;
    position: relative;
    .name{
      font-size: 13px;
      color: rgba(0,0,0,0.85);
      margin-bottom: 5px;
      height: 20px;
    }
    .form-status{
      position: absolute;
      top: -8px;
      right: -7px;
      width: 49px;
    }
    p{
      font-size: 10px;
      color: #666666;
      margin-bottom: 5px;
    }
    .item-footer{
      line-height: 24px;
      overflow: hidden;
      font-size: 10px;
      .footer-left{
        color: #666;
        float: left;
        height: 24px;
        i{
          font-size: 22px;
          margin-right: 8px;
          color: #7165ff;
          vertical-align: middle;
        }
      }
      .footer-right{
        float: right;
        color: #999;
        height: 24px;
      }
    }
  }
}
</style>
