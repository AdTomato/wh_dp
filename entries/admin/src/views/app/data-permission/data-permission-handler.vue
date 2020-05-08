<template>
  <div class="data-permission-handler" v-if="generated">
    <section class="data-permission-handler__form">
      <div class="data-permission-handler__form-item">
        <span class="label-required">权限名称</span>
        <p>
          <form-input
            v-if="lang === 'zh'"
            v-model="form.name"
            placeholder="请输入"
            :rules="rules.name"
          />
          <form-input
            v-else
            v-model="form.name_i18n[lang]"
            placeholder="请输入"
            :rules="rules.name"
          />
        </p>
      </div>
      <div class="data-permission-handler__form-item">
        <span class="label-required">角色</span>
        <p class="role-select" :class="{ hasError: emptyRoles }">
          <role-tree
            v-model="form.roles"
            placeholder="请选择角色"
            :treeCheckable="true"
            @change="changeRoles"
            @onLoad="setTableHeight"
            ref="roleSelect"
          />
          <span v-if="emptyRoles" class="errortip">请选择角色</span>
        </p>
      </div>
    </section>
    <section class="data-permission-handler__tabs">
      <a-tabs :animated="false" v-model="bizPermType">
        <a-tab-pane tab="新增时" key="1">
          <data-item :tableHeight="height" :dataItems="currentDataItems" :bizPermType="bizPermType"/>
        </a-tab-pane>
        <a-tab-pane tab="查看时" key="2">
          <data-item :tableHeight="height" :dataItems="currentDataItems" :bizPermType="bizPermType"/>
        </a-tab-pane>
        <a-tab-pane tab="编辑时" key="3">
          <data-item :tableHeight="height" :dataItems="currentDataItems" :bizPermType="bizPermType"/>
        </a-tab-pane>
      </a-tabs>
    </section>
    <section class="data-permission-handler__footer">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="save">保存</a-button>
    </section>
  </div>
</template>
<script lang="ts">
import {
  Component, Vue, Prop, Mixins
} from 'vue-property-decorator';
import FormInput from '@/components/global/form-input/index.vue';
import RoleTree from '@/components/shared/user/role-tree.vue';
import { nameValidator } from '@/common/utils';
import * as dataPermissionApi from '@/apis/data-permission';
import DataItem from './data-item.vue';

@Component({
  name: 'data-permission-handler',
  components: {
    FormInput,
    RoleTree,
    DataItem,
  }
})
export default class DataPermissionHandler extends Vue {
  @Prop() schemaCode!: string;

  @Prop() dataItems!: any[];

  @Prop() mode!: string;

  @Prop() permData!: any;

  get currentDataItems() {
    debugger;
    switch (+this.bizPermType) {
      case 1:
        return this.form.addDataItems;
      case 2:
        return this.form.viewDataItems;
      case 3:
        return this.form.editDataItems;
      default:
        return this.form.addDataItems;
    }
  }

  get lang() {
    return this.$i18n.locale;
  }

  // 校验规则
  rules: any = {
    name: [
      {
        required: true,
        message: '请填写权限名称'
      },
      {
        validator: nameValidator,
        message: '仅限50个字符以内，并不能以空格开头'
      }
    ]
  }

  emptyRoles: boolean = false;

  // 表单信息
  form: any = {
    name: '',
    name_i18n: {},
    roles: [],
    addDataItems: [],
    viewDataItems: [],
    editDataItems: [],
  }

  // 数据初始化是否已完成
  generated: boolean = false;

  bizPermType: string = '1';

  /**
   * 初始化新建的数据项权限基础数据
   */
  initAdd() {
    // debugger;
    // 默认可见/可写
    this.form.addDataItems = JSON.parse(JSON.stringify(this.dataItems));
    this.form.addDataItems.forEach((item: any) => {
      item.visible = true;
      item.writeAble = true;
      item.required = item.propertyEmpty;
    });
    this.form.viewDataItems = JSON.parse(JSON.stringify(this.dataItems));
    this.form.viewDataItems.forEach((item: any) => {
      item.visible = true;
    });
    this.form.editDataItems = JSON.parse(JSON.stringify(this.dataItems));
    this.form.editDataItems.forEach((item: any) => {
      item.visible = true;
      item.writeAble = true;
      item.required = item.propertyEmpty;
    });
    this.generated = true;
  }

