<template>
  <div class="data-permission">
    <div v-if="isLoading" class="data-permission--loading">
      <a-spin size="large" :tip="$t('languages.Apps.Loading')"/>
    </div>
    <div v-else-if="list.length" class="data-permission__main">
      <div class="data-permission__buttons">
        <span class="data-permission_describe">可设置非流程数据的编辑及查看字段权限，流程数据权限请前往流程配置。</span>
        <a-button
          icon="plus"
          type="primary"
          @click="addPermission"
        >新建</a-button>
      </div>
      <div class="data-permission__table">
        <a-table
          :columns="columns"
          :dataSource="list"
          :loading="isLoading"
          :locale="{emptyText: $t('languages.NoRelevantData')}"
          :pagination="false"
          :scroll="{ y: 500 }"
          size="small"
        >
          <!-- 表头信息 -->
          <span slot="indexTitle">{{ $t('languages.NO') }}</span>
          <span slot="nameTitle" class="resize">权限组名</span>
          <span slot="roleTitle" class="resize">角色</span>
          <span slot="enableTitle" class="resize">是否启用</span>
          <span slot="actionTitle" class="resize">操作</span>
          <!-- 表体内容 -->
          <span
            slot="name"
            slot-scope="text,record"
          >{{ getName(record) }}</span>
          <span slot="roles" slot-scope="text,record">{{ record.roleNames }}</span>
          <a-switch
            slot="enable"
            slot-scope="text,record"
            :checked="record.enabled"
            @change="onEnableChange($event, record)"
          />
          <span
            slot="action"
            slot-scope="text,record"
            class="actions"
          >
            <i class="icon aufontAll h-icon-all-edit-o" @click="editPerm(record)"></i>
            <i class="icon aufontAll h-icon-all-delete-o" @click="deletePerm(record)"></i>
          </span>
        </a-table>
      </div>
    </div>
    <div v-else>
      <div style="text-align: left">
        <span class="data-permission_describe">可设置非流程数据的编辑及查看字段权限，流程数据权限请前往流程配置。</span>
      </div>
      <no-data
        tip="暂无数据权限，请点击新建按钮新建"
        @click="addPermission"
      />
    </div>
    

    <!-- 新增/编辑 弹出抽屉 -->
    <a-drawer
      :visible="showDrawer"
      :title="drawerTitle"
      width="850"
      placement="right"
      :destroyOnClose="true"
      @close="closeDrawer"
    >
      <data-permission-handler
        v-if="showDrawer"
        :permData="currentPermission"
        :dataItems="dataItems"
        :schemaCode="bizSchemaCode"
        :mode="handlerMode"
        @close="closeDrawer($event)"
      />
    </a-drawer>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import NoData from '@/components/global/no-data.vue';
import DataPermissionHandler from './data-permission-handler.vue';
import * as dataPermissionApi from '@/apis/data-permission';
import appsApi from '@/apis/apps';

@Component({
  name: 'data-permission',
  components: {
    DataPermissionHandler,
    NoData
  }
})
export default class DataPermission extends Vue {
  @Prop() bizSchemaCode!: string;

  // 页面是否正在加载
  isLoading: boolean = true;

  // 是否展示抽屉
  showDrawer: boolean = false;

  // 抽屉标题
  drawerTitle: string = '';

  // 弹窗类型：编辑edit 新增add
  handlerMode: string = '';

  // 当前权限组信息
  currentPermission: any = {};

  // 列表数据
  list: Array<any> = [];

