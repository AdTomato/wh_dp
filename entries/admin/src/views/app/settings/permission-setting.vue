
<template>
  <div class="permission-setting">
    <h3 v-if="!isTabPane">{{ $t('languages.appSettings.permissionSetting') }}</h3>
    <h4>{{ $t('languages.appSettings.VisibleRangeSetting') }}</h4>
    <div class="permission-setting__row">
      <div>{{ $t('languages.appSettings.AppVisibleRange') }}：</div>
      <div>
        <a-radio-group v-model="visibleType" @change="onVisibleTypeChange">
          <a-radio :value="1">{{ $t('languages.appSettings.AllUserVisible') }}</a-radio>
          <a-radio :value="2">{{ $t('languages.appSettings.AccessByGroup') }}</a-radio>
        </a-radio-group>
        <div class="desc" v-show="visibleType === 1">{{ $t('languages.appSettings.AllUserCanViewSelfDataAndModify') }}</div>
      </div>
    </div>

    <div v-show="visibleType === 2">
      <h4>{{ $t('languages.appSettings.PermissionGroupSetting') }}</h4>
      <a-table
        :columns="columns"
        :dataSource="data"
        :pagination="false"
        rowKey="id"
      >

        <template slot="externalUser" slot-scope="text, record">
          <a-switch
            disabled
            :checked="record.externalUser"
          />
        </template>

        <template slot="operation" slot-scope="text, record">
          <a-icon type="edit" @click="() => handleEdit(record.id)"/>

          <a-popconfirm
            :title="$t('languages.appSettings.ConfirmDelete')"
            :okText="$t('languages.appSettings.OK')"
            :cancelText="$t('languages.appSettings.cancel')"
            placement="left"
            @confirm="() => handleDelete(record.id)"
          >
            <a-icon type="delete"/>
          </a-popconfirm>
        </template>
      </a-table>
      <div class="actions">
        <!-- <a-button icon="plus" @click="handleAdd">新增权限组</a-button> -->
        <div
          class="handle-add"
          @click="handleAdd"
        ><i class="icon aufontAll h-icon-all-plus-o"></i> {{ $t('languages.appSettings.AddPermissionGroup') }}</div>
      </div>
    </div>

    <a-drawer
      :title="$t('languages.appSettings.ManagePermission')"
      placement="right"
      width="850"
      :visible="showForm"
      :destroyOnClose="true"
      wrapClassName="permission-group-drawer"
      @close="onDrawerClose"
    >
      <permission-group-form
        :groupId="groupId"
        @ok="onFormOk"
        @cancel="onDrawerClose"
      ></permission-group-form>
    </a-drawer>
  </div>
</template>


<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, namespace } from 'vuex-class';
import { Drawer } from 'h3-antd-vue';
import permissionApi from '@/apis/system/permission.api';

import PermissionGroupForm from '@/components/apps/settings/permission-group-form.vue';

const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'permission-setting',
  components: {
    ADrawer: Drawer,
    PermissionGroupForm
  },

  beforeRouteEnter(to, from, next) {
    next((vm) => {
      (vm as PermissionSetting).load();
    });
  },

  beforeRouteUpdate(to, from, next) {
    const vm = this as PermissionSetting;
    // vm.clean();
    next();
    vm.load();
  }
})
export default class PermissionSetting extends Vue {
  @AppCenterModule.State('appInfo') appInfo: any;

  @Prop() isTabPane?: boolean;

  groupId = '';

  showForm = false;

  visibleType = 1;

  columns: any[] = [];

  data: BPM.System.PermissionGroupModel[] = [];

