<template>
  <div class="content-box">
    <a-table
      :columns="columns"
      :pagination="{}"
      :locale="{emptyText: $t('languages.Apps.NoData')}"
      :dataSource="dataSource"
      :scroll="{ x: totalWidth }"
      @change="onChange"
      size="small"
      class="content-box__table"
    >
      <span
        v-for="(dataitem, index) in columns"
        :key="index"
        :slot="dataitem.slots.title"
        :class="{'resize': index>0}"
      >{{ dataitem.name }}</span>
      <!-- v-resize.east="{onResize: tableResize,translateX: 16}" -->
      <!-- v-resize:`${dataitem.name}`.east="{onEnd: tableResize}" -->
      <!-- v-resize.east="{onEnd: tableResize, key: dataitem.code}" -->
    </a-table>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';

import { DateType, numberType, DateDefaultType } from './modals/control-modals-map';

import { showFieldDefaultValByCode, showFieldDefaultValByType } from './typings';

// import ListDesignHeader from '@/components/apps/list-design/listDesign-header.vue';
const ListdesignModule = namespace('Apps/Listdesign');


@Component({
  name: 'TableList',
  components: {
  }
})
export default class TableList extends Vue {
  @ListdesignModule.State('showFieldArray') showFieldArray: any;

  @ListdesignModule.Mutation('setShowFieldArray') setShowFieldArrayStore: any;

  dataSourceEach: any = {};

  dataSource:any[] = [
  ];

  columns:any[] = [];

  onChange(v:any) {
    console.info(v);
  }

  totalWidth: number = 300;

  @Watch('showFieldArray', { deep: true })
  setShowFieldArray(v:any) {
    const showFieldLength: number = v.length;
    /* 重置表格 */
    if (showFieldLength < 1) {
      this.columns = [];
      this.dataSource = [];
      return;
    }

    // 组装表头配置

    this.columns = v.map((pl:any, index: number) => {
      const obj: any = {
        code: pl.code,
        name: pl.name,
        dataIndex: pl.code,
        slots: { title: `${pl.code}Title` },
        width: parseInt(pl.width)
      };

      // if (showFieldLength !== index + 1) {
      //   obj.width = parseInt(pl.width);
      // }
      return obj;
    });
    this.columns.unshift(...[
      {
        code: 'order',
        name: '序号',
        dataIndex: 'order',
        slots: { title: 'orderTitle' },
        width: 79
      },
      // {
      //   code: 'abstract',
      //   name: '数据标题',
      //   dataIndex: 'abstract',
      //   slots: { title: 'abstractTitle' },
      //   width: 296
      // }
    ]);


    v.forEach((el:any) => {
      if (el.isSystem) {
        this.setSystemDataItem(el);
        return;
      }
      const showFieldDefaultVal = showFieldDefaultValByType as any;
      this.dataSourceEach[el.code] = showFieldDefaultVal[el.type] ? showFieldDefaultVal[el.type] : '- -';
    });

    ['张三的事假申请'].forEach((x:any, i:number) => {
      this.dataSourceEach.order = i + 1;
      this.dataSourceEach.abstract = x;
      this.dataSourceEach.key = i;
      this.dataSource[i] = this.dataSourceEach;
    });
    let tableWidth: number = 0;
    this.columns.forEach((res:any) => {
      tableWidth += res.width;
    });
    this.totalWidth = tableWidth;
  }

  /**
   * 表格宽度重置回调
   */
  tableResize(key: string, event:any) {
    this.showFieldArray.forEach((res:any) => {
      if (res.code === key) {
        res.width = +event.target.offsetWidth;
      }
    });
    // this.columns
    // debugger;
  }

  /**
   * 设置显示默认值
   */
  setSystemDataItem(el:any) {
    const showField = showFieldDefaultValByCode as any;
    this.dataSourceEach[el.code] = showField[el.code];
  }
}
</script>
<style lang="less" scoped>
.content-box{
  &__table {
    margin-top: 16px;
  }
  overflow: hidden;
  width: 100%;
  // /deep/.ant-table-thead span {
  //   font-weight: 600;
  //   color: rgba(0,0,0,0.65);
  // }
  /deep/.ant-table-body {
    color: rgba(0,0,0,0.85);
  }
}
</style>
