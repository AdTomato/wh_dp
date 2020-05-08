<template>
  <div class="apps-manager">
    <div class="apps-manager__header clearfix">
      <div class="apps-manager__left">
        <a-input
          :placeholder="'搜索用户账号或用户姓名'"
          v-model="keyWords"
          class="w240"
          @change="filterDataSource"
        >
          <a-icon
            v-if="keyWords"
            slot="suffix"
            type="close-circle"
            class="del-icon delete"
            @click="clearKeyWords"
          />
          <a-icon
            slot="suffix"
            type="search"
            class="del-icon"
          />
        </a-input>
      </div>
      <div class="apps-manager__right">
        <a-button type="primary" @click="visible = !visible; id = ''">
          <a-icon type="plus"/>
          <span>新增管理员</span>
        </a-button>
      </div>
    </div>
    <div class="apps-manager__content">
      <p class="content__tips">应用管理员：对已配置的应用有后台管理权限，其他无权限</p>
      <a-table
        :columns="columns"
        size="small"
        :pagination="false"
        :loading="false"
        :locale="{emptyText: $t('languages.NoRelevantData')}"
        :scroll="{ y: 500 }"
        :dataSource="filterData"
      >
        <span slot="indexTitle">{{ $t('languages.NO') }}</span>
        <span slot="usernameTitle" class="resize">用户账号</span>
        <span slot="nameTitle" class="resize">用户姓名</span>
        <span slot="departmentNameTitle" class="resize">所属组织</span>
        <span slot="appPackagesTitle" class="resize">应用名称</span>
        <span slot="departmentsTitle" class="text-ellipsis resize"> 组织管理范围 </span>
        <span slot="actionTitle" class="resize">操作</span>

        <!-- <p
          slot="appPackages"
          slot-scope="text, record">
          <span>{{ text }} </span>
          <span
            v-for="(app, index) in text"
            :key="index"
          >
            {{ app.name }}
          </span>
          <span>
            {{ text.join(',') }}
          </span>
        </p>-->
        <p
          slot="departmentName"
          slot-scope="text, record"
          class="text-ellipsis"
        >{{ text }}</p>

        <p
          slot="departments"
          slot-scope="text, record"
          class="text-ellipsis"
        >
          {{ text }}
        </p>

        <p slot="name" slot-scope="text, record">
          <span v-hight-light="{'keyWords': keyWords, 'value': text }"></span>
        </p>

        <p
          slot="username"
          class="text-ellipsis"
          slot-scope="text, record"
        >
          <span v-hight-light="{'keyWords': keyWords, 'value': text }"></span>
        </p>

        <p
          slot="appPackages"
          slot-scope="text, record"
          class="text-ellipsis"
        >{{ text }}</p>

        <div
          class="action right"
          slot="action"
          slot-scope="text, record"
        >
          <i class="icon aufontAll h-icon-all-edit-o edit" @click="editManager(record.id)"></i>
          <a-popconfirm
            placement="left"
            :cancelText="$t('languages.Apps.Cancel')"
            :okText="$t('languages.Apps.Ok')"
            v-if="dataSource.length"
            title="确定要删除当前管理员么?"
            @confirm="() => deleteManager(record.id)"
          >
            <a href="javascript:;">
              <i class="icon aufontAll h-icon-all-delete-o"></i>
            </a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>

    <add-app-manager
      :visible="visible"
      v-if="visible"
      @submit="submit"
      @cancel="cancel"
      :id="id"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import systemApi from '@/apis/system/system-manager.api';

import AddAppManager from '../modals/add-app-manager.vue';

@Component({
  name: 'apps-manager',
  components: {
    AddAppManager
  }
})
export default class AppsManager extends Vue {
  visible: boolean = false;

  keyWords: string = '';

  dataSource = [];

  filterData = [];

  id: string = '';

  columns: Array<Common.TableHead> = [
    {
      dataIndex: 'index',
      slots: { title: 'indexTitle' },
      scopedSlots: { customRender: 'index' },
      width: 60,
      key: 'index',
      align: 'center',
    },
    {
      dataIndex: 'username',
      slots: { title: 'usernameTitle' },
      scopedSlots: { customRender: 'username' },
      width: '15%',
      key: 'username'
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      width: '15%',
      key: 'name'
    },
    {
      dataIndex: 'departmentName',
      slots: { title: 'departmentNameTitle' },
      scopedSlots: { customRender: 'departmentName' },
      key: 'departmentName',
      width: '15%'
    },
    {
      dataIndex: 'appPackages',
      slots: { title: 'appPackagesTitle' },
      scopedSlots: { customRender: 'appPackages' },
      key: 'appPackages',
      width: '15%'
    },
    // 组织范围
    {
      dataIndex: 'departments',
      slots: { title: 'departmentsTitle' },
      scopedSlots: { customRender: 'departments' },
      width: '18%',
      key: 'departments'
    },
    {
      dataIndex: 'action',
      slots: { title: 'actionTitle' },
      scopedSlots: { customRender: 'action' },
      key: 'action',
      align: 'right',
    }
  ]

