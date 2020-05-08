<template>
  <div class="reference">
    <p class="reference__title" v-if="showTitle">以下{{ list.length }}个业务模型引用了当前业务集成方法</p>
    <div class="reference__table">
      <a-table
        :columns="columns"
        :dataSource="list"
        :pagination="false"
        size="small"
      >
        <!-- 表头 -->
        <span slot="indexTitle">序号</span>
        <span class="text-ellipsis resize" slot="schemaNameTitle">业务模型</span>
        <span class="text-ellipsis resize" slot="appNameTitle">所属应用</span>
        <span
          v-if="showRoute"
          class="text-ellipsis resize"
          slot="actionTitle">操作</span>
        <!-- 表体 -->
        <span
          class="text-ellipsis"
          slot="schemaName"
          slot-scope="text">{{ text }}</span>
        <span
          class="text-ellipsis"
          slot="appName"
          slot-scope="text">{{ text }}</span>
        <template
          v-if="showRoute"
          class="text-ellipsis"
          slot="action"
          slot-scope="text,record">
          <router-link 
            tag="a"
            target="_blank"
            :to="{
              name: 'bizmodel',
              params: {
                appCode: record.appCode,
                bizSchemaCode: record.schemaCode
              }
            }">前往修改</router-link>
          
        </template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import serviceApi from '@/apis/biz-service/service.api';

@Component({
name:"reference"
})
export default class Reference extends Vue {
  @Prop() serviceMethod!: any;

  @Prop({ default: true }) showTitle?: boolean;

  @Prop() showRoute?: boolean;

  // 表格列信息
  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      key: 'index',
      width: 146,
    },
    {
      dataIndex: 'schemaName',
      slots: { title: 'schemaNameTitle' },
      scopedSlots: { customRender: 'schemaName' },
      key: 'schemaName',
      width: 190,
    },
    {
      dataIndex: 'appName',
      slots: { title: 'appNameTitle' },
      scopedSlots: { customRender: 'appName' },
      key: 'appName',
    },
  ];
  // 引用列表
  list: any[] = [];

  /**
   * 获取引用信息列表
   */
  getList(){
    const params: BizService.Service.GetReferenceParams = {
      serviceCode: this.serviceMethod.serviceCode,
      serviceMethodCode: this.serviceMethod.code
    };
    serviceApi.getReference(params).then((res: any) => {
      if (res.errcode === 0 && Array.isArray(res.data)) {
        this.list = res.data.map((item:any,index: number) => {
          item.index = index+1;
          return item;
        });
      }
    });
  }

  mounted(){
    if (this.showRoute) {
      this.columns.push({
        dataIndex: 'action',
        slots: { title: 'actionTitle' },
        scopedSlots: { customRender: 'action' },
        key: 'action',
        width: 104,
        align: 'right',
      });
    }
    this.getList();
  }
}
</script>
<style lang="less" scoped>
.reference{
  &__title {
    margin-bottom: 16px;
    color: rgba(0,0,0,0.65);
  }
  &__table {
    /deep/.ant-table-body {
      table {
        padding: 0 !important;
      }
      th {
        font-weight: 600;
      }
    }
    a {
      color: @primary-color;
    }
  }
}
</style>