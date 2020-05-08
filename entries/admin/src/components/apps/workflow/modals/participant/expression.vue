<template>
  <a-radio-group
    v-model="findType"
    class="expression-group"
    @change="setExpress"
  >
    <h3>按经理查找</h3>
    <!-- 按经理查找 -->
    <a-radio :value="Manager.formula">
      <span class="middle">查找</span>
      <a-select
        v-model="Manager.param"
        placeholder="请选择"
        @change="selectParam($event,Manager)"
      >
        <a-select-option
          v-for="(item, idx) in ouOptions"
          :key="idx"
          :value="item.value"
        >{{ `${item.label}${ item.code ? '{'+item.code+'}' : '' }` }}</a-select-option>
      </a-select>
      <span class="middle">经理</span>
    </a-radio>
    <!-- 按部门经理查找 -->
    <a-radio :value="OUManager.formula" v-if="managerOptions.length">
      <span class="middle">查找</span>
      <a-select
        v-model="OUManager.param"
        placeholder="请选择"
        @change="selectParam($event,OUManager)"
      >
        <a-select-option
          v-for="(item, idx) in managerOptions"
          :key="idx"
          :value="item.value"
        >{{ `${item.label}${ item.code ? '{'+item.code+'}' : '' }` }}</a-select-option>
      </a-select>
      <span class="middle">部门经理</span>
    </a-radio>
    <!-- 按角色查找 -->
    <h3>按角色查找</h3>
    <a-radio :value="FindUserByRole.formula">
      <span class="middle">根据</span>
      <a-select
        v-model="FindUserByRole.param"
        placeholder="请选择"
        @change="selectParam($event,FindUserByRole)"
      >
        <a-select-option
          v-for="(item, idx) in options"
          :key="idx"
          :value="item.value"
        >{{ `${item.label}${ item.code ? '{'+item.code+'}' : '' }` }}</a-select-option>
      </a-select>
      <span class="middle">查找角色为</span>
      <role-select :defaultValue="FindUserByRole.role" @select="selectRole"></role-select>
      <span class="middle">的成员</span>
    </a-radio>
    <!-- 按组织架构查找 -->
    <h3>按组织架构查找</h3>
    <a-radio :value="FindUserByOrg.formula">
      <span class="middle">查找</span>
      <div class="selector-wrap">
        <staff-selector
          v-model="FindUserByOrg.param"
          :options="taffSelectorOpts"
          :disabled="selectorDisabled"
          @ok="onOK"
          @change="clearChoose"
        ></staff-selector>
      </div>
    </a-radio>
  </a-radio-group>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { State, Action, namespace } from 'vuex-class';
import Bus from '@/utils/bus';

import StaffSelector from '@cloudpivot/form/src/renderer/components/shared/staff-selector.vue';
import common from '@cloudpivot/common'

const WorkflowModule = namespace('Apps/Workflow');

@Component({
  name: 'Expression',
  components: {
    StaffSelector,
    RoleSelect: common.components.pc.RoleSelect
  }
})
export default class Expression extends Vue {
  @WorkflowModule.State('WorkflowDataItem') WorkflowDataItem: any;

  @Prop() value: any;

  /* 查找类型 */
  findType: string = '';

  /* 按经理查找 */
  Manager: any = {
    formula: 'Manager',
    param: ''
  };

  /* 按部门经理查找 */
  OUManager: any = {
    formula: 'OUManager',
    param: ''
  };

  /* 按角色查找 */
  FindUserByRole: any = {
    formula: 'FindUserByRole',
    param: '',
    role: ''
  };

  /* 按组织架构查找 */
  FindUserByOrg: any = {
    formula: 'FindUserByOrg',
    param: [],
  };

  // 选人控件配置项
  taffSelectorOpts = {
    selectOrg: true,
    selectUser: true,
    showModel: false,
    mulpitle: true,
    showSelect: true,
    placeholder: '请选择部门、人员'
  }

  // 选人控件是否禁用
  selectorDisabled: boolean = true;

  ouOptions: any[] = [{ label: '发起人部门', value: 'Originator.OU' }];

  // 数据项可选列表： 选人控件
  get options() {
    // const UserData = this.WorkflowDataItem.filter((item: Apps.Datamodel.ChildeDataItem) => `${item.propertyType}` === '5' && item.published).map((item: Apps.Datamodel.ChildeDataItem) => ({
    //   label: item.name,
    //   value: item.code,
    //   code: item.code
    // }));
    return [
      { label: '发起人', value: 'Originator' },
      { label: '发起人部门', value: 'Originator.OU' },
    ].concat(this.managerOptions);
  }

