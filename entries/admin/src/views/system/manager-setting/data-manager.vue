<template>
  <div class="data-manager">
    <div class="data-manager__header clearfix">
      <div class="data-manager__left">
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
      <div class="data-manager__right">
        <a-button type="primary" @click="visible = !visible; id = ''">
          <a-icon type="plus"/>
          <span>新增管理员</span>
        </a-button>
      </div>
    </div>
    <div class="data-manager__content">
      <p class="content__tips">数据管理员：可对前台应用下的列表数据管理，
        管理设置的应用管理范围下，
        组织管理范围内的人创建的数据
      </p>

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
        <span slot="usernameTitle" class="text-ellipsis resize">用户账号</span>
        <span slot="nameTitle" class="text-ellipsis resize"> 用户姓名 </span>
        <span slot="departmentNameTitle" class="text-ellipsis resize"> 所属组织 </span>
        <span slot="departmentsTitle" class="text-ellipsis resize"> 组织管理范围 </span>
        <span slot="appPackagesTitle" class="text-ellipsis resize"> 应用管理范围 </span>
        <!-- <span slot="dataQueryTitle" class="text-ellipsis resize"> 查看数据 </span> -->
        <!-- <span slot="dataManageTitle" class="text-ellipsis resize"> 管理数据 </span> -->
        <span slot="actionTitle" class="resize"> 操作 </span>

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
            <a href="javascript:;"><i class="icon aufontAll h-icon-all-delete-o"></i></a>
          </a-popconfirm>
        </div>

        <!-- <div
          slot="dataManage"
          slot-scope="text, record"
        >
          <a-checkbox
            v-model="record.text"
          />
        </div>

        <div
          slot="dataQuery"
          slot-scope="text, record"
        >
          <a-checkbox
            v-model="record.text"
          />
        </div> -->
        <p
          slot="departmentName"
          slot-scope="text, record"
          class="text-ellipsis"
        >
          {{ text }}
        </p>
        <p
          slot="departments"
          slot-scope="text, record"
          class="text-ellipsis"
        >
          {{ text }}
        </p>

        <p
          slot="username"
          slot-scope="text, record"
          class="text-ellipsis"
        >
          <span v-hight-light="{'keyWords': keyWords, 'value': text }"></span>
        </p>

        <p
          slot="name"
          slot-scope="text, record"
          class="text-ellipsis"
        >
          <span v-hight-light="{'keyWords': keyWords, 'value': text }"></span>
        </p>

        <p
          slot="appPackages"
          slot-scope="text, record"
          class="text-ellipsis"
        >
          {{ text }}
        </p>

      </a-table>
    </div>

    <div v-show="false" class="data-manager__footer clearfix">
      <div v-show="totalPage>0">
        <a-pagination
          @change="pageChange"
          :pageSizeOptions="pageSizeOptions"
          :total="totalPage"
          :showTotal="total => `共${totalPage}条`"
          showSizeChanger
          showQuickJumper
          :defaultPageSize="20"
        />
      </div>
    </div>

    <add-data-manager
      v-if="visible"
      :visible="visible"
      @submit="submit"
      @cancel="cancel"
      :id="id"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import systemApi from '@/apis/system/system-manager.api';

import AddDataManager from '../modals/add-data-manager.vue';


@Component({
  name: 'data-manager',
  components: {
    AddDataManager
  }
})
export default class DataManager extends Vue {
  pageSizeOptions: Array<string> = [
    '10',
    '20',
    '50',
    '100'
  ]

  visible: boolean = false;

  keyWords: string = '';

  dataSource = []; // 数据源
  filterData = []; // 实际数据源（分页查询更改为一次性查询再关键词过滤）

  totalPage: number = 0; // 总页数

  page: number = 0;

