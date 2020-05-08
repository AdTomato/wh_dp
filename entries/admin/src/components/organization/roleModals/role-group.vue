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
    <a-form class="add-role-group" :autoFormCreate="(form) => { this.form = form }">
      <a-form-item
        label="角色组名称"
        fieldDecoratorId="gruopName"
        :labelCol="formItemLayout.labelCol"
        :wrapperCol="formItemLayout.wrapperCol"
        :fieldDecoratorOptions="rules.gruopName"
      >
        <a-input
          class="role-group__name"
          maxlength="50"
          placeholder="请输入名称"
        />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

import { pattern, nameValidator } from '@/common/utils';

import OrgApi from '@/apis/organization';

@Component({
  name: "add-role-group"
})

export default class AddRoleGroup extends Vue {
  @Prop() value!: boolean;

  @Prop() roleGroupType!: number; // 0：新增，1：编辑

  @Prop() roleGroupData!: any;

  showModal: boolean = false;

  modalTitle: string = '新建角色组';

  params: any = {
    gruopName: ''
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
      gruopName: {
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
      }
    };
  }

  submit() {
    this.form.validateFields((err: any) => {
      if (!err) {
        const gruopName = this.form.getFieldValue('gruopName');

        if (this.roleGroupType === 1) {
          // 编辑角色组接口
          const params: any = {
            roleGroupName: gruopName,
            roleGroupId: this.roleGroupData ? this.roleGroupData.id : '',
          };
          OrgApi.updateRoleGroup(params).then((res:any) =>  {
            if (res.errcode) {
              this.$message.error(res.errmsg);
              return;
            }

            this.$message.success('编辑成功！');
            this.$emit('reloadTree');
            this.cancel();
          });
        } else {
          // 新增角色组接口
          const params: any = {
            roleGroupName: gruopName
          };
          OrgApi.addRoleGroup(params).then((res:any) =>  {
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
    if (this.roleGroupType === 1) {
      this.modalTitle = '编辑角色组';
      this.$nextTick(() => {
        if (this.form.setFieldsValue) {
          this.form.setFieldsValue({
            gruopName: this.roleGroupData.name,
          });
        }
      });
    } else {
      this.modalTitle = '新建角色组';
    } 
  }

}
</script>

<style lang="less" scoped>
</style>
