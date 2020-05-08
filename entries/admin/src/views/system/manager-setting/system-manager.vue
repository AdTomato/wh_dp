<template>
  <div class="system-manager">
    <div class="system-manager__header clearfix">
      <div class="system-manager__left">
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
      <div class="system-manager__right">
        <a-button type="primary" @click="taffSelectorOpts.showModel = !taffSelectorOpts.showModel">
          <a-icon type="plus"/>
          <span>新增管理员</span>
        </a-button>
        <staff-selector
          style="display: none"
          v-model="user"
          :options="taffSelectorOpts"
          @ok="submit"
          @cancel="cancel"
        ></staff-selector>
      </div>
    </div>
    <div class="system-manager__content">
      <p class="content__tips">系统管理员：系统的前后台所有管理权限</p>
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
        <span slot="actionTitle" class="resize">操作</span>
        <p
          slot="departmentName"
          slot-scope="text, record"
          class="text-ellipsis"
        >{{ text }}</p>
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
        <!-- 管理员删除 -->
        <div
          class="action right"
          slot="action"
          slot-scope="text, record"
        >
          <a-popconfirm
            placement="left"
            :cancelText="$t('languages.Apps.Cancel')"
            :okText="$t('languages.Apps.Ok')"
            v-if="filterData.length"
            title="确定要删除当前管理员么?"
            @confirm="() => deleteManager(record.key)"
          >
            <a href="javascript:;">
              <i class="icon aufontAll h-icon-all-delete-o"></i>
            </a>
          </a-popconfirm>
        </div>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';
import systemApi from '@/apis/system/system-manager.api';
@Component({
  name: 'system-manager',
  components: {
    StaffSelector
  }
})
export default class SystemManager extends Vue {
  keyWords: string = '';

  taffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    showModel: false,
    mulpitle: true,
    showSelect: false,
    placeholder: '请选择'
  }

  user: Array<any> = [];

  dataSource = [];

  filterData = [];

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
      width: '27%',
      key: 'username'
    },
    {
      dataIndex: 'name',
      slots: { title: 'nameTitle' },
      scopedSlots: { customRender: 'name' },
      width: '27%',
      key: 'name'
    },
    {
      dataIndex: 'departmentName',
      slots: { title: 'departmentNameTitle' },
      scopedSlots: { customRender: 'departmentName' },
      key: 'departmentName',
      width: '27%'
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
  }

  /**
   * 清空关键词
   */
  clearKeyWords() {
    this.keyWords = '';
    this.filterDataSource();
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
    let reg = new RegExp(vm.keyWords);
    vm.filterData = this.dataSource.filter(
      (res: any) => reg.test(res.username)
      || reg.test(res.name.toLowerCase())
      || reg.test(res.pinYin.toLowerCase())
      || reg.test(res.shortPinYin.toLowerCase())
    );
  }

  /**
   * 选人控件取消
   */
  cancel() {
    this.taffSelectorOpts.showModel = false;
  }

  /**
   * 新增管理员
   */
  submit(val: Array<any>) {
    this.taffSelectorOpts.showModel = false;
    const vm: any = this;
    if (!val || val.length === 0) {
      return;
    }

    const targerArr = val.map((res: any) => ({ id: res.id }));

    const params = {
      users: targerArr
    };

    systemApi.creatSystemManager(params).then((res: any) => {
      if (res.errcode === 0) {
        vm.$message.success('添加成功!');
        vm.getManagetList();
        vm.user = [];
      } else {
        vm.$message.error(res.errmsg, 2);
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

  // 获取管理员列表
  getManagetList() {
    const vm: any = this;
    const params = {
      managerType: 1
    };

    systemApi.getListManager(params).then((res: any) => {
      if (!res.errcode && res.data) {
        vm.dataSource = res.data;
        vm.dataSource.forEach((item: any, index: number) => {
          item.index = index + 1;
          item.key = item.id;

          if (!item.departmentName) {
            item.departmentName = [];
          }
          item.departmentName.reverse();
          if (item.departmentName && item.departmentName.length > 3) {
            const arr: Array<string> = [
              item.departmentName[0],
              '...',
              item.departmentName[item.departmentName.length - 1]
            ];
            item.departmentName = arr;
          }
          Object.entries(item).forEach((data:any) => {
            const [key, value] = data;
            if (typeof value !== 'boolean' && !value) {
              item[key] = '- -';
            }
          });

          item.departmentName = item.departmentName.join('/');
        });
        vm.filterDataSource();
      } else {
        vm.dataSource = [];
        vm.filterDataSource();
      }
    });
  }
}
</script>
<style lang="less" scoped>
.system-manager {
  &__header {
    .system-manager__left {
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
    .system-manager__right {
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
  }
}
</style>
