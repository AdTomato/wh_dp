<template>
  <div class="permission-data-item">
    <a-table
      v-if="realColumns.length"
      :columns="realColumns"
      :dataSource="list"
      :locale="{emptyText: $t('languages.NoRelevantData')}"
      :pagination="false"
      :scroll="{ y: tableHeight }"
      size="small"
    >
      <!-- 表头信息 -->
      <template slot="nameTitle">数据项</template>
      <template slot="visibleTitle">
        <a-checkbox
          class="checkbox"
          v-model="dataHead.visible"
          @change="checkAll('visible')"
        ></a-checkbox>可见
      </template>
      <template slot="writeAbleTitle">
        <a-checkbox
          class="checkbox"
          v-model="dataHead.writeAble"
          @change="checkAll('writeAble')"
        ></a-checkbox>可写
      </template>
      <template slot="requiredTitle">
        <a-checkbox
          class="checkbox"
          v-model="dataHead.required"
          @change="checkAll('required')"
        ></a-checkbox>必填
      </template>
      <!-- 表体 -->
      <span
        slot="name"
        slot-scope="text,record"
      >
        <template v-if="lang === 'zh'">
          {{ record.parentCode ? record.parentName+'.'+record.name : record.name }}
        </template>
        <template v-else>
          {{ record.parentCode ? (record.parentNameI18n[lang] || record.parentName)+'.'+(record.name_i18n[lang] || record.name) : (record.name_i18n[lang] || record.name) }}
        </template>
      </span>
      <a-checkbox
        class="checkbox"
        slot="visible"
        slot-scope="text,record"
        v-model="record.visible"
        :disabled="record.propertyEmpty && bizPermType !== '2' && bizPermType !== '3'"
        @change="onSelectChange('visible',record)"
      ></a-checkbox>
      <a-checkbox
        class="checkbox"
        slot="writeAble"
        slot-scope="text,record"
        v-model="record.writeAble"
        :disabled="record.propertyEmpty && bizPermType !== '2' && bizPermType !== '3'"
        @change="onSelectChange('writeAble',record)"
      ></a-checkbox>
      <a-checkbox
        class="checkbox"
        slot="required"
        slot-scope="text,record"
        v-model="record.required"
        :disabled="record.propertyEmpty && bizPermType !== '2' && bizPermType !== '3'"
        @change="onSelectChange('required',record)"
      ></a-checkbox>
    </a-table>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

@Component({
  name: 'permission-data-item'
})
export default class PermissionDataItem extends Vue {
  @Prop() dataItems!: any;

  @Prop() bizPermType!: string;

  @Prop() tableHeight!: number;

  get lang() {
    return this.$i18n.locale;
  }

  @Watch('bizPermType')
  onType(val:string) {
    this.initTable(val);
  }

  // 全选可见、可写、必填
  dataHead: any = {
    visible: false,
    writeAble: false,
    required: false,
  };

  // 数据项
  list: any[] = [];

  // 实际展示表头
  realColumns: Array<Common.TableHead> = [];

  // 表头
  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'name',
      slots: {
        title: 'nameTitle'
      },
      scopedSlots: {
        customRender: 'name'
      },
      key: 'name',
      width: 200,
    },
    {
      dataIndex: 'visible',
      slots: {
        title: 'visibleTitle'
      },
      scopedSlots: {
        customRender: 'visible'
      },
      key: 'visible',
      width: 200,
    },
    {
      dataIndex: 'writeAble',
      slots: {
        title: 'writeAbleTitle'
      },
      scopedSlots: {
        customRender: 'writeAble'
      },
      key: 'writeAble',
      width: 200,
    },
    {
      dataIndex: 'required',
      slots: {
        title: 'requiredTitle'
      },
      scopedSlots: {
        customRender: 'required'
      },
      key: 'required',
      // width: 200,
    },
  ];

  /**
   * 单个勾选框变化
   */
  onSelectChange(type: string, record: any) {
    // debugger
    this.dataItems.forEach((item: any) => {
      
      if (type === 'visible' && !item.visible) {
        // 取消可见同时取消可写和必填
        item.writeAble = false;
        item.required = false;
      }
      if (type === 'writeAble') {
        if (!item.writeAble) {
          item.required = false;
        } else {
          item.visible = true;
          if (item.propertyEmpty) {
            item.required = true;
          }
        }
      }
      if (type === 'required') {
        if (item.required) {
          item.writeAble = true;
          item.visible = true;
        } else {
          if (item.propertyEmpty) {
            item.writeAble = false;
          }
        }
        
      }
      if (item.hasSubSchema && record && item.propertyCode === record.propertyCode) {
        const childs:any[] = this.dataItems.filter((sub:any) => sub.parentCode === record.propertyCode);
        childs.forEach((chd: any) => { 
          if (chd.propertyEmpty && this.bizPermType === '1') {
            return
          }
          chd[type] = record[type];
        });
      }
      if (record && record.parentCode) {
        this.onSubSelectChange(type, record);
      }
    });
    this.checkStatus();
  }

  /**
   * 子数据项勾选框变化，连带父级变化
   */
  onSubSelectChange(type: string, record: any) {
    if (record.parentCode) {
      const parent:any = this.dataItems.find((par:any) => par.propertyCode === record.parentCode);
      const sibs: any[] = this.dataItems.filter((sib:any) => sib.parentCode === record.parentCode);
      parent[type] = sibs.some((item:any) => item[type]);
    }
  }

  /**
   * 全选
   */
  checkAll(type: string) {
    if (!type) return;
    const checked: boolean = this.dataHead[type];
    this.dataItems.forEach((item: any) => {
      item[type] = item.propertyEmpty || checked;
    });
    if (type === 'required' && checked) {
      this.dataHead.writeAble = true;
      this.checkAll('writeAble');
    }
    if (type === 'writeAble') {
      if (checked) {
        this.dataHead.visible = true;
        this.checkAll('visible');
      } else {
        this.dataHead.required = false;
        this.checkAll('required');
      }
    }
    if (type === 'visible' && !checked) {
      this.dataHead.writeAble = false;
      this.checkAll('writeAble');
    }
  }

  /**
   * 判断全选是否勾选
   */
  checkStatus() {
    Object.keys(this.dataHead).forEach((type: string) => {
      this.dataHead[type] = !this.dataItems.some((item: any) => !item[type]);
    });
  }

  initTable(bizPermType:string) {
    // debugger
    this.list = [];
    if (+bizPermType === 2) {
      this.realColumns = this.columns.filter((col:Common.TableHead) => !['writeAble', 'required'].includes(col.key as string));
      this.realColumns.some((col: Common.TableHead) => {
        if (col.key === 'visible') {
          col.width = 600;
          return true;
        }
        return false;
      });
    } else {
      this.realColumns = this.columns;
      this.realColumns.some((col: Common.TableHead) => {
        if (col.key === 'visible') {
          col.width = 200;
          return true;
        }
        return false;
      });
    }
    this.$nextTick(() => {
      // debugger
      this.list = this.dataItems;
      this.checkStatus();
    });
  }

  mounted() {
    this.initTable(this.bizPermType);
  }
}
</script>
<style lang="less" scoped>
.permission-data-item {
  .checkbox {
    margin-right: 10px;
  }
  // /deep/.ant-table-thead span {
  //   font-weight: 600;
  //   color: rgba(0,0,0,0.65);
  // }
  /deep/.ant-table-body {
    // max-height: calc(100vh - 325px)!important;
    color: rgba(0,0,0,0.85);
  }
}
</style>
