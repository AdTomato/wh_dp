<template>
  <a-modal
    v-model="showModal"
    :title="modalTitle"
    :width="446"
    :cancelText="$t('languages.Apps.Cancel')"
    :okText="$t('languages.Apps.Ok')"
    @ok="submit"
    @cancel="cancel"
    :maskClosable="false"
    :keyboard="false"
  >
    <a-form class="add-user" :autoFormCreate="(form) => { this.form = form }">
      <a-form-item
        label="选择用户"
        fieldDecoratorId="user"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.user"
      >
        <staff-selector
          :options="userOpts"
          :disabled="userType === 1"
        ></staff-selector>
      </a-form-item>

      <a-form-item
        label="角色管理范围"
        fieldDecoratorId="ouScope"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
      >
        <staff-selector
          :options="ouScopeOpts"
        ></staff-selector>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { pattern, nameValidator } from '@/common/utils';
import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';

import OrgApi from '@/apis/organization';

@Component({
  name: "add-user",
  components: {
    StaffSelector
  }
})

export default class AddUser extends Vue {
  @Prop() value!: boolean;

  @Prop() userType!: number; // 0：新增，1：编辑

  @Prop() userData!: any;

  @Prop() roleData!: any;

  showModal: boolean = false;

  modalTitle: string = '新建用户';

  params: any = {
    user: [],
    ouScope: []
  };

  form: any = {};

  formItemLayout: any = {
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 18
    }
  };

  rules: any = {};

  userOpts = {
    selectOrg: true,
    selectUser: true,
    showModel: false,
    mulpitle: false,
    showSelect: true,
    placeholder: '请选择',
    appManagerFilter: true
  }

  ouScopeOpts = {
    selectOrg: true,
    selectUser: false,
    showModel: false,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择',
    appManagerFilter: true
  }

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      user: {
        rules: [
          {
            required: true,
            message: '用户不能为空'
          }
        ]
      }
    };
  }

  // 新建用户
  submit() {
    this.form.validateFields((err: any) => {
      if (!err) {
        const user = this.form.getFieldValue('user');
        const ouScopeData = this.form.getFieldValue('ouScope');
        const userIds = user ? user.map((u:any) => {
            return {
              id: u.id,
              unitType: u.unitType,
              name: u.name
            };
          }) : [];
        const ouScope = ouScopeData ? ouScopeData.map((ou:any) => { return ou.id }) : [];

        if (this.userType === 1) {
          // 更新用户管理范围
          let params:any = {};
          if (this.userData.unitType === 1) {
            params = {
              ouScopeList: ouScope,
              roleId: this.userData.roleId,
              deptId: this.userData.deptId,
              unitType: this.userData.unitType ? this.userData.unitType : 3,
            };
          } else {
            params = {
              ouScopeList: ouScope,
              roleId: this.userData.roleId,
              userId: this.userData.id,
              unitType: this.userData.unitType ? this.userData.unitType : 3,
            };
          }
          OrgApi.updateUserOuscope(params).then((res: any) => {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('修改用户成功！');
            this.$emit('reloadUser', 'save');
            this.cancel();
          });
        } else {
          // 新建用户
          const params = {
            roleId: this.roleData.id,
            userIds,
            ouScope
          };
          OrgApi.addRoleUser(params).then((res) => {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('添加用户成功！');
            this.$emit('reloadUser');
            this.cancel();
          });
        }
      }
    });
    
  }

  cancel() {
    this.form.resetFields();
    this.$emit('input', false);
  }

  @Watch('value')
  onValueChange(v: boolean) {
    this.showModal = v;
    if (!v) {
      return;
    }
    if (this.userType === 1) {
      this.modalTitle = '修改用户';
      this.$nextTick(() => {
        if (this.form.setFieldsValue) {
          const userId = this.userData.unitType === 1 ? this.userData.deptId : this.userData.id;
          const params = {
            roleId: this.userData.roleId,
            userId,
            unitType: this.userData.unitType ? this.userData.unitType : 3,
          };
          // 获取当前用户的角色管理范围
          OrgApi.getUserOuscope(params).then((res: any) => {
            let ouScope = [];
            if (!res.errcode) {
              ouScope = res.data ? res.data : [];
            }
            this.form.setFieldsValue({
              user: [{ id: userId, name: this.userData.name, unitType: this.userData.unitType }],
              ouScope
            });
          });
        }
      });
    } else {
      this.modalTitle = '新建用户';
      if (this.form.setFieldsValue) {
        this.form.setFieldsValue({
          user: [],
          ouScope: []
        });
      }
    } 
  }

}
</script>

<style lang="less" scoped>
.add-user{
  /deep/.has-error{
    .h3-organization__label{
      border-color: #F4454E;
    }
  }
}
</style>
