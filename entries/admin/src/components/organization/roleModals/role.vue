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
    <a-form class="add-role" :autoFormCreate="(form) => { this.form = form }">
      <a-form-item
        label="角色名称"
        fieldDecoratorId="roleName"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.roleName"
      >
        <a-input
          class="role__name"
          maxlength="50"
          placeholder="请输入名称"
        />
      </a-form-item>

      <a-form-item
        label="角色组"
        fieldDecoratorId="roleGroup"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.roleGroup"
      >
        <a-select
          class="role-select"
          :disabled="roleType === 1"
          :placeholder="$t('languages.PlaceHolder.Select')"
        >
          <a-select-option
            v-for="(group, i) in sysTreeData"
            :key="i"
            :value="group.id"
          >{{ group.name }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { pattern, nameValidator } from '@/common/utils';

import OrgApi from '@/apis/organization';

@Component({
  name: "add-role"
})

export default class AddRole extends Vue {
  @Prop() value!: boolean;

  @Prop() roleType!: number; // 0：新增，1：编辑

  @Prop() roleData!: any;

  @Prop() treeData!: any;

  get sysTreeData() {
    if (!this.treeData) {
      return [];
    }
    return this.treeData.filter((tree:any) => tree.roleType === 'SYS');
  }

  showModal: boolean = false;

  modalTitle: string = '新建角色';

  params: any = {
    roleName: '',
    roleGroup: ''
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

  beforeMount() {
    this.setRules();
  }

  setRules() {
    this.rules = {
      roleName: {
        rules: [
          {
            required: true,
            message: '名称不能为空'
          },
          {
            validator: nameValidator,
            message: this.$t('languages.Apps.AppNameRule')
            // 仅限50个字符以内，并不能以空格开头
          }
        ]
      },
      roleGroup: {
        rules: [
          {
            required: true,
            message: '角色组不能为空'
          }
        ]
      }
    };
  }

  // 新建角色
  submit() {
    this.form.validateFields((err: any) => {
      if (!err) {
        const roleName = this.form.getFieldValue('roleName');
        const roleGroup = this.form.getFieldValue('roleGroup');
        if (this.roleType === 1) {
          // 更新角色
          const params = {
            roleName,
            roleId: this.roleData ? this.roleData.id : '',
            roleGroupId: this.roleData ? this.roleData.groupId : '',
          };
          OrgApi.updateRole(params).then((res:any) => {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('修改成功！');
            this.$emit('reloadTree');
            this.$emit('nameChange', params);
            this.cancel();
          });
        } else {
          // 新建角色
          const params = {
            roleName,
            roleGroupId: roleGroup
          };
          OrgApi.addRole(params).then((res:any) => {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('创建成功！');
            this.$emit('reloadTree');
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
    if (this.roleType === 1) {
      this.modalTitle = '修改角色';
      this.$nextTick(() => {
        if (this.form.setFieldsValue) {
          this.form.setFieldsValue({
            roleName: this.roleData.name,
            roleGroup: this.roleData.groupId
          });
        }
      });
    } else {
      this.modalTitle = '新建角色';
    } 
  }

}
</script>

<style lang="less" scoped>
</style>