  /**
   * 初始化编辑的数据项权限基础数据
   */
  initEdit() {
    this.form.name = this.permData.name;
    this.form.name_i18n = Object.assign({}, JSON.parse(this.permData.name_i18n));
    this.form.roles = this.permData.roles;
    this.form.addDataItems = this.generateList(1);
    this.form.viewDataItems = this.generateList(2);
    this.form.editDataItems = this.generateList(3);
    this.generated = true;
  }

  /**
   * 生成整理数据
   */
  generateList(bizPermType: number) {
    // debugger;
    // if (bizPermType ===1) {
    //   debugger;
    // }
    const curSchemaCode = this.schemaCode;
    const list: any[] = this.permData.permProperties.filter((item: any) => item.bizPermType === bizPermType);
    const result: any[] = this.dataItems.map((item: any) => { // parentCode
      // if (item.propertyType === 9) {
      //   debugger;
      // }
      const existed: any = list.find((itm: any) => { // schemaCode
        if (item.parentCode) {
          return item.parentCode === itm.schemaCode && itm.propertyCode === item.propertyCode
        } else {
          return itm.propertyCode === item.propertyCode && itm.schemaCode === curSchemaCode;
        }
      });
      const res:any = Object.assign({}, item, existed || {});
      if (item.propertyEmpty && bizPermType !== 2 && this.mode === 'edit') {
        res.required = true;
        res.writeAble = true;
        res.visible = true;
      }
      return res;
    });
    return [...result];
  }

  /**
   * 选择角色
   */
  changeRoles() {
    this.emptyRoles = false;
    setTimeout(() => {
      this.setTableHeight();
    },800)
  }

  height = 500;

  setTableHeight() {
    // debugger;
    const roleSelect:any = this.$refs.roleSelect;
    if (roleSelect) {
      const h = roleSelect.$el.clientHeight;
      const docH = document.body.clientHeight;
      this.height = docH - h - 310;
    }
  }

  /**
   * 取消
   */
  cancel() {
    this.$emit('close');
  }

  /**
   * 生成提交接口需求的数据格式
   */
  genProperty(arr: any[], bizPermType: number) {
    const list: Array<dataPermissionApi.permissionProperty> = [];
    arr.forEach((item: any) => {
      const res: any = {
        bizPermType,
        name: item.name,
        name_i18n: JSON.stringify(item.name_i18n),
        propertyCode: item.propertyCode,
        propertyType: item.propertyType,
        required: item.required,
        visible: item.visible,
        writeAble: item.writeAble,
        schemaCode: item.parentCode || this.schemaCode
      };
      if (this.mode === 'edit') {
        res.groupId = item.groupId;
        res.id = item.id;
      }
      list.push(res);
    });
    return list;
  }

  /**
   * 校验表单填写内容
   */
  validateForm() {
    return new Promise((resolve, reject) => {
      let hasError: boolean = false;
      const inputs: any[] = this.$vnode.componentInstance
        ? this.$vnode.componentInstance.$children.filter((el: any) => el.$el.className.includes('form-input'))
        : [];
      inputs.forEach((node: any) => {
        const unValidated: boolean = node.validateValue({ target: { value: node.content } });
        if (unValidated) {
          hasError = true;
        }
      });
      if (hasError) {
        reject(new Error('validate failed'));
      } else {
        resolve();
      }
    });
  }

  /**
   * 保存按钮事件
   */
  save() {
    this.emptyRoles = !this.form.roles || !this.form.roles.length;
    this.validateForm().then(() => {
      if (this.emptyRoles) {
        return;
      }
      this.submit();
    }).catch(() => { });
  }

