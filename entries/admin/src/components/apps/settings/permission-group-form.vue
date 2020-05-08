
<template>
  <div class="permission-group-form">
    <h4>{{ $t('languages.appSettings.AddPermissionGroup') }}</h4>

    <a-row type="flex">
      <a-col :span="4">{{ $t('languages.appSettings.GroupName') }}</a-col>
      <a-col :span="20" :class="{ error:error.name }">
        <a-input v-model="name"></a-input>
        <div class="message" v-show="error.name">{{ $t('languages.Apps.NameRule') }}</div>
      </a-col>
    </a-row>

    <a-row type="flex">
      <a-col :span="4">{{ $t('languages.appSettings.SetType') }}</a-col>
      <a-col :span="20" class="checkbox">
        <a-radio-group v-model="setType" @change="onSetTypeChange">
          <a-radio :value="0">{{ $t('languages.appSettings.AsOrg') }}</a-radio>
          <a-radio :value="1">{{ $t('languages.appSettings.AsRole') }}</a-radio>
        </a-radio-group>
        <!--<div class="message" v-show="error.staffs">{{ $t('languages.appSettings.IncludeRule') }}</div>-->
      </a-col>
    </a-row>
    <a-row type="flex" v-show="visibleType.isExternalUser">
      <a-col :span="4">{{ $t('languages.appSettings.IncludeOrg') }}</a-col>
      <a-col :span="20" :class="{ error:error.staffs }">
        <staff-selector v-model="staffs" :options="staffSelectorOpts"></staff-selector>
        <div class="message" v-show="error.staffs">{{ $t('languages.appSettings.IncludeRuleOrg') }}</div>
      </a-col>
    </a-row>

    <a-row type="flex" v-show="visibleType.roles">
      <a-col :span="4">{{ $t('languages.appSettings.IncludeRole') }}</a-col>
      <a-col :span="20" :class="{ error:error.roles }">
        <role-tree 
          v-model="roles" 
          :placeholder="$t('languages.appSettings.PlzSelectRole')"
          :treeCheckable="true"
        />
        <div class="message" v-show="error.roles">{{ $t('languages.appSettings.IncludeRule') }}</div>
      </a-col>
    </a-row>

    <a-row type="flex" v-show="visibleType.isExternalUser">
      <a-col :span="4">
        {{ $t("languages.appSettings.externalUser") }}
        <a-tooltip :title="$t('languages.appSettings.externalUserTips')" style="margin-left:8px;">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </a-col>
      <a-col
        :span="20"
        class="checkbox"
        :class="{ error:error.isExternalUser }"
      >
        <a-checkbox v-model="isExternalUser"></a-checkbox>
        <div class="message" v-show="error.isExternalUser">{{ $t('languages.appSettings.IncludeRuleOrg') }}</div>
      </a-col>
    </a-row>

    <!--<template v-if="groupId">-->
    <template>
      <h4>{{ $t('languages.appSettings.permissionSetting') }}</h4>
      <div 
        v-for="(item,index) in list" 
        :key="index"
        class="panel-content"
        @click="collapse(index)"
      >
        <h3-panel
          :title="item.name"
          :collapsible="true"
          :collapsed="index === curIndex"
          
        >
          <div 
            class="permission-group-panel-wrapper" 
            v-for="(childItem,childIndex) in item.children" 
            :key="childIndex"
          >
            <div class="permission-group-panel-item">
              <div class="item-title">
                <span>{{ childItem.name }}</span>
                <span>
                  <a-checkbox 
                    :checked="childItem.visible"
                    v-if="childItem.visible !== undefined"
                    @change="e => setField(childItem,'visible',e.target.checked)"
                  >
                    {{ $t('languages.appSettings.visible') }}
                  </a-checkbox>
                </span>
              </div>
            </div>
            <div 
              class="permission-group-panel-item" 
              v-if="childItem.dataPermissionType !== undefined && childItem.nodeType !== 'Page' && childItem.nodeType !== 'Report'"
            >
              <div class="item-list">
                <span>{{ $t('languages.appSettings.dataPermission') }}</span>
                <ul>
                  <li 
                    :class="childItem.dataPermissionType == 1 ? 'active' : ''"
                    @click="dataPermissionSelect(childItem,1)"
                  >
                    {{ $t('languages.appSettings.AllVisible') }}
                  </li>
                  <li 
                    :class="childItem.dataPermissionType == 3 ? 'active' : ''"
                    @click="dataPermissionSelect(childItem,3)"
                  >
                    {{ $t('languages.appSettings.OnlySelf') }}
                  </li>
                  <li 
                    :class="childItem.dataPermissionType == 2 ? 'active' : ''"
                    @click="dataPermissionSelect(childItem,2)"
                  >
                    {{ $t('languages.appSettings.MyDepartment') }}
                  </li>
                  <li 
                    :class="childItem.dataPermissionType == 5 ? 'active' : ''" 
                    v-if="visibleType.rolesRange"
                    @click="dataPermissionSelect(childItem,5)"
                  >
                    {{ $t('languages.appSettings.RoleManagerRange') }}
                  </li>
                  <li 
                    :class="childItem.dataPermissionType == 4 ? 'active' : ''"
                    @click="dataPermissionSelect(childItem,4,index,childIndex)"
                  >
                    {{ $t('languages.appSettings.Customize') }}
                  </li>
                </ul>
              </div>
            </div>
            <div 
              class="permission-group-panel-item"
              v-if="childItem.actionPermission && childItem.nodeType !== 'Page' && childItem.nodeType !== 'Report'"
            >
              <div class="item-list">
                <span>{{ $t('languages.appSettings.permissionAction') }}</span>
                <ul>
                  <li 
                    :class="childItem.actionPermission.creatable ? 'active' : ''"
                    @click="actionPermissionSelect(childItem.actionPermission,'creatable')"
                  >
                    {{ $t('languages.appSettings.Add') }}
                  </li>
                  <li 
                    :class="childItem.actionPermission.editable ? 'active' : ''"
                    @click="actionPermissionSelect(childItem.actionPermission,'editable')"
                  >
                    {{ $t('languages.appSettings.Edit') }}
                  </li>
                  <li 
                    :class="childItem.actionPermission.deletable ? 'active' : ''"
                    @click="actionPermissionSelect(childItem.actionPermission,'deletable')"
                  >
                    {{ $t('languages.appSettings.Delete') }}
                  </li>
                  <li
                    :class="childItem.actionPermission.importable ? 'active' : ''"
                    @click="actionPermissionSelect(childItem.actionPermission,'importable')"
                  >
                    {{ $t('languages.appSettings.Import') }}
                  </li>
                  <li 
                    :class="childItem.actionPermission.exportable ? 'active' : ''"
                    @click="actionPermissionSelect(childItem.actionPermission,'exportable')"
                  >
                    {{ $t('languages.appSettings.Export') }}
                  </li>
                  <li 
                    :class="childItem.actionPermission.printAble ? 'active' : ''"
                    @click="actionPermissionSelect(childItem.actionPermission,'printAble')"
                  >
                    {{ $t('languages.appSettings.PrintQr') }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </h3-panel>
      </div>
      <!-- <a-table
        class="permission-group-form-table-wrapper"
        :columns="columns"
        :dataSource="list"
        :pagination="false"
        :scroll="{ x: 1420 }"
      >
        <span slot="expandIcon" slot-scope="props">
          <a-icon type="left"></a-icon>
        </span>

        <span slot="visible" slot-scope="visible, record, index">
          <a-checkbox
            v-if="visible !== undefined"
            :checked="visible"
            @change="e => setField(record,'visible',e.target.checked)"
          />
        </span>

        <span
          slot="dataPermissionType"
          slot-scope="dpt, record, index"
          class="setting-groups"
        >
          <a-radio-group
            v-if="dpt !== undefined && record.nodeType !== 'Page' && record.nodeType !== 'Report'"
            v-model="record.dataPermissionType"
            @change="e => record.edit = true"
          >
            <a-radio :value="1">{{ $t('languages.appSettings.AllVisible') }}</a-radio>
            <a-radio :value="3">{{ $t('languages.appSettings.OnlySelf') }}</a-radio>
            <a-radio :value="2">{{ $t('languages.appSettings.MyDepartment') }}</a-radio>
            <a-radio v-if="visibleType.rolesRange" :value="5">{{ $t('languages.appSettings.RoleManagerRange') }}</a-radio>
            <a-radio :value="4">{{ $t('languages.appSettings.Customize') }}</a-radio>
          </a-radio-group>
          <a @click="openConditionModal(record)" v-show="dpt === 4">{{ $t('languages.appSettings.set') }}</a>
        </span>

        <span slot="actionPermission" slot-scope="ap, record, index">
          <template v-if="ap && record.nodeType !== 'Page' && record.nodeType !== 'Report'">
            <a-checkbox
              :checked="ap.creatable"
              @change="e => setAction(record,ap,'creatable',e.target.checked)"
            >{{ $t('languages.appSettings.Add') }}</a-checkbox>

            <a-checkbox
              :checked="ap.editable"
              @change="e => setAction(record,ap,'editable',e.target.checked)"
            >{{ $t('languages.appSettings.Edit') }}</a-checkbox>

            <a-checkbox
              :checked="ap.deletable"
              @change="e => setAction(record,ap,'deletable',e.target.checked)"
            >{{ $t('languages.appSettings.Delete') }}</a-checkbox>

            <a-checkbox
              :checked="ap.importable"
              @change="e => setAction(record,ap,'importable',e.target.checked)"
            >{{ $t('languages.appSettings.Import') }}</a-checkbox>

            <a-checkbox
              :checked="ap.exportable"
              @change="e => setAction(record,ap,'exportable',e.target.checked)"
            >{{ $t('languages.appSettings.Export') }}</a-checkbox>

            <a-checkbox
              :checked="ap.printAble"
              @change="e => setAction(record,ap,'printAble',e.target.checked)"
            >{{ $t('languages.appSettings.PrintQr') }}</a-checkbox>
          </template>
        </span>
      </a-table> -->

      <dataitem-condition-modal
        ref="conditionModal"
        :permission="record"
        @ok="onConditionModalOk"
        @cancel="onConditionModalCancel"
      ></dataitem-condition-modal>
    </template>

    <div class="ant-drawer-btn">
      <a-button class="cancel-btn" @click="cancel">{{ $t('languages.appSettings.cancel') }}</a-button>
      <a-button type="primary" @click="save">{{ $t('languages.appSettings.save') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop, Watch
} from 'vue-property-decorator';

import { State, namespace } from 'vuex-class';

import { Row, Col } from 'h3-antd-vue';

import h3Panel from './panel.vue';

import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';

import RoleTree from '@/components/shared/user/role-tree.vue';

import permissionApi from '@/apis/system/permission.api';

import DataitemConditionModal from './dataitem-condition-modal.vue';

const AppCenterModule = namespace('Apps/AppCenter');

@Component({
  name: 'permission-group-form',
  components: {
    ARow: Row,
    ACol: Col,
    h3Panel,
    StaffSelector,
    DataitemConditionModal,
    RoleTree
  }
})

export default class PermissionGroupForm extends Vue {
  @AppCenterModule.State('appInfo') appInfo: any;

  @Prop({
    default: ''
  })
  groupId!: string;

  isExternalUser:boolean = false;

  staffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    mulpitle: true,
    showModel: true,
    showSelect: true,
    placeholder: '请选择组织或用户'
  };

  name = '';

  setType = 0 as any;

  staffs = '' as any;

  roles = '' as any;

  record: BPM.System.AppFunctionPermissionModel = {} as any;

  error: any = {};

  visibleType = {
    staffs: true,
    isExternalUser: true,
    roles: false,
    rolesRange: false,
  };

  columns: any[] = [];

  list: any[] = [];

  curIndex: number = 0;

  beforeIndex: number | undefined;

  beforeChildIndex: number | undefined;

  beforeDataPermissionType: number = 0;

  setColumns() {
    this.columns = [
      {
        title: this.$t('languages.appSettings.function') as any,
        width: 240,
        fixed: 'left',
        dataIndex: 'name'
      },
      {
        title: this.$t('languages.appSettings.visible') as any,
        width: 90,
        dataIndex: 'visible',
        scopedSlots: { customRender: 'visible' }
      },
      {
        title: this.$t('languages.appSettings.dataPermission') as any,
        width: 520,
        dataIndex: 'dataPermissionType',
        scopedSlots: { customRender: 'dataPermissionType' }
      },
      {
        width: 520,
        title: this.$t('languages.appSettings.permissionAction') as any,
        dataIndex: 'actionPermission',
        scopedSlots: { customRender: 'actionPermission' }
      }
    ];
  }

  collapse(val: number) {
    this.curIndex = val;
  }

  getExpandIcon(props: any) {
    // console.log(props);
  }

  onSetTypeChange(e: any) {
    const type = e.target.value;
    this.setTypeChange(type);
    // permissionApi.updateAppPackage(params);
  }

  setTypeChange(type: any) {
    if(type === 0){
      this.$set(this.visibleType, 'staffs', true);
      this.$set(this.visibleType, 'isExternalUser', true);
      this.$set(this.visibleType, 'roles', false);
      this.$set(this.visibleType, 'rolesRange', false);
    }else {
      this.$set(this.visibleType, 'staffs', false);
      this.$set(this.visibleType, 'isExternalUser', false);
      this.$set(this.visibleType, 'roles', true);
      this.$set(this.visibleType, 'rolesRange', true);
    }
  }

  dataPermissionSelect(item: any, val:number,index?: number,childIndex?: number) {
    if(val === 4){
      this.openConditionModal(item);
      //选“自定义”取消没有保存后，焦点重新回到上一个
      this.beforeIndex = index;
      this.beforeChildIndex = childIndex;
      this.beforeDataPermissionType = item.dataPermissionType;
    }
    item.edit = true;
    item.dataPermissionType = val;
  }
  
  openConditionModal(record: any) {
    this.record = record;
    (this.$refs.conditionModal as DataitemConditionModal).show();
  }

  onConditionModalOk(val: any) {
    this.record.filterType = val.type;
    this.record.conditions = val.conditions;
  }

  onConditionModalCancel() {
    this.record = '' as any;
    if(this.beforeIndex !== undefined && this.beforeChildIndex !== undefined){
      this.list[this.beforeIndex].children[this.beforeChildIndex].dataPermissionType = this.beforeDataPermissionType;
    }
  }

  @Watch('groupId', {
    immediate: true
  })
  onGroupIdChange(groupId: string) {
    let appCode: string = '';
    if (!groupId) {
      appCode = this.$route.params.appCode || this.appInfo.code;
    }
    permissionApi.getGroup(groupId,appCode).then((res) => {
      if (res.errcode !== 0) {
        this.$message.error(res.errmsg);
        return;
      }

      const { data } = res;

      if (data) {
        this.name = data.name;
        this.isExternalUser = data.externalUser;
        this.setType = data.authorType;
        this.setTypeChange(this.setType);
        this.staffs = JSON.parse(data.departments);
        this.roles = JSON.parse(data.roles);
        const list: any[] = [];
        let obj: any = {
          name: this.appInfo.name,
          children: []
        }
        data.dataPermissionGroups
          .forEach((x, i) => {
            if (x.functionCode === x.schemaCode) {
              obj.key = x.functionCode
              obj.children.push(this.convert(x, i));

            } else {
              const key = x.functionCode;
              let group = list.find((y: any) => y.key === key);
              if (!group) {
                group = {
                  key,
                  name: x.functionName,
                  children: []
                };
                list.push(group);
              }
              group.children.push(this.convert(x, i));
            }
          });
        //当模型没有分组时，取应用名称作为模型的分组 并且要把他们归并到一个组
        if(obj.children.length > 0){
          list.unshift(obj)
        }
        this.list = list
      }
    });
  }

  convert(x: BPM.System.AppFunctionPermissionModel, i: number) {
    return {
      id: x.id || x.schemaCode + i,
      key: x.id || x.schemaCode + i,
      edit: false,
      name: x.schemaName || x.functionName,
      functionCode: x.functionCode,
      schemaCode: x.schemaCode,
      visible: x.visible,
      filterType: x.filterType,
      conditions: x.conditions,
      dataPermissionType: x.dataPermissionType,
      nodeType: x.nodeType,
      actionPermission: {
        creatable: x.creatable,
        deletable: x.deletable,
        editable: x.editable,
        exportable: x.exportable,
        importable: x.importable,
        printAble: x.printAble
      }
    };
  }

  setField(record: any, key: string, value: any) {
    record.edit = true;
    record[key] = value;
  }

  actionPermissionSelect(item: any, key: string) {
    item.edit = true;
    item[key] = !item[key];
  }

  setAction(record: any, ap: any, key: string, value: any) {
    record.edit = true;
    ap[key] = value;
  }

  validate() {
    let valid = true;
    if (!/^[^ ]\S{0,50}/.test(this.name)) {
      this.$set(this.error, 'name', true);
      valid = false;
    } else {
      this.$set(this.error, 'name', false);
    }

    // if ((!this.staffs || !this.staffs.length)
    //   && (!this.roles || !this.roles.length)
    //   && !this.isExternalUser
    // ) {
    //   this.$set(this.error, 'staffs', true);
    //   this.$set(this.error, 'roles', true);
    //   this.$set(this.error, 'isExternalUser', true);
    //   valid = false;
    // } else {
    //   this.$set(this.error, 'staffs', false);
    //   this.$set(this.error, 'roles', false);
    //   this.$set(this.error, 'isExternalUser', false);
    // }
    if(this.setType === 0){
      if ((!this.staffs || !this.staffs.length)
              && !this.isExternalUser
      ) {
        this.$set(this.error, 'staffs', true);
        this.$set(this.error, 'isExternalUser', true);
        this.$set(this.error, 'roles', false);
        valid = false;
      } else {
        this.$set(this.error, 'staffs', false);
        this.$set(this.error, 'isExternalUser', false);
        this.$set(this.error, 'roles', false);
      }
    }else{
      if (!this.roles || !this.roles.length){
        this.$set(this.error, 'roles', true);
        this.$set(this.error, 'staffs', false);
        this.$set(this.error, 'isExternalUser', false);
        valid = false;
      } else {
        this.$set(this.error, 'roles', false);
        this.$set(this.error, 'staffs', false);
        this.$set(this.error, 'isExternalUser', false);
      }
    }
    return valid;
  }

  cancel() {
    this.$emit('cancel');
  }

  save() {
    if (!this.validate()) {
      return;
    }

    const params: any = {
      appCode: this.$route.params.appCode || this.appInfo.code,
      name: this.name,
      externalUser: this.isExternalUser
    };
    if(this.setType === 0){
      if (this.staffs && this.staffs.length) {
        params.departments = JSON.stringify(this.staffs.map((s: any) => ({
          id: s.id,
          name: s.name,
          unitType: s.unitType
        })));
      }
    }else{
      if (this.roles && this.roles.length) {
        params.roles = JSON.stringify(this.roles.map((r: any) => ({
          id: r.id,
          name: r.name
        })));
      }
    }


    if (this.groupId) {
      params.id = this.groupId;
    }else{
      params.id = '';
    }
    const map = (x: any, i: number) => {
      const temp = Object.assign({}, x, x.actionPermission);
      delete temp.actionPermission;
      if (!temp.conditions) {
        temp.conditions = null;
      }
      temp.id = temp.key !== temp.schemaCode + i ? temp.key : null;
      delete temp.key;
      delete temp.edit;
      return temp;
    };

    let list = this.list.filter(x => !x.children)
      .map(map);

    list = this.list
      .filter(x => x.children)
      .flatMap(x => x.children)
      // .filter(x => x.edit)
      .map(map).concat(list);

    for (let i = 0; i < list.length; i++) {
      let list_i = list[i];
      if (list_i.dataPermissionType === 4 && list_i.conditions) {
        for (let j = 0; j < list_i.conditions.length; j++) {
          let conditions_j = list_i.conditions[j];
          if ((conditions_j.operatorType == 11 || conditions_j.operatorType == 12) && typeof conditions_j.value === 'object') {
            list[i].conditions[j].value = JSON.stringify(conditions_j.value);
          }
        }
      }
    }

    params.dataPermissionGroups = list;

    if (!params.dataPermissionGroups.length) {
      delete params.dataPermissionGroups;
    }

    // 拦截表单设置了自定义但没有设置condition的情况
    if (params && params.dataPermissionGroups && params.dataPermissionGroups.length) {
      const hassNoConditionForms: Array<string | number> = [];
      params.dataPermissionGroups.map((item: any) => (item.dataPermissionType === 4 && !item.conditions ? hassNoConditionForms.push(item.name) : ''));
      // console.log(hassNoConditionForms);
      if (hassNoConditionForms.length) {
        // this.$message.error(`${hassNoConditionForms.join('、')}表单数据权限请设置`);
        this.$message.error(this.$t('languages.appSettings.PlzSelectFormPermission', { form: hassNoConditionForms.join('、') }));
        return;
      }
    }

    // const p = this.groupId
    //   ? permissionApi.updateGroup(params)
    //   : permissionApi.createGroup(params);
    const p = permissionApi.updateGroup(params);

    p.then((res) => {
      if (res.errcode === 0) {
        this.$message.success(this.$t('languages.appSettings.saveSuccessfully'));
        this.$emit('ok');
      } else {
        this.$message.error(res.errmsg);
      }
    });
  }

  /**
   * 选人控件placeholder多语言
   */
  placeHolderLang() {
    this.staffSelectorOpts.placeholder = this.$t('Languages.Apps.PlzSetOrgOrUser') as string;
  }

  mounted() {
    this.setColumns();
  }

  @Watch('$i18n.locale')
  onLanguageChange(l:string) {
    this.placeHolderLang();
    this.setColumns();
  }

  @Watch('record')
  rolesChange(val: any) {
    // console.log(val)
    if(val.conditions && val.conditions.length > 0){
      let condition=val.conditions;
      for(let i=0;i<condition.length;i++){
        if(condition[i].operatorType==11 || condition[i].operatorType==12){
          if((typeof condition[i].value) === 'string' ){
            this.record.conditions[i].value=JSON.parse(condition[i].value);
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.permission-group-form {
  // position: relative;
  min-height: 100%;
  // /deep/.ant-table-thead span {
  //   font-weight: 600;
  //   color: rgba(0,0,0,0.65);
  // }
  /deep/.ant-table-body {
    color: rgba(0,0,0,0.85);
  }
  .ant-drawer-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 52px;
    line-height: 52px;
    text-align: center;
    border-top: 1px solid #e8e8e8;
    background-color: #fff;
    .cancel-btn{
      margin-right: 16px;
    }
  }
  h4 {
    font-weight: 600;
    color: #000;
    margin-bottom: 16px;
    margin-top: 24px;

    &:first-child {
      margin-top: 0;
    }
  }

  a {
    color: @primary-color;
    font-size: 14px;
  }
  /deep/.ant-row-flex {
    margin: 20px 0;
    align-items: flex-start;
  }

  .ant-col-4 {
    display: flex;
    align-items: center;
    height: 32px;
    color: rgba(0,0,0,0.65);
  }
  .ant-col-20.checkbox {
    line-height: 32px;
  }
  .setting-groups {
    display: flex;
  }
  .error {
    /deep/.ant-select-selection,
    /deep/.h3-organization__label {
      border: 1px solid #f5222d;
    }

    & > .message {
      color: #f5222d;
      font-size: 12px;
    }
  }
}
.panel-content+.panel-content{
  margin-top: 16px;
}
.permission-group-panel-wrapper{
  margin: 0 14px 0 16px;
  border-top: 1px solid #E8E8E8;
  .permission-group-panel-item{
    margin: 16px 0;
    .item-title{
      font-weight:600;
      display: flex;
      flex-direction: row;
      flex-wrap: no-wrap;
      justify-content: space-between;
      align-items: center;
    }
  }
}
.panel-content .permission-group-panel-wrapper:last-of-type .permission-group-panel-item:last-of-type{
  margin-bottom: 0;
}
.permission-group-panel-wrapper:first-of-type{
  border-top: none;
}
.item-list{
  display: flex;
  flex-direction: row;
  flex-wrap: no-wrap;
  justify-content: flex-start;
  align-items: center;
  color:rgba(0,0,0,0.65);
  ul{
    margin-left: 16px;
    display: flex;
    flex-direction: row;
    flex-wrap: no-wrap;
    justify-content: flex-start;
    align-items: center;
    font-size: 12px;
    li{
      border:1px solid #ffffff;
      margin-right: 8px;
      padding: 1px 7px;
      cursor: pointer;
    }
    li.active{
      border:1px solid #17BC94;
      color:#17BC94;
      -webkit-border-radius: 4px;
      -moz-border-radius: 4px;
      -ms-border-radius: 4px;
      border-radius: 4px;
    }
  }
}
/deep/.h3-panel-header>span{
  font-weight: 600;
}
/deep/.item-title .ant-checkbox + span{
  padding-right: 0;
  color:rgba(0,0,0,0.85);
}
</style>

<style lang="less">
// 修改新增权限组 select 框之间的对齐问题，在scope不生效
.permission-group-form {
  .ant-select-allow-clear .ant-select-selection--multiple .ant-select-selection__rendered {
    margin-right: 11px !important;
  }

  .ant-select-selection--multiple .ant-select-selection__rendered {
    margin-left: 11px !important;
  }
}

// 表格每个 tr 的第一个 td样式
.permission-group-form table tr td:nth-of-type(1) {
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
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