  created() {
    this.getManagetList();
    this.filterDataSource();
  }

  clearKeyWords() {
    this.keyWords = '';
    this.filterDataSource();
  }

  // 获取管理员列表
  getManagetList() {
    const vm: any = this;
    const params = {
      managerType: 2
    };

    systemApi.getListManager(params).then((res: any) => {
      if (!res.errcode && res.data) {
        vm.dataSource = res.data;
        vm.dataSource.forEach((item: any, index: number) => {
          item.index = index + 1;
          item.appPackages = item.appPackages.map((apppackage: any) => apppackage.name).join(', ');
          item.departments =  item.departments.map((departments: any) => departments.name).join(', ');
          if (!item.departments) {
            item.departments = "";
          }
          if (!item.departmentName) {
            item.departmentName = [];
          }
          item.departmentName.reverse();
          Object.entries(item).forEach((data:any) => {
            const [key, value] = data;
            if (typeof value !== 'boolean' && !value) {
              item[key] = '- -';
            }
          });
          // 所属组织超过三级 中间以省略号代替
          if (item.departmentName.length > 3) {
            const arr: Array<string> = [
              item.departmentName[0],
              '...',
              item.departmentName[item.departmentName.length - 1]
            ];
            item.departmentName = arr;
          }
          item.departmentName = item.departmentName.join('/');
        });
        vm.filterDataSource();
      } else {
        vm.dataSource = [];
        vm.filterDataSource();
      }
    });
  }

  /**
   * 删除管理员
   */
  deleteManager(val: any) {
    const vm: any = this;
    const params = {
      id: val
    };
    systemApi.deleteManager(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('删除成功!', 2);
        vm.getManagetList();
      } else {
        vm.$message.error(res.errmsg, 2);
      }
    });
  }

  /**
   * 关键词过滤
   */
  filterDataSource() {
    const vm: any = this;
    if (this.keyWords.length === 0) {
      vm.filterData = vm.dataSource;
      return;
    }
    // vm.filterData = this.dataSource.filter((res: any) => new RegExp(vm.keyWords).test(res.username) || new RegExp(vm.keyWords).test(res.name.toLowerCase()));
    let reg = new RegExp(vm.keyWords);
    vm.filterData = this.dataSource.filter(
      (res: any) => reg.test(res.username)
      || reg.test(res.name.toLowerCase())
      || reg.test(res.pinYin.toLowerCase())
      || reg.test(res.shortPinYin.toLowerCase())
    );
  }

  editManager(id: string) {
    this.id = id;
    this.visible = !this.visible;
  }

  /**
   * 保存数据
   */
  submit(val: any) {
    const vm: any = this;

    const params = {
      users: [],
      appPackages: [],
      departments: [],
      id: vm.id
    };

    params.users = val.users.map((res: any) => ({ id: res.id }));

    params.appPackages = val.appPackages.map((res: any) => {
      const { name, code } = res;
      return {
        name,
        code,
        adminId: vm.id,
        id: ''
      };
    });

    params.departments = val.departments.map((res:any)=>({
      adminId: vm.id,
      id: res.id,
      name: res.name,
      queryCode: res.queryCode ? res.queryCode : '',
      unitType: res.unitType,
      unitId: res.id
    }))

    if (vm.id) {
      systemApi.upDateappsManager(params).then((res: any) => {
        if (res.errcode === 0) {
          vm.getManagetList();
          vm.id = '';
        } else {
          vm.$message.error(res.errmsg, 2);
        }
      });
    } else {
      console.log('2333', JSON.stringify(params));
      systemApi.createdappsManager(params).then((res: any) => {
        if (res.errcode === 0) {
          vm.getManagetList();
          vm.id = '';
        } else {
          vm.$message.error(res.errmsg, 2);
        }
      });
    }

    this.visible = !this.visible;
  }

  cancel() {
    this.visible = !this.visible;
  }
}
</script>
<style lang="less" scoped>
.apps-manager {
  &__header {
    .apps-manager__left {
      .delete {
        margin-right: 6px;
        color: rgba(0, 0, 0, 0.25);
      }
      .w240 {
        width: 240px;
      }
      float: left;
      input {
        width: 240px;
      }
    }
    .apps-manager__right {
      float: right;
    }
  }
  &__content {
    .content__tips {
      color: rgba(0, 0, 0, 0.45);
      font-size: 12px;
      padding-bottom: 2px;
      line-height: 20px;
    }
    padding-top: 16px;
    // /deep/.ant-table-thead span {
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    /deep/.ant-table-body {
      max-height: calc(100vh - 230px - 22px) !important;
      color: rgba(0, 0, 0, 0.85);
    }
    .highlight {
      color: @primary-color;
    }
    .action {
      .edit {
        margin-right: 18px;
      }
    }
  }
}
</style>