  setColumns() {
    this.columns = [
      {
        title: this.$t('languages.appSettings.index') as string,
        dataIndex: 'index',
        width: 70
      },
      {
        title: this.$t('languages.appSettings.name') as string,
        dataIndex: 'name',
        width: 208
      },
      {
        title: this.$t('languages.appSettings.departments') as string,
        dataIndex: 'departments',
        width: 192
      },
      {
        title: this.$t('languages.appSettings.roles') as string,
        dataIndex: 'roles',
        width: 372
      },
      {
        title: this.$t('languages.appSettings.externalUser') as string,
        dataIndex: 'externalUser',
        scopedSlots: { customRender: 'externalUser' },
        width: 140
      },
      {
        title: this.$t('languages.appSettings.operation') as string,
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' },
        width: 140
      }
    ];
  }

  load() {
    const hideLoader = (this.$message as any).loading();

    const appCode = this.$route.params.appCode || this.appInfo.code;

    permissionApi.getAppPackage(appCode).then((res) => {
      hideLoader();
      if (res.data) {
        const data = res.data.permissionGroups;

        this.visibleType = res.data.visibleType;

        data.forEach((item: any, i) => {
          item.index = i + 1;
      
          if (item.departments) {
            item.departments = JSON.parse(item.departments).map((x: any) => x.name).join('、');
          }

          if (item.roles) {
            item.roles = JSON.parse(item.roles).map((x: any) => x.name).join('、');
          }

          // item.externalUser = item.externalUser ? '开' : '关';

          Object.entries(item).forEach((d:any) => {
            const [key, value] = d;
            if (typeof value !== 'boolean' && !value) {
              item[key] = '- -';
            }
          });
        });

        this.data = data;
      }
    });
  }

  handleAdd() {
    this.groupId = '';
    this.showForm = true;
  }

  handleEdit(groupId: string) {
    this.groupId = groupId;
    this.showForm = true;
  }

  handleDelete(groupId: string) {
    const closeLoader = (this.$message as any).loading();

    permissionApi.deleteGroup(groupId).then((res) => {
      if (res.errcode === 0) {
        this.$message.success('已删除');
        this.load();
      } else {
        this.$message.error('删除失败');
      }
    });
  }

  onDrawerClose() {
    this.showForm = false;
  }

  onFormOk() {
    this.onDrawerClose();
    this.load();
  }

  onVisibleTypeChange(e: any) {
    const type = e.target.value;
    const params = {
      appCode: this.$route.params.appCode || this.appInfo.code,
      visibleType: type
    };
    permissionApi.updateAppPackage(params);
  }

  mounted() {
    this.setColumns();
    if (!this.data.length) {
      this.load();
    }
  }
}
</script>


<style lang="less" scoped>
@import "~@/components/shared/ant-table.less";

.permission-setting {
  text-align: left;
  padding: 0 24px;
  color: rgba(0, 0, 0, 0.65);
  overflow: auto;
  height: 100%;

  h3 {
    font-size: 18px;
    font-weight: 500;
    color: #000;
    height: 64px;
    line-height: 64px;
    // padding-top: 20px;
    // padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
  // /deep/.ant-table-thead span {
  //   font-weight: 600;
  //   color: rgba(0,0,0,0.65);
  // }
  /deep/.ant-table-body {
    color: rgba(0,0,0,0.85);
  }

  h4 {
    font-weight: 500;
    color: #000;
    margin-bottom: 1em;
    margin-top: 24px;
  }

  .actions {
    text-align: center;
    margin-top: 14px;
    // padding-bottom: 16px;
    // & > button {
    //   border: 0;
    // }
    .handle-add {
      color: @primary-color;
      text-align: center;
      margin-top: 8px;
      user-select: none;
      cursor: pointer;
      margin-bottom: 20px;
    }
  }

  i.anticon {
    font-size: 14px;
    margin-right: 17px;
    cursor: pointer;
  }

  &__row {
    display: flex;
  }
  .desc {
    padding-top: 4px;
  }
}

.desc {
  color: rgba(0, 0, 0, 0.45);
  font-size: 12px;
}



</style>

<style lang="less">
.permission-group-drawer {
  .ant-drawer-title {
    font-weight: 600;
  }
  .ant-drawer-body {
    height: calc(100% - 57px - 52px);
  }
}
</style>
