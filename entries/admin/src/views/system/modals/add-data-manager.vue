<template>
  <a-modal
    :title="'数据管理员'"
    :visible="visible"
    :width="408"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    :maskClosable="false"
    @ok="addManager"
    @cancel="closeModel"
  >
    <div class="add-data-manager">

      <a-row class="add-data-manager__item">
        <a-col :span = "layout.left" class="add-data-manager__left">
          <span class="label-required">管理员:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-data-manager__right">
          <template v-if="id">
            <span v-for="(u, idx) in users" :key="idx">{{ u.name }}</span>
          </template>
          <staff-selector
            v-else
            v-model="users"
            :options="staffSelectorOpts"
            @ok="addUsers"
          >
          </staff-selector>
        </a-col>
      </a-row>

      <a-row class="add-data-manager__item">
        <a-col :span = "layout.left" class="add-data-manager__left">
          <span class="label-required">组织范围:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-data-manager__right">
          <staff-selector
            :options="stuffOrOrgSelectorOpts"
            v-model="departments"
            @ok="addDepartments"
          >
          </staff-selector>
        </a-col>
      </a-row>

      <a-row class="add-data-manager__item">
        <a-col :span = "layout.left" class="add-data-manager__left">
          <span class="label-required">应用:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-data-manager__right">
          <apps-select
            v-model="selectData"
          />
        </a-col>
      </a-row>

      <a-row class="add-data-manager__item" v-show="false">
        <a-col :span = "layout.left" class="add-data-manager__left">
          <span>查看数据:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-data-manager__right">
          <a-checkbox v-model="dataQuery"/>
        </a-col>
      </a-row>

      <a-row class="add-data-manager__item" v-show="false">
        <a-col :span = "layout.left" class="add-data-manager__left">
          <span>管理数据:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-data-manager__right">
          <a-checkbox v-model="dataManage" @change="dataManageChange"/>
        </a-col>
      </a-row>

    </div>
  </a-modal>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Emit, Watch
} from 'vue-property-decorator';
import {
  State, Action, Mutation, namespace
} from 'vuex-class';
import { pattern, nameValidator } from '@/common/utils';

import systemApi from '@/apis/system/system-manager.api';
import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';

import AppsSelect from '../manager-setting/apps-select.vue';


@Component({
  name: 'add-data-manager',
  components: {
    StaffSelector,
    AppsSelect
  }
})


export default class AddDataManager extends Vue {
  @Prop() visible!: boolean;

  @Prop() id!: string;

  selectData:Array<string> = [];

  layout = {
    left: 6,
    right: 18
  }

  // 选人
  staffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    showModel: true,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择'
  }

  // 选人与选组织
  stuffOrOrgSelectorOpts = {
    selectOrg: true,
    selectUser: false,
    showModel: true,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择'
  }

  users = []; // 用户

  treeData = [];

  departments = []; // 组织或角色

  dataQuery = true; // 数据查看权限

  dataManage = true; // 数据管理权限


  addManager() {
    if (this.users.length === 0
    || this.selectData.length === 0
    || this.departments.length === 0
    ) {
      this.$message.info('应用、组织范围与管理员不能为空');
      return;
    }

    const obj = {
      users: this.users,
      departments: this.departments,
      appPackages: this.selectData,
      dataQuery: this.dataQuery,
      dataManage: this.dataManage
    };
    this.$emit('submit', obj);
  }

  dataManageChange() {
    this.dataQuery = this.dataManage;
  }

  closeModel() {
    this.$emit('cancel');
  }

  addUsers(val:any) {
    this.users = val;
  }

  addDepartments(val:any) {
    this.departments = val;
  }

  @Watch('id', {
    immediate: true
  })
  onIdChange() {
    const vm: any = this;
    if (!vm.id) {
      vm.users = []; // 用户
      vm.treeData = [];
      vm.departments = []; // 组织或角色
      vm.dataQuery = true;
      vm.dataManage = true;
      return;
    }
    const params = {
      id: vm.id
    };
    systemApi.getManagerInfo(params).then((res:any) => {
      if (res.data) {
        vm.selectData = res.data.appPackages;
        // .map((res:any) => {
        //   return res.code;
        // });
        vm.departments = res.data.departments;

        vm.users = [{
          id: res.data.userId,
          name: res.data.name,
          imgUrl: res.data.imgUrl
        }];

        vm.dataQuery = res.data.dataQuery;

        vm.dataManage = res.data.dataManage;
      }
    });
  }

  /**
   * 选人控件placeholder多语言
   */
  placeHolderLang() {
    this.staffSelectorOpts.placeholder = this.$t('Languages.Apps.PlzSelect') as string;
    this.stuffOrOrgSelectorOpts.placeholder = this.$t('Languages.Apps.PlzSelect') as string;
  }

  // 日期控件国际化
  @Watch('$i18n.locale')
  onLanguageChange(val: any) {
    this.placeHolderLang();
  }
}
</script>
<style lang="less" scoped>
.add-data-manager{
  &__item{
    margin-bottom: 20px;
    .add-data-manager__left{
      height: 32px;
      line-height: 32px;
    }
    .add-data-manager__right{
      .add-data-manager__select{
        width: 100%;
      }
      &>span{
        height: 32px;
        line-height: 32px;
      }
    }
  }
}
</style>