  size: number = 20;

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
    // 用户账户
    {
      dataIndex: 'username',
      slots: { title: 'usernameTitle' },
      scopedSlots: { customRender: 'username' },
      width: '15%',
      key: 'username'
    },
    // 用户名字
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      width: '15%',
      key: 'name'
    },
    // 所属组织
    {
      dataIndex: 'departmentName',
      slots: { title: 'departmentNameTitle' },
      scopedSlots: { customRender: 'departmentName' },
      key: 'departmentName',
      width: '15%',
    },
    // 应用范围
    {
      dataIndex: 'appPackages',
      slots: { title: 'appPackagesTitle' },
      scopedSlots: { customRender: 'appPackages' },
      width: '15%',
      key: 'appPackages'
    },
    // 组织范围
    {
      dataIndex: 'departments',
      slots: { title: 'departmentsTitle' },
      scopedSlots: { customRender: 'departments' },
      width: '15%',
      key: 'departments'
    },
    // 查看数据权限
    // {
    //   dataIndex: 'dataQuery',
    //   slots: { title: 'dataQueryTitle' },
    //   scopedSlots: { customRender: 'dataQuery' },
    //   width: 100,
    //   key: 'dataQuery',
    //   align: 'center',
    // },
    // // 管理数据权限
     {
      dataIndex: 'dataManage',
      slots: { title: 'dataManageTitle' },
      scopedSlots: { customRender: 'dataManage' },
      width: 100,
      key: 'dataManage',
      align: 'center',
    },
    // 操作
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
    const vm:any = this;
    const params = {
      wd: this.keyWords,
      page: 0,
      size: 10000
      // page: this.page,
      // size: this.size
    };

    systemApi.getDataManager(params).then((res:any) => {
      if (!res.errcode && res.data) {
        vm.totalPage = res.data.totalElements;
        vm.dataSource = res.data.content;

        vm.dataSource.forEach((item:any, index: number) => {
          item.index = index + 1;

          if (!item.departments) {
            item.departments = [];
          }

          if (!item.appPackages) {
            item.appPackages = [];
          }

          item.departments = item.departments.map((department:any) => department.name).join(', ');

          item.appPackages = item.appPackages.map((appPackage:any) => appPackage.name).join(', ');
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
          if (item.departmentName.length > 3) {
            const arr:Array<string> = [
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
        vm.totalPage = 0;
        vm.dataSource = [];
        vm.filterDataSource();
      }
    });
  }

  /**
   * 删除管理员
   */
  deleteManager(val:any) {
    const vm: any = this;
    const params = {
      id: val
    };
    systemApi.deleteManager(params).then((res:any) => {
      if (res.errcode === 0) {
        vm.$message.success('删除成功!', 2);
        vm.getManagetList();
      } else {
        vm.$message.error(res.errmsg, 2);
      }
      // vm.$message.success('删除成功!', 2);
      // vm.getManagetList();
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
  /**
   * 编辑管理员
   */
  editManager(id: string) {
    this.id = id;
    this.visible = !this.visible;
  }

  /**
   * 创建管理员
   */
  submit(val:any) {
    const vm:any = this;
    const params = {
      users: [],
      appPackages: [],
      departments: [],
      dataQuery: val.dataQuery,
      dataManage: val.dataManage,
      id: vm.id
    };

    params.users = val.users.map((res:any) => ({ id: res.id }));

    params.appPackages = val.appPackages.map((res:any) => {
      const { name, code } = res;
      return {
        name,
        code,
        adminId: vm.id,
        id: ''
      };
    });

    params.departments = val.departments.map((res:any) => ({
      adminId: vm.id,
      id: res.id,
      name: res.name,
      queryCode: res.queryCode ? res.queryCode : '',
      unitType: res.unitType,
      unitId: res.id
    }));

    if (vm.id) {
      systemApi.upDateDataManager(params).then((res:any) => {
        if (res.errcode === 0) {
          vm.getManagetList();
          vm.id = '';
        } else {
          vm.$message.error(res.errmsg, 2);
        }
      });
    } else {
      systemApi.createdDataManager(params).then((res:any) => {
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

  // 分页 page change 回调
  pageChange(page: number, pageSize: number) {
    this.page = page - 1;
    this.size = pageSize;
    this.getManagetList();
  }
}
</script>
<style lang="less" scoped>
.data-manager{
  &__header{
    .data-manager__left{
      .delete{
        margin-right: 6px;
        color: rgba(0,0,0,0.25);
      }
      .w240{
        width: 240px;
      }
      float: left;
      input{
        width: 240px;
      }
    }
    .data-manager__right{
      float: right;
    }
  }
  &__content{
    .content__tips{
      color: rgba(0,0,0,0.45);
      font-size:12px;
      padding-bottom: 2px;
      line-height:20px;
    }
    /deep/.ant-table-body{
      max-height: calc(100vh - 260px - 22px)!important;
      color: rgba(0, 0, 0, 0.85);
    }
    // /deep/.ant-table-thead span {
    //   font-weight: 600;
    //   color: rgba(0,0,0,0.65);
    // }
    padding-top: 16px;
    .highlight {
      color: @primary-color;
    }
    .action{
      .edit{
        margin-right: 18px;
      }
    }
  }
  &__footer {
    margin-left: -24px;
    margin-right: -24px;
    /*border-top: 1px solid rgba(232,232,232,1);*/

    &>div{
      float: right;
      padding: 10px 0;
      margin-right: 24px;
    }
  }
  /deep/.ant-pagination-options{
    height: 26px;
    .ant-pagination-options-size-changer{
      margin-top: 1px;
    }
  }
  /deep/.ant-pagination-total-text{
    margin-right: @base4-padding-md;
  }
}
</style>