  /**
   * 提交数据
   */
  submit() {
    const addPerms: Array<dataPermissionApi.permissionProperty> = this.genProperty(this.form.addDataItems, 1);
    const viewPerms: Array<dataPermissionApi.permissionProperty> = this.genProperty(this.form.viewDataItems, 2);
    const editPerms: Array<dataPermissionApi.permissionProperty> = this.genProperty(this.form.editDataItems, 3);
    const params: dataPermissionApi.updateParams = {
      enabled: true,
      roles: JSON.stringify(this.form.roles),
      schemaCode: this.schemaCode,
      permProperties: [
        ...addPerms,
        ...viewPerms,
        ...editPerms,
      ],
    };
    if (this.mode === 'edit') {
      params.id = this.permData.id;
      params.enabled = this.permData.enabled;
    }
    if (this.form.name) {
      params.name = this.form.name;
      this.form.name_i18n.zh = this.form.name;
    } else {
      params.name = this.form.name_i18n[this.$i18n.locale];
    }
    params.name_i18n = JSON.stringify(this.form.name_i18n);

    dataPermissionApi.updatePermission(params).then((res: any) => {
      if (res.errcode === 0) {
        this.$message.success('保存成功！');
        this.$emit('close', true);
      }
    });
  }

  mounted() {
    if (this.mode === 'edit') {
      dataPermissionApi.getPermProperties({
        groupId: this.permData.id
      }).then((res: any) => {
        if (res.errcode === 0 && Array.isArray(res.data)) {
          this.permData.permProperties = res.data.map((item: any) => {
            item.name_i18n = JSON.parse(item.name_i18n);
            return item;
          });
        } else {
          this.permData.permProperties = [];
        }
        this.initEdit();
      });
    } else {
      this.initAdd();
    }
  }
}
</script>
<style lang="less" scoped>
.data-permission-handler {
  height: 100%;
  // padding-bottom: 50px;
  &__form-item {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    color: rgba(0, 0, 0, 0.65);
    > span {
      display: inline-block;
      width: 84px;
      margin-right: 8px;
    }
    > p {
      flex: 1;
    }
    /deep/.ant-input {
      font-family: initial;
      width: 310px;
    }
  }
  /deep/.ant-tabs-bar{
    margin: 0;
  }
  &__footer {
    position: absolute;
    z-index: 9;
    bottom: 0;
    left: 0;
    right: 0;
    height: 53px;
    line-height: 50px;
    border-top: 1px solid #e8e8e8;
    text-align: center;
    background: #fff;
    button:first-child {
      margin-right: 10px;
    }
  }
  .role-select {
    position: relative;
    .errortip {
      position: absolute;
      bottom: -16px;
      left: 0;
      right: 0;
      font-size: 12px;
      font-family: PingFang-SC-Regular;
      font-weight: 400;
      color: rgb(245, 34, 45);
    }
    &.hasError {
      /deep/.ant-select-selection {
        border-color: rgb(245, 34, 45);
      }
    }
  }
}
</style>
<style lang="less">
.ant-select-tree-dropdown {
  max-height: 60vh !important;
}
.ant-select-tree li span.ant-select-tree-checkbox{
  display: none;
}
.ant-select-tree li span.ant-select-tree-checkbox + .ant-select-tree-node-content-wrapper{
  width: calc(100% - 24px);
}
.ant-select-tree>.ant-select-tree-treenode-checkbox-checked>.ant-select-tree-node-content-wrapper,
.ant-select-tree-child-tree .ant-select-tree-treenode-checkbox-checked .ant-select-tree-node-content-wrapper{
  background-color:#FAFAFA !important;
  font-weight: bold;
}
.ant-select-tree>.ant-select-tree-treenode-checkbox-checked>.ant-select-tree-node-content-wrapper::after,
.ant-select-tree-child-tree .ant-select-tree-treenode-checkbox-checked .ant-select-tree-node-content-wrapper::after{
  content: "\E98F";
  color: #17BC94;
  position: absolute;
  right: 8px;
  display: inline-block;
  font-family: "aufontAll" !important;
  font-weight: bold;
}
.ant-select-tree-node-content-wrapper{
  background-color: #ffffff !important;
}
.ant-select-tree-node-content-wrapper:after{
  content:'';
}
</style>
