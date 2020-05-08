<template>
  <a-modal
    :title="'应用管理员'"
    :visible="visible"
    :width="408"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="addManager"
    @cancel="closeModel"
    :maskClosable="false"
    :keyboard="false"
  >
    <div class="add-app-manager">
      <a-row class="add-app-manager__item">
        <a-col :span = "layout.left" class="add-app-manager__left">
          <span class="label-required">管理员:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-app-manager__right">
          <template v-if="id">
            <span v-for="(u,idx) in users" :key="idx">{{ u.name }}</span>
          </template>
          <staff-selector
            v-else
            v-model="users"
            :options="taffSelectorOpts"
            @ok="addUsers"
            @change="selectChange"
          >
          </staff-selector>
          <!-- <div v-if="validate.users">
            <span class="error">管理员不能为空</span>
          </div> -->
        </a-col>
      </a-row>

      <a-row class="add-app-manager__item">
        <a-col :span = "layout.left" class="add-app-manager__left">
          <span class="label-required">应用:</span>
        </a-col>
        <a-col :span = "layout.right" class="add-app-manager__right">
          <apps-select
            v-model="selectData"
            @change="appsChange"
          />
          <!-- <div v-if="validate.apps">
            <span class="error">运用不能为空</span>
          </div> -->
        </a-col>
      </a-row>

      <a-row class="add-data-manager__item">
        <a-col :span = "layout.left" class="add-data-manager__left">
          <span >组织管理范围:</span>
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

    </div>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit, Watch } from 'vue-property-decorator';
import { State, Action, Mutation, namespace } from 'vuex-class';
import { pattern, nameValidator } from '@/common/utils';
import systemApi from '@/apis/system/system-manager.api';
import StaffSelector from "@cloudpivot/form/src/renderer/components/shared/staff-selector.vue";

import AppsSelect from '../manager-setting/apps-select.vue';


@Component({
  name: 'add-app-manager',
  components: {
    StaffSelector,
    AppsSelect
  }
})


export default class AddAppManager extends Vue {
  @Prop() visible!: boolean;
  @Prop() id!: string;

  selectData:Array<string> = []; // 运用app

  copySelectData:Array<string> =[];

  layout = {
    left: 6,
    right: 18
  }

  taffSelectorOpts = {
    selectOrg: false,
    selectUser: true,
    showModel: true,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择',
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

  departments = []; // 组织或角色

  users = [];

  treeData = [];

  validate = {
    users: false,
    apps: false
  }

  addDepartments(val:any) {
    this.departments = val;
  }

  clearChoose() {
    this.users = [];
    this.selectData = [];
  }

  addManager() {
    if (this.users.length === 0 || this.selectData.length === 0) {
      this.$message.info('应用与管理员不能为空');
      return;
    }
    const obj = {
      users: this.users,
      appPackages: this.selectData,
      departments: this.departments
    };
    this.$emit('submit', obj);
    this.clearChoose();
  }

  closeModel() {
    this.clearChoose();
    this.$emit('cancel');
  }

  selectChange() {
    if (this.users.length) {
      this.validate.users = false;
    } else {
      this.validate.users = true;
    }
  }

  appsChange() {

  }

  addUsers(val:any) {
    this.users = val;
  }

  @Watch('id', {
    immediate: true
  })
  onIdChange() {
    const vm: any = this;
    if (!vm.id) {
      vm.users = [];
      return;
    }
    const params = {
      id: vm.id
    };

    systemApi.getManagerInfo(params).then((res:any) => {
      if (res.data) {
        vm.selectData = res.data.appPackages;
        vm.copySelectData = JSON.parse(JSON.stringify(vm.selectData));
        //   .map((res:any) => {
        //   return res.code;
        // });
        vm.departments = res.data.departments;
        vm.users = [{
          id: res.data.userId,
          name: res.data.name,
          imgUrl: res.data.imgUrl
        }];
      }
    });
  }
}
</script>
<style lang="less" scoped>
.add-app-manager{
  &__item{
    margin-bottom: 20px;
    .add-app-manager__left {
      height: 32px;
      line-height: 32px;
    }
    .add-app-manager__right {
      .add-app-manager__select{
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