  // 表头信息
  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: {
        title: 'indexTitle'
      },
      width: 100,
      key: 'index',
      align: 'center'
    },
    {
      dataIndex: 'name',
      slots: {
        title: 'nameTitle'
      },
      scopedSlots: {
        customRender: 'name'
      },
      width: 250,
      key: 'name',
      align: 'left'
    },
    {
      dataIndex: 'roles',
      slots: {
        title: 'roleTitle'
      },
      scopedSlots: {
        customRender: 'roles'
      },
      width: 500,
      key: 'roles',
      align: 'left'
    },
    {
      dataIndex: 'enable',
      slots: {
        title: 'enableTitle'
      },
      scopedSlots: {
        customRender: 'enable'
      },
      width: 300,
      key: 'enable',
      align: 'left'
    },
    {
      dataIndex: 'action',
      slots: {
        title: 'actionTitle'
      },
      scopedSlots: {
        customRender: 'action'
      },
      width: 130,
      key: 'action',
      align: 'left'
    }
  ];

  // 数据项
  dataItems: any[] = [];

  /**
   * 截取当前语言对应的权限组名
   */
  getName(record: any) {
    const names:any = JSON.parse(record.name_i18n);
    return names[this.$i18n.locale] || record.name;
  }

  /**
   * 获取数据项列表
   */
  getDataItems() {
    return appsApi.getDataItemList({
      schemaCode: this.bizSchemaCode,
      isPublish: true,
    }).then((res: any) => {
      if (res.errcode === 0 && res.data) {
        const sourceDataItems: any[] = res.data.filter((item: any) => !item.defaultProperty);
        const dataItems: any[] = [];
        sourceDataItems.forEach((item: any) => {
          const name_i18n: any = typeof item.name_i18n === 'string' ? JSON.parse(item.name_i18n) : {};
          dataItems.push({
            name: item.name,
            name_i18n,
            propertyEmpty: item.propertyEmpty,
            propertyCode: item.code,
            propertyType: item.propertyType,
            required: false,
            visible: true,
            writeAble: true,
            hasSubSchema: item.subSchema && Array.isArray(item.subSchema.properties),
          });
          if (item.subSchema && Array.isArray(item.subSchema.properties)) {
            item.subSchema.properties.forEach((subItem: any) => {
              if (!subItem.defaultProperty) {
                const sub_name_i18n: any = typeof subItem.name_i18n === 'string' ? JSON.parse(subItem.name_i18n) : {};
                dataItems.push({
                  name: subItem.name,
                  name_i18n: sub_name_i18n,
                  propertyEmpty: subItem.propertyEmpty,
                  propertyCode: subItem.code,
                  propertyType: subItem.propertyType,
                  required: false,
                  visible: true,
                  writeAble: true,
                  parentCode: item.code, // 父级数据项code
                  parentName: item.name, // 父级数据项name
                  parentNameI18n: name_i18n, // 父级数据项name_i18n
                });
              }
            });
          }
        });

        this.dataItems = dataItems;
      }
    });
  }

  /**
   * 新增数据权限
   */
  addPermission() {
    this.currentPermission = {};
    this.drawerTitle = '新建数据权限';
    this.handlerMode = 'add';
    this.showDrawer = true;
  }

  /**
   * 删除权限组
   */
  deletePerm(record: any) {
    console.log('delete', record);
    const vm: any = this;
    this.$confirm({
      title: '确定删除该权限组吗？',
      okType: 'danger',
      okText: this.$t('languages.Apps.Ok').toString(),
      cancelText: this.$t('languages.Apps.Cancel').toString(),
      onOk() {
        dataPermissionApi.deletePermission({
          groupId: record.id
        }).then((res: any) => {
          if (res.errcode === 0) {
            vm.$message.success('删除成功');
            vm.list = vm.list.filter((item: any) => item.id !== record.id);
            vm.sortList();
          }
        });
      }
    });
  }

  /**
   * 重新给列表编序号
   */
  sortList() {
    this.list.forEach((item: any, idx: number) => {
      item.index = idx + 1;
    });
  }

  /**
   * 编辑权限组
   */
  editPerm(record: any) {
    this.currentPermission = record;
    this.drawerTitle = '编辑数据权限';
    this.handlerMode = 'edit';
    this.showDrawer = true;
  }

  /**
   * 关闭新增/编辑弹出抽屉
   */
  closeDrawer(renew?: boolean) {
    this.showDrawer = false;
    if (renew) {
      this.getPermissionList();
    }
  }

  /**
   * 切换权限组启用状态
   */
  onEnableChange(enabled: any, item: any) {
    console.log(enabled, item);
    const switchParams: any = {
      ...item,
      enabled,
      roles: JSON.stringify(item.roles),
      permProperties: null
    };
    delete switchParams.roleNames;
    const type: string = enabled ? '启用' : '停用';
    dataPermissionApi.updatePermission(switchParams).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success(`${type}成功！`);
        item.enabled = enabled;
      }
    });
  }

  /**
   * 获取数据权限列表
   */
  getPermissionList() {
    dataPermissionApi.getPermissions({
      schemaCode: this.bizSchemaCode
    }).then((res: any) => {
      if (res.errcode === 0) {
        console.log(res);
        this.list = res.data.map((item: any, idx: number) => {
          const roles: any[] = JSON.parse(item.roles);
          const resOther: any = {
            index: idx + 1,
            ...item,
            roles,
            roleNames: roles.map((role: any) => role.name).join('，'),
          };
          return resOther;
        });
      }
    }).finally(() => {
      this.isLoading = false;
    });
  }

  mounted() {
    this.getPermissionList();
    this.getDataItems();
  }
}
</script>
<style lang="less" scoped>
.data-permission {
  text-align: center;
  margin: 0 24px 24px;
  min-height: 100px;
  position: relative;
  .data-permission_describe{
    line-height: 32px;
    color:rgba(0,0,0,0.45);
    font-size:12px;
    flex: 1;
    text-align: left;
  }
  &--loading {
    position: absolute;
    z-index: 9;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  &__buttons {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 16px;
  }
  .actions {
    i {
      cursor: pointer;
      &:first-child {
        margin-right: 8px;
      }
    }
  }
  // /deep/.ant-table-thead span {
  //   font-weight: 600;
  //   color: rgba(0,0,0,0.65);
  // }
  /deep/.ant-table-body {
    color: rgba(0, 0, 0, 0.85);
  }
}
</style>