  // 部门经理
  get managerOptions() {
    const UserData = this.WorkflowDataItem.filter((item: Apps.Datamodel.ChildeDataItem) => `${item.propertyType}` === '5' && item.published).map((item: Apps.Datamodel.ChildeDataItem) => ({
      label: item.name,
      value: item.code,
      code: item.code
    }));
    // NOTE：筛选出子表中的选人控件进行展示
    const childSheets = this.WorkflowDataItem.filter((item: Apps.Datamodel.ChildeDataItem) => `${item.propertyType}` === '8' && item.published);
    childSheets.forEach((item: any) => {
      if (item.subSchema && item.subSchema.properties) {
        item.subSchema.properties.forEach((subItem: any) => {
          if (`${subItem.propertyType}` === '5' && subItem.published) {
            UserData.push({
              label: `${item.name}.${subItem.name}`,
              value: `${item.code}.${subItem.code}`,
              code: `${item.code}.${subItem.code}`
            });
          }
        });
      }
    });
    return UserData;
  }

  mounted() {
    if (/^\[.*\]$/.test(this.value.expression)) {
      this.judgeOrgType(this.value.expression);
    }
    if (!this.value.expression || !/^([a-zA-Z]+)\((.+?)\)$/.test(this.value.expression)) {
      // Bus.$emit('changeFormulaRole', '');
      return;
    }
    this.judgeType(this.value.expression);
  }

  judgeType(ctx: string) {
    const arr: any = ctx.match(/^([a-zA-Z]+)\((.+?)\)$/);
    if (!Array.isArray(arr) || arr.length < 3) {
      return;
    }
    const [none, formula, param] = arr;
    this.findType = formula;
    if (formula === 'FindUserByRole') {
      const role = param.split(',')[1].replace(/"/g, '');
      this.$set(this, `${formula}`, {
        formula,
        param: param.split(',')[0].replace(/[{}]/g, ''),
        role
      });
      // Bus.$emit('changeFormulaRole', this.FindUserByRole.role);
    } else if (formula === 'OUManager' && param === '{Originator.OU}') {
      // Manager函数变为OUManager函数，且Manager只存在发起人部门
      this.findType = 'Manager';
      this.$set(this, 'Manager', {
        formula: 'Manager',
        param: param.replace(/[{}]/g, ''),
      });
      // Bus.$emit('changeFormulaRole', '');
    } else {
      this.$set(this, `${formula}`, {
        formula,
        param: param.replace(/[{}]/g, ''),
      });
      // Bus.$emit('changeFormulaRole', '');
    }
  }

  // 初始化，按组织架构查找数据
  judgeOrgType(expression: any) {
    const data = JSON.parse(expression);
    this.findType = 'FindUserByOrg';
    this.selectorDisabled = false;
    this.$set(this, 'FindUserByOrg', {
      formula: 'FindUserByOrg',
      param: data,
    });
    // Bus.$emit('changeFormulaRole', '');
  }

  selectParam(value: string, target: any) {
    this.$set(target, 'param', value);
    this.setExpress();
  }

  selectRole(value: any[]) {
    const roleCode = value.length ? value[0].code : '';
    this.FindUserByRole.role = roleCode;
    this.findType = 'FindUserByRole';
    this.setExpress();
  }

  setExpress() {
    this.$nextTick(() => {
      const vm: any = this;
      vm.selectorDisabled = vm.findType !== 'FindUserByOrg';
      const _res: any = vm[`${this.findType}`];
      let _express: string = `${_res.formula}()`;
      if (_res && _res.param) {
        if (this.findType === 'FindUserByRole' && _res.role) {
          _express = `${_res.formula}({${_res.param}},"${_res.role}")`;
        } else if (this.findType === 'FindUserByOrg') {
          _express = _res.param.map((d: any) => ({
            id: d.id,
            name: d.name,
            type: d.type,
          }));
        } else {
          // 按经理查找和按部门经理查找都改为OUManager函数
          _express = `OUManager({${_res.param}})`;
        }
      }
      console.log('表达式结果：', _express);
      this.$emit('input', { ...this.value, expression: _express });
    });
  }

  // 选人控件弹窗确定事件
  onOK(item: any) {
    console.log(item);
    const selectorArray = item.map((d: any) => ({
      id: d.id,
      name: d.name,
      type: d.type,
    }));
    this.FindUserByOrg.param = selectorArray;
    this.findType = 'FindUserByOrg';
    this.setExpress();
  }

  // 选人控件清空事件
  clearChoose() {
    this.setExpress();
  }
}
</script>
<style lang="less" scoped>
.expression-group {
  // height: 492px;
  /deep/.ant-radio-wrapper {
    display: block;
    margin-bottom: 16px;
    .middle {
      margin-top: 4px;
    }
    .selector-wrap {
      display: inline-block;
      margin-left: 16px;
      width: 100%;
      vertical-align: middle;
      max-width: 575px;
      max-height: 160px;
    }
  }
  /deep/.ant-select,
  /deep/.ant-cascader-picker,
  /deep/.role-selector__input {
    width: 200px;
    margin: 0 8px;
    vertical-align: middle;
  }
  /deep/.h3-organization {
    &,
    .h3-organization__label {
      min-height: 32px;
      max-height: inherit;
      padding-bottom: 0;
    }
  }
  h3 {
    margin-bottom: 16px;
    font-size: 16px;
    font-family: PingFangSC-Medium;
    font-weight: 500;
    color: rgba(0, 0, 0, 0.85);
    line-height: 24px;
    &:last-of-type {
      margin-top: 40px;
    }
  }
}
</style>
